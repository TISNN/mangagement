// 部门选项
export const departmentOptions = [
  { id: 'all', name: '全部部门' },
  { id: 'marketing', name: '市场部' },
  { id: 'development', name: '研发部' },
  { id: 'design', name: '设计部' },
  { id: 'hr', name: '人力资源部' },
  { id: 'sales', name: '销售部' },
  { id: 'management', name: '管理层' },
  { id: 'international', name: '国际部' },
  { id: 'regional', name: '区域管理' },
];

// 状态选项
export const statusOptions = [
  { id: 'all', name: '全部状态' },
  { id: 'active', name: '在职' },
  { id: 'on_leave', name: '休假中' },
  { id: 'resigned', name: '已离职' },
];

// 员工类型选项
export const employeeTypeOptions = [
  { id: 'all', name: '全部类型' },
  { id: 'employee', name: '普通员工' },
  { id: 'partner', name: '合伙人' },
];

// 状态文本映射
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '在职';
    case 'on_leave':
      return '休假中';
    case 'resigned':
      return '已离职';
    default:
      return status;
  }
};

// 状态样式映射
export const getStatusStyle = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    case 'on_leave':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'resigned':
      return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}; 