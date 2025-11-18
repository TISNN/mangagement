/**
 * 需求卡片组件
 * 用于展示需求信息的可复用组件
 */

import React from 'react';
import { Calendar, MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import type { SpaceRequest } from '../types';
import { SPACE_TYPE_LABELS, REQUEST_STATUS_LABELS, URGENCY_LABELS } from '../types';

interface RequestCardProps {
  request: SpaceRequest;
  onClick?: () => void;
  showActions?: boolean;
  onView?: () => void;
  onCancel?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onClick,
  showActions = false,
  onView,
  onCancel,
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'urgent':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'matching':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'booked':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 标题和状态 */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
          {request.title}
        </h3>
        <div className="flex gap-2 ml-2">
          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
            {REQUEST_STATUS_LABELS[request.status]}
          </span>
          {request.urgency !== 'normal' && (
            <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getUrgencyColor(request.urgency)}`}>
              <AlertCircle className="w-3 h-3" />
              {URGENCY_LABELS[request.urgency]}
            </span>
          )}
        </div>
      </div>

      {/* 类型 */}
      <div className="mb-3">
        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
          {SPACE_TYPE_LABELS[request.request_type]}
        </span>
      </div>

      {/* 信息列表 */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {/* 位置 */}
        {request.target_cities.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{request.target_cities.join('、')}</span>
            {request.target_districts && request.target_districts.length > 0 && (
              <span className="text-gray-400">· {request.target_districts.join('、')}</span>
            )}
          </div>
        )}

        {/* 时间 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{request.use_date}</span>
          <Clock className="w-4 h-4 ml-2 flex-shrink-0" />
          <span>
            {request.use_time_start} - {request.use_time_end}
          </span>
        </div>

        {/* 容量 */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span>预计 {request.expected_capacity} 人</span>
        </div>
      </div>

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              查看详情
            </button>
          )}
          {onCancel && request.status !== 'completed' && request.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
          )}
        </div>
      )}
    </div>
  );
};

