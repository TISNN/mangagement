/**
 * 任务筛选器组件
 */

import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { TaskFilters as ITaskFilters } from '../../types/task.types';
import { STATUS_OPTIONS, TIME_VIEWS, PRIORITY_OPTIONS } from '../../utils/taskConstants';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFilterChange: (key: keyof ITaskFilters, value: any) => void;
  onReset: () => void;
  allTags: string[];
  students?: Array<{ id: string; name: string; avatar: string | null; status?: string; is_active?: boolean }>; // 已关联的学生列表
  meetings?: Array<{ id: string; title: string; meeting_type?: string; start_time?: string; status?: string }>; // 已关联的会议列表
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  allTags,
  students = [], // 学生列表
  meetings = [], // 会议列表
}) => {
  const hasActiveFilters = 
    filters.status || 
    filters.priority ||
    filters.assignee ||
    filters.student || // 学生筛选
    filters.meeting || // 会议筛选
    filters.tag || 
    filters.timeView !== 'all' ||
    filters.domain || // 任务域筛选
    filters.relatedEntityType; // 关联对象类型筛选

  return (
    <div className="space-y-3">
      {/* 筛选器 */}
      <div className="flex items-center gap-3 flex-wrap bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">筛选:</span>
        </div>

        {/* 状态筛选 */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部状态</option>
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 优先级筛选 */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部优先级</option>
          {PRIORITY_OPTIONS.map(option => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 时间视图筛选 */}
        <select
          value={filters.timeView}
          onChange={(e) => onFilterChange('timeView', e.target.value as any)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          {TIME_VIEWS.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        {/* 任务域筛选（新增） */}
        <select
          value={filters.domain || ''}
          onChange={(e) => onFilterChange('domain', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部任务域</option>
          <option value="general">通用任务</option>
          <option value="student_success">学生服务</option>
          <option value="company_ops">公司运营</option>
          <option value="marketing">市场营销</option>
        </select>

        {/* 关联对象类型筛选（新增） */}
        <select
          value={filters.relatedEntityType || ''}
          onChange={(e) => onFilterChange('relatedEntityType', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部关联类型</option>
          <option value="student">关联学生</option>
          <option value="lead">关联线索</option>
          <option value="employee">关联员工</option>
          <option value="none">无关联</option>
        </select>

        {/* 学生筛选（仅显示已关联的学生） */}
        {students.length > 0 && (
          <select
            value={filters.student || ''}
            onChange={(e) => onFilterChange('student', e.target.value || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <option value="">全部学生 ({students.length})</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} {!student.is_active && '(非活跃)'}
              </option>
            ))}
          </select>
        )}

        {/* 会议筛选（新增） */}
        {meetings.length > 0 && (
          <select
            value={filters.meeting || ''}
            onChange={(e) => onFilterChange('meeting', e.target.value || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <option value="">全部会议 ({meetings.length})</option>
            {meetings.map(meeting => (
              <option key={meeting.id} value={meeting.id}>
                {meeting.title} 
                {meeting.start_time && ` (${new Date(meeting.start_time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })})`}
              </option>
            ))}
          </select>
        )}

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <select
            value={filters.tag || ''}
            onChange={(e) => onFilterChange('tag', e.target.value || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <option value="">全部标签</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}

        {/* 重置按钮 */}
        {hasActiveFilters && (
          <>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置筛选</span>
            </button>
          </>
        )}
      </div>

      {/* 活动筛选标签 */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">已选筛选:</span>
          
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              状态: {filters.status}
              <button
                onClick={() => onFilterChange('status', null)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priority && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
              优先级: {filters.priority}
              <button
                onClick={() => onFilterChange('priority', null)}
                className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.domain && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs">
              任务域: {
                filters.domain === 'general' ? '通用任务' :
                filters.domain === 'student_success' ? '学生服务' :
                filters.domain === 'company_ops' ? '公司运营' :
                filters.domain === 'marketing' ? '市场营销' : filters.domain
              }
              <button
                onClick={() => onFilterChange('domain', null)}
                className="hover:bg-cyan-200 dark:hover:bg-cyan-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.relatedEntityType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs">
              关联类型: {
                filters.relatedEntityType === 'student' ? '学生' :
                filters.relatedEntityType === 'lead' ? '线索' :
                filters.relatedEntityType === 'employee' ? '员工' :
                filters.relatedEntityType === 'none' ? '无关联' : filters.relatedEntityType
              }
              <button
                onClick={() => onFilterChange('relatedEntityType', null)}
                className="hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.student && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
              学生: {students.find(s => s.id === filters.student)?.name || filters.student}
              <button
                onClick={() => onFilterChange('student', null)}
                className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.meeting && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              会议: {meetings.find(m => m.id === filters.meeting)?.title || filters.meeting}
              <button
                onClick={() => onFilterChange('meeting', null)}
                className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.tag && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              标签: {filters.tag}
              <button
                onClick={() => onFilterChange('tag', null)}
                className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.timeView !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
              时间: {TIME_VIEWS.find(v => v.id === filters.timeView)?.name}
              <button
                onClick={() => onFilterChange('timeView', 'all')}
                className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;

