/**
 * 编辑选校信息模态框
 * 用于更新投递状态、申请账号密码等信息
 */

import { useState } from 'react';
import { X, Save, Calendar, Key, FileText } from 'lucide-react';
import { FinalUniversityChoice } from '../types';

interface EditUniversityChoiceModalProps {
  choice: FinalUniversityChoice;
  onClose: () => void;
  onSave: (id: number, updates: Partial<FinalUniversityChoice>) => Promise<void>;
}

export default function EditUniversityChoiceModal({
  choice,
  onClose,
  onSave
}: EditUniversityChoiceModalProps) {
  const [formData, setFormData] = useState({
    submission_status: choice.submission_status || '未投递',
    submission_date: choice.submission_date || '',
    application_account: choice.application_account || '',
    application_password: choice.application_password || '',
    application_round: choice.application_round || '',
    application_deadline: choice.application_deadline || '',
    decision_date: choice.decision_date || '',
    decision_result: choice.decision_result || '',
    notes: choice.notes || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(choice.id, formData);
      onClose();
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">编辑申请信息</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {choice.school_name} - {choice.program_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* 投递状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                投递状态 *
              </label>
              <select
                value={formData.submission_status}
                onChange={(e) => handleChange('submission_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="未投递">未投递</option>
                <option value="准备中">准备中</option>
                <option value="已投递">已投递</option>
                <option value="审核中">审核中</option>
                <option value="已录取">已录取</option>
                <option value="已拒绝">已拒绝</option>
                <option value="Waitlist">Waitlist</option>
              </select>
            </div>

            {/* 投递日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                投递日期
              </label>
              <input
                type="date"
                value={formData.submission_date}
                onChange={(e) => handleChange('submission_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* 申请轮次和截止日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  申请轮次
                </label>
                <select
                  value={formData.application_round}
                  onChange={(e) => handleChange('application_round', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">请选择</option>
                  <option value="ED">ED (Early Decision)</option>
                  <option value="ED2">ED2</option>
                  <option value="EA">EA (Early Action)</option>
                  <option value="REA">REA (Restrictive EA)</option>
                  <option value="RD">RD (Regular Decision)</option>
                  <option value="Rolling">Rolling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  申请截止日期
                </label>
                <input
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleChange('application_deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* 申请账号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Key className="inline h-4 w-4 mr-1" />
                申请账号
              </label>
              <input
                type="text"
                value={formData.application_account}
                onChange={(e) => handleChange('application_account', e.target.value)}
                placeholder="例如: wangzihan0521"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* 申请密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Key className="inline h-4 w-4 mr-1" />
                申请密码
              </label>
              <input
                type="password"
                value={formData.application_password}
                onChange={(e) => handleChange('application_password', e.target.value)}
                placeholder="输入申请系统密码"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                密码将加密存储，仅授权人员可见
              </p>
            </div>

            {/* 录取结果相关 */}
            {(formData.submission_status === '已录取' || formData.submission_status === '已拒绝' || formData.submission_status === 'Waitlist') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    决定日期
                  </label>
                  <input
                    type="date"
                    value={formData.decision_date}
                    onChange={(e) => handleChange('decision_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    决定结果
                  </label>
                  <input
                    type="text"
                    value={formData.decision_result}
                    onChange={(e) => handleChange('decision_result', e.target.value)}
                    placeholder="例如: 无条件录取"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* 备注 - 用于记录申请编号、网申系统等 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                备注（申请编号、网申系统等）
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                placeholder="例如：&#10;申请编号: K044785297&#10;网申系统: https://...&#10;Email: xxx@xxx.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                可以记录申请编号、网申系统链接、邮箱等信息
              </p>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

