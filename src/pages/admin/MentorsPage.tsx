import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Mail, Phone, MoreVertical, Users, Star, BookOpenCheck, UserCheck, GraduationCap, MapPin, School, Languages, Award, UserSquare2, Globe, Calendar } from 'lucide-react';

interface MentorsPageProps {
  setCurrentPage?: (page: string) => void;
}

// 导师类型定义
interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  education: string;
  university: string;
  specialization: string;
  languages: string[];
  location: string;
  experience: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'vacation';
  subjects: string[];
  studentCount: number;
  successRate: number;
  bio: string;
}

function MentorsPage({ setCurrentPage }: MentorsPageProps) {
  const [activeTab, setActiveTab] = useState('全部导师');
  const [selectedSpecialization, setSelectedSpecialization] = useState('全部领域');
  const [showFilters, setShowFilters] = useState(false);
  
  // 模拟导师数据
  const mentors: Mentor[] = [
    {
      id: 'M001',
      name: '张教授',
      email: 'zhang.prof@example.com',
      phone: '13812345678',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '高级留学顾问',
      education: '博士',
      university: '哈佛大学',
      specialization: '商科申请',
      languages: ['中文', '英语'],
      location: '北京',
      experience: 8,
      rating: 4.9,
      reviewCount: 156,
      status: 'active',
      subjects: ['MBA申请', 'GMAT备考', '商业文书'],
      studentCount: 278,
      successRate: 95,
      bio: '拥有丰富的美国商学院申请经验，帮助学生成功申请哈佛、斯坦福、沃顿等顶级商学院'
    },
    {
      id: 'M002',
      name: '李博士',
      email: 'li.phd@example.com',
      phone: '13987654321',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '理工科专家',
      education: '博士',
      university: '麻省理工学院',
      specialization: '工程与计算机科学',
      languages: ['中文', '英语'],
      location: '上海',
      experience: 6,
      rating: 4.8,
      reviewCount: 124,
      status: 'active',
      subjects: ['计算机科学', '电子工程', '人工智能'],
      studentCount: 213,
      successRate: 92,
      bio: '麻省理工学院计算机科学博士，专注于帮助学生申请美国顶尖理工科院校'
    },
    {
      id: 'M003',
      name: '王顾问',
      email: 'wang.advisor@example.com',
      phone: '13765432198',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '艺术留学顾问',
      education: '硕士',
      university: '伦敦艺术大学',
      specialization: '艺术与设计',
      languages: ['中文', '英语'],
      location: '北京',
      experience: 5,
      rating: 4.7,
      reviewCount: 98,
      status: 'vacation',
      subjects: ['平面设计', '服装设计', '艺术作品集'],
      studentCount: 156,
      successRate: 89,
      bio: '伦敦艺术大学毕业，擅长艺术类作品集指导和申请规划，帮助学生进入全球顶尖艺术学院'
    },
    {
      id: 'M004',
      name: '陈教授',
      email: 'chen.prof@example.com',
      phone: '13678901234',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '文科专家',
      education: '博士',
      university: '牛津大学',
      specialization: '人文与社会科学',
      languages: ['中文', '英语', '法语'],
      location: '广州',
      experience: 10,
      rating: 4.9,
      reviewCount: 187,
      status: 'active',
      subjects: ['文学', '历史', '哲学', '社会学'],
      studentCount: 301,
      successRate: 94,
      bio: '牛津大学哲学博士，专注于人文社科领域申请，对英国G5院校和美国藤校申请有丰富经验'
    },
    {
      id: 'M005',
      name: '刘顾问',
      email: 'liu.advisor@example.com',
      phone: '13567890123',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '医学专业顾问',
      education: '硕士',
      university: '约翰霍普金斯大学',
      specialization: '医学与健康科学',
      languages: ['中文', '英语'],
      location: '上海',
      experience: 7,
      rating: 4.6,
      reviewCount: 112,
      status: 'active',
      subjects: ['医学', '生物医学', '公共卫生'],
      studentCount: 189,
      successRate: 91,
      bio: '医学背景出身，擅长医学类专业申请指导，熟悉美国、英国和澳大利亚的医学院申请要求'
    },
    {
      id: 'M006',
      name: '林教授',
      email: 'lin.prof@example.com',
      phone: '13456789012',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '高级理科导师',
      education: '博士',
      university: '剑桥大学',
      specialization: '自然科学',
      languages: ['中文', '英语'],
      location: '深圳',
      experience: 9,
      rating: 4.8,
      reviewCount: 143,
      status: 'inactive',
      subjects: ['物理', '化学', '数学'],
      studentCount: 245,
      successRate: 93,
      bio: '剑桥大学物理学博士，专注于理科类专业申请，对英美顶尖大学的科学类专业申请有深入研究'
    },
    {
      id: 'M007',
      name: '赵顾问',
      email: 'zhao.advisor@example.com',
      phone: '13345678901',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '初高中规划师',
      education: '硕士',
      university: '哥伦比亚大学',
      specialization: '中学申请',
      languages: ['中文', '英语'],
      location: '北京',
      experience: 5,
      rating: 4.7,
      reviewCount: 97,
      status: 'active',
      subjects: ['国际学校申请', 'SAT备考', 'AP课程'],
      studentCount: 176,
      successRate: 90,
      bio: '专注于美国、英国、加拿大等国家的高中申请，擅长学生综合素质培养和标化考试提升'
    },
    {
      id: 'M008',
      name: '钱博士',
      email: 'qian.phd@example.com',
      phone: '13234567890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      title: '金融专家',
      education: '博士',
      university: '伦敦政治经济学院',
      specialization: '金融与经济',
      languages: ['中文', '英语', '德语'],
      location: '上海',
      experience: 8,
      rating: 4.8,
      reviewCount: 132,
      status: 'active',
      subjects: ['金融', '经济学', '会计学'],
      studentCount: 223,
      successRate: 93,
      bio: 'LSE金融博士，在投行有多年工作经验，专注于金融经济类专业申请，尤其擅长英国G5和美国TOP30商学院申请'
    },
  ];
  
  // 可选的专业领域
  const specializations = ['全部领域', '商科申请', '工程与计算机科学', '艺术与设计', '人文与社会科学', '医学与健康科学', '自然科学', '中学申请', '金融与经济'];
  
  // 基于activeTab筛选导师
  const filteredMentors = mentors.filter(mentor => {
    if (activeTab === '全部导师') return true;
    if (activeTab === '精英导师') return mentor.rating >= 4.8;
    if (activeTab === '热门导师') return mentor.studentCount > 200;
    if (activeTab === '在职导师') return mentor.status === 'active';
    return true;
  }).filter(mentor => {
    if (selectedSpecialization === '全部领域') return true;
    return mentor.specialization === selectedSpecialization;
  });
  
  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    active: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    vacation: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
  };
  
  // 状态中文名称映射
  const statusNameMap: Record<string, string> = {
    active: '在职',
    inactive: '休假',
    vacation: '临时离开'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">导师库</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索导师..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            添加导师
          </button>
        </div>
      </div>

      {/* 筛选器面板 - 条件显示 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl dark:bg-gray-800">
          <h3 className="font-medium mb-4 dark:text-white">筛选条件</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">专业领域</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">学历</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部学历</option>
                <option value="博士">博士</option>
                <option value="硕士">硕士</option>
                <option value="学士">学士</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">所在地区</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部地区</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广州">广州</option>
                <option value="深圳">深圳</option>
                <option value="杭州">杭州</option>
                <option value="南京">南京</option>
                <option value="武汉">武汉</option>
                <option value="成都">成都</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">最低评分</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="0">不限</option>
                <option value="4.5">4.5星及以上</option>
                <option value="4.7">4.7星及以上</option>
                <option value="4.8">4.8星及以上</option>
                <option value="4.9">4.9星及以上</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">工作年限</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="0">不限</option>
                <option value="3">3年以上</option>
                <option value="5">5年以上</option>
                <option value="8">8年以上</option>
                <option value="10">10年以上</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">状态</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部状态</option>
                <option value="active">在职</option>
                <option value="inactive">休假</option>
                <option value="vacation">临时离开</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
              重置筛选
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
              应用筛选
            </button>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '总导师数', value: mentors.length, icon: UserSquare2, color: 'blue' },
          { title: '在职导师', value: mentors.filter(mentor => mentor.status === 'active').length, icon: UserCheck, color: 'green' },
          { title: '平均评分', value: '4.8', icon: Star, color: 'yellow' },
          { title: '服务学生', value: mentors.reduce((sum, mentor) => sum + mentor.studentCount, 0), icon: Users, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 导师表格 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部导师', '精英导师', '热门导师', '在职导师'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">专业领域:</span>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">导师信息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">专业领域</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">教育背景</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">评分</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">服务学生</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentors.map((mentor) => (
              <tr key={mentor.id} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{mentor.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {mentor.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {mentor.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    {mentor.specialization}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {mentor.education}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <School className="h-3 w-3" />
                      {mentor.university}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
                      {mentor.rating}
                    </span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({mentor.reviewCount})
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {mentor.studentCount}人
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Award className="h-3 w-3" />
                    成功率 {mentor.successRate}%
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[mentor.status]}`}>
                    {statusNameMap[mentor.status]}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="查看详情">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 {filteredMentors.length} 条，共 {mentors.length} 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, '...', 4].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-xl text-sm ${
                    page === 1
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorsPage; 