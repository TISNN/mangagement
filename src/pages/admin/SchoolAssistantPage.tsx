import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  School as SchoolIcon,
  Search,
  Heart,
  Trash2,
  ChevronDown,
  GripVertical,
  MessageSquare,
  Save,
  BookOpen,
  Bookmark,
  MapPin,
  Award,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

// 添加UUID验证函数
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
  description: string; // 由introduction映射而来
  requirements: string; // 由apply_requirements映射而来
  employment: string;
  category?: ProgramCategory; // 添加专业大类
  subCategory?: string; // 添加细分方向
  schoolId: string; // 添加学校ID以便关联显示
  language_requirements?: string; // 添加
  curriculum?: string; // 添加
  success_cases?: string; // 添加
}

// 修改School接口以匹配数据库结构
interface DatabaseSchool {
  id: string;
  cn_name: string;
  en_name?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  ranking?: number;
  description?: string;
  qs_rank_2025?: number;
  qs_rank_2024?: number;
  region?: string;
  is_verified?: boolean;
  tags?: string[] | string | Record<string, any>; // 支持多种可能的格式
  created_at?: string;
  updated_at?: string;
}

// 前端使用的学校接口
interface School {
  id: string;
  name: string;
  location: string;
  country?: string;
  region?: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string;
  tags?: string[];
  // 原始数据
  rawData?: DatabaseSchool;
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

// 在文件顶部添加莫兰迪色系的颜色变量
const morandiColors = {
  pink: 'bg-[#e8c4c4] text-[#9e7878]',
  green: 'bg-[#c8d6bf] text-[#7d9470]',
  blue: 'bg-[#b8c9d0] text-[#6e878f]',
  grey: 'bg-[#d0d0d0] text-[#808080]',
  yellow: 'bg-[#e0d6c2] text-[#9a8b6a]',
  purple: 'bg-[#c9c3d5] text-[#7b738b]',
  brown: 'bg-[#d4c9bc] text-[#8d7e6d]'
};

// 修改莫兰迪色系暗色模式
const darkMorandiColors = {
  pink: 'dark:bg-[#5c4747] dark:text-[#e8c4c4]',
  green: 'dark:bg-[#414f3a] dark:text-[#c8d6bf]',
  blue: 'dark:bg-[#384852] dark:text-[#b8c9d0]',
  grey: 'dark:bg-[#4a4a4a] dark:text-[#d0d0d0]',
  yellow: 'dark:bg-[#4e4636] dark:text-[#e0d6c2]',
  purple: 'dark:bg-[#413b50] dark:text-[#c9c3d5]',
  brown: 'dark:bg-[#494339] dark:text-[#d4c9bc]'
};

const SchoolAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 视图状态 - 学校库、专业库或选校模式
  const [currentView, setCurrentView] = useState<'schools' | 'programs' | 'selection'>('schools');
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<SchoolWithNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 添加专业数据状态
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(false);
  const [programsError, setProgramsError] = useState<string | null>(null);

  // 从Supabase获取学校数据
  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        
        // 先获取总数
        const { count, error: countError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error('获取学校总数失败:', countError);
          return;
        }
        
        const totalCount = count || 0; // 处理count可能为null的情况
        console.log(`总共有 ${totalCount} 所学校`);
        
        // 分页加载所有数据，避免默认的1000条限制
        const limit = 1000; // Supabase默认限制
        const totalPages = Math.ceil(totalCount / limit);
        let allSchools: DatabaseSchool[] = []; // 明确指定类型
        
        for (let page = 0; page < totalPages; page++) {
          const { data, error } = await supabase
            .from('schools')
            .select('*')
            .range(page * limit, (page + 1) * limit - 1)
            .order('ranking', { ascending: true }); // 移除nullsLast参数
          
          if (error) {
            console.error(`获取第${page+1}页学校数据失败:`, error);
            continue;
          }
          
          if (data) {
            allSchools = [...allSchools, ...data as DatabaseSchool[]];
            console.log(`已加载第${page+1}页学校数据: ${data.length}条`);
          }
        }
        
        if (allSchools.length === 0) {
          setError('未找到任何学校数据');
          setLoading(false);
          return;
        }
        
