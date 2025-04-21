import React, { useState, useEffect } from 'react';
import { leadService, employeeService, financeService } from '../services';
import { LeadPriority, Lead } from '../types/lead';
import { ServiceType } from '../types/finance';
import { X, Plus } from 'lucide-react';
import { Employee } from '../services/employeeService';
import { ServiceType as ServiceTypeData } from '../services/serviceTypeService';
import { Mentor } from '../services/mentorService';

// 用于本组件的表单数据接口
interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: string;
  interest: string;
  assigned_to: string;
  priority: LeadPriority;
  notes: string;
  gender: string;
  date: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
  leadToEdit?: Lead; // 添加可选的线索对象用于编辑模式
  serviceTypes?: ServiceTypeData[]; // 可选的服务类型列表
  mentors?: Mentor[]; // 可选的顾问列表
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadAdded,
  leadToEdit,
  serviceTypes = [],
  mentors = []
}) => {
  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    source: '',
    interest: '',
    assigned_to: '',
    priority: 'medium' as LeadPriority,
    notes: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [leadSources, setLeadSources] = useState<Array<{ id: string; name: string }>>([]);
  const [localServiceTypes, setLocalServiceTypes] = useState<ServiceTypeData[]>([]);
  const [localMentors, setLocalMentors] = useState<Mentor[]>([]);
  
  // 是否为编辑模式
  const isEditMode = Boolean(leadToEdit);

  // 当leadToEdit变化时更新表单数据
  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        source: leadToEdit.source || '',
        interest: leadToEdit.interest || '',
        assigned_to: leadToEdit.assignedTo || '',
        priority: leadToEdit.priority || 'medium',
        notes: leadToEdit.notes || '',
        gender: leadToEdit.gender || '',
        date: leadToEdit.date || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [leadToEdit]);

  // 当传入的serviceTypes和mentors变化时更新本地数据
  useEffect(() => {
    if (serviceTypes && serviceTypes.length > 0) {
      setLocalServiceTypes(serviceTypes);
    }
    
    if (mentors && mentors.length > 0) {
      setLocalMentors(mentors);
    }
  }, [serviceTypes, mentors]);

  // 获取本地资源
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取线索来源
        const leadSourcesData = await leadService.getLeadSources();
        // 将字符串数组转换为对象数组，以适配组件预期的格式
        const formattedSources = leadSourcesData.map((source, index) => ({
          id: String(index),
          name: source
        }));
        setLeadSources(formattedSources);
        
        // 获取本地数据（如果props中没有提供）
        if (serviceTypes.length === 0) {
          try {
            const types = await financeService.getServiceTypes();
            setLocalServiceTypes(types);
          } catch (error) {
            console.error('获取服务类型数据失败:', error);
          }
        }
        
        if (mentors.length === 0) {
          try {
            const employees = await employeeService.getAllEmployees();
            // 此处假定Employee和Mentor结构类似
            // 实际项目中需要适当转换
            setLocalMentors(employees as unknown as Mentor[]);
          } catch (error) {
            console.error('获取顾问数据失败:', error);
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        // 即使出错，也提供一些默认选项
        setLeadSources([
          { id: '1', name: '官网表单' },
          { id: '2', name: '社交媒体' },
          { id: '3', name: '转介绍' },
          { id: '4', name: '合作方' },
          { id: '5', name: '电话咨询' },
          { id: '6', name: '其他' }
        ]);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, serviceTypes.length, mentors.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 姓名为必填项
    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }
    
    // 邮箱不再是必填项，但如果填写了需要验证格式
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    // 手机号不再是必填项，但如果填写了需要验证格式
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    
    // 其他字段的验证...
    if (!formData.source.trim()) {
      newErrors.source = '来源不能为空';
    }
    
    if (!formData.interest.trim()) {
      newErrors.interest = '意向项目不能为空';
    }
    
    // 优先级为必填项
    if (!formData.priority) {
      newErrors.priority = '请选择优先级';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // 确保所有必填字段都有值
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        source: formData.source.trim(),
        interest: formData.interest.trim(),
        assigned_to: formData.assigned_to.trim(),
        priority: formData.priority || 'medium',
        notes: formData.notes.trim(),
        gender: formData.gender.trim(),
        date: formData.date.trim(),
      };
      
      if (isEditMode && leadToEdit) {
        // 编辑现有线索
        await leadService.updateLead(leadToEdit.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source: formData.source.trim(),
          interest: formData.interest.trim(),
          assignedTo: formData.assigned_to.trim(),
          priority: formData.priority,
          notes: formData.notes.trim(),
          gender: formData.gender.trim(),
          date: formData.date.trim(),
        });
        alert('线索更新成功');
      } else {
        // 创建新线索
        await leadService.createLead(leadData);
        alert('线索添加成功');
      }
      
      // 重置表单
      setFormData(initialFormData);
      
      // 回调函数通知父组件
      onLeadAdded();
    } catch (error) {
      console.error(isEditMode ? '更新线索失败:' : '添加线索失败:', error);
      
      if (error instanceof Error) {
        alert(`${isEditMode ? '更新' : '添加'}线索失败: ${error.message}`);
      } else {
        alert(`${isEditMode ? '更新' : '添加'}线索失败，请检查必填字段是否填写正确`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单函数
  const resetForm = () => {
    if (isEditMode && leadToEdit) {
      // 编辑模式下重置为原始值
      setFormData({
        name: leadToEdit.name || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        source: leadToEdit.source || '',
        interest: leadToEdit.interest || '',
        assigned_to: leadToEdit.assignedTo || '',
        priority: leadToEdit.priority || 'medium',
        notes: leadToEdit.notes || '',
        gender: leadToEdit.gender || '',
        date: leadToEdit.date || new Date().toISOString().split('T')[0],
      });
    } else {
      // 添加模式下重置为初始值
      setFormData(initialFormData);
    }
    setErrors({});
  };

  // 意向项目选项
  const interestOptions = [
    { id: '1', name: '美国本科申请' },
    { id: '2', name: '英国本科申请' },
    { id: '3', name: '美国硕士申请' },
    { id: '4', name: '英国硕士申请' },
    { id: '5', name: '澳大利亚硕士申请' },
    { id: '6', name: '加拿大高中申请' },
    { id: '7', name: '新加坡大学申请' },
    { id: '8', name: '香港大学申请' }
  ];

  // 顾问选项
  const consultantOptions = [
    { id: '1', name: '李顾问' },
    { id: '2', name: '王顾问' },
    { id: '3', name: '张顾问' },
    { id: '4', name: '刘顾问' },
    { id: '5', name: '黄顾问' },
    { id: '6', name: '周顾问' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-white">
            {isEditMode ? '编辑线索' : '添加新线索'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                电话
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                来源 <span className="text-red-500">*</span>
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.source ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">请选择来源</option>
                {leadSources.length > 0 ? (
                  leadSources.map(source => (
                    <option key={source.id} value={source.name}>
                      {source.name}
                    </option>
                  ))
                ) : (
                  // 默认选项，即使API没有返回数据也能显示
                  <>
                    <option value="官网表单">官网表单</option>
                    <option value="社交媒体">社交媒体</option>
                    <option value="转介绍">转介绍</option>
                    <option value="合作方">合作方</option>
                    <option value="电话咨询">电话咨询</option>
                    <option value="其他">其他</option>
                  </>
                )}
              </select>
              {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
            </div>
            
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                意向项目
              </label>
              <select
                id="interest"
                name="interest"
                value={formData.interest || ''}
                onChange={e => handleChange(e)}
                className={`w-full p-2 border rounded-lg ${
                  errors.interest ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              >
                <option value="">请选择意向项目</option>
                {localServiceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.interest && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.interest}</p>}
            </div>
            
            <div>
              <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                负责顾问
              </label>
              <select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to || ''}
                onChange={e => handleChange(e)}
                className={`w-full p-2 border rounded-lg ${
                  errors.assigned_to ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              >
                <option value="">请选择负责顾问</option>
                {localMentors.map(mentor => (
                  <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                ))}
              </select>
              {errors.assigned_to && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.assigned_to}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                优先级 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as const).map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="text-sm dark:text-gray-300">
                      {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                性别
              </label>
              <div className="flex gap-2">
                {['男', '女', '其他'].map(genderOption => (
                  <label key={genderOption} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={genderOption}
                      checked={formData.gender === genderOption}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="text-sm dark:text-gray-300">{genderOption}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                接入日期
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                备注
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="请输入备注信息"
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              重置
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? '提交中...' : isEditMode ? '保存修改' : '提交'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal; 