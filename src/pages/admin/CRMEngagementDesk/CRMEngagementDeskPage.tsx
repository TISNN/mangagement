import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Filter,
  Flame,
  Headphones,
  Mail,
  Mic,
  NotebookPen,
  PhoneCall,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Users,
} from 'lucide-react';

interface StatusMetric {
  id: string;
  title: string;
  value: string;
  subLabel: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface ChannelShare {
  id: string;
  label: string;
  percentage: number;
  accent: string;
}

type EngagementChannel = '电话' | '邮件' | '微信' | '会议' | '面访';

type Sentiment = 'positive' | 'neutral' | 'negative';

type RiskLevel = '高' | '中' | '低';

interface EngagementRecord {
  id: string;
  time: string;
  channel: EngagementChannel;
  summary: string;
  owner: string;
  sentiment: Sentiment;
  tags: string[];
  hasAttachment: boolean;
  aiSummary: {
    highlights: string[];
    todo: string[];
    risk: RiskLevel | null;
  };
}

interface TaskCard {
  id: string;
  title: string;
  owner: string;
  due: string;
  channel?: EngagementChannel;
  status: 'warning' | 'info' | 'success';
}

interface TemplateSnippet {
  id: string;
  title: string;
  description: string;
  channel: EngagementChannel;
  tags: string[];
  rating: number;
  usage: number;
}

interface QualityCheck {
  id: string;
  target: string;
  score: number;
  issues: string[];
  reviewer: string;
  status: '待处理' | '已反馈' | '已完成';
  createdAt: string;
}

const STATUS_METRICS: StatusMetric[] = [
  { id: 'todo', title: '今日待办', value: '18', subLabel: '待完成跟进', change: '+6 新增', trend: 'up' },
  { id: 'completed', title: '今日已完成', value: '32', subLabel: '完成率 78%', change: '+12 比昨日', trend: 'up' },
  { id: 'overdue', title: '延迟跟进', value: '5', subLabel: 'SLA 超时', change: '-2 已处理', trend: 'down' },
];

const CHANNEL_SHARE: ChannelShare[] = [
  { id: 'phone', label: '电话', percentage: 42, accent: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'mail', label: '邮件', percentage: 28, accent: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 'wechat', label: '微信', percentage: 19, accent: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'meeting', label: '会议', percentage: 7, accent: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'visit', label: '面访', percentage: 4, accent: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300' },
];

const ENGAGEMENT_TIMELINE: EngagementRecord[] = [
  {
    id: 'eng-01',
    time: '2025-11-08 09:40',
    channel: '电话',
    summary: '确认课程匹配度，并解答托福补习疑问。',
    owner: '丁若楠',
    sentiment: 'positive',
    tags: ['首席顾问', '主动联系'],
    hasAttachment: true,
    aiSummary: {
      highlights: ['学生对北美 CS 项目兴趣高', '托福 110，GPA 3.7'],
      todo: ['安排 48h 内 Demo', '发送 MIT 成功案例资料'],
      risk: null,
    },
  },
  {
    id: 'eng-02',
    time: '2025-11-08 08:20',
    channel: '邮件',
    summary: '发送奖学金方案与导师介绍，等待学生确认。',
    owner: '赵婧怡',
    sentiment: 'neutral',
    tags: ['邮件模板', '奖学金'],
    hasAttachment: true,
    aiSummary: {
      highlights: ['学生关注英国项目奖学金', '计划报名周末说明会'],
      todo: ['48h 内跟进报名结果', '准备商科导师介绍'],
      risk: '中',
    },
  },
  {
    id: 'eng-03',
    time: '2025-11-07 21:10',
    channel: '微信',
    summary: '发送院校资料，小程序浏览 6 次，学生希望了解签证流程。',
    owner: '张寒',
    sentiment: 'positive',
    tags: ['微信', '高互动度'],
    hasAttachment: false,
    aiSummary: {
      highlights: ['学生关注加拿大签证政策', '家庭支持预算充足'],
      todo: ['推送签证 FAQ', '预约下周一顾问深聊'],
      risk: null,
    },
  },
  {
    id: 'eng-04',
    time: '2025-11-07 18:55',
    channel: '电话',
    summary: '家长反馈担忧疫情影响，需提供安全保障方案。',
    owner: '王鑫',
    sentiment: 'negative',
    tags: ['家长沟通', '风险'],
    hasAttachment: false,
    aiSummary: {
      highlights: ['家长对安全问题敏感', '需展示学校防疫体系'],
      todo: ['发送安全保障方案', '邀请参加家长说明会'],
      risk: '高',
    },
  },
];

const TASK_LIST: TaskCard[] = [
  { id: 'task-01', title: '赵思敏 - 发送 MIT 案例与 Demo 链接', owner: '丁若楠', due: '今日 12:00', channel: '邮件', status: 'warning' },
  { id: 'task-02', title: '陈奕辰 - 确认商科说明会报名', owner: '赵婧怡', due: '今日 14:00', channel: '电话', status: 'info' },
  { id: 'task-03', title: '李雨衡 - 安排加拿大签证顾问沟通', owner: '张寒', due: '明日 09:30', channel: '微信', status: 'info' },
  { id: 'task-04', title: '王鑫 - 家长安全方案回访', owner: '王鑫', due: '今日 17:00', channel: '电话', status: 'warning' },
];

const TEMPLATE_SNIPPETS: TemplateSnippet[] = [
  {
    id: 'tpl-01',
    title: 'MIT CS 高完成度电话脚本',
    description: '用于高水平理工背景学生的深度沟通，包含推荐信与科研点位提示。',
    channel: '电话',
    tags: ['高端', '北美', '冲刺'],
    rating: 4.9,
    usage: 126,
  },
  {
    id: 'tpl-02',
    title: '商科奖学金邮件模板',
    description: '适用于英国/新加坡商科项目的奖学金说明与案例介绍。',
    channel: '邮件',
    tags: ['商科', '奖学金'],
    rating: 4.7,
    usage: 214,
  },
  {
    id: 'tpl-03',
    title: '家长安全保障 FAQ',
    description: '针对家长常见疑虑的标准回答，覆盖防疫、安全、服务流程。',
    channel: '会议',
    tags: ['家长', '风险'],
    rating: 4.5,
    usage: 168,
  },
];

const QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'qc-01',
    target: '王鑫 - 家长电话',
    score: 72,
    issues: ['未提供可落地的安全措施细节', '语速偏快，未确认家长重点关注点'],
    reviewer: '刘蓉（质检）',
    status: '已反馈',
    createdAt: '2025-11-07 22:10',
  },
  {
    id: 'qc-02',
    target: '赵婧怡 - 奖学金邮件',
    score: 88,
    issues: ['模板使用合规，建议补充活动 CTA'],
    reviewer: '刘蓉（质检）',
    status: '已完成',
    createdAt: '2025-11-06 18:25',
  },
];

