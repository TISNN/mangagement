import {
  Award,
  Banknote,
  Building2,
  CalendarCheck,
  FileCertificate,
  FileText,
  GraduationCap,
  Handshake,
  Layers,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
  Wallet,
} from 'lucide-react';

import type {
  CaseStudy,
  ContactEntry,
  CredentialItem,
  FAQItem,
  HighlightCard,
  HeroStat,
  LocationItem,
  PaymentChannel,
  ServiceFlowStep,
  ServiceOffering,
  TeamMember,
  Testimonial,
} from './types';

export const INSTITUTION_HERO_STATS: HeroStat[] = [
  {
    id: 'served-students',
    label: '累计服务学生',
    value: '2,860+',
    hint: '覆盖13个国家及地区',
    trend: { label: '同比增长', value: '+28%' },
  },
  {
    id: 'offer-rate',
    label: '全球TOP30 录取率',
    value: '78%',
    hint: '近三年平均成功率',
    trend: { label: '最新申请季', value: '83%' },
  },
  {
    id: 'advisor-team',
    label: '顾问团队',
    value: '35人',
    hint: '含前招生官/导师/研究员',
  },
  {
    id: 'scholarship',
    label: '奖学金获得总额',
    value: '¥26,000,000',
    hint: '含全奖/半奖/专项补助',
  },
];

export const INSTITUTION_HIGHLIGHTS: HighlightCard[] = [
  {
    id: 'methodology',
    title: '全链路教学服务方法论',
    description: '从背景诊断到选校决策、从文书打磨到入学衔接，全程设计学习与申请双轨闭环。',
    bullets: ['13 个维度的学术&活动评估模型', 'AI+导师双引擎文书工作台', 'Offer 后衔接课程与家长陪伴营'],
    icon: Layers,
    badge: '交付流程可视化',
  },
  {
    id: 'faculty',
    title: '导师与顾问联合战队',
    description: '由前招生官、藤校学长学姐、学术导师与职场导师组成复合型服务团队。',
    bullets: ['平均 6.8 年指导经验', '专业导师覆盖 18 个热门专业集群', '导师签约全程绩效考核与反馈'],
    icon: Users,
    badge: '双导师制',
  },
  {
    id: 'data-driven',
    title: '数据驱动的智能决策',
    description: '实时同步全球院校数据库、成功案例洞察与模型预测，辅助顾问制定方案。',
    bullets: ['院校评估 12 个核心维度', '案例库每日更新 Offer 动态', 'AI 提供选校/文书智能建议'],
    icon: Sparkles,
    badge: '智能推荐',
  },
  {
    id: 'assurance',
    title: '透明可追踪的交付保障',
    description: '签署服务保障协议，关键里程碑提供成果验收，家长拥有实时查看权限。',
    bullets: ['服务进度实时推送', '关键文书 3 轮内部质检', '申请失败提供二次免费提报'],
    icon: Shield,
    badge: 'SLA保障',
  },
];

