/**
 * Dashboard 动态面板组件
 */

import React from 'react';
import { Bell } from 'lucide-react';
import { DashboardActivity } from '../../types/dashboard.types';

interface ActivityPanelProps {
  activities: DashboardActivity[];
  loading?: boolean;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800 animate-pulse">
        <div className="h-64"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">最新动态</h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">暂无动态</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                {activity.avatar ? (
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>
                    {' '}
                    <span className="font-medium text-purple-600 dark:text-purple-400">{activity.content}</span>
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

