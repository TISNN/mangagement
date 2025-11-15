import { useCallback, useEffect, useMemo, useState } from 'react';
import { isWithinInterval, addDays, parseISO, format } from 'date-fns';
import { supabase } from '../../../../lib/supabase';
import { useApplicationOverviews } from '../../ApplicationProgress/hooks/useApplications';
import applicationService from '../../ApplicationProgress/services/applicationService';
import {
  ApplicationDocument,
  ApplicationStage,
  FinalUniversityChoice,
  StudentProfile
} from '../../ApplicationProgress/types';
import {
  FormSnapshot,
  FormFieldHighlight,
  IndicatorCardData,
  MaterialRecord,
  StageSnapshot,
  StudentOption,
  StageStatus,
  StageTask
} from '../types';
import { STAGE_META, STAGE_ORDER } from '../constants';

interface StudentServiceRow {
  id: number;
  student_id: number;
  status?: string;
  progress?: number | string | null;
  enrollment_date?: string | null;
  end_date?: string | null;
  updated_at?: string | null;
  detail_data?: Record<string, unknown> | null;
  mentor?: {
    name?: string | null;
  } | null;
  service_type?: {
    name?: string | null;
  } | null;
}

interface StageMetrics {
  blockedStages: number;
  urgentDocuments: number;
  pendingForms: number;
  nextDeadlineLabel: string;
}

const createEmptyStages = (): StageSnapshot[] =>
  STAGE_ORDER.map((stage) => ({
    id: stage,
    name: STAGE_META[stage].label,
    description: STAGE_META[stage].description,
    status: 'not_started',
    progress: 0,
    tasks: [],
    files: [],
    formHighlights: []
  }));

