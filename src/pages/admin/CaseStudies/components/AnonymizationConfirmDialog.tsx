import React from 'react';
import { X, Shield, CheckCircle2 } from 'lucide-react';

interface AnonymizationConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  caseStudyName?: string;
}

const AnonymizationConfirmDialog: React.FC<AnonymizationConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  caseStudyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* 对话框 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                确认分享到公共案例库
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              分享后案例将对所有用户可见，系统将自动进行去敏处理以保护学生隐私。
            </p>

            {caseStudyName && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">案例名称</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{caseStudyName}</p>
              </div>
            )}

            {/* 去敏规则列表 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">去敏处理规则：</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    学生姓名只保留姓的字母，比如张三 → Z同学
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    学生关联信息将被移除
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    联系方式将被清除
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    学术信息、相关经历将保留
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 提示：分享后您可以随时撤回，案例将恢复为私有状态。
              </p>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors font-medium"
            >
              确认分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymizationConfirmDialog;

