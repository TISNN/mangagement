import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Filter,
  FolderPlus,
  Globe2,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';

type MetricTrend = 'up' | 'down' | 'stable';
type CollaborationStage = '进行中' | '待同步' | '已完成';
type PulseType = '发布' | '提醒' | '风险';
type TabId = 'overview' | 'assets' | 'governance';

interface MetricItem {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: MetricTrend;
  description: string;
}

interface FocusStream {
  id: string;
  name: string;
  owner: string;
  role: '顾问团队' | '机构合作' | '跨部门';
  members: number;
  documents: number;
  updatedAt: string;
  highlights: string[];
  priority: '高' | '中' | '低';
}

interface CollaborationItem {
  id: string;
  topic: string;
  initiator: string;
  relatedStream: string;
  due: string;
  status: CollaborationStage;
  actions: string[];
}

interface PlaybookItem {
  id: string;
  title: string;
  segment: string;
  stage: '草稿' | '内审中' | '对外发布';
  maintainer: string;
  lastUpdate: string;
  tags: string[];
  visibility: '内部' | '顾问 & 运营' | '合作机构';
}

interface PulseItem {
  id: string;
  type: PulseType;
  title: string;
  detail: string;
  owner: string;
  time: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'm1',
    label: '本月上线知识资产',
    value: '58',
    change: '+21%',
    trend: 'up',
    description: '顾问专属 38 · 机构共建 12 · 跨部门 8',
  },
  {
    id: 'm2',
    label: '知识复用度',
    value: '4.6 次/资产',
    change: '+0.8',
    trend: 'up',
    description: '上周被顾问团队引用 268 次',
  },
  {
    id: 'm3',
    label: '合作机构激活率',
    value: '78%',
    change: '+6%',
    trend: 'up',
    description: '14 家机构订阅最新话术与流程',
  },
  {
    id: 'm4',
    label: '风险预警',
    value: '3 条',
    change: '-2',
    trend: 'down',
    description: '签证流程需更新 · 话术存在敏感描述',
  },
];

const FOCUS_STREAMS: FocusStream[] = [
  {
    id: 'fs1',
    name: '北美顾问行动手册 · STARS',
    owner: '北美顾问部',
    role: '顾问团队',
    members: 28,
    documents: 196,
    updatedAt: '今日 09:20',
    highlights: ['新增 EA/ED Checklist', '更新 2025 文书素材库', '补充家长答疑模板'],
    priority: '高',
  },
  {
    id: 'fs2',
    name: 'IELTS 高分冲刺协作区',
    owner: '语言培训中心',
    role: '跨部门',
    members: 22,
    documents: 118,
    updatedAt: '昨日 20:45',
    highlights: ['导入最新真题解析', '同步 3 节直播课脚本', '新增续费话术'],
    priority: '中',
  },
  {
    id: 'fs3',
    name: '机构合作 · 商务资料与 SOP',
    owner: '渠道商务部',
    role: '机构合作',
    members: 14,
    documents: 74,
    updatedAt: '昨日 17:10',
    highlights: ['签约流程更新', '新增授权演示文稿', '导入风险应对 FAQ'],
    priority: '高',
  },
];

const COLLABORATIONS: CollaborationItem[] = [
  {
    id: 'cb1',
    topic: '北美 2025 申请季材料包统一模板',
    initiator: '顾问运营组',
    relatedStream: '北美顾问行动手册 · STARS',
    due: '11-15',
    status: '进行中',
    actions: ['补充计算机方向案例', '校对法务审核意见'],
  },
  {
    id: 'cb2',
    topic: 'IELTS 冲刺班直播课回放整理',
    initiator: '教学教研组',
    relatedStream: 'IELTS 高分冲刺协作区',
    due: '11-14',
    status: '待同步',
    actions: ['编辑课纲', '上传知识花园版本'],
  },
  {
    id: 'cb3',
    topic: '机构合作 FAQ 风控复核',
    initiator: '渠道商务部',
    relatedStream: '机构合作 · 商务资料与 SOP',
    due: '11-13',
    status: '进行中',
    actions: ['补充退款政策', '添加合规声明'],
  },
];

const PLAYBOOKS: PlaybookItem[] = [
  {
    id: 'pb1',
    title: '2025 北美研究生顾问服务手册 v3.2',
    segment: '顾问团队',
    stage: '对外发布',
    maintainer: '赵婧怡',
    lastUpdate: '11-12 21:30',
    tags: ['北美', '研究生顾问', '案例库'],
    visibility: '顾问 & 运营',
  },
  {
    id: 'pb2',
    title: 'IELTS 冲刺班交付 SOP · 混合班型',
    segment: '跨部门',
    stage: '内审中',
    maintainer: '培训团队',
    lastUpdate: '11-11 19:20',
    tags: ['IELTS', '课堂脚本', '续费话术'],
    visibility: '内部',
  },
  {
    id: 'pb3',
    title: '机构合作伙伴入驻指南与首单流程',
    segment: '机构合作',
    stage: '对外发布',
    maintainer: '刘珂',
    lastUpdate: '11-10 16:05',
    tags: ['合作机构', '签约流程', '风控'],
    visibility: '合作机构',
  },
  {
    id: 'pb4',
    title: '家长高压沟通应对话术 · 2025 版',
    segment: '顾问团队',
    stage: '草稿',
    maintainer: '服务质控',
    lastUpdate: '11-09 22:15',
    tags: ['沟通话术', '风险管理'],
    visibility: '内部',
  },
];

