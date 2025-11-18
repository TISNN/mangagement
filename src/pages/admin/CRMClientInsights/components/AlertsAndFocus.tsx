/**
 * 预警与重点关注组件
 * 展示需要人工介入的客户群
 */

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { ALERT_GROUPS } from '../constants';

interface AlertsAndFocusProps {
  onViewPlan?: () => void;
  onViewDetails?: (title: string) => void;
}

const AlertsAndFocus: React.FC<AlertsAndFocusProps> = ({ onViewPlan, onViewDetails }) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const toggleAlert = (title: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedAlerts(newExpanded);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">预警与重点关注</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            结合风险标签与自动化触发日志，识别需要人工介入的客户群
          </p>
        </div>
        <button
          onClick={onViewPlan}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-300"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> 查看预案
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {ALERT_GROUPS.map((alert) => {
          const isExpanded = expandedAlerts.has(alert.title);
          return (
            <div
              key={alert.title}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.title)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <span>{alert.title}</span>
                </div>
                <span className="text-rose-600 dark:text-rose-400">{alert.value}</span>
              </div>
              {isExpanded && (
                <>
                  <p className="mt-2 leading-5">{alert.detail}</p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-rose-500 shadow-sm dark:bg-gray-900 dark:text-rose-300">
                    <AlertTriangle className="h-3 w-3" /> {alert.action}
                  </div>
                  <button
                    onClick={() => onViewDetails?.(alert.title)}
                    className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-rose-200 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-rose-500"
                  >
                    <Eye className="mr-1 inline h-3.5 w-3.5" />
                    查看详情
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsAndFocus;

