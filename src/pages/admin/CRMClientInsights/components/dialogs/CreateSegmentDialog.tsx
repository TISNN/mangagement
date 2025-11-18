/**
 * 新建动态分群对话框组件
 * 支持创建动态分群和静态分群
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Sparkles, Clock, Users, Lock, Globe } from 'lucide-react';
import { SegmentationCondition } from '../../types';

interface CreateSegmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (segmentData: SegmentFormData) => void;
}

export interface SegmentFormData {
  name: string;
  description: string;
  isDynamic: boolean;
  refreshFrequency?: 'hourly' | 'daily' | 'weekly';
  conditions: SegmentationCondition[];
  visibility: 'private' | 'team' | 'global';
  enableNotification?: boolean;
}

const CreateSegmentDialog: React.FC<CreateSegmentDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<SegmentFormData>({
    name: '',
    description: '',
    isDynamic: true,
    refreshFrequency: 'daily',
    conditions: [],
    visibility: 'team',
    enableNotification: false,
  });

  const [currentCondition, setCurrentCondition] = useState<Partial<SegmentationCondition>>({
    type: '标签',
    operator: '包含',
    relation: 'AND',
  });

  const conditionTypes = ['标签', '字段', '行为', '模型'];
  const operators = {
    标签: ['包含', '不包含', '等于'],
    字段: ['等于', '不等于', '大于', '小于', '包含', '不包含'],
    行为: ['>=', '<=', '等于', '最近X天'],
    模型: ['>=', '<=', '等于'],
  };

  const handleAddCondition = () => {
    if (!currentCondition.field || !currentCondition.value) {
      alert('请填写完整的条件信息');
      return;
    }

    const newCondition: SegmentationCondition = {
      id: `c${Date.now()}`,
      type: currentCondition.type || '标签',
      field: currentCondition.field,
      operator: currentCondition.operator || '包含',
      value: currentCondition.value,
      relation: currentCondition.relation,
    };

    setFormData({
      ...formData,
      conditions: [...formData.conditions, newCondition],
    });

    // 重置当前条件
    setCurrentCondition({
      type: '标签',
      operator: '包含',
      relation: formData.conditions.length > 0 ? 'AND' : undefined,
    });
  };

  const handleRemoveCondition = (id: string) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((c) => c.id !== id),
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入分群名称');
      return;
    }
    if (formData.conditions.length === 0) {
      alert('请至少添加一个分群条件');
      return;
    }

    onSave(formData);
    // 重置表单
    setFormData({
      name: '',
      description: '',
      isDynamic: true,
      refreshFrequency: 'daily',
      conditions: [],
      visibility: 'team',
      enableNotification: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">新建动态分群</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">创建客户分群，支持动态刷新和自动通知</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">基本信息</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  分群名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：高潜力待激活客户"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分群描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述这个分群的用途和特点..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 分群类型 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">分群类型</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, isDynamic: true })}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  formData.isDynamic
                    ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={`h-5 w-5 ${formData.isDynamic ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${formData.isDynamic ? 'text-indigo-600' : 'text-gray-600'} dark:text-gray-300`}>
                    动态分群
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  实时刷新，自动更新成员，支持订阅通知
                </p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, isDynamic: false })}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  !formData.isDynamic
                    ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Save className={`h-5 w-5 ${!formData.isDynamic ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${!formData.isDynamic ? 'text-indigo-600' : 'text-gray-600'} dark:text-gray-300`}>
                    静态分群
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  快照模式，保存当前客户列表，用于一次性活动
                </p>
              </button>
            </div>

            {formData.isDynamic && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  刷新频率
                </label>
                <select
                  value={formData.refreshFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      refreshFrequency: e.target.value as 'hourly' | 'daily' | 'weekly',
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="hourly">每小时</option>
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                </select>
              </div>
            )}
          </div>

          {/* 分群条件 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">分群条件</h3>

            {/* 已添加的条件 */}
            {formData.conditions.length > 0 && (
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div
                    key={condition.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {index > 0 && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {condition.relation}
                        </span>
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{condition.type}</span> · {condition.field} {condition.operator}{' '}
                        <span className="text-indigo-600 dark:text-indigo-300">{condition.value}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveCondition(condition.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-rose-600 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 添加新条件 */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">类型</label>
                  <select
                    value={currentCondition.type}
                    onChange={(e) =>
                      setCurrentCondition({
                        ...currentCondition,
                        type: e.target.value as any,
                        operator: operators[e.target.value as keyof typeof operators]?.[0] || '包含',
                      })
                    }
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {conditionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">字段</label>
                  <input
                    type="text"
                    value={currentCondition.field || ''}
                    onChange={(e) => setCurrentCondition({ ...currentCondition, field: e.target.value })}
                    placeholder="选择字段"
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">操作符</label>
                  <select
                    value={currentCondition.operator}
                    onChange={(e) => setCurrentCondition({ ...currentCondition, operator: e.target.value })}
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {operators[currentCondition.type as keyof typeof operators]?.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">值</label>
                  <input
                    type="text"
                    value={currentCondition.value || ''}
                    onChange={(e) => setCurrentCondition({ ...currentCondition, value: e.target.value })}
                    placeholder="输入值"
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  {formData.conditions.length > 0 && (
                    <select
                      value={currentCondition.relation || 'AND'}
                      onChange={(e) =>
                        setCurrentCondition({
                          ...currentCondition,
                          relation: e.target.value as 'AND' | 'OR',
                        })
                      }
                      className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddCondition}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-2 text-sm text-indigo-600 hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300"
              >
                <Plus className="h-4 w-4" />
                添加条件
              </button>
            </div>
          </div>

          {/* 权限设置 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">权限设置</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'private', label: '私有', icon: Lock, desc: '仅自己可见' },
                { value: 'team', label: '团队共享', icon: Users, desc: '团队成员可见' },
                { value: 'global', label: '全局', icon: Globe, desc: '所有人可见' },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, visibility: option.value as any })}
                    className={`rounded-lg border-2 p-3 text-left transition-all ${
                      formData.visibility === option.value
                        ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 mb-1 ${
                        formData.visibility === option.value ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-sm font-semibold ${
                        formData.visibility === option.value ? 'text-indigo-600' : 'text-gray-600'
                      } dark:text-gray-300`}
                    >
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 通知设置（仅动态分群） */}
          {formData.isDynamic && (
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enableNotification}
                  onChange={(e) => setFormData({ ...formData, enableNotification: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  启用通知：当分群成员发生变化时发送提醒
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            创建分群
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSegmentDialog;

