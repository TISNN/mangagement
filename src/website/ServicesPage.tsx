import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Code2, PenTool, ScrollText, Workflow, GraduationCap, Bot, Sparkles, Rocket, BadgeCheck } from 'lucide-react';

const SERVICES = [
  {
    icon: Code2,
    title: '数字化建设',
    description: '量身打造官网、小程序、App，提供招生 CRM、数据一体化等系统集成方案，让招生触点全渠道打通。',
    highlights: ['品牌化视觉设计', '多语言响应式适配', '智能线索收集/自动化触发', '数据看板与行为分析'],
  },
  {
    icon: Palette,
    title: '品牌与营销运营',
    description: '以“内容 + 设计 + 增长”驱动招生声量，覆盖社媒运营、活动策划、宣传物料与招生 campaign。',
    highlights: ['30 日社媒策略冲刺', '招生季整合营销闭环', '品牌视觉系统与活动海报', '招生传播素材库'],
  },
  {
    icon: ScrollText,
    title: '法律与合规咨询',
    description: '资深律所与留学行业顾问联合支撑，覆盖合同审核、政策合规、风险提示与专属培训。',
    highlights: ['留学合同标准化审阅', '政策/签证应对策略', '数据与隐私合规指引', '法务顾问驻场陪伴'],
  },
  {
    icon: PenTool,
    title: '礼品定制与传播物料',
    description: '从机构礼盒到线下展陈一体化定制，帮助机构在校园、展会与到访体验中打造统一品牌感。',
    highlights: ['开学礼盒与欢迎包', '校园活动定制物料', '机构宣传册与宣讲 PPT', '展会展台设计'],
  },
  {
    icon: Workflow,
    title: '运营与流程顾问',
    description: '沉淀我们在留学机构服务的最佳实践，打造 SOP、培训计划、绩效与协作机制。',
    highlights: ['业务流程梳理与 SOP', '团队排班与 KPI 体系', 'CRM 选型与自动化', '跨部门协作工作坊'],
  },
  {
    icon: GraduationCap,
    title: '学术与学生体验',
    description: '提供语言课程规划、面试辅导、学生社区、家长沟通等延伸服务，让客户黏性持续增长。',
    highlights: ['语言冲刺营与学术加油站', '面试官陪练与作品集诊断', '学生社区运营', '家长月度报告机制'],
  },
];

const SERVICE_PACKS = [
  {
    title: 'Website Starter Kit',
    description: '4-6 周快速上线品牌官网 + 线索收集，适合需要升级数字形象的机构。',
    deliverables: ['视觉设计 3 套方案', 'CMS / CRM 集成', 'AI 招生助手嵌入', '上线培训与交接'],
    price: '¥ 69,000 起',
  },
  {
    title: 'Social Media 30D Sprint',
    description: '30 天社媒增长冲刺计划，从策略到执行全程陪跑，打造招生话题热度。',
    deliverables: ['平台策略与定位', '内容日历 30 篇', '视觉模板包', '投放复盘与增长建议'],
    price: '¥ 36,800 起',
  },
  {
    title: 'Compliance Guardian',
    description: '法务专家 + 顾问联合服务，全面梳理合同、政策、数据安全并输出整改路径。',
    deliverables: ['合同/协议风险扫描', '隐私与数据合规手册', '政策解读与专题培训', '常年顾问答疑'],
    price: '¥ 12,800 / 阶段',
  },
];

