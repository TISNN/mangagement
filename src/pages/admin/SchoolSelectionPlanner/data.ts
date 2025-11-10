import type {
  CandidateProgram,
  DecisionSnapshot,
  ManualFilterPreset,
  MeetingPlan,
  RecommendationDefinition,
  RecommendationVersion,
  StudentDataBundle,
  StudentSummary,
  WeightConfig,
} from './types';

const lmyProfile = {
  name: '李沐阳',
  programGoal: '2026 Fall 美国 CS 硕士',
  background: ['GPA 3.7/4.0', 'TOEFL 106', 'GRE 325', '中科大计算机', '三段科研 + 一段大厂实习'],
  targetIntake: '2026 Fall',
  preferedCountries: ['美国', '加拿大'],
  targetDistribution: { sprint: 30, match: 50, safety: 20 },
  undergraduate: '中国科学技术大学 · 计算机科学与技术',
  gpa: '3.7 / 4.0',
  languageScore: 'TOEFL 106',
  standardizedTests: ['GRE 325（V156 / Q169）'],
  researchHighlights: ['AI Lab 顶会论文二作', '多模态推荐系统科研项目'],
  internshipHighlights: ['字节跳动 数据平台实习', '硅谷初创远程实习'],
  targetRegions: ['美国 北部', '加拿大'],
  targetSchools: ['MIT', 'CMU', 'UIUC'],
  targetPrograms: ['Computer Science', 'Software Engineering'],
};

const lmyRecommendations: RecommendationDefinition[] = [
  {
    id: 'mit-cs',
    school: 'MIT',
    program: 'MEng in Computer Science',
    level: '冲刺',
    baseScore: 92,
    rationale: '科研成果与目标项目高度匹配，建议强化推荐信组合以支撑冲刺。',
    highlight: ['冲刺', 'AI 推荐', '科研匹配'],
    requirements: ['补充一封海外教授推荐信', '进一步量化科研成果'],
    caseReference: '参考案例：2024 Fall 张同学录取，背景相似，科研+教授背书关键。',
    strengths: ['ranking', 'research', 'language'],
  },
  {
    id: 'cmu-se',
    school: 'CMU',
    program: 'MS in Software Engineering',
    level: '匹配',
    baseScore: 88,
    rationale: '课程结构契合学生实习经历，项目强调工程落地能力。',
    highlight: ['匹配', '工程导向', '签证友好'],
    requirements: ['建议提前准备 coding assignment', '补充一个开源项目成果'],
    caseReference: '参考案例：2023 Fall 王同学录取，强调项目作品集展示。',
    strengths: ['ranking', 'internship', 'location'],
  },
  {
    id: 'neu-is',
    school: 'Northeastern University',
    program: 'MS in Information Systems',
    level: '保底',
    baseScore: 81,
    rationale: '过往录取率高，课程实践性强，适合作为保底选项。',
    highlight: ['保底', 'Co-op 实习', '城市资源丰富'],
    requirements: ['准备额外的职业规划陈述', '强调实习成果与职业目标关联'],
    strengths: ['internship', 'budget', 'location'],
  },
];

const lmyVersions: RecommendationVersion[] = [
  {
    id: 'v3',
    createdAt: '2025-11-06 10:30',
    createdBy: '王晓曼（首席顾问）',
    summary: '调整冲刺档位比重，新增 CMU SE 项目并保留 NEU 作为保底。',
    adopted: true,
  },
  {
    id: 'v2',
    createdAt: '2025-11-02 14:15',
    createdBy: 'AI Copilot',
    summary: '根据学生新增实习经历，提升匹配项目评分并推荐 WPI DS 作为补充。',
    adopted: false,
  },
  {
    id: 'v1',
    createdAt: '2025-10-28 09:05',
    createdBy: 'AI Copilot',
    summary: '首版推荐方案，基于学生初始背景生成冲刺/匹配/保底列表。',
    adopted: false,
  },
];