export const useApplicationWorkstation = () => {
  const { overviews, loading: overviewLoading, error: overviewError } = useApplicationOverviews();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<ApplicationStage | null>(null);
  const [stageSnapshots, setStageSnapshots] = useState<StageSnapshot[]>(createEmptyStages());
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [formSnapshots, setFormSnapshots] = useState<FormSnapshot[]>([]);
  const [choices, setChoices] = useState<FinalUniversityChoice[]>([]);
  const [indicators, setIndicators] = useState<IndicatorCardData[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const students: StudentOption[] = useMemo(
    () =>
      overviews.map((item) => ({
        studentId: item.student_id,
        name: item.student_name,
        avatar: item.student_avatar,
        mentorName: item.mentor_name,
        nextDeadline: item.next_deadline ?? undefined,
        urgentCount: item.urgent_tasks?.length ?? 0,
        currentStage: deriveStageLabelFromProgress(item.overall_progress)
      })),
    [overviews]
  );

  useEffect(() => {
    if (overviews.length && !selectedStudentId) {
      setSelectedStudentId(overviews[0].student_id);
    }
  }, [overviews, selectedStudentId]);

  useEffect(() => {
    if (!stageSnapshots.length) return;
    if (!selectedStageId || !stageSnapshots.some((stage) => stage.id === selectedStageId)) {
      setSelectedStageId(stageSnapshots[0].id);
    }
  }, [stageSnapshots, selectedStageId]);

  const fetchStudentServices = useCallback(async (studentId: number): Promise<StudentServiceRow[]> => {
    try {
      const { data, error } = await supabase
        .from('student_services')
        .select(
          `
            id,
            student_id,
            status,
            progress,
            enrollment_date,
            end_date,
            updated_at,
            detail_data,
            service_type:service_type_id(name),
            mentor:mentor_ref_id(name)
          `
        )
        .eq('student_id', studentId)
        .order('updated_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.warn('[ApplicationWorkstation] 获取 student_services 失败:', error);
        return [];
      }

      return (data as StudentServiceRow[]) ?? [];
    } catch (err) {
      console.warn('[ApplicationWorkstation] fetchStudentServices 异常:', err);
      return [];
    }
  }, []);

  const loadStudentData = useCallback(
    async (studentId: number) => {
      setLoadingDetail(true);
      setDetailError(null);

      try {
        const [profile, choicesData, documents, services] = await Promise.all([
          applicationService.studentProfile.getProfileByStudentId(studentId),
          applicationService.universityChoice.getChoicesByStudentId(studentId),
          applicationService.document.getDocumentsByStudentId(studentId),
          fetchStudentServices(studentId)
        ]);

        const stageData = buildStageSnapshots(profile, choicesData, documents, services);
        const materialData = mapDocumentsToMaterials(documents);
        const formData = buildFormSnapshots(choicesData);
        const metrics = buildIndicators(stageData, materialData, formData);

        setStageSnapshots(stageData);
        setMaterials(materialData);
        setFormSnapshots(formData);
        setChoices(choicesData);
        setIndicators(metrics);

        if (!selectedStageId && stageData.length) {
          const activeStage = stageData.find((stage) => stage.status === 'in_progress')?.id ?? stageData[0].id;
          setSelectedStageId(activeStage);
        }
      } catch (err) {
        console.error('[ApplicationWorkstation] 加载学生数据失败:', err);
        setDetailError('加载申请工作台数据失败，请稍后重试');
      } finally {
        setLoadingDetail(false);
      }
    },
    [fetchStudentServices, selectedStageId]
  );

  useEffect(() => {
    if (selectedStudentId) {
      loadStudentData(selectedStudentId);
    }
  }, [selectedStudentId, loadStudentData]);

  const loading = overviewLoading || loadingDetail;
  const error = overviewError || detailError;

  const refresh = useCallback(() => {
    if (selectedStudentId) {
      loadStudentData(selectedStudentId);
    }
  }, [selectedStudentId, loadStudentData]);

  return {
    students,
    selectedStudentId,
    setSelectedStudentId,
    selectedStageId,
    setSelectedStageId,
    stageSnapshots,
    materials,
    formSnapshots,
    indicators,
    loading,
    error,
    refresh,
    choices
  };
};

function deriveStageLabelFromProgress(progress: number) {
  if (progress >= 80) return '录取决定';
  if (progress >= 60) return '面试阶段';
  if (progress >= 45) return '提交申请';
  if (progress >= 30) return '材料准备';
  if (progress >= 15) return '选校规划';
  return '背景评估';
}

function buildStageSnapshots(
  profile: StudentProfile | null,
  choices: FinalUniversityChoice[],
  documents: ApplicationDocument[],
  services: StudentServiceRow[]
): StageSnapshot[] {
  let stageList = createEmptyStages();
  stageList = mergeServiceData(stageList, services);

  return stageList.map((stage) => {
    const status = stage.status !== 'not_started' ? stage.status : inferStageStatus(stage.id, profile, choices, documents);
    const progress = Math.max(stage.progress, inferStageProgress(stage.id, profile, choices, documents));
    const tasks = pickStageTasks(stage.id, documents);
    const files = pickStageFiles(stage.id, profile);
    const formHighlights = pickFormHighlights(stage.id, choices);
    const blockingReason = stage.blockingReason ?? inferBlockingReason(stage.id, documents);

    return {
      ...stage,
      status,
      progress,
      tasks,
      files,
      formHighlights,
      blockingReason
    };
  });
}

function mergeServiceData(stages: StageSnapshot[], services: StudentServiceRow[]): StageSnapshot[] {
  if (!services.length) return stages;

  const cloned = [...stages];

  services.forEach((service) => {
    const detail = parseDetailData(service.detail_data);
    const stageKey = normalizeStageKey(detail?.stage_key ?? detail?.current_phase ?? service.service_type?.name);
    if (!stageKey) return;

    const targetIndex = cloned.findIndex((item) => item.id === stageKey);
    if (targetIndex === -1) return;

    const normalizedProgress = typeof service.progress === 'number'
      ? service.progress
      : Number.parseFloat(String(service.progress ?? '0')) || 0;

    cloned[targetIndex] = {
      ...cloned[targetIndex],
      status: mapServiceStatus(service.status, detail?.blocking_reason),
      progress: Math.min(100, Math.max(cloned[targetIndex].progress, normalizedProgress)),
      owner: detail?.owner_name || service.mentor?.name || cloned[targetIndex].owner,
      startDate: cloned[targetIndex].startDate ?? (service.enrollment_date ?? undefined),
      deadline: detail?.deadline ?? service.end_date ?? cloned[targetIndex].deadline,
      blockingReason: detail?.blocking_reason ?? cloned[targetIndex].blockingReason
    };
  });

  return cloned;
}

function parseDetailData(value: Record<string, unknown> | null | undefined) {
  if (!value) return undefined;
  if (typeof value === 'object') return value as Record<string, unknown>;
  try {
    return JSON.parse(String(value));
  } catch {
    return undefined;
  }
}

function normalizeStageKey(raw?: string | null): ApplicationStage | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes('evaluation') || lower.includes('背景')) return 'evaluation';
  if (lower.includes('school') || lower.includes('选校')) return 'schoolSelection';
  if (lower.includes('prep') || lower.includes('材料') || lower.includes('文书')) return 'preparation';
  if (lower.includes('submission') || lower.includes('网申') || lower.includes('提交')) return 'submission';
  if (lower.includes('interview') || lower.includes('面试')) return 'interview';
  if (lower.includes('decision') || lower.includes('录取')) return 'decision';
  if (lower.includes('visa') || lower.includes('行前')) return 'visa';
  return null;
}

