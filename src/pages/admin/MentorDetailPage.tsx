// 导师详情页面

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  DollarSign,
  Edit3,
  UserCheck,
  LucideIcon,
  BookOpen,
  Target,
  Clock,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { fetchMentorById } from './MentorLibrary/services/mentorService';
import type { Mentor } from './MentorLibrary/types/mentor.types';

// 标签组件
interface TagProps {
  text: string;
  color: string;
}

const Tag: React.FC<TagProps> = ({ text, color }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
    {text}
  </span>
);

// 信息项组件
interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="font-medium text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

// 导师详情页组件
const MentorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取导师详情
  useEffect(() => {
    const fetchMentorDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchMentorById(id);
        if (data) {
          setMentor(data);
          setError(null);
        } else {
          setError('未找到该导师信息');
        }
      } catch (err) {
        console.error('获取导师详情失败:', err);
        setError('加载导师详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetail();
  }, [id]);

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载导师详情中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">加载失败</p>
            <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin/mentors')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              返回导师库
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 默认头像 - 使用 DiceBear API 根据导师名字生成
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/mentors')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">返回导师库</span>
            </button>
            
            <div className="flex items-center gap-3">
              {/* 编辑按钮 - 待实现 */}
              <button
                onClick={() => {/* TODO: 导航到编辑页面 */}}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                编辑导师
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 导师基本信息卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          {/* 顶部背景 */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          
          {/* 导师信息 */}
          <div className="px-8 pb-8">
            <div className="flex items-start gap-6 -mt-16">
              {/* 头像 */}
              <img
                src={mentor.avatarUrl || defaultAvatar}
                alt={mentor.name}
                className="h-32 w-32 rounded-xl border-4 border-white dark:border-gray-800 object-cover shadow-lg"
              />
              
              {/* 基本信息 */}
              <div className="flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {mentor.name}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* 专业级别 */}
                      {mentor.expertiseLevel && (
                        <Tag 
                          text={mentor.expertiseLevel} 
                          color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                        />
                      )}
                      
                      {/* 活跃状态 */}
                      {mentor.isActive && (
                        <Tag 
                          text="在职" 
                          color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        />
                      )}
                      
                      {/* 员工关联 */}
                      {mentor.employeeId && (
                        <Tag 
                          text="员工导师" 
                          color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* 时薪 */}
                  {mentor.hourlyRate && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">时薪</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ¥{mentor.hourlyRate}/小时
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 详细信息网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧栏 - 基本信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 联系信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                基本信息
              </h2>
              <div className="space-y-3">
                {/* 地理位置 */}
                <InfoItem
                  icon={MapPin}
                  label="地理位置"
                  value={mentor.location}
                />
                
                {/* 性别 */}
                {mentor.gender && (
                  <InfoItem
                    icon={UserCheck}
                    label="性别"
                    value={mentor.gender}
                  />
                )}
                
                {/* 联系方式 */}
                {mentor.contact && (
                  <InfoItem
                    icon={Phone}
                    label="联系方式"
                    value={mentor.contact}
                  />
                )}
                
                {/* 邮箱 */}
                {mentor.email && (
                  <InfoItem
                    icon={Mail}
                    label="邮箱"
                    value={mentor.email}
                  />
                )}
              </div>
            </div>

            {/* 服务范围卡片 */}
            {mentor.serviceScope.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  服务范围
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.serviceScope.map((scope, index) => (
                    <Tag
                      key={index}
                      text={scope}
                      color="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 时间信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                时间信息
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">创建时间</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(mentor.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">更新时间</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(mentor.updatedAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧栏 - 专业信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 个人简介卡片 */}
            {mentor.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  个人简介
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {mentor.bio}
                </p>
              </div>
            )}

            {/* 专业方向卡片 */}
            {mentor.specializations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  专业方向
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mentor.specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 专业能力卡片 */}
            {(mentor.expertiseLevel || mentor.hourlyRate) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  专业能力
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentor.expertiseLevel && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">专业级别</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {mentor.expertiseLevel}
                      </p>
                    </div>
                  )}
                  
                  {mentor.hourlyRate && (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">时薪</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">
                        ¥{mentor.hourlyRate}/小时
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 员工关联信息 */}
            {mentor.employeeId && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      员工关联信息
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      该导师同时也是公司员工，部分信息与员工档案自动同步
                    </p>
                    <button
                      onClick={() => navigate(`/admin/employees/${mentor.employeeId}`)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      查看员工档案
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;

