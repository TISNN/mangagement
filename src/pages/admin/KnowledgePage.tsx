import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, FileText, Book, Video, Clock, Download, BookOpen, Bookmark, MoreVertical, Users, ArrowUpRight, FileCheck, FileUp, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KnowledgePageProps {
  setCurrentPage?: (page: string) => void;
}

// 知识资源类型定义
interface KnowledgeResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'article' | 'template';
  category: string;
  description: string;
  fileSize?: string;
  lastUpdated: string;
  author: string;
  views: number;
  downloads: number;
  tags: string[];
  isFeatured: boolean;
  isBookmarked: boolean;
  thumbnailUrl?: string;
  fileUrl?: string;
}

function KnowledgePage({ setCurrentPage }: KnowledgePageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部资源');
  const [selectedCategory, setSelectedCategory] = useState('全部分类');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('全部');
  
  // 模拟知识库资源数据
  const resources: KnowledgeResource[] = [
    {
      id: 'K001',
      title: '美国大学申请流程指南',
      type: 'document',
      category: '申请指南',
      description: '详细介绍美国大学本科和研究生申请的完整流程、材料准备和时间规划',
      fileSize: '5.2MB',
      lastUpdated: '2023-06-10',
      author: '张老师',
      views: 1258,
      downloads: 456,
      tags: ['美国', '申请流程', '本科申请', '研究生申请'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1588979355313-6711a095465f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/us-application-guide.pdf'
    },
    {
      id: 'K002',
      title: '英国名校文书写作技巧',
      type: 'document',
      category: '文书指导',
      description: '针对英国G5高校申请的文书写作要点、案例分析和常见错误避免',
      fileSize: '3.8MB',
      lastUpdated: '2023-05-28',
      author: '李老师',
      views: 987,
      downloads: 342,
      tags: ['英国', '文书写作', 'G5高校', 'PS'],
      isFeatured: true,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/uk-essay-guide.pdf'
    },
    {
      id: 'K003',
      title: '如何准备托福考试',
      type: 'video',
      category: '语言考试',
      description: '托福考试各部分备考策略、常见题型分析和高分技巧',
      lastUpdated: '2023-06-05',
      author: '王老师',
      views: 2154,
      downloads: 0,
      tags: ['托福', 'TOEFL', '语言考试', '备考策略'],
      isFeatured: false,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K004',
      title: '学术简历模板与范例',
      type: 'template',
      category: '申请材料',
      description: '适用于研究生申请的学术简历模板，包含多个不同学科的成功范例',
      fileSize: '1.2MB',
      lastUpdated: '2023-04-18',
      author: '陈老师',
      views: 1876,
      downloads: 768,
      tags: ['简历', '申请材料', '研究生申请', '模板'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/academic-cv-template.docx'
    },
    {
      id: 'K005',
      title: '澳大利亚留学生活指南',
      type: 'article',
      category: '留学生活',
      description: '澳大利亚主要城市的生活环境、住宿选择、交通出行和文化适应建议',
      lastUpdated: '2023-06-12',
      author: '林老师',
      views: 965,
      downloads: 124,
      tags: ['澳大利亚', '留学生活', '住宿', '文化适应'],
      isFeatured: false,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K006',
      title: 'GRE考试备考全攻略',
      type: 'video',
      category: '语言考试',
      description: 'GRE考试各部分详解、重点单词记忆方法和高效备考计划',
      lastUpdated: '2023-05-15',
      author: '赵老师',
      views: 1756,
      downloads: 0,
      tags: ['GRE', '语言考试', '备考攻略', '词汇'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K007',
      title: '加拿大留学签证办理指南',
      type: 'document',
      category: '签证事务',
      description: '加拿大学习许可和签证申请流程、材料准备和注意事项',
      fileSize: '2.8MB',
      lastUpdated: '2023-06-02',
      author: '黄老师',
      views: 1243,
      downloads: 432,
      tags: ['加拿大', '签证', '学习许可', '材料准备'],
      isFeatured: false,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/canada-visa-guide.pdf'
    },
    {
      id: 'K008',
      title: '国际学生奖学金申请技巧',
      type: 'article',
      category: '奖学金',
      description: '国际学生可申请的主要奖学金种类、申请条件和成功经验分享',
      lastUpdated: '2023-05-20',
      author: '刘老师',
      views: 1654,
      downloads: 287,
      tags: ['奖学金', '资金规划', '申请技巧'],
      isFeatured: false,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K009',
      title: '美国大学面试准备与常见问题',
      type: 'video',
      category: '面试准备',
      description: '美国大学和研究生项目面试的准备策略、礼仪要点和模拟面试演示',
      lastUpdated: '2023-06-08',
      author: '孙老师',
      views: 1432,
      downloads: 0,
      tags: ['面试', '美国大学', '沟通技巧'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    // 新增的示例资源
    {
      id: 'K010',
      title: '日本留学申请全指南',
      type: 'document',
      category: '申请指南',
      description: '日本大学申请流程、语言要求、奖学金机会及文化适应指南',
      fileSize: '4.5MB',
      lastUpdated: '2023-06-15',
      author: '郑老师',
      views: 876,
      downloads: 321,
      tags: ['日本', '留学申请', '语言要求', '文化适应'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/japan-study-guide.pdf'
    },
    {
      id: 'K011',
      title: '研究生推荐信写作指南',
      type: 'document',
      category: '文书指导',
      description: '如何撰写有效的研究生申请推荐信，包含模板和实例分析',
      fileSize: '2.1MB',
      lastUpdated: '2023-05-25',
      author: '李老师',
      views: 1432,
      downloads: 567,
      tags: ['推荐信', '文书', '研究生申请'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/recommendation-letter-guide.pdf'
    },
    {
      id: 'K012',
      title: 'IELTS备考冲刺班视频课程',
      type: 'video',
      category: '语言考试',
      description: '为期8周的IELTS考试强化备考课程，覆盖听说读写全部技巧',
      lastUpdated: '2023-07-01',
      author: '马老师',
      views: 3245,
      downloads: 0,
      tags: ['IELTS', '备考', '听说读写', '考试技巧'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K013',
      title: '留学生心理健康指南',
      type: 'article',
      category: '留学生活',
      description: '海外留学生如何应对文化冲击、思乡情绪和学业压力的心理调适方法',
      lastUpdated: '2023-06-28',
      author: '周心理师',
      views: 2187,
      downloads: 532,
      tags: ['心理健康', '压力管理', '文化冲击', '适应策略'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K014',
      title: '欧洲艺术类院校申请作品集准备',
      type: 'document',
      category: '申请材料',
      description: '欧洲顶尖艺术院校申请作品集的准备要点、评分标准和案例分析',
      fileSize: '8.7MB',
      lastUpdated: '2023-06-18',
      author: '吴老师',
      views: 1876,
      downloads: 743,
      tags: ['艺术留学', '作品集', '欧洲', '创意设计'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/art-portfolio-guide.pdf'
    },
    {
      id: 'K015',
      title: '留学行前准备清单模板',
      type: 'template',
      category: '留学生活',
      description: '留学出发前的准备清单，包括行李打包、文件准备、住宿安排等全方位指南',
      fileSize: '1.5MB',
      lastUpdated: '2023-07-05',
      author: '系统管理员',
      views: 3421,
      downloads: 1543,
      tags: ['行前准备', '清单', '行李', '住宿'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/pre-departure-checklist.xlsx'
    },
    {
      id: 'K016',
      title: '美国名校校友访谈视频集',
      type: 'video',
      category: '案例分析',
      description: '哈佛、斯坦福、麻省理工等名校校友分享申请经验和校园生活',
      lastUpdated: '2023-07-10',
      author: '王老师',
      views: 2765,
      downloads: 0,
      tags: ['名校', '校友访谈', '申请经验', '校园生活'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K017',
      title: '留学生全球银行账户开设指南',
      type: 'document',
      category: '留学生活',
      description: '主要留学国家银行账户的开设流程、所需材料和跨境汇款攻略',
      fileSize: '3.2MB',
      lastUpdated: '2023-06-25',
      author: '张老师',
      views: 1854,
      downloads: 687,
      tags: ['银行账户', '金融', '汇款', '生活安排'],
      isFeatured: false,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/banking-guide.pdf'
    },
    {
      id: 'K018',
      title: '留学生学术诚信与论文写作规范',
      type: 'article',
      category: '学术指导',
      description: '海外大学学术诚信要求、抄袭的界定、引用规范及论文格式指南',
      lastUpdated: '2023-07-08',
      author: '陈教授',
      views: 2134,
      downloads: 876,
      tags: ['学术诚信', '论文写作', '引用规范', '抄袭避免'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'K019',
      title: 'PhD申请与研究计划书撰写',
      type: 'document',
      category: '申请指南',
      description: '博士申请全流程指南及高质量研究计划书的结构和写作技巧',
      fileSize: '4.8MB',
      lastUpdated: '2023-06-20',
      author: '林教授',
      views: 1765,
      downloads: 654,
      tags: ['PhD', '博士申请', '研究计划', '学术研究'],
      isFeatured: true,
      isBookmarked: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/phd-application-guide.pdf'
    },
    {
      id: 'K020',
      title: '海外实习求职简历与面试准备',
      type: 'template',
      category: '就业指导',
      description: '国际学生海外求职简历模板、面试技巧及实习机会搜索指南',
      fileSize: '2.6MB',
      lastUpdated: '2023-07-12',
      author: '赵老师',
      views: 3256,
      downloads: 1243,
      tags: ['实习', '求职', '简历', '面试'],
      isFeatured: false,
      isBookmarked: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      fileUrl: '/files/internship-guide.docx'
    }
  ];
  
  // 可选的资源分类
  const categories = ['全部分类', '申请指南', '文书指导', '语言考试', '申请材料', '留学生活', '签证事务', '奖学金', '面试准备', '案例分析', '学术指导', '就业指导'];
  
  // 可选的资源类型
  const resourceTypes = ['全部类型', '文档', '视频', '文章', '模板'];
  
  // 基于activeTab和selectedCategory筛选资源
  const filteredResources = resources.filter(resource => {
    if (activeTab === '全部资源') return true;
    if (activeTab === '精选资源') return resource.isFeatured;
    if (activeTab === '已收藏') return resource.isBookmarked;
    if (activeTab === '最近更新') {
      // 获取最近30天的资源
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(resource.lastUpdated) >= thirtyDaysAgo;
    }
    return true;
  }).filter(resource => {
    if (selectedCategory === '全部分类') return true;
    return resource.category === selectedCategory;
  });
  
  // 资源类型图标映射
  const resourceTypeIconMap: Record<string, any> = {
    document: FileText,
    video: Video,
    article: Book,
    template: FileCheck
  };
  
  // 资源类型中文名称映射
  const resourceTypeNameMap: Record<string, string> = {
    document: '文档',
    video: '视频',
    article: '文章',
    template: '模板'
  };

  // 统计数据
  const totalResources = resources.length;
  const featuredResources = resources.filter(item => item.isFeatured).length;
  const bookmarkedResources = resources.filter(item => item.isBookmarked).length;
  const recentlyUpdated = resources.filter(item => 
    new Date(item.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  // 类别和类型列表
  const resourceCategories = ['全部', ...new Set(resources.map(item => item.category))];
  const resourceTypesList = ['全部', '文档', '视频', '文章', '模板'];
  
  // 过滤资源
  const filteredResourcesBySearch = resources.filter(resource => {
    // 搜索词过滤
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 类别过滤
    const matchesCategory = selectedCategory === '全部分类' || resource.category === selectedCategory;
    
    // 类型过滤
    const typeMap: Record<string, string> = {
      '文档': 'document',
      '视频': 'video',
      '文章': 'article',
      '模板': 'template'
    };
    const matchesType = selectedType === '全部' || resource.type === typeMap[selectedType];
    
    // 标签页过滤
    let matchesTab = true;
    if (activeTab === '精选资源') matchesTab = resource.isFeatured;
    if (activeTab === '已收藏') matchesTab = resource.isBookmarked;
    if (activeTab === '最近更新') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesTab = new Date(resource.lastUpdated) >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">知识库</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索资源..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            上传资源
          </button>
        </div>
      </div>

      {/* 筛选器面板 - 条件显示 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl dark:bg-gray-800">
          <h3 className="font-medium mb-4 dark:text-white">筛选条件</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">资源分类</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">资源类型</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                {resourceTypesList.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">上传者</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部上传者</option>
                <option value="张老师">张老师</option>
                <option value="李老师">李老师</option>
                <option value="王老师">王老师</option>
                <option value="陈老师">陈老师</option>
                <option value="林老师">林老师</option>
                <option value="赵老师">赵老师</option>
                <option value="黄老师">黄老师</option>
                <option value="刘老师">刘老师</option>
                <option value="孙老师">孙老师</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">标签</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部标签</option>
                <option value="美国">美国</option>
                <option value="英国">英国</option>
                <option value="澳大利亚">澳大利亚</option>
                <option value="加拿大">加拿大</option>
                <option value="申请流程">申请流程</option>
                <option value="文书写作">文书写作</option>
                <option value="托福">托福</option>
                <option value="GRE">GRE</option>
                <option value="签证">签证</option>
                <option value="奖学金">奖学金</option>
                <option value="面试">面试</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">更新时间</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部时间</option>
                <option value="7">最近7天</option>
                <option value="30">最近30天</option>
                <option value="90">最近3个月</option>
                <option value="180">最近6个月</option>
                <option value="365">最近1年</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">排序方式</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="date_desc">最新上传</option>
                <option value="date_asc">最早上传</option>
                <option value="views_desc">浏览量高</option>
                <option value="downloads_desc">下载量高</option>
                <option value="name_asc">名称 A-Z</option>
                <option value="name_desc">名称 Z-A</option>
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
          { title: '总资源数', value: totalResources, icon: BookOpen, color: 'blue' },
          { title: '文档数量', value: resources.filter(r => r.type === 'document').length, icon: FileText, color: 'green' },
          { title: '视频数量', value: resources.filter(r => r.type === 'video').length, icon: Video, color: 'yellow' },
          { title: '总下载量', value: resources.reduce((sum, r) => sum + r.downloads, 0), icon: Download, color: 'purple' },
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

      {/* 资源选项卡 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部资源', '精选资源', '已收藏', '最近更新'].map((tab) => (
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
              <span className="text-sm text-gray-500 dark:text-gray-400">分类:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {resourceCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 资源网格 */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResourcesBySearch.map((resource) => {
            const ResourceTypeIcon = resourceTypeIconMap[resource.type];
            return (
              <div key={resource.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                {resource.thumbnailUrl && (
                  <div className="h-40 relative">
                    <img 
                      src={resource.thumbnailUrl} 
                      alt={resource.title} 
                      className="w-full h-full object-cover"
                    />
                    {resource.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Video className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    )}
                    {resource.isFeatured && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-medium">
                        精选资源
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        resource.type === 'document' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        resource.type === 'video' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        resource.type === 'article' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                        <ResourceTypeIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {resourceTypeNameMap[resource.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="收藏">
                        <Bookmark className={`h-4 w-4 ${resource.isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400" title="分享">
                        <Share className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="更多选项">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 
                    className="font-bold text-lg mb-1 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => navigate(`/admin/knowledge/detail/${resource.id}`)}
                  >
                    {resource.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium dark:bg-blue-900/20 dark:text-blue-400">
                      {resource.category}
                    </span>
                    {resource.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">+{resource.tags.length - 2}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 dark:text-gray-400">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{resource.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{resource.views} 次浏览</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{resource.downloads} 次下载</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.author}
                    </div>
                    {resource.fileUrl ? (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        下载
                      </button>
                    ) : (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        查看
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 分页 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 {filteredResourcesBySearch.length} 条，共 {totalResources} 条
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

      {/* 上传资源入口 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 flex items-center justify-between">
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">贡献你的知识资源</h3>
          <p className="text-blue-100 max-w-2xl">上传资料、文档或视频分享给其他用户，帮助更多学生获取留学相关的知识和指导。</p>
        </div>
        <button className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          上传新资源
        </button>
      </div>
    </div>
  );
}

export default KnowledgePage; 