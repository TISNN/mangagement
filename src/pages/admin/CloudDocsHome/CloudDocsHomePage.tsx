import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FilePlus,
  UploadCloud,
  Users,
  Clock,
  Search,
  FileText,
  Folder,
  Sparkles,
  Loader2,
  MoreVertical,
  Trash2,
  X,
  Plus,
  User,
} from 'lucide-react';
import {
  getCloudDocumentStats,
  formatDocumentStatus,
  deleteDocument,
  getAllDocuments,
  getAllDocumentCategories,
  createCategory,
  deleteCategory,
  addDocumentToCategory,
  removeDocumentFromCategory,
  getDocumentCategories,
  getOrCreateCategory,
  updateDocumentStatus,
  type CloudDocument,
  type CloudDocumentStats,
  type CloudDocumentCategory,
} from '../../../services/cloudDocumentService';
import { formatDateTime } from '../../../utils/dateUtils';
import TemplateLibraryModal, { TemplateCategory, TemplateItem } from '../../../components/knowledge/TemplateLibraryModal';
import { supabase } from '../../../lib/supabase';

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
};

// 类型定义已移至 cloudDocumentService.ts

type FolderShortcut = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: string;
  helper: string;
};


const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-create-doc',
    title: '新建云文档',
    description: '选择协作文档模板，立即开始多人实时编辑。',
    icon: FilePlus,
    actionLabel: '创建文档',
  },
  {
    id: 'qa-upload',
    title: '上传本地文件',
    description: '支持 Word、PDF、PPT 等常见格式，自动同步版本。',
    icon: UploadCloud,
    actionLabel: '上传文件',
  },
  {
    id: 'qa-invite',
    title: '邀请团队协作',
    description: '通过链接或手机号邀请团队成员共用同一空间。',
    icon: Users,
    actionLabel: '邀请成员',
  },
];

// 最近文档和收藏文档将从数据库加载

const FOLDER_SHORTCUTS: FolderShortcut[] = [
  {
    id: 'fs-01',
    title: '我的云盘',
    icon: Folder,
    highlight: '个人空间',
    helper: '草稿、临时存档与个人资料。',
  },
  {
    id: 'fs-02',
    title: '团队协作区',
    icon: Users,
    highlight: '项目协作',
    helper: '项目资料、交付模板、复盘文档。',
  },
];

const statusBadgeMap: Record<'草稿' | '进行中' | '已归档', string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  进行中: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  已归档: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
};


// 模版库数据（与 CloudDocsKnowledgePage 保持一致）
const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'recommend', name: '推荐', icon: Sparkles, count: 12 },
  { id: 'meeting', name: '会议记录', icon: FileText, count: 6 },
  { id: 'project', name: '项目管理', icon: Folder, count: 9 },
  { id: 'okr', name: 'OKR 复盘', icon: FileText, count: 5 },
  { id: 'research', name: '调研复盘', icon: FileText, count: 4 },
  { id: 'application', name: '申请材料', icon: FileText, count: 6 },
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

const CloudDocsHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 数据状态
  const [allDocs, setAllDocs] = useState<CloudDocument[]>([]);
  const [stats, setStats] = useState<CloudDocumentStats>({
    activeDocuments: 0,
    draftDocuments: 0,
    archivedDocuments: 0,
    favoriteDocuments: 0,
  });
  const [categories, setCategories] = useState<CloudDocumentCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [documentCategoriesMap, setDocumentCategoriesMap] = useState<Map<number, CloudDocumentCategory[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showRemoveCategoryModal, setShowRemoveCategoryModal] = useState(false);
  const [documentToRemoveCategory, setDocumentToRemoveCategory] = useState<number | null>(null);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [showStatusMenuId, setShowStatusMenuId] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedDocumentId, setDraggedDocumentId] = useState<number | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOverDocumentList, setIsDragOverDocumentList] = useState(false);
  const [isDragOverUploadModal, setIsDragOverUploadModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncingMeetings, setSyncingMeetings] = useState(false);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId && !showStatusMenuId) return;
      
      // 检查主菜单
      if (openMenuId) {
        const activeMenu = menuRefs.current[openMenuId];
        if (activeMenu && !activeMenu.contains(event.target as Node)) {
          setOpenMenuId(null);
          setShowStatusMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, showStatusMenuId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 并行加载所有数据
      const [allDocuments, statistics, allCategories] = await Promise.all([
        getAllDocuments({ 
          categoryId: selectedCategoryId || undefined,
          search: searchTerm || undefined,
          studentId: selectedStudentId || undefined,
        }),
        getCloudDocumentStats(),
        getAllDocumentCategories(),
      ]);

      setAllDocs(allDocuments);
      setStats(statistics);
      setCategories(allCategories);

      // 加载每个文档的分类信息
      const categoriesMap = new Map<number, CloudDocumentCategory[]>();
      await Promise.all(
        allDocuments.map(async (doc) => {
          try {
            const docCategories = await getDocumentCategories(doc.id);
            categoriesMap.set(doc.id, docCategories);
          } catch (error) {
            console.error(`获取文档 ${doc.id} 的分类失败:`, error);
            categoriesMap.set(doc.id, []);
          }
        })
      );
      setDocumentCategoriesMap(categoriesMap);
    } catch (err) {
      console.error('加载云文档数据失败:', err);
      setError('加载数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  // 从URL参数获取studentId
  useEffect(() => {
    const studentIdParam = searchParams.get('studentId');
    if (studentIdParam) {
      setSelectedStudentId(parseInt(studentIdParam));
    }
  }, [searchParams]);

  // 加载学生列表
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('加载学生列表失败:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // 加载数据
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, searchTerm, selectedStudentId]);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'qa-create-doc': {
        // 构建URL参数
        const params = new URLSearchParams();
        if (selectedStudentId) {
          params.append('studentId', selectedStudentId.toString());
        }
        // 如果当前有选中的分类，传递分类ID
        if (selectedCategoryId) {
          params.append('categoryId', selectedCategoryId.toString());
        }
        const queryString = params.toString();
        navigate(`/admin/cloud-docs/documents/new${queryString ? `?${queryString}` : ''}`);
        break;
      }
      case 'qa-upload':
        setShowUploadModal(true);
        break;
      case 'qa-invite':
        // TODO: 实现邀请团队功能
        alert('邀请团队功能开发中...');
        break;
      case 'qa-template':
        setTemplateModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDocumentClick = (docId: number) => {
    // 如果正在拖拽，不触发点击
    if (isDragging) {
      return;
    }
    // 默认在新标签页打开
    const url = `/admin/cloud-docs/documents/${docId}`;
    const fullUrl = window.location.origin + url;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteDocument = async (docId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (!confirm('确定要删除这个文档吗？此操作不可恢复。')) {
      return;
    }

    try {
      await deleteDocument(docId);
      // 重新加载数据
      await loadData();
      setOpenMenuId(null);
    } catch (error) {
      console.error('删除文档失败:', error);
      alert('删除文档失败: ' + (error as Error).message);
    }
  };

  const handleOpenRemoveCategoryModal = async (docId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);

    // 获取文档的分类信息
    const docCategories = documentCategoriesMap.get(docId) || [];
    
    // 如果只有一个分类，直接移除
    if (docCategories.length === 1) {
      try {
        await removeDocumentFromCategory(docId, docCategories[0].id);
        // 更新文档的分类信息
        const updatedCategories = await getDocumentCategories(docId);
        setDocumentCategoriesMap(prev => {
          const newMap = new Map(prev);
          newMap.set(docId, updatedCategories);
          return newMap;
        });
      } catch (error) {
        console.error('移除分类失败:', error);
        alert('移除分类失败: ' + (error as Error).message);
      }
    } else {
      // 多个分类时，打开模态框让用户选择
      setDocumentToRemoveCategory(docId);
      setShowRemoveCategoryModal(true);
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    if (!documentToRemoveCategory) return;

    try {
      await removeDocumentFromCategory(documentToRemoveCategory, categoryId);
      // 更新文档的分类信息
      const docCategories = await getDocumentCategories(documentToRemoveCategory);
      setDocumentCategoriesMap(prev => {
        const newMap = new Map(prev);
        newMap.set(documentToRemoveCategory, docCategories);
        return newMap;
      });
      setShowRemoveCategoryModal(false);
      setDocumentToRemoveCategory(null);
    } catch (error) {
      console.error('移除分类失败:', error);
      alert('移除分类失败: ' + (error as Error).message);
    }
  };

  const handleUpdateStatus = async (docId: number, newStatus: 'draft' | 'published' | 'archived', e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setShowStatusMenuId(null);

    try {
      await updateDocumentStatus(docId, newStatus);
      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error('更新文档状态失败:', error);
      alert('更新文档状态失败: ' + (error as Error).message);
    }
  };

  const handleMenuToggle = (docId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    setOpenMenuId(openMenuId === docId ? null : docId);
  };

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      alert('请输入分类名称');
      return;
    }

    // 检查分类是否已存在
    if (categories.some(cat => cat.name === trimmedName)) {
      alert('该分类已存在');
      return;
    }

    try {
      // 创建分类到数据库
      const newCategory = await createCategory(trimmedName);
      
      // 更新分类列表
      setCategories([...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      
      setNewCategoryName('');
      setShowAddCategoryModal(false);
      
      // 自动选中新创建的分类
      setSelectedCategoryId(newCategory.id);
    } catch (err) {
      console.error('创建分类失败:', err);
      alert('创建分类失败: ' + (err as Error).message);
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    if (!confirm(`确定要删除分类"${categoryName}"吗？此操作将移除该分类下的所有文档关联，但不会删除文档本身。`)) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      
      // 更新分类列表
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      // 如果删除的是当前选中的分类，重置选择
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      }
    } catch (err) {
      console.error('删除分类失败:', err);
      alert('删除分类失败: ' + (err as Error).message);
    }
  };

  const handleOpenAddCategoryModal = () => {
    setNewCategoryName('');
    setShowAddCategoryModal(true);
  };

  // 文件上传处理（支持事件和直接传入文件）
  const handleFileUpload = async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    const file = fileOrEvent instanceof File ? fileOrEvent : fileOrEvent.target.files?.[0];
    if (!file) return;

    // 验证文件大小（最大 100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('文件大小不能超过 100MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 获取当前用户信息
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        throw new Error('用户信息获取失败');
      }
      const employee = JSON.parse(employeeData);

      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomString}.${fileExt}`;
      const filePath = `cloud-docs/${fileName}`;

      // 上传文件到 Storage
      const { error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`文件上传失败: ${uploadError.message}`);
      }

      setUploadProgress(50);

      // 获取文件公开 URL
      const { data: urlData } = supabase.storage
        .from('knowledge-files')
        .getPublicUrl(filePath);

      setUploadProgress(75);

      // 根据文件类型生成内容
      let content = '';
      const fileType = file.type || '';
      
      if (fileType.includes('pdf')) {
        content = `<iframe src="${urlData.publicUrl}" style="width: 100%; height: 800px; border: none;"></iframe>`;
      } else if (fileType.includes('image')) {
        content = `<img src="${urlData.publicUrl}" alt="${file.name}" style="max-width: 100%; height: auto;" />`;
      } else if (fileType.includes('word') || fileType.includes('document')) {
        // Word 文档使用 Office Online 查看器
        content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlData.publicUrl)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
      } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
        content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlData.publicUrl)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
      } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
        content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlData.publicUrl)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
      } else {
        // 其他文件类型，提供下载链接
        content = `<p>文件已上传：<a href="${urlData.publicUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a></p>`;
      }

      // 创建云文档记录
      const { data: documentData, error: docError } = await supabase
        .from('cloud_documents')
        .insert({
          title: file.name,
          content: content,
          created_by: employee.id,
          status: 'draft',
          tags: [fileExt?.toUpperCase() || 'FILE'],
          student_id: selectedStudentId || null,
        })
        .select()
        .single();

      if (docError) {
        throw new Error(`创建文档记录失败: ${docError.message}`);
      }

      // 如果当前有选中的分类，自动将文档添加到该分类
      if (documentData && selectedCategoryId) {
        try {
          await addDocumentToCategory(documentData.id, selectedCategoryId);
          console.log('上传的文档已自动添加到分类:', selectedCategoryId);
        } catch (categoryError) {
          console.error('添加文档到分类失败:', categoryError);
          // 不阻止主流程，只记录错误
        }
      }

      setUploadProgress(100);

      // 刷新数据
      await loadData();

      // 关闭模态框并重置
      setShowUploadModal(false);
      setUploadProgress(0);
      
      // 可选：跳转到新创建的文档
      if (documentData) {
        // 在新标签页打开新创建的文档
        const url = `/admin/cloud-docs/documents/${documentData.id}`;
        const fullUrl = window.location.origin + url;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('上传文件失败:', error);
      alert('上传文件失败: ' + (error as Error).message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // 重置文件输入（如果是通过 input 触发的）
      if (fileOrEvent instanceof Event && 'target' in fileOrEvent && fileOrEvent.target) {
        (fileOrEvent.target as HTMLInputElement).value = '';
      }
    }
  };

  // 文档列表区域拖拽处理
  const handleDocumentListDragOver = (e: React.DragEvent) => {
    // 检查是否是文件拖拽（不是文档拖拽）
    if (e.dataTransfer.types.includes('Files') && !draggedDocumentId) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOverDocumentList(true);
    }
  };

  const handleDocumentListDragLeave = (e: React.DragEvent) => {
    // 只有当不是文档拖拽时才处理
    if (!draggedDocumentId) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverDocumentList(false);
    }
  };

  const handleDocumentListDrop = async (e: React.DragEvent) => {
    // 如果是文档拖拽，不处理文件上传
    if (draggedDocumentId) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setIsDragOverDocumentList(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // 只处理第一个文件
    const file = files[0];
    await handleFileUpload(file);
  };

  // 上传模态框拖拽处理
  const handleUploadModalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOverUploadModal(true);
    }
  };

  const handleUploadModalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverUploadModal(false);
  };

  const handleUploadModalDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverUploadModal(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    await handleFileUpload(file);
  };

  // 同步会议文档到云文档
  const handleSyncMeetingDocuments = async () => {
    if (!confirm('确定要同步所有会议文档到云文档吗？这可能会创建重复的文档。')) {
      return;
    }

    setSyncingMeetings(true);
    try {
      // 获取所有会议文档
      const { data: meetingDocs, error: meetingDocsError } = await supabase
        .from('meeting_documents')
        .select('*');

      if (meetingDocsError) {
        console.error('查询会议文档失败:', meetingDocsError);
        throw meetingDocsError;
      }

      if (!meetingDocs || meetingDocs.length === 0) {
        alert('没有找到需要同步的会议文档。');
        return;
      }

      // 获取或创建"会议纪要"分类
      const meetingCategory = await getOrCreateCategory('会议纪要', '会议相关文档和纪要');

      let syncedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      // 遍历每个会议文档
      for (const meetingDoc of meetingDocs) {
        try {
          // 检查是否已经存在对应的云文档
          const { data: existingDocs } = await supabase
            .from('cloud_documents')
            .select('id')
            .contains('tags', [`MEETING_${meetingDoc.id}`]);

          if (existingDocs && existingDocs.length > 0) {
            skippedCount++;
            continue; // 已存在，跳过
          }

          // 创建云文档记录
          const { data: newCloudDoc, error: docError } = await supabase
            .from('cloud_documents')
            .insert({
              title: meetingDoc.title,
              content: meetingDoc.content || '',
              created_by: meetingDoc.created_by || 1,
              status: 'draft',
              tags: ['MEETING_DOC', `MEETING_${meetingDoc.id}`],
            })
            .select()
            .single();

          if (docError) {
            console.error(`同步会议文档 ${meetingDoc.id} 失败:`, docError);
            errorCount++;
            continue;
          }

          // 添加到"会议纪要"分类
          if (newCloudDoc) {
            try {
              await addDocumentToCategory(newCloudDoc.id, meetingCategory.id);
              syncedCount++;
            } catch (categoryError) {
              console.error(`添加分类失败:`, categoryError);
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`处理会议文档 ${meetingDoc.id} 时出错:`, error);
          errorCount++;
        }
      }

      // 刷新数据
      await loadData();

      alert(`同步完成！\n成功: ${syncedCount} 个\n跳过: ${skippedCount} 个\n失败: ${errorCount} 个`);
    } catch (error) {
      console.error('同步会议文档失败:', error);
      alert('同步失败: ' + (error as Error).message);
    } finally {
      setSyncingMeetings(false);
    }
  };

  // 同步知识库资源到云文档（包括文章和文档）
  const handleSyncKnowledgeArticles = async () => {
    if (!confirm('确定要同步所有知识库文章和文档到云文档吗？这可能会创建重复的文档。')) {
      return;
    }

    setSyncing(true);
    try {
      // 先查询所有资源，看看有哪些类型
      const { data: allResources, error: allResourcesError } = await supabase
        .from('knowledge_resources')
        .select('id, title, type, status');

      if (allResourcesError) {
        console.error('查询所有资源失败:', allResourcesError);
        throw allResourcesError;
      }

      // 统计各类型资源数量
      const typeCounts = (allResources || []).reduce((acc: Record<string, number>, resource: { type: string }) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
      }, {});

      console.log('知识库资源统计:', typeCounts);
      console.log('所有资源:', allResources);

      // 获取所有文章和文档类型的知识库资源（包括所有状态）
      const { data: resources, error: resourcesError } = await supabase
        .from('knowledge_resources')
        .select('*')
        .in('type', ['article', 'document']);

      if (resourcesError) {
        console.error('查询资源失败:', resourcesError);
        throw resourcesError;
      }

      console.log('找到的资源:', resources);

      if (!resources || resources.length === 0) {
        const message = `没有找到需要同步的知识库资源（文章或文档）。\n\n知识库资源统计：\n${Object.entries(typeCounts).map(([type, count]) => `- ${type}: ${count} 个`).join('\n')}\n\n请确认知识库中是否有 type='article' 或 type='document' 的资源。`;
        alert(message);
        return;
      }

      // 获取或创建分类
      const articleCategory = await getOrCreateCategory('知识库文章', '知识库中的文章类资源');
      const documentCategory = await getOrCreateCategory('知识库文档', '知识库中的文档类资源');

      let syncedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      // 遍历每个资源
      for (const resource of resources) {
        try {
          // 检查是否已经存在对应的云文档
          const { data: existingDocs } = await supabase
            .from('cloud_documents')
            .select('id')
            .contains('tags', [`KNOWLEDGE_${resource.id}`]);

          if (existingDocs && existingDocs.length > 0) {
            skippedCount++;
            continue; // 已存在，跳过
          }

          // 根据资源类型生成内容
          let content = resource.content || '';
          
          // 如果是文档类型且有文件URL，生成文件预览内容
          if (resource.type === 'document' && resource.file_url) {
            const fileType = resource.file_url.toLowerCase();
            if (fileType.includes('.pdf')) {
              content = `<iframe src="${resource.file_url}" style="width: 100%; height: 800px; border: none;"></iframe>`;
            } else if (fileType.includes('.doc') || fileType.includes('.docx')) {
              content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.file_url)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
            } else if (fileType.includes('.xls') || fileType.includes('.xlsx')) {
              content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.file_url)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
            } else if (fileType.includes('.ppt') || fileType.includes('.pptx')) {
              content = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.file_url)}" style="width: 100%; height: 800px; border: none;"></iframe>`;
            } else {
              content = `<p>文档已上传：<a href="${resource.file_url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></p>`;
            }
          }

          // 创建云文档记录
          const { data: newCloudDoc, error: docError } = await supabase
            .from('cloud_documents')
            .insert({
              title: resource.title,
              content: content,
              created_by: resource.created_by || resource.author_id || 1, // 使用创建者ID，如果没有则使用默认值
              status: resource.status === 'published' ? 'published' : 'draft',
              tags: ['KNOWLEDGE_RESOURCE', `KNOWLEDGE_${resource.id}`, ...(resource.tags || [])],
            })
            .select()
            .single();

          if (docError) {
            console.error(`同步资源 ${resource.id} 失败:`, docError);
            errorCount++;
            continue;
          }

          // 根据类型添加到对应分类
          if (newCloudDoc) {
            try {
              const targetCategory = resource.type === 'article' ? articleCategory : documentCategory;
              await addDocumentToCategory(newCloudDoc.id, targetCategory.id);
              syncedCount++;
            } catch (categoryError) {
              console.error(`添加分类失败:`, categoryError);
              // 即使分类添加失败，文档已创建，也算成功
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`处理资源 ${resource.id} 时出错:`, error);
          errorCount++;
        }
      }

      // 刷新数据
      await loadData();

      alert(`同步完成！\n成功: ${syncedCount} 个\n跳过: ${skippedCount} 个\n失败: ${errorCount} 个`);
    } catch (error) {
      console.error('同步知识库文章失败:', error);
      alert('同步失败: ' + (error as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  // 拖拽处理函数（文档拖拽）
  const handleDragStart = (documentId: number, e: React.DragEvent) => {
    e.stopPropagation();
    // 确保不是文件拖拽
    if (!e.dataTransfer.types.includes('Files')) {
      setDraggedDocumentId(documentId);
      setIsDragging(true);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', documentId.toString());
    }
  };

  const handleDragEnd = () => {
    setDraggedDocumentId(null);
    setDragOverCategoryId(null);
    // 延迟重置，避免触发点击事件
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleDragOver = (categoryId: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategoryId(categoryId);
  };

  const handleDragLeave = () => {
    setDragOverCategoryId(null);
  };

  const handleDrop = async (categoryId: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const documentId = draggedDocumentId || parseInt(e.dataTransfer.getData('text/plain'));
    
    if (!documentId || !categoryId) {
      setDragOverCategoryId(null);
      return;
    }

    try {
      await addDocumentToCategory(documentId, categoryId);
      // 静默更新文档的分类信息
      const docCategories = await getDocumentCategories(documentId);
      setDocumentCategoriesMap(prev => {
        const newMap = new Map(prev);
        newMap.set(documentId, docCategories);
        return newMap;
      });
    } catch (error) {
      console.error('添加文档到分类失败:', error);
      // 静默失败，不显示提示
    } finally {
      setDraggedDocumentId(null);
      setDragOverCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-lg">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
              云文档中心
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight">以项目为核心的文档协作控制台</h1>
              <p className="max-w-2xl text-sm text-indigo-100/80">
                将服务文档和运营项目集中管理。支持多角色权限、实时协作与统一动态，让团队协作更高效。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-indigo-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">👥 团队协作</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🗂️ 多维度目录管理</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🛡️ 版本与权限留痕</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-6 text-indigo-50">
            <div className="text-sm uppercase tracking-widest text-indigo-100/70">今日概览</div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-200" />
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-4 text-center text-xl font-semibold">
              <div>
                  <div>{stats.activeDocuments}</div>
                <div className="mt-1 text-xs font-normal text-indigo-100/70">活跃协作文档</div>
              </div>
              <div>
                  <div>{stats.draftDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">草稿文档</div>
              </div>
              <div>
                  <div>{stats.archivedDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">已归档文档</div>
              </div>
              <div>
                  <div>{stats.favoriteDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">收藏文档</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FOLDER_SHORTCUTS.map((folder) => {
          const Icon = folder.icon;
          return (
            <div key={folder.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">{folder.title}</span>
                </div>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                  {folder.highlight}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{folder.helper}</p>
            </div>
          );
        })}
      </section>

      {/* 合并的常用目录和全部文档区域 */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex gap-8 p-8 min-h-[1200px]">
          {/* 左侧：常用目录入口 - 竖着排列 */}
          <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 pr-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">全部分类</h2>
              <button
                onClick={handleOpenAddCategoryModal}
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
                title="添加分类"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {/* 全部文档选项 */}
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`w-full flex items-center gap-3 rounded-xl border p-3 text-sm text-left transition ${
                  selectedCategoryId === null
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Folder className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">全部文档</span>
              </button>
              {/* 分类列表 */}
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                </div>
              ) : categories.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  暂无分类
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    onDragOver={(e) => handleDragOver(category.id, e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(category.id, e)}
                    className={`group flex items-center gap-2 rounded-xl border p-3 text-sm transition-all duration-200 ${
                      selectedCategoryId === category.id
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300'
                        : dragOverCategoryId === category.id
                        ? 'border-indigo-400 bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-900/40 ring-2 ring-indigo-300 dark:ring-indigo-600 scale-105 shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        // 如果正在拖拽，不触发选择
                        if (isDragging) {
                          e.preventDefault();
                          return;
                        }
                        setSelectedCategoryId(category.id);
                      }}
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                    >
                      <Folder className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id, category.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                      title="删除分类"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 右侧：全部文档列表 */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 mb-5 dark:border-slate-700">
              {/* 标题和搜索行 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedCategoryId 
                    ? categories.find(cat => cat.id === selectedCategoryId)?.name || '全部文档'
                    : '全部文档'}
                  {searchTerm && (
                    <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                      (搜索: {searchTerm})
                    </span>
                  )}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {selectedCategoryId 
                    ? `显示 ${categories.find(cat => cat.id === selectedCategoryId)?.name || ''} 分类下的所有文档${searchTerm || selectedStudentId ? '（已筛选）' : ''}` 
                    : selectedStudentId
                    ? `显示 ${students.find(s => s.id === selectedStudentId)?.name || ''} 的文档${searchTerm ? '（已筛选）' : ''}`
                    : '按最近修改时间排序的所有文档'}
                </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  {/* 学生筛选 */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedStudentId || ''}
                      onChange={(e) => {
                        const studentId = e.target.value ? parseInt(e.target.value) : null;
                        setSelectedStudentId(studentId);
                        // 更新URL参数
                        if (studentId) {
                          searchParams.set('studentId', studentId.toString());
                        } else {
                          searchParams.delete('studentId');
                        }
                        setSearchParams(searchParams);
                      }}
                      className="pl-10 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                      disabled={loadingStudents}
                    >
                      <option value="">全部学生</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 搜索框 */}
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索文档名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-10 py-2 text-sm border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label="清除搜索"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* 快速操作按钮 */}
              <div className="flex items-center gap-3 flex-wrap">
                {QUICK_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleQuickAction(item.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-indigo-500" />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
                {/* 模板库按钮 */}
                <button
                  onClick={() => handleQuickAction('qa-template')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span>模板库</span>
                </button>
                {/* 同步知识库资源按钮 */}
                <button
                  onClick={handleSyncKnowledgeArticles}
                  disabled={syncing}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 text-indigo-500" />
                  )}
                  <span>{syncing ? '同步中...' : '同步知识库资源'}</span>
                </button>
                {/* 同步会议文档按钮 */}
                <button
                  onClick={handleSyncMeetingDocuments}
                  disabled={syncingMeetings}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncingMeetings ? (
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 text-indigo-500" />
                  )}
                  <span>{syncingMeetings ? '同步中...' : '同步会议文档'}</span>
                </button>
              </div>
            </div>
            <div 
              className={`flex-1 min-h-[600px] relative transition-all duration-200 ${
                isDragOverDocumentList 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg' 
                  : ''
              }`}
              onDragOver={handleDocumentListDragOver}
              onDragLeave={handleDocumentListDragLeave}
              onDrop={handleDocumentListDrop}
            >
              {isDragOverDocumentList && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-50/90 dark:bg-indigo-900/40 rounded-lg border-2 border-dashed border-indigo-400">
                  <div className="text-center">
                    <UploadCloud className="h-12 w-12 text-indigo-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">释放文件以上传</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">支持 PDF、Word、Excel、PPT、图片等格式</p>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
              ) : error ? (
                <div className="px-6 py-20 text-center text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              ) : allDocs.length === 0 ? (
                <div className="px-6 py-20 text-center text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm 
                    ? `未找到包含"${searchTerm}"的文档${selectedCategoryId ? `（在 ${categories.find(cat => cat.id === selectedCategoryId)?.name || ''} 分类中）` : ''}`
                    : selectedCategoryId 
                      ? `该分类下暂无文档` 
                      : '暂无文档，点击"新建云文档"开始创建'}
                </div>
              ) : (
                <div>
                  {/* 表头 */}
                  <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-[1fr_140px_120px_80px_40px] gap-3 items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <span>名称</span>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>修改时间</span>
                      </div>
                      <div className="hidden lg:block">
                        <span>所有者</span>
                      </div>
                      <div className="text-center">
                        <span>状态</span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  {/* 文档列表 */}
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {allDocs.map((doc) => {
                      const status = formatDocumentStatus(doc.status);
                      const isMenuOpen = openMenuId === doc.id;
                      return (
                        <div
                          key={doc.id}
                          draggable
                          onDragStart={(e) => handleDragStart(doc.id, e)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleDocumentClick(doc.id)}
                          className={`grid grid-cols-[1fr_140px_120px_80px_40px] gap-3 items-center px-6 py-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 relative border-b border-slate-200 dark:border-slate-800 last:border-b-0 ${
                            draggedDocumentId === doc.id ? 'opacity-40 cursor-grabbing scale-95' : 'cursor-grab active:scale-98'
                          }`}
                        >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-slate-900 dark:text-white truncate">{doc.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {(() => {
                              const docCategories = documentCategoriesMap.get(doc.id) || [];
                              if (docCategories.length > 0) {
                                return docCategories.map(cat => cat.name).join('、');
                              }
                              return '未分类';
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{formatDateTime(new Date(doc.updated_at))}</span>
                      </div>
                      <div className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 truncate">
                        {doc.creator?.name || '未知用户'}
                      </div>
                      <div className="flex justify-center">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadgeMap[status]}`}>
                          {status}
                        </span>
                      </div>
                      {/* 更多选项按钮 */}
                      <div className="flex justify-end">
                        <div className="relative" ref={(el) => (menuRefs.current[doc.id] = el)}>
                          <button
                            onClick={(e) => handleMenuToggle(doc.id, e)}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="更多选项"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          {/* 下拉菜单 */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                              {(() => {
                                const docCategories = documentCategoriesMap.get(doc.id) || [];
                                const currentStatus = doc.status;
                                return (
                                  <>
                                    {/* 修改状态选项 */}
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowStatusMenuId(showStatusMenuId === doc.id ? null : doc.id);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                                      >
                                        <span className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          修改状态
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeMap[formatDocumentStatus(currentStatus)]}`}>
                                          {formatDocumentStatus(currentStatus)}
                                        </span>
                                      </button>
                                      {/* 状态子菜单 */}
                                      {showStatusMenuId === doc.id && (
                                        <div className="absolute left-full top-0 ml-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                                          {currentStatus !== 'draft' && (
                                            <button
                                              onClick={(e) => handleUpdateStatus(doc.id, 'draft', e)}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                              草稿
                                            </button>
                                          )}
                                          {currentStatus !== 'published' && (
                                            <button
                                              onClick={(e) => handleUpdateStatus(doc.id, 'published', e)}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                              进行中
                                            </button>
                                          )}
                                          {currentStatus !== 'archived' && (
                                            <button
                                              onClick={(e) => handleUpdateStatus(doc.id, 'archived', e)}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                              已归档
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                                    {docCategories.length > 0 && (
                                      <button
                                        onClick={(e) => handleOpenRemoveCategoryModal(doc.id, e)}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                                      >
                                        <Folder className="h-4 w-4" />
                                        移除分类
                                      </button>
                                    )}
                                    <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                                    <button
                                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      删除文档
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 添加分类模态框 */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">添加新分类</h3>
                <button
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName('');
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="关闭"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    分类名称
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                    placeholder="请输入分类名称"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    提示：创建文档时可以选择此分类
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCategoryName('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 移除分类模态框 */}
      {showRemoveCategoryModal && documentToRemoveCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">移除分类</h3>
                <button
                  onClick={() => {
                    setShowRemoveCategoryModal(false);
                    setDocumentToRemoveCategory(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="关闭"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    选择要移除的分类：
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(() => {
                      const docCategories = documentCategoriesMap.get(documentToRemoveCategory) || [];
                      if (docCategories.length === 0) {
                        return (
                          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                            该文档暂无分类
                          </div>
                        );
                      }
                      return docCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleRemoveCategory(category.id)}
                          className="w-full flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Folder className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                          <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">
                            {category.name}
                          </span>
                          <X className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模版库模态框 */}
      <TemplateLibraryModal
        open={isTemplateModalOpen}
        categories={TEMPLATE_CATEGORIES}
        items={TEMPLATE_ITEMS}
        onClose={() => setTemplateModalOpen(false)}
      />

      {/* 上传文件模态框 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className={`relative w-full max-w-md rounded-2xl border shadow-xl transition-all duration-200 ${
              isDragOverUploadModal
                ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/40 ring-2 ring-indigo-300 dark:ring-indigo-600'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
            }`}
            onDragOver={handleUploadModalDragOver}
            onDragLeave={handleUploadModalDragLeave}
            onDrop={handleUploadModalDrop}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">上传本地文件</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadProgress(0);
                    setIsDragOverUploadModal(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label="关闭"
                  disabled={uploading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {isDragOverUploadModal ? (
                  <div className="border-2 border-dashed border-indigo-400 rounded-lg p-12 text-center bg-indigo-50/50 dark:bg-indigo-900/20">
                    <UploadCloud className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">释放文件以上传</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">支持 PDF、Word、Excel、PPT、图片等格式</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        选择文件或拖拽文件到此处
                      </label>
                      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                        <UploadCloud className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          拖拽文件到此处，或
                        </p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer transition-colors">
                          <FileText className="h-4 w-4" />
                          点击选择文件
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp"
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        支持 PDF、Word、Excel、PPT、图片等格式，最大 100MB
                      </p>
                    </div>
                  </>
                )}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>上传中...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudDocsHomePage;

