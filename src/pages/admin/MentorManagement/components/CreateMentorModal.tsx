import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, Phone, MapPin, DollarSign, FileText, Tag, Briefcase } from 'lucide-react';

import { createMentor, type CreateMentorData } from '../services/mentorManagementService';

interface CreateMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SERVICE_SCOPE_OPTIONS = [
  '留学申请',
  '课业辅导',
  '科研',
  '语言培训',
  '文书指导',
  '材料审核',
  '面试辅导',
  '选校咨询',
];

const EXPERTISE_LEVEL_OPTIONS = ['初级', '中级', '高级', '专家'];

const GENDER_OPTIONS = ['男', '女', '其他'];

export const CreateMentorModal: React.FC<CreateMentorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateMentorData>({
    name: '',
    email: '',
    contact: '',
    gender: '',
    location: '',
    specializations: [],
    service_scope: [],
    expertise_level: '',
    hourly_rate: undefined,
    bio: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [specializationInput, setSpecializationInput] = useState('');

  // 重置表单
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        contact: '',
        gender: '',
        location: '',
        specializations: [],
        service_scope: [],
        expertise_level: '',
        hourly_rate: undefined,
        bio: '',
        is_active: true,
      });
      setErrors({});
      setSpecializationInput('');
    }
  }, [isOpen]);

  // 生成默认头像
  const generateAvatar = () => {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name || 'mentor')}`;
    setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
  };

  // 添加专业领域
  const handleAddSpecialization = () => {
    const trimmed = specializationInput.trim();
    if (trimmed && !formData.specializations?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...(prev.specializations || []), trimmed],
      }));
      setSpecializationInput('');
    }
  };

  // 删除专业领域
  const handleRemoveSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations?.filter((s) => s !== spec) || [],
    }));
  };

  // 切换服务范围
  const handleToggleServiceScope = (scope: string) => {
    setFormData((prev) => {
      const current = prev.service_scope || [];
      const updated = current.includes(scope)
        ? current.filter((s) => s !== scope)
        : [...current, scope];
      return { ...prev, service_scope: updated };
    });
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // 如果没有设置头像，生成一个
      if (!formData.avatar_url) {
        generateAvatar();
      }

      await createMentor(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('创建导师失败:', error);
      setErrors({ submit: error instanceof Error ? error.message : '创建失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        {/* 头部 */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">新增导师</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.submit}
            </div>
          )}

          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">基本信息</h3>

            {/* 姓名 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4" />
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                }`}
                placeholder="请输入导师姓名"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            {/* 邮箱和电话 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  联系电话
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="138-0000-0000"
                />
              </div>
            </div>

            {/* 性别和地区 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">性别</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">请选择</option>
                  {GENDER_OPTIONS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  地区
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="例如：北京、上海"
                />
              </div>
            </div>
          </div>

          {/* 专业信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">专业信息</h3>

            {/* 专业领域 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4" />
                专业领域
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialization();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="输入专业领域后按回车添加"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
              {formData.specializations && formData.specializations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(spec)}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 服务范围 */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Briefcase className="h-4 w-4" />
                服务范围
              </label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {SERVICE_SCOPE_OPTIONS.map((scope) => (
                  <label
                    key={scope}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={formData.service_scope?.includes(scope) || false}
                      onChange={() => handleToggleServiceScope(scope)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 专业级别和时薪 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">专业级别</label>
                <select
                  value={formData.expertise_level}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expertise_level: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">请选择</option>
                  {EXPERTISE_LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  时薪（元/小时）
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* 个人简介 */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4" />
              个人简介
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="请输入导师的个人简介、教育背景、工作经验等..."
            />
          </div>

          {/* 状态 */}
          <div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">激活状态（导师可被分配任务）</span>
            </label>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                '创建导师'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

