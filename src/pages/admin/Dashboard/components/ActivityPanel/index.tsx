/**
 * Dashboard 动态面板组件
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { DashboardActivity } from '../../types/dashboard.types';

interface ActivityPanelProps {
  activities: DashboardActivity[];
  loading?: boolean;
  focusedActivityId?: string;
  onActivityNavigate?: (activity: DashboardActivity) => void;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
  activities,
  loading,
  focusedActivityId,
  onActivityNavigate,
}) => {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (!focusedActivityId) return;
    setHighlightId(focusedActivityId);
    const target = itemRefs.current[focusedActivityId];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const timer = window.setTimeout(() => setHighlightId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [focusedActivityId]);

  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => b.timestamp - a.timestamp),
    [activities],
  );

  const resolveAvatarUrl = (activity: DashboardActivity) => {
    if (activity.avatar && activity.avatar.trim().length > 0) {
      return activity.avatar;
    }
    const seed = activity.user || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

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
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">暂无动态</p>
          </div>
        ) : (
          sortedActivities.map((activity) => {
            const isHighlighted = highlightId === activity.id;
            const isNavigable = !!activity.detailPath || !!onActivityNavigate;

            return (
              <div
                key={activity.id}
                ref={(el) => {
                  if (el) {
                    itemRefs.current[activity.id] = el;
                  }
                }}
                className={`flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 ${
                  isNavigable ? 'cursor-pointer transition hover:bg-gray-50/60 dark:hover:bg-gray-700/30 rounded-xl px-2 -mx-2' : ''
                } ${isHighlighted ? 'ring-2 ring-indigo-300 dark:ring-indigo-600 rounded-xl px-2 -mx-2' : ''}`}
                onClick={() => onActivityNavigate?.(activity)}
                role={isNavigable ? 'button' : undefined}
                tabIndex={isNavigable ? 0 : -1}
                onKeyDown={(event) => {
                  if (!isNavigable) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onActivityNavigate?.(activity);
                  }
                }}
              >
              <div className="flex-shrink-0">
                <img
                  src={resolveAvatarUrl(activity)}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).src = resolveAvatarUrl({
                      ...activity,
                      avatar: '',
                    });
                  }}
                />
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
            );
          })
        )}
      </div>
    </div>
  );
};

