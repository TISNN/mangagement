/**
 * 专业编辑表单组件
 * 功能: 提供编辑专业信息的表单界面
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Save, Plus, AlertCircle, CheckCircle, BookOpen, Search, Trash2, Calendar, Briefcase, GraduationCap, FileText, HelpCircle, Edit
} from 'lucide-react';
import { Program, CourseInfo, ExperientialLearningInfo, ApplicationTimelineEvent, ApplicationMaterial } from '../types/program.types';
import { updateProgram } from '../services/programService';
import { supabase } from '../../../../utils/supabaseClient';

interface School {
  id: string;
  en_name: string;
  cn_name: string | null;
  country: string;
}

interface ProgramEditFormProps {
  program: Program;
  onSuccess?: (updatedProgram: Program) => void;
  onCancel?: () => void;
}

export const ProgramEditForm: React.FC<ProgramEditFormProps> = ({
  program,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  
  // 内联编辑状态
  const [editingMaterialIndex, setEditingMaterialIndex] = useState<number | null>(null);
  const [editingTimelineIndex, setEditingTimelineIndex] = useState<number | null>(null);
  const [editingCourseIndex, setEditingCourseIndex] = useState<{ type: 'preparatory_courses' | 'core_courses' | 'elective_courses', index: number } | null>(null);
  const [editingExperientialIndex, setEditingExperientialIndex] = useState<number | null>(null);
  
  // 新项目表单数据
  const [newMaterial, setNewMaterial] = useState<Partial<ApplicationMaterial>>({
    name: '',
    name_en: '',
    is_required: false,
    description: '',
    format_requirements: ''
  });
  
  const [newTimelineEvent, setNewTimelineEvent] = useState<Partial<ApplicationTimelineEvent>>({
    event_name: '',
    event_date: new Date().toISOString().split('T')[0],
    description: '',
    is_scholarship_deadline: false
  });
  
  const [newCourse, setNewCourse] = useState<Partial<CourseInfo>>({
    name: '',
    name_cn: '',
    credits: undefined,
    description: ''
  });
  
  const [newExperientialLearning, setNewExperientialLearning] = useState<Partial<ExperientialLearningInfo>>({
    type: 'other',
    name: '',
    credits: undefined,
    description: ''
  });

  // 表单数据
  const [formData, setFormData] = useState({
    school_id: program.school_id || '',
    en_name: program.en_name || '',
    cn_name: program.cn_name || '',
    degree: program.degree || '',
    category: program.category || '',
    subCategory: program.subCategory || '',
    faculty: program.faculty || '',
    duration: program.duration || '',
    entry_month: '',
    tuition_fee: program.tuition_fee || '',
    language_requirements: program.language_requirements || '',
    apply_requirements: program.apply_requirements || '',
    curriculum: program.curriculum || '',
    objectives: program.objectives || '',
    analysis: program.analysis || '',
    interview: program.interview || '',
    url: program.url || '',
    tags: program.tags || [],
    career: '',
    // 新增基础字段
    credit_requirements: program.credit_requirements || '',
    teaching_mode: program.teaching_mode || '',
    study_mode: program.study_mode || '',
    program_positioning: program.program_positioning || '',
    // JSONB字段
    course_structure: program.course_structure || {
      preparatory_courses: [],
      core_courses: [],
      elective_courses: [],
      experiential_learning: []
    },
    application_timeline: program.application_timeline || [],
    application_materials: program.application_materials || [],
    career_info: program.career_info || {
      industries: [],
      job_titles: [],
      employment_rate: undefined,
      avg_salary: ''
    },
    program_features: program.program_features || [],
    interview_guide: program.interview_guide || {
      common_questions: [],
      preparation_tips: ''
    },
    application_guide: program.application_guide || {
      resume_tips: '',
      ps_tips: ''
    }
  });

  // 加载学校列表
  useEffect(() => {
    const loadSchools = async () => {
      setLoadingSchools(true);
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, en_name, cn_name, country')
          .order('en_name', { ascending: true });

        if (error) throw error;

        setSchools(data || []);
      } catch (err) {
        console.error('加载学校列表失败:', err);
      } finally {
        setLoadingSchools(false);
      }
    };

    loadSchools();
  }, []);

  // 筛选学校列表
  const filteredSchools = schools.filter(school => {
    const query = schoolSearchQuery.toLowerCase();
    return (
      school.en_name.toLowerCase().includes(query) ||
      (school.cn_name && school.cn_name.toLowerCase().includes(query)) ||
      school.country.toLowerCase().includes(query)
    );
  });

  // 获取选中的学校
  const selectedSchool = schools.find(s => s.id === formData.school_id);

  // 更新表单字段
  const handleChange = (field: string, value: string | string[] | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  // 添加项目特色
  const handleAddFeature = (feature: string) => {
    if (feature.trim() && !formData.program_features.includes(feature.trim())) {
      handleChange('program_features', [...formData.program_features, feature.trim()]);
    }
  };

  // 删除项目特色
  const handleRemoveFeature = (index: number) => {
    handleChange('program_features', formData.program_features.filter((_, i) => i !== index));
  };

  // 添加课程
  const handleAddCourse = (type: 'preparatory_courses' | 'core_courses' | 'elective_courses') => {
    if (!newCourse.name?.trim()) return;
    
    const course: CourseInfo = {
      name: newCourse.name.trim(),
      name_cn: newCourse.name_cn?.trim() || undefined,
      credits: newCourse.credits || undefined,
      description: newCourse.description?.trim() || undefined
    };
    
    if (editingCourseIndex && editingCourseIndex.type === type) {
      // 编辑模式
      const updated = [...(formData.course_structure[type] || [])];
      updated[editingCourseIndex.index] = course;
      handleChange('course_structure', {
        ...formData.course_structure,
        [type]: updated
      });
      setEditingCourseIndex(null);
    } else {
      // 添加模式
      const newCourses = [...(formData.course_structure[type] || []), course];
      handleChange('course_structure', {
        ...formData.course_structure,
        [type]: newCourses
      });
    }
    
    // 重置表单
    setNewCourse({
      name: '',
      name_cn: '',
      credits: undefined,
      description: ''
    });
  };

  // 编辑课程
  const handleEditCourse = (type: 'preparatory_courses' | 'core_courses' | 'elective_courses', index: number) => {
    const course = formData.course_structure[type]?.[index];
    if (course) {
      setNewCourse({
        name: course.name,
        name_cn: course.name_cn || '',
        credits: course.credits,
        description: course.description || ''
      });
      setEditingCourseIndex({ type, index });
    }
  };

  // 取消编辑课程
  const handleCancelEditCourse = () => {
    setEditingCourseIndex(null);
    setNewCourse({
      name: '',
      name_cn: '',
      credits: undefined,
      description: ''
    });
  };

  // 删除课程
  const handleRemoveCourse = (type: 'preparatory_courses' | 'core_courses' | 'elective_courses', index: number) => {
    const newCourses = formData.course_structure[type]?.filter((_, i) => i !== index) || [];
    handleChange('course_structure', {
      ...formData.course_structure,
      [type]: newCourses
    });
    if (editingCourseIndex && editingCourseIndex.type === type && editingCourseIndex.index === index) {
      handleCancelEditCourse();
    }
  };

  // 添加体验式学习
  const handleAddExperientialLearning = () => {
    if (!newExperientialLearning.name?.trim()) return;
    
    const learning: ExperientialLearningInfo = {
      type: newExperientialLearning.type || 'other',
      name: newExperientialLearning.name.trim(),
      credits: newExperientialLearning.credits || undefined,
      description: newExperientialLearning.description?.trim() || undefined
    };
    
    if (editingExperientialIndex !== null) {
      // 编辑模式
      const updated = [...(formData.course_structure.experiential_learning || [])];
      updated[editingExperientialIndex] = learning;
      handleChange('course_structure', {
        ...formData.course_structure,
        experiential_learning: updated
      });
      setEditingExperientialIndex(null);
    } else {
      // 添加模式
      const newLearning = [...(formData.course_structure.experiential_learning || []), learning];
      handleChange('course_structure', {
        ...formData.course_structure,
        experiential_learning: newLearning
      });
    }
    
    // 重置表单
    setNewExperientialLearning({
      type: 'other',
      name: '',
      credits: undefined,
      description: ''
    });
  };

  // 编辑体验式学习
  const handleEditExperientialLearning = (index: number) => {
    const learning = formData.course_structure.experiential_learning?.[index];
    if (learning) {
      setNewExperientialLearning({
        type: learning.type,
        name: learning.name,
        credits: learning.credits,
        description: learning.description || ''
      });
      setEditingExperientialIndex(index);
    }
  };

  // 取消编辑体验式学习
  const handleCancelEditExperientialLearning = () => {
    setEditingExperientialIndex(null);
    setNewExperientialLearning({
      type: 'other',
      name: '',
      credits: undefined,
      description: ''
    });
  };

  // 删除体验式学习
  const handleRemoveExperientialLearning = (index: number) => {
    const newLearning = formData.course_structure.experiential_learning?.filter((_, i) => i !== index) || [];
    handleChange('course_structure', {
      ...formData.course_structure,
      experiential_learning: newLearning
    });
    if (editingExperientialIndex === index) {
      handleCancelEditExperientialLearning();
    }
  };

  // 添加申请时间线事件
  const handleAddTimelineEvent = () => {
    if (!newTimelineEvent.event_name?.trim() || !newTimelineEvent.event_date) return;
    
    const event: ApplicationTimelineEvent = {
      event_name: newTimelineEvent.event_name.trim(),
      event_date: newTimelineEvent.event_date,
      description: newTimelineEvent.description?.trim() || undefined,
      is_scholarship_deadline: newTimelineEvent.is_scholarship_deadline || false
    };
    
    if (editingTimelineIndex !== null) {
      // 编辑模式
      const updated = [...formData.application_timeline];
      updated[editingTimelineIndex] = event;
      handleChange('application_timeline', updated);
      setEditingTimelineIndex(null);
    } else {
      // 添加模式
      handleChange('application_timeline', [...formData.application_timeline, event]);
    }
    
    // 重置表单
    setNewTimelineEvent({
      event_name: '',
      event_date: new Date().toISOString().split('T')[0],
      description: '',
      is_scholarship_deadline: false
    });
  };

  // 编辑申请时间线事件
  const handleEditTimelineEvent = (index: number) => {
    const event = formData.application_timeline[index];
    setNewTimelineEvent({
      event_name: event.event_name,
      event_date: event.event_date,
      description: event.description || '',
      is_scholarship_deadline: event.is_scholarship_deadline || false
    });
    setEditingTimelineIndex(index);
  };

  // 取消编辑申请时间线事件
  const handleCancelEditTimelineEvent = () => {
    setEditingTimelineIndex(null);
    setNewTimelineEvent({
      event_name: '',
      event_date: new Date().toISOString().split('T')[0],
      description: '',
      is_scholarship_deadline: false
    });
  };

  // 删除申请时间线事件
  const handleRemoveTimelineEvent = (index: number) => {
    handleChange('application_timeline', formData.application_timeline.filter((_, i) => i !== index));
    if (editingTimelineIndex === index) {
      handleCancelEditTimelineEvent();
    }
  };

  // 添加申请材料
  const handleAddMaterial = () => {
    if (!newMaterial.name?.trim()) return;
    
    const material: ApplicationMaterial = {
      name: newMaterial.name.trim(),
      name_en: newMaterial.name_en?.trim() || undefined,
      is_required: newMaterial.is_required || false,
      description: newMaterial.description?.trim() || undefined,
      format_requirements: newMaterial.format_requirements?.trim() || undefined
    };
    
    if (editingMaterialIndex !== null) {
      // 编辑模式
      const updated = [...formData.application_materials];
      updated[editingMaterialIndex] = material;
      handleChange('application_materials', updated);
      setEditingMaterialIndex(null);
    } else {
      // 添加模式
      handleChange('application_materials', [...formData.application_materials, material]);
    }
    
    // 重置表单
    setNewMaterial({
      name: '',
      name_en: '',
      is_required: false,
      description: '',
      format_requirements: ''
    });
  };

  // 编辑申请材料
  const handleEditMaterial = (index: number) => {
    const material = formData.application_materials[index];
    setNewMaterial({
      name: material.name,
      name_en: material.name_en || '',
      is_required: material.is_required,
      description: material.description || '',
      format_requirements: material.format_requirements || ''
    });
    setEditingMaterialIndex(index);
  };

  // 取消编辑申请材料
  const handleCancelEditMaterial = () => {
    setEditingMaterialIndex(null);
    setNewMaterial({
      name: '',
      name_en: '',
      is_required: false,
      description: '',
      format_requirements: ''
    });
  };

  // 删除申请材料
  const handleRemoveMaterial = (index: number) => {
    handleChange('application_materials', formData.application_materials.filter((_, i) => i !== index));
    if (editingMaterialIndex === index) {
      handleCancelEditMaterial();
    }
  };

  // 添加就业行业
  const handleAddIndustry = (industry: string) => {
    if (industry.trim() && !formData.career_info.industries?.includes(industry.trim())) {
      handleChange('career_info', {
        ...formData.career_info,
        industries: [...(formData.career_info.industries || []), industry.trim()]
      });
    }
  };

  // 删除就业行业
  const handleRemoveIndustry = (index: number) => {
    handleChange('career_info', {
      ...formData.career_info,
      industries: formData.career_info.industries?.filter((_, i) => i !== index) || []
    });
  };

  // 添加岗位
  const handleAddJobTitle = (jobTitle: string) => {
    if (jobTitle.trim() && !formData.career_info.job_titles?.includes(jobTitle.trim())) {
      handleChange('career_info', {
        ...formData.career_info,
        job_titles: [...(formData.career_info.job_titles || []), jobTitle.trim()]
      });
    }
  };

  // 删除岗位
  const handleRemoveJobTitle = (index: number) => {
    handleChange('career_info', {
      ...formData.career_info,
      job_titles: formData.career_info.job_titles?.filter((_, i) => i !== index) || []
    });
  };

  // 添加面试常见问题
  const handleAddQuestion = (question: string) => {
    if (question.trim() && !formData.interview_guide.common_questions?.includes(question.trim())) {
      handleChange('interview_guide', {
        ...formData.interview_guide,
        common_questions: [...(formData.interview_guide.common_questions || []), question.trim()]
      });
    }
  };

  // 删除面试常见问题
  const handleRemoveQuestion = (index: number) => {
    handleChange('interview_guide', {
      ...formData.interview_guide,
      common_questions: formData.interview_guide.common_questions?.filter((_, i) => i !== index) || []
    });
  };

  // 选择学校
  const handleSelectSchool = (school: School) => {
    setFormData(prev => ({
      ...prev,
      school_id: school.id
    }));
    setSchoolSearchQuery('');
    setShowSchoolDropdown(false);
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.school_id) {
      setError('请选择所属学校');
      return false;
    }
    if (!formData.en_name.trim()) {
      setError('请输入专业英文名称');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // 准备更新数据
      const updateData: Partial<Program> = {
        school_id: formData.school_id,
        en_name: formData.en_name.trim(),
        cn_name: formData.cn_name.trim() || undefined,
        degree: formData.degree.trim() || undefined,
        category: formData.category.trim() || undefined,
        subCategory: formData.subCategory.trim() || undefined,
        faculty: formData.faculty.trim() || undefined,
        duration: formData.duration.trim() || undefined,
        tuition_fee: formData.tuition_fee.trim() || undefined,
        language_requirements: formData.language_requirements.trim() || undefined,
        apply_requirements: formData.apply_requirements.trim() || undefined,
        curriculum: formData.curriculum.trim() || undefined,
        objectives: formData.objectives.trim() || undefined,
        analysis: formData.analysis.trim() || undefined,
        interview: formData.interview.trim() || undefined,
        url: formData.url.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        // 新增基础字段
        credit_requirements: formData.credit_requirements.trim() || undefined,
        teaching_mode: formData.teaching_mode.trim() || undefined,
        study_mode: formData.study_mode.trim() || undefined,
        program_positioning: formData.program_positioning.trim() || undefined,
        // JSONB字段
        course_structure: (formData.course_structure.preparatory_courses?.length || 
                          formData.course_structure.core_courses?.length || 
                          formData.course_structure.elective_courses?.length || 
                          formData.course_structure.experiential_learning?.length) 
                          ? formData.course_structure : undefined,
        application_timeline: formData.application_timeline.length > 0 ? formData.application_timeline : undefined,
        application_materials: formData.application_materials.length > 0 ? formData.application_materials : undefined,
        career_info: (formData.career_info.industries?.length || 
                     formData.career_info.job_titles?.length || 
                     formData.career_info.employment_rate !== undefined || 
                     formData.career_info.avg_salary) 
                     ? formData.career_info : undefined,
        program_features: formData.program_features.length > 0 ? formData.program_features : undefined,
        interview_guide: (formData.interview_guide.common_questions?.length || 
                          formData.interview_guide.preparation_tips) 
                          ? formData.interview_guide : undefined,
        application_guide: (formData.application_guide.resume_tips || 
                           formData.application_guide.ps_tips) 
                           ? formData.application_guide : undefined
      };

      // 更新专业
      const updatedProgram = await updateProgram(program.id, updateData);

      if (!updatedProgram) {
        throw new Error('更新失败，未返回数据');
      }

      console.log('专业更新成功:', updatedProgram);
      setSuccess(true);

      // 调用成功回调
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(updatedProgram);
        }, 1000);
      }

    } catch (err) {
      console.error('更新专业失败:', err);
      setError(err instanceof Error ? err.message : '更新专业失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">编辑专业</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {program.cn_name || program.en_name}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* 成功提示 */}
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">更新成功!</p>
                  <p className="text-sm text-green-600 dark:text-green-300">正在关闭...</p>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">更新失败</p>
                  <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 选择学校 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                选择学校
              </h3>
              
              {loadingSchools ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">加载学校列表...</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    所属学校 <span className="text-red-500">*</span>
                  </label>
                  
                  {selectedSchool ? (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedSchool.cn_name || selectedSchool.en_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedSchool.en_name} · {selectedSchool.country}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChange('school_id', '')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={schoolSearchQuery}
                          onChange={(e) => {
                            setSchoolSearchQuery(e.target.value);
                            setShowSchoolDropdown(true);
                          }}
                          onFocus={() => setShowSchoolDropdown(true)}
                          placeholder="搜索学校名称或国家..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {showSchoolDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSchools.length > 0 ? (
                            filteredSchools.map((school) => (
                              <button
                                key={school.id}
                                type="button"
                                onClick={() => handleSelectSchool(school)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                              >
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {school.cn_name || school.en_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {school.en_name} · {school.country}
                                </p>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                              未找到匹配的学校
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                基本信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    英文名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.en_name}
                    onChange={(e) => handleChange('en_name', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    中文名称
                  </label>
                  <input
                    type="text"
                    value={formData.cn_name}
                    onChange={(e) => handleChange('cn_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学位类型
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择学位类型</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                    <option value="MBA">MBA</option>
                    <option value="预科">预科</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    专业类别
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择专业类别</option>
                    <option value="商科">商科</option>
                    <option value="工科">工科</option>
                    <option value="理科">理科</option>
                    <option value="社科">社科</option>
                    <option value="文科">文科</option>
                    <option value="艺术">艺术</option>
                    <option value="医学">医学</option>
                    <option value="法律">法律</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    所属学院
                  </label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => handleChange('faculty', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学制
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择学制</option>
                    <option value="1年">1年</option>
                    <option value="1.5年">1.5年</option>
                    <option value="2年">2年</option>
                    <option value="3年">3年</option>
                    <option value="4年">4年</option>
                    <option value="5年">5年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学费
                  </label>
                  <input
                    type="text"
                    value={formData.tuition_fee}
                    onChange={(e) => handleChange('tuition_fee', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学分要求
                  </label>
                  <input
                    type="text"
                    value={formData.credit_requirements}
                    onChange={(e) => handleChange('credit_requirements', e.target.value)}
                    placeholder="如：普通路径40学分，含实习44学分"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    授课方式
                  </label>
                  <input
                    type="text"
                    value={formData.teaching_mode}
                    onChange={(e) => handleChange('teaching_mode', e.target.value)}
                    placeholder="如：密集型授课、在线/线下"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学习模式
                  </label>
                  <input
                    type="text"
                    value={formData.study_mode}
                    onChange={(e) => handleChange('study_mode', e.target.value)}
                    placeholder="如：全日制12个月，兼职21个月"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 项目定位 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                项目定位
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  核心定位
                </label>
                <textarea
                  value={formData.program_positioning}
                  onChange={(e) => handleChange('program_positioning', e.target.value)}
                  placeholder="描述项目的核心定位和特色..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* 申请要求 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                申请要求
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    语言要求
                  </label>
                  <textarea
                    value={formData.language_requirements}
                    onChange={(e) => handleChange('language_requirements', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    申请要求
                  </label>
                  <textarea
                    value={formData.apply_requirements}
                    onChange={(e) => handleChange('apply_requirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    面试要求
                  </label>
                  <textarea
                    value={formData.interview}
                    onChange={(e) => handleChange('interview', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 项目详情 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                项目详情
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    课程设置
                  </label>
                  <textarea
                    value={formData.curriculum}
                    onChange={(e) => handleChange('curriculum', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    培养目标
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => handleChange('objectives', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    项目分析
                  </label>
                  <textarea
                    value={formData.analysis}
                    onChange={(e) => handleChange('analysis', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                其他信息
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    项目链接
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    标签
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="输入标签,回车添加"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      添加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 项目特色 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                项目特色
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="featureInput"
                    placeholder="输入项目特色，回车添加"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget as HTMLInputElement;
                        handleAddFeature(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('featureInput') as HTMLInputElement;
                      if (input) {
                        handleAddFeature(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.program_features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 课程结构 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                课程结构
              </h3>
              <div className="space-y-6">
                {/* 入学前预备课 */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">入学前预备课</h4>
                  <div className="space-y-4">
                    {formData.course_structure.preparatory_courses?.map((course, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                              <div className="font-medium dark:text-white">{course.name}</div>
                            </div>
                            {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                            {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditCourse('preparatory_courses', index)}
                              className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="编辑"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse('preparatory_courses', index)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 添加/编辑表单 */}
                    {(editingCourseIndex === null || editingCourseIndex.type === 'preparatory_courses') && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 border-dashed">
                        <div className="flex items-center gap-2 mb-4">
                          <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            {editingCourseIndex && editingCourseIndex.type === 'preparatory_courses' 
                              ? `编辑预备课程 #${editingCourseIndex.index + 1}` 
                              : '添加新预备课程'}
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（英文） <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newCourse.name || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                placeholder="如：Introduction to Statistics"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（中文）
                              </label>
                              <input
                                type="text"
                                value={newCourse.name_cn || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name_cn: e.target.value })}
                                placeholder="如：统计学导论"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              课程描述
                            </label>
                            <textarea
                              value={newCourse.description || ''}
                              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                              placeholder="描述该课程的内容和要求..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleAddCourse('preparatory_courses')}
                              disabled={!newCourse.name?.trim()}
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {editingCourseIndex && editingCourseIndex.type === 'preparatory_courses' ? '保存修改' : '添加课程'}
                            </button>
                            {editingCourseIndex && editingCourseIndex.type === 'preparatory_courses' && (
                              <button
                                type="button"
                                onClick={handleCancelEditCourse}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                取消
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 核心课程 */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">核心课程</h4>
                  <div className="space-y-4">
                    {formData.course_structure.core_courses?.map((course, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                              <div className="font-medium dark:text-white">{course.name}</div>
                            </div>
                            {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                            {course.credits && <div className="text-sm text-gray-500 dark:text-gray-500">{course.credits}学分</div>}
                            {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditCourse('core_courses', index)}
                              className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="编辑"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse('core_courses', index)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 添加/编辑表单 */}
                    {(editingCourseIndex === null || editingCourseIndex.type === 'core_courses') && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 border-dashed">
                        <div className="flex items-center gap-2 mb-4">
                          <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            {editingCourseIndex && editingCourseIndex.type === 'core_courses' 
                              ? `编辑核心课程 #${editingCourseIndex.index + 1}` 
                              : '添加新核心课程'}
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（英文） <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newCourse.name || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                placeholder="如：Advanced Machine Learning"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（中文）
                              </label>
                              <input
                                type="text"
                                value={newCourse.name_cn || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name_cn: e.target.value })}
                                placeholder="如：高级机器学习"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              学分
                            </label>
                            <input
                              type="number"
                              value={newCourse.credits || ''}
                              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                              placeholder="如：3"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              课程描述
                            </label>
                            <textarea
                              value={newCourse.description || ''}
                              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                              placeholder="描述该课程的内容和要求..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleAddCourse('core_courses')}
                              disabled={!newCourse.name?.trim()}
                              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {editingCourseIndex && editingCourseIndex.type === 'core_courses' ? '保存修改' : '添加课程'}
                            </button>
                            {editingCourseIndex && editingCourseIndex.type === 'core_courses' && (
                              <button
                                type="button"
                                onClick={handleCancelEditCourse}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                取消
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 选修课程 */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">选修课程</h4>
                  <div className="space-y-4">
                    {formData.course_structure.elective_courses?.map((course, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                              <div className="font-medium dark:text-white">{course.name}</div>
                            </div>
                            {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                            {course.credits && <div className="text-sm text-gray-500 dark:text-gray-500">{course.credits}学分</div>}
                            {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditCourse('elective_courses', index)}
                              className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="编辑"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse('elective_courses', index)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 添加/编辑表单 */}
                    {(editingCourseIndex === null || editingCourseIndex.type === 'elective_courses') && (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 border-dashed">
                        <div className="flex items-center gap-2 mb-4">
                          <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                            {editingCourseIndex && editingCourseIndex.type === 'elective_courses' 
                              ? `编辑选修课程 #${editingCourseIndex.index + 1}` 
                              : '添加新选修课程'}
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（英文） <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newCourse.name || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                placeholder="如：Data Visualization"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                课程名称（中文）
                              </label>
                              <input
                                type="text"
                                value={newCourse.name_cn || ''}
                                onChange={(e) => setNewCourse({ ...newCourse, name_cn: e.target.value })}
                                placeholder="如：数据可视化"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              学分
                            </label>
                            <input
                              type="number"
                              value={newCourse.credits || ''}
                              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                              placeholder="如：3"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              课程描述
                            </label>
                            <textarea
                              value={newCourse.description || ''}
                              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                              placeholder="描述该课程的内容和要求..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleAddCourse('elective_courses')}
                              disabled={!newCourse.name?.trim()}
                              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {editingCourseIndex && editingCourseIndex.type === 'elective_courses' ? '保存修改' : '添加课程'}
                            </button>
                            {editingCourseIndex && editingCourseIndex.type === 'elective_courses' && (
                              <button
                                type="button"
                                onClick={handleCancelEditCourse}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                取消
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 体验式学习 */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">体验式学习</h4>
                  <div className="space-y-4">
                    {formData.course_structure.experiential_learning?.map((learning, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                              <div className="font-medium dark:text-white">{learning.name}</div>
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                                {learning.type === 'capstone' ? '毕业设计' : 
                                 learning.type === 'internship' ? '实习' : 
                                 learning.type === 'research' ? '研究' : '其他'}
                              </span>
                            </div>
                            {learning.credits && <div className="text-sm text-gray-500 dark:text-gray-500">{learning.credits}学分</div>}
                            {learning.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{learning.description}</div>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditExperientialLearning(index)}
                              className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="编辑"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperientialLearning(index)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="删除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 添加/编辑表单 */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 border-dashed">
                      <div className="flex items-center gap-2 mb-4">
                        <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                          {editingExperientialIndex !== null ? `编辑体验式学习 #${editingExperientialIndex + 1}` : '添加新体验式学习'}
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            类型 <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={newExperientialLearning.type || 'other'}
                            onChange={(e) => setNewExperientialLearning({ ...newExperientialLearning, type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="capstone">毕业设计</option>
                            <option value="internship">实习</option>
                            <option value="research">研究</option>
                            <option value="other">其他</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            名称 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newExperientialLearning.name || ''}
                            onChange={(e) => setNewExperientialLearning({ ...newExperientialLearning, name: e.target.value })}
                            placeholder="如：暑期实习项目"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            学分
                          </label>
                          <input
                            type="number"
                            value={newExperientialLearning.credits || ''}
                            onChange={(e) => setNewExperientialLearning({ ...newExperientialLearning, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="如：3"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            描述
                          </label>
                          <textarea
                            value={newExperientialLearning.description || ''}
                            onChange={(e) => setNewExperientialLearning({ ...newExperientialLearning, description: e.target.value })}
                            placeholder="描述该体验式学习的内容和要求..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleAddExperientialLearning}
                            disabled={!newExperientialLearning.name?.trim()}
                            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {editingExperientialIndex !== null ? '保存修改' : '添加体验式学习'}
                          </button>
                          {editingExperientialIndex !== null && (
                            <button
                              type="button"
                              onClick={handleCancelEditExperientialLearning}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              取消
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请时间线 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                申请时间线
              </h3>
              <div className="space-y-4">
                {/* 已添加的时间线事件列表 */}
                {formData.application_timeline.map((event, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                          <div className="font-medium dark:text-white">{event.event_name}</div>
                          {event.is_scholarship_deadline && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded">
                              奖学金截止
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{event.event_date}</div>
                        {event.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</div>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditTimelineEvent(index)}
                          className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTimelineEvent(index)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 添加/编辑表单 */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 border-dashed">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                      {editingTimelineIndex !== null ? `编辑事件 #${editingTimelineIndex + 1}` : '添加新时间线事件'}
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          事件名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newTimelineEvent.event_name || ''}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, event_name: e.target.value })}
                          placeholder="如：申请截止日期"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          事件日期 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={newTimelineEvent.event_date || ''}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, event_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        事件描述
                      </label>
                      <textarea
                        value={newTimelineEvent.description || ''}
                        onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, description: e.target.value })}
                        placeholder="描述该事件的详细信息..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newTimelineEvent.is_scholarship_deadline || false}
                          onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, is_scholarship_deadline: e.target.checked })}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">奖学金截止日期</span>
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleAddTimelineEvent}
                        disabled={!newTimelineEvent.event_name?.trim() || !newTimelineEvent.event_date}
                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {editingTimelineIndex !== null ? '保存修改' : '添加事件'}
                      </button>
                      {editingTimelineIndex !== null && (
                        <button
                          type="button"
                          onClick={handleCancelEditTimelineEvent}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请材料清单 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                申请材料清单
              </h3>
              <div className="space-y-4">
                {/* 已添加的材料列表 */}
                {formData.application_materials.map((material, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                          <div className="font-medium dark:text-white">{material.name}</div>
                          {material.is_required && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                              必填
                            </span>
                          )}
                        </div>
                        {material.name_en && <div className="text-sm text-gray-600 dark:text-gray-400">{material.name_en}</div>}
                        {material.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{material.description}</div>}
                        {material.format_requirements && (
                          <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">格式要求: {material.format_requirements}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditMaterial(index)}
                          className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 添加/编辑表单 */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 border-dashed">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      {editingMaterialIndex !== null ? `编辑材料 #${editingMaterialIndex + 1}` : '添加新申请材料'}
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          材料名称（中文） <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newMaterial.name || ''}
                          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                          placeholder="如：个人简历"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          材料名称（英文）
                        </label>
                        <input
                          type="text"
                          value={newMaterial.name_en || ''}
                          onChange={(e) => setNewMaterial({ ...newMaterial, name_en: e.target.value })}
                          placeholder="如：Resume"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newMaterial.is_required || false}
                          onChange={(e) => setNewMaterial({ ...newMaterial, is_required: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">必填材料</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        材料描述
                      </label>
                      <textarea
                        value={newMaterial.description || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                        placeholder="描述该材料的要求或用途..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        格式要求
                      </label>
                      <input
                        type="text"
                        value={newMaterial.format_requirements || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, format_requirements: e.target.value })}
                        placeholder="如：PDF格式，不超过2MB"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleAddMaterial}
                        disabled={!newMaterial.name?.trim()}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {editingMaterialIndex !== null ? '保存修改' : '添加材料'}
                      </button>
                      {editingMaterialIndex !== null && (
                        <button
                          type="button"
                          onClick={handleCancelEditMaterial}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 就业信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-500" />
                就业信息
              </h3>
              <div className="space-y-4">
                {/* 就业行业 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    就业行业
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      id="industryInput"
                      placeholder="输入行业，回车添加"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          handleAddIndustry(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('industryInput') as HTMLInputElement;
                        if (input) {
                          handleAddIndustry(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.career_info.industries?.map((industry, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                      >
                        {industry}
                        <button
                          type="button"
                          onClick={() => handleRemoveIndustry(index)}
                          className="hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 典型岗位 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    典型岗位
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      id="jobTitleInput"
                      placeholder="输入岗位名称，回车添加"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          handleAddJobTitle(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('jobTitleInput') as HTMLInputElement;
                        if (input) {
                          handleAddJobTitle(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.career_info.job_titles?.map((jobTitle, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                      >
                        {jobTitle}
                        <button
                          type="button"
                          onClick={() => handleRemoveJobTitle(index)}
                          className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 就业率和平均薪资 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      就业率 (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.career_info.employment_rate || ''}
                      onChange={(e) => handleChange('career_info', {
                        ...formData.career_info,
                        employment_rate: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      平均薪资
                    </label>
                    <input
                      type="text"
                      value={formData.career_info.avg_salary || ''}
                      onChange={(e) => handleChange('career_info', {
                        ...formData.career_info,
                        avg_salary: e.target.value
                      })}
                      placeholder="如：50000-80000元/年"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 面试指导 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-rose-500" />
                面试指导
              </h3>
              <div className="space-y-4">
                {/* 常见问题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    常见问题
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      id="questionInput"
                      placeholder="输入常见问题，回车添加"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          handleAddQuestion(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('questionInput') as HTMLInputElement;
                        if (input) {
                          handleAddQuestion(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.interview_guide.common_questions?.map((question, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-start justify-between">
                        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">{question}</div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 准备建议 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    准备建议
                  </label>
                  <textarea
                    value={formData.interview_guide.preparation_tips || ''}
                    onChange={(e) => handleChange('interview_guide', {
                      ...formData.interview_guide,
                      preparation_tips: e.target.value
                    })}
                    rows={3}
                    placeholder="输入面试准备建议..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 申请指导 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-500" />
                申请指导
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    简历撰写要点
                  </label>
                  <textarea
                    value={formData.application_guide.resume_tips || ''}
                    onChange={(e) => handleChange('application_guide', {
                      ...formData.application_guide,
                      resume_tips: e.target.value
                    })}
                    rows={4}
                    placeholder="输入简历撰写要点..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PS/SOP写作要点
                  </label>
                  <textarea
                    value={formData.application_guide.ps_tips || ''}
                    onChange={(e) => handleChange('application_guide', {
                      ...formData.application_guide,
                      ps_tips: e.target.value
                    })}
                    rows={4}
                    placeholder="输入PS/SOP写作要点..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
              <button
                type="submit"
                disabled={loading || success || loadingSchools}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    保存更改
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading || success}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

