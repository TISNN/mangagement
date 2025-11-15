import { AlertCircle, Loader2 } from 'lucide-react';
import { GlobalHeader } from './components/GlobalHeader';
import { MaterialsPanel } from './components/MaterialsPanel';
import { FormAssistantPanel } from './components/FormAssistantPanel';
import { StageRail } from './components/StageRail';
import { StageDetailPanel } from './components/StageDetailPanel';
import { useApplicationWorkstation } from './hooks/useApplicationWorkstation';

const ApplicationWorkstationPage = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    stageSnapshots,
    selectedStageId,
    setSelectedStageId,
    materials,
    formSnapshots,
    indicators,
    loading,
    error,
    refresh,
    choices
  } = useApplicationWorkstation();

  const activeStage = stageSnapshots.find((stage) => stage.id === selectedStageId) ?? stageSnapshots[0];
  const activeStageId = activeStage?.id ?? null;
  const stageMaterials = activeStage ? materials.filter((material) => material.stage === activeStage.id) : [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Application Station
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          申请工作台 · 阶段一体化
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
          从学生切换、阶段矩阵到材料与网申助手，全流程集中在单一工作面板。所有数据实时同步 Supabase 表，支持随时刷新与错峰协作。
        </p>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-100">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <GlobalHeader
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={setSelectedStudentId}
        indicators={indicators}
        loading={loading}
        onRefresh={refresh}
      />

      <StageRail
        stages={stageSnapshots}
        selectedStageId={selectedStageId}
        onSelectStage={setSelectedStageId}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <StageDetailPanel
          stage={activeStage}
          loading={loading}
          choices={choices}
          stageMaterials={stageMaterials}
        />
        <div className="space-y-6">
          <MaterialsPanel materials={materials} />
          {activeStageId === 'submission' && <FormAssistantPanel forms={formSnapshots} />}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-x-0 bottom-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-500 shadow-lg shadow-slate-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span>同步最新数据...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationWorkstationPage;