function mapServiceStatus(status?: string | null, blockingReason?: unknown): StageStatus {
  if (!status) return blockingReason ? 'blocked' : 'in_progress';
  const normalized = status.toLowerCase();
  if (['completed', 'done', 'finished', '已完成'].some((key) => normalized.includes(key))) return 'completed';
  if (['blocked', 'risk', '暂停', '阻塞'].some((key) => normalized.includes(key))) return 'blocked';
  if (['paused', 'hold'].some((key) => normalized.includes(key))) return 'paused';
  if (['not', '未开始'].some((key) => normalized.includes(key))) return 'not_started';
  return blockingReason ? 'blocked' : 'in_progress';
}

function inferStageStatus(
  stage: ApplicationStage,
  profile: StudentProfile | null,
  choices: FinalUniversityChoice[],
  documents: ApplicationDocument[]
): StageStatus {
  switch (stage) {
    case 'evaluation':
      return profile ? 'completed' : 'in_progress';
    case 'schoolSelection':
      return choices.length ? 'in_progress' : 'not_started';
    case 'preparation':
      return documents.some((doc) => isCompleted(doc.status)) ? 'in_progress' : 'not_started';
    case 'submission':
      return documents.some((doc) => doc.status === '已提交') ? 'in_progress' : 'not_started';
    case 'interview':
      return choices.some((choice) => choice.notes?.includes('面试')) ? 'in_progress' : 'not_started';
    case 'decision':
      return choices.some((choice) => choice.decision_result) ? 'in_progress' : 'not_started';
    case 'visa':
      return documents.some((doc) => /签证|visa/i.test(doc.document_name)) ? 'in_progress' : 'not_started';
    default:
      return 'not_started';
  }
}

function inferStageProgress(
  stage: ApplicationStage,
  profile: StudentProfile | null,
  choices: FinalUniversityChoice[],
  documents: ApplicationDocument[]
): number {
  switch (stage) {
    case 'evaluation':
      return profile ? 100 : 30;
    case 'schoolSelection': {
      if (!choices.length) return 20;
      const finalized = choices.filter((choice) => choice.submission_status && choice.submission_status !== '未投递');
      return Math.min(100, (finalized.length / choices.length) * 100 || 40);
    }
    case 'preparation':
      return averageDocumentProgress(documents.filter((doc) => !/网申|visa|签证|面试/.test(doc.document_name ?? '')));
    case 'submission':
      return averageDocumentProgress(documents.filter((doc) => /网申|提交/i.test(doc.document_name ?? '') || doc.document_type === '网申'));
    case 'interview':
      return choices.some((choice) => choice.notes?.includes('面试')) ? 40 : 10;
    case 'decision':
      return Math.min(100, (choices.filter((choice) => choice.decision_result).length / Math.max(choices.length, 1)) * 100);
    case 'visa':
      return averageDocumentProgress(documents.filter((doc) => /签证|visa/i.test(doc.document_name ?? '')));
    default:
      return 0;
  }
}

function averageDocumentProgress(documents: ApplicationDocument[]): number {
  if (!documents.length) return 0;
  const total = documents.reduce((sum, doc) => sum + mapDocumentStatusToScore(doc.status), 0);
  return Math.round((total / documents.length) * 100);
}

function mapDocumentStatusToScore(status?: string | null) {
  if (!status) return 0.2;
  if (status.includes('已完成') || status.includes('已提交')) return 1;
  if (status.includes('进行中')) return 0.6;
  if (status.includes('待')) return 0.4;
  return 0.2;
}

function pickStageTasks(stage: ApplicationStage, documents: ApplicationDocument[]): StageTask[] {
  const relatedDocuments = documents.filter((doc) => normalizeStageKey(doc.document_type ?? doc.document_name) === stage);

  return relatedDocuments.slice(0, 3).map((doc) => ({
    id: `doc-${doc.id}`,
    title: doc.document_name,
    status: isCompleted(doc.status) ? 'done' : doc.status?.includes('进行') ? 'doing' : 'todo',
    owner: doc.notes ?? undefined,
    dueDate: doc.due_date ?? undefined,
    tags: doc.is_required ? ['必交'] : undefined
  }));
}

function pickStageFiles(stage: ApplicationStage, profile: StudentProfile | null) {
  const files = profile?.document_files ?? [];
  return files
    .filter((file) => normalizeStageKey(file.type ?? file.name) === stage)
    .slice(0, 3)
    .map((file, index) => ({
      id: `${stage}-file-${index}`,
      name: file.name,
      type: file.type,
      updatedAt: file.upload_date,
      url: file.url
    }));
}

