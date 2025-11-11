import { Briefcase, CalendarClock, MapPin } from 'lucide-react';

import type { PositionSummary } from '../data';

interface PositionOverviewProps {
  positions: PositionSummary[];
}

const PRIORITY_COLORS: Record<PositionSummary['priority'], string> = {
  高: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-200',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

const STATUS_COLORS: Record<PositionSummary['status'], string> = {
  开放中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  暂停中: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const PositionOverview: React.FC<PositionOverviewProps> = ({ positions }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">职位需求总览</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">掌握招聘进度、负责人与剩余编制。</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
          <Briefcase className="h-3.5 w-3.5" />
          当前开放 {positions.filter((pos) => pos.status === '开放中').length} 个职位
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {positions.map((position) => {
          const completion = Math.round((position.filled / position.headcount) * 100);

          return (
            <div key={position.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr,1fr,1fr,1fr]">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{position.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_COLORS[position.priority]}`}>
                    优先级 · {position.priority}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[position.status]}`}>
                    {position.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {position.department}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {position.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    开启于 {position.openedAt}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">负责人：{position.owner}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">编制进度</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all dark:bg-blue-400"
                      style={{ width: `${Math.min(completion, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {position.filled}/{position.headcount}
                  </span>
                </div>
                {position.budget ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">预算范围：{position.budget}</p>
                ) : null}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">当前阶段</p>
                <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-200">
                  {position.status === '开放中'
                    ? '候选人筛选进行中 · 请关注高优先级岗位的面试安排'
                    : position.status === '暂停中'
                      ? '等待业务侧确认岗位需求或预算调整'
                      : '招聘完成 · 候选人已进入入职流程'}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">操作建议</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:text-blue-200"
                    onClick={() => console.info('[PositionOverview] 查看职位详情', { positionId: position.id })}
                  >
                    查看详情
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:text-blue-200"
                    onClick={() => console.info('[PositionOverview] 调整面试流程', { positionId: position.id })}
                  >
                    调整流程
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:text-blue-200"
                    onClick={() => console.info('[PositionOverview] 同步需求变更', { positionId: position.id })}
                  >
                    同步业务方
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


