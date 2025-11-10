import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
} from 'lucide-react';

import {
  TAX_CALENDAR,
  TAX_KPIS,
  TAX_TASKS,
} from '../data';

const trendIconMap = {
  up: <ArrowUpRight className="h-4 w-4 text-emerald-500" />,
  down: <ArrowDownRight className="h-4 w-4 text-rose-500" />,
  steady: <CalendarClock className="h-4 w-4 text-blue-500" />,
} as const;

const statusColorMap: Record<string, string> = {
  待处理: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  处理中: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const priorityColorMap = {
  high: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
} as const;

const taskStatusBadge: Record<string, string> = {
  待办: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  进行中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  待审批: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export const FinanceTaxTab = () => {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TAX_KPIS.map((kpi) => (
          <div key={kpi.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  kpi.trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : kpi.trend === 'down'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                }`}
              >
                {trendIconMap[kpi.trend]}
                {kpi.delta}
              </span>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{kpi.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">税务申报日历</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">聚焦增值税、企业所得税、个人所得税的关键节点</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <FileText className="h-3.5 w-3.5" />
            导出日程
          </button>
        </div>
        <div className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
          {TAX_CALENDAR.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                  <span className="text-xs font-medium">{item.taxType}</span>
                  <span className="text-sm font-semibold">{item.date}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">责任人：{item.owner}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusColorMap[item.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {item.status === '已完成' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CalendarCheck className="h-3.5 w-3.5" />}
                  {item.status}
                </span>
                {item.actions?.map((action) => (
                  <button
                    key={action}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                    onClick={() => console.info('[FinanceSuite] 税务日历动作', item.id, action)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">税务任务中心</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">追踪资料收集、审批与申报进度</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <ClipboardList className="h-3.5 w-3.5" />
            新建税务任务
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TAX_TASKS.map((task) => (
            <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityColorMap[task.priority]}`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${taskStatusBadge[task.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {task.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">责任人：{task.owner}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>截止：{task.dueDate}</span>
                <button
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  onClick={() => console.info('[FinanceSuite] 税务任务操作', task.id)}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  标记进度
                </button>
              </div>
              {task.notes && <p className="text-xs text-gray-500 dark:text-gray-400">备注：{task.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
