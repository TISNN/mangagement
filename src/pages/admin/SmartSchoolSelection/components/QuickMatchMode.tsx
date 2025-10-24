/**
 * 智选模式 (Quick Match)
 * 快速智能匹配组件
 */

import React, { useState } from 'react';
import { Zap, Lock, Unlock, RefreshCw, ArrowRight, Target, TrendingUp, Shield } from 'lucide-react';
import { UserCriteria, MatchStrategy, QuickMatchResult } from '../types/agent.types';

interface QuickMatchModeProps {
  criteria: UserCriteria;
  strategy: MatchStrategy;
  onStrategyChange: (strategy: MatchStrategy) => void;
  onGenerate: () => void;
  results: QuickMatchResult[];
  loading: boolean;
  onLockResult: (index: number) => void;
  onEnterDeepMode: (result: QuickMatchResult) => void;
}

export const QuickMatchMode: React.FC<QuickMatchModeProps> = ({
  criteria,
  strategy,
  onStrategyChange,
  onGenerate,
  results,
  loading,
  onLockResult,
  onEnterDeepMode
}) => {
  
  const strategies = [
    { value: 'conservative' as MatchStrategy, label: '保守策略', icon: Shield, desc: '稳妥为主,确保录取' },
    { value: 'balanced' as MatchStrategy, label: '平衡策略', icon: Target, desc: '冲刺与保底兼顾' },
    { value: 'aggressive' as MatchStrategy, label: '冲刺策略', icon: TrendingUp, desc: '追求更高目标' }
  ];
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reach': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'target': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'safety': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reach': return '🎯 冲刺校';
      case 'target': return '✅ 目标校';
      case 'safety': return '🛡️ 保底校';
      default: return '学校';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 策略选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">匹配策略</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">选择适合你的选校策略</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.map((s) => {
            const Icon = s.icon;
            const isActive = strategy === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onStrategyChange(s.value)}
                className={`group p-5 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600'}`} />
                  </div>
                  <span className={`font-semibold text-base ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>AI正在分析匹配...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>启动智能匹配</span>
            </>
          )}
        </button>
      </div>
      
      {/* 匹配结果 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              智选方案 ({results.length}所院校)
            </h3>
            <button
              onClick={onGenerate}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </button>
          </div>
          
          {results.map((result, index) => (
            <div
              key={`${result.school.id}-${result.program.id}`}
              className={`group bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all hover:shadow-xl ${
                result.locked
                  ? 'border-yellow-400 dark:border-yellow-600 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="p-8">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {result.school.logoUrl ? (
                        <img src={result.school.logoUrl} alt={result.school.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {result.school.name.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    
                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {result.school.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {result.program.cn_name || result.program.en_name}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{result.school.location}</span>
                        <span>{result.school.ranking}</span>
                        <span>{result.program.degree} · {result.program.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 匹配度 */}
                  <div className="text-right shrink-0 ml-4">
                    <div className="relative inline-block">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700" />
                        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${result.matchScore.total * 2.01} 201`} className="text-blue-600 dark:text-blue-400 transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.matchScore.total}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">分</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 匹配细节 */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Object.entries(result.matchScore.breakdown).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      ranking: '排名',
                      cost: '费用',
                      admission: '录取',
                      program: '专业',
                      location: '位置'
                    };
                    return (
                      <div key={key} className="text-center">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(value)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{labels[key]}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 推荐理由 */}
                <div className="space-y-2 mb-4">
                  {result.reason.keyPoints.length > 0 && (
                    <div className="flex gap-2">
                      {result.reason.keyPoints.map((point, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                          {point}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.reason.pros.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 font-medium">优势: </span>
                      {result.reason.pros[0]}
                    </div>
                  )}
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLockResult(index)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all transform hover:scale-105 ${
                      result.locked
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-md'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {result.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {result.locked ? '已锁定' : '锁定方案'}
                  </button>
                  
                  <button
                    onClick={() => onEnterDeepMode(result)}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    深度分析
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

