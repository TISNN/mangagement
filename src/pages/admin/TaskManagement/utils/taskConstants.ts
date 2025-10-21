/**
 * 任务管理常量定义
 */

import { Circle, Clock, CheckCircle2, XSquare } from 'lucide-react';
import React from 'react';

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

