import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart2,
  BookOpenCheck,
  Coins,
  Crown,
  DollarSign,
  Download,
  Filter,
  Globe,
  Layers,
  LineChart,
  ListChecks,
  MessageSquare,
  Receipt,
  Sparkles,
  Star,
  Tag,
  Ticket,
} from 'lucide-react';

interface MarketplaceItem {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  mode: '免费' | '付费' | '订阅' | '企业授权';
  status: '待上架' | '已上线' | '下架';
  updatedAt: string;
  conversion: string;
  audience: string[];
}

interface BundleItem {
  id: string;
  name: string;
  description: string;
  docs: number;
  subscribers: number;
  price: string;
  rating: number;
  status: '售卖中' | '策划中' | '已完成';
}

interface PricingRule {
  id: string;
  name: string;
  scope: '单篇内容' | '课程包' | '企业授权' | '限时活动';
  detail: string;
  active: boolean;
  owner: string;
  updatedAt: string;
}

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: '北美说明会实战话术合集 2025',
    author: '北美顾问案例库',
    category: '销售话术',
    price: '¥299',
    mode: '付费',
    status: '已上线',
    updatedAt: '11-08 09:20',
    conversion: '31% 转化',
    audience: ['顾问内部', '合作机构'],
  },
  {
    id: 'm2',
    title: 'IELTS 7.5 冲刺营（含课件 + 打卡工具）',
    author: '语言培训教研组',
    category: '课程包',
    price: '¥499',
    mode: '订阅',
    status: '已上线',
    updatedAt: '11-07 20:40',
    conversion: '新增 86 位订阅者',
    audience: ['学生可见'],
  },
  {
    id: 'm3',
    title: 'B2B 产品培训：企业入门课程',
    author: '合作支持团队',
    category: '企业培训',
    price: '¥9,800',
    mode: '企业授权',
    status: '待上架',
    updatedAt: '11-07 18:55',
    conversion: '预计 6 家企业购买',
    audience: ['合作机构'],
  },
  {
    id: 'm4',
    title: '学生申诉信模板合集（公开摘要）',
    author: '学术支持组',
    category: '文书模板',
    price: '免费',
    mode: '免费',
    status: '已上线',
    updatedAt: '11-06 21:10',
    conversion: '下载 420 次',
    audience: ['学生可见', '顾问内部'],
  },
];

const BUNDLES: BundleItem[] = [
  {
    id: 'b1',
    name: '2025 北美高价值院校申请大课',
    description: '案例拆解 + 选校工具 + 文书模板，配合 3 次直播答疑。',
    docs: 12,
    subscribers: 168,
    price: '¥899 / 季度',
    rating: 4.9,
    status: '售卖中',
  },
  {
    id: 'b2',
    name: 'IELTS 口语 30 天冲刺训练营',
    description: '每日口语任务 + 音频示范 + AI 语音点评，适合 6.5+ 目标。',
    docs: 18,
    subscribers: 236,
    price: '¥399 / 期',
    rating: 4.7,
    status: '售卖中',
  },
  {
    id: 'b3',
    name: 'B2B 合作伙伴赋能计划',
    description: '产品培训 + 售后 FAQ + 销售材料，企业授权专享。',
    docs: 9,
    subscribers: 6,
    price: '¥12,000 / 年',
    rating: 4.8,
    status: '策划中',
  },
];

const PRICING_RULES: PricingRule[] = [
  { id: 'pr1', name: '单篇付费标准', scope: '单篇内容', detail: '基础价 ¥99，支持 AI 建议定价与折扣', active: true, owner: '知识营收组', updatedAt: '11-05 15:30' },
  { id: 'pr2', name: '订阅专栏收益分成', scope: '课程包', detail: '平台 20% · 作者 70% · 团队 10%', active: true, owner: '知识营收组', updatedAt: '11-01 10:00' },
  { id: 'pr3', name: '企业授权报价模板', scope: '企业授权', detail: '根据员工数阶梯定价，支持定制打折', active: false, owner: 'B2B 合作支持', updatedAt: '10-28 18:15' },
  { id: 'pr4', name: '双十一限时优惠', scope: '限时活动', detail: '指定课程 85 折，赠送社群辅导', active: true, owner: '运营活动组', updatedAt: '11-02 09:20' },
];

