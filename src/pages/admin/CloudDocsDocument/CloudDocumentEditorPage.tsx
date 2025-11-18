/**
 * 云文档编辑页面
 * 独立的富文本编辑器页面,用于创建和编辑云文档
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Loader2, 
  X,
  User,
  Search,
  FileText,
  Home,
  HardDrive,
  BookMarked,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import DocumentEditor from '../../../components/DocumentEditor';
import DocumentSelector from '../../../components/DocumentSelector';
import DocumentAnnotationPanel from '../../../components/DocumentAnnotationPanel';
import { 
  getAllDocuments, 
  addDocumentToCategory,
  type CloudDocument 
} from '../../../services/cloudDocumentService';

export default function CloudDocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(isEditMode && id ? parseInt(id) : null);
  
  // 学生关联
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // 分类关联（从URL参数获取）
  const [defaultCategoryId, setDefaultCategoryId] = useState<number | null>(null);

  // 批注相关状态
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // 并排编辑相关状态
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [secondDocumentId, setSecondDocumentId] = useState<number | null>(null);
  const [secondTitle, setSecondTitle] = useState('');
  const [secondContent, setSecondContent] = useState('');
  const [secondSaving, setSecondSaving] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [secondLastSaved, setSecondLastSaved] = useState<Date | null>(null);

  // 左侧文档列表相关状态
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 加载当前用户信息
  useEffect(() => {
    const employeeData = localStorage.getItem('currentEmployee');
    if (employeeData) {
      try {
        const employee = JSON.parse(employeeData);
        setCurrentUserId(employee.id);
        setCurrentUserName(employee.name || '未知用户');
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  // 从URL参数获取studentId和categoryId
  useEffect(() => {
    const studentIdParam = searchParams.get('studentId');
    if (studentIdParam) {
      setSelectedStudentId(parseInt(studentIdParam));
    }
    
    const categoryIdParam = searchParams.get('categoryId');
    if (categoryIdParam) {
      setDefaultCategoryId(parseInt(categoryIdParam));
    }
  }, [searchParams]);

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

  // 加载文档列表
  const loadDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      const docs = await getAllDocuments({
        search: searchTerm || undefined,
        limit: 100, // 限制显示数量
      });
      setDocuments(docs);
    } catch (error) {
      console.error('加载文档列表失败:', error);
    } finally {
      setLoadingDocuments(false);
    }
  }, [searchTerm]);

  // 加载学生列表
  useEffect(() => {
    loadStudents();
  }, []);

  // 加载文档列表
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // 当文档ID变化时，刷新文档列表（确保当前文档在列表中）
  useEffect(() => {
    if (documentId) {
      loadDocuments();
    }
  }, [documentId, loadDocuments]);

  // 切换文档
  const handleDocumentSwitch = (docId: number) => {
    if (docId === documentId) return; // 如果点击的是当前文档，不切换
    
    // 导航到新文档
    navigate(`/admin/cloud-docs/documents/${docId}`);
  };

  useEffect(() => {
    if (isEditMode && id) {
      loadDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 加载第二个文档
  useEffect(() => {
    if (secondDocumentId) {
      loadSecondDocument(secondDocumentId);
    }
  }, [secondDocumentId]);

  const loadDocument = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cloud_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content || '');
        setDocumentId(data.id);
        setSelectedStudentId(data.student_id || null);
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('加载文档失败:', error);
      alert('加载文档失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  const loadSecondDocument = async (docId: number) => {
    setSecondLoading(true);
    try {
      const { data, error } = await supabase
        .from('cloud_documents')
        .select('*')
        .eq('id', docId)
        .single();

      if (error) throw error;

      if (data) {
        setSecondTitle(data.title);
        setSecondContent(data.content || '');
        if (data.updated_at) {
          setSecondLastSaved(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('加载第二个文档失败:', error);
      alert('加载第二个文档失败,请重试');
      setSecondDocumentId(null);
    } finally {
      setSecondLoading(false);
    }
  };


  const handleSelectSecondDocument = (documentId: number | null) => {
    if (documentId === null) {
      // 创建新文档
      handleCreateNewDocumentForSplit();
    } else {
      // 选择已有文档
      setSecondDocumentId(documentId);
    }
  };

  const handleCreateNewDocumentForSplit = async () => {
    try {
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        alert('用户信息获取失败');
        return;
      }

      const employee = JSON.parse(employeeData);

      // 创建新文档
      const { data, error } = await supabase
        .from('cloud_documents')
        .insert({
          title: '无标题文档',
          content: '',
          created_by: employee.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSecondDocumentId(data.id);
        setSecondTitle('无标题文档');
        setSecondContent('');
        setSecondLastSaved(new Date());
        
        // 如果指定了默认分类，自动将文档添加到该分类
        if (defaultCategoryId) {
          try {
            await addDocumentToCategory(data.id, defaultCategoryId);
            console.log('文档已自动添加到分类:', defaultCategoryId);
          } catch (categoryError) {
            console.error('添加文档到分类失败:', categoryError);
            // 不阻止主流程，只记录错误
          }
        }
      }
    } catch (error) {
      console.error('创建新文档失败:', error);
      alert('创建新文档失败: ' + (error as Error).message);
    }
  };

  const handleCloseSecondDocument = () => {
    setSecondDocumentId(null);
    setSecondTitle('');
    setSecondContent('');
    setSecondLastSaved(null);
  };
  
  // 实时自动保存（使用防抖，2秒延迟）
  useEffect(() => {
    // 如果是新建模式且标题和内容都为空，不保存
    if (!isEditMode && !title.trim() && !content.trim()) return;
    
    // 如果是编辑模式但还没有文档ID，不保存（等待首次保存创建文档）
    if (isEditMode && !documentId) return;
    
    const timer = setTimeout(() => {
      // 静默自动保存
      handleAutoSave();
    }, 2000); // 2秒防抖延迟
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, selectedStudentId]);

  // 第二个文档实时自动保存
  useEffect(() => {
    if (!secondDocumentId || !secondTitle.trim()) return;
    
    const timer = setTimeout(() => {
      handleSecondAutoSave();
    }, 2000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondContent, secondTitle, secondDocumentId]);

  // 自动保存函数（不显示错误提示，静默保存）
  const handleAutoSave = async () => {
    // 如果标题为空，使用默认标题
    const finalTitle = title.trim() || '无标题文档';
    
    // 如果正在保存，跳过
    if (saving) return;

    setSaving(true);
    try {
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        console.error('用户信息获取失败');
        return;
      }

      const employee = JSON.parse(employeeData);

      if (documentId) {
        // 更新现有文档
        const { error } = await supabase
          .from('cloud_documents')
          .update({
            title: finalTitle,
            content,
            student_id: selectedStudentId || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentId);

        if (error) {
          console.error('自动保存失败:', error);
          return;
        }
        setLastSaved(new Date());
      } else {
        // 创建新文档
        const { data, error } = await supabase
          .from('cloud_documents')
          .insert({
            title: finalTitle,
            content,
            created_by: employee.id,
            status: 'draft',
            student_id: selectedStudentId || null,
          })
          .select()
          .single();

        if (error) {
          console.error('自动保存失败:', error);
          return;
        }
        
        setLastSaved(new Date());
        
        // 创建成功后设置文档ID
        if (data) {
          setDocumentId(data.id);
          // 更新URL但不刷新页面
          window.history.replaceState({}, '', `/admin/cloud-docs/documents/${data.id}`);
          
          // 如果指定了默认分类，自动将文档添加到该分类
          if (defaultCategoryId) {
            try {
              await addDocumentToCategory(data.id, defaultCategoryId);
              console.log('文档已自动添加到分类:', defaultCategoryId);
            } catch (categoryError) {
              console.error('添加文档到分类失败:', categoryError);
              // 不阻止主流程，只记录错误
            }
          }
        }
      }
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 第二个文档自动保存函数
  const handleSecondAutoSave = async () => {
    if (!secondDocumentId || saving) return;

    setSecondSaving(true);
    try {
      const { error } = await supabase
        .from('cloud_documents')
        .update({
          title: secondTitle,
          content: secondContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', secondDocumentId);

      if (error) {
        console.error('自动保存第二个文档失败:', error);
        return;
      }
      setSecondLastSaved(new Date());
    } catch (error) {
      console.error('自动保存第二个文档失败:', error);
    } finally {
      setSecondSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isSplitView = !!secondDocumentId;

  return (
    <>
      <DocumentSelector
        isOpen={showDocumentSelector}
        onClose={() => setShowDocumentSelector(false)}
        onSelect={handleSelectSecondDocument}
        excludeDocumentId={documentId || undefined}
        documentType="cloud"
      />

      {isSplitView ? (
        // 并排编辑模式
        <div className="h-screen flex gap-4 bg-white dark:bg-white p-4">
          {/* 左侧文档 */}
          <div className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
            <DocumentEditor
              title={title}
              onTitleChange={setTitle}
              content={content}
              onContentChange={setContent}
              saving={saving}
              lastSaved={lastSaved}
              isEditMode={!!documentId}
              placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
              showFullscreen={false}
              toolbarLeft={
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/admin/cloud-docs/home')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                    title="返回云文档主页"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <select
                      value={selectedStudentId || ''}
                      onChange={(e) => setSelectedStudentId(e.target.value ? parseInt(e.target.value) : null)}
                      className="px-2 py-1 text-sm border-none bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0"
                      disabled={loadingStudents}
                    >
                      <option value="">不关联学生</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              }
            />
          </div>

          {/* 右侧文档 */}
          <div className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
            {secondLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <DocumentEditor
                title={secondTitle}
                onTitleChange={setSecondTitle}
                content={secondContent}
                onContentChange={setSecondContent}
                saving={secondSaving}
                lastSaved={secondLastSaved}
                isEditMode={true}
                placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
                showFullscreen={false}
                toolbarLeft={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCloseSecondDocument}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                      title="关闭并排编辑"
                    >
                      <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      ) : (
        // 单文档编辑模式
        <div className="h-screen flex relative">
          {/* 左侧文档列表侧边栏 */}
          <div className={`${isSidebarCollapsed ? 'w-0' : 'w-64'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative`}>
            {!isSidebarCollapsed && (
              <>
                {/* 搜索框 */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 导航菜单 */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="space-y-1">
                    <button
                      onClick={() => navigate('/admin/cloud-docs/home')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      <span>主页</span>
                    </button>
                    <button
                      onClick={() => navigate('/admin/cloud-docs/drive')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <HardDrive className="h-4 w-4" />
                      <span>云盘</span>
                    </button>
                    <button
                      onClick={() => navigate('/admin/cloud-docs/knowledge')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <BookMarked className="h-4 w-4" />
                      <span>知识库</span>
                    </button>
                  </div>
                </div>

                {/* 文档列表 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      置顶文档
                    </div>
                    {loadingDocuments ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                        暂无文档
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {documents.map((doc) => {
                          const isActive = doc.id === documentId;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => handleDocumentSwitch(doc.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <FileText className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                              <span className="flex-1 text-left truncate">{doc.title || '无标题文档'}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* 折叠按钮 */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 rotate-180" />
              </button>
            )}
          </div>

          {/* 右侧文档编辑区域 */}
          <div className="flex-1 overflow-hidden">
            <DocumentEditor
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
            saving={saving}
            lastSaved={lastSaved}
            isEditMode={!!documentId}
            placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
            showFullscreen={true}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            toolbarLeft={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/admin/cloud-docs/home')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  title="返回云文档主页"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedStudentId || ''}
                    onChange={(e) => setSelectedStudentId(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-2 py-1 text-sm border-none bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0"
                    disabled={loadingStudents}
                  >
                    <option value="">不关联学生</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            }
            annotation={documentId && currentUserId ? {
              documentId,
              currentUserId,
              currentUserName,
              isOpen: showAnnotationPanel,
              onToggle: () => setShowAnnotationPanel(!showAnnotationPanel),
            } : undefined}
            splitScreen={{
              onOpen: () => setShowDocumentSelector(true),
            }            }
          />
          </div>
        </div>
      )}

      {/* 批注面板 */}
      {documentId && currentUserId && (
        <DocumentAnnotationPanel
          documentId={documentId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          isOpen={showAnnotationPanel}
          onClose={() => setShowAnnotationPanel(false)}
        />
      )}
    </>
  );
}