export const INSTITUTION_SERVICES: ServiceOffering[] = [
  {
    id: 'us-ug-full',
    category: '本科申请',
    title: '美国本科全程申请旗舰计划',
    tagline: '匹配学术潜力与个性化故事，冲刺纳藤/Top30 工程与商科项目。',
    priceRange: { min: 88000, max: 128000, currency: 'CNY' },
    duration: '12-18 个月',
    deliverables: [
      '背景挖掘与升学诊断报告',
      '活动与科研规划路线图',
      '全套文书深度共创（至少 6 套）',
      '网申填写与材料审核',
      '面试辅导与模拟打磨',
    ],
    guarantees: ['全程顾问+文书导师+学术导师三对一服务', '每月家长汇报会与进度复盘', '失败院校免费复议/二次提报'],
    suitableFor: ['计划申请美国 TOP50 本科的高中生', '希望冲刺理工/商科/跨学科专业', '需要规划科研活动与竞赛履历的学生'],
    processHighlights: ['启动后 10 日内产出背景诊断报告', '第 2 个月完成选校方案与科研规划', '关键文书支持 3 轮质检与校友点评'],
    caseIds: ['case-1', 'case-2'],
  },
  {
    id: 'uk-pg-fasttrack',
    category: '硕士申请',
    title: '英国硕士高效通关计划',
    tagline: '覆盖 UK G5 与热门商科/传媒/教育项目，6 个月内完成所有申请材料。',
    priceRange: { min: 56000, max: 88000, currency: 'CNY' },
    duration: '6-9 个月',
    deliverables: [
      '个性化专业排序与录取概率评估',
      '推荐信策划与润色',
      'PS/Essay 多版本打磨',
      '申请提交前 48 小时内双人复核',
      '签证材料预审与入学衔接辅导',
    ],
    guarantees: ['G5 + Top15 至少 3 个项目递交', '1v1 Offer 跟进与面试指导', '提供选校备选清单与风险预案'],
    suitableFor: ['目标英国 G5 或罗素集团院校的本科生', '希望快速完成申请且兼顾学业/实习的学生', '需要英语写作与面试提升的学生'],
    processHighlights: ['首月完成选校与时间表确认', '第 2 月完成推荐信与 PS 初稿', '第 3 月完成全部材料递交'],
    caseIds: ['case-3'],
  },
  {
    id: 'research-mentorship',
    category: '背景提升',
    title: '名校科研导师共创项目',
    tagline: '与海外名校导师开展 8 周科研实践，沉淀可用于申请的高含金量成果。',
    priceRange: { min: 42000, max: 52000, currency: 'CNY' },
    duration: '8-10 周',
    deliverables: [
      '科研主题匹配报告与导师匹配',
      '导师每周 1v1 指导会议',
      '研究方法训练营与数据分析支持',
      '研究成果展示会与评估报告',
      '可发表的研究摘要/论文草稿',
    ],
    guarantees: ['导师来自 QS 前 100 院校或行业实验室', '输出导师推荐信或评估信', '优秀成果可推荐参加国际会议/竞赛'],
    suitableFor: ['准备冲刺 STEM/商科等高竞争项目的学生', '缺少科研经历需要短期强化的学生', '希望与海外导师建立长期联系的学生'],
    processHighlights: ['1 周内完成导师匹配', '第 4 周提交中期成果报告', '项目结束两周内获得导师评估信'],
    caseIds: ['case-2'],
  },
];

export const INSTITUTION_SERVICE_FLOW: ServiceFlowStep[] = [
  {
    id: 'diagnosis',
    title: '阶段 1 · 背景诊断与目标对齐',
    description: '顾问组织 90 分钟深度访谈，结合学生数据形成《升学诊断报告》并明确冲刺梯队。',
    timeframe: 'T+7 天',
    owner: '首席顾问 / 学术规划师',
    deliverable: '《升学诊断与行动规划》',
    reminder: '家长可通过 App 实时查看诊断报告与行动建议',
  },
  {
    id: 'planning',
    title: '阶段 2 · 选校策略与背景提升',
    description: '联合教研团队制定选校矩阵与活动/科研规划，启动导师匹配与资源对接。',
    timeframe: 'T+30 天',
    owner: '资深顾问 / 活动策划',
    deliverable: '《年度选校与背景提升路线图》',
  },
  {
    id: 'essays',
    title: '阶段 3 · 文书共创与材料准备',
    description: '文书导师与学生共创故事线，进行多轮润色；同时推进推荐信、成绩、财务材料校验。',
    timeframe: 'T+60~120 天',
    owner: '文书导师 / 交付经理',
    deliverable: '全套文书定稿 + 推荐信样稿',
    reminder: '关键信息同步给家长并保存在文档中心',
  },
  {
    id: 'submission',
    title: '阶段 4 · 网申提交与面试辅导',
    description: '交付团队完成网申填报、材料上传与 QA 检查；提供面试营与模拟面试演练。',
    timeframe: 'T+120~180 天',
    owner: '交付经理 / 面试教练',
    deliverable: '《提交校清单》与面试反馈记录',
  },
  {
    id: 'offer-followup',
    title: '阶段 5 · Offer 选择与入学衔接',
    description: '顾问协助解读录取与奖学金方案，规划签证与入学准备，并启动新生衔接工作坊。',
    timeframe: 'Offer 发放期',
    owner: '首席顾问 / 入学辅导教练',
    deliverable: '入学事项清单 · 奖学金申请支持',
    reminder: '提供家长陪伴营与新生指南，确保顺利过渡',
  },
];