const PULSES: PulseItem[] = [
  {
    id: 'ps1',
    type: '发布',
    title: '《北美 2025 申诉信合集》已上线知识花园',
    detail: '评分 4.9 · 本周 GMV 6,800 元 · 顾问团队可直接引用',
    owner: '北美顾问部',
    time: '1 小时前',
  },
  {
    id: 'ps2',
    type: '提醒',
    title: 'IELTS 冲刺班课件缺少版权说明',
    detail: '需在 11/14 前补齐版权条款并同步运营同学',
    owner: '知识风控组',
    time: '3 小时前',
  },
  {
    id: 'ps3',
    type: '风险',
    title: '机构合作 FAQ 退款流程未更新',
    detail: '建议立即升级至 v2.4，避免对外口径不一致',
    owner: '风控中心',
    time: '昨日 21:15',
  },
];

const TABS: Array<{ id: TabId; label: string; helper: string; description: string }> = [
  {
    id: 'overview',
    label: '协作总览',
    helper: '节奏与重点流',
    description: '洞察顾问、机构与跨团队协作的核心节奏，聚焦重点流与关键动作。',
  },
  {
    id: 'assets',
    label: '知识资产',
    helper: '手册与模板',
    description: '梳理手册发布状态、维护人和适用场景，确保知识资产持续迭代。',
  },
  {
    id: 'governance',
    label: '运营治理',
    helper: '提醒与风险',
    description: '监控审批、风险与任务执行情况，保障协作成果稳定上线。',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'qa1',
    title: '同步案例包给合作机构',
    description: '自动生成机构可用版本（含敏感信息屏蔽与学生摘要）。',
    action: '生成共享包',
  },
  {
    id: 'qa2',
    title: '创建跨团队专项协作',
    description: '快速拉通顾问、教研、运营三方，附带里程碑与角色职责。',
    action: '发起协作',
  },
  {
    id: 'qa3',
    title: '订阅审核 SLA 提醒',
    description: '24 小时审核未完成即推送通知，避免排队长时间积压。',
    action: '开启提醒',
  },
];

const trendColor = (trend: MetricTrend) => {
  if (trend === 'up') return 'text-emerald-600 dark:text-emerald-300';
  if (trend === 'down') return 'text-rose-500 dark:text-rose-300';
  return 'text-gray-500 dark:text-gray-400';
};