        // 处理数据，转换为应用所需的格式，确保id是有效的UUID
        const processedSchools = allSchools.map((dbSchool: DatabaseSchool) => {
          // 确保id是有效的UUID，如果不是则返回null
          if (!dbSchool.id || typeof dbSchool.id !== 'string' || !isValidUUID(dbSchool.id)) {
            console.warn('警告: 发现无效的学校ID格式:', dbSchool.id);
            return null;
          }
          
          // 处理tags字段，确保它是数组
          let tags: string[] = [];
          if (dbSchool.tags) {
            // 如果是字符串，尝试解析成数组
            if (typeof dbSchool.tags === 'string') {
              try {
                const parsedTags = JSON.parse(dbSchool.tags);
                tags = Array.isArray(parsedTags) ? parsedTags : [dbSchool.tags as string];
              } catch {
                // 如果解析失败，可能是竖线分隔的字符串
                tags = dbSchool.tags.split('|');
              }
            } else if (Array.isArray(dbSchool.tags)) {
              tags = dbSchool.tags;
            } else {
              // 如果是其他类型，转换为字符串并作为单个标签
              tags = [String(dbSchool.tags)];
            }
          }
          
          // 转换为前端所需的School格式
          const school: SchoolWithNote = {
            id: dbSchool.id, // 确保这是UUID格式
            name: dbSchool.cn_name || dbSchool.en_name || '未知学校',
            location: `${dbSchool.country || ''} ${dbSchool.city || ''}`.trim() || '位置未知',
            country: dbSchool.country,
            region: dbSchool.region,
            programs: [], // 默认为空，之后可以单独加载
            acceptance: '录取率未知', // 临时数据
            tuition: '学费未知',  // 临时数据
            ranking: dbSchool.ranking ? `#${dbSchool.ranking}` : '未排名',
            description: dbSchool.description || '',
            logoUrl: dbSchool.logo_url,
            tags: tags,
            rawData: dbSchool, // 保存原始数据以便需要时使用
          };
          return school;
        })
        // 过滤掉null值
        .filter((school): school is SchoolWithNote => school !== null);
        
