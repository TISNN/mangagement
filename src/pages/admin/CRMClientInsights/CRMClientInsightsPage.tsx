import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Calendar,
  Download,
  Filter,
  Mail,
  MessageSquare,
  PieChart,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Target,
  Users,
  Zap,
} from 'lucide-react';

interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  note: string;
}

interface TagCategory {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  tags: string[];
}

interface SegmentationCondition {
  id: string;
  type: '标签' | '字段' | '行为' | '模型';
  field: string;
  operator: string;
  value: string;
  relation?: 'AND' | 'OR';
}

interface SegmentTemplate {
  id: string;
  name: string;
  description: string;
  population: string;
  growth: string;
  isDynamic: boolean;
}

interface ValueQuadrant {
  id: string;
  title: string;
  description: string;
  ratio: string;
  highlight: string;
  accent: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  owner: string;
  successRate: string;
  status: 'active' | 'draft';
}

interface ReportItem {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  owner: string;
  type: 'history' | 'attribution' | 'export';
}

const METRICS: MetricCard[] = [
  { id: 'total', label: '客户总量', value: '3,482', change: '+8.6%', trend: 'up', note: '较上月' },
  { id: 'active', label: '活跃客户', value: '1,296', change: '+4.2%', trend: 'up', note: '近30天互动' },
  { id: 'risk', label: '流失风险', value: '86', change: '-12%', trend: 'down', note: '风险模型命中' },
  { id: 'retention', label: '季度留存率', value: '78%', change: '+5pt', trend: 'up', note: 'Q3 vs Q2' },
];

const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'basic',
    title: '基础标签',
    description: '地域、学历、语言等静态特征，适用于初次筛选和业务分派。',
    colorClass: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
    tags: ['华东地区', '英语雅思 7.5', '本科 211', '目标：数据科学'],
  },
  {
    id: 'behavior',
    title: '行为标签',
    description: '记录客户的在线行为、活动参与、沟通频次等动态信号。',
    colorClass: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
    tags: ['官网访客（7天3次）', '说明会报名', '微信咨询响应快', '推荐人：Lily'],
  },
  {
    id: 'value',
    title: '价值标签',
    description: '衡量客户价值贡献及潜力，结合 RFM 与 CLV 模型输出。',
    colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
    tags: ['累计付费 26w', '续约 2 次', '推荐 3 人', '毛利率 48%'],
  },
  {
    id: 'risk',
    title: '风险标签',
    description: '捕捉服务风险与负面信号，便于提前预警与干预。',
    colorClass: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300',
    tags: ['投诉 1 次', '待缴尾款', '服务进度滞后', '高压家长'],
  },
];

const SEGMENT_CONDITIONS: SegmentationCondition[] = [
  { id: 'c1', type: '标签', field: '价值标签', operator: '包含', value: '高潜力', relation: 'AND' },
  { id: 'c2', type: '行为', field: '活动参与次数', operator: '>=', value: '2（最近30天）', relation: 'AND' },
  { id: 'c3', type: '字段', field: '申请阶段', operator: '等于', value: '申请材料准备', relation: 'OR' },
  { id: 'c4', type: '模型', field: '续约成功率', operator: '>=', value: '70%', relation: 'AND' },
  { id: 'c5', type: '行为', field: '沟通间隔', operator: '>', value: '14 天未跟进', relation: undefined },
];

const SEGMENT_TEMPLATES: SegmentTemplate[] = [
  {
    id: 'segment-1',
    name: '高潜力 & 待激活',
    description: '高价值标签 + 14 天未沟通，优先安排顾问跟进，匹配培育 Campaign。',
    population: '128 人',
    growth: '+18% 环比',
    isDynamic: true,
  },
  {
    id: 'segment-2',
    name: '家长推荐高转化',
    description: '推荐来源 + 续约概率 > 65%，适合作为案例分享与口碑传播对象。',
    population: '56 人',
    growth: '+9% 环比',
    isDynamic: true,
  },
  {
    id: 'segment-3',
    name: '高风险预警',
    description: '投诉或拖欠款项 + 服务进度滞后，联动服务中心启动预案。',
    population: '34 人',
    growth: '-5% 环比',
    isDynamic: false,
  },
];

const VALUE_QUADRANTS: ValueQuadrant[] = [
  {
    id: 'premium',
    title: '高价值客户',
    description: 'R / F / M 均为 4-5 分，续约概率与推荐率高，属于重点维护群体。',
    ratio: '24%',
    highlight: '平均 CLV 42.6w · 推荐率 36%',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-300',
  },
  {
    id: 'potential',
    title: '潜力客户',
    description: '最近联系频繁（R 高）但购买频次较低，需要培育转化。',
    ratio: '33%',
    highlight: '平均 CLV 18.4w · 活动参与 2.6 次/月',
    accent: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-900/20 dark:text-sky-300',
  },
  {
    id: 'sleeping',
    title: '沉睡客户',
    description: '长时间未互动，消费频次与金额下降，建议唤醒或再营销。',
    ratio: '28%',
    highlight: '最近消费距今 120 天 · 开信率 9%',
    accent: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-900/20 dark:text-violet-300',
  },
  {
    id: 'churn',
    title: '流失风险',
    description: 'R & F 双低且命中风险标签，需启动关怀与补救计划。',
    ratio: '15%',
    highlight: '续约预测 < 25% · 投诉率 12%',
    accent: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300',
  },
];

