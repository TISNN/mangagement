// 导师库类型定义

/**
 * 服务范围类型
 */
export type ServiceScope = 
  | '留学申请'   // Study Abroad Application
  | '课业辅导'   // Academic Tutoring
  | '科研'       // Research
  | '语言培训';  // Language Training

/**
 * 专业级别类型
 */
export type ExpertiseLevel = 
  | '初级'       // Junior
  | '中级'       // Mid-level
  | '高级'       // Senior
  | '专家';      // Expert

/**
 * 数据库导师类型(对应mentors表)
 */
export interface DatabaseMentor {
  id: number;
  employee_id: number | null;
  name: string;
  email: string | null;
  contact: string | null;
  gender: string | null;
  avatar_url: string | null;
  bio: string | null;
  specializations: string[] | null;  // 专业方向数组
  expertise_level: string | null;     // 专业级别
  hourly_rate: number | null;         // 时薪
  is_active: boolean;
  location: string | null;            // 新增:地理位置
  service_scope: string[] | null;     // 新增:服务范围数组
  created_at: string;
  updated_at: string;
}

/**
 * 前端使用的导师类型
 */
export interface Mentor {
  id: string;                          // 转为字符串ID便于前端使用
  employeeId: number | null;
  name: string;
  email?: string;
  contact?: string;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  specializations: string[];           // 专业方向
  expertiseLevel?: ExpertiseLevel;     // 专业级别
  hourlyRate?: number;                 // 时薪
  isActive: boolean;
  location: string;                    // 地理位置
  serviceScope: ServiceScope[];        // 服务范围
  createdAt: string;
  updatedAt: string;
  rawData?: DatabaseMentor;            // 保留原始数据以备不时之需
}

/**
 * 导师筛选器类型
 */
export interface MentorFilters {
  searchQuery: string;                 // 搜索关键词
  serviceScope: string;                // 服务范围筛选('全部'或具体范围)
  location: string;                    // 地理位置筛选('全部'或具体城市)
  expertiseLevel: string;              // 专业级别筛选('全部'或具体级别)
  specialization: string;              // 专业方向筛选('全部'或具体方向)
  isActive?: boolean;                  // 是否只显示活跃导师
}

/**
 * 导师排序配置类型
 */
export interface MentorSortConfig {
  field: 'name' | 'hourly_rate' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

