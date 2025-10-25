/**
 * 添加选校记录模态框
 * 从专业库搜索并选择学校和专业
 */

import React, { useState, useEffect } from 'react';
import { X, Search, Building2, BookOpen, Plus, Loader2, Filter } from 'lucide-react';
import { FinalUniversityChoice } from '../types';
import { supabase } from '../../../../lib/supabase';

interface AddUniversityChoiceModalProps {
  studentId: number;
  onClose: () => void;
  onSave: (choice: Partial<FinalUniversityChoice>) => Promise<void>;
}

interface Program {
  id: number;
  program_name: string;
  school_id: number;
  school_name?: string;
  degree_level?: string;
  duration?: string;
  tuition_fee?: string;
  application_deadline?: string;
  logo_url?: string;
}

interface School {
  id: number;
  name: string;
  country?: string;
  logo_url?: string;
}

export default function AddUniversityChoiceModal({ studentId, onClose, onSave }: AddUniversityChoiceModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schools, setSchools] = useState<Map<number, School>>(new Map());
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  // 过滤条件
  const [degreeFilter, setDegreeFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  
  // 表单数据
  const [formData, setFormData] = useState<Partial<FinalUniversityChoice>>({
    student_id: studentId,
    school_name: '',
    program_name: '',
    program_level: '',
    application_deadline: '',
    application_round: 'RD',
    application_type: '目标院校',
    submission_status: '未投递',
    application_account: '',
    application_password: '',
    notes: ''
  });

  // 学位类型选项
  const degreeTypes = ['本科', '硕士', '博士'];
  
  // 申请轮次选项
  const applicationRounds = ['ED', 'ED2', 'EA', 'REA', 'RD', 'Rolling'];
  
  // 申请类型选项
  const applicationTypes = ['冲刺院校', '目标院校', '保底院校'];
  
  // 投递状态选项
  const submissionStatuses = ['未投递', '准备中', '已投递', '审核中', '已录取', '已拒绝', 'Waitlist'];

  // 搜索专业
  useEffect(() => {
    const searchPrograms = async () => {
      if (!searchQuery.trim()) {
        setPrograms([]);
        return;
      }

      setIsSearching(true);
      try {
        let query = supabase
          .from('programs')
          .select('id, program_name, school_id, degree_level, duration, tuition_fee, application_deadline')
          .or(`program_name.ilike.%${searchQuery}%,school_name.ilike.%${searchQuery}%`);

        if (degreeFilter) {
          query = query.eq('degree_level', degreeFilter);
        }

        const { data, error } = await query.limit(20);

        if (error) throw error;

        setPrograms(data || []);

        // 加载学校信息
        if (data && data.length > 0) {
          const schoolIds = [...new Set(data.map(p => p.school_id))];
          const { data: schoolsData, error: schoolsError } = await supabase
            .from('schools')
            .select('id, name, country, logo_url')
            .in('id', schoolIds);

          if (!schoolsError && schoolsData) {
            const schoolsMap = new Map(schoolsData.map(s => [s.id, s]));
            setSchools(schoolsMap);
          }
        }
      } catch (error) {
        console.error('搜索专业失败:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPrograms, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, degreeFilter]);

  // 选择专业
  const handleSelectProgram = (program: Program) => {
    const school = schools.get(program.school_id);
    setSelectedProgram(program);
    setFormData({
      ...formData,
      school_name: school?.name || '',
      program_name: program.program_name || '',
      program_level: program.degree_level || '',
      application_deadline: program.application_deadline || ''
    });
    setSearchQuery('');
    setPrograms([]);
  };

  // 更新字段
  const updateField = (field: keyof FinalUniversityChoice, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.school_name || !formData.program_name) {
      alert('请选择学校和专业');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败,请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">添加选校</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* 搜索专业 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                搜索专业
              </h3>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="输入学校名称或专业名称搜索..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 animate-spin" />
                  )}
                </div>

                <select
                  value={degreeFilter}
                  onChange={(e) => setDegreeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">所有学位</option>
                  {degreeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* 搜索结果 */}
              {programs.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                  {programs.map((program) => {
                    const school = schools.get(program.school_id);
                    return (
                      <button
                        key={program.id}
                        type="button"
                        onClick={() => handleSelectProgram(program)}
                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          {school?.logo_url ? (
                            <img 
                              src={school.logo_url} 
                              alt={school.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {program.program_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {school?.name || '未知学校'}
                              {program.degree_level && ` · ${program.degree_level}`}
                              {school?.country && ` · ${school.country}`}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {searchQuery && !isSearching && programs.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  未找到匹配的专业
                </p>
              )}
            </div>

            {/* 已选择的专业 */}
            {selectedProgram && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  {schools.get(selectedProgram.school_id)?.logo_url ? (
                    <img 
                      src={schools.get(selectedProgram.school_id)?.logo_url} 
                      alt={formData.school_name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formData.program_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.school_name}
                      {formData.program_level && ` · ${formData.program_level}`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram(null);
                      setFormData({
                        ...formData,
                        school_name: '',
                        program_name: '',
                        program_level: ''
                      });
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            {/* 申请信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 申请类型 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  申请类型 *
                </label>
                <select
                  value={formData.application_type}
                  onChange={(e) => updateField('application_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  {applicationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* 申请轮次 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  申请轮次
                </label>
                <select
                  value={formData.application_round}
                  onChange={(e) => updateField('application_round', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {applicationRounds.map(round => (
                    <option key={round} value={round}>{round}</option>
                  ))}
                </select>
              </div>

              {/* 申请截止日期 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  申请截止日期
                </label>
                <input
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => updateField('application_deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* 投递状态 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  投递状态
                </label>
                <select
                  value={formData.submission_status}
                  onChange={(e) => updateField('submission_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {submissionStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 申请账号信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  申请账号
                </label>
                <input
                  type="text"
                  value={formData.application_account}
                  onChange={(e) => updateField('application_account', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="申请系统账号"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  申请密码
                </label>
                <input
                  type="text"
                  value={formData.application_password}
                  onChange={(e) => updateField('application_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="申请系统密码"
                />
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                备注
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="其他需要记录的信息..."
              />
            </div>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !selectedProgram}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                添加到选校列表
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

