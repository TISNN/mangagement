import React from 'react';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  Calendar,
  DollarSign,
  FileText,
  Flame,
  Inbox,
  Layers,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';

interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  note?: string;
}

interface PipelineItem {
  id: string;
  title: string;
  author: string;
  stage: '草稿' | '待审核' | '待上架' | '已上线';
  updatedAt: string;
  tags: string[];
  audience: string[];
}

interface TaskItem {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: '未开始' | '进行中' | '已完成';
  type: '内容维护' | '活动运营' | '权限审核';
}

const METRICS: MetricCard[] = [
  { id: 'm1', label: '本月发布内容', value: '62', change: '+18%', trend: 'up', note: '较上月 52 篇' },
  { id: 'm2', label: '知识花园 GMV', value: '¥128,600', change: '+26%', trend: 'up', note: '单篇平均 ¥2160' },
  { id: 'm3', label: '平均评分', value: '4.7 / 5', change: '+0.2', trend: 'up', note: 'Top10 文档达 4.9' },
  { id: 'm4', label: '审核 SLA', value: '19h', change: '-3h', trend: 'up', note: '目标 24h 内完成' },
];

const PIPELINE: PipelineItem[] = [
  {
    id: 'p1',
    title: '2025 北美 CS 申请全流程指南',
    author: '王欣然',
    stage: '待上架',
    updatedAt: '2025-11-08 10:35',
    tags: ['留学案例', '进阶'],
    audience: ['顾问内部', '合作机构'],
  },
  {
    id: 'p2',
    title: 'IELTS 7.5 备考冲刺营课件更新',
    author: '培训团队',
    stage: '待审核',
    updatedAt: '2025-11-08 09:10',
    tags: ['语言培训', '课程包'],
    audience: ['学生可见'],
  },
  {
    id: 'p3',
    title: '高压家长沟通话术 Q&A',
    author: '张寒',
    stage: '已上线',
    updatedAt: '2025-11-07 19:45',
    tags: ['服务交付', '话术模板'],
    audience: ['顾问内部'],
  },
  {
    id: 'p4',
    title: '2025 Q1 B2B 产品培训大纲',
    author: '合作拓展部',
    stage: '草稿',
    updatedAt: '2025-11-06 21:20',
    tags: ['B 端培训'],
    audience: ['合作机构'],
  },
];

const TASKS: TaskItem[] = [
  { id: 't1', title: '整理 11 月案例精选专题', owner: '市场运营', due: '11-10', status: '进行中', type: '活动运营' },
  { id: 't2', title: '审核 6 篇学生专区投稿', owner: '审核小组 A', due: '11-09', status: '未开始', type: '权限审核' },
  { id: 't3', title: '更新《签证文档包》版本 2.1', owner: '服务质控', due: '11-11', status: '未开始', type: '内容维护' },
  { id: 't4', title: '复盘知识花园双十一活动', owner: '知识营收组', due: '11-15', status: '未开始', type: '活动运营' },
];

const trendIcon = (trend: MetricCard['trend']) => {
  if (trend === 'up') {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  }
  if (trend === 'down') {
    return <ArrowUpRight className="h-4 w-4 rotate-180 text-rose-500" />;
  }
  return <Activity className="h-4 w-4 text-gray-400" />;
};

const stageStyles: Record<PipelineItem['stage'], string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  待审核: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  待上架: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  已上线: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const statusBadge: Record<TaskItem['status'], string> = {
  未开始: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  进行中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  已完成: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const typeIcon = (type: TaskItem['type']) => {
  switch (type) {
    case '内容维护':
      return <FileText className="h-3.5 w-3.5" />;
    case '活动运营':
      return <Flame className="h-3.5 w-3.5" />;
    case '权限审核':
    default:
      return <ShieldCheck className="h-3.5 w-3.5" />;
  }
};

const KnowledgeHubDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">知识中心概览</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Knowledge Hub Dashboard · 内容生产与知识花园运营全景</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            汇总个人、团队与知识花园的核心数据，帮助你快速把握内容产出节奏、审核 SLA 与变现成效，及时发现需要跟进的事项。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <UploadCloud className="h-4 w-4" />
            新建知识文档
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            发布到知识花园
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.label}</span>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {trendIcon(metric.trend)}
              <span
                className={
                  metric.trend === 'down'
                    ? 'text-rose-500 dark:text-rose-400'
                    : metric.trend === 'up'
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
              {metric.note && <span className="text-gray-400 dark:text-gray-500">· {metric.note}</span>}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">生产管道</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">追踪草稿 → 审核 → 上架 → 变现的完整流程。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Layers className="h-3.5 w-3.5" /> 查看全部
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {PIPELINE.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <span>{item.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageStyles[item.stage]}`}>{item.stage}</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">更新 {item.updatedAt}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1"><BookMarked className="h-3 w-3" /> 作者：{item.author}</span>
                    <span className="inline-flex items-center gap-1"><Inbox className="h-3 w-3" /> 受众：{item.audience.join(' · ')}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                    {item.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <Target className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      <MessageSquare className="h-3.5 w-3.5" /> 协同处理
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5" /> 推送至花园
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">知识花园收益趋势</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">按内容类型拆解 GMV 与付费转化率。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <DollarSign className="h-3.5 w-3.5" /> 导出报表
              </button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                {[{ label: '课程包订阅', value: '¥56,200', trend: '+32%' }, { label: '单篇付费', value: '¥38,400', trend: '+18%' }, { label: '企业授权', value: '¥22,900', trend: '+6%' }, { label: '打赏/小额付费', value: '¥11,100', trend: '+12%' }].map((item) => (
                  <div key={item.label} className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="mt-1 text-xs text-indigo-400 dark:text-indigo-300">环比变化 {item.trend}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Top5 畅销内容</div>
                <ul className="mt-3 space-y-2 text-xs leading-5">
                  <li>1. 《北美说明会实战话术合集》 · ¥12,800 GMV · 转化率 31%</li>
                  <li>2. 《IELTS 21 天冲刺营》 · ¥9,900 GMV · 复购率 18%</li>
                  <li>3. 《B2B 产品培训：企业版》 · ¥8,600 GMV · 企业授权 6 家</li>
                  <li>4. 《服务风险案例拆解》 · ¥7,400 GMV · 内训评分 4.9</li>
                  <li>5. 《文书模板库 2025 Edition》 · ¥6,300 GMV · 订阅 210 人</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">待办事项</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">跨团队内容维护与运营任务。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Calendar className="h-3.5 w-3.5" /> 任务日历
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {TASKS.map((task) => (
                <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300`}>
                        {typeIcon(task.type)} {task.type}
                      </span>
                      <span>{task.title}</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge[task.status]}`}>{task.status}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>责任人：{task.owner}</span>
                    <span>截止：{task.due}</span>
                  </div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      <MessageSquare className="h-3.5 w-3.5" /> 协作讨论
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5" /> 快速处理
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">实时通知</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">来自知识花园与团队空间的提醒。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Activity className="h-3.5 w-3.5" /> 查看全部
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300 leading-5">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                <strong>审核提醒</strong> · 3 篇学生专区内容等待确认（平均排队 4.2h），请在 SLA 前处理。
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                <strong>收益预警</strong> · 《IELTS 冲刺营》订阅本周转化下降 8%，建议追加促销活动。
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-300">
                <strong>知识到期</strong> · 5 篇 B 端授权资料将在 11/20 过期，请负责人提前更新或下线。
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHubDashboardPage;