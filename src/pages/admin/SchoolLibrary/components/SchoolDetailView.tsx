/**
 * 学校详情视图组件
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Star, ExternalLink, MapPin, DollarSign, 
  Clock, BookOpen, Search, User, ChevronRight, Award, Filter, Check 
} from 'lucide-react';
import { School, Program } from '../types/school.types';
import { SuccessCase } from '../services/schoolService';

interface SchoolDetailViewProps {
  school: School;
  programs: Program[];
  successCases: SuccessCase[];
}

export const SchoolDetailView: React.FC<SchoolDetailViewProps> = ({
  school,
  programs,
  successCases
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  // 获取所有可用的学位类型和时长选项
  const degreeOptions = useMemo(() => 
    Array.from(new Set(programs.map(p => p.degree).filter(Boolean))),
    [programs]
  );
  
  const durationOptions = useMemo(() => 
    Array.from(new Set(programs.map(p => p.duration).filter(Boolean))),
    [programs]
  );

  // 切换学位筛选
  const toggleDegree = (degree: string) => {
    setSelectedDegrees(prev =>
      prev.includes(degree)
        ? prev.filter(d => d !== degree)
        : [...prev, degree]
    );
  };

  // 切换时长筛选
  const toggleDuration = (duration: string) => {
    setSelectedDurations(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  // 过滤专业
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = 
        (program.cn_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (program.en_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (program.degree?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesDegree = selectedDegrees.length === 0 || selectedDegrees.includes(program.degree);
      const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(program.duration);
      
      return matchesSearch && matchesDegree && matchesDuration;
    });
  }, [programs, searchQuery, selectedDegrees, selectedDurations]);

  return (
    <div className="p-6 space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/admin/school-library')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>返回院校库</span>
      </button>

      {/* 学校基本信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-20 w-20 flex items-center justify-center">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} className="h-16 w-16 object-contain" />
              ) : (
                <BookOpen className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{school.name}</h1>
              <div className="flex items-center mt-1 space-x-3">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    排名 {school.ranking}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {school.location}
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
            <Heart className="h-4 w-4 mr-1" />
            <span>收藏</span>
          </button>
        </div>

        {/* 学校标签 */}
        {school.tags && school.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {school.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 学校描述 */}
        {school.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">学校简介</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{school.description}</p>
          </div>
        )}

        {/* 学校链接 */}
        {school.rawData?.website_url && (
          <div className="mt-4">
            <a
              href={school.rawData.website_url.startsWith('http') 
                ? school.rawData.website_url 
                : `https://${school.rawData.website_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>访问官网</span>
            </a>
          </div>
        )}
      </div>

      {/* 专业列表 */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 dark:text-white">专业设置</h2>
          
          {/* 搜索框 */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索专业名称或学位类型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-300"
              />
            </div>
            
            {/* 筛选选项 */}
            <div className="flex flex-col space-y-3">
              {/* 学位筛选 */}
              {degreeOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">按学位筛选</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {degreeOptions.map((degree) => (
                      <button
                        key={degree}
                        onClick={() => toggleDegree(degree)}
                        className={`px-3 py-1 text-xs rounded-full flex items-center ${
                          selectedDegrees.includes(degree)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {selectedDegrees.includes(degree) && <Check className="h-3 w-3 mr-1" />}
                        {degree}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 时长筛选 */}
              {durationOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">按时长筛选</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {durationOptions.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => toggleDuration(duration)}
                        className={`px-3 py-1 text-xs rounded-full flex items-center ${
                          selectedDurations.includes(duration)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {selectedDurations.includes(duration) && <Check className="h-3 w-3 mr-1" />}
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 专业卡片列表 - 一行一个专业 */}
          <div className="space-y-3">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onClick={() => navigate(`/admin/programs/${program.id}`)}
                  className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium dark:text-white">
                      {program.cn_name || program.en_name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{program.degree}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{program.tuition_fee ? `${program.tuition_fee}元/年` : '学费未公布'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                没有找到符合条件的专业
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 成功案例 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">成功案例</h2>
          <button
            onClick={() => navigate('/admin/cases')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <span>查看全部案例</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 案例列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {successCases.length > 0 ? (
            successCases.slice(0, 4).map((successCase) => (
              <div 
                key={successCase.id} 
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium dark:text-white">{successCase.student_name}</h3>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {successCase.admission_year}年录取
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      录取专业: {successCase.program_name || '未知专业'}
                    </p>
                    {successCase.background && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                        背景: {successCase.background}
                      </p>
                    )}
                    {successCase.gpa && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        GPA: {successCase.gpa}
                      </p>
                    )}
                    {successCase.language_scores && Object.keys(successCase.language_scores).length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        语言成绩: {Object.entries(successCase.language_scores)
                          .map(([type, score]) => `${type} ${score}`)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              暂无成功案例
            </div>
          )}
        </div>

        {/* 查看更多案例按钮 */}
        {successCases.length > 4 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/admin/cases')}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              查看更多案例
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

