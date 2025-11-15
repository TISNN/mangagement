import { useState } from 'react';
import { FinalUniversityChoice } from '../../ApplicationProgress/types';
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  Copy,
  Paperclip,
  UserRound
} from 'lucide-react';
import { MaterialRecord, StageSnapshot } from '../types';
import { STATUS_COLORS } from '../constants';

interface StageDetailPanelProps {
  stage?: StageSnapshot;
  loading: boolean;
  choices: FinalUniversityChoice[];
  stageMaterials: MaterialRecord[];
}

export const StageDetailPanel = ({ stage, loading, choices, stageMaterials }: StageDetailPanelProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!stage) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 text-center text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-500">
        暂无阶段数据
      </div>
    );
  }

  const statusClass = STATUS_COLORS[stage.status] ?? STATUS_COLORS.not_started;
  const shouldShowChoices = stage.id === 'schoolSelection' || stage.id === 'submission';

  const handleCopy = async (value: string, id: string) => {
    if (!value || value === '未填写') return;
    await navigator.clipboard.writeText(value);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 1200);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-lg shadow-slate-500/5 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Stage Detail</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{stage.name}</h2>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
          {mapStatusLabel(stage.status)}
        </span>
      </div>

      {stage.blockingReason && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-100">
          <AlertTriangle className="h-4 w-4" />
          <span>{stage.blockingReason}</span>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <InfoCard
          title="负责人"
          icon={<UserRound className="h-4 w-4 text-blue-500" />}
          value={stage.owner ?? '未分配'}
        />
        <InfoCard
          title="时间规划"
          icon={<Calendar className="h-4 w-4 text-emerald-500" />}
          value={`${stage.startDate ?? '未设置'} → ${stage.deadline ?? '未设置'}`}
        />
      </div>

      <div className="mt-6 space-y-4">
        <Section title="关键任务" description="聚焦阶段阻塞点与负责人">
          {renderTaskList(stage)}
        </Section>
        <Section title="阶段文件" description="最近引用或上传的文件">
          {renderFiles(stage)}
        </Section>
        <Section title="相关材料" description="该阶段关联的材料与状态">
          {renderMaterialList(stageMaterials)}
        </Section>
        {stage.id === 'submission' && stage.formHighlights.length > 0 && (
          <Section title="网申字段摘录" description="复制账号/模板，快速填报">
            <div className="grid gap-3 md:grid-cols-2">
              {stage.formHighlights.map((field) => (
                <div key={field.id} className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-900/40">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{field.label}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 break-all">
                      {field.value}
                    </p>
                    {field.copiable && (
                      <button
                        onClick={() => handleCopy(field.value, field.id)}
                        className="inline-flex items-center gap-1 text-xs text-blue-500"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedField === field.id ? '已复制' : '复制'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
        {shouldShowChoices && (
          <Section
            title={stage.id === 'schoolSelection' ? '选校清单' : '最终投递同步'}
            description={stage.id === 'schoolSelection' ? '按优先级展示选校与当前状态' : '确认最终投递院校并与网申保持一致'}
          >
            {renderChoiceList(choices)}
          </Section>
        )}
      </div>

      {loading && (
        <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">阶段数据同步中...</div>
      )}
    </div>
  );
};

const InfoCard = ({
  title,
  icon,
  value
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="rounded-2xl border border-slate-100 px-4 py-3 dark:border-slate-800">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {icon}
      {title}
    </div>
    <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
  </div>
);

const Section = ({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
      <ClipboardList className="h-4 w-4 text-indigo-400" />
      {title}
    </div>
    {description && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{description}</p>}
    <div className="mt-3 space-y-2">{children}</div>
  </div>
);

function renderTaskList(stage: StageSnapshot) {
  if (!stage.tasks.length) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">暂无任务</p>;
  }

  return stage.tasks.map((task) => (
    <div
      key={task.id}
      className="flex items-center justify-between rounded-xl bg-slate-50/70 px-3 py-2 text-sm dark:bg-slate-900/30"
    >
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
        {task.dueDate && (
          <p className="text-xs text-slate-400 dark:text-slate-500">截止 {task.dueDate}</p>
        )}
      </div>
      <span
        className={`text-xs ${
          task.status === 'done' ? 'text-emerald-500' : task.status === 'doing' ? 'text-blue-500' : 'text-slate-400'
        }`}
      >
        {task.status === 'done' ? '完成' : task.status === 'doing' ? '进行中' : '待处理'}
      </span>
    </div>
  ));
}

function renderFiles(stage: StageSnapshot) {
  if (!stage.files.length) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">暂无文件</p>;
  }

  return stage.files.map((file) => (
    <div
      key={file.id}
      className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-sm shadow-sm dark:bg-slate-900/40"
    >
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <Paperclip className="h-4 w-4 text-blue-500" />
        <p>{file.name}</p>
      </div>
      {file.updatedAt && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{file.updatedAt}</span>
      )}
    </div>
  ));
}

function mapStatusLabel(status: StageSnapshot['status']) {
  switch (status) {
    case 'completed':
      return '已完成';
    case 'in_progress':
      return '进行中';
    case 'blocked':
      return '阻塞';
    case 'paused':
      return '暂停';
    default:
      return '未开始';
  }
}


function renderChoiceList(choices: FinalUniversityChoice[]) {
  if (!choices.length) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">暂无选校记录</p>;
  }

  return (
    <div className="space-y-3">
      {choices.map((choice) => (
        <div
          key={choice.id}
          className="rounded-2xl border border-slate-100 px-4 py-3 dark:border-slate-800"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {choice.school_name} · {choice.program_name || '未命名项目'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {choice.application_type ?? '未标记等级'} ·{choice.priority_rank ? ` 优先级 ${choice.priority_rank}` : ' 未排序'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                {choice.submission_status ?? '未投递'}
              </span>
              {choice.application_deadline && <span>截止 {choice.application_deadline}</span>}
            </div>
          </div>
          {choice.notes && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">备注：{choice.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function renderMaterialList(materials: MaterialRecord[]) {
  if (!materials.length) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">暂无关联材料</p>;
  }

  return (
    <div className="space-y-2">
      {materials.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-100 px-4 py-3 text-sm dark:border-slate-800"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{item.document.document_name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">负责人：{item.owner ?? '未指定'}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {item.status}
              </span>
              {item.deadline && <span className="text-slate-400 dark:text-slate-500">截止 {item.deadline}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
