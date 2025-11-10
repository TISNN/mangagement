import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';

interface GoalMetric {
  id: string;
  label: string;
  target: string;
  progress: number;
  forecast: string;
  trend: string;
  trendType: 'up' | 'down' | 'stable';
}

interface PersonalKPI {
  id: string;
  name: string;
  role: string;
  avatar: string;
  metrics: Array<{ label: string; value: string; target: string; trend: string }>;
  badge?: 'top' | 'rising';
}

interface FeedItem {
  id: string;
  type: 'announcement' | 'system' | 'commentary';
  author: string;
  avatar: string;
  time: string;
  visibility: 'team' | 'org';
  tags: string[];
  title: string;
  content: string;
  attachments?: string[];
  comments?: number;
  likes?: number;
}

interface CollaborationTask {
  id: string;
  title: string;
  department: string;
  requester: string;
  assignee: string;
  due: string;
  sla: string;
  status: '待处理' | '进行中' | '已完成';
  priority: '高' | '中' | '低';
  history: string[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  owner: string;
  version: string;
  usage: { views: number; rating: number; favorites: number };
  tags: string[];
}

interface TrainingEvent {
  id: string;
  title: string;
  type: string;
  start: string;
  end: string;
  location: string;
  host: string;
  status: '报名中' | '已满' | '回放';
  focus: string;
}

const GOAL_METRICS: GoalMetric[] = [
  { id: 'gm-1', label: 'Q4 签约目标达成率', target: '¥12,000,000', progress: 68, forecast: '预计达成 94%', trend: '+6.2% 环比', trendType: 'up' },
  { id: 'gm-2', label: '续约率', target: '85%', progress: 72, forecast: '预测 82%', trend: '+3.8pt', trendType: 'up' },
  { id: 'gm-3', label: '回款达成率', target: '¥8,500,000', progress: 61, forecast: '预计达成 88%', trend: '-2.1% 环比', trendType: 'down' },
  { id: 'gm-4', label: '客户满意度（CSAT）', target: '4.7 / 5', progress: 83, forecast: '预测 4.6', trend: '+0.3', trendType: 'up' },
];

const KPI_CARDS: PersonalKPI[] = [
  {
    id: 'kpi-1',
    name: '赵婧怡',
    role: '销售顾问 · 北美组',
    avatar: 'https://i.pravatar.cc/150?img=5',
    metrics: [
      { label: '本月签约金额', value: '¥860k', target: '目标 720k', trend: '+18%' },
      { label: '跟进完成率', value: '94%', target: '目标 90%', trend: '+4pt' },
      { label: '客户满意度', value: '4.9', target: '目标 4.6', trend: '+0.2' },
    ],
    badge: 'top',
  },
  {
    id: 'kpi-2',
    name: '王磊',
    role: '市场运营 · Campaign',
    avatar: 'https://i.pravatar.cc/150?img=12',
    metrics: [
      { label: '活动报名数', value: '312', target: '目标 280', trend: '+9%' },
      { label: '线索转化率', value: '27%', target: '目标 25%', trend: '+1.5pt' },
      { label: '内容上线效率', value: '96%', target: '目标 92%', trend: '+2pt' },
    ],
    badge: 'rising',
  },
  {
    id: 'kpi-3',
    name: '张寒',
    role: '客服主管 · 服务团队',
    avatar: 'https://i.pravatar.cc/150?img=25',
    metrics: [
      { label: '工单一次解决率', value: '89%', target: '目标 86%', trend: '+2pt' },
      { label: '响应时长', value: '12m', target: '目标 15m', trend: '-3m' },
      { label: '满意度', value: '4.7', target: '目标 4.5', trend: '+0.1' },
    ],
  },
];

const FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'announcement',
    author: '刘珂 · 销售经理',
    avatar: 'https://i.pravatar.cc/150?img=45',
    time: '2 小时前',
    visibility: 'org',
    tags: ['#Strategy', '#季度目标'],
    title: 'Q4 北美市场攻坚计划发布',
    content: '已在知识库同步新版作战手册，重点聚焦高价值院校的案例打法与折扣审批流程优化，请相关团队本周内阅读确认。',
    attachments: ['Q4-NorthAmerica-Playbook.pdf'],
    comments: 12,
    likes: 38,
  },
  {
    id: 'feed-2',
    type: 'system',
    author: '系统通知',
    avatar: 'https://i.pravatar.cc/150?img=66',
    time: '今天 10:15',
    visibility: 'team',
    tags: ['#合同', '#风险预警'],
    title: '合同 C-20251108-13 审批逾期提醒',
    content: '负责团队：北美销售一部；SLA 超时 6 小时。请核对审批节点并在 2 小时内更新进度。',
    comments: 3,
    likes: 9,
  },
  {
    id: 'feed-3',
    type: 'commentary',
    author: '市场活动协同群',
    avatar: 'https://i.pravatar.cc/150?img=22',
    time: '昨天 19:20',
    visibility: 'team',
    tags: ['#市场活动', '#协同'],
    title: '北美说明会素材需求已完成',
    content: '素材包与报名页已上线，访问路径：Marketing Cloud / Campaign / 2025-NA-Roadshow。欢迎销售团队提供演讲反馈。',
    attachments: ['设计稿.fig', '报名页链接'],
    comments: 6,
    likes: 21,
  },
];