const getTrendIndicator = (trend: StatusMetric['trend']) => {
  switch (trend) {
    case 'up':
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    case 'down':
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-400" />;
  }
};

const CHANNEL_ICON_MAP: Record<EngagementChannel, React.ReactNode> = {
  电话: <PhoneCall className="h-4 w-4 text-blue-500" />,
  邮件: <Mail className="h-4 w-4 text-indigo-500" />,
  微信: <Sparkles className="h-4 w-4 text-emerald-500" />,
  会议: <Users className="h-4 w-4 text-orange-500" />,
  面访: <UserCircle className="h-4 w-4 text-purple-500" />,
};

const sentimentTextMap: Record<Sentiment, { label: string; className: string }> = {
  positive: { label: '情绪良好', className: 'text-emerald-600 dark:text-emerald-300' },
  neutral: { label: '情绪平稳', className: 'text-blue-500 dark:text-blue-300' },
  negative: { label: '情绪紧张', className: 'text-red-500 dark:text-red-400' },
};

const heatBadgeMap: Record<RiskLevel, string> = {
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const CRMEngagementDeskPage: React.FC = () => {
  const totalTasks = TASK_LIST.length;
  const overdueTasks = TASK_LIST.filter((task) => task.status === 'warning').length;
  const channelTotal = useMemo(() => CHANNEL_SHARE.reduce((acc, channel) => acc + channel.percentage, 0), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">跟进记录工作台</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Desk · CRM Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            统一管理客户全渠道沟通记录，结合 AI 摘要与 SLA 监控，帮助顾问保持高质量跟进、管理层快速质检、及时识别风险并生成后续任务。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Filter className="h-4 w-4" />
            保存过滤器
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            新增沟通记录
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.title}</span>
              <Clock3 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.subLabel}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {getTrendIndicator(metric.trend)}
              <span
                className={
                  metric.trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : metric.trend === 'down'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>渠道占比</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 space-y-3">
            {CHANNEL_SHARE.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${channel.accent}`}>
                    {channel.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(channel.percentage / channelTotal) * 100}%` }} />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{channel.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">沟通时间轴</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">按时间回看所有渠道记录，结合 AI 摘要与 TODO。</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Filter className="h-3.5 w-3.5" /> 筛选
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Sparkles className="h-3.5 w-3.5" /> AI 摘要
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {ENGAGEMENT_TIMELINE.map((record) => (
                <div key={record.id} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-col items-center text-xs text-gray-400 dark:text-gray-500">
                    <div className="font-semibold text-gray-900 dark:text-white">{record.time.split(' ')[0]}</div>
                    <div>{record.time.split(' ')[1]}</div>
                    <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow dark:bg-gray-800">
                      {CHANNEL_ICON_MAP[record.channel]}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{record.channel}</div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{record.summary}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1"><UserCircle className="h-3.5 w-3.5" /> {record.owner}</span>
                          <span className={sentimentTextMap[record.sentiment].className}>{sentimentTextMap[record.sentiment].label}</span>
                          {record.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] text-blue-500 dark:bg-gray-700/50">
                              <Bookmark className="h-3 w-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {record.hasAttachment && (
                          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover=text-blue-300">
                            <FileText className="h-3.5 w-3.5" /> 查看附件
                          </button>
                        )}
                        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                          <NotebookPen className="h-3.5 w-3.5" /> 打开详情
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-3 text-xs leading-5 dark:border-gray-700 dark:bg-gray-800/80">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">AI 摘要</div>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">亮点</div>
                          <ul className="mt-1 list-disc pl-4 text-gray-600 dark:text-gray-300">
                            {record.aiSummary.highlights.map((highlight) => (
                              <li key={highlight}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">待办</div>
                          <ul className="mt-1 list-disc pl-4 text-gray-600 dark:text-gray-300">
                            {record.aiSummary.todo.map((todo) => (
                              <li key={todo}>{todo}</li>
                            ))}
                          </ul>
                        </div>
                        {(record.aiSummary.risk && (
                          <div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500">风险提示</div>
                            <div className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${heatBadgeMap[record.aiSummary.risk]}`}>
                              <AlertTriangle className="mr-1 h-3.5 w-3.5" /> 风险 {record.aiSummary.risk}
                            </div>
                          </div>
                        )) || null}
                      </div>
                    </div>
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">任务与提醒</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">一键查看待办任务、SLA 告警与转派状态。</p>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{overdueTasks}/{totalTasks} 超时</div>
            </div>

            <div className="mt-4 space-y-3">
              {TASK_LIST.map((task) => (
                <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {task.owner}</span>
                        <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {task.due}</span>
                        {task.channel && (
                          <span className="inline-flex items-center gap-1"><Headphones className="h-3.5 w-3.5" /> {task.channel}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          task.status === 'warning'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : task.status === 'info'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}
                      >
                        SLA
                      </span>
                      <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                        <ClipboardCheck className="h-3.5 w-3.5" /> 完成
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">提醒策略</div>
                  <ul className="mt-1 space-y-1 leading-5">
                    <li>• 24h SLA 触发短信 + 邮件提醒。</li>
                    <li>• 第二次超时自动升级给团队经理。</li>
                    <li>• 自定义规则：关键词“投诉”“退款”实时推送客服经理。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">模板与话术库</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">沉淀优秀话术与 AI 推荐内容，提升沟通效率。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI 生成回复
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {TEMPLATE_SNIPPETS.map((tpl) => (
                <div key={tpl.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{tpl.title}</div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-5">{tpl.description}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      <div>评分 {tpl.rating}</div>
                      <div className="mt-1">使用 {tpl.usage}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-blue-500 dark:text-blue-300">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/30">
                      <Headphones className="h-3 w-3" /> {tpl.channel}
                    </span>
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/30">
                        <Bookmark className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                      <NotebookPen className="h-3.5 w-3.5" />
                      插入记录
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      标记常用
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">质检监控</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">审阅沟通合规性、话术质量，并反馈培训策略。</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Headphones className="h-3.5 w-3.5" />
            分配质检
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {QUALITY_CHECKS.map((qc) => (
            <div key={qc.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{qc.target}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">评分 {qc.score} · {qc.reviewer}</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  qc.status === '待处理'
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
                    : qc.status === '已反馈'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}> {qc.status}</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                {qc.issues.map((issue) => (
                  <div key={issue} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-orange-500" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {qc.createdAt}</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:text-blue-300">
                  <NotebookPen className="h-3.5 w-3.5" /> 查看详细反馈
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">质检总结 & 培训建议</div>
              <ul className="mt-2 space-y-1 leading-5">
                <li>• 针对家长沟通，补充安全保障标准话术，创建专项培训。</li>
                <li>• 高价值邮件模板加入 CTA 指南，提升转化。</li>
                <li>• 引入 AI 辅助质检，对关键词“安全”“退款”加强提示。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CRMEngagementDeskPage;
