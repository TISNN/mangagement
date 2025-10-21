import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ExternalLink, MapPin, DollarSign, Clock, BookOpen, Search, User, ChevronRight, Award, Building, Users, FileText, Briefcase, Edit, Dot } from 'lucide-react';
import { supabase } from "../../supabase";
import { Link } from 'react-router-dom';

// 定义类型，与数据库表结构匹配
interface Program {
  id: string;
  school_id: string;
  cn_name?: string;
  en_name: string;
  name?: string; // 用于兼容，显示中文名或英文名
  degree: string;
  duration: string;
  faculty: string;
  category: string;
  entry_month?: string;
  tags?: string[];
  apply_requirements: string;
  language_requirements: string;
  curriculum: string;
  analysis: string;
  url: string;
  interview: string;
  objectives: string;
  tuition_fee: string;
  created_at?: string;
  updated_at?: string;
  
  // 在前端补充的字段，非数据库字段
  description?: string;
  requirements?: string;
  employment?: string;
  careers?: string; // 就业方向
  subCategory?: string;
  applyDeadline?: string;
  tuition?: string;
  courses?: string[];
  facultyMembers?: {
    name: string;
    title: string;
    researchArea?: string;
  }[];
}

interface School {
  id: string;
  cn_name: string;
  en_name?: string;
  name?: string; // 用于兼容，显示中文名或英文名
  location?: string;
  country?: string;
  city?: string;
  region?: string;
  ranking?: number;
  qs_rank_2025?: number;
  qs_rank_2024?: number;
  logo_url?: string;
  description?: string;
  is_verified?: boolean;
  tags?: string[];
  
  // 前端组织的数据
  programs?: Program[];
  acceptance?: string;
  tuition?: string;
}

// 成功案例类型
interface SuccessCase {
  id: string;
  studentName: string;
  admissionYear: string;
  program: string;
  background: string;
  story: string;
  avatarUrl?: string;
}

const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从数据库获取专业和学校数据
  useEffect(() => {
    const fetchProgramDetail = async () => {
      if (!programId) {
        setError("未提供专业ID");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // 1. 从数据库获取专业详情
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();

        if (programError) {
          console.error('获取专业详情失败', programError);
          setError(programError.message);
          setLoading(false);
          return;
        }

        if (!programData) {
          setError('未找到专业信息');
          setLoading(false);
          return;
        }
        
        // 处理专业数据，调整格式
        const processedProgram: Program = {
          ...programData,
          name: programData.cn_name || programData.en_name, // 使用中文名优先，否则使用英文名
          description: programData.curriculum || '暂无专业介绍', // 使用课程介绍作为描述
          requirements: programData.apply_requirements || '暂无申请要求',
          employment: programData.analysis || '暂无就业前景分析',
          tuition: programData.tuition_fee,
          applyDeadline: programData.entry_month ? `${programData.entry_month}入学` : '请查看官网',
          // 将课程字符串拆分为数组
          courses: programData.curriculum 
            ? programData.curriculum.split(/[;；。,，]/).filter(Boolean).slice(0, 8)
            : []
        };
        
        setProgram(processedProgram);
        
        // 2. 获取专业所属学校信息
        if (programData.school_id) {
          const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .select('*')
            .eq('id', programData.school_id)
            .single();
            
          if (schoolError) {
            console.error('获取学校信息失败', schoolError);
          } else if (schoolData) {
            // 处理学校数据
            const processedSchool: School = {
              ...schoolData,
              name: schoolData.cn_name || schoolData.en_name,
              location: `${schoolData.country || ''} ${schoolData.city || ''}`.trim() || '位置未知',
              ranking: schoolData.ranking?.toString() || schoolData.qs_rank_2024?.toString() || '未排名',
              programs: [],
              acceptance: '录取率未知', // 暂无数据
              tuition: programData.tuition_fee || '学费未知'
            };
            
            setSchool(processedSchool);
          }
        }
      } catch (error) {
        console.error('获取专业详情失败', error);
        setError(error instanceof Error ? error.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetail();
  }, [programId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">获取专业信息失败</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          返回专业列表
        </button>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">未找到专业信息</h2>
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          返回专业列表
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* 顶部大图背景 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate('/admin/school-assistant')}
          className="absolute top-6 left-6 p-2 bg-white/20 rounded-full z-10 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        
        {/* 专业基本信息 */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end bg-gradient-to-t from-black/60 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{program.name}</h1>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{program.degree}</div>
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
                  {school.logo_url ? (
                    <img src={school.logo_url} alt={school.name || '学校'} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="text-blue-500 font-bold text-xl">{school.name?.slice(0, 2) || 'SC'}</div>
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
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>录取率 {school.acceptance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>学费 {school.tuition}</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{school.description}</p>
                <div className="mt-3">
                  <button 
                    onClick={() => navigate(`/admin/school-detail/${school.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
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
              <a 
                href={program.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                官网链接
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学位类型</div>
                <div className="font-semibold dark:text-white">{program.degree}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学制</div>
                <div className="font-semibold dark:text-white">{program.duration}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">申请截止</div>
                <div className="font-semibold dark:text-white">{program.applyDeadline || '待定'}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">学费</div>
                <div className="font-semibold dark:text-white">{program.tuition_fee || school?.tuition || '待定'}</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">面试信息</div>
                <div className="font-semibold dark:text-white">{program.interview || '暂无面试信息'}</div>
              </div>
              </div>
            </div>
            
          {/* 培养目标卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold dark:text-white">培养目标</h2>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              <p>{program.objectives || '暂无培养目标信息'}</p>
            </div>
            </div>
            
          {/* 课程设置卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold dark:text-white">课程设置</h2>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              {program.curriculum ? (
                <ul className="list-disc pl-5 space-y-2">
                  {program.curriculum.split(/[;；]/).map((course, index) => (
                    <li key={index}>{course.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p>暂无课程设置信息</p>
                        )}
                      </div>
                    </div>
          
          {/* 申请要求卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-bold dark:text-white">申请要求</h2>
                </div>
            <div className="prose max-w-none dark:prose-invert">
              <p>{program.apply_requirements || '暂无申请要求信息'}</p>
              </div>
          </div>
          
          {/* 语言要求卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold dark:text-white">语言要求</h2>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              <p>{program.language_requirements || '暂无语言要求信息'}</p>
                      </div>
                    </div>
          
          {/* 师资力量卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold dark:text-white">师资力量</h2>
                    </div>
            <div className="prose max-w-none dark:prose-invert">
              <p>{program.faculty || '暂无师资力量信息'}</p>
            </div>
          </div>
          
          {/* 专业分析卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-indigo-500" />
              <h2 className="text-xl font-bold dark:text-white">专业分析</h2>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              <p>{program.analysis || '暂无专业分析信息'}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage; 