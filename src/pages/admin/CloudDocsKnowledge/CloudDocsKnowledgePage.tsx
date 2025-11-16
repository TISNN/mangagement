import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  ChevronRight,
  Layers,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Plus,
} from 'lucide-react';

import TemplateLibraryModal, { TemplateCategory, TemplateItem } from '../../../components/knowledge/TemplateLibraryModal';
import { supabase } from '../../../lib/supabase';
import { ResourceFormModal } from '../KnowledgeBase/components/ResourceFormModal';
import { ResourceCard } from '../KnowledgeBase/components/ResourceCard/index';
import { ResourceFilters } from '../KnowledgeBase/components/ResourceFilters';
import { StatsCards } from '../KnowledgeBase/components/StatsCards';
import { UIKnowledgeResource } from '../KnowledgeBase/types/knowledge.types';
import { convertDbResourceToUiResource } from '../KnowledgeBase/utils/knowledgeMappers';
import { TAB_OPTIONS, DEFAULT_FILTERS } from '../KnowledgeBase/utils/knowledgeConstants';

type TabId = 'overview' | 'spaces';

type Metric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
};

type KnowledgeSpace = {
  id: string;
  name: string;
  segment: '顾问团队' | '市场运营' | 'AI 研发';
  description: string;
  members: number;
  articles: number;
  updatedAt: string;
  visibility: '内部' | '顾问 & 运营';
  tags: string[];
  pinned?: boolean;
};

type QuickAction = {
  id: string;
  title: string;
  helper: string;
  action: string;
};

type UpdateFeed = {
  id: string;
  type: '发布' | '更新' | '提醒';
  title: string;
  detail: string;
  owner: string;
  time: string;
};

const TABS: { id: TabId; title: string; helper: string }[] = [
  { id: 'overview', title: '知识总览', helper: '掌握关键指标与动态' },
  { id: 'spaces', title: '空间与模板', helper: '管理知识库与模板体系' },
];

const METRICS: Metric[] = [
  { id: 'metric-1', label: '知识库总数', value: '25', helper: '新增 2 个团队知识空间', trend: '+6% QoQ', icon: Layers },
  { id: 'metric-2', label: '活跃成员', value: '120', helper: '顾问 92 · 运营 28', trend: '+18 本周新增', icon: Users },
  { id: 'metric-3', label: 'AI 推荐采纳率', value: '68%', helper: '本周采纳 24 条智能摘要', trend: '+12% WoW', icon: Lightbulb },
  { id: 'metric-4', label: '待处理审核', value: '6', helper: '流程手册 3 · Prompt 2 · 公告 1', trend: '2 条逾期', icon: ShieldCheck },
];

