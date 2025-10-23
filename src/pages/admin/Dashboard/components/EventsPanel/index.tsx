/**
 * Dashboard 日程面板组件
 */

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DashboardEvent } from '../../types/dashboard.types';

interface EventsPanelProps {
  events: DashboardEvent[];
  loading?: boolean;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({ events, loading }) => {
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
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">即将到来</h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">暂无日程</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                event.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                event.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                event.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                event.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-orange-100 dark:bg-orange-900/30'
              }`}>
                <Calendar className={`w-5 h-5 ${
                  event.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  event.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  event.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  event.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-orange-600 dark:text-orange-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.date}
                  </span>
                  {event.time && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {event.time}
                      </span>
                    </>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    event.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    event.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    event.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    event.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    {event.type === 'meeting' ? '会议' : event.type === 'deadline' ? '截止' : '活动'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium transition-colors">
        查看完整日历
      </button>
    </div>
  );
};

