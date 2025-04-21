import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowUpDown,
  Heart,
  Bookmark,
  Save,
  History,
  Target,
  Star,
  Shield,
  HelpCircle,
  MoreVertical,
  Trash2,
  ExternalLink,
  Settings,
  Sliders,
  RefreshCw,
  GripVertical,
  Filter,
  Info,
  BookOpen,
  MessageSquare,
  Clock
} from 'lucide-react';
import { School as SchoolIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  school_id: string;
  cn_name?: string;
  en_name: string;
  name?: string; // Add name field for compatibility
  degree: string;
  duration: string;
  tuition_fee: string;
  faculty: string;
  category: string;
  subCategory: string;
  tags?: string[];
  apply_requirements: string;
  language_requirements: string;
  curriculum: string;
  analysis: string;
  url: string;
  interview: string;
  objectives: string;
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
  applicationType?: 'dream' | 'target' | 'safety'; // 添加申请类型: 冲刺校、目标校、保底校
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

  // 分页加载专业数据的状态
  const [programPage, setProgramPage] = useState(0);
  const [hasMorePrograms, setHasMorePrograms] = useState(true);
  const PAGE_SIZE = 50; // 每页加载的专业数量，从100修改为50

  // 专业库当前页码状态
  const [currentProgramPage, setCurrentProgramPage] = useState(0);

  // 从本地存储加载缓存的专业数据
  useEffect(() => {
    // 只在初始化时尝试从缓存加载
    if (allPrograms.length === 0 && !programsLoading && !programsError) {
      try {
        const cachedProgramsStr = localStorage.getItem('cachedPrograms');
        const cachedTimestamp = localStorage.getItem('cachedProgramsTimestamp');

        if (cachedProgramsStr && cachedTimestamp) {
          // 检查缓存是否过期（24小时）
          const now = new Date().getTime();
          const timestamp = parseInt(cachedTimestamp);
          const isExpired = now - timestamp > 24 * 60 * 60 * 1000;

          if (!isExpired) {
            const cachedPrograms = JSON.parse(cachedProgramsStr);
            console.log('从缓存加载专业数据:', cachedPrograms.length, '条');
            setAllPrograms(cachedPrograms);
            return;
          } else {
            console.log('缓存已过期，重新加载专业数据');
          }
        }
      } catch (error) {
        console.error('读取缓存失败:', error);
        // 继续正常加载流程
      }
    }
  }, [allPrograms.length, programsLoading, programsError]);

  // 从Supabase获取专业数据（分页）
  useEffect(() => {
    // 确保学校数据已加载完成后再加载专业数据
    if (schools.length > 0 && !programsLoading && !programsError && hasMorePrograms) {
      setProgramsLoading(true);
      console.time('加载专业数据');

      const fetchPrograms = async () => {
        try {
          // 检查是否有缓存的完整数据
          if (allPrograms.length > 0 && programPage > 0) {
            console.log('使用已加载的专业数据');
            setProgramsLoading(false);
            return;
          }

          console.log(`加载专业数据第${programPage + 1}页，每页${PAGE_SIZE}条...`);

          // 先获取专业总数，以便显示加载进度
          const { count, error: countError } = await supabase
            .from('programs')
            .select('*', { count: 'exact', head: true });

          if (countError) {
            console.error('获取专业总数失败:', countError);
            setProgramsError('获取专业总数失败: ' + countError.message);
            setProgramsLoading(false);
            return;
          }

          const totalCount = count || 0;
          console.log(`专业数据总数: ${totalCount}条`);

          // 设置总数状态，让UI可以显示加载进度
          setTotalProgramCount(totalCount);

          // 分页加载所有数据，避免默认的1000条限制
          const limit = 1000; // Supabase默认限制
          const totalPages = Math.ceil(totalCount / limit);
          let allProgramsData: Record<string, any>[] = [];

          for (let page = 0; page < totalPages; page++) {
            const { data, error } = await supabase
              .from('programs')
              .select('*')
              .range(page * limit, (page + 1) * limit - 1);

            if (error) {
              console.error(`获取第${page+1}页专业数据失败:`, error);
              setProgramsError(`加载专业数据第${page+1}页失败: ${error.message}`);
              setProgramsLoading(false);
              return;
            }

            if (data) {
              allProgramsData = [...allProgramsData, ...data];
              console.log(`已加载第${page+1}页专业数据: ${data.length}条，总计: ${allProgramsData.length}/${totalCount}条`);
            }
          }

          if (allProgramsData.length === 0) {
            console.warn('未找到任何专业数据');
            setProgramsError('未找到任何专业数据');
            setProgramsLoading(false);
            setHasMorePrograms(false);
            console.timeEnd('加载专业数据');
            return;
          }

          console.log(`成功加载专业数据: ${allProgramsData.length}条，共${totalCount}条`);

          // 处理数据，转换为应用所需的格式
          const processedPrograms = allProgramsData.map((dbProgram) => ({
            id: dbProgram.id || '',
            school_id: dbProgram.school_id || '',
            name: dbProgram.cn_name || dbProgram.en_name || '',
            cn_name: dbProgram.cn_name || '',
            en_name: dbProgram.en_name || '',
            degree: dbProgram.degree || '',
            duration: dbProgram.duration || '',
            tuition_fee: dbProgram.tuition_fee || '',
            faculty: dbProgram.faculty || '',
            category: dbProgram.category || '',
            subCategory: dbProgram.subCategory || '',
            tags: Array.isArray(dbProgram.tags) ? dbProgram.tags :
                  typeof dbProgram.tags === 'string' ? dbProgram.tags.split(',') : [],
            apply_requirements: dbProgram.apply_requirements || '',
            language_requirements: dbProgram.language_requirements || '',
            curriculum: dbProgram.curriculum || '',
            analysis: dbProgram.analysis || '',
            url: dbProgram.url || '',
            interview: dbProgram.interview || '',
            objectives: dbProgram.objectives || '',
          }));

          // 设置全部专业数据
          setAllPrograms(processedPrograms);
          console.log('专业数据加载完成，共', processedPrograms.length, '条');

          // 所有数据加载完成，设置标志
          setHasMorePrograms(false);

          // 缓存完整的专业数据
          try {
            localStorage.setItem('cachedPrograms', JSON.stringify(processedPrograms));
            localStorage.setItem('cachedProgramsTimestamp', new Date().getTime().toString());
            console.log('专业数据已缓存');

            // 处理专业与学校的关联
            processSchoolProgramRelationships(processedPrograms);
          } catch (cacheError) {
            console.error('缓存专业数据失败:', cacheError);
          }

          // 完成加载
          setProgramsLoading(false);
          console.timeEnd('加载专业数据');
        } catch (err) {
          console.error('获取专业数据出错:', err);
          setProgramsError(err instanceof Error ? err.message : '未知错误');
          setProgramsLoading(false);
        }
      };

      // 执行数据加载
      fetchPrograms();
    }
  }, [schools, programsLoading, programsError, hasMorePrograms, programPage, allPrograms]);

  // 添加总数状态
  const [totalProgramCount, setTotalProgramCount] = useState<number>(0);

  // 处理专业与学校的关联关系
  const processSchoolProgramRelationships = (programs: Program[]) => {
    // 按学校ID对专业进行分组
    const programsBySchool: Record<string, Program[]> = {};
    programs.forEach(program => {
      if (program.school_id) {
        if (!programsBySchool[program.school_id]) {
          programsBySchool[program.school_id] = [];
        }
        programsBySchool[program.school_id].push(program);
      }
    });

    // 检查学校ID是否存在于学校列表中
    const schoolIds = schools.map(school => school.id.toLowerCase());
    const programSchoolIds = Object.keys(programsBySchool);

    // 打印调试信息
    console.log('学校ID数量:', schoolIds.length);
    console.log('专业关联学校ID数量:', programSchoolIds.length);

    // 使用小写比较，并添加更多调试信息
    const missingSchoolIds = programSchoolIds.filter(id => {
      const exists = schoolIds.includes(id.toLowerCase());
      if (!exists) {
        console.log(`检查学校ID: ${id} - 不存在于学校列表中`);
      }
      return !exists;
    });

    // 如果有专业关联到不存在的学校ID，尝试再次检查是否有大小写差异
    if (missingSchoolIds.length > 0) {
      console.warn('发现专业关联到不存在的学校ID:', missingSchoolIds);

      // 尝试匹配学校ID，忽略大小写
      const matchedSchoolIds = new Map<string, string>();
      missingSchoolIds.forEach(missingId => {
        const matchedSchool = schools.find(school => school.id.toLowerCase() === missingId.toLowerCase());
        if (matchedSchool) {
          console.log(`找到匹配的学校ID: ${missingId} -> ${matchedSchool.id}`);
          matchedSchoolIds.set(missingId, matchedSchool.id);
        }
      });

      // 如果找到匹配，将专业关联到正确的学校ID
      matchedSchoolIds.forEach((correctId, wrongId) => {
        if (programsBySchool[wrongId]) {
          console.log(`将专业从错误的学校ID ${wrongId} 移动到正确的ID ${correctId}`);
          if (!programsBySchool[correctId]) {
            programsBySchool[correctId] = [];
          }
          programsBySchool[correctId].push(...programsBySchool[wrongId]);
          delete programsBySchool[wrongId];

          // 从缺失列表中移除已匹配的ID
          const index = missingSchoolIds.indexOf(wrongId);
          if (index > -1) {
            missingSchoolIds.splice(index, 1);
          }
        }
      });

      // 处理仍然缺失的学校ID
      if (missingSchoolIds.length > 0) {
        console.warn('仍然有专业关联到不存在的学校ID:', missingSchoolIds);

        // 创建一个"未分类"学校来存放这些专业
        const orphanPrograms: Program[] = [];
        missingSchoolIds.forEach(schoolId => {
          if (programsBySchool[schoolId]) {
            orphanPrograms.push(...programsBySchool[schoolId]);
            // 从映射中删除这些专业，以免它们被关联到不存在的学校
            delete programsBySchool[schoolId];
          }
        });

        if (orphanPrograms.length > 0) {
          console.log(`将 ${orphanPrograms.length} 个无家可归的专业添加到"未分类"学校`);

          // 创建一个特殊的"未分类"学校ID
          const uncategorizedSchoolId = 'uncategorized-school';
          programsBySchool[uncategorizedSchoolId] = orphanPrograms;

          // 将这个特殊学校添加到学校列表中
          setSchools(prevSchools => [
            ...prevSchools,
            {
              id: uncategorizedSchoolId,
              name: '未分类学校',
              cn_name: '未分类学校',
              en_name: 'Uncategorized Schools',
              country: '其他',
              region: '其他',
              location: '其他',  // 添加缺失的字段
              ranking: '9999',
              programs: orphanPrograms,
              logo: '',
              website: '',
              description: '这个分类包含了所有关联到不存在学校ID的专业。',
              tuition_fee: '',
              acceptance_rate: '',
              acceptance: '未知',  // 添加缺失的字段
              tuition: '未知',    // 添加缺失的字段
              student_faculty_ratio: '',
              tags: ['未分类'],
              note: '这个分类包含了所有关联到不存在学校ID的专业。'  // 添加缺失的字段
            } as SchoolWithNote
          ]);
        }
      }
    }

    // 更新学校的专业列表
    setSchools(prevSchools => {
      return prevSchools.map(school => {
        const schoolPrograms = programsBySchool[school.id] || [];
        return {
          ...school,
          programs: schoolPrograms
        };
      });
    });

    // 完成加载
    setProgramsLoading(false);
    console.timeEnd('加载专业数据');
  };

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
    searchQuery: '',
    degree: '全部', // 学位类型筛选
    duration: '全部' // 学制长度筛选
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
  const getSubCategories = (category: string): string[] => {
    switch (category) {
      case '商科':
        return ['金融', '会计', '管理'];
      case '工科':
        return ['计算机', '电子', '机械'];
      case '社科':
        return ['教育', '心理', '社会学'];
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
    // 先尝试匹配学校ID
    const school = schools.find(school => school.id === schoolId);

    // 如果找不到学校，返回未分类学校
    if (!school && schoolId) {
      return schools.find(school => school.id === 'uncategorized-school') || undefined;
    }

    return school;
  };

  // 筛选专业
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      // 专业名称搜索匹配
      const searchMatch = programFilters.searchQuery
        ? (program.name || program.cn_name || program.en_name || '').toLowerCase().includes(programFilters.searchQuery.toLowerCase())
        : true;

      // 分类匹配
      const categoryMatch = programFilters.category === '全部' ||
        (program.category && program.category.toString() === programFilters.category);

      // 子分类匹配
      const subCategoryMatch = programFilters.subCategory === '全部' ||
        (program.subCategory && program.subCategory === programFilters.subCategory);

      // 学位类型匹配
      const degreeMatch = programFilters.degree === '全部' ||
        (program.degree && program.degree === programFilters.degree);

      // 学制长度匹配
      const durationMatch = programFilters.duration === '全部' ||
        (program.duration && program.duration === programFilters.duration);

      // 获取专业所属学校
      const school = getProgramSchool(program.school_id);

      // 地区匹配
      const regionMatch = !school ? true :
        programFilters.region === '全部' || school.region === programFilters.region;

      // 国家匹配
      const countryMatch = !school ? true :
        programFilters.country === '全部' || school.country === programFilters.country;

      return searchMatch && categoryMatch && subCategoryMatch && degreeMatch && durationMatch && regionMatch && countryMatch;
    });
  }, [allPrograms, programFilters, schools]);

  // 找到专业所属的学校
  const findSchoolByProgramId = (programId: string) => {
    return schools.find(school =>
      school.programs.some(program => program.id === programId)
    );
  };

  // 修改toggleExpand函数
  const toggleExpand = (id: string) => {
    if (expandedPrograms.includes(id)) {
      setExpandedPrograms(prev => prev.filter(item => item !== id));
    } else {
      setExpandedPrograms(prev => [...prev, id]);
    }
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
        onClick={startSelection}
      >
        <Bookmark className="h-4 w-4" />
        开始选校
      </button>
      <button
        className="px-6 py-2 rounded-md flex items-center gap-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={() => navigate('/admin/school-selection?view=history')}
      >
        <History className="h-4 w-4" />
        选校记录
      </button>
    </div>
  );

  const filteredAndSortedSchools = useMemo(() => {
    const result = schools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgram = selectedProgram === '全部' ||
        school.programs.some(program => program.name === selectedProgram);

      // 处理acceptance可能是字符串或数字类型的情况
      const acceptanceNum = typeof school.acceptance === 'string'
        ? parseFloat(school.acceptance) || 0
        : typeof school.acceptance === 'number'
          ? school.acceptance
          : 0;
      // 处理tuition可能是数字类型的情况
      const tuitionNum = typeof school.tuition === 'string'
        ? parseInt(school.tuition.replace(/[^0-9]/g, '')) || 0
        : typeof school.tuition === 'number'
          ? school.tuition
          : 0;
      // 处理ranking可能是数字类型的情况
      const rankingNum = typeof school.ranking === 'string'
        ? parseInt(school.ranking.replace('#', ''))
        : typeof school.ranking === 'number'
          ? school.ranking
          : 10000; // 默认值为很大的数字

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
            aValue = typeof a.ranking === 'string'
              ? parseInt(a.ranking.replace('#', ''))
              : typeof a.ranking === 'number' ? a.ranking : 10000;
            bValue = typeof b.ranking === 'string'
              ? parseInt(b.ranking.replace('#', ''))
              : typeof b.ranking === 'number' ? b.ranking : 10000;
            break;
          case 'acceptance':
            aValue = typeof a.acceptance === 'string'
              ? parseFloat(a.acceptance) || 0
              : typeof a.acceptance === 'number' ? a.acceptance : 0;
            bValue = typeof b.acceptance === 'string'
              ? parseFloat(b.acceptance) || 0
              : typeof b.acceptance === 'number' ? b.acceptance : 0;
            break;
          case 'tuition':
            aValue = typeof a.tuition === 'string'
              ? parseInt(a.tuition.replace(/[^0-9]/g, '')) || 0
              : typeof a.tuition === 'number' ? a.tuition : 0;
            bValue = typeof b.tuition === 'string'
              ? parseInt(b.tuition.replace(/[^0-9]/g, '')) || 0
              : typeof b.tuition === 'number' ? b.tuition : 0;
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        {/* 搜索框 */}
        <div className="w-full mb-4">
          <div className="relative">
            <input
              type="text"
              value={programFilters.searchQuery}
              onChange={(e) => setProgramFilters({...programFilters, searchQuery: e.target.value})}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // 回车时更新搜索状态并重置页码
                  setCurrentProgramPage(0);
                  saveSearchToHistory(programFilters.searchQuery);
                }
              }}
              placeholder="搜索专业名称..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {programFilters.searchQuery && (
              <button 
                onClick={() => setProgramFilters({...programFilters, searchQuery: ''})}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              输入专业中文或英文名称，回车搜索
            </div>
            <button 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center"
            >
              {showAdvancedSearch ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  收起高级搜索
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  展开高级搜索
                </>
              )}
            </button>
          </div>
          
          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">搜索历史:</div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProgramFilters({...programFilters, searchQuery: query});
                      setCurrentProgramPage(0);
                    }}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {query}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem('programSearchHistory');
                  }}
                  className="text-xs px-2 py-1 text-red-500 hover:text-red-600"
                >
                  清除历史
                </button>
              </div>
            </div>
          )}
          
          {/* 高级搜索选项 */}
          {showAdvancedSearch && (
            <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
              <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">高级搜索选项</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">包含关键词</label>
                  <input
                    type="text"
                    placeholder="必须包含的关键词"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">排除关键词</label>
                  <input
                    type="text"
                    placeholder="不包含的关键词"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex">
            <button
              onClick={() => {
                setCurrentProgramPage(0);
                saveSearchToHistory(programFilters.searchQuery);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              搜索专业
            </button>
            
            <button
              onClick={() => setProgramFilters({
                ...programFilters,
                category: '全部',
                subCategory: '全部',
                region: '全部',
                country: '全部',
                searchQuery: '',
                degree: '全部',
                duration: '全部'
              })}
              className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重置筛选
            </button>
          </div>
        </div>

        {/* 筛选条件区域 - 采用统一的网格布局 */}
        <div className="border-t pt-4 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 地区筛选 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                地区
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '全部'}
                    onChange={() => setProgramFilters({...programFilters, country: '全部'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">不限</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '英国'}
                    onChange={() => setProgramFilters({...programFilters, country: '英国'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">英国</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '美国'}
                    onChange={() => setProgramFilters({...programFilters, country: '美国'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">美国</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '中国香港'}
                    onChange={() => setProgramFilters({...programFilters, country: '中国香港'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">中国香港</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '中国澳门'}
                    onChange={() => setProgramFilters({...programFilters, country: '中国澳门'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">中国澳门</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '新加坡'}
                    onChange={() => setProgramFilters({...programFilters, country: '新加坡'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">新加坡</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.country === '澳大利亚'}
                    onChange={() => setProgramFilters({...programFilters, country: '澳大利亚'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">澳大利亚</span>
                </label>
              </div>
            </div>

            {/* 学位类型 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Bookmark className="h-4 w-4 mr-1.5 text-gray-500" />
                学位类型
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.degree === '全部'}
                    onChange={() => setProgramFilters({...programFilters, degree: '全部'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">不限</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.degree === '本科'}
                    onChange={() => setProgramFilters({...programFilters, degree: '本科'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">本科</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.degree === '硕士'}
                    onChange={() => setProgramFilters({...programFilters, degree: '硕士'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">硕士</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.degree === '博士'}
                    onChange={() => setProgramFilters({...programFilters, degree: '博士'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">博士</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.degree === 'MBA'}
                    onChange={() => setProgramFilters({...programFilters, degree: 'MBA'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">MBA</span>
                </label>
              </div>
            </div>

            {/* 学制长度 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                学制长度
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '全部'}
                    onChange={() => setProgramFilters({...programFilters, duration: '全部'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">不限</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '1年'}
                    onChange={() => setProgramFilters({...programFilters, duration: '1年'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">1年</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '1.5年'}
                    onChange={() => setProgramFilters({...programFilters, duration: '1.5年'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">1.5年</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '2年'}
                    onChange={() => setProgramFilters({...programFilters, duration: '2年'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">2年</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '3年'}
                    onChange={() => setProgramFilters({...programFilters, duration: '3年'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">3年</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.duration === '4年'}
                    onChange={() => setProgramFilters({...programFilters, duration: '4年'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">4年</span>
                </label>
              </div>
            </div>

            {/* 专业分类 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Bookmark className="h-4 w-4 mr-1.5 text-gray-500" />
                专业类型
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.category === '全部'}
                    onChange={() => {
                      setProgramFilters({
                        ...programFilters, 
                        category: '全部',
                        subCategory: '全部'
                      });
                    }}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">全部</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.category === '商科'}
                    onChange={() => {
                      setProgramFilters({
                        ...programFilters, 
                        category: '商科',
                        subCategory: '全部'
                      });
                    }}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">商科</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.category === '社科'}
                    onChange={() => {
                      setProgramFilters({
                        ...programFilters, 
                        category: '社科',
                        subCategory: '全部'
                      });
                    }}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">社科</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.category === '工科'}
                    onChange={() => {
                      setProgramFilters({
                        ...programFilters, 
                        category: '工科',
                        subCategory: '全部'
                      });
                    }}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">工科</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.category === '理科'}
                    onChange={() => {
                      setProgramFilters({
                        ...programFilters, 
                        category: '理科',
                        subCategory: '全部'
                      });
                    }}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">理科</span>
                </label>
              </div>
            </div>
          </div>

          {/* 子分类 - 仅在选择了主分类时显示 */}
          {programFilters.category !== '全部' && (
            <div className="mt-4 border-t pt-4 border-dashed">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {programFilters.category}专业子类别
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={programFilters.subCategory === '全部'}
                    onChange={() => setProgramFilters({...programFilters, subCategory: '全部'})}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">全部</span>
                </label>
                {getSubCategories(programFilters.category).map(subCategory => (
                  <label key={subCategory} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={programFilters.subCategory === subCategory}
                      onChange={() => setProgramFilters({...programFilters, subCategory})}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{subCategory}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
                        <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-200">{program.cn_name || program.en_name}</p>
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
  const ProgramCard: React.FC<{ program: Program }> = ({ program }) => {
    // 获取专业所属学校
    const school = getProgramSchool(program.school_id);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* 学校logo */}
              {school && (
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                  {school.rawData?.logo_url ? (
                    <img src={school.rawData.logo_url} alt={school.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="text-blue-500 dark:text-blue-400 font-bold text-xs">
                      {school.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-1 flex flex-col min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {program.cn_name || program.en_name}
                </h3>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {school && (
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                      {school.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {program.faculty} · {program.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:flex gap-4">
                  <span>{program.degree}</span>
                  <span>{program.duration}</span>
                  {program.tuition_fee && <span>{program.tuition_fee}</span>}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInterestedProgram(program.school_id, program.id);
                  }}
                  className={`p-2 rounded-full ${
                    isProgramInterested(program.school_id, program.id)
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                </button>
                
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };





  // 选校侧边栏组件
  const SelectionSidebar = () => {
    if (!showSelectionSidebar) return null;

    // 按申请类型对学校进行分组
    const dreamSchools = interestedSchools.filter(s => s.applicationType === 'dream');
    const targetSchools = interestedSchools.filter(s => s.applicationType === 'target');
    const safetySchools = interestedSchools.filter(s => s.applicationType === 'safety');
    const uncategorizedSchools = interestedSchools.filter(s => !s.applicationType);

    return (
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">收藏夹</h2>
            <button 
              onClick={() => setShowSelectionSidebar(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="选校方案名称"
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
              value={selectionName}
              onChange={e => setSelectionName(e.target.value)}
            />
          </div>

          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共收藏了 {interestedSchools.length} 所学校
            </span>
            <button
              onClick={saveSelection}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              保存
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* 冲刺校 */}
          <div>
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-2">
              <Star className="h-4 w-4" />
              冲刺校 ({dreamSchools.length})
            </h3>
            <div className="space-y-2">
              {dreamSchools.map(school => (
                <SchoolSelectionCard 
                  key={school.id} 
                  school={school} 
                  onRemove={() => removeFromInterested(school.id)}
                  onChangeType={setSchoolApplicationType}
                />
              ))}
            </div>
          </div>

          {/* 目标校 */}
          <div>
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-2">
              <Target className="h-4 w-4" />
              目标校 ({targetSchools.length})
            </h3>
            <div className="space-y-2">
              {targetSchools.map(school => (
                <SchoolSelectionCard 
                  key={school.id} 
                  school={school} 
                  onRemove={() => removeFromInterested(school.id)}
                  onChangeType={setSchoolApplicationType}
                />
              ))}
            </div>
          </div>

          {/* 保底校 */}
          <div>
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5 mb-2">
              <Shield className="h-4 w-4" />
              保底校 ({safetySchools.length})
            </h3>
            <div className="space-y-2">
              {safetySchools.map(school => (
                <SchoolSelectionCard 
                  key={school.id} 
                  school={school} 
                  onRemove={() => removeFromInterested(school.id)}
                  onChangeType={setSchoolApplicationType}
                />
              ))}
            </div>
          </div>

          {/* 未分类 */}
          {uncategorizedSchools.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                <HelpCircle className="h-4 w-4" />
                未分类 ({uncategorizedSchools.length})
              </h3>
              <div className="space-y-2">
                {uncategorizedSchools.map(school => (
                  <SchoolSelectionCard 
                    key={school.id} 
                    school={school} 
                    onRemove={() => removeFromInterested(school.id)}
                    onChangeType={setSchoolApplicationType}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 收藏学校卡片组件
  const SchoolSelectionCard = ({ 
    school, 
    onRemove, 
    onChangeType 
  }: { 
    school: SchoolWithNote; 
    onRemove: () => void;
    onChangeType: (schoolId: string, type: 'dream' | 'target' | 'safety') => void;
  }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-600 relative">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{school.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{school.location}</p>
            
            {/* 收藏的专业列表 */}
            {school.interestedPrograms && school.interestedPrograms.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">收藏专业:</div>
                <div className="flex flex-wrap gap-1">
                  {school.interestedPrograms.map(programId => {
                    const program = school.programs.find(p => p.id === programId);
                    return program ? (
                      <span 
                        key={programId}
                        className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs"
                      >
                        {program.cn_name || program.en_name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end ml-2">
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowOptions(!showOptions)}
              >
                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 w-36">
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      onChangeType(school.id, 'dream');
                      setShowOptions(false);
                    }}
                  >
                    <Star className="h-3.5 w-3.5" />
                    设为冲刺校
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      onChangeType(school.id, 'target');
                      setShowOptions(false);
                    }}
                  >
                    <Target className="h-3.5 w-3.5" />
                    设为目标校
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      onChangeType(school.id, 'safety');
                      setShowOptions(false);
                    }}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    设为保底校
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700"></div>
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      onRemove();
                      setShowOptions(false);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    移除收藏
                  </button>
                </div>
              )}
            </div>
            
            {/* 显示学校类型标签 */}
            {school.applicationType && (
              <div className={`mt-1 px-1.5 py-0.5 rounded-full text-xs 
                ${school.applicationType === 'dream' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 
                 school.applicationType === 'target' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}
              >
                {school.applicationType === 'dream' ? '冲刺' : 
                 school.applicationType === 'target' ? '目标' : '保底'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
  const ProgramLibrary = () => {

    // 计算当前页应显示的专业数据
    const displayPrograms = useMemo(() => {
      const paginatedPrograms = programFilters.searchQuery || 
                               programFilters.category !== '全部' || 
                               programFilters.subCategory !== '全部' || 
                               programFilters.region !== '全部' || 
                               programFilters.country !== '全部'
        ? allPrograms.filter(program => {
            // 专业名称搜索匹配
            const searchMatch = programFilters.searchQuery
              ? (program.name || program.cn_name || program.en_name || '').toLowerCase().includes(programFilters.searchQuery.toLowerCase())
              : true;

            // 分类匹配
            const categoryMatch = programFilters.category === '全部' ||
              (program.category && program.category.toString() === programFilters.category);

            // 子分类匹配
            const subCategoryMatch = programFilters.subCategory === '全部' ||
              (program.subCategory && program.subCategory === programFilters.subCategory);

            // 学位类型匹配
            const degreeMatch = programFilters.degree === '全部' ||
              (program.degree && program.degree === programFilters.degree);

            // 学制长度匹配
            const durationMatch = programFilters.duration === '全部' ||
              (program.duration && program.duration === programFilters.duration);

            // 获取专业所属学校
            const school = getProgramSchool(program.school_id);

            // 地区匹配
            const regionMatch = !school ? true :
              programFilters.region === '全部' || school.region === programFilters.region;

            // 国家匹配
            const countryMatch = !school ? true :
              programFilters.country === '全部' || school.country === programFilters.country;

            return searchMatch && categoryMatch && subCategoryMatch && degreeMatch && durationMatch && regionMatch && countryMatch;
          })
        : allPrograms;
        
      // 计算总页数
      const totalPages = Math.ceil(paginatedPrograms.length / PAGE_SIZE);
      
      // 确保当前页码在有效范围内
      if (currentProgramPage >= totalPages && totalPages > 0) {
        setCurrentProgramPage(totalPages - 1);
      }
      
      // 返回当前页的数据
      const startIndex = currentProgramPage * PAGE_SIZE;
      return {
        programs: paginatedPrograms.slice(startIndex, startIndex + PAGE_SIZE),
        totalPrograms: paginatedPrograms.length,
        totalPages: totalPages
      };
    }, [allPrograms, programFilters, currentProgramPage]);

    // 分页导航组件
    const PaginationControls = () => {
      // 移除这个条件检查，总是显示导航栏
      // if (displayPrograms.totalPages <= 1) return null;
      
      return (
        <div className="flex flex-col gap-4 mt-6">
          
          
          <div className="flex justify-center items-center space-x-2 py-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mr-4">
              共 <span className="font-medium">{displayPrograms.totalPrograms}</span> 条记录，
              每页 <span className="font-medium">{PAGE_SIZE}</span> 条，
              当前第 <span className="font-medium">{currentProgramPage + 1}</span> 页，
              共 <span className="font-medium">{Math.max(1, displayPrograms.totalPages)}</span> 页
            </div>
            
            <button 
              onClick={() => setCurrentProgramPage(0)} 
              disabled={currentProgramPage === 0}
              className={`px-3 py-1 rounded ${
                currentProgramPage === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              首页
            </button>
            
            <button 
              onClick={() => setCurrentProgramPage(prev => Math.max(0, prev - 1))} 
              disabled={currentProgramPage === 0}
              className={`px-3 py-1 rounded ${
                currentProgramPage === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              上一页
            </button>
            
            <div className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
              <span className="font-medium">{currentProgramPage + 1}</span>
              <span className="mx-1">/</span>
              <span>{Math.max(1, displayPrograms.totalPages)}</span>
            </div>
            
            <button 
              onClick={() => setCurrentProgramPage(prev => Math.min(displayPrograms.totalPages - 1, prev + 1))} 
              disabled={currentProgramPage >= displayPrograms.totalPages - 1 || displayPrograms.totalPages <= 1}
              className={`px-3 py-1 rounded ${
                currentProgramPage >= displayPrograms.totalPages - 1 || displayPrograms.totalPages <= 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              下一页
            </button>
            
            <button 
              onClick={() => setCurrentProgramPage(Math.max(0, displayPrograms.totalPages - 1))} 
              disabled={currentProgramPage >= displayPrograms.totalPages - 1 || displayPrograms.totalPages <= 1}
              className={`px-3 py-1 rounded ${
                currentProgramPage >= displayPrograms.totalPages - 1 || displayPrograms.totalPages <= 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              末页
            </button>
            
            {totalProgramCount > 0 && totalProgramCount > allPrograms.length && (
              <button 
                onClick={() => {
                  // 重置加载状态，强制重新加载所有数据
                  setProgramsLoading(false);
                  setProgramsError(null);
                  setHasMorePrograms(true);
                  setProgramPage(0);
                  setAllPrograms([]);
                  // 清除本地缓存，确保重新从服务器加载数据
                  localStorage.removeItem('cachedPrograms');
                  localStorage.removeItem('cachedProgramsTimestamp');
                  // 延迟一点执行，确保状态已更新
                  setTimeout(() => {
                    setProgramsLoading(true);
                  }, 100);
                }}
                className="ml-4 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 rounded"
              >
                加载全部数据 ({totalProgramCount} 条)
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* 移除了这里的重复组件 ProgramFilters */}

          {programsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : programsError ? (
            <div className="text-center py-8 bg-red-50 text-red-600 rounded-lg">
              <div className="mb-4 whitespace-pre-line">
                {programsError}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.open('https://supabase.com/dashboard/project/swyajeiqqewyckzbfkid/editor', '_blank')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  打开Supabase控制台
                </button>
                <button
                  onClick={() => {
                    setProgramsError(null);
                    setProgramsLoading(true);
                    setHasMorePrograms(true);
                    setProgramPage(0);
                    setAllPrograms([]);
                    // 清除本地缓存
                    localStorage.removeItem('cachedPrograms');
                    localStorage.removeItem('cachedProgramsTimestamp');
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  重新加载
                </button>
              </div>
            </div>
          ) : allPrograms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-xl font-semibold mb-2">暂无专业数据</div>
              <p className="mb-4">请在Supabase控制台中添加专业数据，或者点击下方按钮重新加载</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => window.open('https://supabase.com/dashboard/project/swyajeiqqewyckzbfkid/editor', '_blank')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  打开Supabase控制台
                </button>
                <button
                  onClick={() => {
                    // 手动触发重新加载
                    setProgramsLoading(true);
                    setProgramsError(null);
                    setHasMorePrograms(true);
                    setProgramPage(0);
                    setAllPrograms([]);
                    // 清除本地缓存
                    localStorage.removeItem('cachedPrograms');
                    localStorage.removeItem('cachedProgramsTimestamp');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  重新加载专业数据
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 筛选条件摘要 */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mt-4 mb-6">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    找到 <span className="text-blue-500">{filteredPrograms.length}</span> 个符合条件的专业
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {programFilters.country !== '全部' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                        地区:{programFilters.country}
                        <button 
                          className="ml-1 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, country: '全部'});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                </div>
              )}
                    {programFilters.category !== '全部' && (
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                        类别:{programFilters.category}
                        <button 
                          className="ml-1 hover:text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, category: '全部'});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
            </div>
          )}
                    {programFilters.subCategory !== '全部' && (
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                        子类:{programFilters.subCategory}
                        <button 
                          className="ml-1 hover:text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, subCategory: '全部'});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {programFilters.degree !== '全部' && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full flex items-center">
                        学位:{programFilters.degree}
                        <button 
                          className="ml-1 hover:text-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, degree: '全部'});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {programFilters.duration !== '全部' && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-full flex items-center">
                        学制:{programFilters.duration}
                        <button 
                          className="ml-1 hover:text-amber-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, duration: '全部'});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {programFilters.searchQuery && (
                      <div className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
                        搜索:{programFilters.searchQuery}
                        <button 
                          className="ml-1 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgramFilters({...programFilters, searchQuery: ''});
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {displayPrograms.programs.map(program => (
                  <div 
                    key={program.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/program-detail/${program.id}`)}
                  >
                    <ProgramCard program={program} />
                  </div>
                ))}
              </div>
              
              <PaginationControls />
            </>
          )}
        </div>
      </div>
    );
  };

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

  // 添加搜索历史状态
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // 从本地存储加载搜索历史
    const savedHistory = localStorage.getItem('programSearchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // 保存搜索历史
  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      // 移除重复的查询
      const filtered = prev.filter(item => item !== query);
      // 添加到历史记录开头
      const newHistory = [query, ...filtered].slice(0, 10); // 只保留最近10条
      // 保存到本地存储
      localStorage.setItem('programSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // 添加一个选校助手使用说明弹窗组件
  const SelectionAssistantModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              选校助手使用指南
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                <Search className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">1. 浏览与搜索</h3>
                <p className="mt-1">浏览学校和专业库，使用筛选和搜索功能找到您感兴趣的项目。</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">2. 收藏感兴趣的学校与专业</h3>
                <p className="mt-1">点击学校或专业卡片上的心形图标，将它们添加到右侧的收藏夹。</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                <Target className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">3. 设置申请策略</h3>
                <p className="mt-1">在收藏夹中为每所学校设置申请策略：冲刺校、目标校或保底校。</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                <Save className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">4. 保存选校方案</h3>
                <p className="mt-1">整理完成后，可以保存您的选校方案，并随时查看历史选校记录。</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              开始选校
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // 开始选校功能
  const startSelection = () => {
    setShowSelectionModal(true); // 显示弹窗
  };

  // 关闭弹窗并显示侧边栏
  const closeModalAndShowSidebar = () => {
    setShowSelectionModal(false);
    setShowSelectionSidebar(true);
  };

  // 保存选校方案
  const saveSelection = () => {
    const newSelection: SchoolSelection = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      schools: [...interestedSchools],
      name: selectionName
    };
    
    // 将现有的selections状态更新，添加新的选校方案
    setSelections([newSelection, ...selections]);
    
    // 显示保存成功提示
    alert('选校方案保存成功！');
  };

  // 设置学校申请类型（冲刺校、目标校、保底校）
  const setSchoolApplicationType = (schoolId: string, type: 'dream' | 'target' | 'safety') => {
    setInterestedSchools(prevSchools =>
      prevSchools.map(school =>
        school.id === schoolId
          ? { ...school, applicationType: type }
          : school
      )
    );
  };

  // 在原有状态基础上添加
  const [showSelectionModal, setShowSelectionModal] = useState(false); // 控制选校助手弹窗显示
  const [showSelectionSidebar, setShowSelectionSidebar] = useState(false); // 控制收藏侧边栏显示

  return (
    <div className="container mx-auto p-4">
      {/* 当前选校方案 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <ViewSwitchButtons />
        </div>
      </div>

      {/* 主要内容区 - 添加右边距以适应侧边栏 */}
      <div className={`pb-16 ${showSelectionSidebar ? 'pr-80' : ''} transition-all duration-300`}>
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
                                if (showSelectionSidebar === false) {
                                  setShowSelectionSidebar(true);
                                }
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
                            <ChevronDown className={`h-4 w-4 text-gray-400 duration-300 ${
                              expandedPrograms.includes(`school-${school.id}`) ? 'rotate-180' : ''
                            }`} />
                            专业
                          </button>
                          <button
                            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/school-detail/${school.id}`);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            详情
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
                                        <p className="font-medium text-sm truncate text-gray-700 dark:text-gray-200">{program.cn_name || program.en_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{program.degree} · {program.duration}</p>
                                      </div>
                                      <button
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleInterestedProgram(school.id, program.id);
                                          if (showSelectionSidebar === false) {
                                            setShowSelectionSidebar(true);
                                          }
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
                </>
              )}
            </div>
          </div>
        )}

        {currentView === 'programs' && (
          <div>
            <ProgramFilters />
            <ProgramLibrary />
          </div>
        )}

        {currentView === 'selection' && (
          <div>
            {/* 选校模式内容 */}
          </div>
        )}
      </div>

      {/* 其他模态框和侧边栏 */}
      <SelectionSidebar />
      <SelectionAssistantModal isOpen={showSelectionModal} onClose={closeModalAndShowSidebar} />
    </div>
  );
};

export default SchoolAssistantPage;