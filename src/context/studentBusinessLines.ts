export type StudentBusinessLine =
  | 'study_application'
  | 'language_training'
  | 'standardized_test'
  | 'academic_support'
  | 'research_guidance'
  | 'portfolio_coaching'
  | 'visa_service'
  | 'appeal_service'
  | 'other';

const BUSINESS_LINE_PRIORITY: StudentBusinessLine[] = [
  'study_application',
  'language_training',
  'standardized_test',
  'academic_support',
  'research_guidance',
  'portfolio_coaching',
  'visa_service',
  'appeal_service',
  'other',
];

export const STUDY_APPLICATION_LINE: StudentBusinessLine = 'study_application';
export const DEFAULT_BUSINESS_LINE: StudentBusinessLine = 'other';

export const BUSINESS_LINE_META: Record<
  StudentBusinessLine,
  {
    label: string;
    description: string;
    accentBg: string;
    accentText: string;
    brandColor: string;
  }
> = {
  study_application: {
    label: '留学申请',
    description: '涉及申请规划、文书、网申与录取跟进的全流程项目。',
    accentBg: 'bg-blue-50 dark:bg-blue-900/20',
    accentText: 'text-blue-600 dark:text-blue-300',
    brandColor: '#3b82f6',
  },
  language_training: {
    label: '语言培训',
    description: '覆盖雅思、托福、小语种等语言能力提升课程。',
    accentBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    accentText: 'text-emerald-600 dark:text-emerald-300',
    brandColor: '#10b981',
  },
  standardized_test: {
    label: '标化培训',
    description: 'SAT/ACT/GRE/GMAT/AP/IB 等标准化考试辅导项目。',
    accentBg: 'bg-purple-50 dark:bg-purple-900/20',
    accentText: 'text-purple-600 dark:text-purple-300',
    brandColor: '#8b5cf6',
  },
  academic_support: {
    label: '课业辅导',
    description: '聚焦在读学术成绩提升与作业辅导的长期陪伴服务。',
    accentBg: 'bg-orange-50 dark:bg-orange-900/20',
    accentText: 'text-orange-600 dark:text-orange-300',
    brandColor: '#f97316',
  },
  research_guidance: {
    label: '科研指导',
    description: '科研项目规划、导师指导与论文发表等研究类支持。',
    accentBg: 'bg-teal-50 dark:bg-teal-900/20',
    accentText: 'text-teal-600 dark:text-teal-300',
    brandColor: '#14b8a6',
  },
  portfolio_coaching: {
    label: '作品集辅导',
    description: '面向艺术/设计类申请的作品集策划与打磨服务。',
    accentBg: 'bg-pink-50 dark:bg-pink-900/20',
    accentText: 'text-pink-600 dark:text-pink-300',
    brandColor: '#ec4899',
  },
  visa_service: {
    label: '签证服务',
    description: '签证材料准备、面签模拟与出入境合规辅导。',
    accentBg: 'bg-sky-50 dark:bg-sky-900/20',
    accentText: 'text-sky-600 dark:text-sky-300',
    brandColor: '#0ea5e9',
  },
  appeal_service: {
    label: '申诉服务',
    description: '针对录取/签证/申诉等紧急场景的专项支持方案。',
    accentBg: 'bg-red-50 dark:bg-red-900/20',
    accentText: 'text-red-600 dark:text-red-300',
    brandColor: '#ef4444',
  },
  other: {
    label: '其他服务',
    description: '未归类或跨业务的试点项目与定制化服务。',
    accentBg: 'bg-gray-100 dark:bg-gray-800/60',
    accentText: 'text-gray-600 dark:text-gray-300',
    brandColor: '#6b7280',
  },
};

const mapServiceToBusinessLine = (category: string, serviceName: string): StudentBusinessLine => {
  const normalizedCategory = category?.trim();
  const normalizedName = serviceName?.toLowerCase() ?? '';

  switch (normalizedCategory) {
    case '全包申请':
    case '半DIY申请':
      return STUDY_APPLICATION_LINE;
    case '语言培训':
      return 'language_training';
    case '标化培训':
      return 'standardized_test';
    case '课业辅导':
      return 'academic_support';
    case '科研指导':
      return 'research_guidance';
    case '作品集辅导':
      return 'portfolio_coaching';
    case '签证办理':
      return 'visa_service';
    case '申诉服务':
      return 'appeal_service';
    default:
      break;
  }

  if (!normalizedName) {
    return DEFAULT_BUSINESS_LINE;
  }

  if (normalizedName.includes('申请') || normalizedName.includes('网申') || normalizedName.includes('文书')) {
    return STUDY_APPLICATION_LINE;
  }
  if (normalizedName.includes('语言') || normalizedName.includes('口语') || normalizedName.includes('雅思') || normalizedName.includes('托福')) {
    return 'language_training';
  }
  if (/(sat|act|gre|gmat|ap|ib|alevel|a-level)/i.test(normalizedName)) {
    return 'standardized_test';
  }
  if (normalizedName.includes('课业') || normalizedName.includes('作业') || normalizedName.includes('辅导')) {
    return 'academic_support';
  }
  if (normalizedName.includes('科研')) {
    return 'research_guidance';
  }
  if (normalizedName.includes('作品集')) {
    return 'portfolio_coaching';
  }
  if (normalizedName.includes('签证')) {
    return 'visa_service';
  }
  if (normalizedName.includes('申诉')) {
    return 'appeal_service';
  }

  return DEFAULT_BUSINESS_LINE;
};

export const deriveBusinessLines = (
  services: Array<{
    service_type?: { category?: string | null; name?: string | null } | null;
  }>,
): StudentBusinessLine[] => {
  const lines = new Set<StudentBusinessLine>();

  services.forEach((service) => {
    const category = service.service_type?.category ?? '';
    const name = service.service_type?.name ?? '';
    lines.add(mapServiceToBusinessLine(category, name));
  });

  if (lines.size === 0) {
    return [DEFAULT_BUSINESS_LINE];
  }

  return Array.from(lines).sort(
    (a, b) => BUSINESS_LINE_PRIORITY.indexOf(a) - BUSINESS_LINE_PRIORITY.indexOf(b),
  );
};


