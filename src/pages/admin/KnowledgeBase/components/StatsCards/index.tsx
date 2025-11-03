/**
 * 统计卡片组件
 * 显示知识库的统计数据
 */

import React from 'react';
import { BookOpen, FileText, Video, Download, LucideIcon } from 'lucide-react';
import { formatNumber } from '../../utils/knowledgeMappers';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <p className="text-2xl font-bold dark:text-white">{formatNumber(value)}</p>
    </div>
  );
};

interface StatsCardsProps {
  stats: {
    totalResources: number;
    documentCount: number;
    videoCount: number;
    totalDownloads: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="总资源数"
        value={stats.totalResources}
        icon={BookOpen}
        color="blue"
      />
      <StatCard
        title="文档数量"
        value={stats.documentCount}
        icon={FileText}
        color="green"
      />
      <StatCard
        title="视频数量"
        value={stats.videoCount}
        icon={Video}
        color="yellow"
      />
      <StatCard
        title="总下载量"
        value={stats.totalDownloads}
        icon={Download}
        color="purple"
      />
    </div>
  );
};