export const INSTITUTION_CASES: CaseStudy[] = [
  {
    id: 'case-1',
    title: '托福 95 的国际课程生，逆袭南加大工程学院',
    studentProfile: 'GPA 3.6 / AP 5 门 / 机器人竞赛全国三等奖',
    challenge: '标化略低、缺少硬核科研；沟通表达较为内向，面试表现紧张。',
    strategy: [
      '匹配南加大博士后导师开展智能制造科研实践，输出论文初稿',
      '设计“制造业数字化”主题社会调研，强化社会责任故事线',
      '引入戏剧表达教练提升面试表现，自信讲述项目经历',
    ],
    results: {
      outcome: '获得南加大工程学院录取',
      scholarship: '50% 学费减免（约 USD 32,000）',
      offerList: ['USC Viterbi', 'UIUC Engineering', 'Purdue Engineering', 'UW Seattle'],
    },
    advisorComment: '学生技术能力强但表达弱，我们通过“场景化叙事 + 实战成果”补齐短板，最终拿到理想录取与奖学金。',
    tags: ['工程', '背景提升', '奖学金'],
    timeline: '2023.04 - 2024.03',
    assets: ['科研成果摘要', '社会调研白皮书', '面试反馈报告'],
    coverImage: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'case-2',
    title: '高中竞赛与科研协同，让理科女生收获 CMU 录取',
    studentProfile: '市重点高中理科生 / AMC12 证书 / 科创大赛二等奖',
    challenge: '缺少系统项目成果，目标院校竞争激烈，需要凸显跨学科优势。',
    strategy: [
      '安排参加硅谷企业导师远程实习，完成数据驱动的产品增长项目',
      '组织 AI for Social Good 主题夏校，打造公益科技项目案例',
      '文书围绕“用算法改善弱势群体生活”构建连续叙事',
    ],
    results: {
      outcome: '录取卡内基梅隆计算机科学学院',
      offerList: ['CMU SCS', 'Georgia Tech CS', 'UIUC CS', 'HKUST CS'],
    },
    advisorComment: '关键在于梳理“技术+社会影响”的独特定位，同时通过导师项目打造可验证成果。',
    tags: ['计算机', '实习项目', '夏校'],
    timeline: '2022.12 - 2023.10',
    assets: ['导师推荐信', '项目汇报 PPT', 'AI 公益项目 Demo'],
    coverImage: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'case-3',
    title: '跨专业转传媒研究生，拿下 LSE 与 KCL 双录',
    studentProfile: '国内 985 大学计算机专业 / GPA 3.5 / 有两段互联网实习',
    challenge: '跨专业申请缺少传媒背景，需要构建“技术+内容”的个人品牌。',
    strategy: [
      '安排参与英国独立媒体实验室项目，完成数据新闻作品集',
      '指导学生拍摄纪录片短片，凸显技术与内容融合能力',
      '文书强调“用数字化提升公共传播效率”的洞察与规划',
    ],
    results: {
      outcome: '获得 LSE Media & Communications / KCL Digital Humanities 录取',
      offerList: ['LSE', 'KCL', 'Warwick', 'Leeds'],
    },
    advisorComment: '我们聚焦学生的“技术驱动内容”优势，利用项目成果与作品集打造差异化竞争力。',
    tags: ['跨专业', '传媒', '作品集'],
    timeline: '2023.02 - 2023.12',
    assets: ['数据新闻作品集', '纪录片短片', '导师推荐信'],
    coverImage: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INSTITUTION_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: '陈若琳',
    title: '首席留学顾问 · 前常春藤招生官',
    expertise: ['美本策略', '招生评估', '面试辅导'],
    bio: '曾任宾夕法尼亚大学招生官，擅长学术潜力评估与文书定位，为超过 320 名学生拿下美本 Top30 录取。',
    experienceYears: 12,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    successCases: 180,
  },
  {
    id: 'team-2',
    name: 'Jacob Wilson',
    title: '学术导师 · MIT 计算机博士',
    expertise: ['计算机', 'AI 研究', '项目指导'],
    bio: '原谷歌 AI 研究员，负责设计算法科研项目，帮助学生输出可发表的学术成果与技术简历。',
    experienceYears: 8,
    avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
    successCases: 95,
  },
  {
    id: 'team-3',
    name: '王慧敏',
    title: '交付总监 · 文书写作教练',
    expertise: ['文书共创', '故事线设计', '项目管理'],
    bio: '曾任纽约大学写作导师，擅长发掘学生故事与语言风格，负责交付管理与质检体系设计。',
    experienceYears: 10,
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    successCases: 210,
  },
  {
    id: 'team-4',
    name: '李骁',
    title: '家长陪伴官',
    expertise: ['家校沟通', '心理支持', '时间管理'],
    bio: '拥有家庭教育指导师认证，负责家长沟通、情绪陪伴与冲刺期时间管理辅导。',
    experienceYears: 7,
    avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=200&q=80',
    successCases: 160,
  },
];

