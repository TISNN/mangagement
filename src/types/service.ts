// 服务类型别名（统一使用字符串，兼容数据库配置）
export type ServiceType = string;

// 服务分类，用于根据服务名称推断展示分组与图标
export type ServiceCategory =
  | '语言培训'
  | '标化培训'
  | '全包申请'
  | '半DIY申请'
  | '研学'
  | '课业辅导'
  | '科研指导'
  | '作品集辅导'
  | '申诉服务'
  | '签证办理'
  | '其他服务';

// 旧版服务状态枚举（仍被部分组件引用）
export type ServiceStatusLegacy =
  | '未开始'
  | '进行中'
  | '已完成'
  | '已暂停'
  | '已取消';

export type StudentServiceStatusValue =
  | 'not_started'
  | 'in_progress'
  | 'applying'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

export const SERVICE_STATUS_OPTIONS: Array<{ value: StudentServiceStatusValue; label: string }> = [
  { value: 'not_started', label: '未开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'on_hold', label: '已暂停' },
  { value: 'cancelled', label: '已取消' },
];

const STATUS_VALUE_TO_LABEL: Record<StudentServiceStatusValue, string> = {
  not_started: '未开始',
  in_progress: '进行中',
  applying: '进行中',
  completed: '已完成',
  on_hold: '已暂停',
  cancelled: '已取消',
};

const STATUS_LABEL_TO_VALUE: Record<string, StudentServiceStatusValue> = {
  未开始: 'not_started',
  进行中: 'in_progress',
  申请中: 'in_progress',
  已完成: 'completed',
  已暂停: 'on_hold',
  已取消: 'cancelled',
};

export const getServiceStatusLabel = (value: StudentServiceStatusValue): string =>
  STATUS_VALUE_TO_LABEL[value] ?? '未开始';

export const getServiceStatusValue = (label: string): StudentServiceStatusValue =>
  STATUS_LABEL_TO_VALUE[label] ?? 'not_started';

// 根据服务名称推断所属分类
export function getServiceCategory(serviceType: ServiceType): ServiceCategory {
  const categoryMap: Array<{ keywords: string[]; category: ServiceCategory }> = [
    { keywords: ['全包申请'], category: '全包申请' },
    { keywords: ['半DIY申请'], category: '半DIY申请' },
    { keywords: ['语言培训', '雅思', '托福', '小语种', '口语'], category: '语言培训' },
    {
      keywords: ['标化培训', 'AP', 'A-Level', 'ALEVEL', 'IB', 'SAT', 'ACT', 'GRE', 'GMAT'],
      category: '标化培训',
    },
    { keywords: ['课业辅导', '作业辅导'], category: '课业辅导' },
    { keywords: ['研学'], category: '研学' },
    { keywords: ['科研指导'], category: '科研指导' },
    { keywords: ['作品集辅导'], category: '作品集辅导' },
    { keywords: ['申诉'], category: '申诉服务' },
    { keywords: ['签证'], category: '签证办理' },
  ];

  const match = categoryMap.find(({ keywords }) =>
    keywords.some((keyword) => serviceType.includes(keyword)),
  );

  return match ? match.category : '其他服务';
}

// 根据服务分类映射前端展示图标（字符串形式，供 icon 组件动态渲染）
export function getServiceIcon(serviceType: ServiceType): string {
  const category = getServiceCategory(serviceType);

  switch (category) {
    case '语言培训':
      return 'Languages';
    case '标化培训':
      return 'BookOpen';
    case '全包申请':
      return 'Briefcase';
    case '半DIY申请':
      return 'Layers';
    case '研学':
      return 'Award';
    case '课业辅导':
      return 'Book';
    case '科研指导':
      return 'FileCheck';
    case '作品集辅导':
      return 'PenTool';
    case '申诉服务':
      return 'AlertTriangle';
    case '签证办理':
      return 'Globe';
    default:
      return 'FileCheck';
  }
}

// 旧版服务状态样式映射（仍有组件引用）
export function getServiceStatusStyle(status: ServiceStatusLegacy | string): string {
  switch (status) {
    case '进行中':
      return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200';
    case '已暂停':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200';
    case '已完成':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200';
    case '已取消':
      return 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-200';
    case '未开始':
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300';
  }
}
