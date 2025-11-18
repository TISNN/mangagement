/**
 * 自动化规则组件
 * 展示行为触发规则和执行日志
 */

import React, { useState } from 'react';
import { Sparkles, Target, Zap, Activity, Users, Plus, Eye } from 'lucide-react';
import { AUTOMATION_RULES } from '../constants';

interface AutomationRulesProps {
  onCreateRule?: () => void;
  onViewLog?: (ruleId: string) => void;
}

const AutomationRules: React.FC<AutomationRulesProps> = ({ onCreateRule, onViewLog }) => {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set(['auto-1']));

  const toggleRule = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">行为触发与自动化</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">统一管理触发条件、动作以及执行表现</p>
        </div>
        <button
          onClick={onCreateRule}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-amber-200 hover:text-amber-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-amber-500 dark:hover:text-amber-300"
        >
          <Plus className="h-3.5 w-3.5" /> 新建规则
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-300">
        {AUTOMATION_RULES.map((rule) => {
          const isExpanded = expandedRules.has(rule.id);
          return (
            <div
              key={rule.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <span className="font-semibold text-gray-900 dark:text-white">{rule.name}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    rule.status === 'active'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {rule.status === 'active' ? '运行中' : '草稿'}
                </span>
              </div>

              {isExpanded && (
                <>
                  <div className="mt-3 flex items-start gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">触发条件</div>
                      <p className="leading-5">{rule.trigger}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">执行动作</div>
                      <p className="leading-5">{rule.action}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {rule.owner}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> 成功率 {rule.successRate}
                    </span>
                    <button
                      onClick={() => onViewLog?.(rule.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                    >
                      <Activity className="h-3.5 w-3.5" /> 查看日志
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomationRules;

