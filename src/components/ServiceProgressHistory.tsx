import React from 'react';
import { TrendingUp, Calendar, MessageSquare, User, CheckSquare, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface ServiceProgressLog {
  id: number;
  milestone: string;
  progress_date: string;
  description?: string | null;
  notes?: string | null;
  completed_items?: Record<string, unknown>[];
  next_steps?: Record<string, unknown>[];
  recorded_by?: number | null;
  employee_ref_id?: number | null;
  created_at: string;
  employee?: {
    id?: number;
    name?: string;
    email?: string;
    department?: string;
    position?: string;
  } | null;
  recorder?: {
    id?: number;
    name?: string;
    email?: string;
  } | null;
}

interface ServiceProgressHistoryProps {
  history: ServiceProgressLog[];
}

const ServiceProgressHistory: React.FC<ServiceProgressHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        暂无进度记录
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((record) => (
        <div 
          key={record.id}
          className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0"
        >
          {/* 时间线点 */}
          <div className="absolute left-[-5px] top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
          
          {/* 进度记录内容 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  进度更新至 {record.milestone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(record.progress_date || record.created_at)}</span>
              </div>
            </div>
            
            {record.description && record.description.trim().length > 0 && (
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <MessageSquare className="w-4 h-4 mt-1 text-gray-400" />
                <p className="text-sm">{record.description}</p>
              </div>
            )}
            
            {Array.isArray(record.completed_items) && record.completed_items.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  已完成项目
                </h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 pl-6 space-y-1 list-disc">
                  {record.completed_items.map((item, index) => (
                    <li key={index}>{(item as { content?: string }).content || JSON.stringify(item)}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {Array.isArray(record.next_steps) && record.next_steps.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  下一步计划
                </h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 pl-6 space-y-1 list-disc">
                  {record.next_steps.map((item, index) => (
                    <li key={index}>{(item as { content?: string }).content || JSON.stringify(item)}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>
                记录人：
                {record.employee?.name ||
                  record.recorder?.name ||
                  (record.recorded_by ? `ID-${record.recorded_by}` : '未知')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceProgressHistory;