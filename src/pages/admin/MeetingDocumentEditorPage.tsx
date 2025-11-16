/**
 * 会议文档编辑页面
 * 独立的富文本编辑器页面,用于创建和编辑会议文档
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Loader2, 
  FileText,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DocumentEditor from '../../components/DocumentEditor';

export default function MeetingDocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDocument = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('加载文档失败:', error);
      alert('加载文档失败,请重试');
    } finally {
      setLoading(false);
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
          .from('meeting_documents')
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
          .from('meeting_documents')
          .insert({
            title,
            content,
            created_by: employee.id,
          })
          .select()
          .single();

        if (error) throw error;
        setLastSaved(new Date());
        
        // 创建成功后跳转到编辑模式
        if (data) {
          navigate(`/admin/meeting-documents/${data.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('保存文档失败:', error);
      alert('保存失败: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };
  
  // 自动保存（可选）
  useEffect(() => {
    if (!title || !content || !isEditMode) return;
    
    const timer = setTimeout(() => {
      // 静默保存（不显示提示）
      handleSave();
    }, 30000); // 30秒自动保存
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, isEditMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <DocumentEditor
      title={title}
      onTitleChange={setTitle}
      content={content}
      onContentChange={setContent}
      onSave={handleSave}
      saving={saving}
      lastSaved={lastSaved}
      isEditMode={isEditMode}
      placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
      showFullscreen={true}
      isFullscreen={isFullscreen}
      onFullscreenChange={setIsFullscreen}
      toolbarLeft={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/meetings')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="返回会议管理"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isEditMode ? '编辑文档' : '新建文档'}
          </span>
        </div>
      }
    />
  );
}
