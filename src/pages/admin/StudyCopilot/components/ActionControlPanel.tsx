import React, { useState } from 'react';
import { Calendar, Mail, DollarSign, Paperclip, CheckCircle, UserPlus } from 'lucide-react';

interface ActionControlPanelProps {
  onCreateTask: () => void;
  onSendReport: () => void;
  onConvert: () => void;
}

const ActionControlPanel: React.FC<ActionControlPanelProps> = ({
  onCreateTask,
  onSendReport,
  onConvert,
}) => {
  const [intentLevel, setIntentLevel] = useState<'low' | 'medium' | 'high'>('medium');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        任务与转化控制台
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 创建任务 */}
        <button
          onClick={onCreateTask}
          className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 group"
        >
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">创建后续任务</span>
        </button>

        {/* 发送报告 */}
        <button
          onClick={onSendReport}
          className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors border border-purple-200 dark:border-purple-800 group"
        >
          <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">发送初评报告</span>
        </button>

        {/* 转化操作 */}
        <button
          onClick={onConvert}
          className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-200 dark:border-green-800 group"
        >
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">转化/签约</span>
        </button>

        {/* 上传附件 */}
        <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 group">
          <Paperclip className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">上传材料</span>
        </button>
      </div>

      {/* 意向等级 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">意向等级</span>
          <div className="flex items-center gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setIntentLevel(level)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  intentLevel === level
                    ? level === 'high'
                      ? 'bg-green-600 text-white'
                      : level === 'medium'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
        </div>

        {/* CRM状态更新提示 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>系统将自动更新CRM线索阶段为"已初访"并创建3天后回访任务</span>
        </div>
      </div>
    </div>
  );
};

export default ActionControlPanel;

