/**
 * 路由验证工具
 * 用于检查路由是否存在，防止跳转到不存在的页面
 */

/**
 * 所有有效的管理员路由路径集合
 * 这个集合应该与 AppRoutes.tsx 中定义的路由保持一致
 */
const VALID_ADMIN_ROUTES = new Set([
  // 基础路由
  '/admin/dashboard',
  '/admin/tasks',
  '/admin/students',
  '/admin/students-legacy',
  // '/admin/projects', // 服务项目页面已删除
  '/admin/applications',
  '/admin/application-workbench',
  '/admin/application-workstation',
  '/admin/project-mission-board',
  '/admin/service-chronology',
  '/admin/project-marketplace',
  '/admin/institution-introduction',
  '/admin/partner-management',
  '/admin/mentors',
  '/admin/mentor-marketplace',
  '/admin/cloud-docs/knowledge',
  '/admin/interview',
  '/admin/cases',
  '/admin/social',
  '/admin/finance-suite',
  '/admin/services',
  '/admin/ai-chat-assistant',
  '/admin/sky-office',
  '/admin/app-center',
  '/admin/settings',
  
  // 全球数据库
  '/admin/professor-directory',
  '/admin/phd-opportunities',
  '/admin/school-library',
  '/admin/program-library',
  
  // 团队管理
  '/admin/internal-management',
  '/admin/internal-management/employee-and-scheduling',
  '/admin/internal-management/recruitment',
  
  // 留学服务
  '/admin/study-services',
  '/admin/school-selection-planner',
  
  // 教育培训 - 暂时隐藏
  // '/admin/education-training/placement-assessment',
  // '/admin/education-training/scheduling-classroom',
  // '/admin/education-training/learner-portal',
  // '/admin/education-training/tutor-portal',
  
  // CRM 中心
  '/admin/crm-lead-list',
  '/admin/crm-contract-dock',
  '/admin/crm-client-insights',
  '/admin/crm-collaboration-hub',
  '/admin/crm-template-library',
  
  // 云文档
  '/admin/cloud-docs',
  '/admin/cloud-docs/home',
  '/admin/cloud-docs/drive',
  '/admin/cloud-docs/knowledge',
  
  // 知识花园
  '/admin/knowledge-hub',
  '/admin/knowledge-hub/market',
  '/admin/knowledge-hub/market/my-published',
  '/admin/knowledge-hub/garden',
  
  // 服务中心
  '/admin/service-center',
  '/admin/service-center/overview',
  '/admin/service-center/catalog',
  '/admin/service-center/projects',
  '/admin/service-center/resources',
  '/admin/service-center/client-portal',
  '/admin/service-center/analytics',
  
  // 会议管理
  '/admin/meetings',
  
  // 共享办公空间
  '/admin/shared-office',
  '/admin/shared-office/overview',
  '/admin/shared-office/my-spaces',
  '/admin/shared-office/search',
  '/admin/shared-office/my-requests',
  '/admin/shared-office/my-bookings',
  
  // 员工管理（重定向路由）
  '/admin/employees',
]);

/**
 * 检查路由路径是否存在
 * @param path 要检查的路由路径
 * @returns 如果路由存在返回 true，否则返回 false
 */
