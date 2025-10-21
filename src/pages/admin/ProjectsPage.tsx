import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, CalendarClock, DollarSign, Users, Star, BadgeCheck } from 'lucide-react';

interface ProjectsPageProps {
  setCurrentPage?: (page: string) => void;
}

// 服务项目类型定义
interface ServiceProject {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'inactive' | 'coming_soon';
  price: number;
  duration: string;
  clients: number;
  rating: number;
  featured: boolean;
  imageSrc: string;
}

function ProjectsPage({ setCurrentPage }: ProjectsPageProps) {
  const [activeTab, setActiveTab] = useState('全部项目');
  const [selectedCategory, setSelectedCategory] = useState('全部类别');
  
  // 模拟服务项目数据
  const serviceProjects: ServiceProject[] = [
    {
      id: '1',
      name: '本科申请全程指导',
      category: '留学申请',
      description: '针对本科留学申请者提供从选校、文书、申请到录取全流程的专业指导服务',
      status: 'active',
      price: 99800,
      duration: '10-12个月',
      clients: 856,
      rating: 4.9,
      featured: true,
      imageSrc: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: '硕士申请精英计划',
      category: '留学申请',
      description: '为硕士申请者提供个性化申请方案，提高顶尖名校录取率',
      status: 'active',
      price: 128000,
      duration: '8-10个月',
      clients: 623,
      rating: 4.8,
      featured: true,
      imageSrc: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: '博士申请咨询',
      category: '留学申请',
      description: '针对博士申请者提供科研背景提升、导师匹配、申请材料优化等服务',
      status: 'active',
      price: 150000,
      duration: '6-12个月',
      clients: 187,
      rating: 4.7,
      featured: false,
      imageSrc: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      name: '美国高中申请项目',
      category: '留学申请',
      description: '为计划前往美国高中就读的学生提供全方位申请服务',
      status: 'active',
      price: 88000,
      duration: '6-8个月',
      clients: 342,
      rating: 4.6,
      featured: false,
      imageSrc: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      name: '英语能力提升课程',
      category: '语言培训',
      description: '针对留学考试如托福、雅思、GRE等的专业培训课程',
      status: 'active',
      price: 15800,
      duration: '3-6个月',
      clients: 1243,
      rating: 4.5,
      featured: false,
      imageSrc: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      name: '学术背景提升项目',
      category: '背景提升',
      description: '提供科研项目对接、论文发表指导、实习机会等学术背景提升服务',
      status: 'active',
      price: 68000,
      duration: '3-12个月',
      clients: 478,
      rating: 4.7,
      featured: true,
      imageSrc: 'https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '7',
      name: '海外实习项目',
      category: '背景提升',
      description: '提供海外知名企业实习机会，增强留学申请竞争力',
      status: 'active',
      price: 45000,
      duration: '1-3个月',
      clients: 326,
      rating: 4.6,
      featured: false,
      imageSrc: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '8',
      name: '留学后就业指导',
      category: '就业服务',
      description: '针对海外留学生提供回国或海外就业规划与指导',
      status: 'active',
      price: 35000,
      duration: '3-6个月',
      clients: 215,
      rating: 4.4,
      featured: false,
      imageSrc: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '9',
      name: 'AI驱动的个性化学习计划',
      category: '创新服务',
      description: '使用最新AI技术为学生制定个性化学习计划并提供实时辅导',
      status: 'coming_soon',
      price: 25800,
      duration: '按需定制',
      clients: 0,
      rating: 0,
      featured: true,
      imageSrc: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
  ];
  
  // 所有项目分类
  const categories = ['全部类别', '留学申请', '语言培训', '背景提升', '就业服务', '创新服务'];
  
  // 基于activeTab筛选项目
  const filteredProjects = serviceProjects.filter(project => {
    if (activeTab === '全部项目') return true;
    if (activeTab === '精选项目') return project.featured;
    if (activeTab === '热门项目') return project.clients > 500;
    if (activeTab === '新上线') return project.status === 'coming_soon';
    return true;
  }).filter(project => {
    if (selectedCategory === '全部类别') return true;
    return project.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">服务项目管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索项目..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="relative">
            <button className="bg-gray-100 hover:bg-gray-200 pl-4 pr-10 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 flex items-center">
              {selectedCategory}
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {/* 这里可以添加下拉菜单 */}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            添加项目
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '总项目数', value: '9', icon: DollarSign, color: 'blue' },
          { title: '活跃项目', value: '8', icon: CheckCircle2, color: 'green' },
          { title: '总服务人数', value: '4,270', icon: Users, color: 'yellow' },
          { title: '平均评分', value: '4.7', icon: Star, color: 'purple' },
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

      {/* 项目选项卡 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部项目', '精选项目', '热门项目', '新上线'].map((tab) => (
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
          </div>
        </div>

        {/* 项目网格 */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="h-48 relative">
                <img 
                  src={project.imageSrc} 
                  alt={project.name} 
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    精选项目
                  </div>
                )}
                {project.status === 'coming_soon' && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      即将上线
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <button className="p-1.5 bg-white/90 rounded-lg hover:bg-white text-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium mb-2 dark:bg-blue-900/20 dark:text-blue-400">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-lg dark:text-white">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded dark:bg-yellow-900/20">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                      {project.rating > 0 ? project.rating : '暂无'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{project.clients} 人</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    ¥{project.price.toLocaleString()}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 {filteredProjects.length} 条，共 {serviceProjects.length} 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, '...', 5].map((page, index) => (
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

export default ProjectsPage; 