const ServiceCard: React.FC<typeof SERVICES[number]> = ({ icon: Icon, title, description, highlights }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-blue-500/40 transition-all"
  >
    <div className="flex items-center gap-4 mb-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
        <Icon className="h-6 w-6 text-blue-300" />
      </span>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-300 leading-relaxed mb-6">{description}</p>
    <ul className="space-y-3 text-sm text-gray-300">
      {highlights.map((highlight) => (
        <li key={highlight} className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ServicePackCard: React.FC<typeof SERVICE_PACKS[number]> = ({ title, description, deliverables, price }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col"
  >
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-blue-200 bg-white/5">{price}</span>
    </div>
    <p className="mt-4 text-gray-300 leading-relaxed">{description}</p>
    <div className="mt-6 flex-1">
      <p className="text-sm text-gray-400 mb-3">交付内容</p>
      <ul className="space-y-3 text-sm text-gray-300">
        {deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-blue-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all">
      预约顾问
    </button>
  </motion.div>
);

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-black/40 to-black">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_60%)]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.25),transparent_65%)]" />
        </div>
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-blue-200">
              <Rocket className="h-4 w-4" /> 留学机构 B 端服务矩阵
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-tight md:text-6xl">
              用一支团队，构建你的
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> 全链路服务力</span>
            </h1>
            <p className="mt-8 text-lg text-gray-300 leading-relaxed">
              无论你是正在起步的精品团队，还是覆盖多个国家的连锁机构，我们都以 AI 能力、创意设计与行业经验赋能招生、交付与品牌运营，
              帮助你在竞争激烈的市场中保持增长势能。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all">
                与服务顾问沟通
              </button>
              <span className="text-sm text-gray-400">7×24 小时响应，提供定制化方案评估</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              我们的服务能力
            </h2>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              基于对 200+ 留学机构的服务经验，我们沉淀出六大核心能力，以项目组形式灵活组合，为你构建差异化竞争力。
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Service Packs */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              热门服务包
            </h2>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              快速落地的标准化服务包，帮助你在关键节点迅速搭建能力；也可作为定制方案的起点，与更多增值服务组合。
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_PACKS.map((pack) => (
              <ServicePackCard key={pack.title} {...pack} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/20 to-black" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              合作流程
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              标准化协同机制，确保每个阶段高质量交付；配合 AI 工具与协作平台，实时同步最新进度。
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                title: '需求共创',
                description: '顾问深度访谈 + 业务梳理，识别关键目标与挑战，输出优先级矩阵。',
              },
              {
                title: '方案设计',
                description: '项目经理、设计/技术负责人联合评估，制定时间线、资源与交付物。',
              },
              {
                title: '执行落地',
                description: '采用双周节奏汇报，透明化进度与风险，处理实时需求变化。',
              },
              {
                title: '复盘增值',
                description: '交付回顾 + 数据验证，沉淀知识资产与培训材料，规划下一阶段增长路径。',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-blue-200">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="relative container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10"
            >
              <h2 className="text-4xl font-bold text-white">预约服务体验</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">
                输入需求后 2 小时内，我们的服务顾问会与你联系，并提供初步诊断报告。定制项目通常在 5 个工作日内完成方案评估。
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-blue-300" /> AI 预诊断匹配参考方案
                </li>
                <li className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-purple-300" /> 行业专家顾问 1v1 沟通
                </li>
                <li className="flex items-center gap-3">
                  <Workflow className="h-5 w-5 text-pink-300" /> 全流程项目管理与复盘
                </li>
              </ul>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">联系人姓名</span>
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">机构名称</span>
                  <input
                    type="text"
                    placeholder="请输入机构名称"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </label>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">业务邮箱</span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">联系电话</span>
                  <input
                    type="tel"
                    placeholder="请输入联系方式"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">想要了解的服务</span>
                <select className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-blue-400 focus:outline-none">
                  <option className="bg-black text-white">数字化建设</option>
                  <option className="bg-black text-white">品牌与营销运营</option>
                  <option className="bg-black text-white">法律与合规咨询</option>
                  <option className="bg-black text-white">礼品定制与传播物料</option>
                  <option className="bg-black text-white">运营与流程顾问</option>
                  <option className="bg-black text-white">学术与学生体验</option>
                  <option className="bg-black text-white">定制咨询</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">项目背景 / 需求描述</span>
                <textarea
                  rows={4}
                  placeholder="请描述当前的业务挑战、预期目标或预算范围，我们会根据信息制定对应方案。"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                提交需求
              </button>
              <p className="text-center text-xs text-gray-500">
                提交后我们会通过邮箱或电话与您确认会议时间，所有信息仅用于服务沟通。
              </p>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