const lmyManualPresets: ManualFilterPreset[] = [
  {
    id: 'us-top50',
    name: '美国 Top 50 计算机',
    description: '限定 US News Top 50 + CS GRE 320 以上门槛。',
    tags: ['美国', 'CS', '排名'],
  },
  {
    id: 'coop-friendly',
    name: 'Co-op 实习友好',
    description: '注重实习机会、地理位置与就业资源。',
    tags: ['实习', '就业导向'],
  },
  {
    id: 'scholarship',
    name: '含奖学金项目',
    description: '筛选提供奖学金或助研岗位的项目，满足预算要求。',
    tags: ['奖学金', '预算控制'],
  },
];

const lmyCandidates: CandidateProgram[] = [
  {
    id: 'uiuc-cs',
    school: 'UIUC',
    program: 'MS in Computer Science',
    source: '人工添加',
    stage: '冲刺',
    status: '待讨论',
    notes: '课程强但竞争激烈，需准备数学背景补充材料。',
    owner: '刘海（资深顾问）',
  },
  {
    id: 'uw-msds',
    school: 'University of Washington',
    program: 'MS in Data Science',
    source: 'AI推荐',
    stage: '匹配',
    status: '通过',
    notes: '学生表达强烈兴趣，需关注推荐信要求和 rolling 截止。',
    owner: '王晓曼（首席顾问）',
  },
  {
    id: 'asu-cs',
    school: 'Arizona State University',
    program: 'MS in Computer Science',
    source: 'AI推荐',
    stage: '保底',
    status: '通过',
    notes: '保留为安全选项，确认是否需要额外课程预修。',
    owner: '刘海（资深顾问）',
  },
];

const lmyMeetings: MeetingPlan[] = [
  {
    id: 'student-sync',
    type: '学生会议',
    title: '学生协同选校沟通',
    date: '2025-11-12 19:30',
    attendees: ['李沐阳', '王晓曼', '刘海'],
    agenda: ['回顾 AI 推荐方案亮点', '逐一确认候选项目意向', '记录学生疑问与补充材料'],
    actions: ['准备互动投票链接', '生成会议议程卡片', '同步文书团队需求'],
  },
  {
    id: 'advisor-sync',
    type: '顾问会商',
    title: '顾问团队策略讨论',
    date: '2025-11-10 15:00',
    attendees: ['王晓曼', '刘海', '赵明（美研顾问）'],
    agenda: ['评估冲刺院校可行性', '分配补充调研任务', '确认下一步对学生建议'],
    actions: ['创建调研任务分派', '更新顾问协作记录', '准备讨论纪要模版'],
  },
];

const lmyDecisions: DecisionSnapshot[] = [
  {
    id: 'snapshot-3',
    title: '方案 v3 确认',
    date: '2025-11-06',
    author: '王晓曼',
    summary: '确定冲刺项目 3 所、匹配 4 所、保底 2 所；新增 CMU SE，移除 WPI DS。',
    attachments: ['v3-院校矩阵.xlsx', '会议纪要-2025-11-06.pdf'],
  },
  {
    id: 'snapshot-2',
    title: '顾问协作纪要',
    date: '2025-11-02',
    author: '刘海',
    summary: '讨论新增 UW DS 及 OSU CS 项目，确认需补充教授推荐信。',
    attachments: ['协作任务清单.csv'],
  },
  {
    id: 'snapshot-1',
    title: '初版 AI 推荐生成',
    date: '2025-10-28',
    author: 'AI Copilot',
    summary: '生成首批 12 个候选项目，标注冲刺/匹配/保底，并提供相似案例对比。',
    attachments: ['ai-推荐-v1.json'],
  },
];

const lmyDefaultWeight: WeightConfig = {
  ranking: 70,
  research: 75,
  internship: 60,
  language: 50,
  budget: 45,
  location: 55,
};

