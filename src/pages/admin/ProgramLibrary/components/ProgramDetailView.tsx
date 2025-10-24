/**
 * 专业详情视图组件
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Star, ExternalLink, MapPin, DollarSign, 
  Clock, BookOpen, Building, Users, ChevronRight, Award, FileText
} from 'lucide-react';
import { Program } from '../types/program.types';
import { School } from '../../SchoolLibrary/types/school.types';

interface ProgramDetailViewProps {
  program: Program;
  school: School | null;
}

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({
  program,
  school
}) => {
  const navigate = useNavigate();

  return (
    <div className="pb-10">
      {/* 顶部大图背景 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/admin/program-library')}
          className="absolute top-6 left-6 p-2 bg-white/20 rounded-full z-10 hover:bg-white/30 transition-colors"
          title="返回专业库"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        
        {/* 专业基本信息 */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end bg-gradient-to-t from-black/60 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">
                {program.cn_name || program.en_name}
              </h1>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {program.degree}
              </div>
              <button className="flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30">
                <Heart className="h-4 w-4" />
                收藏
              </button>
            </div>
            <div className="flex items-center text-white/90 gap-4">
              {school && (
                <>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{school.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{school.location}</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{program.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* 内容区域 */}
        <div className="flex flex-col space-y-6">
          {/* 学校信息卡片 */}
          {school && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  {school.logoUrl ? (
                    <img src={school.logoUrl} alt={school.name} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="text-blue-500 font-bold text-xl">
                      {school.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold dark:text-white">{school.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{school.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>排名 {school.ranking}</span>
                    </div>
                  </div>
                  {school.description && (
                    <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {school.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <button 
                      onClick={() => navigate(`/admin/school-detail/${school.id}`)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      查看学校详情
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 专业基本信息卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">专业基本信息</h2>
              {program.url && (
                <a 
                  href={program.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  官网链接
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学位类型</div>
                <div className="font-semibold dark:text-white">{program.degree}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学制</div>
                <div className="font-semibold dark:text-white">{program.duration}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学费</div>
                <div className="font-semibold dark:text-white">
                  {program.tuition_fee || '待定'}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">面试信息</div>
                <div className="font-semibold dark:text-white text-sm">
                  {program.interview || '无面试'}
                </div>
              </div>
            </div>

            {/* 标签 */}
            {program.tags && program.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {program.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 培养目标卡片 */}
          {program.objectives && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold dark:text-white">培养目标</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.objectives}
                </p>
              </div>
            </div>
          )}
          
          {/* 课程设置卡片 */}
          {program.curriculum && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-bold dark:text-white">课程设置</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.curriculum}
                </p>
              </div>
            </div>
          )}

          {/* 申请要求卡片 */}
          {program.apply_requirements && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold dark:text-white">申请要求</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.apply_requirements}
                </p>
              </div>
            </div>
          )}

          {/* 语言要求卡片 */}
          {program.language_requirements && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-rose-500" />
                <h2 className="text-xl font-bold dark:text-white">语言要求</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.language_requirements}
                </p>
              </div>
            </div>
          )}

          {/* 专业分析卡片 */}
          {program.analysis && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold dark:text-white">专业分析</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