const collaborationStatusColor: Record<CollaborationStage, string> = {
  进行中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  待同步: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  已完成: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const playbookStageClass: Record<PlaybookItem['stage'], string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  内审中: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  对外发布: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const pulseClass: Record<PulseType, string> = {
  发布: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200',
  提醒: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200',
  风险: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-200',
};

const KnowledgeHubWorkspaceV2Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const activeDescription = useMemo(
    () => TABS.find((tab) => tab.id === activeTab)?.description ?? '',
    [activeTab],
  );

  const assetSummary = useMemo(() => {
    const total = PLAYBOOKS.length;
    const published = PLAYBOOKS.filter((item) => item.stage === '对外发布').length;
    const inReview = PLAYBOOKS.filter((item) => item.stage === '内审中').length;
    const draft = PLAYBOOKS.filter((item) => item.stage === '草稿').length;
    return [
      { id: 'asset-total', label: '手册总数', value: total, helper: '覆盖顾问、机构与跨部门三大场景' },
      { id: 'asset-published', label: '对外发布', value: published, helper: '可直接用于学生或机构交付' },
      { id: 'asset-review', label: '内审中', value: inReview, helper: '等待风控与资深顾问确认' },
      { id: 'asset-draft', label: '草稿待完善', value: draft, helper: '建议两周内完成整理上线' },
    ];
  }, []);

  const segmentSummary = useMemo(() => {
    const counts = new Map<string, number>();
    PLAYBOOKS.forEach((item) => {
      counts.set(item.segment, (counts.get(item.segment) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([segment, count]) => ({ segment, count }));
  }, []);

  const tagCloud = useMemo(() => {
    const tagSet = new Set<string>();
    PLAYBOOKS.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, []);

  const spotlightCollaborations = useMemo(() => COLLABORATIONS.slice(0, 2), []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
            <Network className="h-3.5 w-3.5" />
            顾问 · 机构 · 团队协作空间
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">知识协作空间（V2）</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              聚焦顾问、机构与跨团队的知识产出协作，通过分区视图掌握节奏、资产与风控执行情况。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <FolderPlus className="h-4 w-4" />
            新建协作流
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Users className="h-4 w-4" />
            邀请机构伙伴
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            AI 共创指南
          </button>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[140px] flex-col gap-1 rounded-xl px-4 py-2 text-left transition ${
                tab.id === activeTab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300'
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span
                className={`text-xs ${
                  tab.id === activeTab ? 'text-indigo-100/90' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.helper}
              </span>
            </button>
          ))}
        </div>
        {activeDescription && <p className="text-sm text-gray-500 dark:text-gray-400">{activeDescription}</p>}
      </div>

      {activeTab === 'overview' && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{metric.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trendColor(metric.trend)}`}>
                  <Activity className="h-3 w-3" />
                  {metric.change}
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-400 dark:text-gray-500">{metric.description}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">重点协作流</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">聚焦关键业务线，快速识别协作状态与重点事项。</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <Filter className="h-3.5 w-3.5" />
                  管理协作流
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {FOCUS_STREAMS.map((stream) => (
                  <div
                    key={stream.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm transition hover:border-indigo-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{stream.name}</div>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          stream.priority === '高'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                            : stream.priority === '中'
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300'
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {stream.priority} 优先
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 text-xs text-gray-500 dark:text-gray-400 sm:grid-cols-3">
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 成员 {stream.members}</span>
                      <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> 资产 {stream.documents}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> 更新 {stream.updatedAt}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{stream.owner} · 类型：{stream.role}</div>
                    <div className="mt-3 space-y-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {stream.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-500" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-xs hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      查看协作流
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">待推进协作</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">本周需推进的重要协作节点与责任人提示。</p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <MessageSquare className="h-3.5 w-3.5" />
                    打开协同看板
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  {spotlightCollaborations.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.topic}</div>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${collaborationStatusColor[item.status]}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        发起人：{item.initiator} · 协作流：{item.relatedStream} · 截止：{item.due}
                      </div>
                      <div className="mt-2 space-y-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        {item.actions.map((action) => (
                          <div key={action} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">快捷动作</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">常用协作治理动作，帮助迅速响应业务需求。</p>
                <div className="mt-4 space-y-3">
                  {QUICK_ACTIONS.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</div>
                      <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{item.description}</p>
                      <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-xs font-medium text-indigo-600 hover:border-indigo-200 hover:text-indigo-700 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:border-indigo-400 dark:hover:text-indigo-100">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'assets' && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assetSummary.map((summary) => (
              <div key={summary.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="text-sm text-gray-500 dark:text-gray-400">{summary.label}</div>
                <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{summary.value}</div>
                <p className="mt-2 text-xs leading-5 text-gray-400 dark:text-gray-500">{summary.helper}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">资产结构与标签热度</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">按业务场景查看资产覆盖度，并快速定位高热度标签。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Globe2 className="h-3.5 w-3.5" />
                发布至知识花园
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {segmentSummary.map((segment) => (
                <span key={segment.segment} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                  <Briefcase className="h-3 w-3" />
                  {segment.segment} · {segment.count} 份
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
              {tagCloud.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">服务手册详情</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">按发布阶段梳理手册，支持导出版本与发起升级计划。</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <FileText className="h-3.5 w-3.5" />
                  导出版本记录
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                  <ClipboardList className="h-3.5 w-3.5" />
                  制定升级计划
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {PLAYBOOKS.map((playbook) => (
                <div key={playbook.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{playbook.title}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${playbookStageClass[playbook.stage]}`}>
                      {playbook.stage}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> 适用场景：{playbook.segment}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 维护人：{playbook.maintainer}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> 更新 {playbook.lastUpdate}</span>
                    <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 可见范围：{playbook.visibility}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                    {playbook.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                      查看版本
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                      共享给机构
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-amber-200 hover:text-amber-600 dark:border-gray-600 dark:hover:border-amber-500 dark:hover:text-amber-300">
                      发起更新任务
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'governance' && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">即时脉搏</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">整合发布、提醒与风险信息，保障协作成果质量。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Bell className="h-3.5 w-3.5" />
                订阅更新
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {PULSES.map((pulse) => (
                <div key={pulse.id} className={`rounded-xl border p-4 shadow-sm ${pulseClass[pulse.type]}`}>
                  <div className="text-xs font-semibold">{pulse.type}</div>
                  <div className="mt-1 text-sm font-medium">{pulse.title}</div>
                  <p className="mt-1 text-xs leading-5 opacity-80">{pulse.detail}</p>
                  <div className="mt-2 flex items-center justify-between text-xs opacity-60">
                    <span>{pulse.owner}</span>
                    <span>{pulse.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">协作任务清单</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">跨团队协作的执行节点、责任人与后续动作。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <MessageSquare className="h-3.5 w-3.5" />
                打开协同看板
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {COLLABORATIONS.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.topic}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${collaborationStatusColor[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    发起人：{item.initiator} · 协作流：{item.relatedStream} · 截止：{item.due}
                  </div>
                  <div className="mt-2 space-y-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {item.actions.map((action) => (
                      <div key={action} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-xs hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    进入协作详情
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default KnowledgeHubWorkspaceV2Page;