const KNOWLEDGE_SPACES: KnowledgeSpace[] = [
  {
    id: 'space-1',
    name: '学屿教育知识库',
    segment: '顾问团队',
    description: '沉淀招生流程、服务 SOP 与案例复盘，为顾问培训与复用提供统一入口。',
    members: 86,
    articles: 412,
    updatedAt: '今天 09:20',
    visibility: '顾问 & 运营',
    tags: ['顾问培训', '服务SOP', '案例库'],
    pinned: true,
  },
  {
    id: 'space-3',
    name: '留学大模型研发资料库',
    segment: 'AI 研发',
    description: '记录 Prompt 迭代、评测结果与上线 SOP，沉淀多角色协作流程。',
    members: 32,
    articles: 96,
    updatedAt: '昨天 18:30',
    visibility: '内部',
    tags: ['AI', 'Prompt', '上线SOP'],
    pinned: true,
  },
  {
    id: 'space-4',
    name: '营销内容增长实验室',
    segment: '市场运营',
    description: '沉淀内容排期、活动复盘与增长实验案例，供市场与运营双向参考。',
    members: 64,
    articles: 204,
    updatedAt: '11-11 22:10',
    visibility: '内部',
    tags: ['增长实验', '活动复盘', '内容模板'],
  },
  {
    id: 'space-5',
    name: '顾问文书手册 · 五步法',
    segment: '顾问团队',
    description: '涵盖访谈、构思、初稿、迭代、终稿的标准流程与优秀案例。',
    members: 71,
    articles: 188,
    updatedAt: '11-10 15:05',
    visibility: '顾问 & 运营',
    tags: ['文书', '培训', '案例'],
  },
  {
    id: 'space-6',
    name: '招生宣讲素材中心',
    segment: '市场运营',
    description: '统一管理宣讲 PPT、海报素材与视频脚本，供团队内部使用和参考。',
    members: 54,
    articles: 143,
    updatedAt: '11-08 11:20',
    visibility: '顾问 & 运营',
    tags: ['宣讲', '素材', '模板'],
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa-1', title: '新建知识库', helper: '从模板快速创建并配置权限。', action: '创建' },
  { id: 'qa-2', title: '批量调整权限', helper: '统一收口外部共享链接，确保合规。', action: '配置' },
  { id: 'qa-3', title: 'AI 生成摘要', helper: '为更新内容自动生成概要与推荐位。', action: '生成' },
  { id: 'qa-4', title: '导出上线清单', helper: '汇总近 30 天上线知识库与负责人。', action: '导出' },
];

const UPDATE_FEED: UpdateFeed[] = [
  {
    id: 'feed-1',
    type: '发布',
    title: '《面试高分案例合集》升级至 2025 版',
    detail: '补充 12 篇跨专业案例，并引入 AI 模拟问答脚本。',
    owner: '陈晓丹',
    time: '今天 10:25',
  },
  {
    id: 'feed-2',
    type: '更新',
    title: '团队 Onboarding 模板新增风控须知',
    detail: '与法务确认最新合规条款，已同步至团队知识库。',
    owner: '赵婧怡',
    time: '昨天 21:40',
  },
  {
    id: 'feed-3',
    type: '提醒',
    title: 'AI 提醒：Prompt 仓库 3 条记录超 30 天未复审',
    detail: '建议负责人确认是否需要下线或更新版本。',
    owner: 'AI 助手',
    time: '昨天 18:05',
  },
];

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'recommend', name: '推荐', icon: Sparkles, count: 12 },
  { id: 'meeting', name: '会议记录', icon: BookOpen, count: 6 },
  { id: 'project', name: '项目管理', icon: Layers, count: 9 },
  { id: 'okr', name: 'OKR 复盘', icon: Activity, count: 5 },
  { id: 'research', name: '调研复盘', icon: BookMarked, count: 4 },
  { id: 'application', name: '申请材料', icon: BookMarked, count: 6 },
  { id: 'hr', name: 'HR 管理', icon: Users, count: 3 },
];

