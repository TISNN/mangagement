/**
 * 学校库类型定义
 */

// 数据库学校接口
export interface DatabaseSchool {
  id: string;
  cn_name: string;
  en_name?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  ranking?: number;
  description?: string;
  qs_rank_2025?: number;
  qs_rank_2024?: number;
  region?: string;
  is_verified?: boolean;
  tags?: string[] | string | Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// 专业接口
export interface Program {
  id: string;
  school_id: string;
  cn_name?: string;
  en_name: string;
  name?: string;
  degree: string;
  duration: string;
  tuition_fee: string;
  faculty: string;
  category: string;
  subCategory: string;
  tags?: string[];
  apply_requirements: string;
  language_requirements: string;
  curriculum: string;
  analysis: string;
  url: string;
  interview: string;
  objectives: string;
}

// 前端使用的学校接口
export interface School {
  id: string;
  name: string;
  location: string;
  country?: string;
  region?: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string;
  tags?: string[];
  rawData?: DatabaseSchool;
}

// 学校筛选条件
export interface SchoolFilters {
  region: string;
  country: string;
  rankingRange: [number, number];
  searchQuery: string;
}

// 学校排序配置
export interface SchoolSortConfig {
  field: 'ranking' | 'acceptance' | 'tuition';
  direction: 'asc' | 'desc';
}

