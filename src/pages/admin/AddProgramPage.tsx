/**
 * 添加专业页面
 * 功能: 提供表单界面,添加新专业到数据库
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, X, Info, AlertCircle, CheckCircle, BookOpen, Search
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

interface School {
  id: number;
  en_name: string;
  cn_name: string | null;
  country: string;
}

interface ProgramFormData {
  school_id: number | null;
  en_name: string;
  cn_name: string;
  degree: string;
  category: string;
  faculty: string;
  duration: string;
  entry_month: string;
  tuition_fee: string;
  language_requirements: string;
  apply_requirements: string;
  curriculum: string;
  objectives: string;
  analysis: string;
  interview: string;
  url: string;
  tags: string[];
  career: string;
}

const AddProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<ProgramFormData>({
    school_id: null,
    en_name: '',
    cn_name: '',
    degree: '',
    category: '',
    faculty: '',
    duration: '',
    entry_month: '',
    tuition_fee: '',
    language_requirements: '',
    apply_requirements: '',
    curriculum: '',
    objectives: '',
    analysis: '',
    interview: '',
    url: '',
    tags: [],
    career: ''
  });

  // 加载学校列表
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, en_name, cn_name, country')
          .order('en_name', { ascending: true });

        if (error) throw error;

        setSchools(data || []);
      } catch (err) {
        console.error('加载学校列表失败:', err);
        setError('加载学校列表失败');
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
  const handleChange = (field: keyof ProgramFormData, value: string | number | string[] | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 清除错误提示
    if (error) setError(null);
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
      // 准备数据
      const dataToInsert = {
        school_id: formData.school_id,
        en_name: formData.en_name.trim(),
        cn_name: formData.cn_name.trim() || null,
        degree: formData.degree.trim() || null,
        category: formData.category.trim() || null,
        faculty: formData.faculty.trim() || null,
        duration: formData.duration.trim() || null,
        entry_month: formData.entry_month.trim() || null,
        tuition_fee: formData.tuition_fee.trim() || null,
        language_requirements: formData.language_requirements.trim() || null,
        apply_requirements: formData.apply_requirements.trim() || null,
        curriculum: formData.curriculum.trim() || null,
        objectives: formData.objectives.trim() || null,
        analysis: formData.analysis.trim() || null,
        interview: formData.interview.trim() || null,
        url: formData.url.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        career: formData.career.trim() || null
      };

      // 插入数据库
      const { data, error: insertError } = await supabase
        .from('programs')
        .insert([dataToInsert])
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log('专业添加成功:', data);
      setSuccess(true);

      // 2秒后跳转到专业库
      setTimeout(() => {
        navigate('/admin/program-library');
      }, 2000);

    } catch (err) {
      console.error('添加专业失败:', err);
      setError(err instanceof Error ? err.message : '添加专业失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      school_id: null,
      en_name: '',
      cn_name: '',
      degree: '',
      category: '',
      faculty: '',
      duration: '',
      entry_month: '',
      tuition_fee: '',
      language_requirements: '',
      apply_requirements: '',
      curriculum: '',
      objectives: '',
      analysis: '',
      interview: '',
      url: '',
      tags: [],
      career: ''
    });
    setTagInput('');
    setSchoolSearchQuery('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/program-library')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">添加专业</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  填写专业信息并保存到数据库
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* 成功提示 */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">添加成功!</p>
                <p className="text-sm text-green-600 dark:text-green-300">正在跳转到专业库...</p>
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
                <p className="font-medium text-red-800 dark:text-red-200">添加失败</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* 选择学校 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                选择学校
              </h2>
              
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
                  
                  {/* 已选择的学校 */}
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
                        onClick={() => handleChange('school_id', null)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* 搜索框 */}
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

                      {/* 学校下拉列表 */}
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
                  
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    💡 提示: 共有 {schools.length} 所学校可选择
                  </p>
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                基本信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 英文名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    英文名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.en_name}
                    onChange={(e) => handleChange('en_name', e.target.value)}
                    placeholder="Master of Science in Computer Science"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 中文名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    中文名称
                  </label>
                  <input
                    type="text"
                    value={formData.cn_name}
                    onChange={(e) => handleChange('cn_name', e.target.value)}
                    placeholder="计算机科学硕士"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 学位类型 */}
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

                {/* 专业类别 */}
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

                {/* 所属学院 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    所属学院
                  </label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => handleChange('faculty', e.target.value)}
                    placeholder="如: 工程学院, 商学院"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 学制 */}
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

                {/* 入学月份 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    入学月份
                  </label>
                  <input
                    type="text"
                    value={formData.entry_month}
                    onChange={(e) => handleChange('entry_month', e.target.value)}
                    placeholder="如: 9月, 1月, 9月/1月"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 学费 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学费
                  </label>
                  <input
                    type="text"
                    value={formData.tuition_fee}
                    onChange={(e) => handleChange('tuition_fee', e.target.value)}
                    placeholder="如: 30000英镑/年"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 申请要求 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                申请要求
              </h2>
              <div className="space-y-4">
                {/* 语言要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    语言要求
                  </label>
                  <textarea
                    value={formData.language_requirements}
                    onChange={(e) => handleChange('language_requirements', e.target.value)}
                    placeholder="如: 雅思7.0(单项不低于6.5)或托福100"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 申请要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    申请要求
                  </label>
                  <textarea
                    value={formData.apply_requirements}
                    onChange={(e) => handleChange('apply_requirements', e.target.value)}
                    placeholder="如: 本科相关专业背景,GPA 3.5+,需提交推荐信、个人陈述等"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 面试要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    面试要求
                  </label>
                  <textarea
                    value={formData.interview}
                    onChange={(e) => handleChange('interview', e.target.value)}
                    placeholder="如: 部分申请者需要参加视频面试"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 项目详情 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                项目详情
              </h2>
              <div className="space-y-4">
                {/* 课程设置 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    课程设置
                  </label>
                  <textarea
                    value={formData.curriculum}
                    onChange={(e) => handleChange('curriculum', e.target.value)}
                    placeholder="详细描述课程设置..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 培养目标 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    培养目标
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => handleChange('objectives', e.target.value)}
                    placeholder="描述专业的培养目标..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 项目分析 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    项目分析
                  </label>
                  <textarea
                    value={formData.analysis}
                    onChange={(e) => handleChange('analysis', e.target.value)}
                    placeholder="分析项目特色、优势等..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 职业发展 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    职业发展
                  </label>
                  <textarea
                    value={formData.career}
                    onChange={(e) => handleChange('career', e.target.value)}
                    placeholder="描述未来职业发展方向..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                其他信息
              </h2>
              <div className="space-y-4">
                {/* 项目链接 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    项目链接
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 标签 */}
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
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    💡 建议标签: 热门专业, STEM, 带实习, 就业率高等
                  </p>
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
                    保存专业
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || success}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                重置
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/program-library')}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgramPage;

