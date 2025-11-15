import { ApplicationStage } from '../../ApplicationProgress/types';
import { StageSnapshot } from '../types';
import { STATUS_COLORS, STAGE_META } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface StageRailProps {
  stages: StageSnapshot[];
  selectedStageId: ApplicationStage | null;
  onSelectStage: (stageId: ApplicationStage) => void;
}

export const StageRail = ({ stages, selectedStageId, onSelectStage }: StageRailProps) => {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-50">阶段导航</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">共 {stages.length} 步</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-4 pr-2">
          {stages.map((stage) => {
            const meta = STAGE_META[stage.id];
            const isActive = stage.id === selectedStageId;
            const statusClass = STATUS_COLORS[stage.status] ?? STATUS_COLORS.not_started;

            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={`min-w-[220px] rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/70 shadow-lg shadow-blue-500/10 dark:border-blue-400/80 dark:bg-blue-900/20'
                    : 'border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{meta.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2">{meta.description}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                    {mapStatusLabel(stage.status)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 transition-all"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span>完成 {stage.progress}%</span>
                    {stage.blockingReason && (
                      <span className="text-rose-500 dark:text-rose-300">有阻塞</span>
                    )}
                  </div>
                </div>
                {stage.owner && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="truncate">{stage.owner}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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

