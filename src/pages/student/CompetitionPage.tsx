import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Trophy,
  Calendar,
  Users,
  Target,
  ArrowRight,
  Clock,
  Globe,
  BookOpen,
  Award,
  ArrowUpDown,
  X
} from 'lucide-react';

// 竞赛类型定义
interface Competition {
  id: string;
  name: string;
  organizer: string;
  type: string;
  level: string;
  registrationDeadline: string;
  competitionDate: string;
  participants: string;
  requirements: string[];
  description: string;
  awards: string[];
  tags: string[];
  website: string;
}

const CompetitionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    levels: [] as string[],
    tags: [] as string[]
  });

  // 模拟竞赛数据
  const competitions: Competition[] = [
    {
      id: "1",
      name: "中国\"互联网+\"大学生创新创业大赛",
      organizer: "教育部",
      type: "创新创业",
      level: "国家级",
      registrationDeadline: "2024-05-20",
      competitionDate: "2024-09-15",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "创新性项目", "有商业计划书"],
      description: "中国\"互联网+\"大学生创新创业大赛是由教育部与相关部委和地方政府共同举办的全国性创新创业赛事，旨在深化高等教育综合改革，激发大学生创造力，培养造就\"大众创业、万众创新\"的生力军。",
      awards: ["金奖", "银奖", "铜奖", "优秀奖"],
      tags: ["创新", "创业", "互联网+"],
      website: "https://cy.ncss.cn/"
    },
    {
      id: "2",
      name: "全国大学生节能减排社会实践与科技竞赛",
      organizer: "教育部高等教育司",
      type: "科技竞赛",
      level: "国家级",
      registrationDeadline: "2024-04-10",
      competitionDate: "2024-08-20",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "节能减排相关项目", "有实践成果"],
      description: "全国大学生节能减排社会实践与科技竞赛是全国性的大学生科技竞赛，旨在引导大学生将所学知识应用于节能减排领域的社会实践与科技创新活动中。",
      awards: ["一等奖", "二等奖", "三等奖", "优秀奖"],
      tags: ["节能", "减排", "环保", "科技创新"],
      website: "http://www.jienengjianpai.org/"
    },
    {
      id: "3",
      name: "全国大学生数字建模竞赛",
      organizer: "教育部高等教育司",
      type: "建模竞赛",
      level: "国家级",
      registrationDeadline: "2024-03-15",
      competitionDate: "2024-06-10",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "数字建模能力", "团队协作"],
      description: "全国大学生数字建模竞赛是面向全国大学生的建模竞赛，旨在培养学生的建模能力、创新思维和团队协作精神。",
      awards: ["一等奖", "二等奖", "三等奖"],
      tags: ["建模", "数字化", "创新设计"],
      website: "http://www.mcm.edu.cn/"
    },
    {
      id: "4",
      name: "全国大学生电子设计竞赛",
      organizer: "教育部高等教育司",
      type: "电子设计",
      level: "国家级",
      registrationDeadline: "2024-04-25",
      competitionDate: "2024-07-15",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "电子技术基础", "动手能力强"],
      description: "全国大学生电子设计竞赛是电子信息类专业最具影响力的学科竞赛之一，旨在培养大学生的创新能力、协作精神以及分析和解决问题的能力。",
      awards: ["一等奖", "二等奖", "三等奖", "优秀奖"],
      tags: ["电子设计", "硬件", "创新"],
      website: "http://nuedc.xjtu.edu.cn/"
    },
    {
      id: "5",
      name: "全国周培源大学生力学竞赛",
      organizer: "教育部高等教育司、中国力学学会",
      type: "学科竞赛",
      level: "国家级",
      registrationDeadline: "2024-04-20",
      competitionDate: "2024-06-25",
      participants: "全国高校理工科在校生",
      requirements: ["理工科在校生", "对力学有浓厚兴趣", "较强的理论功底"],
      description: "全国周培源大学生力学竞赛是为了纪念著名力学家周培源先生而设立的全国性大学生力学竞赛，旨在促进力学教育，培养学生学习力学的兴趣和创新能力。",
      awards: ["一等奖", "二等奖", "三等奖"],
      tags: ["力学", "理论", "学科竞赛"],
      website: "http://www.cstam.org.cn/"
    },
    {
      id: "6",
      name: "全国大学生工程训练综合能力竞赛",
      organizer: "教育部高等教育司",
      type: "工程能力",
      level: "国家级",
      registrationDeadline: "2024-03-20",
      competitionDate: "2024-07-05",
      participants: "全国高校理工科在校生",
      requirements: ["工科专业在校生", "动手能力强", "团队协作能力"],
      description: "全国大学生工程训练综合能力竞赛是工科专业重要的学科竞赛，旨在培养学生的工程实践能力、创新精神和团队协作能力。",
      awards: ["一等奖", "二等奖", "三等奖", "优秀奖"],
      tags: ["工程训练", "实践", "创新"],
      website: "http://gcxl.cmes.org/"
    },
    {
      id: "7",
      name: "全国大学生智能汽车竞赛",
      organizer: "教育部高等教育司",
      type: "智能车辆",
      level: "国家级",
      registrationDeadline: "2024-02-28",
      competitionDate: "2024-07-22",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "电子技术基础", "编程能力", "团队协作"],
      description: "全国大学生智能汽车竞赛是以智能汽车为载体的大学生科技创新活动，旨在培养大学生在信息获取、处理和决策等方面的能力。",
      awards: ["一等奖", "二等奖", "三等奖"],
      tags: ["智能车", "电子控制", "人工智能"],
      website: "http://www.nxpcup.com/"
    },
    {
      id: "8",
      name: "全国大学生机器人大赛",
      organizer: "中国自动化学会",
      type: "机器人",
      level: "国家级",
      registrationDeadline: "2024-03-15",
      competitionDate: "2024-08-10",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "机器人相关技术基础", "创新思维"],
      description: "全国大学生机器人大赛是一项面向高校学生的机器人技术创新竞赛，旨在提高大学生的创新实践能力和团队协作精神。",
      awards: ["冠军", "亚军", "季军", "优胜奖"],
      tags: ["机器人", "自动化", "人工智能"],
      website: "http://www.robotcontest.cn/"
    },
    {
      id: "9",
      name: "全国大学生广告艺术大赛",
      organizer: "教育部高等教育司、中国高等教育学会",
      type: "艺术设计",
      level: "国家级",
      registrationDeadline: "2024-05-10",
      competitionDate: "2024-09-20",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "创意设计能力", "艺术审美"],
      description: "全国大学生广告艺术大赛是中国规模最大、参与院校最多、影响最广的高校创意设计赛事，旨在培养学生的创意思维和实践能力。",
      awards: ["金奖", "银奖", "铜奖", "优秀奖"],
      tags: ["广告", "创意", "设计", "艺术"],
      website: "http://www.ncda.org.cn/"
    },
    {
      id: "10",
      name: "全国大学生工业设计大赛",
      organizer: "教育部高等教育司",
      type: "工业设计",
      level: "国家级",
      registrationDeadline: "2024-04-15",
      competitionDate: "2024-08-25",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "工业设计能力", "创新思维"],
      description: "全国大学生工业设计大赛是面向全国高校学生的工业设计竞赛，旨在推动工业设计教育发展，培养学生的创新设计能力。",
      awards: ["一等奖", "二等奖", "三等奖", "优秀奖"],
      tags: ["工业设计", "创新", "产品"],
      website: "http://www.gcids.com/"
    },
    {
      id: "11",
      name: "全国大学生电子商务\"创新、创意及创业\"挑战赛",
      organizer: "教育部高等教育司",
      type: "电子商务",
      level: "国家级",
      registrationDeadline: "2024-03-20",
      competitionDate: "2024-07-10",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "电子商务相关知识", "创业意识"],
      description: "全国大学生电子商务\"三创\"挑战赛是一项推动大学生创新、创意、创业的全国性竞赛，旨在培养电子商务领域的高素质创新创业人才。",
      awards: ["金奖", "银奖", "铜奖"],
      tags: ["电子商务", "创新", "创业"],
      website: "http://www.3chuang.net/"
    },
    {
      id: "12",
      name: "\"挑战杯\"全国大学生课外学术科技作品竞赛",
      organizer: "共青团中央、教育部等",
      type: "学术科技",
      level: "国家级",
      registrationDeadline: "2024-02-25",
      competitionDate: "2024-07-15",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "科研能力", "创新思维"],
      description: "\"挑战杯\"全国大学生课外学术科技作品竞赛是全国大学生最具权威性的学术科技竞赛，被誉为中国大学生学术科技的\"奥林匹克\"。",
      awards: ["特等奖", "一等奖", "二等奖", "三等奖"],
      tags: ["科技", "学术", "创新"],
      website: "http://www.tiaozhanbei.net/"
    },
    {
      id: "13",
      name: "\"创青春\"全国大学生创业大赛",
      organizer: "共青团中央、教育部等",
      type: "创业",
      level: "国家级",
      registrationDeadline: "2024-03-10",
      competitionDate: "2024-08-05",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "创业计划", "商业模式"],
      description: "\"创青春\"全国大学生创业大赛是继\"挑战杯\"之后的又一国家级大学生赛事，旨在引导和扶持大学生自主创业。",
      awards: ["金奖", "银奖", "铜奖"],
      tags: ["创业", "商业模式", "创新"],
      website: "http://cy.ncss.org.cn/"
    },
    {
      id: "19",
      name: "美国大学生数学建模竞赛",
      organizer: "COMAP（美国数学应用联合会）",
      type: "数学建模",
      level: "国际级",
      registrationDeadline: "2024-01-20",
      competitionDate: "2024-02-15",
      participants: "全球高校在校生",
      requirements: ["在校大学生", "数学建模能力", "英语能力", "编程技能"],
      description: "美国大学生数学建模竞赛(MCM/ICM)是国际上最具影响力的数学建模竞赛之一，每年吸引全球数万支队伍参赛。",
      awards: ["Outstanding Winner", "Finalist", "Meritorious Winner", "Honorable Mention"],
      tags: ["数学建模", "国际赛事", "编程"],
      website: "https://www.comap.com/contests/mcm-icm"
    },
    {
      id: "20",
      name: "国际大学生程序设计竞赛",
      organizer: "ACM/ICPC基金会",
      type: "编程竞赛",
      level: "国际级",
      registrationDeadline: "2024-09-15",
      competitionDate: "2024-10-20",
      participants: "全球高校在校生",
      requirements: ["在校本科生", "熟练掌握C++/Java等编程语言", "具备算法和数据结构基础"],
      description: "ACM-ICPC是全球最具影响力的大学生程序设计竞赛，旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题能力。",
      awards: ["金牌", "银牌", "铜牌", "荣誉奖"],
      tags: ["算法", "编程", "团队赛"],
      website: "https://icpc.global"
    },
    {
      id: "22",
      name: "全国大学生英语竞赛",
      organizer: "教育部高等教育司",
      type: "外语竞赛",
      level: "国家级",
      registrationDeadline: "2024-02-28",
      competitionDate: "2024-04-20",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "英语能力"],
      description: "全国大学生英语竞赛(NECCS)是教育部批准的全国性大学生英语学科竞赛，旨在提高大学生的英语综合应用能力。",
      awards: ["特等奖", "一等奖", "二等奖", "三等奖"],
      tags: ["英语", "语言", "外语"],
      website: "http://www.chinaneccs.org/"
    },
    {
      id: "36",
      name: "全国大学生智能互联创新大赛",
      organizer: "教育部高等教育司",
      type: "智能互联",
      level: "国家级",
      registrationDeadline: "2024-03-30",
      competitionDate: "2024-07-25",
      participants: "全国高校在校生",
      requirements: ["在校大学生", "智能互联相关技术", "创新思维"],
      description: "全国大学生智能互联创新大赛是面向大学生的智能互联技术创新竞赛，旨在培养学生在智能互联时代的创新能力和实践水平。",
      awards: ["金奖", "银奖", "铜奖", "优秀奖"],
      tags: ["智能互联", "物联网", "人工智能"],
      website: "http://www.aicontest.cn/"
    },
    {
      id: "64",
      name: "\"创佳杯\"国际水中机器鱼竞赛",
      organizer: "中国自动化学会",
      type: "机器人",
      level: "国际级",
      registrationDeadline: "2024-04-10",
      competitionDate: "2024-08-15",
      participants: "全球高校在校生",
      requirements: ["在校大学生", "机器人相关技术", "水下机器人特性"],
      description: "\"创佳杯\"国际水中机器鱼竞赛是一项面向全球高校学生的水中机器人技术竞赛，旨在促进水下机器人技术的发展和应用。",
      awards: ["金奖", "银奖", "铜奖", "技术创新奖"],
      tags: ["水下机器人", "机器鱼", "智能控制"],
      website: "http://www.robofish.cn/"
    },
    {
      id: "69",
      name: "施耐德电气绿色能源全球创新案例挑战赛",
      organizer: "施耐德电气",
      type: "绿色能源",
      level: "国际级",
      registrationDeadline: "2024-03-25",
      competitionDate: "2024-06-30",
      participants: "全球高校在校生",
      requirements: ["在校大学生", "对能源管理有兴趣", "创新思维"],
      description: "施耐德电气绿色能源全球创新案例挑战赛是一项全球性大学生创新竞赛，旨在鼓励学生针对能源管理提出创新解决方案。",
      awards: ["全球冠军", "区域冠军", "优胜奖"],
      tags: ["绿色能源", "可持续发展", "创新"],
      website: "https://gogreen.se.com/"
    }
  ];

  // 提取所有可用的筛选选项
  const types = Array.from(new Set(competitions.map(c => c.type)));
  const levels = Array.from(new Set(competitions.map(c => c.level)));
  const tags = Array.from(new Set(competitions.flatMap(c => c.tags)));

  // 处理筛选器变化
  const handleFilterChange = (type: 'types' | 'levels' | 'tags', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  // 过滤竞赛
  const filteredCompetitions = competitions.filter(competition => {
    // 文本搜索
    if (searchQuery && !competition.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !competition.organizer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !competition.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 类型筛选
    if (filters.types.length > 0 && !filters.types.includes(competition.type)) {
      return false;
    }

    // 级别筛选
    if (filters.levels.length > 0 && !filters.levels.includes(competition.level)) {
      return false;
    }

    // 标签筛选
    if (filters.tags.length > 0 && !competition.tags.some(tag => filters.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // 获取状态样式
  const getLevelStyle = (level: string) => {
    switch (level) {
      case '国际级':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case '国家级':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case '企业级':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">竞赛库</h1>
          <p className="text-gray-500 dark:text-gray-400">浏览适合参加的学术竞赛</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索竞赛名称、主办方..."
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

      {/* 竞赛概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '可报名竞赛',
            value: competitions.filter(c => new Date(c.registrationDeadline) > new Date()).length.toString(),
            icon: Trophy,
            color: 'blue'
          },
          {
            title: '国际级赛事',
            value: competitions.filter(c => c.level === '国际级').length.toString(),
            icon: Globe,
            color: 'purple'
          },
          {
            title: '即将截止',
            value: competitions.filter(c => {
              const deadline = new Date(c.registrationDeadline);
              const now = new Date();
              const diff = deadline.getTime() - now.getTime();
              return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
            }).length.toString(),
            icon: Clock,
            color: 'red'
          },
          {
            title: '已参与竞赛',
            value: '0',
            icon: Award,
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
                setFilters({ types: [], levels: [], tags: [] });
                setShowFilters(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除筛选
            </button>
          </div>
          
          {/* 竞赛类型筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">竞赛类型</h4>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('types', type)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.types.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 竞赛级别筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">竞赛级别</h4>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleFilterChange('levels', level)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.levels.includes(level)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 标签筛选 */}
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">竞赛标签</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange('tags', tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.tags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 已选筛选条件 */}
          {(filters.types.length > 0 || filters.levels.length > 0 || filters.tags.length > 0) && (
            <div>
              <h4 className="text-sm font-medium mb-3 dark:text-white">已选条件</h4>
              <div className="flex flex-wrap gap-2">
                {filters.types.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {type}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('types', type)}
                    />
                  </span>
                ))}
                {filters.levels.map((level) => (
                  <span
                    key={level}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {level}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('levels', level)}
                    />
                  </span>
                ))}
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('tags', tag)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 竞赛列表 */}
      <div className="space-y-4">
        {filteredCompetitions.map((competition, index) => (
          <motion.div
            key={competition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold dark:text-white mb-2">{competition.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {competition.organizer}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelStyle(competition.level)}`}>
                        {competition.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {competition.participants}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      报名截止：{new Date(competition.registrationDeadline).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {competition.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {competition.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      比赛日期：{new Date(competition.competitionDate).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a
                      href={competition.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    >
                      官方网站
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/student/competitions/${competition.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  查看详情
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCompetitions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">没有找到匹配的竞赛</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionPage; 