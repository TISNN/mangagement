/**
 * 客户分群分析模块 - 数据常量
 */

import {
  MetricCard,
  TagCategory,
  SegmentationCondition,
  SegmentTemplate,
  ValueQuadrant,
  AutomationRule,
  ReportItem,
  AlertGroup,
  CustomerProfile,
} from './types';

export const METRICS: MetricCard[] = [
  { id: 'total', label: '客户总量', value: '3,482', change: '+8.6%', trend: 'up', note: '较上月' },
  { id: 'active', label: '活跃客户', value: '1,296', change: '+4.2%', trend: 'up', note: '近30天互动' },
  { id: 'risk', label: '流失风险', value: '86', change: '-12%', trend: 'down', note: '风险模型命中' },
  { id: 'retention', label: '季度留存率', value: '78%', change: '+5pt', trend: 'up', note: 'Q3 vs Q2' },
];

export const TAG_CATEGORIES: TagCategory[] = [
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

export const SEGMENT_CONDITIONS: SegmentationCondition[] = [
  { id: 'c1', type: '标签', field: '价值标签', operator: '包含', value: '高潜力', relation: 'AND' },
  { id: 'c2', type: '行为', field: '活动参与次数', operator: '>=', value: '2（最近30天）', relation: 'AND' },
  { id: 'c3', type: '字段', field: '申请阶段', operator: '等于', value: '申请材料准备', relation: 'OR' },
  { id: 'c4', type: '模型', field: '续约成功率', operator: '>=', value: '70%', relation: 'AND' },
  { id: 'c5', type: '行为', field: '沟通间隔', operator: '>', value: '14 天未跟进', relation: undefined },
];

export const SEGMENT_TEMPLATES: SegmentTemplate[] = [
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

export const VALUE_QUADRANTS: ValueQuadrant[] = [
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

export const AUTOMATION_RULES: AutomationRule[] = [
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

export const REPORT_ITEMS: ReportItem[] = [
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

export const ALERT_GROUPS: AlertGroup[] = [
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
];

export const SAMPLE_CUSTOMER_PROFILE: CustomerProfile = {
  name: '王欣然',
  project: '2025FALL 数据科学',
  region: '上海',
  advisor: '赵婧怡',
  stage: '文书润色',
  source: '家长口碑',
  lastInteraction: '2025-11-07 微信语音',
  lastConsumption: '2025-11-02 追加服务包（¥38,800）',
  satisfaction: '4.8 / 5',
};

export const CUSTOMER_JOURNEY_STEPS = [
  '线索获取',
  '初次沟通',
  '方案定制',
  '合同签署',
  '材料准备',
  '网申提交',
  '签证辅导',
];

