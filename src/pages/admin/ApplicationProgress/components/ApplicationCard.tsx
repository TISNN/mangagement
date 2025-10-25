/**
 * 申请卡片组件 - 显示单个学生的申请概览
 */

import React from 'react';
import { 
  School, 
  GraduationCap, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  ChevronRight 
} from 'lucide-react';
import { ApplicationOverview } from '../types';
import ProgressBar from './ProgressBar';
import { formatDate } from '../../../../utils/dateUtils';

interface ApplicationCardProps {
  overview: ApplicationOverview;
  onClick: () => void;
}

export default function ApplicationCard({ overview, onClick }: ApplicationCardProps) {
  const hasUrgentTasks = overview.urgent_tasks && overview.urgent_tasks.length > 0;
  const hasNextDeadline = !!overview.next_deadline;

  return (
    <div 
      className="bg-white rounded-2xl p-6 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      {/* 紧急标签 */}
      {hasUrgentTasks && (
        <div className="mb-4 inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {overview.urgent_tasks!.length} 个紧急任务
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        {/* 左侧信息 */}
        <div className="flex items-start gap-4">
          <img
            src={overview.student_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${overview.student_name}`}
            alt={overview.student_name}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-medium text-lg dark:text-white">{overview.student_name}</h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <School className="h-4 w-4 mr-1" />
                {overview.total_applications} 所院校申请
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                已提交: {overview.submitted_applications} | 已录取: {overview.accepted_applications}
              </p>
              {overview.mentor_name && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  负责导师: {overview.mentor_name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 右侧状态和操作 */}
        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            overview.overall_progress >= 80
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : overview.overall_progress >= 50
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            进度 {overview.overall_progress}%
          </div>
          {hasNextDeadline && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              下次截止: {formatDate(overview.next_deadline!)}
            </p>
          )}
          <button 
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            查看详情
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 步骤跟踪器 */}
      <ProgressBar progress={overview.overall_progress} />

      {/* 最近会议 */}
      {overview.latest_meeting && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">最近会议</p>
              <p className="text-sm font-medium dark:text-white">{overview.latest_meeting.title}</p>
              {overview.latest_meeting.summary && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {overview.latest_meeting.summary}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(overview.latest_meeting.start_time)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

