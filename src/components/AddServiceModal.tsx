import React, { useState, useEffect, useMemo } from 'react';
import { X, Layers, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { ServiceType } from '../types/finance';
import { peopleService } from '../services';
import { getCurrentLocalDate } from '../utils/dateUtils';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded: () => void;
  studentId: number;
  existingServiceTypeIds?: number[]; // 已存在的服务类型ID列表
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onServiceAdded,
  studentId,
  existingServiceTypeIds = []
}) => {
  // 服务类型选项
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // 获取服务类型选项
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setIsLoading(true);
        const serviceTypesData = await peopleService.getAllServiceTypes();
        setServiceTypes(serviceTypesData);
        const parentIds = serviceTypesData.filter((type) => type.parent_id === null).map((type) => type.id);
        setExpandedParents(new Set(parentIds));
      } catch (error) {
        console.error('获取服务类型失败', error);
        setError('获取服务类型失败');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchServiceTypes();
      setSelectedServices([]);
      setError('');
    }
  }, [isOpen]);

  // 处理服务类型选择
  const handleServiceToggle = (serviceTypeId: number) => {
    if (selectedServices.includes(serviceTypeId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceTypeId));
    } else {
      setSelectedServices([...selectedServices, serviceTypeId]);
    }
  };

  const toggleParentExpansion = (parentId: number) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const parentOptions = useMemo(() => serviceTypes.filter((type) => type.parent_id === null), [serviceTypes]);
  const childMap = useMemo(() => {
    const grouped = new Map<number, ServiceType[]>();
    serviceTypes
      .filter((type) => typeof type.parent_id === 'number')
      .forEach((child) => {
        const parentId = child.parent_id as number;
        if (!grouped.has(parentId)) {
          grouped.set(parentId, []);
        }
        grouped.get(parentId)!.push(child);
      });
    return grouped;
  }, [serviceTypes]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      setError('请至少选择一个服务');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // 过滤掉已存在的服务类型
      const newServices = selectedServices.filter(id => !existingServiceTypeIds.includes(id));
      
      if (newServices.length === 0) {
        setError('所选服务已存在，请选择其他服务');
        setSubmitting(false);
        return;
      }
      
      // 添加新服务
      for (const serviceTypeId of newServices) {
        await peopleService.upsertStudentService({
          student_id: studentId,
          student_ref_id: studentId,
          service_type_id: serviceTypeId,
          status: 'not_started',
          enrollment_date: getCurrentLocalDate()
        });
      }
      
      // 成功添加
      onServiceAdded();
      onClose();
    } catch (error: any) {
      console.error('添加服务失败', error);
      setError(`添加服务失败: ${error.message || '请重试'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl mx-auto my-3">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
          {/* 模态框头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">添加服务</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 模态框内容 */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {parentOptions.map((parent) => {
                  const children = childMap.get(parent.id) || [];
                  const isExpanded = expandedParents.has(parent.id);
                  const hasSelectedChild = children.some(child => selectedServices.includes(child.id));
                  
                  return (
                    <div key={parent.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleParentExpansion(parent.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          hasSelectedChild ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">{parent.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {isExpanded && children.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          {children.map((child) => {
                            const isSelected = selectedServices.includes(child.id);
                            const isExisting = existingServiceTypeIds.includes(child.id);
                            
                            return (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => !isExisting && handleServiceToggle(child.id)}
                                disabled={isExisting}
                                className={`w-full flex items-center justify-between px-6 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                                } ${isExisting ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <span className="text-gray-700 dark:text-gray-300">{child.name}</span>
                                {isExisting ? (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">已存在</span>
                                ) : isSelected ? (
                                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </form>

          {/* 模态框底部 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting || selectedServices.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '添加中...' : '添加服务'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;