const COLLAB_TASKS: CollaborationTask[] = [
  {
    id: 'task-1',
    title: '申请市场部制作 MIT 录取海报',
    department: '市场运营',
    requester: '赵婧怡',
    assignee: '王磊',
    due: '2025-11-10',
    sla: '72h 内交付',
    status: '进行中',
    priority: '高',
    history: ['2025-11-07 09:30 提交需求', '2025-11-07 10:05 市场部确认需求', '2025-11-08 14:00 设计初稿完成'],
  },
  {
    id: 'task-2',
    title: '请求客服参与高风险客户沟通',
    department: '客服支持',
    requester: '丁若楠',
    assignee: '张寒',
    due: '2025-11-09',
    sla: '48h 内响应',
    status: '待处理',
    priority: '中',
    history: ['2025-11-08 11:20 提交，附上通话记录'],
  },
  {
    id: 'task-3',
    title: '折扣审批：北美说明会报名双人套餐',
    department: '管理层审批',
    requester: '王磊',
    assignee: '刘珂',
    due: '2025-11-08',
    sla: '24h 内完成',
    status: '已完成',
    priority: '高',
    history: ['2025-11-07 15:50 提交审批', '2025-11-07 16:40 补充案例证明', '2025-11-07 18:10 批准并通知销售团队'],
  },
];

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: '北美高价值院校案例打法 3.0',
    category: '成功案例',
    updatedAt: '2025-11-07',
    owner: '合规审核：陈航',
    version: 'v3.0',
    usage: { views: 186, rating: 4.8, favorites: 46 },
    tags: ['#北美', '#案例打法', '#高价值'],
  },
  {
    id: 'kb-2',
    title: '高压家长沟通话术模板（含风险提醒）',
    category: '话术脚本',
    updatedAt: '2025-11-06',
    owner: '客服团队 · 张寒',
    version: 'v1.6',
    usage: { views: 254, rating: 4.6, favorites: 63 },
    tags: ['#话术', '#风险客户'],
  },
  {
    id: 'kb-3',
    title: '合同折扣审批标准流程（内控版）',
    category: '流程手册',
    updatedAt: '2025-11-05',
    owner: '法务 · 宋意',
    version: 'v2.1',
    usage: { views: 198, rating: 4.9, favorites: 72 },
    tags: ['#合同', '#审批', '#法务'],
  },
];

const TRAINING_EVENTS: TrainingEvent[] = [
  {
    id: 'train-1',
    title: '2025 Q4 北美市场攻坚训练营',
    type: '专题培训',
    start: '2025-11-12 14:00',
    end: '2025-11-12 17:00',
    location: '线上 · Zoom',
    host: '市场运营 · 王磊',
    status: '报名中',
    focus: '覆盖北美高价值院校案例打法、折扣审批策略与私域跟进 SOP。',
  },
  {
    id: 'train-2',
    title: '高压家长沟通 & 风险处理工作坊',
    type: '能力提升',
    start: '2025-11-15 10:00',
    end: '2025-11-15 12:00',
    location: '上海 · 培训中心 A3',
    host: '客服主管 · 张寒',
    status: '已满',
    focus: '场景演练 + AI 话术演示，帮助顾问应对高压沟通场景。',
  },
  {
    id: 'train-3',
    title: 'SaaS 产品演示 & Demo 实战复盘',
    type: '经验复盘',
    start: '2025-11-18 16:00',
    end: '2025-11-18 18:00',
    location: '线上 · 回放',
    host: '销售 Enablement 团队',
    status: '回放',
    focus: '拆解 Demo 演示结构、问答引导以及异议处理技巧，提供可下载脚本。',
  },
];

const trendIcon = (type: GoalMetric['trendType']) => {
  if (type === 'up') {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  }
  if (type === 'down') {
    return <ArrowUpRight className="h-4 w-4 rotate-180 text-rose-500" />;
  }
  return <Activity className="h-4 w-4 text-gray-400" />;
};

