import React, { useEffect, useMemo, useState } from 'react';
import { X, TrendingUp, Calendar, MessageSquare, CheckSquare, ArrowRight } from 'lucide-react';
import { peopleService } from '../services';
import { formatDate } from '../utils/dateUtils';

interface ServiceProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdated: () => void;
  serviceId: number;
  currentProgress: number;
  serviceName: string;
  recorderId?: number;
  employeeRefId?: number;
}

const ServiceProgressModal: React.FC<ServiceProgressModalProps> = ({
  isOpen,
  onClose,
  onProgressUpdated,
  serviceId,
  currentProgress,
  serviceName,
  recorderId,
  employeeRefId,
}) => {
  const [progress, setProgress] = useState(currentProgress);
  const [description, setDescription] = useState('');
  const [completedItems, setCompletedItems] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const effectiveRecorderId = useMemo(() => {
    if (typeof recorderId === 'number') return recorderId;
    if (typeof employeeRefId === 'number') return employeeRefId;
    return null;
  }, [recorderId, employeeRefId]);

  useEffect(() => {
    if (isOpen) {
      setProgress(currentProgress);
      setDescription('');
      setCompletedItems('');
      setNextSteps('');
      setError('');
    }
  }, [isOpen, currentProgress]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (effectiveRecorderId === null) {
      setError('未检测到有效的记录人身份，请联系管理员。');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 将completedItems和nextSteps解析为数组
      const completedItemsArray = completedItems
        .split('\n')
        .filter(item => item.trim())
        .map(item => ({ content: item.trim() }));

      const nextStepsArray = nextSteps
        .split('\n')
        .filter(item => item.trim())
        .map(item => ({ content: item.trim() }));

      await peopleService.addServiceProgress({
        student_service_id: serviceId,
        milestone: `${progress}%`,
        progress_date: new Date().toISOString().split('T')[0],
        description: description,
        notes: '',
        completed_items: completedItemsArray.length > 0 ? completedItemsArray : undefined,
        next_steps: nextStepsArray.length > 0 ? nextStepsArray : undefined,
        recorded_by: effectiveRecorderId,
        employee_ref_id: employeeRefId ?? effectiveRecorderId ?? undefined,
      });

      onProgressUpdated();
      onClose();
    } catch (error) {
      console.error('更新服务进度失败:', error);
      setError('更新进度失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-auto my-3">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          {/* 模态框头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              更新服务进度
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {serviceName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>当前日期: {formatDate(new Date().toISOString())}</span>
                </div>
              </div>

              {/* 进度滑块 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  当前进度
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* 进度说明 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  进度说明
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="记录本次进度更新的详细说明..."
                  />
                </div>
              </div>

              {/* 已完成项目 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  已完成项目（每行一项）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={completedItems}
                    onChange={(e) => setCompletedItems(e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="列出本次完成的主要项目..."
                  />
                </div>
              </div>

              {/* 下一步计划 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  下一步计划（每行一项）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="列出接下来计划完成的任务..."
                  />
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    更新进度
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceProgressModal; 