const TEMPLATE_ITEMS: TemplateItem[] = [
  {
    id: 'tpl-001',
    categoryId: 'recommend',
    categoryLabel: '业务经营周报',
    title: '业务经营周报',
    description: '聚焦营收、交付和风险等核心指标，适用于管理层例会复盘。',
    usage: '11.4 万',
    tags: ['经营盘点', '周报模版'],
    updatedAt: '上次更新·10月',
  },
  {
    id: 'tpl-002',
    categoryId: 'recommend',
    categoryLabel: '会议记录（高阶版）',
    title: '会议记录（高阶版）',
    description: '涵盖目标、结论、待办事项与风险提醒，支持多人协同编辑。',
    usage: '8.1 万',
    tags: ['会议纪要', '行动计划'],
    updatedAt: '上次更新·9月',
  },
  {
    id: 'tpl-003',
    categoryId: 'recommend',
    categoryLabel: '待办清单',
    title: '待办清单 · 进度签到',
    description: '适合顾问个人或小组进行任务拆解、优先级管理与打卡记录。',
    usage: '3.1 万',
    tags: ['任务管理', '个人使用'],
    updatedAt: '上次更新·8月',
  },
  {
    id: 'tpl-004',
    categoryId: 'meeting',
    categoryLabel: '会议记录',
    title: '周例会纪要模板',
    description: '覆盖议题汇总、结论确认与责任人分配，便于会后跟踪。',
    usage: '5.6 万',
    tags: ['例会', '纪要'],
    updatedAt: '上次更新·11月',
  },
  {
    id: 'tpl-005',
    categoryId: 'project',
    categoryLabel: '项目执行看板',
    title: '项目执行甘特图',
    description: '针对跨团队项目设计，包含阶段交付、里程碑和风险预警。',
    usage: '6.7 万',
    tags: ['甘特图', '项目管理'],
    updatedAt: '上次更新·10月',
  },
  {
    id: 'tpl-006',
    categoryId: 'project',
    categoryLabel: '项目执行模板',
    title: '项目复盘报告',
    description: '沉淀项目背景、关键成果、经验教训与后续行动。',
    usage: '4.3 万',
    tags: ['项目复盘', '经验萃取'],
    updatedAt: '上次更新·9月',
  },
  {
    id: 'tpl-007',
    categoryId: 'okr',
    categoryLabel: 'OKR 制定',
    title: 'OKR 目标制定 & 复盘',
    description: '辅助团队制定季度目标，跟踪 KR 完成率与重点结果。',
    usage: '13.6 万',
    tags: ['季度目标', '团队协作'],
    updatedAt: '上次更新·11月',
  },
  {
    id: 'tpl-008',
    categoryId: 'research',
    categoryLabel: '调研复盘',
    title: '访谈洞察模板',
    description: '整理访谈要点、机会点与行动建议，适用于用户调研与项目访谈。',
    usage: '2.4 万',
    tags: ['用户研究', '访谈记录'],
    updatedAt: '上次更新·8月',
  },
  {
    id: 'tpl-009',
    categoryId: 'hr',
    categoryLabel: 'HR 管理',
    title: '培训活动设计表',
    description: '帮助 HR 规划培训目标、议程、讲师与反馈机制。',
    usage: '1.1 万',
    tags: ['培训', '活动设计'],
    updatedAt: '上次更新·7月',
  },
  {
    id: 'tpl-010',
    categoryId: 'meeting',
    categoryLabel: '会议记录',
    title: '专项复盘会议纪要',
    description: '针对专项复盘设计的会议模板，强调问题追踪与经验沉淀。',
    usage: '3.3 万',
    tags: ['专项复盘', '会议纪要'],
    updatedAt: '上次更新·10月',
  },
  {
    id: 'tpl-011',
    categoryId: 'project',
    categoryLabel: '项目管理',
    title: '需求收集与整理表',
    description: '聚合渠道、场景与优先级信息，方便产品或顾问评审。',
    usage: '2.9 万',
    tags: ['需求管理', '优先级'],
    updatedAt: '上次更新·9月',
  },
  {
    id: 'tpl-012',
    categoryId: 'okr',
    categoryLabel: 'OKR 周报',
    title: 'OKR 周更新模板',
    description: '周度跟进 KR 进展、阻塞问题与资源需求，便于管理层同步。',
    usage: '8.6 万',
    tags: ['周报', 'OKR'],
    updatedAt: '上次更新·11月',
  },
  {
    id: 'tpl-013',
    categoryId: 'application',
    categoryLabel: '申请材料清单',
    title: '名校申请材料总览表',
    description: '梳理护照、成绩单、语言成绩、推荐信等材料状态，支持负责人分配与截止提醒。',
    usage: '5.2 万',
    tags: ['材料管理', 'Checklist'],
    updatedAt: '上次更新·11月',
  },
  {
    id: 'tpl-014',
    categoryId: 'application',
    categoryLabel: '文书写作',
    title: '个人陈述写作框架',
    description: '引导顾问与学生拆解背景、动机与亮点，用于 PS/Personal Statement 初稿撰写。',
    usage: '7.9 万',
    tags: ['个人陈述', '写作指导'],
    updatedAt: '上次更新·10月',
  },
  {
    id: 'tpl-015',
    categoryId: 'application',
    categoryLabel: '推荐信协作',
    title: '推荐信三方协同模板',
    description: '包含推荐人信息、素材收集与润色意见，便于顾问、学生、推荐人三方协作。',
    usage: '6.3 万',
    tags: ['推荐信', '协作'],
    updatedAt: '上次更新·9月',
  },
  {
    id: 'tpl-016',
    categoryId: 'application',
    categoryLabel: '面试准备',
    title: '面试问答题库与记录表',
    description: '收录常见面试题、优秀答案与学员表现记录，适合训练营和模拟面试使用。',
    usage: '4.7 万',
    tags: ['面试', '题库'],
    updatedAt: '上次更新·11月',
  },
  {
    id: 'tpl-017',
    categoryId: 'application',
    categoryLabel: '选校决策',
    title: '选校对比与打分表',
    description: '从排名、项目特色、奖学金、签证难度等维度进行量化打分，辅助最终决策。',
    usage: '3.9 万',
    tags: ['选校', '量化评分'],
    updatedAt: '上次更新·8月',
  },
];

const CloudDocsKnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [categoryFilter, setCategoryFilter] = useState<'全部' | KnowledgeSpace['segment']>('全部');
  const [keyword, setKeyword] = useState('');
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  
  // 知识库资源相关状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState<UIKnowledgeResource | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resources, setResources] = useState<UIKnowledgeResource[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<'all' | 'featured' | 'bookmarked' | 'recent'>('all');
  const [resourceFilters, setResourceFilters] = useState(DEFAULT_FILTERS);

  const [resourceStats, setResourceStats] = useState({
    totalResources: 0,
    documentCount: 0,
    videoCount: 0,
    totalDownloads: 0
  });

  const filteredSpaces = useMemo(() => {
    return KNOWLEDGE_SPACES.filter((space) => {
      const matchCategory = categoryFilter === '全部' || space.segment === categoryFilter;
      const matchKeyword =
        keyword.trim().length === 0 ||
        space.name.toLowerCase().includes(keyword.toLowerCase()) ||
        space.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));
      return matchCategory && matchKeyword;
    });
  }, [categoryFilter, keyword]);

  const pinnedSpaces = useMemo(() => filteredSpaces.filter((space) => space.pinned), [filteredSpaces]);

  // 从 localStorage 获取当前用户信息
  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType');
      if (userType === 'admin') {
        const employeeData = localStorage.getItem('currentEmployee');
        if (employeeData) {
          setCurrentUser(JSON.parse(employeeData));
        }
      } else if (userType === 'student') {
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          setCurrentUser(JSON.parse(studentData));
        }
      }
    } catch (err) {
      console.error('加载用户信息失败:', err);
    }
  }, []);

  // 加载用户收藏
  const loadBookmarks = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data } = await supabase
        .from('knowledge_bookmarks')
        .select('resource_id')
        .eq('user_id', currentUser.id);
      
      if (data) {
        setBookmarkedIds(data.map(b => b.resource_id));
      }
    } catch (err) {
      console.error('加载收藏失败:', err);
    }
  }, [currentUser]);

  // 加载资源数据
  const loadResources = useCallback(async () => {
    setResourcesLoading(true);
    setResourcesError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('knowledge_resources')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const uiResources = (data || []).map(resource => 
        convertDbResourceToUiResource(resource, bookmarkedIds.includes(resource.id))
      );
      
      setResources(uiResources);
      
      // 更新统计数据
      setResourceStats({
        totalResources: uiResources.length,
        documentCount: uiResources.filter(r => r.type === 'document').length,
        videoCount: uiResources.filter(r => r.type === 'video').length,
        totalDownloads: uiResources.reduce((sum, r) => sum + r.downloads, 0)
      });
      
    } catch (err: any) {
      console.error('加载资源失败:', err);
      
      if (err.message?.includes('relation') || err.message?.includes('table')) {
        setResourcesError('数据库表未创建。请在 Supabase Dashboard 执行: database_migrations/004_create_knowledge_base_tables.sql');
      } else {
        setResourcesError(err.message || '加载资源失败');
      }
      
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, [bookmarkedIds]);

  // 初始加载
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // 处理创建资源
  const handleCreateSubmit = async (formData: any) => {
    if (!currentUser) {
      alert('请先登录');
      return false;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('knowledge_resources')
        .insert([{
          title: formData.title,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          content: formData.type === 'article' ? formData.content : null,
          file_url: formData.fileUrl || null,
          file_size: formData.fileSize || null,
          thumbnail_url: formData.thumbnailUrl || null,
          tags: formData.tags,
          is_featured: formData.isFeatured,
          status: formData.status,
          author_id: currentUser.id,
          author_name: currentUser.name
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('✅ 资源创建成功:', data);

      // 如果是文章类型，同步创建到云文档
      if (formData.type === 'article' && data) {
        try {
          const { data: newCloudDoc } = await supabase
            .from('cloud_documents')
            .insert({
              title: formData.title,
              content: formData.content || '',
              created_by: currentUser.id,
              status: formData.status === 'published' ? 'published' : 'draft',
              tags: ['KNOWLEDGE_RESOURCE', `KNOWLEDGE_${data.id}`, ...(formData.tags || [])],
            })
            .select()
            .single();

          // 自动添加到"知识库文章"分类
          if (newCloudDoc) {
            try {
              const { getOrCreateCategory, addDocumentToCategory } = await import('../../../services/cloudDocumentService');
              const knowledgeCategory = await getOrCreateCategory('知识库文章', '知识库中的文章类资源');
              await addDocumentToCategory(newCloudDoc.id, knowledgeCategory.id);
            } catch (error) {
              console.error('添加到分类失败:', error);
            }
          }
        } catch (cloudDocError) {
          console.error('同步到云文档失败:', cloudDocError);
          // 不阻止主流程，只记录错误
        }
      }

      // 刷新列表
      await loadResources();
      return true;
    } catch (err: any) {
      console.error('创建资源失败:', err);
      alert('创建失败: ' + err.message);
      return false;
    }
  };

  // 处理收藏
  const handleBookmark = async (resourceId: number, isBookmarked: boolean) => {
    if (!currentUser?.id) {
      alert('请先登录');
      return;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('knowledge_bookmarks')
          .delete()
          .eq('resource_id', resourceId)
          .eq('user_id', currentUser.id);
      } else {
        await supabase
          .from('knowledge_bookmarks')
          .insert([{ resource_id: resourceId, user_id: currentUser.id }]);
      }

      await loadBookmarks();
    } catch (err: any) {
      console.error('收藏操作失败:', err);
      alert('收藏失败: ' + err.message);
    }
  };

  // 处理查看
  const handleView = (id: number) => {
    window.location.href = `/admin/knowledge/detail/${id}`;
  };

  // 处理下载
  const handleDownload = async (id: number, fileUrl?: string) => {
    if (!fileUrl) {
      alert('该资源没有可下载的文件');
      return;
    }

    try {
      window.open(fileUrl, '_blank');
      
      const resource = resources.find(r => r.id === id);
      if (resource) {
        await supabase
          .from('knowledge_resources')
          .update({ downloads: resource.downloads + 1 })
          .eq('id', id);
        
        setResources(prev => prev.map(r => 
          r.id === id ? { ...r, downloads: r.downloads + 1 } : r
        ));
      }
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setEditingResource(resource);
      setShowEditModal(true);
    }
  };

  // 处理编辑提交
  const handleEditSubmit = async (formData: any) => {
    if (!currentUser || !editingResource) {
      alert('请先登录');
      return false;
    }

    try {
      const updateData: any = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        tags: formData.tags,
        is_featured: formData.isFeatured,
        status: formData.status,
        updated_by: currentUser.id
      };

      if (formData.type === 'article') {
        updateData.content = formData.content;
      }

      if (formData.fileUrl) {
        updateData.file_url = formData.fileUrl;
        updateData.file_size = formData.fileSize;
      }

      if (formData.thumbnailUrl) {
        updateData.thumbnail_url = formData.thumbnailUrl;
      }

      const { data, error: updateError } = await supabase
        .from('knowledge_resources')
        .update(updateData)
        .eq('id', editingResource.id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('✅ 资源更新成功:', data);

      // 如果是文章类型，同步更新到云文档
      if (formData.type === 'article' && editingResource) {
        try {
          // 查找对应的云文档
          const { data: cloudDocsList } = await supabase
            .from('cloud_documents')
            .select('id')
            .contains('tags', [`KNOWLEDGE_${editingResource.id}`]);
          
          const cloudDocs = cloudDocsList && cloudDocsList.length > 0 ? cloudDocsList[0] : null;

          if (cloudDocs) {
            // 如果找到对应的云文档，更新它
            await supabase
              .from('cloud_documents')
              .update({
                title: formData.title,
                content: formData.content || '',
                status: formData.status === 'published' ? 'published' : 'draft',
                updated_at: new Date().toISOString(),
                tags: ['KNOWLEDGE_RESOURCE', `KNOWLEDGE_${editingResource.id}`, ...(formData.tags || [])],
              })
              .eq('id', cloudDocs.id);

            // 确保文档在"知识库文章"分类中
            try {
              const { getOrCreateCategory, addDocumentToCategory } = await import('../../../services/cloudDocumentService');
              const knowledgeCategory = await getOrCreateCategory('知识库文章', '知识库中的文章类资源');
              await addDocumentToCategory(cloudDocs.id, knowledgeCategory.id);
            } catch (error) {
              console.error('添加到分类失败:', error);
            }
          } else {
            // 如果没找到，创建新的云文档记录
            const { data: newCloudDoc } = await supabase
              .from('cloud_documents')
              .insert({
                title: formData.title,
                content: formData.content || '',
                created_by: currentUser.id,
                status: formData.status === 'published' ? 'published' : 'draft',
                tags: ['KNOWLEDGE_RESOURCE', `KNOWLEDGE_${editingResource.id}`, ...(formData.tags || [])],
              })
              .select()
              .single();

            // 自动添加到"知识库文章"分类
            if (newCloudDoc) {
              try {
                const { getOrCreateCategory, addDocumentToCategory } = await import('../../../services/cloudDocumentService');
                const knowledgeCategory = await getOrCreateCategory('知识库文章', '知识库中的文章类资源');
                await addDocumentToCategory(newCloudDoc.id, knowledgeCategory.id);
              } catch (error) {
                console.error('添加到分类失败:', error);
              }
            }
          }
        } catch (cloudDocError) {
          console.error('同步到云文档失败:', cloudDocError);
          // 不阻止主流程，只记录错误
        }
      }

      await loadResources();
      
      setShowEditModal(false);
      setEditingResource(null);
      
      return true;
    } catch (err: any) {
      console.error('更新资源失败:', err);
      alert('更新失败: ' + err.message);
      return false;
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('knowledge_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== id));
      alert('删除成功！');
    } catch (err: any) {
      console.error('删除失败:', err);
      alert('删除失败: ' + err.message);
    }
  };

  // 处理切换精选状态
  const handleToggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('knowledge_resources')
        .update({ is_featured: !isFeatured })
        .eq('id', id);

      if (error) throw error;

      setResources(prev => prev.map(r => 
        r.id === id ? { ...r, isFeatured: !isFeatured } : r
      ));

      alert(isFeatured ? '已取消精选' : '已设为精选');
    } catch (err: any) {
      console.error('更新失败:', err);
      alert('操作失败: ' + err.message);
    }
  };

  // 筛选资源
  const filteredResources = resources.filter(resource => {
    if (activeResourceTab === 'featured' && !resource.isFeatured) return false;
    if (activeResourceTab === 'bookmarked' && !resource.isBookmarked) return false;
    if (activeResourceTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(resource.updatedAt) < thirtyDaysAgo) return false;
    }

    if (resourceFilters.search) {
      const searchLower = resourceFilters.search.toLowerCase();
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (resourceFilters.category && resourceFilters.category !== '全部分类') {
      if (resource.category !== resourceFilters.category) return false;
    }

    if (resourceFilters.type && resourceFilters.type !== 'all') {
      if (resource.type !== resourceFilters.type) return false;
    }

    return true;
  });

  // 获取分类列表
  const categories = ['全部分类', ...new Set(resources.map(r => r.category))];
  const authors = ['全部作者', ...new Set(resources.map(r => r.authorName))];
  const tags = Array.from(new Set(resources.flatMap(r => r.tags)));

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-indigo-100 shadow-lg">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-100/80">
              <Layers className="h-3.5 w-3.5" />
              知识库中心 · 新版
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight text-white">构建团队内部的知识枢纽</h1>
              <p className="max-w-2xl text-sm text-indigo-100/80">
                统一管理团队内部知识库、模板与协作空间，结合 AI 推荐与治理提醒，确保知识沉淀持续迭代并安全可控。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-indigo-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">智能推荐</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">权限治理</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">跨角色协作</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-white">
                <Sparkles className="h-4 w-4" />
                AI 智能检索
              </button>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2 text-sm text-indigo-100 transition hover:border-white hover:text-white"
              >
                <BookOpen className="h-4 w-4" />
                模板库
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2 text-sm text-indigo-100 transition hover:border-white hover:text-white">
                <BookMarked className="h-4 w-4" />
                查看旧版视图
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white/10 p-6 backdrop-blur">
            <div className="text-xs uppercase tracking-widest text-indigo-100/70">快速搜索</div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-200" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索知识库、模板或负责人…"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-3 text-sm text-white placeholder:text-indigo-200/70 focus:border-white focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              {METRICS.slice(0, 2).map((metric) => (
                <div key={metric.id} className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm">
                  <metric.icon className="mx-auto mb-2 h-4 w-4 text-indigo-200" />
                  <div className="text-xl font-semibold text-white">{metric.value}</div>
                  <div className="mt-1 text-xs text-indigo-100/80">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">快捷动作</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((qa) => (
            <div key={qa.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-white">{qa.title}</div>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{qa.helper}</p>
              <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                {qa.action}
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[160px] flex-col gap-1 rounded-xl px-4 py-2 text-left transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300'
              }`}
            >
              <span className="text-sm font-semibold">{tab.title}</span>
              <span className={`text-xs ${isActive ? 'text-indigo-100/90' : 'text-slate-400 dark:text-slate-500'}`}>
                {tab.helper}
              </span>
            </button>
          );
        })}
      </section>

      {activeTab === 'overview' && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{metric.label}</span>
                  <metric.icon className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{metric.value}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-500 dark:text-emerald-300">
                  <Activity className="h-3 w-3" />
                  {metric.trend}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{metric.helper}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">重点知识空间</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">关注置顶知识库，跟进协作进度。</p>
              </div>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">管理置顶</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {pinnedSpaces.map((space, index) => {
                // 根据索引分配不同的渐变背景
                const gradients = [
                  'bg-gradient-to-b from-white via-pink-50/40 to-purple-100/60',
                  'bg-gradient-to-b from-white via-blue-50/40 to-blue-100/60',
                  'bg-gradient-to-b from-slate-800 via-slate-700 to-orange-600/80',
                  'bg-gradient-to-b from-white via-indigo-50/40 to-indigo-100/60',
                  'bg-gradient-to-b from-white via-emerald-50/40 to-emerald-100/60',
                ];
                const gradient = gradients[index % gradients.length];
                const isDark = index === 2; // 第三个卡片使用深色主题
                
                return (
                  <div
                    key={space.id}
                    className={`group relative flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg dark:border-slate-700 ${gradient} w-[140px] h-[196px] cursor-pointer`}
                  >
                    {/* 左上角标签 */}
                    <div className="absolute top-0 left-2.5 z-10">
                      <div className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[9px] font-semibold text-white shadow-sm">
                        {space.visibility === '内部' ? '内部' : '团队'}
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex flex-1 flex-col p-3 pt-8 relative z-10">
                      <h4 className={`text-base font-bold leading-snug mb-3 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {space.name}
                      </h4>
                      <p className={`text-xs leading-relaxed line-clamp-4 flex-1 ${isDark ? 'text-white/75' : 'text-slate-600'}`}>
                        {space.description}
                      </p>
                    </div>

                    {/* 装饰性背景图标 - 缩小 */}
                    <div className="absolute bottom-0 right-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity pointer-events-none">
                      {space.segment === '顾问团队' && (
                        <BookOpen className="h-14 w-14 text-slate-400 transform rotate-12 translate-x-1 translate-y-1" />
                      )}
                      {space.segment === 'AI 研发' && (
                        <Sparkles className="h-14 w-14 text-blue-400 transform rotate-12 translate-x-1 translate-y-1" />
                      )}
                      {space.segment === '市场运营' && (
                        <Activity className="h-14 w-14 text-purple-400 transform rotate-12 translate-x-1 translate-y-1" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 知识库资源列表 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">知识库资源</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">浏览和管理所有知识库资源</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                上传资源
              </button>
            </div>

            {/* 错误提示 */}
            {resourcesError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {resourcesError}
              </div>
            )}

            {/* 筛选器 */}
            <div className="mb-6">
              <ResourceFilters
                filters={resourceFilters}
                categories={categories}
                authors={authors}
                tags={tags}
                showAdvancedFilters={showAdvancedFilters}
                onFilterChange={(key, value) => setResourceFilters(prev => ({ ...prev, [key]: value }))}
                onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
                onReset={() => setResourceFilters(DEFAULT_FILTERS)}
              />
            </div>

            {/* 统计卡片 */}
            <div className="mb-6">
              <StatsCards stats={resourceStats} />
            </div>

            {/* 资源列表 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800/60">
              {/* 选项卡 */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60">
                <div className="flex items-center gap-3 flex-wrap">
                  {TAB_OPTIONS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveResourceTab(tab.value as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        activeResourceTab === tab.value
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <div className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                    共 {filteredResources.length} 个资源
                  </div>
                </div>
              </div>

              {/* 资源网格 */}
              <div className="p-6">
                {resourcesLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <BookOpen className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          {resources.length === 0 ? '还没有资源' : '没有符合条件的资源'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          {resources.length === 0 
                            ? '点击"上传资源"按钮创建第一个知识库资源'
                            : '尝试调整筛选条件或搜索关键词'
                          }
                        </p>
                        {resources.length === 0 && (
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            创建第一个资源
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onView={handleView}
                        onBookmark={handleBookmark}
                        onDownload={handleDownload}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">最新动态</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">查看全部</button>
            </div>
            <div className="mt-3 space-y-3">
              {UPDATE_FEED.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-300">{item.type}</div>
                  <div className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{item.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{item.owner}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'spaces' && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">知识空间与模板</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">按照业务线与协作角色快速筛选知识库。</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['全部', '顾问团队', '市场运营', 'AI 研发'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    categoryFilter === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpaces.map((space) => (
              <div key={space.id} className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                      {space.segment}
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
                      {space.visibility}
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900 dark:text-white">{space.name}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{space.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>成员 {space.members}</span>
                    <span>知识条目 {space.articles}</span>
                    <span>更新 {space.updatedAt}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                    {space.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                    查看
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <TemplateLibraryModal
        open={isTemplateModalOpen}
        categories={TEMPLATE_CATEGORIES}
        items={TEMPLATE_ITEMS}
        onClose={() => setTemplateModalOpen(false)}
      />

      {/* 创建资源模态框 */}
      <ResourceFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      {/* 编辑资源模态框 */}
      {editingResource && (
        <ResourceFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingResource(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={{
            title: editingResource.title,
            type: editingResource.type,
            category: editingResource.category,
            description: editingResource.description,
            content: editingResource.content,
            tags: editingResource.tags,
            isFeatured: editingResource.isFeatured,
            status: editingResource.status,
            ...(editingResource.fileUrl && { fileUrl: editingResource.fileUrl } as any),
            ...(editingResource.fileSize && { fileSize: editingResource.fileSize } as any),
            ...(editingResource.thumbnailUrl && { thumbnailUrl: editingResource.thumbnailUrl } as any)
          }}
          mode="edit"
        />
      )}
    </div>
  );
};

export default CloudDocsKnowledgePage;

