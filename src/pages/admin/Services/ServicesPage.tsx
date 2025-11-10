import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Code2,
  GraduationCap,
  MessageSquare,
  Palette,
  PenTool,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

/**
 * 服务包卡片的数据结构定义
 */
interface ServicePack {
  name: string;
  price: string;
  intro: string;
  deliverables: string[];
}

/**
 * 合作流程步骤的数据结构定义
 */
interface ProcessStep {
  step: string;
  title: string;
  detail: string;
}

/**
 * 头部展示指标的数据结构定义
 */
interface HeroMetric {
  icon: LucideIcon;
  text: string;
}

/**
 * CTA 功能展示的数据结构定义
 */
interface CtaFeature {
  icon: LucideIcon;
  text: string;
}

/**
 * 服务菜单项的数据结构定义
 */
interface ServiceMenuItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  highlights: string[];
  timeline: string;
}

/**
 * 细分服务类别的数据结构定义
 */
interface ServiceMenuCategory {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  services: ServiceMenuItem[];
}

/**
 * 联系表单输入项的数据结构定义
 */
interface ContactField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel';
}

/**
 * 联系表单下拉选项的数据结构定义
 */
interface ContactOption {
  value: string;
  label: string;
}

// 头部关键指标展示
const HERO_METRICS: HeroMetric[] = [
  { icon: CheckCircle2, text: '200+ 留学机构长期合作' },
  { icon: CheckCircle2, text: '72h 内给出定制方案' },
];

// 标准化服务包配置
const PACKS: ServicePack[] = [
  {
    name: 'Smart Website Starter',
    price: '¥69,000 起',
    intro: '4-6 周内上线品牌官网与 CRM 线索流，适合希望快速升级数字门店的机构。',
    deliverables: ['体验设计三稿迭代', 'CMS/CRM 集成交付', 'AI 招生助手部署', '上线培训与维保指南'],
  },
  {
    name: 'Social Sprint 30D',
    price: '¥36,800 起',
    intro: '30 天社媒增长计划，覆盖内容策略、素材制作、投放优化，实现招生阶段曝光。',
    deliverables: ['多平台内容策略', '每日内容日历 & 模板包', '社群/直播活动执行', '效果复盘与增长建议'],
  },
  {
    name: 'Compliance Guardian',
    price: '¥12,800 / 阶段',
    intro: '法务+运营联合体检，从合同、隐私、签证到数据跨境，提供合规整改与培训支持。',
    deliverables: ['合同&条款风险扫描', '合规改进计划', '专项培训与答疑', '常年顾问跟进机制'],
  },
];

// 合作流程展示的数据
const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: '需求共创',
    detail: '顾问团队与业务负责人开展 Workshop，明确痛点、目标与成功指标，输出优先级路线图。',
  },
  {
    step: '02',
    title: '方案评审',
    detail: '技术/设计/法务等多角色协作估算工期与资源，形成报价与执行排期，供客户批复。',
  },
  {
    step: '03',
    title: '执行落地',
    detail: '项目经理负责节奏管理，提供周会/看板/日报，多角色实时同步进度与风险。',
  },
  {
    step: '04',
    title: '复盘增值',
    detail: '交付结束后输出复盘总结、数据验证与后续建议，沉淀模板和知识资产备未来复用。',
  },
];

// 预约顾问的优势点
const CONSULTATION_FEATURES: CtaFeature[] = [
  { icon: Bot, text: '自动生成行业对标与方案草稿' },
  { icon: MessageSquare, text: '顾问 1v1 电话或线上会议' },
  { icon: Workflow, text: '全程项目经理跟进与复盘' },
];

// 联系表单的输入项配置
const CONTACT_FIELDS: ContactField[] = [
  { id: 'contactName', label: '联系人姓名', placeholder: '请输入姓名', type: 'text' },
  { id: 'organizationName', label: '机构名称', placeholder: '请输入机构名称', type: 'text' },
  { id: 'businessEmail', label: '业务邮箱', placeholder: 'name@example.com', type: 'email' },
  { id: 'phoneNumber', label: '联系电话', placeholder: '请输入联系方式', type: 'tel' },
];

// 联系表单可选的服务类别
const CONTACT_OPTIONS: ContactOption[] = [
  { value: 'digital', label: '数字化建设' },
  { value: 'marketing', label: '品牌与营销运营' },
  { value: 'compliance', label: '法律与合规支持' },
  { value: 'material', label: '礼品与传播物料' },
  { value: 'operation', label: '流程与运营顾问' },
  { value: 'academic', label: '学术与学生体验' },
  { value: 'custom', label: '定制咨询' },
];

