import React from 'react';
import { ArrowDownToLine, BarChart3, CalendarClock, Clock, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MatchInsightsPanelProps {
  total: number;
  averageMatchScore: number;
  internationalRatio: number;
  fullFundingRatio: number;
  nearestDeadline?: string;
  onExport: () => void;
  onSavePreset: () => void;
}

const MatchInsightsPanel: React.FC<MatchInsightsPanelProps> = ({
  total,
  averageMatchScore,
  internationalRatio,
  fullFundingRatio,
  nearestDeadline,
  onExport,
  onSavePreset,
}) => {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/70">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">匹配概览</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            当前共有 {total} 位教授符合筛选条件，可随时保存方案或导出清单与学生共享。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            className="bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={onSavePreset}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            保存筛选方案
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-500" onClick={onExport}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            导出教授清单
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide">
            <span>候选教授</span>
            <BarChart3 className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{total}</p>
          <p className="text-xs text-indigo-500/80">满足筛选条件的教授数量</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide">
            <span>平均匹配度</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{averageMatchScore}%</p>
          <p className="text-xs text-emerald-500/80">根据当前筛选条件计算出的平均分</p>
        </div>

        <div className="rounded-2xl bg-sky-50 p-4 text-sky-700 dark:bg-sky-500/10 dark:text-sky-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide">
            <span>国际学生友好</span>
            <Globe2 className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{Math.round(internationalRatio * 100)}%</p>
          <p className="text-xs text-sky-500/80">接受国际生的教授占比</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide">
            <span>全额资助</span>
            <CalendarClock className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{Math.round(fullFundingRatio * 100)}%</p>
          <p className="text-xs text-amber-500/80">
            {nearestDeadline ? `最近截止：${nearestDeadline}` : '覆盖全额奖学金的教授占比'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MatchInsightsPanel;

