/**
 * 任务管理常量定义
 */

import { Circle, Clock, CheckCircle2, XSquare, Building2, GraduationCap, Users, Megaphone } from 'lucide-react';
import React from 'react';
import { TaskDomain, TaskRelatedEntityType } from '../types/task.types';

// 优先级映射
export const PRIORITY_MAP = {
  '高': { 
    text: '高', 
    color: 'red', 
    style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
  },
  '中': { 
    text: '中', 
    color: 'blue', 
    style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
  },
  '低': { 
    text: '低', 
    color: 'gray', 
    style: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
  },
  // 兼容旧的英文格式
  'high': { 
    text: '高', 
    color: 'red', 
    style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
  },
  'urgent': { 
    text: '高', 
    color: 'red', 
    style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
  },
  'medium': { 
    text: '中', 
    color: 'blue', 
    style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
  },
  'low': { 
    text: '低', 
    color: 'gray', 
    style: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
  },
} as const;

// 状态映射
export const STATUS_MAP = {
  '待处理': { 
    text: '待处理', 
    color: 'gray',
    bgStyle: 'bg-gray-100 dark:bg-gray-700',
    textStyle: 'text-gray-700 dark:text-gray-300',
  },
  '进行中': { 
    text: '进行中', 
    color: 'blue',
    bgStyle: 'bg-blue-100 dark:bg-blue-900/30',
    textStyle: 'text-blue-700 dark:text-blue-300',
  },
  '已完成': { 
    text: '已完成', 
    color: 'green',
    bgStyle: 'bg-green-100 dark:bg-green-900/30',
    textStyle: 'text-green-700 dark:text-green-300',
  },
  '已取消': { 
    text: '已取消', 
    color: 'red',
    bgStyle: 'bg-red-100 dark:bg-red-900/30',
    textStyle: 'text-red-700 dark:text-red-300',
  },
  // 兼容旧的英文格式
  'pending': { 
    text: '待处理', 
    color: 'gray',
    bgStyle: 'bg-gray-100 dark:bg-gray-700',
    textStyle: 'text-gray-700 dark:text-gray-300',
  },
  'in_progress': { 
    text: '进行中', 
    color: 'blue',
    bgStyle: 'bg-blue-100 dark:bg-blue-900/30',
    textStyle: 'text-blue-700 dark:text-blue-300',
  },
  'completed': { 
    text: '已完成', 
    color: 'green',
    bgStyle: 'bg-green-100 dark:bg-green-900/30',
    textStyle: 'text-green-700 dark:text-green-300',
  },
  'canceled': { 
    text: '已取消', 
    color: 'red',
    bgStyle: 'bg-red-100 dark:bg-red-900/30',
    textStyle: 'text-red-700 dark:text-red-300',
  },
} as const;

// 视图模式选项
export const VIEW_MODES = [
  { id: 'list', name: '列表视图' },
  { id: 'day', name: '日视图' },
  { id: 'week', name: '周视图' },
  { id: 'month', name: '月视图' },
] as const;

// 时间视图选项
export const TIME_VIEWS = [
  { id: 'all', name: '全部' },
  { id: 'today', name: '今天' },
  { id: 'tomorrow', name: '明天' },
  { id: 'week', name: '本周' },
  { id: 'expired', name: '已过期' },
] as const;

// 优先级选项
export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
] as const;

// 状态选项
export const STATUS_OPTIONS = [
  { value: '待处理', label: '待处理' },
  { value: '进行中', label: '进行中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
] as const;

export const TASK_DOMAIN_META: Record<TaskDomain, { label: string; description: string; icon: React.ReactNode; defaultEntityType: TaskRelatedEntityType }> = {
  general: {
    label: '通用协作',
    description: '跨团队或尚未分类的日常任务',
    icon: React.createElement(Users, { className: 'w-4 h-4 text-gray-500' }),
    defaultEntityType: 'none',
  },
  student_success: {
    label: '学生服务',
    description: '与学生跟进、选校、材料相关的任务',
    icon: React.createElement(GraduationCap, { className: 'w-4 h-4 text-indigo-500' }),
    defaultEntityType: 'student',
  },
  company_ops: {
    label: '内部运营',
    description: '公司行政、人力、财务等管理事项',
    icon: React.createElement(Building2, { className: 'w-4 h-4 text-emerald-500' }),
    defaultEntityType: 'employee',
  },
  marketing: {
    label: '市场与社媒',
    description: '品牌宣传、活动策划、渠道推广等工作',
    icon: React.createElement(Megaphone, { className: 'w-4 h-4 text-orange-500' }),
    defaultEntityType: 'lead',
  },
};

export const TASK_DOMAIN_OPTIONS = (Object.entries(TASK_DOMAIN_META) as Array<[TaskDomain, typeof TASK_DOMAIN_META[TaskDomain]]>).map(
  ([value, meta]) => ({
    value,
    label: meta.label,
    description: meta.description,
    icon: meta.icon,
    defaultEntityType: meta.defaultEntityType,
  })
);

export const TASK_ENTITY_TYPE_OPTIONS: Array<{ value: TaskRelatedEntityType; label: string }> = [
  { value: 'none', label: '不关联对象' },
  { value: 'student', label: '关联学生' },
  { value: 'lead', label: '关联潜在客户' },
  { value: 'employee', label: '关联内部员工' },
];