        setSchools(processedSchools);
        console.log('已加载学校数据:', processedSchools.length);
      } catch (err) {
        console.error('获取学校数据出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSchools();
  }, []);
  
  // 从Supabase获取所有专业数据
  useEffect(() => {
    async function fetchPrograms() {
      try {
        setProgramsLoading(true);
        const { data, error } = await supabase
          .from('programs')
          .select(`
            id,
            school_id,
            en_name,
            cn_name,
            degree,
            duration,
            tuition_fee,
            application_deadline,
            apply_requirements,
            language_requirements,
            curriculum,
            success_cases,
            introduction,
            objectives,
            tags
          `);
        
        if (error) {
          console.error('获取专业数据失败:', error);
          setProgramsError(error.message);
          setProgramsLoading(false);
          return;
        }
        
        // 处理数据，转换为应用所需的格式
        const processedPrograms = data.map((dbProgram) => {
          // 转换为前端所需的Program格式
          const program: Program = {
            id: dbProgram.id,
            name: dbProgram.cn_name || dbProgram.en_name || '未知专业',
            degree: dbProgram.degree || '未知学位',
            duration: dbProgram.duration || '未知',
            description: dbProgram.introduction || '', // 使用introduction替代description
            requirements: dbProgram.apply_requirements || '', // 使用apply_requirements替代requirements
            language_requirements: dbProgram.language_requirements || '',
            curriculum: dbProgram.curriculum || '',
            success_cases: dbProgram.success_cases || '',
            employment: '', // 暂无数据
            // 根据专业名称或学位推断专业类别
            category: getProgramCategory(dbProgram.cn_name || dbProgram.en_name || '', dbProgram.degree || ''),
            // 子类别暂时留空
            subCategory: '',
            // 添加学校ID以便关联显示
            schoolId: dbProgram.school_id
          };
          return program;
        });
        
        setAllPrograms(processedPrograms);
        console.log('已加载专业数据:', processedPrograms.length);
      } catch (err) {
        console.error('获取专业数据出错:', err);
        setProgramsError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setProgramsLoading(false);
      }
    }
    
    // 当视图切换到专业库时才加载专业数据
    if (currentView === 'programs') {
      fetchPrograms();
    }
  }, [currentView]);

  // 根据专业名称和学位推断专业类别
  const getProgramCategory = (programName: string, degree: string): ProgramCategory => {
    const name = programName.toLowerCase();
    
    // 商科专业关键词
    if (
      name.includes('商') || name.includes('管理') || name.includes('金融') || 
      name.includes('会计') || name.includes('mba') || name.includes('business') || 
      name.includes('finance') || name.includes('management') || name.includes('economics')
    ) {
      return ProgramCategory.Business;
    }
    
    // 工科专业关键词
    if (
      name.includes('工程') || name.includes('计算机') || name.includes('软件') || 
      name.includes('电子') || name.includes('机械') || name.includes('engineering') || 
      name.includes('computer') || name.includes('software') || name.includes('mechanical')
    ) {
      return ProgramCategory.Engineering;
    }
    
    // 理科专业关键词
    if (
      name.includes('数学') || name.includes('物理') || name.includes('化学') || 
      name.includes('生物') || name.includes('统计') || name.includes('science') || 
      name.includes('mathematics') || name.includes('physics') || name.includes('chemistry')
    ) {
      return ProgramCategory.Science;
    }
    
    // 社科专业关键词
    if (
      name.includes('社会') || name.includes('心理') || name.includes('教育') || 
      name.includes('传播') || name.includes('艺术') || name.includes('法律') || 
      name.includes('social') || name.includes('psychology') || name.includes('education')
    ) {
      return ProgramCategory.SocialScience;
    }
    
    // 默认分类
    return ProgramCategory.Business;
  };

  const [interestedSchools, setInterestedSchools] = useState<SchoolWithNote[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('全部');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    acceptanceRate: {
      min: 0,
      max: 100
    },
    ranking: {
      min: 0,
      max: 1000
    },
    tuition: {
      min: 0,
      max: 1000000
    },
    region: [] as string[],
    country: [] as string[]
  });

  // 排序状态
  const [sortBy, setSortBy] = useState<{
    field: 'ranking' | 'acceptance' | 'tuition';
    direction: 'asc' | 'desc'
  }>({
    field: 'ranking',
    direction: 'asc'
  });

  // 是否展示选校记录侧边栏
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  
  // 选校记录
  const [selections, setSelections] = useState<SchoolSelection[]>([]);
  
  // 当前编辑的选校项
  const [noteInput, setNoteInput] = useState('');
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  
  // 添加新选校记录的名称
  const [newSelectionName, setNewSelectionName] = useState('');
  
  // 保存选校记录给学生的模态框状态
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  
  // 所有可用的区域和国家列表（从学校数据中提取）
  const availableRegions = useMemo(() => 
    Array.from(new Set(schools.map(s => s.region).filter(Boolean))),
  [schools]);
  
  const availableCountries = useMemo(() => 
    Array.from(new Set(schools.map(s => s.country).filter(Boolean))),
  [schools]);

  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);
  const [selectionName, setSelectionName] = useState('我的选校方案');
  const [savedSelections, setSavedSelections] = useState<SchoolSelection[]>([]);
  const [showSaveToStudentModal, setShowSaveToStudentModal] = useState(false);

  // 在现有state后添加筛选相关的状态
  const [schoolFilters, setSchoolFilters] = useState({
    region: '全部',
    country: '全部',
    rankingRange: [1, 10000], // 修改为非常宽泛的范围，确保包含所有学校
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

  // 筛选学校
  const filteredSchools = useMemo(() => {
    // 添加总数日志
    console.log(`开始筛选 ${schools.length} 所学校`);
    
    return schools.filter(school => {
      // 排除无效数据
      if (!school) return false;
      
      // 1. 搜索匹配 - 处理name或location可能为空的情况
      const schoolName = (school.name || '').toLowerCase();
      const schoolCountry = (school.country || '').toLowerCase();
      const schoolLocation = (school.location || '').toLowerCase();
      const searchTerm = (searchQuery || '').toLowerCase();
      
      const searchMatch = !searchTerm || 
        schoolName.includes(searchTerm) || 
        schoolCountry.includes(searchTerm) || 
        schoolLocation.includes(searchTerm);
      
      // 2. 地区匹配 - 处理region为空的情况
      const regionMatch = 
        schoolFilters.region === '全部' || 
        (school.region && school.region === schoolFilters.region);
      
      // 3. 国家匹配 - 处理country为空的情况
      const countryMatch = 
        schoolFilters.country === '全部' || 
        (school.country && school.country === schoolFilters.country);
      
      // 4. 排名匹配 - 处理ranking为空或无效格式的情况
      let rankingMatch = true;
      
      // 如果是"全部排名"筛选条件(1-10000)，所有学校都显示
      if (schoolFilters.rankingRange[0] === 1 && schoolFilters.rankingRange[1] >= 10000) {
        rankingMatch = true;
      } else {
        const rankingStr = school.ranking || '';
        const rankingNum = parseInt(rankingStr.replace(/\D/g, ''));
        
        // 只有当有明确排名数字时才进行筛选匹配
        if (!isNaN(rankingNum)) {
          rankingMatch = rankingNum >= schoolFilters.rankingRange[0] && 
                        rankingNum <= schoolFilters.rankingRange[1];
        } else {
          // 对于没有明确排名的学校：
          // - 如果用户筛选中包含了300+的排名，则显示
          // - 如果用户选择了"全部"（筛选上限为最大值），则显示
          rankingMatch = schoolFilters.rankingRange[1] >= 300 || 
                        schoolFilters.rankingRange[1] >= 10000;
        }
      }
      
      // 记录筛选结果，帮助调试
      const isMatched = searchMatch && regionMatch && countryMatch && rankingMatch;
      
      // 如果学校被过滤掉，记录具体原因
      if (!isMatched) {
        const reasons = [];
        if (!searchMatch) reasons.push(`搜索不匹配: "${searchQuery}"`);
        if (!regionMatch) reasons.push(`地区不匹配: 需要 ${schoolFilters.region}, 实际 ${school.region || '空'}`);
        if (!countryMatch) reasons.push(`国家不匹配: 需要 ${schoolFilters.country}, 实际 ${school.country || '空'}`);
        if (!rankingMatch) reasons.push(`排名不匹配: 需要 ${schoolFilters.rankingRange[0]}-${schoolFilters.rankingRange[1]}, 实际 ${school.ranking || '空'}`);
        
        console.log(`学校 "${school.name}" 被过滤掉，原因: ${reasons.join('; ')}`);
      }
      
      return isMatched;
    });
  }, [schools, searchQuery, schoolFilters]);
  
  // 获取专业所属的学校信息 - 将这个函数移到这里，在filteredPrograms之前
  const getProgramSchool = (schoolId: string): SchoolWithNote | undefined => {
    return schools.find(school => school.id === schoolId);
  };
  
  // 筛选专业
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      // 专业名称搜索匹配
      const searchMatch = programFilters.searchQuery
        ? program.name.toLowerCase().includes(programFilters.searchQuery.toLowerCase())
        : true;
      
      // 分类匹配
      const categoryMatch = programFilters.category === '全部' || 
        (program.category && program.category.toString() === programFilters.category);
      
      // 子分类匹配
      const subCategoryMatch = programFilters.subCategory === '全部' || 
        (program.subCategory && program.subCategory === programFilters.subCategory);
      
      // 获取专业所属学校
      const school = getProgramSchool(program.schoolId);
      
      // 地区匹配
      const regionMatch = !school ? true : 
        programFilters.region === '全部' || school.region === programFilters.region;
      
      // 国家匹配
      const countryMatch = !school ? true : 
        programFilters.country === '全部' || school.country === programFilters.country;
      
      return searchMatch && categoryMatch && subCategoryMatch && regionMatch && countryMatch;
    });
  }, [allPrograms, programFilters, schools]);
  
  // 找到专业所属的学校
  const findSchoolByProgramId = (programId: string) => {
    return schools.find(school => 
      school.programs.some(program => program.id === programId)
    );
  };

  // 展开/收起学校的专业列表
  const toggleExpand = (id: string) => {
    setExpandedPrograms(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
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
        <SchoolIcon className="h-4 w-4" />
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
    setEditingSchoolId(school.id);
    setNoteInput(school.note || '');
  };

  const handleNoteSave = (schoolId: string) => {
    setInterestedSchools(schools => 
      schools.map(school => 
        school.id === schoolId 
          ? { ...school, note: noteInput }
          : school
      )
    );
    setEditingSchoolId(null);
  };

  const toggleProgram = (programId: string) => {
    setExpandedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  // 修改toggleInterestedProgram函数来确保使用有效的UUID
  const toggleInterestedProgram = (schoolId: string, programId: string) => {
    // 验证schoolId是否为有效的UUID
    if (!schoolId || !isValidUUID(schoolId)) {
      console.error('无效的学校ID格式:', schoolId);
      return; // 如果ID格式无效，则不执行操作
    }
    
    // 更新收藏的专业列表
    setInterestedSchools(prevSchools => {
      // 首先检查学校是否已在列表中
      const schoolExists = prevSchools.some(s => s.id === schoolId);
      
      if (schoolExists) {
        // 如果学校已存在，更新其专业列表
        return prevSchools.map(school => {
        if (school.id === schoolId) {
            const currentPrograms = school.interestedPrograms || [];
            const isProgramAlreadyInterested = currentPrograms.includes(programId);
            
            // 如果专业已收藏则移除，否则添加
            const updatedPrograms = isProgramAlreadyInterested
              ? currentPrograms.filter(id => id !== programId)
              : [...currentPrograms, programId];
          
          return {
            ...school,
              interestedPrograms: updatedPrograms
          };
        }
        return school;
      });
      } else {
        // 如果学校不在列表中，需要添加
        const schoolToAdd = schools.find(s => s.id === schoolId);
        if (schoolToAdd) {
          return [
            ...prevSchools,
            {
              ...schoolToAdd,
              interestedPrograms: [programId],
              note: ''
            }
          ];
        }
      }

      // 如果没有找到学校，返回原列表
      return prevSchools;
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

        {/* 国家筛选 */}
        <div className="flex items-center">
          <span className="mr-8 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">国家：</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="country" 
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
                name="country" 
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
                name="country" 
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
                name="country" 
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
                name="country" 
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
                name="country" 
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
                name="country" 
                value="澳大利亚" 
                checked={schoolFilters.country === '澳大利亚'} 
                onChange={() => setSchoolFilters({...schoolFilters, country: '澳大利亚'})}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">澳大利亚</span>
            </label>
          </div>
        </div>

        {/* 排名筛选 */}
        <div className="flex items-center">
          <span className="mr-8 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">排名：</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 1 && schoolFilters.rankingRange[1] >= 10000}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [1, 10000]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">全部排名</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 1 && schoolFilters.rankingRange[1] === 50}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [1, 50]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Top 1-50</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 51 && schoolFilters.rankingRange[1] === 100}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [51, 100]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Top 51-100</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 101 && schoolFilters.rankingRange[1] === 200}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [101, 200]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Top 101-200</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 201 && schoolFilters.rankingRange[1] === 300}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [201, 300]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Top 201-300</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={schoolFilters.rankingRange[0] === 301 && schoolFilters.rankingRange[1] === 1000}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSchoolFilters({...schoolFilters, rankingRange: [301, 1000]});
                  }
                }}
                className="w-4 h-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Top 300+</span>
            </label>
          </div>
        </div>
        
        {/* 添加排名筛选说明文字 */}
        <div className="ml-28 mt-2 text-xs text-gray-500 dark:text-gray-400">
          注意: 如果学校没有排名信息，选择"Top 300+"或"全部排名"时会显示
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
    <div 
      key={school.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      onClick={() => navigate(`/admin/school-detail/${school.id}`)}
    >
      <div className="p-5 flex items-start">
        <div className="flex-shrink-0 mr-5">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/50">
            {school.logoUrl ? (
              <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain p-1" />
            ) : (
              <SchoolIcon className="h-8 w-8 text-gray-400 dark:text-gray-300" />
            )}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
          <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">{school.name}</h3>
                {/* 莫兰迪色系标签 - 内联显示 */}
                {school.tags && Array.isArray(school.tags) && school.tags.length > 0 && (
                  <>
                    {school.tags.slice(0, 3).map((tag, idx) => {
                      // 使用莫兰迪色系
                      const colorKeys = Object.keys(morandiColors);
                      const colorKey = colorKeys[idx % colorKeys.length] as keyof typeof morandiColors;
                      const lightColorClass = morandiColors[colorKey];
                      const darkColorClass = darkMorandiColors[colorKey];
                      
                      return (
                        <span 
                          key={idx} 
                          className={`px-2 py-0.5 text-xs rounded-full ${lightColorClass} ${darkColorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                    {school.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        +{school.tags.length - 3}
                      </span>
                    )}
                  </>
                )}
          </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 inline" />
                {school.location}
              </p>
        </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#e8e8e8] text-gray-700 text-sm rounded-lg dark:bg-gray-700/50 dark:text-gray-300 font-medium">
                #{school.ranking.replace('#', '')}
              </span>
      </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">录取率</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.acceptance}</p>
          </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">学费</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.tuition}</p>
          </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">专业数</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.programs.length}</p>
        </div>
      </div>
        </div>
        
        <div className="flex-shrink-0 ml-4 flex flex-col gap-2">
        <button 
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (interestedSchools.some(s => s.id === school.id)) {
                removeFromInterested(school.id);
              } else {
                addToInterested(school);
              }
            }}
          >
            <Heart className={`h-4 w-4 ${
              interestedSchools.some(s => s.id === school.id)
                ? 'text-rose-500 fill-rose-500'
                : 'text-gray-400 dark:text-gray-500'
            }`} />
            收藏
        </button>
        </div>
      </div>
      
      {/* 展开的专业列表 */}
      <AnimatePresence>
        {expandedPrograms.includes(`school-${school.id}`) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-5 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">专业列表</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {school.programs.length > 0 ? (
                  school.programs.map(program => (
                <div 
                  key={program.id}
                      className="flex justify-between items-center p-2.5 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/program-detail/${program.id}`);
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-200">{program.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{program.degree} · {program.duration}</p>
                  </div>
                  <button 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterestedProgram(school.id, program.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${
                      isProgramInterested(school.id, program.id)
                            ? 'text-rose-500 fill-rose-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </button>
                </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2 col-span-2">暂无专业信息</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // 专业卡片组件
  const ProgramCard = ({ program }: { program: Program }) => {
    const schoolData = getProgramSchool(program.schoolId);
    
    // 确保避免对出现问题的条目进行渲染
    if (!program || !schoolData) return null;
    
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        onClick={() => navigate(`/admin/programs/${program.id}`)}
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex-grow flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                {schoolData.logoUrl || (schoolData.rawData?.logo_url) ? (
                  <img 
                    src={schoolData.logoUrl || schoolData.rawData?.logo_url} 
                    alt={schoolData.name} 
                    className="w-full h-full object-contain p-1" 
                  />
                ) : (
                  <SchoolIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{program.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {schoolData.name} · {program.degree}
              </p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-4 mt-2">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{program.degree}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-xs">{schoolData.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs">{schoolData.ranking || '排名未知'}</span>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
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
                            {editingSchoolId === school.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3"
                              >
                                <textarea
                                  value={noteInput}
                                  onChange={(e) => setNoteInput(e.target.value)}
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
                          {school.note && editingSchoolId !== school.id && (
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

  // 程序库部分，显示从数据库获取的专业列表
  const ProgramLibrary = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <ProgramFilters />
        
        {programsLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : programsError ? (
          <div className="text-center py-8 bg-red-50 text-red-600 rounded-lg">
            加载专业数据出错: {programsError}
          </div>
        ) : allPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无专业数据
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {allPrograms
              .filter(program => {
                // 实现专业筛选逻辑
                const matchesSearch = program.name.toLowerCase().includes(programFilters.searchQuery.toLowerCase());
                const matchesCategory = programFilters.category === '全部' || 
                  (program.category && program.category.toString() === programFilters.category);
                
                // 获取专业所属学校
                const school = getProgramSchool(program.schoolId);
                const matchesRegion = programFilters.region === '全部' || 
                  (school && school.region === programFilters.region);
                const matchesCountry = programFilters.country === '全部' || 
                  (school && school.country === programFilters.country);
                
                return matchesSearch && matchesCategory && matchesRegion && matchesCountry;
              })
              .map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
          </div>
        )}
      </div>
    </div>
  );

  // 添加这个JSX组件到"学校列表"部分之前
  const SchoolsStats = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        共加载 <span className="font-medium text-blue-600 dark:text-blue-400">{schools.length}</span> 所学校，
        当前显示 <span className="font-medium text-blue-600 dark:text-blue-400">{filteredSchools.length}</span> 所
      </div>
      {filteredSchools.length < schools.length && (
        <button 
          onClick={() => setSchoolFilters({
            region: '全部',
            country: '全部',
            rankingRange: [1, 10000],
            searchQuery: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          重置筛选
        </button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* 当前选校方案 */}
      <div className="mb-6">
        <ViewSwitchButtons />
      </div>

      {/* 主要内容区 */}
      <div className="pb-16">
        {currentView === 'schools' && (
          <div className="space-y-6">
            <SchoolFilters />
            {/* 学校列表 */}
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                // 加载状态
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : error ? (
                // 错误状态
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                  <p>获取学校数据出错: {error}</p>
                  <button 
                    className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/40 rounded hover:bg-red-200 dark:hover:bg-red-900/60"
                    onClick={() => window.location.reload()}
                  >
                    重试
                  </button>
                </div>
              ) : (
                // 渲染学校卡片
                <>
                  <SchoolsStats />
                  {filteredSchools.map(school => (
                    <div 
                      key={school.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                      onClick={() => navigate(`/admin/school-detail/${school.id}`)}
                    >
                      <div className="p-5 flex items-start">
                        <div className="flex-shrink-0 mr-5">
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                            {school.logoUrl ? (
                              <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <SchoolIcon className="h-8 w-8 text-gray-400 dark:text-gray-300" />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white">{school.name}</h3>
                                {/* 莫兰迪色系标签 - 内联显示 */}
                                {school.tags && Array.isArray(school.tags) && school.tags.length > 0 && (
                                  <>
                                    {school.tags.slice(0, 3).map((tag, idx) => {
                                      // 使用莫兰迪色系
                                      const colorKeys = Object.keys(morandiColors);
                                      const colorKey = colorKeys[idx % colorKeys.length] as keyof typeof morandiColors;
                                      const lightColorClass = morandiColors[colorKey];
                                      const darkColorClass = darkMorandiColors[colorKey];
                                      
                                      return (
                                        <span 
                                          key={idx} 
                                          className={`px-2 py-0.5 text-xs rounded-full ${lightColorClass} ${darkColorClass}`}
                                        >
                                          {tag}
                                        </span>
                                      );
                                    })}
                                    {school.tags.length > 3 && (
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                        +{school.tags.length - 3}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 inline" />
                                {school.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2.5 py-1 bg-[#e8e8e8] text-gray-700 text-sm rounded-lg dark:bg-gray-700/50 dark:text-gray-300 font-medium">
                                {school.ranking}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">录取率</p>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.acceptance}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">学费</p>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.tuition}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide">专业数</p>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{school.programs.length}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-4 flex flex-col gap-2">
                          <button 
                            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (interestedSchools.some(s => s.id === school.id)) {
                                removeFromInterested(school.id);
                              } else {
                                addToInterested(school);
                              }
                            }}
                          >
                            <Heart className={`h-4 w-4 ${
                              interestedSchools.some(s => s.id === school.id)
                                ? 'text-rose-500 fill-rose-500'
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                            收藏
                          </button>
                          
                          <button 
                            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(`school-${school.id}`);
                            }}
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${
                              expandedPrograms.includes(`school-${school.id}`) ? 'rotate-180' : ''
                            }`} />
                            专业
                          </button>
                        </div>
                      </div>
                      
                      {/* 展开的专业列表 */}
                      <AnimatePresence>
                        {expandedPrograms.includes(`school-${school.id}`) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700"
                          >
                            <div className="p-5 space-y-3">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">专业列表</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {school.programs.length > 0 ? (
                                  school.programs.map(program => (
                                    <div 
                                      key={program.id} 
                                      className="flex justify-between items-center p-2.5 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/admin/program-detail/${program.id}`);
                                      }}
                                    >
                                      <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-200">{program.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{program.degree} · {program.duration}</p>
                                      </div>
                                      <button
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleInterestedProgram(school.id, program.id);
                                        }}
                                      >
                                        <Heart className={`h-4 w-4 ${
                                          isProgramInterested(school.id, program.id)
                                            ? 'text-rose-500 fill-rose-500'
                                            : 'text-gray-400 dark:text-gray-500'
                                        }`} />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2 col-span-2">暂无专业信息</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  
                  {filteredSchools.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">没有找到符合条件的学校</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {currentView === 'programs' && (
          <ProgramLibrary />
        )}
        
        {currentView === 'selection' && (
          <div>
            {/* 选校模式内容 */}
          </div>
        )}
      </div>

      {/* 其他模态框和侧边栏 */}
    </div>
  );
};

export default SchoolAssistantPage; 