const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto-1',
    name: '高潜客户 7 天未跟进',
    trigger: 'Segment: 高潜力 & 待激活 → 最近互动 > 7 天',
    action: '自动创建任务 + 发送提醒给负责人',
    owner: '销售运营 · Zoe',
    successRate: '92%',
    status: 'active',
  },
  {
    id: 'auto-2',
    name: '续约前 30 天关怀',
    trigger: 'Value: CLV 预测 > 25w & 合同到期 30 天',
    action: '发送关怀邮件 + 推送续约优惠包',
    owner: 'CRM Automation',
    successRate: '87%',
    status: 'active',
  },
  {
    id: 'auto-3',
    name: '活动报名未签到提醒',
    trigger: 'Event: 报名活动 & 未签到',
    action: '发送补救资料 + 添加回访任务',
    owner: '市场运营 · Kevin',
    successRate: '74%',
    status: 'draft',
  },
];

const REPORT_ITEMS: ReportItem[] = [
  {
    id: 'report-1',
    title: 'Q3 分群执行日志',
    description: '动态分群运行 68 次，成功率 97%，平均计算时长 48 秒。',
    updatedAt: '2025-11-07 21:30',
    owner: '数据分析 · Iris',
    type: 'history',
  },
  {
    id: 'report-2',
    title: '活动归因 · 北美说明会',
    description: '参与客户 312 人，转化率 28%，贡献新增收入 420w。',
    updatedAt: '2025-11-06 10:05',
    owner: '市场运营 · Leo',
    type: 'attribution',
  },
  {
    id: 'report-3',
    title: '数据同步 · 数据仓库',
    description: '每日写入标签/价值模型数据，完成率 100%，延迟 < 3 分钟。',
    updatedAt: '2025-11-08 02:00',
    owner: 'Data Platform',
    type: 'export',
  },
];

const renderTrendIcon = (trend: MetricCard['trend']) => {
  if (trend === 'up') {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  }
  if (trend === 'down') {
    return <ArrowDownRight className="h-4 w-4 text-rose-500" />;
  }
  return <Activity className="h-4 w-4 text-gray-400" />;
};

const CRMClientInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">客户分群分析</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Client Insights · CRM Center</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            汇集客户画像、标签体系、分群引擎、价值模型与自动化策略，帮助团队精准洞察客户旅程并驱动精细化运营与关怀。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Filter className="h-4 w-4" />
            导入分群条件
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            新建动态分群
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.label}</span>
              <PieChart className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {renderTrendIcon(metric.trend)}
              <span
                className={
                  metric.trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : metric.trend === 'down'
                      ? 'text-rose-500 dark:text-rose-300'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
              <span className="text-gray-400 dark:text-gray-500">· {metric.note}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">客户画像（示例）</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">集中展示客户的核心背景与旅程节点。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Users className="h-3.5 w-3.5" /> 切换客户
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                <div className="text-sm font-semibold">王欣然 · 2025FALL 数据科学</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>地区：上海</div>
                  <div>顾问：赵婧怡</div>
                  <div>当前阶段：文书润色</div>
                  <div>推荐来源：家长口碑</div>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div>最近互动：2025-11-07 微信语音</div>
                  <div>最近消费：2025-11-02 追加服务包（¥38,800）</div>
                  <div>服务满意度：4.8 / 5</div>
                </div>
              </div>

              <div className="grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>客户旅程</span>
                  <span>阶段完成率 68%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['线索获取', '初次沟通', '方案定制', '合同签署', '材料准备', '网申提交', '签证辅导'].map((step, index) => (
                    <span
                      key={step}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                        index < 4
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : index === 4
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Target className="h-3 w-3" /> {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">标签管理中心</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持创建、合并与自动打标签规则配置。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-violet-200 hover:text-violet-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-300">
                <Tag className="h-3.5 w-3.5" /> 管理标签
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-900/20">
                <div className="text-sm font-semibold text-violet-700 dark:text-violet-200">自动规则示例</div>
                <ul className="mt-2 space-y-1 leading-5">
                  <li>• 活动报名 ≥ 2 次 → 自动打标签「活动活跃」。</li>
                  <li>• 续约金额 ≥ 20w → 自动打标签「高价值」并抄送经理。</li>
                  <li>• 服务满意度 &lt; 3 → 触发风险标签「需关注」。</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">标签统计</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <div>标签总量：186</div>
                  <div>本月新增：24</div>
                  <div>自动规则：12 条</div>
                  <div>共享标签占比：68%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">分群引擎</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">拖拽式条件构建 + 实时结果预览。</p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> 保存为模板
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700">
                  <Zap className="h-3.5 w-3.5" /> 预览样本
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-3">
                {SEGMENT_CONDITIONS.map((condition, index) => (
                  <div key={condition.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                      <span>条件 {index + 1}</span>
                      {condition.relation && <span>{condition.relation}</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {condition.type}
                      </span>
                      <span>{condition.field}</span>
                      <span className="text-gray-400">{condition.operator}</span>
                      <span className="rounded bg-white px-2 py-0.5 text-xs text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-200">
                        {condition.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
                <div className="font-semibold">实时统计</div>
                <div className="mt-3 grid gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>匹配客户数</span>
                    <span className="text-lg font-semibold">128</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>占 CRM 总客户</span>
                    <span className="text-base font-semibold">3.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>流失风险占比</span>
                    <span className="text-base font-semibold">6%</span>
                  </div>
                  <div className="mt-3 rounded-lg border border-white/60 bg-white/80 p-3 text-xs text-indigo-600 shadow-sm dark:border-indigo-200/40 dark:bg-indigo-900/40 dark:text-indigo-200">
                    <div className="font-semibold">AI 提示</div>
                    <p className="mt-1 leading-5">
                      最近 30 天新增 24 人，建议同步营销自动化，安排续约顾问提前介入，并关注 6 位高风险客户的投诉处理进度。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">价值模型与象限</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">结合 RFM / CLV 算法，定位客户价值与风险。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                <BarChart3 className="h-3.5 w-3.5" /> 查看模型配置
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">RFM 汇总</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Recency', value: '4.3', note: '平均 9 天' },
                      { label: 'Frequency', value: '3.8', note: '季度互动 6 次' },
                      { label: 'Monetary', value: '4.1', note: '平均贡献 22.6w' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-white/60 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                        <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{item.value}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
                        <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">预测指标</div>
                  <ul className="mt-2 space-y-1 leading-5">
                    <li>• 续约成功率预测：72%（同比 +6pt）。</li>
                    <li>• 追加购买概率：34%（主要集中在高潜力象限）。</li>
                    <li>• 投诉发生率：3.2%（已纳入风险象限监控）。</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                {VALUE_QUADRANTS.map((quadrant) => (
                  <div key={quadrant.id} className={`rounded-xl border p-4 shadow-sm ${quadrant.accent}`}>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{quadrant.title}</span>
                      <span>{quadrant.ratio}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5">{quadrant.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/60 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-white/20 dark:bg-white/10 dark:text-white/80">
                      <Sparkles className="h-3 w-3" /> {quadrant.highlight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">行为触发与自动化</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">统一管理触发条件、动作以及执行表现。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-amber-200 hover:text-amber-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-amber-500 dark:hover:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" /> 新建规则
            </button>
          </div>

          <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
            {AUTOMATION_RULES.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">{rule.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      rule.status === 'active'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    {rule.status === 'active' ? '运行中' : '草稿'}
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <Target className="h-4 w-4 text-indigo-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">触发条件</div>
                    <p className="leading-5">{rule.trigger}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">执行动作</div>
                    <p className="leading-5">{rule.action}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {rule.owner}</span>
                  <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> 成功率 {rule.successRate}</span>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <Activity className="h-3.5 w-3.5" /> 查看日志
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">报表与导出</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">追踪分群历史与活动效果，支持数据同步。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-sky-500 dark:hover:text-sky-300">
              <Download className="h-3.5 w-3.5" /> 导出报表
            </button>
          </div>

          <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
            {REPORT_ITEMS.map((report) => (
              <div key={report.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">{report.title}</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">更新：{report.updatedAt}</span>
                </div>
                <p className="mt-2 leading-5">{report.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {report.owner}</span>
                  <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> 自动推送</span>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-sky-200 hover:text-sky-600 dark:border-gray-600 dark:hover:border-sky-500 dark:hover:text-sky-300">
                    <Share2 className="h-3.5 w-3.5" /> 分享
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">预警与重点关注</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">结合风险标签与自动化触发日志，识别需要人工介入的客户群。</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300">
            <ShieldAlert className="h-3.5 w-3.5" /> 查看预案
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[ 
            {
              title: '投诉高发群',
              value: '18 人',
              detail: '近 14 天内投诉 1 次以上，主要集中在文书服务阶段。',
              action: '安排质控顾问回访 & 发送满意度问卷',
            },
            {
              title: '续约临界群',
              value: '42 人',
              detail: '合同到期 45 天内，续约预测 40%-60%，需加强培育。',
              action: '推送成功案例 + 安排续约策略会议',
            },
            {
              title: '支付滞后群',
              value: '26 人',
              detail: '存在尾款未结清或分期逾期，需财务与顾问联动处理。',
              action: '发送支付提醒 + 建立风险工单',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>{item.title}</span>
                <span>{item.value}</span>
              </div>
              <p className="mt-2 leading-5">{item.detail}</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-rose-500 shadow-sm dark:bg-gray-900 dark:text-rose-300">
                <AlertTriangle className="h-3 w-3" /> {item.action}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CRMClientInsightsPage;