const modeBadge: Record<MarketplaceItem['mode'], string> = {
  免费: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  付费: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  订阅: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  企业授权: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const statusBadge: Record<MarketplaceItem['status'], string> = {
  待上架: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  已上线: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  下架: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
};

const bundleBadge: Record<BundleItem['status'], string> = {
  售卖中: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  策划中: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  已完成: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
};

const KnowledgeGardenAdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">知识花园运营</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Knowledge Garden Admin · 内容上架、定价策略与收益分析</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            管理知识花园的内容货架、课程包、定价与促销策略，实时监控收益与用户反馈，支持免费、付费、订阅与企业授权多种模式。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Layers className="h-4 w-4" />
            批量上架
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            创建课程包
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">上架内容列表</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">按状态、定价模式快速管理知识花园内容。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Filter className="h-3.5 w-3.5" /> 筛选
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
              <Download className="h-3.5 w-3.5" /> 导出表格
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          {MARKETPLACE_ITEMS.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:border-indigo-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <span>{item.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${modeBadge[item.mode]}`}>{item.mode}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge[item.status]}`}>{item.status}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">更新 {item.updatedAt}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1"><BookOpenCheck className="h-3 w-3" /> 作者：{item.author}</span>
                <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> 分类：{item.category}</span>
                <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> 定价：{item.price}</span>
                <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> {item.conversion}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                {item.audience.map((aud) => (
                  <span key={aud} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Globe className="h-3 w-3" /> {aud}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <MessageSquare className="h-3.5 w-3.5" /> 查看评价
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" /> 推广配置
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-amber-200 hover:text-amber-600 dark:border-gray-600 dark:hover:border-amber-500 dark:hover:text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> 下线 / 调整
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">课程包 / 专题管理</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">组合内容、设定学习路径与专属社群权益。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Layers className="h-3.5 w-3.5" /> 新建专题
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {BUNDLES.map((bundle) => (
              <div key={bundle.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{bundle.name}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${bundleBadge[bundle.status]}`}>{bundle.status}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{bundle.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><BookOpenCheck className="h-3 w-3" /> 内容 {bundle.docs} 篇</span>
                  <span className="inline-flex items-center gap-1"><Crown className="h-3 w-3" /> 订阅 {bundle.subscribers}</span>
                  <span className="inline-flex items-center gap-1"><Coins className="h-3 w-3" /> 定价 {bundle.price}</span>
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" /> 评分 {bundle.rating.toFixed(1)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    <ListChecks className="h-3.5 w-3.5" /> 配置学习路径
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" /> 推出优惠
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">定价与活动规则</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">管理价格策略、分成与营销活动。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Receipt className="h-3.5 w-3.5" /> 新增规则
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {PRICING_RULES.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${rule.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300'}`}>{rule.active ? '运行中' : '已停用'}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">适用范围：{rule.scope}</div>
                <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{rule.detail}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>负责人：{rule.owner}</span>
                  <span>更新：{rule.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">收益概览</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">本月实时 GMV、付费转化与退款率。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <BarChart2 className="h-3.5 w-3.5" /> 下载报告
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>本月 GMV</span>
                <span>¥128,600</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">环比 +26%</span>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>付费转化率</span>
                <span>23.4%</span>
              </div>
              <div className="mt-1 text-xs text-emerald-600">学生专区 18.2% · 顾问专区 28.6%</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-300">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>退款率</span>
                <span>2.1%</span>
              </div>
              <div className="mt-1 text-xs text-amber-600">低于阈值 3%，无需干预</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">受众分布</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">按角色与地域拆分访问与付费情况。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <LineChart className="h-3.5 w-3.5" /> 设置受众
            </button>
          </div>
          <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>学生用户</span>
                <span>38%</span>
              </div>
              <div className="mt-1 text-gray-500 dark:text-gray-400">热门：语言培训、申请工具；付费转化 18%</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>顾问 / 内部员工</span>
                <span>44%</span>
              </div>
              <div className="mt-1 text-gray-500 dark:text-gray-400">热门：案例库、服务 SOP；付费转化 29%</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>B 端合作伙伴</span>
                <span>18%</span>
              </div>
              <div className="mt-1 text-gray-500 dark:text-gray-400">热门：企业培训、授权资料；平均客单 ¥9,800</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">活动与优惠</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">管理优惠券、限时折扣与推广渠道。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Ticket className="h-3.5 w-3.5" /> 新建优惠券
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>双十一联合促销</span>
                <span>进行中</span>
              </div>
              <div className="mt-1 text-xs text-indigo-400">课程包 85 折 · 赠送 7 天社群答疑 · GMV +42%</div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-200">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>企业授权组合包</span>
                <span>准备中</span>
              </div>
              <div className="mt-1 text-xs text-emerald-400">配合 B2B 培训计划，预计 11/15 上线，目标 10 家企业</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700 shadow-sm dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-300">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>新用户试学券</span>
                <span>待优化</span>
              </div>
              <div className="mt-1 text-xs text-amber-600">发放率高但使用率 22%，需新增提醒与活动曝光</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeGardenAdminPage;
