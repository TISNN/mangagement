/**
 * 最终选校列表组件
 */

import React, { useState } from 'react';
import { School, Calendar, Key, CheckCircle2, Clock, XCircle, AlertCircle, Plus } from 'lucide-react';
import { FinalUniversityChoice } from '../types';
import { formatDate } from '../../../../utils/dateUtils';
import AddUniversityChoiceModal from './AddUniversityChoiceModal';

interface UniversityChoiceListProps {
  choices: FinalUniversityChoice[];
  studentId: number;
  onAddChoice?: (choice: Partial<FinalUniversityChoice>) => Promise<void>;
}

export default function UniversityChoiceList({ choices, studentId, onAddChoice }: UniversityChoiceListProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddChoice = async (choice: Partial<FinalUniversityChoice>) => {
    if (onAddChoice) {
      await onAddChoice(choice);
    }
  };

  if (choices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">最终选校列表</h2>
          {onAddChoice && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              添加选校
            </button>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无选校记录</p>
        
        {showAddModal && (
          <AddUniversityChoiceModal
            studentId={studentId}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddChoice}
          />
        )}
      </div>
    );
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case '冲刺院校':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30';
      case '目标院校':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/30';
      case '保底院校':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case '已录取':
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case '已拒绝':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case '审核中':
      case '已投递':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'Waitlist':
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case '已录取':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case '已拒绝':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case '审核中':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '已投递':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Waitlist':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case '未投递':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // 按优先级排序
  const sortedChoices = [...choices].sort((a, b) => {
    if (a.priority_rank && b.priority_rank) {
      return a.priority_rank - b.priority_rank;
    }
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-white">最终选校列表</h2>
        {onAddChoice && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            添加选校
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {sortedChoices.map((choice) => (
          <div 
            key={choice.id}
            className={`p-4 border-2 rounded-lg ${getTypeColor(choice.application_type)}`}
          >
            {/* 标题行 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <School className="h-5 w-5" />
                  <h3 className="font-semibold text-lg dark:text-white">{choice.school_name}</h3>
                  {choice.application_type && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-white/50 dark:bg-black/20">
                      {choice.application_type}
                    </span>
                  )}
                  {choice.priority_rank && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-white/50 dark:bg-black/20">
                      优先级 #{choice.priority_rank}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{choice.program_name}</p>
                {choice.program_level && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">{choice.program_level}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(choice.submission_status)}
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(choice.submission_status)}`}>
                  {choice.submission_status || '未投递'}
                </span>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {/* 截止日期 */}
              {choice.application_deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">截止日期:</span>
                  <span className="font-medium dark:text-white">{formatDate(choice.application_deadline)}</span>
                </div>
              )}

              {/* 申请轮次 */}
              {choice.application_round && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">申请轮次:</span>
                  <span className="font-medium dark:text-white">{choice.application_round}</span>
                </div>
              )}

              {/* 投递日期 */}
              {choice.submission_date && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">投递日期:</span>
                  <span className="font-medium dark:text-white">{formatDate(choice.submission_date)}</span>
                </div>
              )}

              {/* 决定日期 */}
              {choice.decision_date && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">决定日期:</span>
                  <span className="font-medium dark:text-white">{formatDate(choice.decision_date)}</span>
                </div>
              )}

              {/* 申请账号 */}
              {choice.application_account && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Key className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">申请账号:</span>
                  <span className="font-medium dark:text-white font-mono text-xs">{choice.application_account}</span>
                  {choice.application_password && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">(密码已保存)</span>
                  )}
                </div>
              )}
            </div>

            {/* 备注 */}
            {choice.notes && (
              <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">备注:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{choice.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddUniversityChoiceModal
          studentId={studentId}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddChoice}
        />
      )}
    </div>
  );
}

