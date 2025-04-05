import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  School,
  Search,
  MapPin,
  Trophy,
  Target,
  DollarSign,
  Heart,
  Trash2,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  X,
  GripVertical,
  MessageSquare,
  Save,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Users2,
  BarChart3,
  TrendingUp,
  Link,
  Video,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  description: string;
  requirements: string;
  employment: string;
}

interface School {
  id: string;
  name: string;
  location: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
}

interface SchoolWithNote extends School {
  note?: string;
  interestedPrograms?: string[];
}

const SchoolAssistantPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [schools] = useState<SchoolWithNote[]>([
    {
      id: '1',
      name: '麻省理工学院',
      location: '美国 - 马萨诸塞州',
      programs: [
        {
          id: 'mit-finance',
          name: '金融硕士',
          degree: 'Master of Finance',
          duration: '12-18个月',
          description: '<div className="space-y-6">\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">项目简介</h3>\n</div>\n\n专业方向：金融\n项目类别：STEM\n入学时间：秋季\n项目时长：12或18个月\n项目学费：80,718美元/年\n</div>\n\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">项目规模</h3>\n</div>\n\n总人数：132人\n平均成绩：3.82\n国际学生：92%\n男女比例：56:44\n</div>\n\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">就业情况</h3>\n</div>\n\n就业比例：99%\n平均起薪：95,000美元\n</div>\n\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">面试形式</h3>\n</div>\n\n机面（kira）/真人单面\n</div>\n\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">项目官网</h3>\n</div>\n\nhttps://mitsloan.mit.edu/mfin\n</div>\n\n<div>\n<div className="flex items-center gap-2 mb-2">\n<div className="w-1 h-6 bg-blue-500 rounded"></div>\n<h3 className="text-lg font-medium">细分方向</h3>\n</div>\n\nMFin项目有四个Concentration，对应不同的选修课程：\n1. 金融工程 (Financial Engineering)\n2. 资本市场 (Capital Markets)\n3. 企业融资 (Corporate Finance)\n4. 影响力金融 (Impact Finance)\n</div>\n</div>',
          requirements: `
            <div class="space-y-6">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <div class="space-y-2 text-gray-600">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>课程背景：需要学习过线性代数、微积分、概率论、随机过程、统计学/计量经济学的课程与掌握计算机编程技能</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="flex-1">
                 
            
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-1 h-6 bg-blue-500 rounded-full mt-1"></div>
                <div class="flex-1">
                  <h3 class="text-base font-medium mb-3">申请时间</h3>
                  <div class="space-y-2 text-gray-600">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>2025年秋季入学</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>申请截止：2025年1月3日</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
          employment: `
            <div class="space-y-6">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <div class="space-y-2 text-gray-600">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>就业率：99%</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>平均起薪：95,000美元</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>就业方向：可根据所选专业方向在金融工程、资本市场、企业融资等领域就业</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>项目优势：与金融行业有密切合作，提供丰富的实习和就业机会</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-1 h-6 bg-blue-500 rounded-full mt-1"></div>
                <div class="flex-1">
                  <h3 class="text-base font-medium mb-3">项目特色</h3>
                  <div class="text-gray-600">
                    和同样隶属于Sloan商学院的BA项目相比，MIT MFin的录取标准要友好太多，而且是哈普麻耶斯这种档次里相对可以触及的项目。
                  </div>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'mit-civil',
          name: '土木与环境工程工学硕士',
          degree: 'MEng Civil and Environmental Engineering',
          duration: '1年',
          description: '培养具有创新能力的土木与环境工程领导者',
          requirements: '需要土木工程或相关专业背景，GRE成绩要求高',
          employment: '毕业生在工程咨询、建筑公司、环保机构等领域发展'
        },
        {
          id: 'mit-analytics',
          name: '商业分析硕士',
          degree: 'Master of Business Analytics',
          duration: '1年',
          description: '结合数据科学、机器学习与商业应用',
          requirements: '需要强大的定量分析能力和编程技能',
          employment: '毕业生在咨询公司、科技公司担任数据科学家或分析师'
        },
        {
          id: 'mit-materials',
          name: '材料科学与工程理学硕士',
          degree: 'Master of Science in Materials Science and Engineering',
          duration: '2年',
          description: '研究先进材料的设计、合成和应用',
          requirements: '需要材料科学、物理或化学背景',
          employment: '毕业生在材料研发、半导体行业等领域工作'
        },
        {
          id: 'mit-mechanical',
          name: '机械工程理学硕士',
          degree: 'Master of Science in Mechanical Engineering',
          duration: '2年',
          description: '专注于机械工程的前沿研究和创新应用',
          requirements: '需要机械工程或相关专业背景，GRE成绩优秀',
          employment: '毕业生在制造业、航空航天等领域发展'
        },
        {
          id: 'mit-mba',
          name: '工商管理硕士',
          degree: 'MBA',
          duration: '2年',
          description: '培养具有技术视野的商业领袖',
          requirements: '需要至少3年工作经验，GMAT成绩优秀',
          employment: '毕业生多在科技公司、咨询公司、创业公司担任管理职务'
        },
        {
          id: 'mit-manufacturing',
          name: '制造工程硕士',
          degree: 'MEng in Manufacturing',
          duration: '1年',
          description: '专注于先进制造技术和管理',
          requirements: '需要工程背景，有制造业经验优先',
          employment: '毕业生在制造业担任技术或管理职务'
        },
        {
          id: 'mit-civil-ms',
          name: '土木与环境工程理学硕士',
          degree: 'MS Civil and Environmental Engineering',
          duration: '2年',
          description: '深入研究土木工程和环境科学',
          requirements: '需要相关专业背景，研究经验优先',
          employment: '毕业生在研究机构、工程公司工作'
        },
        {
          id: 'mit-chemical',
          name: '化学工程实践理学硕士',
          degree: 'MS in Chemical Engineering Practice',
          duration: '2年',
          description: '结合理论学习和工业实践',
          requirements: '需要化学工程背景，实验室经验优先',
          employment: '毕业生在化工、制药、能源等行业工作'
        },
        {
          id: 'mit-operations',
          name: '运筹学理学硕士',
          degree: 'MS in Operations Research',
          duration: '2年',
          description: '研究复杂系统的优化和决策',
          requirements: '需要强大的数学背景和编程能力',
          employment: '毕业生在物流、供应链、咨询等领域工作'
        },
        {
          id: 'mit-realestate',
          name: '房地产开发硕士',
          degree: 'MS in Real Estate Development',
          duration: '1年',
          description: '培养房地产开发和投资专家',
          requirements: '需要相关工作经验，GMAT/GRE成绩优秀',
          employment: '毕业生在房地产开发公司、投资机构工作'
        },
        {
          id: 'mit-policy',
          name: '科技政策硕士',
          degree: 'MS in Technology and Policy',
          duration: '2年',
          description: '研究科技创新与公共政策的交叉领域',
          requirements: '需要理工科背景，对政策研究有浓厚兴趣',
          employment: '毕业生在政府机构、智库、科技公司从事政策研究'
        }
      ],
      acceptance: '7%',
      ranking: '#1',
      tuition: '$53,000/年',
      description: '麻省理工学院（MIT），成立于1861年，位于美国剑桥市，是美国培养高级科技人才和管理人才的研究型私立大学，是以理工科为主的综合性世界一流大学。有"世界理工大学之最"的美名。学校采用了欧洲理工大学的模式办学，该校的自然及工程科学在世界上享有极佳的盛誉，其工程系曾连续七届获得美国工科研究生课程冠军，其中以电子工程专业名气最响，紧跟其后的是机械工程。麻省理工学院的校友、教授及研究人员涵盖97位诺贝尔奖得主、26位图灵奖得主。'
    },
    {
      id: '2',
      name: '斯坦福大学',
      location: '美国 - 加利福尼亚州',
      programs: [
        {
          id: 'stanford-cs',
          name: '计算机科学',
          degree: '硕士',
          duration: '2年',
          description: '全面的计算机科学教育，包括系统、理论和应用',
          requirements: '需要较强的计算机基础，GRE成绩要求高',
          employment: '毕业生通常在硅谷顶级公司就职'
        },
        {
          id: 'stanford-ds',
          name: '数据科学',
          degree: '硕士',
          duration: '1.5年',
          description: '结合统计学和计算机科学的交叉学科',
          requirements: '需要统计学或计算机科学背景',
          employment: '毕业生在数据分析、机器学习领域发展'
        }
      ],
      acceptance: '5%',
      ranking: '#2',
      tuition: '$55,000/年',
      description: '斯坦福大学是世界顶尖的研究型大学，以创新和创业精神闻名。'
    }
  ]);

  const [interestedSchools, setInterestedSchools] = useState<SchoolWithNote[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('全部');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    acceptanceRate: {
      min: 0,
      max: 100
    },
    tuition: {
      min: 0,
      max: 100000
    },
    ranking: {
      min: 1,
      max: 100
    }
  });
  const [sortBy, setSortBy] = useState<{
    field: 'ranking' | 'acceptance' | 'tuition' | null;
    direction: 'asc' | 'desc';
  }>({
    field: null,
    direction: 'asc'
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  const programs = [
    '全部',
    '计算机科学',
    '数据科学',
    '人工智能',
    '商业分析',
    '金融工程',
    '电子工程',
    '机械工程',
    'MBA',
    '生物工程',
    '环境科学'
  ];

  const filteredAndSortedSchools = useMemo(() => {
    const result = schools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgram = selectedProgram === '全部' ||
        school.programs.some(program => program.name === selectedProgram);
      
      const acceptanceNum = parseFloat(school.acceptance);
      const tuitionNum = parseInt(school.tuition.replace(/[^0-9]/g, ''));
      const rankingNum = parseInt(school.ranking.replace('#', ''));

      return matchesSearch && 
        matchesProgram &&
        acceptanceNum >= filters.acceptanceRate.min &&
        acceptanceNum <= filters.acceptanceRate.max &&
        tuitionNum >= filters.tuition.min &&
        tuitionNum <= filters.tuition.max &&
        rankingNum >= filters.ranking.min &&
        rankingNum <= filters.ranking.max;
    });

    if (sortBy.field) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy.field) {
          case 'ranking':
            aValue = parseInt(a.ranking.replace('#', ''));
            bValue = parseInt(b.ranking.replace('#', ''));
            break;
          case 'acceptance':
            aValue = parseFloat(a.acceptance);
            bValue = parseFloat(b.acceptance);
            break;
          case 'tuition':
            aValue = parseInt(a.tuition.replace(/[^0-9]/g, ''));
            bValue = parseInt(b.tuition.replace(/[^0-9]/g, ''));
            break;
          default:
            return 0;
        }

        return sortBy.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return result;
  }, [schools, searchQuery, selectedProgram, filters, sortBy]);

  const addToInterested = (school: School) => {
    if (!interestedSchools.some(s => s.id === school.id)) {
      setInterestedSchools([...interestedSchools, { ...school, note: '' }]);
    }
  };

  const removeFromInterested = (schoolId: string) => {
    setInterestedSchools(interestedSchools.filter(school => school.id !== schoolId));
  };

  const handleSort = (field: 'ranking' | 'acceptance' | 'tuition') => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(interestedSchools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setInterestedSchools(items);
  };

  const handleNoteClick = (school: SchoolWithNote) => {
    setEditingNoteId(school.id);
    setNoteContent(school.note || '');
  };

  const handleNoteSave = (schoolId: string) => {
    setInterestedSchools(schools => 
      schools.map(school => 
        school.id === schoolId 
          ? { ...school, note: noteContent }
          : school
      )
    );
    setEditingNoteId(null);
  };

  const toggleProgram = (programId: string) => {
    setExpandedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const toggleInterestedProgram = (schoolId: string, programId: string) => {
    setInterestedSchools(prevSchools => {
      const updatedSchools = prevSchools.map(school => {
        if (school.id === schoolId) {
          const interestedPrograms = school.interestedPrograms || [];
          const isInterested = interestedPrograms.includes(programId);
          
          return {
            ...school,
            interestedPrograms: isInterested
              ? interestedPrograms.filter(id => id !== programId)
              : [...interestedPrograms, programId]
          };
        }
        return school;
      });

      const schoolExists = updatedSchools.some(s => s.id === schoolId);
      if (!schoolExists) {
        const schoolToAdd = schools.find(s => s.id === schoolId);
        if (schoolToAdd) {
          return [
            ...updatedSchools,
            {
              ...schoolToAdd,
              interestedPrograms: [programId]
            }
          ];
        }
      }

      return updatedSchools;
    });
  };

  const isProgramInterested = (schoolId: string, programId: string) => {
    const school = interestedSchools.find(s => s.id === schoolId);
    return school?.interestedPrograms?.includes(programId) || false;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">选校助手</h1>
          <p className="text-gray-500 dark:text-gray-400">AI智能选校推荐和分析</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索学校..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${
              showFilters 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 高级筛选面板 */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">高级筛选</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                录取率范围
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.acceptanceRate.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    acceptanceRate: { ...prev.acceptanceRate, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.acceptanceRate.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    acceptanceRate: { ...prev.acceptanceRate, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                学费范围 (USD/年)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={filters.tuition.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    tuition: { ...prev.tuition, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={filters.tuition.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    tuition: { ...prev.tuition, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                排名范围
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={filters.ranking.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    ranking: { ...prev.ranking, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="1"
                  value={filters.ranking.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    ranking: { ...prev.ranking, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 专业筛选和排序 */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {programs.map((program) => (
            <button
              key={program}
              onClick={() => setSelectedProgram(program)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedProgram === program
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {program}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { field: 'ranking', label: '排名' },
            { field: 'acceptance', label: '录取率' },
            { field: 'tuition', label: '学费' }
          ].map((item) => (
            <button
              key={item.field}
              onClick={() => handleSort(item.field as 'ranking' | 'acceptance' | 'tuition')}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm ${
                sortBy.field === item.field
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {item.label}
              {sortBy.field === item.field && (
                sortBy.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧学校列表 */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAndSortedSchools.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400">没有找到符合条件的学校</p>
            </div>
          ) : (
            filteredAndSortedSchools.map((school) => (
              <div key={school.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold dark:text-white">{school.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{school.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToInterested(school)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${
                      interestedSchools.some(s => s.id === school.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-600 dark:text-gray-300">排名</div>
                    <div className="font-semibold dark:text-white">{school.ranking}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Target className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-600 dark:text-gray-300">录取率</div>
                    <div className="font-semibold dark:text-white">{school.acceptance}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <DollarSign className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-sm text-gray-600 dark:text-gray-300">学费</div>
                    <div className="font-semibold dark:text-white">{school.tuition}</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mt-4">{school.description}</p>

                <div className="mt-4 space-y-2">
                  {school.programs.map((program) => (
                    <div key={program.id}>
                      <div
                        onClick={() => toggleProgram(`${school.id}-${program.id}`)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium dark:text-white">{program.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {program.degree} · {program.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleInterestedProgram(school.id, program.id);
                                }}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Heart className={`h-4 w-4 ${
                                  isProgramInterested(school.id, program.id)
                                    ? 'text-red-500 fill-red-500'
                                    : 'text-gray-400'
                                }`} />
                              </button>
                              <ChevronDown 
                                className={`h-5 w-5 text-gray-400 transform transition-transform ${
                                  expandedPrograms.includes(`${school.id}-${program.id}`) ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 展开的详细信息 */}
                      <AnimatePresence>
                        {expandedPrograms.includes(`${school.id}-${program.id}`) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-4"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300">项目简介</h5>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                  <School className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">专业方向</div>
                                    <div className="font-medium dark:text-white">金融</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目类别</div>
                                    <div className="font-medium dark:text-white">STEM</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">入学时间</div>
                                    <div className="font-medium dark:text-white">秋季</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目时长</div>
                                    <div className="font-medium dark:text-white">12或18个月</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目学费</div>
                                    <div className="font-medium dark:text-white">80718美元/年</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目规模</div>
                                    <div className="font-medium dark:text-white">132人</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Trophy className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">平均成绩</div>
                                    <div className="font-medium dark:text-white">3.82</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">国际学生</div>
                                    <div className="font-medium dark:text-white">92%</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users2 className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">男女比例</div>
                                    <div className="font-medium dark:text-white">56:44</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">就业比例</div>
                                    <div className="font-medium dark:text-white">99%</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">平均起薪</div>
                                    <div className="font-medium dark:text-white">95000美元</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <Video className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">面试形式</div>
                                    <div className="font-medium dark:text-white">机面 (kira) /真人单面</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-2">
                                  <Link className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">项目官网</div>
                                    <a href="https://mitsloan.mit.edu/mfin" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:text-blue-600">点击前往</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300">细分方向</h5>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                MFin项目有四个Concentration，对应不同的选修课程，可根据个人兴趣选择其中之一。
                              </p>
                              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        序号
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        专攻方向
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Concentration
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">1</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">金融工程</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Financial Engineering</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">2</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">资本市场</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Capital Markets</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">3</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">企业融资</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Corporate Finance</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">4</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">影响力金融</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Impact Finance</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300">语言要求</h5>
                              </div>
                              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        考试类型
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        总分要求
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        分项要求
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">托福</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">100+</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">阅读25+，听力25+，口语23+，写作27+</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">雅思</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">7.0+</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">各项不低于6.5</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">GMAT</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">700+</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Quant 48+，Verbal 38+</td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">GRE</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">320+</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">Quant 165+，Verbal 155+</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300">申请要求</h5>
                              </div>
                              <div 
                                className="text-sm text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{ __html: program.requirements }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300">就业前景</h5>
                              </div>
                              <div 
                                className="text-sm text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{ __html: program.employment }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 右侧感兴趣的学校和项目 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">感兴趣的学校和项目</h3>
          {interestedSchools.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              还没有添加感兴趣的学校或项目
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-interested-schools">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4 min-h-[100px]"
                  >
                    {interestedSchools.map((school, index) => (
                      <Draggable key={school.id} draggableId={school.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={provided.draggableProps.style}
                            className={`bg-white dark:bg-gray-800 p-4 rounded-xl border ${
                              snapshot.isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {/* 学校信息 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  {...provided.dragHandleProps} 
                                  className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                >
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium dark:text-white">{school.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{school.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleNoteClick(school)}
                                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  <MessageSquare className={`h-4 w-4 ${
                                    school.note ? 'text-blue-500' : 'text-gray-400'
                                  }`} />
                                </button>
                                <button
                                  onClick={() => removeFromInterested(school.id)}
                                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-400" />
                                </button>
                              </div>
                            </div>

                            {/* 感兴趣的项目列表 */}
                            {school.interestedPrograms && school.interestedPrograms.length > 0 && (
                              <div className="mt-3 pl-12">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  感兴趣的项目:
                                </div>
                                <div className="space-y-2">
                                  {school.programs
                                    .filter(program => school.interestedPrograms?.includes(program.id))
                                    .map(program => (
                                      <div
                                        key={program.id}
                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                                      >
                                        <div>
                                          <div className="text-sm font-medium dark:text-white">
                                            {program.name}
                                          </div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {program.degree} · {program.duration}
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => toggleInterestedProgram(school.id, program.id)}
                                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                        >
                                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* 备注编辑区域 */}
                            <AnimatePresence>
                              {editingNoteId === school.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3"
                                >
                                  <textarea
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                    placeholder="添加备注..."
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                  />
                                  <div className="flex justify-end mt-2">
                                    <button
                                      onClick={() => handleNoteSave(school.id)}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                    >
                                      <Save className="h-4 w-4" />
                                      <span>保存</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* 显示已保存的备注 */}
                            {school.note && editingNoteId !== school.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 p-2 rounded-lg"
                              >
                                {school.note}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolAssistantPage; 