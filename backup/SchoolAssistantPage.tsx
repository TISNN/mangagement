import React, { useState, useMemo, useEffect } from 'react';
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
  Globe,
  GraduationCap,
  Bookmark,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// 定义专业类别枚举
enum ProgramCategory {
  Business = "商科",
  SocialScience = "社科",
  Engineering = "工科",
  Science = "理科"
}

interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  description: string;
  requirements: string;
  employment: string;
  category?: ProgramCategory; // 添加专业大类
  subCategory?: string; // 添加细分方向
}

interface School {
  id: string;
  name: string;
  location: string;
  country?: string; // 添加国家字段
  region?: string; // 添加区域字段
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string; // 添加学校logo
}

interface SchoolWithNote extends School {
  note?: string;
  interestedPrograms?: string[];
}

// 选校记录定义
interface SchoolSelection {
  id: string;
  timestamp: string;
  schools: SchoolWithNote[];
  name: string; // 选校方案名称
  studentId?: number; // 关联的学生ID
}

const SchoolAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 视图状态 - 学校库、专业库或选校模式
  const [currentView, setCurrentView] = useState<'schools' | 'programs' | 'selection'>('schools');
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
  const [selectionName, setSelectionName] = useState('我的选校方案');
  const [savedSelections, setSavedSelections] = useState<SchoolSelection[]>([]);
  const [showSaveToStudentModal, setShowSaveToStudentModal] = useState(false);

  // 在现有state后添加筛选相关的状态
  const [schoolFilters, setSchoolFilters] = useState({
    region: '全部',
    country: '全部',
    rankingRange: [1, 100],
    searchQuery: ''
  });

  const [programFilters, setProgramFilters] = useState({
    category: '全部',
    subCategory: '全部',
    region: '全部',
    country: '全部',
    searchQuery: ''
  });

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

  // 获取专业分类的子类别
  const getSubCategories = (category: string) => {
    switch(category) {
      case '商科':
        return ['金融', '会计', '市场营销', '管理', '商业分析'];
      case '社科':
        return ['经济学', '政治学', '社会学', '心理学', '教育学'];
      case '工科':
        return ['计算机科学', '电子工程', '机械工程', '土木工程', '化学工程'];
      case '理科':
        return ['数学', '物理', '化学', '生物', '统计学'];
      default:
        return [];
    }
  };

  // 提取所有学校中的所有专业
  const allPrograms = useMemo(() => {
    const programsMap = new Map<string, Program & { schoolId: string, schoolName: string }>();
    
    schools.forEach(school => {
      school.programs.forEach(program => {
        // 为每个专业添加所属学校的信息
        programsMap.set(program.id, {
          ...program, 
          schoolId: school.id,
          schoolName: school.name
        });
      });
    });
    
    return Array.from(programsMap.values());
  }, [schools]);
  
  // 筛选学校
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // 搜索匹配
      const searchMatch = schoolFilters.searchQuery
        ? school.name.toLowerCase().includes(schoolFilters.searchQuery.toLowerCase()) ||
          (school.country && school.country.toLowerCase().includes(schoolFilters.searchQuery.toLowerCase()))
        : true;
        
      // 地区匹配
      const regionMatch = schoolFilters.region === '全部' || school.region === schoolFilters.region;
      
      // 国家匹配
      const countryMatch = schoolFilters.country === '全部' || school.country === schoolFilters.country;
      
      // 排名匹配（假设ranking是数字字符串，如"#5"）
      const rankingNum = parseInt(school.ranking.replace(/\D/g, ''));
      const rankingMatch = (
        !isNaN(rankingNum) && 
        rankingNum >= schoolFilters.rankingRange[0] && 
        rankingNum <= schoolFilters.rankingRange[1]
      );
      
      return searchMatch && regionMatch && countryMatch && rankingMatch;
    });
  }, [schools, schoolFilters]);
  
  // 筛选专业
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      // 专业名称搜索匹配
      const searchMatch = programFilters.searchQuery
        ? program.name.toLowerCase().includes(programFilters.searchQuery.toLowerCase())
        : true;
        
      // 专业大类匹配
      const categoryMatch = programFilters.category === '全部' || program.category === programFilters.category;
      
      // 专业细分方向匹配
      const subCategoryMatch = programFilters.subCategory === '全部' || program.subCategory === programFilters.subCategory;
      
      // 找到对应的学校
      const school = schools.find(s => s.id === program.schoolId);
      
      // 地区和国家匹配
      const regionMatch = programFilters.region === '全部' || (school && school.region === programFilters.region);
      const countryMatch = programFilters.country === '全部' || (school && school.country === programFilters.country);
      
      return searchMatch && categoryMatch && subCategoryMatch && regionMatch && countryMatch;
    });
  }, [allPrograms, schools, programFilters]);
  
  // 找到专业所属的学校
  const findSchoolByProgramId = (programId: string) => {
    return schools.find(school => 
      school.programs.some(program => program.id === programId)
    );
  };

  // 顶部导航视图切换按钮
  const ViewSwitchButtons = () => (
    <div className="flex space-x-4 mb-6">
      <button 
        className={`px-6 py-2 rounded-md flex items-center gap-2 ${
          currentView === 'schools' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
        }`}
        onClick={() => setCurrentView('schools')}
      >
        <School className="h-4 w-4" />
        学校库
      </button>
      <button 
        className={`px-6 py-2 rounded-md flex items-center gap-2 ${
          currentView === 'programs' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
        }`}
        onClick={() => setCurrentView('programs')}
      >
        <BookOpen className="h-4 w-4" />
        专业库
      </button>
      <button 
        className={`px-6 py-2 rounded-md flex items-center gap-2 ${
          currentView === 'selection' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
        }`}
        onClick={() => setCurrentView('selection')}
      >
        <Bookmark className="h-4 w-4" />
        开始选校
      </button>
    </div>
  );

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

  const addToInterested = (school: School, program?: Program) => {
    const existingIndex = interestedSchools.findIndex(s => s.id === school.id);
    
    if (existingIndex >= 0) {
      // 学校已存在，检查是否添加新专业
      if (program) {
        const updatedSchools = [...interestedSchools];
        const existingPrograms = updatedSchools[existingIndex].interestedPrograms || [];
        
        if (!existingPrograms.includes(program.id)) {
          updatedSchools[existingIndex] = {
            ...updatedSchools[existingIndex],
            interestedPrograms: [...existingPrograms, program.id]
          };
          setInterestedSchools(updatedSchools);
        }
      }
    } else {
      // 添加新学校
      const newSchool: SchoolWithNote = {
        ...school,
        note: '',
        interestedPrograms: program ? [program.id] : []
      };
      setInterestedSchools([...interestedSchools, newSchool]);
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

  // 学校筛选组件
  const SchoolFilters = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="space-y-4">
        {/* 地区筛选 */}
        <div className="flex items-center">
          <span className="mr-8 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">地区：</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="全部" 
                checked={schoolFilters.country === '全部'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '全部'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">不限</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="英国" 
                checked={schoolFilters.country === '英国'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '英国'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">英国</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="美国" 
                checked={schoolFilters.country === '美国'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '美国'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">美国</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="中国香港" 
                checked={schoolFilters.country === '中国香港'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '中国香港'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">中国香港</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="中国澳门" 
                checked={schoolFilters.country === '中国澳门'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '中国澳门'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">中国澳门</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="新加坡" 
                checked={schoolFilters.country === '新加坡'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '新加坡'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">新加坡</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="region" 
                value="澳大利亚" 
                checked={schoolFilters.country === '澳大利亚'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '澳大利亚'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">澳大利亚</span>
            </label>
          </div>
        </div>

        {/* 排名机构 */}
        <div className="flex items-center">
          <span className="mr-4 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">排名机构：</span>
          <div className="flex items-center">
            <span className="text-blue-500 font-medium cursor-pointer">QS ^</span>
          </div>
        </div>

        {/* 排名范围 */}
        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="rankingRange" 
              checked={schoolFilters.rankingRange[0] === 1 && schoolFilters.rankingRange[1] === 1000} 
              onChange={() => setSchoolFilters({...schoolFilters, rankingRange: [1, 1000]})}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">不限</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 50 && schoolFilters.rankingRange[1] >= 1} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [1, 50]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 1-50</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 100 && schoolFilters.rankingRange[1] >= 51} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [51, 100]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 51-100</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 150 && schoolFilters.rankingRange[1] >= 101} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [101, 150]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 101-150</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 200 && schoolFilters.rankingRange[1] >= 151} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [151, 200]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 151-200</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 250 && schoolFilters.rankingRange[1] >= 201} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [201, 250]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 201-250</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[0] <= 300 && schoolFilters.rankingRange[1] >= 251} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [251, 300]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 251-300</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={schoolFilters.rankingRange[1] >= 301} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSchoolFilters({...schoolFilters, rankingRange: [301, 1000]})
                }
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Top 300+</span>
          </label>
        </div>
      </div>
    </div>
  );

  // 专业筛选组件
  const ProgramFilters = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-4">
      {/* 地区筛选 - 单选按钮 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700 dark:text-gray-300 font-medium text-base mr-4">地区：</span>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="全部" 
                checked={programFilters.country === '全部'} 
                onChange={() => setProgramFilters({...programFilters, country: '全部'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">不限</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="英国" 
                checked={programFilters.country === '英国'} 
                onChange={() => setProgramFilters({...programFilters, country: '英国'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">英国</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="美国" 
                checked={programFilters.country === '美国'} 
                onChange={() => setProgramFilters({...programFilters, country: '美国'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">美国</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="中国香港" 
                checked={programFilters.country === '中国香港'} 
                onChange={() => setProgramFilters({...programFilters, country: '中国香港'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">中国香港</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="中国澳门" 
                checked={programFilters.country === '中国澳门'} 
                onChange={() => setProgramFilters({...programFilters, country: '中国澳门'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">中国澳门</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="新加坡" 
                checked={programFilters.country === '新加坡'} 
                onChange={() => setProgramFilters({...programFilters, country: '新加坡'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">新加坡</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
                value="澳大利亚" 
                checked={programFilters.country === '澳大利亚'} 
                onChange={() => setProgramFilters({...programFilters, country: '澳大利亚'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">澳大利亚</span>
            </label>
          </div>
        </div>
      </div>

      {/* 申请专业 - 类别选择 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700 dark:text-gray-300 font-medium text-base mr-4">申请专业：</span>
          <div className="flex space-x-6">
            <button 
              className={`flex items-center gap-1 ${programFilters.category === '商科' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setProgramFilters({...programFilters, category: programFilters.category === '商科' ? '全部' : '商科'})}
            >
              商科
              <ChevronDown className={`h-4 w-4 transition-transform ${programFilters.category === '商科' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              className={`flex items-center gap-1 ${programFilters.category === '社科' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setProgramFilters({...programFilters, category: programFilters.category === '社科' ? '全部' : '社科'})}
            >
              社科
              <ChevronDown className={`h-4 w-4 transition-transform ${programFilters.category === '社科' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              className={`flex items-center gap-1 ${programFilters.category === '工科' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setProgramFilters({...programFilters, category: programFilters.category === '工科' ? '全部' : '工科'})}
            >
              工科
              <ChevronDown className={`h-4 w-4 transition-transform ${programFilters.category === '工科' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              className={`flex items-center gap-1 ${programFilters.category === '理科' ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setProgramFilters({...programFilters, category: programFilters.category === '理科' ? '全部' : '理科'})}
            >
              理科
              <ChevronDown className={`h-4 w-4 transition-transform ${programFilters.category === '理科' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 显示细分专业（如果选中了大类） */}
      {programFilters.category !== '全部' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="grid grid-cols-5 gap-4">
            {getSubCategories(programFilters.category).map(subCategory => (
              <label key={subCategory} className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={programFilters.subCategory === subCategory} 
                  onChange={() => setProgramFilters({
                    ...programFilters, 
                    subCategory: programFilters.subCategory === subCategory ? '全部' : subCategory
                  })}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{subCategory}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 学校卡片组件
  const SchoolCard = ({ school }: { school: SchoolWithNote }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          {school.logoUrl && (
            <img src={school.logoUrl} alt={school.name} className="w-12 h-12 mr-3 rounded-full object-cover" />
          )}
          <div>
            <h3 className="text-lg font-semibold dark:text-white">{school.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{school.location} | 排名: {school.ranking}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">录取率</p>
            <p className="text-sm font-medium dark:text-white">{school.acceptance}</p>
          </div>
          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">学费</p>
            <p className="text-sm font-medium dark:text-white">{school.tuition}</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">专业数</p>
            <p className="text-sm font-medium dark:text-white">{school.programs.length}</p>
          </div>
        </div>
        <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">{school.description}</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">

        <button 
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          onClick={() => addToInterested(school)}
        >
          <Heart className="h-4 w-4" />
          加入收藏
        </button>
      </div>
      
      {/* 专业列表(可折叠) */}
      <AnimatePresence>
        {expandedPrograms.includes(`school-${school.id}`) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t dark:border-gray-700 px-4 pb-4"
          >
            <h4 className="font-medium my-3 dark:text-white">开设专业</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {school.programs.map(program => (
                <div 
                  key={program.id}
                  className="p-2 border dark:border-gray-700 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium dark:text-white">{program.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{program.degree} · {program.duration}</p>
                  </div>
                  <button 
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterestedProgram(school.id, program.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${
                      isProgramInterested(school.id, program.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // 专业卡片组件
  const ProgramCard = ({ program }: { program: Program & { schoolId: string, schoolName: string } }) => {
    const school = findSchoolByProgramId(program.id);
    
    if (!school) return null;

    // 导航到专业详情页
    const goToProgramDetail = () => {
      navigate(`/admin/program-detail/${program.id}`);
    };

    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={goToProgramDetail}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">{program.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              program.degree === '博士' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
              program.degree === '硕士' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            }`}>
              {program.degree}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center mb-1">
              <School className="h-4 w-4 mr-1" />
              <span>{program.schoolName}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>学制: {program.duration}</span>
            </div>
          </div>
          
          <div className="border-t dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {program.category && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {program.category}
                  </span>
                )}
                {program.subCategory && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {program.subCategory}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击事件
                    toggleInterestedProgram(school.id, program.id);
                  }}
                  className={`p-1 ${
                    isProgramInterested(school.id, program.id)
                      ? 'text-red-500 hover:text-red-700'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 同步选校到学生和申请记录
  const syncToStudentAndApplication = async (studentId: number, selectionData: SchoolSelection) => {
    try {
      // 实际应用中，这里应该是API调用来保存数据
      console.log(`同步选校数据到学生ID ${studentId} 的记录`);
      
      // 1. 保存到学生记录
      /*
      const saveToStudent = await fetch(`/api/students/${studentId}/schoolPlanning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectionData)
      });
      
      if (!saveToStudent.ok) {
        throw new Error('保存到学生记录失败');
      }
      */
      
      // 2. 同步到申请记录
      /*
      const syncToApplication = await fetch(`/api/applications/byStudent/${studentId}/planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectionData.name,
          date: new Date().toISOString().split('T')[0],
          version: `V${Math.floor(Math.random() * 10) + 1}.0`,
          planner: '当前顾问', // 这应该从用户会话中获取
          description: `${selectionData.name} - 通过选校助手创建`,
          schools: selectionData.schools.map(school => ({
            school: school.name,
            program: school.interestedPrograms && school.interestedPrograms.length > 0
              ? school.programs.find(p => p.id === school.interestedPrograms![0])?.name || '未指定专业'
              : '未指定专业',
            type: '目标院校', // 这里可以根据排名或其他因素决定类型
            status: 'pending',
            requirements: {
              gpa: '待定',
              ielts: '待定',
              deadline: '待定',
              preferences: ['待补充详细要求']
            },
            notes: school.note || ''
          }))
        })
      });
      
      if (!syncToApplication.ok) {
        throw new Error('同步到申请记录失败');
      }
      */
      
      // 模拟成功
      return true;
    } catch (error) {
      console.error('同步选校记录失败:', error);
      return false;
    }
  };

  // 保存到学生记录的模态框
  const SaveToStudentModal = () => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [students] = useState([
      { id: 1, name: 'Evan' },
      { id: 2, name: '张三' },
      { id: 3, name: '李四' }
    ]);
    const [isSaving, setIsSaving] = useState(false);
    
    // 保存到学生记录
    const handleSaveToStudent = async () => {
      if (!selectedStudent) {
        alert('请选择一个学生');
        return;
      }
      
      if (interestedSchools.length === 0) {
        alert('请先添加感兴趣的学校');
        return;
      }
      
      try {
        setIsSaving(true);
        
        // 创建一个新的选校记录
        const selectionData: SchoolSelection = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          schools: [...interestedSchools],
          name: selectionName,
          studentId: parseInt(selectedStudent)
        };
        
        // 同步到学生和申请记录
        const success = await syncToStudentAndApplication(parseInt(selectedStudent), selectionData);
        
        if (success) {
          // 保存到本地选校历史
          setSavedSelections([...savedSelections, selectionData]);
          alert('选校方案已成功保存到学生记录!');
          setShowSaveToStudentModal(false);
        } else {
          throw new Error('保存失败');
        }
      } catch (error) {
        console.error('保存选校方案失败:', error);
        alert('保存失败，请重试');
      } finally {
        setIsSaving(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">保存到学生记录</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            选择一名学生，将当前选校方案保存到该学生的申请记录中
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              方案名称
            </label>
            <input 
              type="text"
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectionName}
              onChange={(e) => setSelectionName(e.target.value)}
              placeholder="输入方案名称"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              选择学生
            </label>
            <select
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">请选择学生</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSaveToStudentModal(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              disabled={isSaving}
            >
              取消
            </button>
            <button
              onClick={handleSaveToStudent}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  保存中...
                </>
              ) : (
                '保存并同步'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 选校侧边栏组件
  const SelectionSidebar = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">我的选校</h3>
        <div className="flex gap-2">
          <button 
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => setShowSaveToStudentModal(true)}
          >
            保存方案
          </button>
          <button 
            className="text-sm text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            onClick={() => setShowSaveToStudentModal(true)}
          >
            保存到学生
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">方案名称</label>
        <input
          type="text"
          className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectionName}
          onChange={(e) => setSelectionName(e.target.value)}
        />
      </div>
      
      <div className="border-t dark:border-gray-700 pt-4">
        <h4 className="text-md font-medium mb-2 dark:text-white">已选学校 ({interestedSchools.length})</h4>
        
        {interestedSchools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">还没有选择学校，请浏览并添加感兴趣的学校</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-interested-schools">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto"
                >
                  {interestedSchools.map((school, index) => (
                    <Draggable key={school.id} draggableId={school.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className={`border dark:border-gray-700 rounded-lg p-3 ${
                            snapshot.isDragging ? 'border-blue-500 shadow-lg' : ''
                          }`}
                        >
                          {/* 学校信息 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                {...provided.dragHandleProps} 
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              <div>
                                <h5 className="font-medium dark:text-white text-sm">{school.name}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{school.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleNoteClick(school)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <MessageSquare className={`h-4 w-4 ${
                                  school.note ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                              </button>
                              <button
                                onClick={() => removeFromInterested(school.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Trash2 className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* 感兴趣的项目列表 */}
                          {school.interestedPrograms && school.interestedPrograms.length > 0 && (
                            <div className="mt-2 pl-6">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                感兴趣的专业:
                              </div>
                              <div className="space-y-1">
                                {school.programs
                                  .filter(program => school.interestedPrograms?.includes(program.id))
                                  .map(program => (
                                    <div
                                      key={program.id}
                                      className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-700/30 rounded text-xs"
                                    >
                                      <div>
                                        <div className="font-medium dark:text-white">
                                          {program.name}
                                        </div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                          {program.degree} · {program.duration}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleInterestedProgram(school.id, program.id)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                      >
                                        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
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
                                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                  rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    onClick={() => handleNoteSave(school.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                  >
                                    <Save className="h-3 w-3" />
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
                              className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded"
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
  );

  // 选校历史记录组件
  const SelectionHistory = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">已保存的选校方案</h2>
      
      {savedSelections.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">还没有保存的选校方案</p>
      ) : (
        <div className="space-y-4">
          {savedSelections.map((selection, index) => (
            <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium dark:text-white">{selection.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selection.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
              <p className="text-sm dark:text-gray-300">已选学校: {selection.schools.length}所</p>
              <div className="flex justify-between items-center mt-3">
                <button 
                  className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => {
                    setInterestedSchools(selection.schools);
                    setSelectionName(selection.name);
                  }}
                >
                  加载此方案
                </button>
                {selection.studentId && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                    已同步到学生
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和视图切换 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">选校助手</h1>
          <p className="text-gray-500 dark:text-gray-400">探索和对比学校与专业，制定您的选校方案</p>
        </div>
        
        {/* 视图切换按钮 */}
        <ViewSwitchButtons />
      </div>

      {/* 搜索栏 - 仅在学校库和专业库视图显示 */}
      {currentView !== 'selection' && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`搜索${currentView === 'schools' ? '学校' : '专业'}...`}
              value={currentView === 'schools' ? schoolFilters.searchQuery : programFilters.searchQuery}
              onChange={(e) => 
                currentView === 'schools' 
                  ? setSchoolFilters({...schoolFilters, searchQuery: e.target.value})
                  : setProgramFilters({...programFilters, searchQuery: e.target.value})
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 筛选器 - 直接显示在搜索框下方 */}
      {currentView !== 'selection' && (
        currentView === 'schools' ? <SchoolFilters /> : <ProgramFilters />
      )}

      {/* 主要内容区域 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧主内容 */}
        <div className={`${currentView === 'selection' ? 'lg:w-2/3' : 'w-full'}`}>
          {currentView === 'schools' && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  共找到 <span className="text-blue-500 font-medium">{filteredSchools.length}</span> 个学校符合条件
                </div>
              </div>
              {filteredSchools.map(school => (
                <div key={school.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/admin/school-detail/${school.id}`)}>
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0 mr-4">
                      {school.logoUrl ? (
                        <img src={school.logoUrl} alt={school.name} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                          <School className="h-8 w-8 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                            {school.name}
                            {school.country === '美国' && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full dark:bg-orange-900/30 dark:text-orange-300">
                                高收益开放
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {school.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-500 font-bold text-xl">QS排名：{school.ranking}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">录取率</p>
                          <p className="font-medium dark:text-white">{school.acceptance}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">学费</p>
                          <p className="font-medium dark:text-white">{school.tuition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">专业数</p>
                          <p className="font-medium dark:text-white">{school.programs.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button 
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToInterested(school);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                        加入收藏
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSchools.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">没有找到符合条件的学校</p>
                </div>
              )}
            </div>
          )}
          
          {currentView === 'programs' && (
            <div className="space-y-4">
              {filteredPrograms.map(program => (
                <div 
                  key={program.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/program-detail/${program.id}`)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold dark:text-white">{program.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{program.schoolName} | {program.degree} | {program.duration}</p>
                        {program.category && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                              {program.category}
                            </span>
                            {program.subCategory && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                                {program.subCategory}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                          onClick={(e) => {
                            e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击事件
                            const school = findSchoolByProgramId(program.id);
                            if (school) toggleInterestedProgram(school.id, program.id);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${
                            isProgramInterested(program.schoolId, program.id)
                              ? 'fill-white'
                              : ''
                          }`} />
                          收藏专业
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{program.description}</p>
                  </div>
                </div>
              ))}
              {filteredPrograms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">没有找到符合条件的专业</p>
                </div>
              )}
            </div>
          )}
          
          {currentView === 'selection' && <SelectionHistory />}
        </div>
        
        {/* 右侧选校栏 - 仅在选校模式显示 */}
        {currentView === 'selection' && (
          <div className="lg:w-1/3">
            <SelectionSidebar />
          </div>
        )}
      </div>

      {/* 保存到学生的模态框 */}
      {showSaveToStudentModal && <SaveToStudentModal />}
    </div>
  );
};

export default SchoolAssistantPage; 