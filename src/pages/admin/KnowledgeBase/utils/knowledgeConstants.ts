/**
 * 知识库常量定义
 * 包含所有知识库相关的常量、枚举和配置
 */

import { FileText, Video, Book, FileCheck } from 'lucide-react';

// 资源类型配置
export const RESOURCE_TYPE_CONFIG = {
  document: {
    icon: FileText,
    label: '文档',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    acceptFiles: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx'
  },
  video: {
    icon: Video,
    label: '视频',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
    acceptFiles: '.mp4,.avi,.mov,.wmv'
  },
  article: {
    icon: Book,
    label: '文章',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400',
    acceptFiles: ''
  },
  template: {
    icon: FileCheck,
    label: '模板',
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    acceptFiles: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip'
  }
} as const;

// 资源分类列表
export const RESOURCE_CATEGORIES = [
  '申请指南',
  '文书指导',
  '语言考试',
  '申请材料',
  '留学生活',
  '签证事务',
  '奖学金',
  '面试准备',
  '案例分析',
  '学术指导',
  '就业指导'
] as const;

// 资源状态配置
export const RESOURCE_STATUS_CONFIG = {
  draft: {
    label: '草稿',
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  published: {
    label: '已发布',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400'
  },
  archived: {
    label: '已归档',
    color: 'orange',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400'
  }
} as const;

// 排序选项
export const SORT_OPTIONS = [
  { value: 'date_desc', label: '最新上传' },
  { value: 'date_asc', label: '最早上传' },
  { value: 'views_desc', label: '浏览量高' },
  { value: 'downloads_desc', label: '下载量高' },
  { value: 'name_asc', label: '名称 A-Z' },
  { value: 'name_desc', label: '名称 Z-A' }
] as const;

// 时间范围选项
export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: '全部时间' },
  { value: '7', label: '最近7天' },
  { value: '30', label: '最近30天' },
  { value: '90', label: '最近3个月' },
  { value: '180', label: '最近6个月' },
  { value: '365', label: '最近1年' }
] as const;

// 标签页选项
export const TAB_OPTIONS = [
  { value: 'all', label: '全部资源' },
  { value: 'featured', label: '精选资源' },
  { value: 'bookmarked', label: '已收藏' },
  { value: 'recent', label: '最近更新' }
] as const;

// 默认筛选条件
export const DEFAULT_FILTERS = {
  search: '',
  category: '全部分类',
  type: 'all' as const,
  author: '',
  tag: '',
  dateRange: 'all' as const,
  sortBy: 'date_desc' as const
};

// 每页显示数量
export const PAGE_SIZE = 12;

// 默认缩略图（按类型）
export const DEFAULT_THUMBNAILS = {
  document: 'https://images.unsplash.com/photo-1588979355313-6711a095465f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  video: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  article: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  template: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
} as const;

// 热门标签
export const POPULAR_TAGS = [
  '美国',
  '英国',
  '澳大利亚',
  '加拿大',
  '日本',
  '申请流程',
  '文书写作',
  '托福',
  'IELTS',
  'GRE',
  '签证',
  '奖学金',
  '面试'
] as const;

