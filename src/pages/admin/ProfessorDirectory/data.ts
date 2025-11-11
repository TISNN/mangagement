import { FundingIntensity, ProfessorFilterOptions, ProfessorProfile } from './types';

const AVATAR_FALLBACK =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60';

export const PROFESSOR_PROFILES: ProfessorProfile[] = [
  {
    id: 'mit-cs-ai-001',
    name: 'Lydia Hernandez',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=60',
    university: 'Massachusetts Institute of Technology',
    college: 'Computer Science and Artificial Intelligence Laboratory',
    country: '美国',
    city: 'Cambridge, MA',
    researchTags: ['人工智能', '机器学习解释性', '多模态系统'],
    signatureProjects: ['Explainable AI for Healthcare', 'Multimodal Commonsense Reasoning'],
    contactEmail: 'lydia@mit.edu',
    personalPage: 'https://csail.mit.edu/people/lydia-hernandez',
    publications: [
      {
        title: 'Interpretable Temporal Models for Clinical Decision Support',
        year: 2024,
        link: 'https://doi.org/10.1145/xyz',
      },
      {
        title: 'Robust Reasoning across Vision-Language Modalities',
        year: 2023,
      },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '开放 2026 Fall · 更关注有医疗数据经验的候选人',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 105', 'IELTS ≥ 7.5'],
      minimumGPA: '≥ 3.7/4.0',
      publicationsPreferred: 'NeurIPS / ICML 一作或核心期刊二区以上',
      researchExperience: '要求有真实医院或医疗数据科研经历 ≥ 1 年',
      recommendationLetters: 3,
      additionalNotes: '优先考虑有Explainable AI或医疗AI交叉背景的申请者',
    },
    fundingOptions: [
      { type: '全额奖学金', description: '提供 4 年 RA 资助 + 医疗保险' },
      { type: '名额有限', description: '需参与联名科研计划获得额外资助' },
    ],
    applicationWindow: {
      start: '2025-08-01',
      end: '2025-12-15',
      intake: '2026 Fall',
    },
    recentPlacements: [
      { year: 2024, student: 'Chen Y.', destination: 'Google DeepMind', highlight: '联合发表 4 篇顶会论文' },
      { year: 2023, student: 'Priya K.', destination: 'Stanford Medical AI Lab' },
    ],
    lastReviewedAt: '2025-10-28',
    internalNotes:
      '近期新增跨学科项目，与麻省总医院合作，需要学生能与医疗团队沟通。建议提前准备 HIPAA 合规培训证明。',
    matchScore: 94,
    responseTime: '平均 6 天回复',
  },
  {
    id: 'oxford-edu-002',
    name: 'Amelia Wright',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
    university: 'University of Oxford',
    college: 'Department of Education',
    country: '英国',
    city: 'Oxford',
    researchTags: ['教育技术', '学习分析', '大规模在线课程'],
    signatureProjects: ['Learning Analytics for Higher Education', 'AI Tutors for STEM'],
    contactEmail: 'amelia.wright@education.ox.ac.uk',
    personalPage: 'https://www.education.ox.ac.uk/people/amelia-wright',
    publications: [
      { title: 'Learning Analytics for Personalized STEM Pathways', year: 2024 },
      { title: 'Scaling Hybrid Classrooms Across Continents', year: 2022 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '接受 2026 Michaelmas 入学博士候选人',
    phdRequirements: {
      languageTests: ['IELTS ≥ 7.0 (单项不低于 6.5)'],
      minimumGPA: '英国本科 2:1 或同等 GPA ≥ 3.5',
      publicationsPreferred: '教育技术或学习科学核心期刊投稿经历',
      researchExperience: '需要展示数据分析与教学设计结合的项目经验',
      recommendationLetters: 2,
      additionalNotes: '欢迎有亚洲地区教育创新项目经验的候选人',
    },
    fundingOptions: [
      { type: '部分奖学金', description: 'Oxford-Rees 基金可覆盖前两年学费' },
      { type: '名额有限', description: '学院博士助教岗位每年 2 位' },
    ],
    applicationWindow: {
      start: '2025-09-15',
      end: '2026-01-05',
      intake: '2026 Michaelmas',
    },
    recentPlacements: [
      { year: 2023, student: 'Zhang L.', destination: '香港大学教育学院' },
      { year: 2022, student: 'Emma B.', destination: 'OECD 教育创新团队' },
    ],
    lastReviewedAt: '2025-11-02',
    internalNotes: '对多媒体学习分析项目很感兴趣，可提前展示学生手头的课堂数据分析样例。',
    matchScore: 88,
    responseTime: '平均 9 天回复',
  },
  {
    id: 'ntu-material-003',
    name: 'Rajesh Narayanan',
    university: 'Nanyang Technological University',
    college: 'School of Materials Science and Engineering',
    country: '新加坡',
    city: 'Singapore',
    researchTags: ['可持续材料', '电池技术', '固态电解质'],
    signatureProjects: ['Solid-state Batteries for Electric Aviation', 'AI-guided Material Discovery'],
    contactEmail: 'rajesh.n@ntu.edu.sg',
    personalPage: 'https://www.ntu.edu.sg/mse/rajesh',
    publications: [
      { title: 'High Ionic Conductivity Solid-State Electrolytes', year: 2024 },
      { title: 'AI-assisted Materials Discovery Framework', year: 2023 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Aug Intake · 已开放 3 个全奖名额',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 100', 'IELTS ≥ 7.0'],
      minimumGPA: '≥ 3.6/4.0 或 85/100',
      researchExperience: '需要具备电池或能源材料实验室经验',
      recommendationLetters: 3,
      additionalNotes: '需要准备 2 页 research proposal，突出可持续能源背景',
    },
    fundingOptions: [
      { type: '全额奖学金', description: 'NTU Research Scholarship，覆盖全额学费+1800 SGD/月' },
    ],
    applicationWindow: {
      start: '2025-07-01',
      end: '2026-02-01',
      intake: '2026 Aug',
    },
    recentPlacements: [
      { year: 2024, student: 'Nguyen T.', destination: 'Samsung Advanced Institute of Technology' },
      { year: 2022, student: 'Liang Q.', destination: 'Tesla Energy R&D' },
    ],
    lastReviewedAt: '2025-11-06',
    internalNotes: '教授非常重视 Lab rotation，建议申请人准备好实验安全与操作证明。',
    matchScore: 91,
    responseTime: '平均 7 天回复',
  },
  {
    id: 'eth-robotics-004',
    name: 'Markus Steiner',
    university: 'ETH Zürich',
    college: 'Robotics Systems Lab',
    country: '瑞士',
    city: 'Zürich',
    researchTags: ['自主机器人', '山地探索', '多机器人协作'],
    signatureProjects: ['Autonomous Exploration in Alpine Environments', 'Resilient Multi-agent Systems'],
    contactEmail: 'markus.steiner@ethz.ch',
    publications: [
      { title: 'Resilient Multi-Agent Autonomy in Harsh Terrains', year: 2024 },
      { title: 'Adaptive Control for Semi-autonomous Rovers', year: 2023 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 年春季起招募 2 名博士 · 需有机器人竞赛经验',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 103', 'IELTS ≥ 7.5'],
      minimumGPA: '≥ 3.7/4.0',
      researchExperience: '需要具备 ROS/SLAM 相关工程经验及 Field testing 记录',
      recommendationLetters: 3,
      additionalNotes: '鼓励附上 GitHub 与比赛视频，教授亲自筛选',
    },
    fundingOptions: [
      { type: '全额奖学金', description: 'ETH Research Fellowship，提供生活补助 54,000 CHF/年' },
    ],
    applicationWindow: {
      start: '2025-12-01',
      end: '2026-03-15',
      intake: '2026 Spring',
    },
    recentPlacements: [
      { year: 2023, student: 'Diego M.', destination: 'NASA JPL Robotics' },
      { year: 2021, student: 'Hanako S.', destination: 'Toyota Research Institute' },
    ],
    lastReviewedAt: '2025-10-20',
    internalNotes: '教授对可远程操控的机器人测试平台感兴趣，可推荐有无人机/越野车项目的学生。',
    matchScore: 89,
    responseTime: '平均 5 天回复',
  },
  {
    id: 'melbourne-bio-005',
    name: 'Sophie Turner',
    university: 'University of Melbourne',
    college: 'School of Biomedical Sciences',
    country: '澳大利亚',
    city: 'Melbourne',
    researchTags: ['神经科学', '脑机接口', '康复工程'],
    signatureProjects: ['Neural Interfaces for Stroke Rehabilitation', 'Adaptive Neuroprosthetics'],
    contactEmail: 'sophie.turner@unimelb.edu.au',
    publications: [
      { title: 'Closed-loop Neural Interfaces for Motor Recovery', year: 2024 },
      { title: 'Neuroplasticity and Wearable Stimulation Devices', year: 2022 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '招收 2026 年博士 · 倾向生物医学与工程交叉背景',
    phdRequirements: {
      languageTests: ['IELTS ≥ 7.0'],
      minimumGPA: '≥ 80/100 或同等水平',
      researchExperience: '需要具备神经科学相关实验方法与数据分析能力',
      recommendationLetters: 2,
      additionalNotes: '欢迎展示脑电或神经影像分析作品',
    },
    fundingOptions: [
      { type: '部分奖学金', description: 'Melbourne University Scholarship，学费减免 + 1400 AUD/月' },
    ],
    applicationWindow: {
      start: '2025-09-01',
      end: '2026-03-01',
      intake: '2026 Feb',
    },
    recentPlacements: [
      { year: 2024, student: 'Avery H.', destination: 'University of Toronto Rehab Institute' },
    ],
    lastReviewedAt: '2025-10-10',
    internalNotes: '教授注重候选人软技能，建议准备针对患者沟通的案例。',
    matchScore: 82,
    responseTime: '平均 12 天回复',
  },
  {
    id: 'stanford-policy-006',
    name: 'Michael Reynolds',
    university: 'Stanford University',
    college: 'Graduate School of Education · Policy Analysis',
    country: '美国',
    city: 'Stanford, CA',
    researchTags: ['教育政策', 'AI伦理', '高等教育治理'],
    signatureProjects: ['AI Governance for Universities', 'Global Higher Education Benchmarking'],
    contactEmail: 'mreynolds@stanford.edu',
    publications: [
      { title: 'AI Governance Frameworks for Higher Education', year: 2024 },
      { title: 'Policy Innovation in Hybrid University Models', year: 2022 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Fall 招生 · 重点关注 AI 与政策交叉议题',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 110'],
      minimumGPA: '≥ 3.75/4.0',
      publicationsPreferred: '教育政策、AI伦理相关 SSCI 论文经历优先',
      researchExperience: '需要提交政策评估的实证研究作品',
      recommendationLetters: 3,
      additionalNotes: '可附上政策简报或白皮书样例，教授评估写作能力',
    },
    fundingOptions: [
      { type: '全额奖学金', description: '提供 5 年 RA/TA 资助 + 会议基金' },
      { type: '名额有限', description: '联合实验室 Fellowship，每年仅 1 名' },
    ],
    applicationWindow: {
      start: '2025-09-01',
      end: '2025-12-01',
      intake: '2026 Fall',
    },
    recentPlacements: [
      { year: 2024, student: 'Wang J.', destination: 'World Bank Education Global Practice' },
      { year: 2023, student: 'Laura D.', destination: 'UNESCO Education Policy Unit' },
    ],
    lastReviewedAt: '2025-11-03',
    internalNotes: '建议与政策分析模块联动，可提供 Stanford Policy Lab 合作资源。',
    matchScore: 95,
    responseTime: '平均 4 天回复',
  },
  {
    id: 'tokyo-chem-007',
    name: 'Aiko Nakamura',
    university: 'University of Tokyo',
    college: 'Department of Applied Chemistry',
    country: '日本',
    city: 'Tokyo',
    researchTags: ['绿色化工', '催化剂设计', '二氧化碳利用'],
    signatureProjects: ['Catalytic Conversion of CO₂', 'Sustainable Chemical Processes'],
    contactEmail: 'aiko.nakamura@chem.t.u-tokyo.ac.jp',
    publications: [
      { title: 'Multi-dimensional Catalysts for CO₂ Reduction', year: 2024 },
      { title: 'Green Chemistry Pathways in Industrial Processes', year: 2021 },
    ],
    acceptsInternationalStudents: false,
    phdSupervisionStatus: '仅接受日语授课博士 · 可联合培养',
    phdRequirements: {
      languageTests: ['JLPT N1'],
      minimumGPA: '≥ 3.5/4.0',
      researchExperience: '需要具备催化或化学工程实验经验',
      recommendationLetters: 2,
      additionalNotes: '联合培养可使用英语交流，但需提交日语研究计划书',
    },
    fundingOptions: [
      { type: '部分奖学金', description: 'JASSO 奖学金，覆盖生活费 120,000 日元/月' },
    ],
    applicationWindow: {
      start: '2025-10-01',
      end: '2026-02-28',
      intake: '2026 April',
    },
    recentPlacements: [
      { year: 2022, student: 'Sato R.', destination: 'Mitsubishi Chemical R&D' },
    ],
    lastReviewedAt: '2025-09-18',
    internalNotes: '需确认学生具备日语科研写作能力，可协调联合培养方案。',
    matchScore: 70,
    responseTime: '平均 14 天回复',
  },
  {
    id: 'imperial-bioeng-008',
    name: 'Hannah Collins',
    university: 'Imperial College London',
    college: 'Department of Bioengineering',
    country: '英国',
    city: 'London',
    researchTags: ['合成生物学', '生物制造', '生物传感'],
    signatureProjects: ['Biofoundry Automation for Synthetic Biology', 'Smart Biosensors for Diagnostics'],
    contactEmail: 'h.collins@imperial.ac.uk',
    publications: [
      { title: 'Automated Biofoundry Pipelines for Synthetic Biology', year: 2024 },
      { title: 'Flexible Biosensors for Rapid Diagnostics', year: 2023 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Oct Intake · 有工信部联合项目',
    phdRequirements: {
      languageTests: ['IELTS ≥ 7.0 (写作 6.5)'],
      minimumGPA: '≥ 3.6/4.0',
      researchExperience: '需要具备分子生物学或合成生物学实验经验',
      recommendationLetters: 2,
      additionalNotes: '鼓励提交和工业合作的项目案例',
    },
    fundingOptions: [
      { type: '部分奖学金', description: 'Imperial President’s Scholarship，学费减免 + 2100 GBP/月' },
      { type: '名额有限', description: '工业赞助需提交商业合作提案' },
    ],
    applicationWindow: {
      start: '2025-09-01',
      end: '2026-03-31',
      intake: '2026 Oct',
    },
    recentPlacements: [
      { year: 2024, student: 'Lin Q.', destination: 'SynBio Start-up (Series B)' },
      { year: 2021, student: 'Grace P.', destination: 'GSK Bioprocessing' },
    ],
    lastReviewedAt: '2025-11-05',
    internalNotes: '工业导师参与评审，申请人需要准备项目交付报告。',
    matchScore: 87,
    responseTime: '平均 8 天回复',
  },
  {
    id: 'toronto-cs-009',
    name: 'Noah Patel',
    university: 'University of Toronto',
    college: 'Department of Computer Science',
    country: '加拿大',
    city: 'Toronto',
    researchTags: ['机器学习安全', '隐私保护', '可信 AI'],
    signatureProjects: ['Privacy-preserving Adaptive Models', 'Robust AI in Healthcare Settings'],
    contactEmail: 'np@cs.toronto.edu',
    publications: [
      { title: 'Robust Federated Learning under Adversarial Attacks', year: 2024 },
      { title: 'Differential Privacy in Medical AI', year: 2022 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '接受 2026 Fall 博士申请 · 今年增加医疗场景合作',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 105'],
      minimumGPA: '≥ 3.75/4.0',
      publicationsPreferred: 'NeurIPS/ICLR 一作或在投',
      researchExperience: '需要具备隐私保护与安全 AI 研究经验',
      recommendationLetters: 3,
      additionalNotes: '提供与多伦多医学院合作的联合指导机会',
    },
    fundingOptions: [
      { type: '全额奖学金', description: '提供 RA 资助 + 会议差旅补贴 3000 CAD/年' },
    ],
    applicationWindow: {
      start: '2025-09-01',
      end: '2025-12-15',
      intake: '2026 Fall',
    },
    recentPlacements: [
      { year: 2024, student: 'Emily C.', destination: 'Meta AI 安全性团队' },
      { year: 2022, student: 'Rahul P.', destination: 'Microsoft Research' },
    ],
    lastReviewedAt: '2025-11-01',
    internalNotes: '教授近期关注医疗 AI 可解释性，可提前准备真实案例。',
    matchScore: 92,
    responseTime: '平均 6 天回复',
  },
  {
    id: 'ucl-urban-010',
    name: 'Fatima Hassan',
    university: 'University College London',
    college: 'Bartlett Centre for Advanced Spatial Analysis',
    country: '英国',
    city: 'London',
    researchTags: ['智慧城市', '城市数据平台', 'AI 城市治理'],
    signatureProjects: ['City Digital Twin Platform', 'Urban Resilience Analytics'],
    contactEmail: 'f.hassan@ucl.ac.uk',
    publications: [
      { title: 'Digital Twin Infrastructure for Resilient Cities', year: 2023 },
      { title: 'AI-assisted Urban Governance Playbook', year: 2022 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Sep Intake · 聚焦数字孪生城市治理',
    phdRequirements: {
      languageTests: ['IELTS ≥ 7.0 (写作 6.5)'],
      minimumGPA: '≥ 3.5/4.0',
      researchExperience: '需要具备城市数据分析或空间模型经验',
      recommendationLetters: 2,
      additionalNotes: '欢迎展示政府合作案例或数字孪生作品集',
    },
    fundingOptions: [
      { type: '部分奖学金', description: 'UCL Urban Innovation Fund，提供学费减免与项目补贴' },
    ],
    applicationWindow: {
      start: '2025-08-15',
      end: '2026-02-28',
      intake: '2026 Sep',
    },
    recentPlacements: [
      { year: 2023, student: 'Ibrahim S.', destination: 'World Bank Smart Cities Program' },
    ],
    lastReviewedAt: '2025-10-12',
    internalNotes: '合作方包括伦敦智慧城市办公室，可安排远程访谈。',
    matchScore: 84,
    responseTime: '平均 10 天回复',
  },
  {
    id: 'hkust-fintech-011',
    name: 'Grace Lau',
    university: 'Hong Kong University of Science and Technology',
    college: 'Department of Finance & Technology',
    country: '中国香港',
    city: 'Hong Kong',
    researchTags: ['金融科技', '量化风险', '监管科技'],
    signatureProjects: ['AI-driven Risk Scoring', 'Digital Asset Governance'],
    contactEmail: 'gracelau@ust.hk',
    publications: [
      { title: 'RegTech Adoption in Cross-border Finance', year: 2024 },
      { title: 'AI-driven Risk Scoring Framework', year: 2023 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Fall 招生 · 聚焦跨境数字资产监管',
    phdRequirements: {
      languageTests: ['TOEFL ≥ 102'],
      minimumGPA: '≥ 3.6/4.0',
      researchExperience: '需要具备量化模型或宏观金融研究背景',
      recommendationLetters: 3,
      additionalNotes: '需提交 2 篇金融或计算机交叉论文作为写作样例',
    },
    fundingOptions: [
      { type: '全额奖学金', description: 'HKUST Research Studentship，约 216,000 HKD/年' },
      { type: '名额有限', description: '与金管局联合项目仅 1 名额' },
    ],
    applicationWindow: {
      start: '2025-09-01',
      end: '2026-01-31',
      intake: '2026 Fall',
    },
    recentPlacements: [
      { year: 2024, student: 'Li Z.', destination: 'Monetary Authority of Singapore' },
    ],
    lastReviewedAt: '2025-11-04',
    internalNotes: '教授对候选人英文写作要求高，可提供写作辅导建议。',
    matchScore: 90,
    responseTime: '平均 5 天回复',
  },
  {
    id: 'helsinki-hci-012',
    name: 'Elina Koskinen',
    university: 'University of Helsinki',
    college: 'Department of Computer Science · HCI Group',
    country: '芬兰',
    city: 'Helsinki',
    researchTags: ['人机交互', '无障碍设计', '社会影响评估'],
    signatureProjects: ['Inclusive AI Interfaces', 'Digital Wellbeing in Nordic Cities'],
    contactEmail: 'elina.koskinen@helsinki.fi',
    publications: [
      { title: 'Designing Affective Interfaces for Accessibility', year: 2023 },
      { title: 'Evaluating Social Impact of AI Systems', year: 2021 },
    ],
    acceptsInternationalStudents: true,
    phdSupervisionStatus: '2026 Aug Intake · 优先女性候选人与多元背景',
    phdRequirements: {
      languageTests: ['IELTS ≥ 6.5'],
      minimumGPA: '≥ 3.4/4.0',
      researchExperience: '需要具备 HCI 研究方法与用户研究经验',
      recommendationLetters: 2,
      additionalNotes: '鼓励提交设计作品集或用户研究报告',
    },
    fundingOptions: [
      { type: '部分奖学金', description: '联合产业项目提供 1500 EUR/月 资助' },
    ],
    applicationWindow: {
      start: '2025-05-01',
      end: '2025-12-31',
      intake: '2026 Aug',
    },
    recentPlacements: [
      { year: 2023, student: 'Mia L.', destination: 'Spotify Accessibility Team' },
    ],
    lastReviewedAt: '2025-09-26',
    internalNotes: '教授非常重视候选人对多元文化的理解，可安排线上研讨见面。',
    matchScore: 80,
    responseTime: '平均 11 天回复',
  },
];

export const getProfessorFilterOptions = (): ProfessorFilterOptions => {
  const countries = new Set<string>();
  const fundingTypes = new Set<string>();
  const intakes = new Set<string>();
  const universitiesByCountry: Record<string, Set<string>> = {};
  const researchTagsByCountry: Record<string, Set<string>> = {};
  const tagFrequency: Record<string, number> = {};

  PROFESSOR_PROFILES.forEach((profile) => {
    countries.add(profile.country);

    if (!universitiesByCountry[profile.country]) {
      universitiesByCountry[profile.country] = new Set<string>();
    }
    universitiesByCountry[profile.country]!.add(profile.university);

    if (!researchTagsByCountry[profile.country]) {
      researchTagsByCountry[profile.country] = new Set<string>();
    }
    profile.researchTags.forEach((tag) => {
      researchTagsByCountry[profile.country]!.add(tag);
      tagFrequency[tag] = (tagFrequency[tag] ?? 0) + 1;
    });

    profile.fundingOptions.forEach((item) => fundingTypes.add(item.type));
    intakes.add(profile.applicationWindow.intake);
  });

  const sortedCountries = Array.from(countries).sort();
  const toSortedArray = (record: Record<string, Set<string>>) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, Array.from(value).sort()]),
    );

  const topResearchTags = Object.entries(tagFrequency)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    })
    .map(([tag]) => tag);

  return {
    countries: sortedCountries,
    universitiesByCountry: toSortedArray(universitiesByCountry),
    researchTagsByCountry: toSortedArray(researchTagsByCountry),
    topResearchTags,
    fundingTypes: Array.from(fundingTypes).sort() as FundingIntensity[],
    intakes: Array.from(intakes).sort(),
  };
};

export const getProfessorAvatar = (profile: ProfessorProfile) => profile.avatar ?? AVATAR_FALLBACK;