const lmyData: StudentDataBundle = {
  profile: lmyProfile,
  recommendations: lmyRecommendations,
  versions: lmyVersions,
  manualPresets: lmyManualPresets,
  candidates: lmyCandidates,
  meetings: lmyMeetings,
  decisions: lmyDecisions,
  defaultWeightConfig: lmyDefaultWeight,
  defaultRiskPreference: '均衡',
};

const zyxProfile = {
  name: '赵一宁',
  programGoal: '2025 Fall 英国 Finance 硕士',
  background: ['GPA 3.6/4.0', 'IELTS 7.5', '复旦金融', '两段投行实习', '学生会 finance club 主席'],
  targetIntake: '2025 Fall',
  preferedCountries: ['英国', '新加坡'],
  targetDistribution: { sprint: 25, match: 55, safety: 20 },
  undergraduate: '复旦大学 · 金融学',
  gpa: '3.6 / 4.0（排名前 10%）',
  languageScore: 'IELTS 7.5（L8.0 / R7.5 / W7.0 / S7.0）',
  standardizedTests: ['GMAT 720'],
  researchHighlights: ['金融科技课题组 · 区块链专题研究'],
  internshipHighlights: ['高盛投行部暑期实习', '中金公司并购组实习'],
  targetRegions: ['英国 伦敦', '新加坡'],
  targetSchools: ['LSE', 'Imperial', 'Oxford'],
  targetPrograms: ['MSc Finance', 'MFE'],
};

const zyxRecommendations: RecommendationDefinition[] = [
  {
    id: 'lse-mfin',
    school: 'London School of Economics',
    program: 'MSc Finance',
    level: '冲刺',
    baseScore: 90,
    rationale: '课程严谨且口碑领先，适合作为冲刺选项，需强调量化实习成果。',
    highlight: ['冲刺', '量化金融', '伦敦核心'],
    requirements: ['补充一封量化导师推荐', '完善 trading competition 证据'],
    caseReference: '2024 Fall 徐同学录取，量化 research 与交易比赛为亮点。',
    strengths: ['ranking', 'internship', 'location'],
  },
  {
    id: 'imperial-mscfin',
    school: 'Imperial College London',
    program: 'MSc Finance',
    level: '匹配',
    baseScore: 86,
    rationale: '工程背景融合金融，强调数据分析能力，适合作为主力申请。',
    highlight: ['匹配', '数据驱动', '就业资源'],
    requirements: ['准备在线笔试 GMAT 题库', '补充 Python 项目说明'],
    caseReference: '2023 Fall 刘同学录取，突出 FinTech 项目经验。',
    strengths: ['ranking', 'internship', 'language'],
  },
  {
    id: 'smu-mfin',
    school: 'Singapore Management University',
    program: 'MSc Applied Finance',
    level: '保底',
    baseScore: 79,
    rationale: '地区位置优越，就业市场活跃，适合作为保底选项。',
    highlight: ['保底', '新加坡', '就业友好'],
    requirements: ['准备视频面试题库', '强调国际实习经历'],
    strengths: ['internship', 'location', 'budget'],
  },
];

const zyxVersions: RecommendationVersion[] = [
  {
    id: 'b2',
    createdAt: '2025-10-20 16:40',
    createdBy: 'AI Copilot',
    summary: '根据学生新增投行 offer，提升 LSE / Imperial 匹配度。',
    adopted: true,
  },
  {
    id: 'b1',
    createdAt: '2025-09-15 11:20',
    createdBy: '王晓曼（首席顾问）',
    summary: '初版集中于英国与新加坡名校，保留 2 个安全备选。',
    adopted: false,
  },
];

