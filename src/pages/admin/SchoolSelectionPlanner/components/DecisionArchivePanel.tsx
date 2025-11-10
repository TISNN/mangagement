import { Download, NotebookPen } from 'lucide-react';

import type { DecisionSnapshot } from '../types';
import { CandidateBadge, ICON_COLOR_MAP, SectionHeader } from './shared';

interface DecisionArchivePanelProps {
  snapshots: DecisionSnapshot[];
}

export const DecisionArchivePanel = ({ snapshots }: DecisionArchivePanelProps) => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="决策档案"
        description="保留每次方案调整与会议纪要，便于追踪与复盘。"
        action={(
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600">
            <Download className="h-3.5 w-3.5" />
            导出全部档案
          </button>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {snapshots.map((snapshot) => (
          <div key={snapshot.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{snapshot.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{snapshot.date} · {snapshot.author}</div>
              </div>
              <CandidateBadge value={snapshot.id.toUpperCase()} accent="indigo" />
            </div>
            <p className="mt-3 leading-6 text-sm text-gray-600 dark:text-gray-300">{snapshot.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {snapshot.attachments.map((file) => (
                <span key={file} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                  <NotebookPen className={`h-3.5 w-3.5 ${ICON_COLOR_MAP.indigo}`} />
                  {file}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
