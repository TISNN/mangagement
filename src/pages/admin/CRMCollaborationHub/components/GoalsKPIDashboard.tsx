/**
 * 目标与KPI看板组件
 * 展示团队目标进度和个人KPI表现
 */

import React, { useState } from 'react';
import { ArrowUpRight, Activity, Target, ClipboardList, Users, Trophy, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { GoalMetric, PersonalKPI } from '../types';
import { GOAL_METRICS, KPI_CARDS } from '../constants';

interface GoalsKPIDashboardProps {
  onAdjustGoals?: () => void;
  onViewTeamDetails?: () => void;
}

const trendIcon = (type: GoalMetric['trendType']) => {
  if (type === 'up') {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  }
  if (type === 'down') {
    return <ArrowUpRight className="h-4 w-4 rotate-180 text-rose-500" />;
  }
  return <Activity className="h-4 w-4 text-gray-400" />;
};

const GoalsKPIDashboard: React.FC<GoalsKPIDashboardProps> = ({ onAdjustGoals, onViewTeamDetails }) => {
  const [isGoalsExpanded, setIsGoalsExpanded] = useState(true);
  const [isKPIExpanded, setIsKPIExpanded] = useState(true);

  return (
    <div className="space-y-4">
      {/* 目标看板 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">目标与 KPI 看板</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">实时掌握团队目标进展与达成预测，支持跨团队协同跟踪</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsGoalsExpanded(!isGoalsExpanded)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              {isGoalsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isGoalsExpanded ? '收起' : '展开'}
            </button>
            <button
              onClick={onAdjustGoals}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <ClipboardList className="h-3.5 w-3.5" /> 调整目标
            </button>
          </div>
        </div>

        {isGoalsExpanded && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {GOAL_METRICS.map((metric) => (
              <div
                key={metric.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                  <span>{metric.label}</span>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">目标 {metric.target}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>进度</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white dark:bg-gray-900/40">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-300">
                    <Target className="h-3 w-3" /> {metric.forecast}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    {trendIcon(metric.trendType)} {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 个人KPI榜 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">个人 KPI 榜</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">实时对齐团队目标，突出优秀表现与成长成员</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsKPIExpanded(!isKPIExpanded)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              {isKPIExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isKPIExpanded ? '收起' : '展开'}
            </button>
            <button
              onClick={onViewTeamDetails}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <Users className="h-3.5 w-3.5" /> 查看团队详情
            </button>
          </div>
        </div>

        {isKPIExpanded && (
          <div className="mt-4 space-y-4">
            {KPI_CARDS.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <span>{member.name}</span>
                      {member.badge === 'top' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                          <Trophy className="h-3 w-3" /> Top Performer
                        </span>
                      )}
                      {member.badge === 'rising' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <Sparkles className="h-3 w-3" /> Rising Star
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{member.role}</div>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {member.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <div>{metric.label}</div>
                      <div className="text-sm font-semibold text-indigo-500 dark:text-indigo-300">{metric.value}</div>
                      <div>{metric.target}</div>
                      <div className="text-emerald-500 dark:text-emerald-300">{metric.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsKPIDashboard;

