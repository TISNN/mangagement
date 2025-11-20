/**
 * 专业库类型定义
 */

import { 
  Program, 
  CourseInfo, 
  ExperientialLearningInfo, 
  ApplicationTimelineEvent, 
  ApplicationMaterial 
} from '../../SchoolLibrary/types/school.types';

// 专业分类枚举
export enum ProgramCategory {
  Business = "商科",
  SocialScience = "社科",
  Engineering = "工科",
  Science = "理科"
}

// 专业筛选条件
export interface ProgramFilters {
  category: string;
  subCategory: string;
  region: string;
  country: string;
  searchQuery: string;
  degree: string;
  duration: string;
}

// 导出Program类型和所有辅助类型以便使用
export type { 
  Program, 
  CourseInfo, 
  ExperientialLearningInfo, 
  ApplicationTimelineEvent, 
  ApplicationMaterial 
};