export function isValidRoute(path: string): boolean {
  // 移除查询参数和哈希
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // 检查精确匹配
  if (VALID_ADMIN_ROUTES.has(cleanPath)) {
    return true;
  }
  
  // 检查动态路由模式（如 /admin/students/:studentId）
  // 匹配模式：/admin/students/数字 或 /admin/students/任意字符串
  const dynamicRoutePatterns = [
    /^\/admin\/students\/\d+$/,  // /admin/students/:studentId
    /^\/admin\/students-legacy\/\d+$/,  // /admin/students-legacy/:id
    /^\/admin\/applications\/\d+$/,  // /admin/applications/:id
    /^\/admin\/applications\/\d+\/planning$/,  // /admin/applications/:studentId/planning
    /^\/admin\/leads\/\d+$/,  // /admin/leads/:leadId
    /^\/admin\/mentors\/\d+$/,  // /admin/mentors/:id
    /^\/admin\/meetings\/\d+$/,  // /admin/meetings/:id
    /^\/admin\/knowledge\/detail\/\d+$/,  // /admin/knowledge/detail/:id
    /^\/admin\/professor-directory\/\d+$/,  // /admin/professor-directory/:professorId
    /^\/admin\/phd-opportunities\/\d+$/,  // /admin/phd-opportunities/:positionId
    /^\/admin\/project-marketplace\/\d+$/,  // /admin/project-marketplace/:projectId
    /^\/admin\/crm-template-library\/\d+$/,  // /admin/crm-template-library/:templateId
    /^\/admin\/knowledge-hub\/market\/\d+$/,  // /admin/knowledge-hub/market/:marketId
    /^\/admin\/school\/\d+$/,  // /admin/school/:schoolId
    /^\/admin\/school-detail\/\d+$/,  // /admin/school-detail/:schoolId
    /^\/admin\/program\/\d+$/,  // /admin/program/:programId
    /^\/admin\/programs\/\d+$/,  // /admin/programs/:programId
    /^\/admin\/program-detail\/\d+$/,  // /admin/program-detail/:programId
    /^\/admin\/employees\/\d+$/,  // /admin/employees/:id
    /^\/admin\/employees\/new$/,  // /admin/employees/new
    /^\/admin\/employees\/edit\/\d+$/,  // /admin/employees/edit/:id
    /^\/admin\/internal-management\/employee-and-scheduling\/\d+$/,  // /admin/internal-management/employee-and-scheduling/:staffId
    /^\/admin\/school-library\/add$/,  // /admin/school-library/add
    /^\/admin\/program-library\/add$/,  // /admin/program-library/add
    /^\/admin\/cloud-docs\/documents\/new$/,  // /admin/cloud-docs/documents/new
    /^\/admin\/cloud-docs\/documents\/\d+$/,  // /admin/cloud-docs/documents/:id
    /^\/admin\/meeting-documents\/new$/,  // /admin/meeting-documents/new
    /^\/admin\/meeting-documents\/\d+$/,  // /admin/meeting-documents/:id
    /^\/admin\/shared-office\/spaces\/\d+$/,  // /admin/shared-office/spaces/:id
    /^\/admin\/shared-office\/my-spaces\/new$/,  // /admin/shared-office/my-spaces/new
    /^\/admin\/shared-office\/my-spaces\/\d+\/edit$/,  // /admin/shared-office/my-spaces/:id/edit
    /^\/admin\/shared-office\/requests\/\d+$/,  // /admin/shared-office/requests/:id
    /^\/admin\/shared-office\/my-requests\/new$/,  // /admin/shared-office/my-requests/new
    /^\/admin\/shared-office\/bookings\/\d+$/,  // /admin/shared-office/bookings/:id
  ];
  
  // 检查是否匹配任何动态路由模式
  return dynamicRoutePatterns.some(pattern => pattern.test(cleanPath));
}

/**
 * 根据导航项 ID 生成对应的路由路径
 * @param itemId 导航项 ID（可能是 'tasks' 或 'cloud-docs/home' 等格式）
 * @returns 对应的路由路径，如果不存在则返回 null
 */
export function getRouteFromNavId(itemId: string): string | null {
  // 特殊处理 dashboard
  if (itemId === 'dashboard') {
    return '/admin/dashboard';
  }
  
  // 统一添加 /admin/ 前缀（无论 itemId 是否包含斜杠）
  // 例如：'tasks' -> '/admin/tasks'
  //      'cloud-docs/home' -> '/admin/cloud-docs/home'
  const route = `/admin/${itemId}`;
  
  // 检查路由是否存在
  if (isValidRoute(route)) {
    return route;
  }
  
  return null;
}