// 可勾选的服务菜单配置
const SERVICE_CATEGORIES: ServiceMenuCategory[] = [
  {
    key: 'digital',
    title: '数字化建设',
    description:
      '用一套统一的体验与系统基线，帮助机构搭建品牌官网、小程序、App 与 CRM/AI 闭环，提升线索转化率与交付效率。',
    icon: Code2,
    accent: 'from-blue-500/10 to-blue-500/0 text-blue-500',
    services: [
      {
        id: 'digital-website',
        name: '品牌官网建设',
        price: '¥68,000 起',
        unit: '项目价',
        description: '4-6 周上线响应式官网，支持 CMS、线索表单与多语言内容管理。',
        highlights: ['UE&UI 三轮迭代', 'CMS 模块搭建', '线索表单 + CRM 集成', 'SEO 与性能优化'],
        timeline: '标准周期 6 周 · 可加急',
      },
      {
        id: 'digital-mini-app',
        name: '招生小程序',
        price: '¥48,000 起',
        unit: '项目价',
        description: '以微信/企业微信小程序覆盖招生触点，支持课程预约、活动报名与内容订阅。',
        highlights: ['前台 + 后台全栈交付', '活动/课程预约流程', '消息通知与打标签', '与 CRM 同步线索'],
        timeline: '标准周期 4 周',
      },
      {
        id: 'digital-app',
        name: '移动 App 开发',
        price: '¥168,000 起',
        unit: '项目价',
        description: '原生或混合方案定制，覆盖学员端与顾问端，实现学习、任务与消息闭环。',
        highlights: ['iOS/Android 双端', '学习任务与打卡', '即时通讯/推送', 'Supabase/自建后台集成'],
        timeline: '标准周期 10-14 周',
      },
      {
        id: 'digital-crm',
        name: 'CRM 客户系统搭建',
        price: '¥36,000 起',
        unit: '项目价',
        description: '按招生流程梳理客户旅程，配置 Supabase / HubSpot / Salesforce 等 CRM 管理线索与任务。',
        highlights: ['线索/客户模型梳理', '自动化任务流', '仪表盘与报表设计', '团队权限与审计配置'],
        timeline: '标准周期 3-5 周',
      },
      {
        id: 'digital-ai',
        name: 'AI 招生助手部署',
        price: '¥22,000 起',
        unit: '项目价',
        description: '配置 RAG 知识库与对话流程，支持官网、小程序或 App 内置智能问答与表单转化。',
        highlights: ['知识库整理与清洗', '多渠道接入', '对话埋点与监控', '运营手册与复盘机制'],
        timeline: '标准周期 2-3 周',
      },
    ],
  },
  {
    key: 'marketing',
    title: '品牌营销运营',
    description:
      '以内容与渠道为核心，打造持续曝光与转化的营销闭环，适用于招生季冲刺或品牌升级阶段。',
    icon: Palette,
    accent: 'from-purple-500/10 to-purple-500/0 text-purple-500',
    services: [
      {
        id: 'marketing-content-sprint',
        name: '内容冲刺月',
        price: '¥32,800 / 月',
        unit: '包月',
        description: '30 天内覆盖内容策略、脚本、素材制作与账户投放，实现招生季集中的曝光增长。',
        highlights: ['多平台内容日历', '短视频/图文制作', '投放投产分析', '社群运营 SOP'],
        timeline: '标准周期 4 周',
      },
      {
        id: 'marketing-event',
        name: '线下宣讲会运营',
        price: '¥18,600 起',
        unit: '项目价',
        description: '从场地、物料到主持脚本全流程代执行，确保线下活动高质获客。',
        highlights: ['活动方案设计', '嘉宾与流程统筹', '现场执行团队', '活动复盘与线索导入'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'marketing-brand-refresh',
        name: '品牌视觉重塑',
        price: '¥56,000 起',
        unit: '项目价',
        description: '重塑品牌识别系统，输出视觉规范、素材库与模板，适配线上线下多场景。',
        highlights: ['品牌定位共创', 'LOGO/VI 升级', '素材模板包', '品牌手册与培训'],
        timeline: '标准周期 5-6 周',
      },
    ],
  },
  {
    key: 'compliance',
    title: '法律与合规支持',
    description:
      '结合留学行业监管要求与机构实际场景，提供合同、隐私、签证与跨境数据等完整合规解决方案。',
    icon: ShieldCheck,
    accent: 'from-emerald-500/10 to-emerald-500/0 text-emerald-500',
    services: [
      {
        id: 'compliance-health-check',
        name: '机构合规体检',
        price: '¥18,800 / 阶段',
        unit: '阶段价',
        description: '梳理招生、授课、签约流程，全链路识别合规风险并输出整改路线图。',
        highlights: ['流程面访与文档审核', '风险清单与整改建议', '专题培训与答疑', '整改复盘报告'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'compliance-contract',
        name: '合同与条款定制',
        price: '¥9,600 起',
        unit: '项目价',
        description: '针对不同产品线定制招生合同、家长协议、课程条款，确保权益与责任明确。',
        highlights: ['合同模板起草/修订', '多产品线覆盖', '争议条款风险提示', '签署流程与存档建议'],
        timeline: '标准周期 2 周',
      },
      {
        id: 'compliance-data',
        name: '数据隐私与跨境合规',
        price: '¥22,500 起',
        unit: '项目价',
        description: '评估数据采集、存储与跨境传输风险，完善隐私政策、授权流程与告警机制。',
        highlights: ['数据流梳理与分级', '隐私政策/声明撰写', '跨境传输评估报告', '告警与应急预案'],
        timeline: '标准周期 4 周',
      },
      {
        id: 'compliance-visa',
        name: '签证与政策快线',
        price: '¥6,800 / 月',
        unit: '包月',
        description: '实时监测多国签证与教育政策，提供解读、答疑与运营应对手册。',
        highlights: ['政策监测与快讯', '风险等级提示', '政策沟通话术', '顾问培训与考试'],
        timeline: '连续交付 · 月度滚动',
      },
    ],
  },
  {
    key: 'material',
    title: '礼品与传播物料',
    description:
      '以品牌体验为核心，设计落地礼盒、宣传册、展会布置等组合方案，统一品牌形象与触点。',
    icon: PenTool,
    accent: 'from-orange-500/10 to-orange-500/0 text-orange-500',
    services: [
      {
        id: 'material-giftbox',
        name: '开学礼盒设计与生产',
        price: '¥420 / 套 起',
        unit: '按套计价',
        description: '策划礼盒主题、物料组合与供应链，交付开学/签约节点的惊喜体验。',
        highlights: ['礼盒主题共创', '多供应商比价', '品牌定制物料', '物流履约监控'],
        timeline: '标准周期 5 周',
      },
      {
        id: 'material-brochure',
        name: '招生宣传册与折页',
        price: '¥16,800 起',
        unit: '项目价',
        description: '输出品牌故事、课程亮点与案例内容，适配线上 PDF 与线下印刷双场景。',
        highlights: ['内容梳理与撰写', '版式设计与封面方案', '图像与案例采集', '印刷打样与监理'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'material-expo',
        name: '展会/宣讲会布置',
        price: '¥32,000 起',
        unit: '项目价',
        description: '针对多场次活动设计展台、路演物料与互动体验，确保线下引流效果。',
        highlights: ['展台平面与立面图', '互动区动线规划', '搭建与拆除统筹', '现场执行管理'],
        timeline: '标准周期 4 周',
      },
      {
        id: 'material-brand-assets',
        name: '品牌素材资产库',
        price: '¥14,800 起',
        unit: '项目价',
        description: '整理 LOGO、字体、配色、模板与素材，将品牌资产数字化并便于团队调用。',
        highlights: ['素材盘点与归档', '在线素材中心搭建', '团队使用指南', '季度更新机制'],
        timeline: '标准周期 3 周',
      },
    ],
  },
  {
    key: 'operation',
    title: '流程与运营顾问',
    description:
      '梳理招生、交付、服务全链路流程，搭配 SOP、指标与工具配置，保障团队协作高效透明。',
    icon: Workflow,
    accent: 'from-cyan-500/10 to-cyan-500/0 text-cyan-500',
    services: [
      {
        id: 'operation-process',
        name: '招生流程诊断',
        price: '¥19,800 起',
        unit: '项目价',
        description: '从线索到签约全流程盘点，识别断点与效率瓶颈，并设计优化方案。',
        highlights: ['线索旅程映射', '节点 KPI 诊断', '流程优化建议', '实施路线图'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'operation-scheduling',
        name: '排班与资源调度体系',
        price: '¥12,600 起',
        unit: '项目价',
        description: '设计导师/课程排班机制，落地排班工具或规则，减少冲突与空档。',
        highlights: ['排班规则梳理', '工具/系统选型', '冲突预警与审批', '培训与交接'],
        timeline: '标准周期 2-3 周',
      },
      {
        id: 'operation-kpi',
        name: '绩效指标与看板',
        price: '¥15,800 起',
        unit: '项目价',
        description: '搭建招生、交付、服务 KPI 体系，设计仪表盘与复盘机制，确保执行可视化。',
        highlights: ['指标架构设计', '数据采集规划', '看板原型与模板', '周/月度复盘节奏'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'operation-training',
        name: '团队培训与 SOP 写作',
        price: '¥8,800 起',
        unit: '项目价',
        description: '输出 SOP 文档、培训课程与考核机制，确保流程落地与持续优化。',
        highlights: ['SOP 撰写与排版', '培训课件与授课', '实操考核设计', '更新与版本管理'],
        timeline: '标准周期 2 周',
      },
    ],
  },
  {
    key: 'academic',
    title: '学术与学生体验',
    description:
      '围绕学生学习与家长沟通，提供课程、文书、社群运营、反馈机制等全套解决方案，提升签约续费率。',
    icon: GraduationCap,
    accent: 'from-indigo-500/10 to-indigo-500/0 text-indigo-500',
    services: [
      {
        id: 'academic-language',
        name: '语言冲刺课程设计',
        price: '¥420 / 课时 起',
        unit: '按课时计价',
        description: '针对托福/雅思/多邻国等考试制定课程结构、讲义与老师培训，快速上线提分班。',
        highlights: ['课程大纲与梯度', '讲义与作业包', '教师培训标准', '学员测评工具'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'academic-essay',
        name: '文书陪练营运营',
        price: '¥18,800 起',
        unit: '项目价',
        description: '搭建文书陪练营流程，覆盖选题、润色、反馈机制与进度监控。',
        highlights: ['陪练营流程设计', '导师匹配与培训', '反馈模板与质检', '学员进度看板'],
        timeline: '标准周期 4 周',
      },
      {
        id: 'academic-community',
        name: '学生社群与活动策划',
        price: '¥9,600 起',
        unit: '项目价',
        description: '规划学生社群主题、活动节奏与运营机制，提升学生粘性与口碑传播。',
        highlights: ['社群定位与分层', '活动日历与脚本', '互动数据监测', '社群运营培训'],
        timeline: '标准周期 3 周',
      },
      {
        id: 'academic-parents',
        name: '家长沟通与反馈体系',
        price: '¥11,800 起',
        unit: '项目价',
        description: '设计家长沟通节奏、汇报模板与满意度调研，构建正向反馈闭环。',
        highlights: ['沟通节奏规划', '报告模板与可视化', '满意度调研流程', '预警与回访机制'],
        timeline: '标准周期 2-3 周',
      },
    ],
  },
];

const ServicesPage: React.FC = () => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    console.info('[ServicesPage] 页面已加载');

    return () => {
      console.info('[ServicesPage] 页面已卸载');
    };
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info('[ServicesPage] 提交需求表单已触发');
  }, []);

  const handleToggleService = useCallback((serviceId: string) => {
    setSelectedServiceIds((prev) => {
      const isSelected = prev.includes(serviceId);
      if (isSelected) {
        console.info('[ServicesPage] 服务已移除咨询清单', { serviceId });
        return prev.filter((id) => id !== serviceId);
      }
      console.info('[ServicesPage] 服务加入咨询清单', { serviceId });
      return [...prev, serviceId];
    });
  }, []);

  const selectedServices = useMemo(() => {
    const flatServices = SERVICE_CATEGORIES.flatMap((category) =>
      category.services.map((service) => ({
        category: category.title,
        ...service,
      }))
    );

    return flatServices.filter((service) => selectedServiceIds.includes(service.id));
  }, [selectedServiceIds]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
              <Building2 className="h-3.5 w-3.5" />
              B2B 服务中心
            </span>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              一站式支持合作机构的数字化与品牌增长
            </h1>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              我们为留学机构与顾问团队提供从品牌、系统、营销到交付的全链路服务。通过标准化套餐 + 定制化项目，结合 AI 能力与行业顾问经验，帮助合作伙伴持续提升招生、交付与运营效率。
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              {HERO_METRICS.map(({ icon: MetricIcon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1 dark:bg-gray-800/60"
                >
                  <MetricIcon className="h-4 w-4 text-emerald-500" />
                  {text}
              </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">立即预约顾问</h2>
            <p className="mt-2 text-sm text-white/80">
              提交需求后，我们会在 2 小时内安排行业顾问联系您，提供初步诊断和合作建议。
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {CONSULTATION_FEATURES.map(({ icon: FeatureIcon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <FeatureIcon className="h-4 w-4" />
                  {text}
              </li>
              ))}
            </ul>
            <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-white/90">
              提交需求
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Service Menu */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">服务菜单与定价</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              直接挑选需要的服务模块，我们会根据信息生成报价草稿并安排顾问沟通细节。
            </p>
          </div>
        </div>
        <div className="space-y-8">
          {SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.key}
              className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`rounded-2xl bg-gradient-to-br ${category.accent} p-3`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-blue-50/80 px-4 py-3 text-xs text-blue-600 shadow-sm dark:bg-blue-900/20 dark:text-blue-200">
                  可与定制化项目组合 · 提供专属项目经理对接
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.services.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      className={`flex h-full flex-col rounded-2xl border bg-white p-5 transition shadow-sm dark:bg-gray-950/50 ${
                        isSelected
                          ? 'border-blue-400 ring-1 ring-blue-200 dark:border-blue-500 dark:ring-blue-500/30'
                          : 'border-gray-200 hover:border-blue-200 dark:border-gray-800 dark:hover:border-blue-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{service.name}</h4>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                          {service.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-500 dark:text-blue-300">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-900/30">{service.unit}</span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {service.timeline}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {service.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => handleToggleService(service.id)}
                        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            : 'border border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-200 dark:hover:border-blue-600/60 dark:hover:bg-blue-900/30'
                        }`}
                      >
                        {isSelected ? '已加入咨询清单' : '加入咨询清单'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selectedServices.length > 0 && (
          <div className="transition-opacity">
            <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-6 shadow-sm dark:border-blue-700/60 dark:bg-blue-900/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">
                    我的咨询清单（{selectedServices.length}）
                  </h3>
                  <p className="mt-1 text-sm text-blue-900/70 dark:text-blue-200/80">
                    已为您锁定基础资源，提交需求后顾问会携带初步报价与交付排期与您沟通。
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  预约顾问沟通
                </button>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-blue-900/80 dark:text-blue-200/80">
                {selectedServices.map((service) => (
                  <li
                    key={service.id}
                    className="flex flex-col gap-1 rounded-2xl border border-blue-200/70 bg-white/70 px-4 py-3 dark:border-blue-600/40 dark:bg-blue-900/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium text-blue-900 dark:text-blue-100">{service.name}</div>
                      <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-800/60 dark:text-blue-200">
                        {service.price} · {service.unit}
                      </div>
                    </div>
                    <div className="text-xs text-blue-900/70 dark:text-blue-200/80">
                      {service.category} · {service.timeline}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Packs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">热门服务包</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              开箱即用的标准化方案，可直接落地，也可与定制项目组合。
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PACKS.map((pack) => (
            <div
              key={pack.name}
              className="flex h-full flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-blue-900/40 dark:bg-gray-900/80"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pack.name}</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                  {pack.price}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{pack.intro}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {pack.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:border-blue-700 dark:hover:bg-blue-900/30">
                咨询详情
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">合作流程与保障</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              透明化的项目协作机制，确保方案输出、执行与复盘都可追踪、有沉淀。
            </p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm ring-1 ring-blue-100 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:ring-gray-800">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">预约顾问深度沟通</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              输入当前的业务挑战或目标，我们会在 2 小时内安排顾问团队与您确认需求，并在 72 小时内提交初步方案。
            </p>
            <ul className="space-y-3 text-sm text-blue-900/80 dark:text-gray-300">
              {CONSULTATION_FEATURES.map(({ icon: FeatureIcon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <FeatureIcon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {CONTACT_FIELDS.slice(0, 2).map(({ id, label, placeholder, type }) => (
                <label key={id} className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>{label}</span>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </label>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {CONTACT_FIELDS.slice(2).map(({ id, label, placeholder, type }) => (
                <label key={id} className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>{label}</span>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </label>
              ))}
            </div>
            <label className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>想要了解的服务</span>
              <select
                defaultValue=""
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="" disabled hidden>
                  请选择服务类型
                </option>
                {CONTACT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value} className="text-gray-900 dark:text-gray-100">
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>项目背景 / 需求描述</span>
              <textarea
                rows={4}
                placeholder="请描述业务挑战、目标或预算范围，我们会根据信息制定对应方案。"
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:from-blue-600 dark:to-purple-600"
            >
              提交需求
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              提交后我们会通过邮箱或电话与您确认会议时间，所有信息仅用于服务沟通。
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

