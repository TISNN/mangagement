/**
 * 发布空间页面
 * 创建新的共享办公空间
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { createSpace, updateSpace, getSpaceById } from '../services/spaceService';
import type { CreateSpaceData, UpdateSpaceData, SpaceType, PricingModel, TimeSlot, OfficeSpace } from '../types';
import { SPACE_TYPE_LABELS, PRICING_MODEL_LABELS } from '../types';

export const CreateSpacePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const spaceId = id ? parseInt(id) : undefined;
  const isEditMode = Boolean(spaceId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSpaceData>({
    name: '',
    space_type: 'office',
    description: '',
    address: '',
    city: '',
    district: '',
    street: '',
    building: '',
    latitude: undefined,
    longitude: undefined,
    area: undefined,
    capacity: 1,
    facilities: [],
    photos: [],
    available_days: ['weekday'],
    available_time_slots: [{ start: '09:00', end: '18:00' }],
    pricing_model: 'free',
    price: undefined,
    currency: 'CNY',
    rules: '',
    special_notes: '',
  });

  const [newFacility, setNewFacility] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState({ start: '09:00', end: '18:00' });
  const [loadingData, setLoadingData] = useState(isEditMode);

  // 编辑模式：加载现有数据
  useEffect(() => {
    if (isEditMode && spaceId) {
      loadSpaceData();
    }
  }, [isEditMode, spaceId]);

  const loadSpaceData = async () => {
    if (!spaceId) return;
    try {
      setLoadingData(true);
      const space = await getSpaceById(spaceId);
      if (space) {
        setFormData({
          name: space.name,
          space_type: space.space_type,
          description: space.description || '',
          address: space.address,
          city: space.city,
          district: space.district || '',
          street: space.street || '',
          building: space.building || '',
          latitude: space.latitude,
          longitude: space.longitude,
          area: space.area,
          capacity: space.capacity,
          facilities: space.facilities,
          photos: space.photos,
          available_days: space.available_days,
          available_time_slots: space.available_time_slots,
          pricing_model: space.pricing_model,
          price: space.price,
          currency: space.currency,
          rules: space.rules || '',
          special_notes: space.special_notes || '',
        });
      }
    } catch (error) {
      console.error('加载空间数据失败:', error);
      alert('加载空间数据失败');
      navigate('/admin/shared-office/my-spaces');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city) {
      alert('请填写必填项：空间名称、地址、城市');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && spaceId) {
        // 编辑模式
        await updateSpace(spaceId, formData as UpdateSpaceData, 1); // TODO: 获取真实用户ID
        alert('空间更新成功');
      } else {
        // 创建模式
        await createSpace(formData, 1); // TODO: 获取真实用户ID
        alert('空间发布成功，等待审核');
      }
      navigate('/admin/shared-office/my-spaces');
    } catch (error) {
      console.error('保存空间失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }));
  };

  const handleAddTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      available_time_slots: [...prev.available_time_slots, { ...newTimeSlot }],
    }));
    setNewTimeSlot({ start: '09:00', end: '18:00' });
  };

  const handleRemoveTimeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      available_time_slots: prev.available_time_slots.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // TODO: 实际上传图片到 Supabase Storage
      // 这里先模拟，实际应该上传后获取URL
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 10), // 最多10张
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
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
            {isEditMode ? '编辑空间' : '发布新空间'}
          </h1>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* 基本信息 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  空间名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  空间类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.space_type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, space_type: e.target.value as SpaceType }))
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
                  可容纳人数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  面积（平方米）
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.area || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      area: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  空间描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="请描述您的空间环境、特色等..."
                />
              </div>
            </div>
          </section>

          {/* 位置信息 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">位置信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  城市 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  区/县
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  街道
                </label>
                <input
                  type="text"
                  value={formData.street || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  详细地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  经纬度（可选，用于地图定位）
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.0000001"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    placeholder="纬度"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    step="0.0000001"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    placeholder="经度"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 设施 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">设施清单</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())}
                  placeholder="输入设施名称（如：投影仪、白板、WiFi等）"
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
              {formData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility, index) => (
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
          </section>

          {/* 可用时间 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">可用时间</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  可用日期
                </label>
                <div className="flex flex-wrap gap-2">
                  {['weekday', 'weekend', 'holiday'].map((day) => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.available_days.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              available_days: [...prev.available_days, day],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              available_days: prev.available_days.filter((d) => d !== day),
                            }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {day === 'weekday' ? '工作日' : day === 'weekend' ? '周末' : '节假日'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  可用时间段
                </label>
                <div className="space-y-2">
                  {formData.available_time_slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => {
                          const newSlots = [...formData.available_time_slots];
                          newSlots[index].start = e.target.value;
                          setFormData((prev) => ({ ...prev, available_time_slots: newSlots }));
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <span className="text-gray-500">至</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => {
                          const newSlots = [...formData.available_time_slots];
                          newSlots[index].end = e.target.value;
                          setFormData((prev) => ({ ...prev, available_time_slots: newSlots }));
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      {formData.available_time_slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    添加时间段
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 价格 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">价格设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  价格模式 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pricing_model}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pricing_model: e.target.value as PricingModel,
                      price: e.target.value === 'free' ? undefined : prev.price,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  {Object.entries(PRICING_MODEL_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.pricing_model !== 'free' && formData.pricing_model !== 'negotiable' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    价格 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required={formData.pricing_model !== 'free' && formData.pricing_model !== 'negotiable'}
                  />
                </div>
              )}
            </div>
          </section>

          {/* 照片 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">空间照片</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  上传照片
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  最多上传10张，建议至少3张
                </span>
              </div>
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`空间照片 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 规则和说明 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">规则与说明</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  使用规则
                </label>
                <textarea
                  value={formData.rules || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rules: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="如：禁止吸烟、保持安静、使用后清洁等"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  特殊说明
                </label>
                <textarea
                  value={formData.special_notes || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, special_notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="如：需要提前预约、仅工作日可用等"
                />
              </div>
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
            {loading ? '保存中...' : isEditMode ? '更新空间' : '发布空间'}
          </button>
        </div>
      </form>
    </div>
  );
};

