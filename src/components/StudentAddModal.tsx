import React, { useState, useEffect, useMemo } from 'react';
import { X, User, Mail, Phone, Calendar, School, Briefcase, Check, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { ServiceType } from '../types/finance';
import { Person, StudentProfile } from '../types/people';
import { peopleService } from '../services';
import { financeService } from '../services';
import { StudentDisplay } from '../pages/admin/StudentsPage/StudentsPage';
import { getCurrentLocalDate } from '../utils/dateUtils';

interface StudentAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
  studentToEdit?: StudentDisplay; // 可选的编辑学生属性
}

const StudentAddModal: React.FC<StudentAddModalProps> = ({ isOpen, onClose, onStudentAdded, studentToEdit }) => {
  // 是否为编辑模式
  const isEditMode = !!studentToEdit;
  
  // 服务类型选项
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birth_date: '',
    school: '',
    major: '',
    education_level: '',
    graduation_year: '',
    services: [] as number[] // 保存所选服务类型ID
  });
  
  // 表单验证状态
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    services: ''
  });
  
  // 获取服务类型选项并填充表单（用于编辑模式）
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setIsLoading(true);
        // 使用peopleService的getAllServiceTypes方法获取服务类型
        const serviceTypesData = await peopleService.getAllServiceTypes();
        setServiceTypes(serviceTypesData);
        setIsLoading(false);
        
        // 如果是编辑模式，填充表单数据
        if (isEditMode && studentToEdit) {
          await populateFormForEditing(studentToEdit, serviceTypesData);
        }
        const parentIds = serviceTypesData.filter((type) => type.parent_id === null).map((type) => type.id);
        setExpandedParents(new Set(parentIds));
      } catch (error) {
        console.error('获取服务类型失败', error);
        setError('获取服务类型失败');
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchServiceTypes();
    }
  }, [isOpen, isEditMode, studentToEdit]);
  
  // 填充编辑表单数据
  const populateFormForEditing = async (student: StudentDisplay, availableServices: ServiceType[]) => {
    try {
      // 获取学生详细信息 - 在新的数据库结构中，学生表本身就包含了所有信息
      const studentDetails = await peopleService.getStudentById(student.person_id);
      // 学生档案信息也是从同一个学生记录获取
      const studentProfile = await peopleService.getStudentProfile(student.person_id);
      
      // 获取学生服务类型ID
      const serviceTypeIdSet = new Set(availableServices.map((service) => service.id));
      const selectedServiceIds = student.services
        .map((service) => service.serviceTypeId)
        .filter((id): id is number => typeof id === 'number' && serviceTypeIdSet.has(id));
      
      // 设置表单数据
      setFormData({
        name: studentDetails.name || '',
        email: studentDetails.email || '',
        phone: studentDetails.phone || '',
        gender: studentDetails.gender || '',
        birth_date: studentDetails.birth_date || '',
        school: studentProfile?.school || '',
        major: studentProfile?.major || '',
        education_level: studentProfile?.education_level || '',
        graduation_year: studentProfile?.graduation_year ? studentProfile.graduation_year.toString() : '',
        services: selectedServiceIds
      });
    } catch (error) {
      console.error('填充编辑表单数据失败', error);
      setError('加载学生数据失败');
    }
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      
      // 1. 创建或更新 student 记录（新数据库结构中，直接操作 students 表）
      const studentData: any = {
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
        status: '活跃' // 新增学生默认为"活跃"状态
      };
      
      // 如果是编辑模式，添加ID
      if (isEditMode && studentToEdit) {
        studentData.id = studentToEdit.person_id;
      }
      
      console.log('准备创建/更新学生:', JSON.stringify(studentData, null, 2));
      
      // 使用 peopleService.upsertStudent 直接创建或更新学生记录
      try {
        const createdStudent = await peopleService.upsertStudent(studentData);
        console.log('成功创建/更新学生:', createdStudent);
        
        // 3. 处理服务
        if (isEditMode && studentToEdit) {
          try {
            // 避免直接删除服务，而是逐个检查并只添加新服务
            // 获取学生当前的所有服务ID
            const existingServiceIds = studentToEdit.services.map(s => parseInt(s.id));
            // 获取表单中选择的服务类型ID
            const selectedServiceTypeIds = formData.services;
            
            // 检查每个现有服务对应的服务类型是否仍在选中列表中
            // 如果不在，则删除该服务（先清理关联关系）
            for (const service of studentToEdit.services) {
              // 查找该服务对应的服务类型
              const serviceType = serviceTypes.find(st => st.name === service.serviceType);
              if (serviceType && !selectedServiceTypeIds.includes(serviceType.id)) {
                // 服务类型不再被选中，需要删除该服务
                await peopleService.deleteStudentService(parseInt(service.id));
              }
            }
            
            // 添加新的服务类型（仅添加不存在的）
            for (const serviceTypeId of selectedServiceTypeIds) {
              // 检查该服务类型是否已存在
              const existingService = studentToEdit.services.find(s => {
                const st = serviceTypes.find(type => type.name === s.serviceType);
                return st && st.id === serviceTypeId;
              });
              
              // 如果该服务类型不存在，则添加
              if (!existingService) {
                console.log(`添加新服务, 学生ID=${createdStudent.id}, 服务类型ID=${serviceTypeId}`);
                try {
                  await peopleService.upsertStudentService({
                    student_id: createdStudent.id,
                    student_ref_id: createdStudent.id,
                    service_type_id: serviceTypeId,
                    status: 'not_started',
                    enrollment_date: getCurrentLocalDate()
                  });
                } catch (serviceError: any) {
                  console.error(`添加服务失败: ${serviceError.message}`, serviceError);
                  throw serviceError;
                }
              }
            }
          } catch (error: any) {
            console.error('处理学生服务失败:', error);
            setError(`处理服务时出错: ${error.message}`);
            throw error;
          }
        } else {
          // 新学生，直接添加所有选择的服务
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
            } catch (serviceError: any) {
              console.error(`添加服务失败: ${serviceError.message}`, serviceError);
              throw serviceError;
            }
          }
        }
        
        // 成功添加或编辑
        onStudentAdded();
        onClose();
      } catch (studentError: any) {
        console.error(`创建/更新学生失败: ${studentError.message}`, studentError);
        setError(`创建学生时出错: ${studentError.message || '未知错误'}`);
        throw studentError;
      }
    } catch (error: any) {
      console.error(isEditMode ? '编辑学生失败' : '添加学生失败', error);
      setError(isEditMode ? 
        `编辑学生失败: ${error.message || '请重试'}` : 
        `添加学生失败: ${error.message || '请重试'}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl mx-auto my-3">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
          {/* 模态框头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? `编辑学生: ${studentToEdit?.name}` : '添加新学生'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* 表单 */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左侧：基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h3>
                  
                  {/* 姓名 */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                        placeholder="学生姓名"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* 邮箱 */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      邮箱
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                        placeholder="电子邮箱"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  
                  {/* 电话 */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      电话
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="联系电话"
                      />
                    </div>
                  </div>
                  
                  {/* 性别和出生日期 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        性别
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">请选择</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        出生日期
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 学校和专业 */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      学校
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="当前就读学校"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      专业
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="专业"
                    />
                  </div>
                  
                  {/* 学历和毕业年份 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        学历
                      </label>
                      <select
                        name="education_level"
                        value={formData.education_level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">请选择</option>
                        <option value="高中">高中</option>
                        <option value="专科">专科</option>
                        <option value="本科">本科</option>
                        <option value="硕士">硕士</option>
                        <option value="博士">博士</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        毕业年份
                      </label>
                      <input
                        type="number"
                        name="graduation_year"
                        value={formData.graduation_year}
                        onChange={handleInputChange}
                        min="2000"
                        max="2050"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                </div>
                
                {/* 右侧：选择服务 */}
                <div className="space-y-4 flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">选择服务</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      至少选择一项服务
                    </span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-2 flex-grow">
                      {parentOptions.map((parent) => {
                        const children = childMap.get(parent.id) ?? [];
                        const isLeaf = children.length === 0;
                        if (isLeaf) {
                          const selected = formData.services.includes(parent.id);
                          return (
                            <div
                              key={parent.id}
                              onClick={() => handleServiceToggle(parent.id)}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                selected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  selected
                                    ? 'text-blue-700 dark:text-blue-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {parent.name}
                                </h4>
                                {parent.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {parent.description}
                                  </p>
                                )}
                              </div>
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                                selected
                                  ? 'bg-blue-500 text-white'
                                  : 'border border-gray-300 dark:border-gray-600'
                              }`}>
                                {selected && <Check className="w-4 h-4" />}
                              </div>
                            </div>
                          );
                        }

                        const expanded = expandedParents.has(parent.id);
                        const selectedCount = children.filter((child) => formData.services.includes(child.id)).length;

                        return (
                          <div key={parent.id} className="rounded-xl border border-gray-200 dark:border-gray-700">
                            <button
                              type="button"
                              onClick={() => toggleParentExpansion(parent.id)}
                              className="flex w-full items-center justify-between gap-3 rounded-t-xl bg-gray-50 px-3 py-3 text-left transition hover:bg-gray-100 dark:bg-gray-800/60 dark:hover:bg-gray-800"
                            >
                              <div className="flex items-center gap-2">
                                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{parent.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Layers className="h-3.5 w-3.5" />
                                {selectedCount > 0 ? `已选 ${selectedCount} 项` : '点击展开选择子分类'}
                              </div>
                            </button>
                            {expanded && (
                              <div className="space-y-2 px-3 py-3">
                                {children.map((child) => {
                                  const selected = formData.services.includes(child.id);
                                  return (
                                    <label
                                      key={child.id}
                                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                                        selected
                                          ? 'border-blue-400 bg-blue-50/70 text-blue-600 dark:border-blue-400/60 dark:bg-blue-900/10 dark:text-blue-200'
                                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-gray-700 dark:hover:border-blue-400/30 dark:hover:bg-blue-900/10'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                        checked={selected}
                                        onChange={() => handleServiceToggle(child.id)}
                                      />
                                      <div>
                                        <p className="font-medium">{child.name}</p>
                                        {child.description ? (
                                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{child.description}</p>
                                        ) : null}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {formErrors.services && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.services}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditMode ? '保存中...' : '添加中...'}
                  </span>
                ) : (
                  isEditMode ? '保存修改' : '添加学生'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentAddModal; 