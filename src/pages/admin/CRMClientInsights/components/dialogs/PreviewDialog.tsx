/**
 * 预览样本对话框组件
 */

import React from 'react';
import { X, Download, User, Mail, Phone } from 'lucide-react';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  segmentName?: string;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({ isOpen, onClose, segmentName = '当前分群' }) => {
  // 模拟客户样本数据
  const samples = [
    { id: '1', name: '王欣然', email: 'wang@example.com', phone: '138****1234', tags: ['高潜力', '活动活跃'] },
    { id: '2', name: '李明', email: 'li@example.com', phone: '139****5678', tags: ['高价值', '续约'] },
    { id: '3', name: '张华', email: 'zhang@example.com', phone: '137****9012', tags: ['推荐来源'] },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">预览样本</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{segmentName} · 共 128 人</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300">
              <Download className="h-4 w-4" />
              导出
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto p-4">
          <div className="space-y-3">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{sample.name}</div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {sample.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {sample.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sample.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            显示前 3 条，共 128 条记录
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewDialog;

