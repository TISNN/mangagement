// 服务类型定义
export type ServiceType = 
  | '语言培训' 
  | '标化培训' 
  | '全包申请' 
  | '半DIY申请' 
  | '研学' 
  | '课业辅导' 
  | '科研指导' 
  | '作品集辅导'
  | '未知服务'; // 添加额外的服务类型用于处理未知服务

// 服务状态
export type ServiceStatus = 
  | '未开始'
  | '进行中'
  | '已完成'
  | '已暂停'
  | '已取消';

// 获取服务图标的辅助函数
export function getServiceIcon(serviceType: ServiceType): string {
  switch (serviceType) {
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
    default:
      return 'FileCheck';
  }
}

// 获取服务状态样式
export function getServiceStatusStyle(status: ServiceStatus | string): string {
  switch (status) {
    case '进行中':
      return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    case '已暂停':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    case '已完成':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    case '已取消':
      return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    case '未开始':
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
  }
} 