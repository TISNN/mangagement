/**
 * Dashboard 统计卡片组件
 */

import React from 'react';
import { Users, Target, FileCheck, DollarSign, LucideIcon } from 'lucide-react';
import { DashboardStats } from '../../types/dashboard.types';

interface StatCardData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  desc: string;
}

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 dark:bg-gray-800 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData: StatCardData[] = [
    {
      title: '活跃学生',
      value: stats.activeStudents.toString(),
      change: stats.activeStudentsChange,
      icon: Users,
      color: 'blue',
      desc: '本月新增'
    },
    {
      title: '本月线索',
      value: stats.monthlyLeads.toString(),
      change: stats.monthlyLeadsChange,
      icon: Target,
      color: 'green',
      desc: '潜在客户'
    },
    {
      title: '本月签约',
      value: stats.monthlySignups.toString(),
      change: stats.monthlySignupsChange,
      icon: FileCheck,
      color: 'purple',
      desc: '新签合同'
    },
    {
      title: '本月收入',
      value: stats.monthlyRevenue > 0 ? `¥${(stats.monthlyRevenue / 1000).toFixed(0)}K` : '¥0',
      change: stats.monthlyRevenueChange,
      icon: DollarSign,
      color: 'orange',
      desc: '营收统计'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
              stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
              stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20' :
              'bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <stat.icon className={`h-6 w-6 ${
                stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                'text-orange-600 dark:text-orange-400'
              }`} />
            </div>
            <span className={`text-sm ${
              stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{stat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

