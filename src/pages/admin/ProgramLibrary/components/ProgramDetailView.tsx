/**
 * 专业详情视图组件
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Star, ExternalLink, MapPin, 
  Clock, BookOpen, Building, Users, ChevronRight, Award, FileText, Edit,
  GraduationCap, Calendar, Briefcase, HelpCircle, List, Menu
} from 'lucide-react';
import { Program } from '../types/program.types';
import { School } from '../../SchoolLibrary/types/school.types';
import { ProgramEditForm } from './ProgramEditForm';

interface ProgramDetailViewProps {
  program: Program;
  school: School | null;
  onProgramUpdate?: (updatedProgram: Program) => void;
}

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({
  program: initialProgram,
  school,
  onProgramUpdate
}) => {
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program>(initialProgram);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  
  // 定义目录项
  const sections = useMemo(() => [
    { id: 'basic-info', label: '专业基本信息', icon: FileText },
    { id: 'positioning', label: '项目定位', icon: Award },
    { id: 'objectives', label: '培养目标', icon: BookOpen },
    { id: 'curriculum', label: '课程设置', icon: BookOpen },
    { id: 'apply-requirements', label: '申请要求', icon: FileText },
    { id: 'language-requirements', label: '语言要求', icon: Award },
    { id: 'analysis', label: '专业分析', icon: FileText },
    { id: 'features', label: '项目特色', icon: Star },
    { id: 'course-structure', label: '课程结构', icon: GraduationCap },
    { id: 'timeline', label: '申请时间线', icon: Calendar },
    { id: 'materials', label: '申请材料清单', icon: List },
    { id: 'career', label: '就业信息', icon: Briefcase },
    { id: 'interview', label: '面试指导', icon: HelpCircle },
    { id: 'application-guide', label: '申请指导', icon: FileText },
  ], []);

  // 滚动到指定章节
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // 距离顶部的偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // 监听滚动，更新当前激活的章节
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // 偏移量

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // 确保目录和内容区域与顶部信息栏对齐
  useEffect(() => {
    const alignLayout = () => {
      const headerContent = document.getElementById('header-content');
      const contentContainer = document.getElementById('content-container');
      
      if (headerContent && contentContainer) {
        const headerRect = headerContent.getBoundingClientRect();
        const containerRect = contentContainer.getBoundingClientRect();
        
        // 确保容器宽度一致
        if (Math.abs(headerRect.width - containerRect.width) > 1) {
          // 如果宽度不一致，可能需要调整
          console.log('Layout alignment check:', {
            headerWidth: headerRect.width,
            containerWidth: containerRect.width
          });
        }
      }
    };

    // 初始对齐
    alignLayout();
    
    // 监听窗口大小变化
    window.addEventListener('resize', alignLayout);
    return () => window.removeEventListener('resize', alignLayout);
  }, [showSidebar]);

  // 处理编辑成功
  const handleEditSuccess = (updatedProgram: Program) => {
    setProgram(updatedProgram);
    setIsEditing(false);
    if (onProgramUpdate) {
      onProgramUpdate(updatedProgram);
    }
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="pb-10">
      {/* 编辑表单模态框 */}
      {isEditing && (
        <ProgramEditForm
          program={program}
          onSuccess={handleEditSuccess}
          onCancel={handleCancelEdit}
        />
      )}

      {/* 顶部大图背景 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden rounded-xl mx-6 mt-6">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/admin/program-library')}
          className="absolute top-6 left-6 p-2 bg-white/20 rounded-full z-10 hover:bg-white/30 transition-colors"
          title="返回专业库"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        {/* 编辑按钮 */}
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 p-2 bg-white/20 rounded-full z-10 hover:bg-white/30 transition-colors flex items-center gap-2 px-4"
          title="编辑专业"
        >
          <Edit className="h-5 w-5 text-white" />
          <span className="text-white text-sm">编辑</span>
        </button>
        
        {/* 专业基本信息 */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end bg-gradient-to-t from-black/60 to-transparent">
          <div className="w-full max-w-7xl mx-auto px-6" id="header-content">
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
            <div className="flex items-center text-white/90 gap-4 flex-wrap">
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
              {program.study_mode && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{program.study_mode}</span>
                </div>
              )}
              {program.credit_requirements && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{program.credit_requirements}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 pt-6" id="content-container">
        <div className="flex gap-6 relative">
          {/* 目录显示/隐藏按钮（当目录隐藏时显示） */}
          {!showSidebar && (
            <div className="hidden lg:block">
              <button
                onClick={() => setShowSidebar(true)}
                className="sticky top-24 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                title="显示目录"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}

          {/* 左侧目录侧边栏 */}
          {showSidebar && (
            <div className="hidden lg:block flex-shrink-0 w-64" id="sidebar">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">目录</h3>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="隐藏目录"
                    >
                      <Menu className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const element = document.getElementById(section.id);
                      const isVisible = element !== null;
                      
                      if (!isVisible) return null;
                      
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-left truncate">{section.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex-1 flex flex-col space-y-6 min-w-0">
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
          <div id="basic-info" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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
              {program.study_mode && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学习模式</div>
                  <div className="font-semibold dark:text-white">{program.study_mode}</div>
                </div>
              )}
              {program.credit_requirements && (
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学分要求</div>
                  <div className="font-semibold dark:text-white">{program.credit_requirements}</div>
                </div>
              )}
              {program.teaching_mode && (
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">授课方式</div>
                  <div className="font-semibold dark:text-white">{program.teaching_mode}</div>
                </div>
              )}
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
          
          {/* 项目定位卡片 */}
          {program.program_positioning && (
            <div id="positioning" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold dark:text-white">项目定位</h2>
              </div>
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {program.program_positioning}
                </p>
              </div>
            </div>
          )}

          {/* 培养目标卡片 */}
          {program.objectives && (
            <div id="objectives" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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
            <div id="curriculum" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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
            <div id="apply-requirements" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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
            <div id="language-requirements" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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
            <div id="analysis" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
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

          {/* 项目特色卡片 */}
          {program.program_features && program.program_features.length > 0 && (
            <div id="features" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold dark:text-white">项目特色</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {program.program_features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 课程结构卡片 */}
          {program.course_structure && (
            (program.course_structure.preparatory_courses?.length ||
             program.course_structure.core_courses?.length ||
             program.course_structure.elective_courses?.length ||
             program.course_structure.experiential_learning?.length) && (
              <div id="course-structure" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  <h2 className="text-xl font-bold dark:text-white">课程结构</h2>
                </div>
                <div className="space-y-6">
                  {/* 入学前预备课 */}
                  {program.course_structure.preparatory_courses && program.course_structure.preparatory_courses.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">入学前预备课</h3>
                      <div className="space-y-2">
                        {program.course_structure.preparatory_courses.map((course, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="font-medium dark:text-white">{course.name}</div>
                            {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                            {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 核心课程 */}
                  {program.course_structure.core_courses && program.course_structure.core_courses.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">核心课程</h3>
                      <div className="space-y-2">
                        {program.course_structure.core_courses.map((course, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium dark:text-white">{course.name}</div>
                                {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                                {course.credits && <div className="text-sm text-gray-500 dark:text-gray-500">{course.credits}学分</div>}
                                {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 选修课程 */}
                  {program.course_structure.elective_courses && program.course_structure.elective_courses.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">选修课程</h3>
                      <div className="space-y-2">
                        {program.course_structure.elective_courses.map((course, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium dark:text-white">{course.name}</div>
                                {course.name_cn && <div className="text-sm text-gray-600 dark:text-gray-400">{course.name_cn}</div>}
                                {course.credits && <div className="text-sm text-gray-500 dark:text-gray-500">{course.credits}学分</div>}
                                {course.description && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</div>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 体验式学习 */}
                  {program.course_structure.experiential_learning && program.course_structure.experiential_learning.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">体验式学习</h3>
                      <div className="space-y-2">
                        {program.course_structure.experiential_learning.map((learning, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
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
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* 申请时间线卡片 */}
          {program.application_timeline && program.application_timeline.length > 0 && (
            <div id="timeline" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold dark:text-white">申请时间线</h2>
              </div>
              <div className="space-y-3">
                {program.application_timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {event.event_date}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold dark:text-white">{event.event_name}</h3>
                        {event.is_scholarship_deadline && (
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded">
                            奖学金截止
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 申请材料清单卡片 */}
          {program.application_materials && program.application_materials.length > 0 && (
            <div id="materials" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <List className="h-5 w-5 text-indigo-500" />
                <h2 className="text-xl font-bold dark:text-white">申请材料清单</h2>
              </div>
              <div className="space-y-3">
                {program.application_materials.map((material, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
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
                      <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        <span className="font-medium">格式要求：</span>{material.format_requirements}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 就业信息卡片 */}
          {program.career_info && (
            (program.career_info.industries?.length ||
             program.career_info.job_titles?.length ||
             program.career_info.employment_rate !== undefined ||
             program.career_info.avg_salary) && (
              <div id="career" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-bold dark:text-white">就业信息</h2>
                </div>
                <div className="space-y-4">
                  {/* 就业行业 */}
                  {program.career_info.industries && program.career_info.industries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">就业行业</h3>
                      <div className="flex flex-wrap gap-2">
                        {program.career_info.industries.map((industry, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 典型岗位 */}
                  {program.career_info.job_titles && program.career_info.job_titles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">典型岗位</h3>
                      <div className="flex flex-wrap gap-2">
                        {program.career_info.job_titles.map((jobTitle, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                          >
                            {jobTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 就业数据 */}
                  {(program.career_info.employment_rate !== undefined || program.career_info.avg_salary) && (
                    <div className="grid grid-cols-2 gap-4">
                      {program.career_info.employment_rate !== undefined && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">就业率</div>
                          <div className="text-lg font-semibold dark:text-white">{program.career_info.employment_rate}%</div>
                        </div>
                      )}
                      {program.career_info.avg_salary && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">平均薪资</div>
                          <div className="text-lg font-semibold dark:text-white">{program.career_info.avg_salary}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* 面试指导卡片 */}
          {program.interview_guide && (
            (program.interview_guide.common_questions?.length || program.interview_guide.preparation_tips) && (
              <div id="interview" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-rose-500" />
                  <h2 className="text-xl font-bold dark:text-white">面试指导</h2>
                </div>
                <div className="space-y-4">
                  {/* 常见问题 */}
                  {program.interview_guide.common_questions && program.interview_guide.common_questions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">常见问题</h3>
                      <div className="space-y-2">
                        {program.interview_guide.common_questions.map((question, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 准备建议 */}
                  {program.interview_guide.preparation_tips && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">准备建议</h3>
                      <div className="prose max-w-none dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {program.interview_guide.preparation_tips}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* 申请指导卡片 */}
          {program.application_guide && (
            (program.application_guide.resume_tips || program.application_guide.ps_tips) && (
              <div id="application-guide" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-teal-500" />
                  <h2 className="text-xl font-bold dark:text-white">申请指导</h2>
                </div>
                <div className="space-y-6">
                  {/* 简历撰写要点 */}
                  {program.application_guide.resume_tips && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">简历撰写要点</h3>
                      </div>
                      <div className="rounded-lg p-5">
                        <div className="prose max-w-none dark:prose-invert">
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {program.application_guide.resume_tips}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PS/SOP写作要点 */}
                  {program.application_guide.ps_tips && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-500 dark:bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">PS/SOP/ML写作要点</h3>
                      </div>
                      <div className="rounded-lg p-5">
                        <div className="prose max-w-none dark:prose-invert">
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {program.application_guide.ps_tips}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