const statusStyles: Record<CollaborationTask['status'], string> = {
  待处理: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  进行中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  已完成: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const priorityStyles: Record<CollaborationTask['priority'], string> = {
  高: 'text-rose-500 dark:text-rose-300',
  中: 'text-indigo-500 dark:text-indigo-300',
  低: 'text-gray-400 dark:text-gray-500',
};

const CRMCollaborationHubPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">协同空间</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Collaboration Hub · CRM Center</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            统一管理团队目标、跨部门协作、知识沉淀与培训活动，帮助销售、市场与服务团队保持信息同步与执行一致。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Upload className="h-4 w-4" />
            发布公告
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            新建协作请求
          </button>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">目标与 KPI 看板</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">实时掌握团队目标进展与达成预测，支持跨团队协同跟踪。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <ClipboardList className="h-3.5 w-3.5" /> 调整目标
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {GOAL_METRICS.map((metric) => (
                <div key={metric.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                    <span>{metric.label}</span>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">目标 {metric.target}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                      <span>进度</span>
                      <span>{metric.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white dark:bg-gray-900/40">
                      <div
                        className="h-2 rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-300">
                      <Target className="h-3 w-3" /> {metric.forecast}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      {trendIcon(metric.trendType)} {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">团队动态</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">整合公告、系统提醒与协作讨论，支持评论互动与附件查看。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <BellRing className="h-3.5 w-3.5" /> 订阅提醒
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {FEED_ITEMS.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.author} className="h-10 w-10 rounded-full" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {item.author} · {item.time} · {item.visibility === 'org' ? '全公司可见' : '团队可见'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.content}</p>
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                      {item.attachments.map((attachment) => (
                        <span key={attachment} className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2 py-0.5 dark:border-indigo-500/30 dark:bg-indigo-900/20">
                          <FileText className="h-3 w-3" /> {attachment}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> 评论 {item.comments ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> 点赞 {item.likes ?? 0}
                    </span>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      <MessageSquare className="h-3.5 w-3.5" /> 加入讨论
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">个人 KPI 榜</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">实时对齐团队目标，突出优秀表现与成长成员。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Users className="h-3.5 w-3.5" /> 查看团队详情
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {KPI_CARDS.map((member) => (
                <div key={member.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <span>{member.name}</span>
                        {member.badge === 'top' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                            <Trophy className="h-3 w-3" /> Top Performer
                          </span>
                        )}
                        {member.badge === 'rising' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                            <Sparkles className="h-3 w-3" /> Rising Star
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {member.metrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <div>{metric.label}</div>
                        <div className="text-sm font-semibold text-indigo-500 dark:text-indigo-300">{metric.value}</div>
                        <div>{metric.target}</div>
                        <div className="text-emerald-500 dark:text-emerald-300">{metric.trend}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">即时提醒</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">关键 SLA、审批与培训提醒集中查看。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300">
                <AlertTriangle className="h-3.5 w-3.5" /> 配置提醒
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-600 shadow-sm dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300">
                <div className="flex items-center justify-between">
                  <span>北美高风险客户跟进超时</span>
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 leading-5">共 6 位客户超过 SLA，请客服团队今日内完成回访。</p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-600 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-300">
                <div className="flex items-center justify-between">
                  <span>Q4 北美训练营报名截止提醒</span>
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 leading-5">报名截止 11/10 18:00，当前报名 46 / 60，未报名成员将收到自动提醒。</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-600 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                <div className="flex items-center justify-between">
                  <span>知识库内容到期提醒</span>
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 leading-5">3 篇流程类文档将于 11/20 到期，请对应负责人完成更新审批。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">协作任务与请求</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">按部门与状态跟踪跨团队协作进度，SLA 超时将自动高亮。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> 创建请求
            </button>
          </div>

          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {COLLAB_TASKS.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span>{task.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[task.status]}`}>{task.status}</span>
                  </div>
                  <span className={`text-xs font-medium ${priorityStyles[task.priority]}`}>优先级：{task.priority}</span>
                </div>
                <div className="mt-2 grid gap-2 text-xs text-gray-500 dark:text-gray-400 md:grid-cols-2">
                  <div>需求部门：{task.department}</div>
                  <div>发起人：{task.requester}</div>
                  <div>负责人：{task.assignee}</div>
                  <div>截止时间：{task.due}</div>
                  <div>服务协议：{task.sla}</div>
                </div>
                <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                  {task.history.map((log) => (
                    <div key={log}>• {log}</div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <MessageSquare className="h-3.5 w-3.5" /> 查看沟通
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 完成任务
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">知识库与模板</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">关键资料、话术模板和流程手册统一管理，支持版本与评分。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <BookOpen className="h-3.5 w-3.5" /> 新建文档
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
              {KNOWLEDGE_ARTICLES.map((article) => (
                <div key={article.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{article.title}</div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">更新 {article.updatedAt}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    分类：{article.category} · 版本 {article.version} · {article.owner}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                    {article.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <Tag className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <div>阅读 {article.usage.views}</div>
                    <div>评分 {article.usage.rating}</div>
                    <div>收藏 {article.usage.favorites}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5" /> AI 生成话术
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 提交更新
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">培训与活动</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">培训日历、报名状态与回放资料集中展示，支持后续考核。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Calendar className="h-3.5 w-3.5" /> 查看日历
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
              {TRAINING_EVENTS.map((event) => (
                <div key={event.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{event.type} · 主讲：{event.host}</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        event.status === '报名中'
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : event.status === '已满'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-gray-500 dark:text-gray-400 md:grid-cols-2">
                    <div>时间：{event.start} - {event.end}</div>
                    <div>地点：{event.location}</div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{event.focus}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 报名/签到
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:hover:border-sky-500 dark:hover:text-sky-300">
                      <PlayCircle className="h-3.5 w-3.5" /> 查看资料
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CRMCollaborationHubPage;
