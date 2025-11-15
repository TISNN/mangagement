import { MaterialRecord } from '../types';
import { STATUS_COLORS } from '../constants';
import { FileText, AlertTriangle } from 'lucide-react';

interface MaterialsPanelProps {
  materials: MaterialRecord[];
}

export const MaterialsPanel = ({ materials }: MaterialsPanelProps) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">材料中心</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">阶段内所有材料清单，支持一键总览</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {materials.length} 条
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {materials.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
            暂无材料记录
          </div>
        )}

        {materials.map((material) => {
          const statusClass = STATUS_COLORS[
            material.status.includes('完成') || material.status.includes('提交')
              ? 'completed'
              : material.status.includes('进行')
              ? 'in_progress'
              : 'not_started'
          ];

          return (
            <div
              key={material.id}
              className="rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-blue-200 dark:border-slate-800 dark:hover:border-blue-500/40"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-xl bg-blue-50 p-2 text-blue-500 dark:bg-blue-900/20 dark:text-blue-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {material.document.document_name}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                      {material.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    阶段 · {mapStageLabel(material.stage)} · {material.deadline ? `截止 ${material.deadline}` : '无截止'}
                  </p>
                </div>
              </div>

              {!isComplete(material.status) && material.deadline && isSoon(material.deadline) && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
                  <AlertTriangle className="h-4 w-4" />
                  <span>即将到期，请尽快补齐材料</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function mapStageLabel(stage: MaterialRecord['stage']) {
  switch (stage) {
    case 'evaluation':
      return '背景评估';
    case 'schoolSelection':
      return '选校规划';
    case 'preparation':
      return '材料准备';
    case 'submission':
      return '网申提交';
    case 'interview':
      return '面试阶段';
    case 'decision':
      return '录取决定';
    case 'visa':
      return '签证与行前';
    default:
      return '其他';
  }
}

function isSoon(dateString?: string) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const diff = date.getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 2;
}

function isComplete(status: string) {
  return status.includes('完成') || status.includes('提交');
}

