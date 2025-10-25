/**
 * 统计卡片组件
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  extra?: React.ReactNode;
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  extra
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
      <div className={`p-3 ${iconBgColor} rounded-full`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-xl dark:text-white">{value}</p>
          {extra}
        </div>
      </div>
    </div>
  );
}