export const INSTITUTION_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    author: '王同学家长',
    relation: '2024 美本学生家长',
    content:
      '机构的项目管理非常细致，每周都会给我们同步进度。尤其是在面试和选校阶段，顾问团队总能把复杂的决策拆解得一清二楚，让我们做出的每个选择都很安心。',
    highlight: '服务透明，家长有参与感',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    author: 'Lily Chen',
    relation: '英国传媒研究生学员',
    content:
      '从背景挖掘、作品集策划到面试准备，团队给了我很多启发。尤其是跨专业转型，他们帮我搭建了“技术+内容”的个人品牌，最终拿到了 LSE 的录取。',
    highlight: '跨专业申请也能掌握故事主线',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    author: '机构合作高校老师',
    relation: '合作导师',
    content:
      '学生的科研基础各不相同，机构在项目流程设计和沟通节奏上非常专业，能保证学生不仅完成任务，还真正理解科研方法。',
    highlight: '科研项目组织专业，输出有保障',
    rating: 4.5,
  },
];

export const INSTITUTION_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    question: '签约后多久可以开始服务？如何安排导师？',
    answer:
      '签约后 3 个工作日内安排启动会议，7 个自然日内完成背景诊断与导师匹配。导师来自内部签约顾问与外部合作专家，都会通过资质审核并签署服务协议。',
    category: '服务流程',
  },
  {
    id: 'faq-2',
    question: '服务费用如何支付？支持分期吗？',
    answer:
      '支持银行对公转账、企业微信、支付宝三种方式，可选择 3/6/9 期分期方案。所有支付会签署正式合同并开具发票，确保资金安全。',
    category: '费用与合同',
  },
  {
    id: 'faq-3',
    question: '如果申请不成功是否有保障？',
    answer:
      '对于符合条件的项目，我们提供“目标院校递交失败可免费再申一次”以及“无法完成交付将退还未完成部分费用”的保障条款，具体以合同附件为准。',
    category: '服务流程',
  },
  {
    id: 'faq-4',
    question: '我的隐私和材料如何保密？',
    answer:
      '所有文书与申请材料存储在加密的文档系统中，访问需要双重验证，并记录操作日志。只有直接参与项目的顾问团队成员具备访问权限。',
    category: '隐私与安全',
  },
  {
    id: 'faq-5',
    question: '如何预约线下面谈或参加说明会？',
    answer:
      '可通过页面底部的“预约咨询”按钮提交需求，我们会在 24 小时内安排顾问联系，也可直接致电 400 热线或添加微信进行预约。',
    category: '其他',
  },
];

