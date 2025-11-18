import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
} from 'lucide-react';

import { financeService } from '@/services/finance/financeService';

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
  const [taxKPIs, setTaxKPIs] = useState<any[]>([]);
  const [taxCalendar, setTaxCalendar] = useState<any[]>([]);
  const [taxTasks, setTaxTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTaxData = async () => {
      try {
        setIsLoading(true);
        
        // 加载税务任务和日历
        const [tasks, calendar] = await Promise.all([
          financeService.getAllTaxTasks(),
          financeService.getTaxCalendar()
        ]);
        
        // 格式化税务任务
        const formattedTasks = tasks.map((task: any) => ({
          id: `task-${task.id}`,
          title: task.title,
          owner: task.owner,
          priority: task.priority as 'high' | 'medium' | 'low',
          dueDate: task.due_date,
          status: task.status as '待办' | '进行中' | '待审批' | '已完成',
          notes: task.notes
        }));
        
        // 格式化税务日历
        const formattedCalendar = calendar.map((item: any) => ({
          id: `cal-${item.id}`,
          date: new Date(item.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
          taxType: item.tax_type as '增值税' | '企业所得税' | '个人所得税',
          title: item.title,
          owner: item.owner,
          status: item.status as '待处理' | '处理中' | '已完成',
          actions: item.actions || []
        }));
        
        setTaxTasks(formattedTasks);
        setTaxCalendar(formattedCalendar);
        
        // 计算税务 KPI（简化版本，实际应该从交易数据计算）
        setTaxKPIs([
          {
            id: 'vat-payable',
            label: '本月增值税应缴',
            value: '¥ 0',
            trend: 'up' as const,
            delta: '+0%',
            description: '含一般纳税人销项税额，建议关注进项抵扣凭证收集进度。',
          },
          {
            id: 'cit-forecast',
            label: '季度企业所得税预估',
            value: '¥ 0',
            trend: 'steady' as const,
            delta: '+0%',
            description: '按最新利润预测推算，需确认研发费用加计扣除资料是否齐备。',
          },
          {
            id: 'pit-withhold',
            label: '本月个税代扣',
            value: '¥ 0',
            trend: 'down' as const,
            delta: '-0%',
            description: '人员调整后，薪酬结构变化导致代扣下降。',
          },
          {
            id: 'compliance-score',
            label: '合规完成率',
            value: `${formattedTasks.filter(t => t.status === '已完成').length}/${formattedTasks.length}`,
            trend: 'up' as const,
            delta: '+0%',
            description: '申报资料及时上传，剩余任务集中在进项票认证。',
          },
        ]);
      } catch (error) {
        console.error('加载税务数据失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTaxData();
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taxKPIs.map((kpi) => (
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在加载税务日历...
            </div>
          ) : taxCalendar.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarClock className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">暂无税务日历数据</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前没有税务申报日历记录</p>
            </div>
          ) : (
            taxCalendar.map((item) => (
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
            ))
          )}
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
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在加载税务任务...
            </div>
          ) : taxTasks.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50/70 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
              <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">暂无税务任务</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前没有税务任务记录</p>
            </div>
          ) : (
            taxTasks.map((task) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};
