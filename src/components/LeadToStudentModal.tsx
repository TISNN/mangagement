import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Check, Calendar, School, Briefcase, AlertCircle } from 'lucide-react';
import { ServiceType } from '../types/finance';
import { Lead } from '../types/lead';
import { peopleService, financeService } from '../services';
import { getCurrentLocalDate } from '../utils/dateUtils';

interface LeadToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
  lead: Lead | null;
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  birth_date: '',
  school: '',
  major: '',
  education_level: '',
  graduation_year: '',
  status: '活跃',
  is_active: true,
  notes: '',
  services: [],
  lead_ref_id: 0,
};

const LeadToStudentModal: React.FC<LeadToStudentModalProps> = ({ 
  isOpen, 
  onClose, 
  onStudentAdded,
  lead 
}) => {
  // 表单数据状态
  const [formData, setFormData] = useState(initialFormData);
  
  // 服务类型列表
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  
  // 错误状态
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    services: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // 组件挂载时获取服务类型
  useEffect(() => {
    // 获取服务类型
    const fetchServiceTypes = async () => {
      try {
        const types = await financeService.getServiceTypes();
        setServiceTypes(types);
      } catch (error) {
        console.error('获取服务类型失败', error);
        setError('获取服务类型失败');
      }
    };
    
    fetchServiceTypes();
  }, []);
  
  // 从lead数据预填充表单
  useEffect(() => {
    if (lead) {
      setFormData({
        ...initialFormData,
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        notes: lead.notes || '',
        lead_ref_id: lead.id || 0
      });
    }
  }, [lead]);
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除对应字段的错误信息
    if (name in formErrors) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // 处理服务类型选择
  const handleServiceToggle = (serviceTypeId: number) => {
    let updatedServices = [...formData.services];
    
    if (updatedServices.includes(serviceTypeId)) {
      updatedServices = updatedServices.filter(id => id !== serviceTypeId);
    } else {
      updatedServices.push(serviceTypeId);
    }
    
    setFormData({
      ...formData,
      services: updatedServices
    });
    
    // 清除服务选择错误
    if (updatedServices.length > 0) {
      setFormErrors({
        ...formErrors,
        services: ''
      });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      services: ''
    };
    
    // 验证姓名
    if (!formData.name.trim()) {
      errors.name = '请输入学生姓名';
      isValid = false;
    }
    
    // 验证邮箱（如果填写了）
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }
    
    // 验证至少选择了一个服务
    if (formData.services.length === 0) {
      errors.services = '请至少选择一个服务';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // 记录表单数据
      console.log('提交表单数据:', JSON.stringify(formData, null, 2));
      
      // 创建学生记录
      const studentData: {
        name: string;
        email?: string;
        phone?: string;
        gender?: string;
        birth_date?: string;
        school?: string;
        major?: string;
        education_level?: string;
        graduation_year?: number;
        is_active: boolean;
        status: string;
        notes?: string;
        lead_ref_id?: string;
      } = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        birth_date: formData.birth_date || undefined,
        school: formData.school || undefined,
        major: formData.major || undefined,
        education_level: formData.education_level || undefined,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : undefined,
        is_active: true,
        status: '活跃', // 新增学生默认为"活跃"状态
        notes: formData.notes
      };
      
      // 如果有关联的线索，添加线索引用ID
      if (lead) {
        studentData.lead_ref_id = lead.id;
      }
      
      console.log('准备创建学生:', JSON.stringify(studentData, null, 2));
      
      // 使用 peopleService.upsertStudent 创建学生记录
      try {
        const createdStudent = await peopleService.upsertStudent(studentData);
        console.log('成功创建学生:', createdStudent);
        
        // 为学生添加所有选择的服务
        for (const serviceTypeId of formData.services) {
          console.log(`添加服务, 学生ID=${createdStudent.id}, 服务类型ID=${serviceTypeId}`);
          try {
            await peopleService.upsertStudentService({
              student_id: createdStudent.id,
              student_ref_id: createdStudent.id,
              service_type_id: serviceTypeId,
              status: 'not_started',
              enrollment_date: getCurrentLocalDate()
            });
          } catch (serviceError) {
            console.error(`添加服务失败:`, serviceError);
            throw serviceError;
          }
        }
        
        // 如果是从线索转换来的，更新线索状态为"已签约"
        if (lead && lead.id) {
          try {
            await peopleService.updateLeadStatus(lead.id, 'converted');
            console.log(`成功更新线索${lead.id}状态为已签约`);
          } catch (leadError) {
            console.error(`更新线索状态失败:`, leadError);
            // 不抛出错误，因为学生已经创建成功
          }
        }
        
        // 成功添加
        onStudentAdded();
        onClose();
      } catch (studentError) {
        console.error(`创建学生失败:`, studentError);
        setError(`创建学生时出错: ${studentError instanceof Error ? studentError.message : '未知错误'}`);
        throw studentError;
      }
    } catch (error) {
      console.error('添加学生失败', error);
      setError(`添加学生失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 重置表单函数
  const resetForm = () => {
    // 如果有lead数据，保留lead相关的基本信息
    if (lead) {
      setFormData({
        ...initialFormData,
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        lead_ref_id: lead.id || 0
      });
    } else {
      setFormData(initialFormData);
    }
    setFormErrors({});
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">将线索转换为学生</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-xl ${
                      formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 dark:text-white`}
                    placeholder="输入学生姓名"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
              </div>
              
              {/* 邮箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 w-full border rounded-xl ${
                      formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 dark:text-white`}
                    placeholder="输入邮箱"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
              </div>
              
              {/* 电话 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  电话
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="输入电话号码"
                  />
                </div>
              </div>
              
              {/* 性别 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  性别
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">选择性别</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              {/* 出生日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  出生日期
                </label>
                <div className="relative">
                  <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              {/* 学校 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  就读学校
                </label>
                <div className="relative">
                  <School className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="输入学校名称"
                  />
                </div>
              </div>
              
              {/* 专业 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  专业
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="输入专业"
                />
              </div>
              
              {/* 教育水平 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  教育水平
                </label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">选择教育水平</option>
                  <option value="高中">高中</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              {/* 毕业年份 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  毕业年份
                </label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="输入毕业年份"
                  min="1900"
                  max="2100"
                />
              </div>
              
              {/* 备注 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full border border-gray-200 rounded-xl bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="输入备注信息"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            {/* 服务类型选择 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                服务类型 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceToggle(service.id)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${
                      formData.services.includes(service.id)
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700'
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-100 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>{service.name}</span>
                    {formData.services.includes(service.id) && (
                      <Check className="h-4 w-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
              {formErrors.services && (
                <p className="mt-2 text-sm text-red-500">{formErrors.services}</p>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              disabled={submitting}
            >
              取消
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-medium transition-colors"
              disabled={submitting}
            >
              重置表单
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  处理中...
                </>
              ) : (
                <>
                  转换为学生
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadToStudentModal; 