export const INSTITUTION_CREDENTIALS: CredentialItem[] = [
  {
    id: 'credential-1',
    type: '营业执照',
    title: '北京学屿教育科技有限公司营业执照',
    issuedBy: '北京市朝阳区市场监督管理局',
    issueDate: '2020-06-18',
    credentialNumber: '911101053511XXXX1K',
    description: '经营范围涵盖教育咨询、出国留学中介服务等（依法须经批准的项目，经相关部门批准后方可开展经营活动）。',
    mediaUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    caution: '仅限内部核验使用，外发请加水印。',
  },
  {
    id: 'credential-2',
    type: '办学许可证',
    title: '教育培训办学许可证',
    issuedBy: '北京市教育委员会',
    issueDate: '2021-03-12',
    expireDate: '2026-03-11',
    credentialNumber: '教民111010000XXXX',
    description: '批准科目包含外语培训、留学申请咨询等，许可范围内提供相关培训服务。',
    mediaUrl: 'https://images.unsplash.com/photo-1529429617124-aee60036486b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'credential-3',
    type: '合作认证',
    title: '美国高等教育国际招生协会（AIRC）认证机构',
    issuedBy: 'AIRC 国际招生协会',
    issueDate: '2022-09-01',
    description: '通过协会的质量评估，获得官方认证，可参与合作院校招生宣讲与培训。',
    mediaUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'credential-4',
    type: '获奖证书',
    title: '2024 年度出国留学服务诚信机构',
    issuedBy: '中国留学服务行业协会',
    issueDate: '2024-01-18',
    description: '因在服务规范、口碑评价等方面表现突出获得行业诚信奖项。',
    mediaUrl: 'https://images.unsplash.com/photo-1596496050750-96959e3f77e3?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INSTITUTION_LOCATIONS: LocationItem[] = [
  {
    id: 'location-1',
    name: '北京总部 · 望京中心',
    address: '北京市朝阳区望京 SOHO T2 15 层',
    contactPhone: '010-5869 8890',
    businessHours: '周一至周日 10:00-19:00',
    transportGuide: ['地铁 14 号线望京南站 C 口出，步行 8 分钟', '地铁 15 号线望京站 B 口出，步行 5 分钟'],
    mapUrl: 'https://maps.google.com/?q=Beijing+Wangjing+SOHO',
  },
  {
    id: 'location-2',
    name: '上海中心 · 陆家嘴学习体验馆',
    address: '上海市浦东新区银城中路 68 号时代金融中心 12 层',
    contactPhone: '021-6888 1020',
    businessHours: '周二至周日 10:00-20:00',
    transportGuide: ['地铁 2 号线陆家嘴站 6 号口出，步行 3 分钟', '可预约停车位，地库 B2 层'],
    mapUrl: 'https://maps.google.com/?q=Shanghai+Lujiazui',
  },
  {
    id: 'location-3',
    name: '线上服务中心',
    address: '全球远程支持，覆盖不同时区',
    contactPhone: '+86-400-123-8880',
    businessHours: '7*24 小时在线顾问',
    transportGuide: ['提供 Zoom / Teams / SkyOffice 远程会议', '支持微信群实时咨询'],
    mapUrl: 'https://sky-office.co/',
  },
];

export const INSTITUTION_PAYMENT_CHANNELS: PaymentChannel[] = [
  {
    id: 'payment-1',
    type: 'bank',
    displayName: '公司对公账户',
    bankName: '招商银行北京望京支行',
    accountMasked: '*** 1234',
    accountFull: '1109 2018 2910 1234',
    notes: '请在汇款附言备注学生姓名+项目，到账后 2 小时内确认。',
    lastVerifiedAt: '2025-11-10',
    contactPerson: '财务主管 · 刘敏',
  },
  {
    id: 'payment-2',
    type: 'wechat',
    displayName: '企业微信收款',
    accountMasked: '学屿教育官方收款',
    accountFull: '企业微信 · 学屿教育（北京）有限公司',
    qrCodeUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
    notes: '扫描二维码付款后请截图发送给服务顾问确认。',
    lastVerifiedAt: '2025-11-08',
    contactPerson: '客户成功经理 · 张慧',
  },
  {
    id: 'payment-3',
    type: 'alipay',
    displayName: '支付宝商家账户',
    accountMasked: '学屿教育（北京）有限公司',
    accountFull: 'alipay@studylandsedu.com',
    qrCodeUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    notes: '支持花呗分期，可选择 3/6/9 期，手续费详询顾问。',
    lastVerifiedAt: '2025-11-05',
    contactPerson: '财务助理 · 王雪',
  },
];

export const INSTITUTION_CONTACTS: ContactEntry[] = [
  {
    id: 'contact-1',
    label: '全国热线',
    value: '400-888-7788',
    type: 'phone',
  },
  {
    id: 'contact-2',
    label: '商务合作',
    value: 'partner@studylandsedu.com',
    type: 'email',
  },
  {
    id: 'contact-3',
    label: '官方客服微信',
    value: 'StudyLandsEdu-Official',
    type: 'wechat',
    actionLabel: '复制微信号',
  },
  {
    id: 'contact-4',
    label: '预约咨询表单',
    value: 'https://studylandsedu.typeform.com/to/consult',
    type: 'form',
    actionLabel: '立即预约',
  },
  {
    id: 'contact-5',
    label: '小程序',
    value: '学屿留学服务助手',
    type: 'mini-program',
  },
];

// lucide-react does not export Shield default; use import? need to import at top. forgot.

