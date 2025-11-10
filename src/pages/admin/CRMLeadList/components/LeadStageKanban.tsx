import React, { useMemo } from 'react';
import { KanbanSquare, Users } from 'lucide-react';

import type { LeadRecord, LeadStage } from '../types';
import { scoreColor } from '../utils';

interface LeadStageKanbanProps {
  leads: LeadRecord[];
}

const stageOrder: LeadStage[] = ['新增', '初次沟通', '深度沟通', '合同拟定', '签约'];

const LeadStageKanban: React.FC<LeadStageKanbanProps> = ({ leads }) => {
  const stageColumns = useMemo(
    () =>
      stageOrder.map((stage) => ({
        stage,
        items: leads.filter((lead) => lead.stage === stage),
      })),
    [leads],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">阶段看板预览</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">按阶段整理线索，可拖拽调整阶段（静态示例）。</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
          <KanbanSquare className="h-3.5 w-3.5" /> 打开看板
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stageColumns.map((column) => (
          <div key={column.stage} className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{column.stage}</span>
              <span>{column.items.length} 个</span>
            </div>
            <div className="mt-2 space-y-2">
              {column.items.map((item) => (
                <div key={item.id} className="rounded-lg bg-white p-3 text-xs text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                    <span className={`text-xs font-semibold ${scoreColor(item.score)}`}>{item.score}</span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400">{item.project}</div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                    <Users className="h-3 w-3" /> {item.owner}
                  </div>
                </div>
              ))}
              {column.items.length === 0 && (
                <div className="rounded-lg border border-gray-200 p-3 text-center text-[11px] text-gray-400 dark:border-gray-700 dark:text-gray-500">
                  暂无线索
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadStageKanban;