function pickFormHighlights(stage: ApplicationStage, choices: FinalUniversityChoice[]): FormFieldHighlight[] {
  if (stage !== 'submission') return [];
  return choices.slice(0, 3).map((choice) => ({
    id: `choice-${choice.id}`,
    label: `${choice.school_name} Portal`,
    value: choice.application_account ? `${choice.application_account} / ${choice.application_password ?? '密码未填写'}` : '账号未填写',
    copiable: Boolean(choice.application_account)
  }));
}

function inferBlockingReason(stage: ApplicationStage, documents: ApplicationDocument[]) {
  if (stage !== 'preparation') return undefined;
  const overdueDoc = documents.find((doc) => doc.due_date && !isCompleted(doc.status) && isOverdue(doc.due_date));
  if (overdueDoc) {
    return `${overdueDoc.document_name} 已过期`;
  }
  return undefined;
}

function isCompleted(status?: string | null) {
  if (!status) return false;
  return status.includes('已完成') || status.includes('已提交');
}

function isOverdue(dateString: string) {
  try {
    const date = parseISO(dateString);
    return date.getTime() < Date.now();
  } catch {
    return false;
  }
}

function mapDocumentsToMaterials(documents: ApplicationDocument[]): MaterialRecord[] {
  return documents
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .map((doc) => ({
      id: `material-${doc.id}`,
      document: doc,
      stage: normalizeStageKey(doc.document_type ?? doc.document_name) ?? 'preparation',
      status: doc.status ?? '未开始',
      owner: doc.notes ?? undefined,
      deadline: doc.due_date ?? undefined,
      updatedAt: doc.updated_at ?? undefined,
      tags: doc.is_required ? ['必交'] : undefined
    }));
}

function buildFormSnapshots(choices: FinalUniversityChoice[]): FormSnapshot[] {
  return choices.map((choice) => ({
    id: `form-${choice.id}`,
    schoolName: choice.school_name,
    programName: choice.program_name,
    portalLink: choice.application_type,
    status: choice.submission_status ?? '未开始',
    fields: [
      {
        id: `account-${choice.id}`,
        label: '账号',
        value: choice.application_account ?? '未填写',
        copyable: Boolean(choice.application_account)
      },
      {
        id: `password-${choice.id}`,
        label: '密码',
        value: choice.application_password ? '********' : '未填写',
        copyable: Boolean(choice.application_password)
      },
      {
        id: `deadline-${choice.id}`,
        label: '截止日期',
        value: choice.application_deadline
          ? format(parseISO(choice.application_deadline), 'yyyy-MM-dd')
          : '未设置'
      }
    ]
  }));
}

function buildIndicators(
  stages: StageSnapshot[],
  materials: MaterialRecord[],
  forms: FormSnapshot[]
): IndicatorCardData[] {
  const metrics: StageMetrics = {
    blockedStages: stages.filter((stage) => stage.status === 'blocked').length,
    urgentDocuments: materials.filter(
      (material) =>
        material.deadline &&
        isWithinInterval(parseISO(material.deadline), { start: new Date(), end: addDays(new Date(), 2) }) &&
        !isCompleted(material.document.status)
    ).length,
    pendingForms: forms.filter((form) => !form.fields.some((field) => field.label === '账号' && field.value !== '未填写')).length,
    nextDeadlineLabel: materials[0]?.deadline
      ? `${materials[0].document.document_name} · ${format(parseISO(materials[0].deadline as string), 'MM-dd')}`
      : '暂无紧急截止'
  };

  return [
    {
      id: 'indicator-pending',
      label: '待补材料',
      value: String(metrics.urgentDocuments),
      description: '48 小时内到期',
      tone: metrics.urgentDocuments > 0 ? 'warning' : 'info'
    },
    {
      id: 'indicator-blocked',
      label: '阻塞阶段',
      value: String(metrics.blockedStages),
      description: metrics.blockedStages ? '需要立即处理' : '流程顺畅',
      tone: metrics.blockedStages ? 'danger' : 'success'
    },
    {
      id: 'indicator-forms',
      label: '待完善网申字段',
      value: String(metrics.pendingForms),
      description: '账号/密码缺失',
      tone: metrics.pendingForms ? 'warning' : 'info'
    },
    {
      id: 'indicator-deadline',
      label: '下一截止',
      value: materials[0]?.deadline ? format(parseISO(materials[0].deadline as string), 'MM-dd') : '—',
      description: metrics.nextDeadlineLabel,
      tone: 'info'
    }
  ];
}

