/**
 * 可编辑的学生档案组件
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  Users, Globe, CreditCard, Briefcase, Save, X, Edit,
  Plus, Trash2
} from 'lucide-react';
import { StudentProfile, WorkExperience } from '../types';
import { StandardizedTestsSection } from './StandardizedTestsSection';

interface EditableProfileSectionProps {
  profile: StudentProfile | null;
  studentId: number;
  onSave: (profile: Partial<StudentProfile>) => Promise<void>;
  onCancel?: () => void;
}

export default function EditableProfileSection({ 
  profile, 
  studentId,
  onSave,
  onCancel 
}: EditableProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败,请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    onCancel?.();
  };

  // 更新字段值
  const updateField = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 更新数组字段
  const updateArrayField = (field: keyof StudentProfile, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  // 添加工作经历
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: []
    };
    setFormData(prev => ({
      ...prev,
      work_experiences: [...(prev.work_experiences || []), newExp]
    }));
  };

  // 删除工作经历
  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      work_experiences: prev.work_experiences?.filter((_, i) => i !== index) || []
    }));
  };

  // 更新工作经历
  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData(prev => {
      const experiences = [...(prev.work_experiences || [])];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, work_experiences: experiences };
    });
  };

  // 渲染输入框
  const renderInput = (
    label: string,
    field: keyof StudentProfile,
    type: 'text' | 'date' | 'number' | 'email' = 'text',
    icon?: React.ReactNode
  ) => (
    <div>
      <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
        {icon}
        {label}:
      </label>
      <div className="mt-1">
        {isEditing ? (
          <input
            type={type}
            value={(formData[field] as string | number) || ''}
            onChange={(e) => updateField(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ) : (
          <span className="text-sm font-medium dark:text-white">
            {formData[field] || ''}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold dark:text-white">学生档案</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              编辑
            </button>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">基本信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderInput('姓名', 'full_name', 'text', <User className="h-3 w-3" />)}
          {renderInput('性别', 'gender', 'text', <Users className="h-3 w-3" />)}
          {renderInput('出生日期', 'date_of_birth', 'date', <Calendar className="h-3 w-3" />)}
          {renderInput('国籍', 'nationality', 'text', <Globe className="h-3 w-3" />)}
          {renderInput('电话', 'phone_number', 'text', <Phone className="h-3 w-3" />)}
          {renderInput('申请邮箱', 'application_email', 'email', <Mail className="h-3 w-3" />)}
          {renderInput('护照号码', 'passport_number', 'text', <CreditCard className="h-3 w-3" />)}
          {renderInput('现居地址', 'current_address', 'text', <MapPin className="h-3 w-3" />)}
        </div>
      </div>

      {/* 本科教育背景 */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
        <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          本科教育背景
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderInput('学历', 'undergraduate_degree', 'text')}
          {renderInput('学校', 'undergraduate_school', 'text')}
          {renderInput('专业', 'undergraduate_major', 'text')}
          {renderInput('GPA', 'undergraduate_gpa', 'number')}
          {renderInput('均分', 'undergraduate_score', 'number')}
          {renderInput('开始时间', 'undergraduate_start_date', 'date')}
          {renderInput('结束时间', 'undergraduate_end_date', 'date')}
          
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">核心课程 (用逗号分隔):</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.undergraduate_core_courses?.join(', ') || ''}
                  onChange={(e) => updateArrayField('undergraduate_core_courses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="例如: 高等数学, 线性代数, 概率论"
                />
              ) : (
                <span className="text-sm font-medium dark:text-white">
                  {formData.undergraduate_core_courses?.join(', ') || ''}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">奖学金 (用逗号分隔):</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.undergraduate_scholarships?.join(', ') || ''}
                  onChange={(e) => updateArrayField('undergraduate_scholarships', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="例如: 国家奖学金, 校一等奖学金"
                />
              ) : (
                <span className="text-sm font-medium dark:text-white">
                  {formData.undergraduate_scholarships?.join(', ') || ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 硕士教育背景 */}
      <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
        <h3 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          硕士教育背景
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {renderInput('学历', 'graduate_degree', 'text')}
          {renderInput('学校', 'graduate_school', 'text')}
          {renderInput('专业', 'graduate_major', 'text')}
          {renderInput('GPA', 'graduate_gpa', 'number')}
          {renderInput('均分', 'graduate_score', 'number')}
          {renderInput('开始时间', 'graduate_start_date', 'date')}
          {renderInput('结束时间', 'graduate_end_date', 'date')}
          
          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">核心课程 (用逗号分隔):</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.graduate_core_courses?.join(', ') || ''}
                  onChange={(e) => updateArrayField('graduate_core_courses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="例如: 高级算法, 机器学习, 深度学习"
                />
              ) : (
                <span className="text-sm font-medium dark:text-white">
                  {formData.graduate_core_courses?.join(', ') || ''}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-gray-600 dark:text-gray-400">奖学金 (用逗号分隔):</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.graduate_scholarships?.join(', ') || ''}
                  onChange={(e) => updateArrayField('graduate_scholarships', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="例如: 优秀研究生奖学金"
                />
              ) : (
                <span className="text-sm font-medium dark:text-white">
                  {formData.graduate_scholarships?.join(', ') || ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 标化成绩 */}
      <StandardizedTestsSection 
        tests={formData.standardized_tests} 
        onUpdate={isEditing ? (tests) => updateField('standardized_tests', tests) : undefined}
        readOnly={!isEditing}
      />

      {/* 实习/工作经历 */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            实习/工作经历
          </h3>
          {isEditing && (
            <button
              onClick={addWorkExperience}
              className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <Plus className="h-3 w-3" />
              添加
            </button>
          )}
        </div>

        {formData.work_experiences && formData.work_experiences.length > 0 ? (
          <div className="space-y-3">
            {formData.work_experiences.map((exp, idx) => (
              <div key={idx} className={isEditing ? "p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-900/30" : ""}>
                {isEditing ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">工作经历 {idx + 1}</h4>
                      <button
                        onClick={() => removeWorkExperience(idx)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400">公司名称:</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(idx, 'company', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400">职位:</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateWorkExperience(idx, 'position', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400">开始日期:</label>
                        <input
                          type="date"
                          value={exp.start_date}
                          onChange={(e) => updateWorkExperience(idx, 'start_date', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.is_current || false}
                            onChange={(e) => {
                              updateWorkExperience(idx, 'is_current', e.target.checked);
                              if (e.target.checked) {
                                updateWorkExperience(idx, 'end_date', '');
                              }
                            }}
                            className="rounded"
                          />
                          当前在职
                        </label>
                        {!exp.is_current && (
                          <>
                            <label className="text-xs text-gray-600 dark:text-gray-400">结束日期:</label>
                            <input
                              type="date"
                              value={exp.end_date || ''}
                              onChange={(e) => updateWorkExperience(idx, 'end_date', e.target.value)}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">工作描述:</label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => updateWorkExperience(idx, 'description', e.target.value)}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">主要成就 (用逗号分隔):</label>
                        <input
                          type="text"
                          value={exp.achievements?.join(', ') || ''}
                          onChange={(e) => {
                            const achievements = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                            updateWorkExperience(idx, 'achievements', achievements);
                          }}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="例如: 完成5个项目, 获得优秀员工奖"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-900/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                      </div>
                      {exp.is_current && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                          在职
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {exp.start_date} ~ {exp.is_current ? '至今' : (exp.end_date || '')}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">主要成就:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">公司名称:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">职位:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">开始日期:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400">结束日期:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">工作描述:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">主要成就:</span>
              <div className="mt-1"><span className="text-sm font-medium dark:text-white"></span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

