import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

// 实习岗位类型定义
interface InternshipPosition {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // 全职/实习
  duration: string; // 实习时长
  requirements: string[];
  description: string;
  salary: string;
  postedDate: string;
  deadline: string;
}

// 学屿内推类型定义
interface ReferralPosition {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  requirements: string[];
  description: string;
  salary: string;
  postedDate: string;
  deadline: string;
  referralContact: string; // 内推联系人
  referralProcess: string; // 内推流程
}

const InternshipPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"internships" | "referrals">("internships");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    companies: [] as string[],
    industries: [] as string[],
    positions: [] as string[]
  });
  const navigate = useNavigate();

  // 模拟数据 - 实际项目中应该从API获取
  const internshipPositions: InternshipPosition[] = [
    {
      id: "1",
      title: "软件工程师实习生",
      company: "Google",
      location: "上海",
      type: "实习",
      duration: "3-6个月",
      requirements: ["计算机科学相关专业", "熟悉React/TypeScript", "良好的英语能力"],
      description: "参与Google核心产品的开发工作，与全球团队协作...",
      salary: "25-35k/月",
      postedDate: "2024-03-17",
      deadline: "2024-04-17"
    },
    {
      id: "2",
      title: "产品经理实习生",
      company: "字节跳动",
      location: "北京",
      type: "实习",
      duration: "3-6个月",
      requirements: ["产品设计相关专业", "良好的沟通能力", "数据分析能力"],
      description: "参与字节跳动核心产品的产品设计和优化工作...",
      salary: "20-30k/月",
      postedDate: "2024-03-17",
      deadline: "2024-04-17"
    }
  ];

  const referralPositions: ReferralPosition[] = [
    {
      id: "1",
      title: "ESG咨询",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["理工科、金融、财会、经济、会计、法律、管理、计算机等相关专业"],
      description: "参与阿里巴巴集团ESG咨询相关工作，提供专业的咨询服务...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "2",
      title: "UI设计师",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["产品设计、UI设计、交互、软件工程、计算机、用户体验等相关专业"],
      description: "参与阿里巴巴产品的UI设计工作，负责用户界面视觉设计...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "3",
      title: "产品规划开发",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["计算机相关专业、信息与通信工程等相关专业"],
      description: "参与阿里巴巴产品的规划和开发工作，从需求分析到功能实现...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "4",
      title: "产品内容运营",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["市场营销类、运营管理、营销策划、营销管理、广告类、计算机、新闻传媒类、设计类"],
      description: "参与阿里巴巴产品的内容运营工作，负责内容策划、发布和推广...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "5",
      title: "公关传播",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["公关、广告、新闻、汉语言、管理营销、社会学、传播学等相关专业"],
      description: "参与阿里巴巴的公关传播工作，负责品牌宣传、媒体关系维护...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "6",
      title: "活动运营",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["数据分析、营销管理、传播、统计、营销策划、传媒、视觉传达、市场营销、广告策划"],
      description: "参与阿里巴巴的活动运营工作，负责活动策划、执行和效果评估...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "7",
      title: "机器学习实习生",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州/广州",
      type: "实习",
      duration: "3个月及以上",
      requirements: ["计算机图形学、模式识别、机器学习、计算机、统计学相关专业"],
      description: "参与阿里巴巴的机器学习相关项目，进行算法研究和模型开发...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "8",
      title: "人工智能算法研究实习生",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州/广州",
      type: "实习",
      duration: "3个月及以上",
      requirements: ["计算机、人工智能、模式识别、机器学习、通信工程、网络工程等相关专业等相关专业"],
      description: "参与阿里巴巴的人工智能算法研究工作，进行前沿技术探索...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "9",
      title: "商务合作",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["商业管理、市场营销、金融、数据分析与商业智能等相关专业"],
      description: "参与阿里巴巴的商务合作工作，负责合作伙伴拓展和关系维护...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    },
    {
      id: "10",
      title: "市场品牌",
      company: "阿里巴巴集团阿里云",
      location: "北京/杭州",
      type: "实习",
      duration: "1-3个月",
      requirements: ["市场营销类、新闻传媒类等相关专业"],
      description: "参与阿里巴巴的市场品牌工作，负责品牌策略制定和执行...",
      salary: "实习薪资",
      postedDate: "2024-05-01",
      deadline: "2024-06-30",
      referralContact: "学屿导师",
      referralProcess: "1. 提交简历 2. 学屿内部筛选 3. 内推至阿里巴巴 4. 面试安排"
    }
  ];

  // 提取所有可用的筛选选项
  const companies = Array.from(new Set([
    ...internshipPositions.map(p => p.company),
    ...referralPositions.map(p => p.company)
  ]));

  const industries = [
    "互联网",
    "人工智能",
    "云计算",
    "金融科技",
    "电子商务",
    "教育科技",
    "企业服务"
  ];

  const positions = [
    "软件开发",
    "产品经理",
    "数据分析",
    "UI设计",
    "运营",
    "市场营销",
    "人工智能",
    "算法研究"
  ];

  // 过滤函数
  const filterPositions = (positions: (InternshipPosition | ReferralPosition)[], query: string) => {
    let filtered = positions;

    // 文本搜索
    if (query) {
      filtered = filtered.filter(position => 
        position.title.toLowerCase().includes(query.toLowerCase()) ||
        position.company.toLowerCase().includes(query.toLowerCase()) ||
        position.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 应用筛选器
    if (filters.companies.length > 0) {
      filtered = filtered.filter(position => filters.companies.includes(position.company));
    }

    if (filters.positions.length > 0) {
      filtered = filtered.filter(position => 
        filters.positions.some(p => position.title.includes(p))
      );
    }

    return filtered;
  };

  // 处理筛选器变化
  const handleFilterChange = (type: 'companies' | 'industries' | 'positions', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const currentPositions = activeTab === "internships" ? internshipPositions : referralPositions;

  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">实习库</h1>
          <p className="text-gray-500 dark:text-gray-400">浏览实习和内推机会</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索职位、公司或地点..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className={`p-2 rounded-lg ${
              showFilters 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold dark:text-white">筛选条件</h3>
            <button
              onClick={() => {
                setFilters({ companies: [], industries: [], positions: [] });
                setShowFilters(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除筛选
            </button>
          </div>
          
          {/* 公司筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">公司</h4>
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <button
                  key={company}
                  onClick={() => handleFilterChange('companies', company)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.companies.includes(company)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* 行业筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">行业</h4>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleFilterChange('industries', industry)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.industries.includes(industry)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* 岗位类型筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">岗位类型</h4>
            <div className="flex flex-wrap gap-2">
              {positions.map((position) => (
                <button
                  key={position}
                  onClick={() => handleFilterChange('positions', position)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.positions.includes(position)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          {/* 已选筛选条件 */}
          {(filters.companies.length > 0 || filters.industries.length > 0 || filters.positions.length > 0) && (
            <div>
              <h4 className="text-sm font-medium mb-3 dark:text-white">已选条件</h4>
              <div className="flex flex-wrap gap-2">
                {filters.companies.map((company) => (
                  <span
                    key={company}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {company}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('companies', company)}
                    />
                  </span>
                ))}
                {filters.industries.map((industry) => (
                  <span
                    key={industry}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {industry}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('industries', industry)}
                    />
                  </span>
                ))}
                {filters.positions.map((position) => (
                  <span
                    key={position}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {position}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('positions', position)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 岗位概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '实习岗位',
            value: internshipPositions.length.toString(),
            icon: Briefcase,
            color: 'blue'
          },
          {
            title: '内推岗位',
            value: referralPositions.length.toString(),
            icon: Building2,
            color: 'purple'
          },
          {
            title: '即将截止',
            value: '3',
            icon: Calendar,
            color: 'red'
          },
          {
            title: '已投递',
            value: '0',
            icon: CheckCircle,
            color: 'green'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 岗位列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">岗位列表</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('internships')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'internships' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              实习岗位
            </button>
            <button 
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'referrals' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              内推岗位
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {filterPositions(currentPositions, searchQuery).map((position, index) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 ${
                  activeTab === 'internships' 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'bg-purple-50 dark:bg-purple-900/20'
                } rounded-lg`}>
                  {activeTab === 'internships' ? (
                    <Briefcase className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Building2 className="h-6 w-6 text-purple-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">{position.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Building2 className="h-4 w-4" />
                      {position.company}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {position.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      {position.salary}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {position.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        {req}
                      </span>
                    ))}
                  </div>
                  {activeTab === 'referrals' && 'referralContact' in position && (
                    <div className="mt-2 text-sm text-gray-500">
                      内推联系人：{position.referralContact}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  截止日期：{position.deadline}
                </span>
                <button 
                  onClick={() => navigate(`/student/${activeTab === 'internships' ? 'internships' : 'referrals'}/${position.id}`)}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    activeTab === 'internships' 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white rounded-lg transition-colors`}
                >
                  {activeTab === 'internships' ? '查看详情' : '申请内推'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipPage; 