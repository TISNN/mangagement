/**
 * 云文档编辑页面
 * 独立的富文本编辑器页面,用于创建和编辑云文档
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Loader2, 
  FileText,
  X,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import DocumentEditor from '../../../components/DocumentEditor';
import DocumentSelector from '../../../components/DocumentSelector';
import DocumentAnnotationPanel from '../../../components/DocumentAnnotationPanel';

export default function CloudDocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(isEditMode && id ? parseInt(id) : null);

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

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入文档标题');
      return;
    }

    setSaving(true);
    try {
      // 从 localStorage 获取当前用户信息
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        alert('用户信息获取失败');
        return;
      }

      const employee = JSON.parse(employeeData);

      if (isEditMode && id) {
        // 更新现有文档
        const { error } = await supabase
          .from('cloud_documents')
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        setLastSaved(new Date());
      } else {
        // 创建新文档
        const { data, error } = await supabase
          .from('cloud_documents')
          .insert({
            title,
            content,
            created_by: employee.id,
            status: 'draft',
          })
          .select()
          .single();

        if (error) throw error;
        setLastSaved(new Date());
        
        // 创建成功后设置文档ID，但不跳转，保持在同一页面
        if (data) {
          setDocumentId(data.id);
          // 可选：更新URL但不刷新页面
          window.history.replaceState({}, '', `/admin/cloud-docs/documents/${data.id}`);
        }
      }
    } catch (error) {
      console.error('保存文档失败:', error);
      alert('保存失败: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSecondSave = async () => {
    if (!secondTitle.trim() || !secondDocumentId) {
      alert('请输入文档标题');
      return;
    }

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

      if (error) throw error;
      setSecondLastSaved(new Date());
    } catch (error) {
      console.error('保存第二个文档失败:', error);
      alert('保存失败: ' + (error as Error).message);
    } finally {
      setSecondSaving(false);
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
  
  // 自动保存（新建和编辑模式都启用）
  useEffect(() => {
    if (!title || !content) return;
    
    const timer = setTimeout(() => {
      // 静默保存（不显示提示）
      handleSave();
    }, 30000); // 30秒自动保存
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title]);

  // 第二个文档自动保存
  useEffect(() => {
    if (!secondTitle || !secondContent || !secondDocumentId) return;
    
    const timer = setTimeout(() => {
      handleSecondSave();
    }, 30000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondContent, secondTitle, secondDocumentId]);

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
        <div className="h-screen flex gap-4 bg-gray-100 dark:bg-gray-900 p-4">
          {/* 左侧文档 */}
          <div className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
            <DocumentEditor
              title={title}
              onTitleChange={setTitle}
              content={content}
              onContentChange={setContent}
              onSave={handleSave}
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
                  
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {documentId ? '编辑云文档' : '新建云文档'}
                  </span>
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
                onSave={handleSecondSave}
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
                    
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                    
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      并排编辑
                    </span>
                  </div>
                }
              />
            )}
          </div>
        </div>
      ) : (
        // 单文档编辑模式
        <div className="h-screen">
          <DocumentEditor
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
            onSave={handleSave}
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
                
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {documentId ? '编辑云文档' : '新建云文档'}
                </span>
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
            }}
          />
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

