/**
 * 添加学校页面
 * 功能: 提供表单界面,添加新学校到数据库
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, X, Info, AlertCircle, CheckCircle, School
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

interface SchoolFormData {
  en_name: string;
  cn_name: string;
  country: string;
  region: string;
  city: string;
  ranking: number | null;
  qs_rank_2024: number | null;
  qs_rank_2025: number | null;
  website_url: string;
  logo_url: string;
  description: string;
  tags: string[];
  is_verified: boolean;
}

const AddSchoolPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // 表单数据
  const [formData, setFormData] = useState<SchoolFormData>({
    en_name: '',
    cn_name: '',
    country: '',
    region: '',
    city: '',
    ranking: null,
    qs_rank_2024: null,
    qs_rank_2025: null,
    website_url: '',
    logo_url: '',
    description: '',
    tags: [],
    is_verified: false
  });

  // 更新表单字段
  const handleChange = (field: keyof SchoolFormData, value: string | number | boolean | string[] | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 清除错误提示
    if (error) setError(null);
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
    if (!formData.en_name.trim()) {
      setError('请输入学校英文名称');
      return false;
    }
    if (!formData.country.trim()) {
      setError('请选择国家');
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
        en_name: formData.en_name.trim(),
        cn_name: formData.cn_name.trim() || null,
        country: formData.country.trim(),
        region: formData.region.trim() || null,
        city: formData.city.trim() || null,
        ranking: formData.ranking || null,
        qs_rank_2024: formData.qs_rank_2024 || null,
        qs_rank_2025: formData.qs_rank_2025 || null,
        website_url: formData.website_url.trim() || null,
        logo_url: formData.logo_url.trim() || null,
        description: formData.description.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        is_verified: formData.is_verified
      };

      // 插入数据库
      const { data, error: insertError } = await supabase
        .from('schools')
        .insert([dataToInsert])
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log('学校添加成功:', data);
      setSuccess(true);

      // 2秒后跳转到院校库
      setTimeout(() => {
        navigate('/admin/school-library');
      }, 2000);

    } catch (err) {
      console.error('添加学校失败:', err);
      setError(err instanceof Error ? err.message : '添加学校失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      en_name: '',
      cn_name: '',
      country: '',
      region: '',
      city: '',
      ranking: null,
      qs_rank_2024: null,
      qs_rank_2025: null,
      website_url: '',
      logo_url: '',
      description: '',
      tags: [],
      is_verified: false
    });
    setTagInput('');
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
              onClick={() => navigate('/admin/school-library')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <School className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">添加学校</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  填写学校信息并保存到数据库
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
                <p className="text-sm text-green-600 dark:text-green-300">正在跳转到院校库...</p>
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
            {/* 基本信息 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
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
                    placeholder="University of Cambridge"
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
                    placeholder="剑桥大学"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 国家 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    国家 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择国家</option>
                    <option value="英国">英国</option>
                    <option value="美国">美国</option>
                    <option value="欧陆">欧陆</option>
                    <option value="中国香港">中国香港</option>
                    <option value="中国澳门">中国澳门</option>
                    <option value="新加坡">新加坡</option>
                    <option value="澳大利亚">澳大利亚</option>
                    <option value="加拿大">加拿大</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                {/* 地区/州 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    地区/州
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    placeholder="England, California等"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 城市 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    城市
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Cambridge, London等"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 是否已验证 */}
                <div className="flex items-center h-full pt-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) => handleChange('is_verified', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      已验证学校
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 排名信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                排名信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 综合排名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    综合排名
                  </label>
                  <input
                    type="number"
                    value={formData.ranking || ''}
                    onChange={(e) => handleChange('ranking', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="如: 2"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* QS 2024排名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QS 2024排名
                  </label>
                  <input
                    type="number"
                    value={formData.qs_rank_2024 || ''}
                    onChange={(e) => handleChange('qs_rank_2024', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="如: 3"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* QS 2025排名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QS 2025排名
                  </label>
                  <input
                    type="number"
                    value={formData.qs_rank_2025 || ''}
                    onChange={(e) => handleChange('qs_rank_2025', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="如: 2"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 链接信息 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                链接信息
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {/* 官网链接 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    官网链接
                  </label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                    placeholder="https://www.cam.ac.uk/"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    校徽URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.logo_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.logo_url} 
                        alt="Logo预览" 
                        className="h-16 w-16 object-contain border border-gray-200 dark:border-gray-600 rounded-lg p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 描述 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                学校描述
              </h2>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="请输入学校简介和特色..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 标签 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                标签
              </h2>
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
                💡 建议标签: 研究型, 教学型, 综合性, G5, 常春藤, 公立, 私立等
              </p>
            </div>

            {/* 按钮 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
              <button
                type="submit"
                disabled={loading || success}
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
                    保存学校
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
                onClick={() => navigate('/admin/school-library')}
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

export default AddSchoolPage;

