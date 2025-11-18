/**
 * 发布需求页面
 * 创建新的空间需求
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { createRequest, updateRequest, getRequestById } from '../services/requestService';
import type { CreateRequestData, UpdateRequestData, SpaceType, BudgetRange, Urgency } from '../types';
import { SPACE_TYPE_LABELS, BUDGET_RANGE_LABELS, URGENCY_LABELS } from '../types';

export const CreateRequestPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const requestId = id ? parseInt(id) : undefined;
  const isEditMode = Boolean(requestId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRequestData>({
    title: '',
    request_type: 'office',
    description: '',
    target_cities: [],
    target_districts: [],
    max_distance: undefined,
    use_date: '',
    use_time_start: '09:00',
    use_time_end: '18:00',
    duration_hours: undefined,
    expected_capacity: 1,
    required_facilities: [],
    preferences: '',
    budget_range: undefined,
    max_budget: undefined,
    urgency: 'normal',
  });

  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [loadingData, setLoadingData] = useState(isEditMode);

  // 编辑模式：加载现有数据
  useEffect(() => {
    if (isEditMode && requestId) {
      loadRequestData();
    }
  }, [isEditMode, requestId]);

  const loadRequestData = async () => {
    if (!requestId) return;
    try {
      setLoadingData(true);
      const request = await getRequestById(requestId);
      if (request) {
        setFormData({
          title: request.title,
          request_type: request.request_type,
          description: request.description || '',
          target_cities: request.target_cities,
          target_districts: request.target_districts || [],
          max_distance: request.max_distance,
          use_date: request.use_date,
          use_time_start: request.use_time_start,
          use_time_end: request.use_time_end,
          duration_hours: request.duration_hours,
          expected_capacity: request.expected_capacity,
          required_facilities: request.required_facilities,
          preferences: request.preferences || '',
          budget_range: request.budget_range,
          max_budget: request.max_budget,
          urgency: request.urgency,
        });
      }
    } catch (error) {
      console.error('加载需求数据失败:', error);
      alert('加载需求数据失败');
      navigate('/admin/shared-office/my-requests');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.use_date || !formData.use_time_start || !formData.use_time_end) {
      alert('请填写必填项：需求标题、使用日期和时间');
      return;
    }

    if (formData.target_cities.length === 0) {
      alert('请至少选择一个目标城市');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && requestId) {
        // 编辑模式
        await updateRequest(requestId, formData as UpdateRequestData, 1); // TODO: 获取真实用户ID
        alert('需求更新成功');
      } else {
        // 创建模式
        await createRequest(formData, 1); // TODO: 获取真实用户ID
        alert('需求发布成功，系统将为您匹配空间');
      }
      navigate('/admin/shared-office/my-requests');
    } catch (error) {
      console.error('保存需求失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = () => {
    if (newCity.trim() && !formData.target_cities.includes(newCity.trim())) {
      setFormData((prev) => ({
        ...prev,
        target_cities: [...prev.target_cities, newCity.trim()],
      }));
      setNewCity('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      target_cities: prev.target_cities.filter((c) => c !== city),
    }));
  };

  const handleAddDistrict = () => {
    if (newDistrict.trim() && !formData.target_districts?.includes(newDistrict.trim())) {
      setFormData((prev) => ({
        ...prev,
        target_districts: [...(prev.target_districts || []), newDistrict.trim()],
      }));
      setNewDistrict('');
    }
  };

  const handleRemoveDistrict = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      target_districts: prev.target_districts?.filter((d) => d !== district) || [],
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.required_facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({
        ...prev,
        required_facilities: [...prev.required_facilities, newFacility.trim()],
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      required_facilities: prev.required_facilities.filter((f) => f !== facility),
    }));
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? '编辑需求' : '发布新需求'}
          </h1>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* 基本信息 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  需求标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="如：上海客户面谈需要会议室"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    需求类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.request_type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, request_type: e.target.value as SpaceType }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    {Object.entries(SPACE_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    紧急程度
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, urgency: e.target.value as Urgency }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {Object.entries(URGENCY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  需求描述
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="请描述您的需求、用途、特殊要求等..."
                />
              </div>
            </div>
          </section>

          {/* 位置要求 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">位置要求</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  目标城市 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCity())}
                    placeholder="输入城市名称"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCity}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.target_cities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.target_cities.map((city, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {city}
                        <button
                          type="button"
                          onClick={() => handleRemoveCity(city)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  目标区域（可选）
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddDistrict())
                    }
                    placeholder="输入区域名称（如：静安区）"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDistrict}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.target_districts && formData.target_districts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.target_districts.map((district, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {district}
                        <button
                          type="button"
                          onClick={() => handleRemoveDistrict(district)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  最大距离（公里，可选）
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.max_distance || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      max_distance: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="如：5（表示距离目标区域5公里内）"
                />
              </div>
            </div>
          </section>

          {/* 时间要求 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">时间要求</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  使用日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.use_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, use_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  预计使用时长（小时）
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.duration_hours || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration_hours: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.use_time_start}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, use_time_start: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.use_time_end}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, use_time_end: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          {/* 空间要求 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">空间要求</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  预计人数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expected_capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expected_capacity: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  必需设施
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddFacility())
                    }
                    placeholder="输入必需设施（如：投影仪、白板等）"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.required_facilities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.required_facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {facility}
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(facility)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  偏好要求
                </label>
                <textarea
                  value={formData.preferences || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, preferences: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="如：安静环境、交通便利、停车位等"
                />
              </div>
            </div>
          </section>

          {/* 预算 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">预算设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  预算范围
                </label>
                <select
                  value={formData.budget_range || 'all'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      budget_range: e.target.value === 'all' ? undefined : (e.target.value as BudgetRange),
                      max_budget: e.target.value === 'all' ? undefined : prev.max_budget,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">不限</option>
                  {Object.entries(BUDGET_RANGE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.budget_range && formData.budget_range !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    最大预算（元）
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_budget || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_budget: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : isEditMode ? '更新需求' : '发布需求'}
          </button>
        </div>
      </form>
    </div>
  );
};

