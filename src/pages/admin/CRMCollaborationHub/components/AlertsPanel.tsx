/**
 * 即时提醒面板组件
 * 展示关键SLA、审批与培训提醒
 */

import React, { useState } from 'react';
import { AlertTriangle, Clock, Calendar, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { ALERT_ITEMS } from '../constants';

interface AlertsPanelProps {
  onConfigureAlerts?: () => void;
}

const iconMap = {
  Clock,
  Calendar,
  ShieldCheck,
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ onConfigureAlerts }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300';
      case 'info':
        return 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-300';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">即时提醒</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">关键 SLA、审批与培训提醒集中查看</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onConfigureAlerts}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> 配置提醒
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
          {ALERT_ITEMS.map((alert) => {
            const Icon = iconMap[alert.icon as keyof typeof iconMap] || Clock;
            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-3 shadow-sm ${getAlertStyles(alert.type)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{alert.title}</span>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 leading-5">{alert.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;