const zyxManualPresets: ManualFilterPreset[] = [
  {
    id: 'uk-top30-fin',
    name: '英国 Top 30 Finance',
    description: '筛选英国主流金融硕士，聚焦伦敦地区资源。',
    tags: ['英国', 'Finance', '伦敦'],
  },
  {
    id: 'asia-fintech',
    name: '亚洲 FinTech 项目',
    description: '关注新加坡与香港的金融科技方向项目。',
    tags: ['FinTech', '亚洲'],
  },
];

const zyxCandidates: CandidateProgram[] = [
  {
    id: 'oxford-mfe',
    school: 'University of Oxford',
    program: 'MFE',
    source: '人工添加',
    stage: '冲刺',
    status: '待讨论',
    notes: '学费较高，需要预算确认；强化实习推荐信。',
    owner: '陈曦（英联顾问）',
  },
  {
    id: 'warwick-mfin',
    school: 'University of Warwick',
    program: 'MSc Finance',
    source: 'AI推荐',
    stage: '匹配',
    status: '通过',
    notes: '排名与就业数据稳定，建议保留。',
    owner: '陈曦（英联顾问）',
  },
  {
    id: 'ntu-mfin',
    school: 'Nanyang Technological University',
    program: 'MSc Finance',
    source: 'AI推荐',
    stage: '保底',
    status: '待讨论',
    notes: '关注申请轮次，申请文书需强调国际视野。',
    owner: '刘海（资深顾问）',
  },
];

const zyxMeetings: MeetingPlan[] = [
  {
    id: 'student-sync-zyx',
    type: '学生会议',
    title: '学生方案确认会',
    date: '2025-10-22 20:00',
    attendees: ['赵一宁', '陈曦', '刘海'],
    agenda: ['确认英国院校冲刺名单', '沟通预算与奖学金策略', '安排 GMAT 刷分计划'],
    actions: ['收集最新 GMAT 成绩单', '整理奖学金申请材料'],
  },
  {
    id: 'advisor-sync-zyx',
    type: '顾问会商',
    title: '顾问内部进展对齐',
    date: '2025-10-18 14:00',
    attendees: ['陈曦', '刘海', '文书负责人 May'],
    agenda: ['评估 LSE 面试准备', '分派文书初稿任务'],
    actions: ['创建文书进度看板', '预定模拟面试时间'],
  },
];

const zyxDecisions: DecisionSnapshot[] = [
  {
    id: 'b-snapshot-2',
    title: '方案 B2 通过',
    date: '2025-10-20',
    author: '陈曦',
    summary: '确认冲刺 LSE / Oxford，匹配 Imperial / Warwick，保底 SMU / NTU。',
    attachments: ['B2-院校矩阵.xlsx'],
  },
  {
    id: 'b-snapshot-1',
    title: '初版建议',
    date: '2025-09-15',
    author: 'AI Copilot',
    summary: '结合投行背景生成英国与亚洲金融项目列表。',
    attachments: ['ai-推荐-finance-v1.json'],
  },
];

const zyxDefaultWeight: WeightConfig = {
  ranking: 65,
  research: 40,
  internship: 75,
  language: 60,
  budget: 55,
  location: 70,
};

const zyxData: StudentDataBundle = {
  profile: zyxProfile,
  recommendations: zyxRecommendations,
  versions: zyxVersions,
  manualPresets: zyxManualPresets,
  candidates: zyxCandidates,
  meetings: zyxMeetings,
  decisions: zyxDecisions,
  defaultWeightConfig: zyxDefaultWeight,
  defaultRiskPreference: '稳健',
};

export const STUDENTS: StudentSummary[] = [
  { id: 'student-lmy', name: '李沐阳', intake: '2026 Fall', goal: '美国 CS 硕士', tags: ['计算机', '美研'] },
  { id: 'student-zyx', name: '赵一宁', intake: '2025 Fall', goal: '英国 Finance 硕士', tags: ['金融', '英联'] },
];

export const STUDENT_DATA: Record<string, StudentDataBundle> = {
  'student-lmy': lmyData,
  'student-zyx': zyxData,
};
