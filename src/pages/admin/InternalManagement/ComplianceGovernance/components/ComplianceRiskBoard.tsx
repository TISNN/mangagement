import { AlertTriangle, CalendarDays, CheckCircle } from 'lucide-react';

import type { ComplianceRisk } from '../../types';

interface ComplianceRiskBoardProps {
  risks: ComplianceRisk[];
}

const LEVEL_COLORS: Record<ComplianceRisk['level'], string> = {
  严重: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-200',
  高: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/30 dark:text-amber-200',
  中: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/30 dark:text-blue-200',
  低: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/30 dark:text-emerald-200',
};

const STATUS_ICON: Record<ComplianceRisk['status'], JSX.Element> = {
  处理中: <AlertTriangle className="h-3.5 w-3.5" />,
  待确认: <CalendarDays className="h-3.5 w-3.5" />,
  已完成: <CheckCircle className="h-3.5 w-3.5" />,
};

export const ComplianceRiskBoard: React.FC<ComplianceRiskBoardProps> = ({ risks }) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {risks.map((risk) => (
        <div key={risk.id} className={`rounded-2xl border p-4 shadow-sm ${LEVEL_COLORS[risk.level]}`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{risk.title}</span>
                <span className="rounded-full bg-white/70 px-2 py-1 text-xs text-current dark:bg-white/10">
                  {risk.area}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-80">负责人：{risk.owner}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 font-semibold text-current dark:bg-white/10">
                {risk.level}风险
              </span>
              <span>截至：{risk.dueDate}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-current dark:bg-white/10">
              {STATUS_ICON[risk.status]}
              {risk.status}
            </span>
            {risk.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/40 px-2.5 py-1 text-current dark:bg-white/10">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

