/**
 * 会议文档编辑页面
 * 独立的富文本编辑器页面,用于创建和编辑会议文档
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  FileText,
  Clock,
  Type,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SimpleEditorWrapper from '../../components/SimpleEditorWrapper';
import { formatDateTime } from '../../utils/dateUtils';

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
  
  // 字数统计
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.length : 0;
  }, [content]);

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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* 顶部工具栏 - 磨砂玻璃效果 */}
      <div className="flex-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700 sticky top-0 z-50">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          {/* 左侧：导航 + 文档信息 */}
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
          
          {/* 中间：状态信息 */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {lastSaved && (
              <div className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5" />
                <span>已保存于 {formatDateTime(lastSaved).split(' ')[1]}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              <span>{wordCount} 字</span>
            </div>
          </div>
          
          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              title={isFullscreen ? '退出全屏' : '全屏编辑'}
            >
              <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  保存中
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  保存
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 主编辑区域 - 白色背景 */}
      <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
          <SimpleEditorWrapper
            content={content}
            onChange={setContent}
            placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
            renderBeforeEditor={() => (
              <div className="flex-none px-8 pt-8 pb-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="无标题文档"
                  className="w-full text-5xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 mb-4"
                />
                
                {/* 文档元信息 */}
                <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isEditMode ? '最后编辑' : '创建于'} {formatDateTime(lastSaved || new Date())}
                    </span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      <span>已保存</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
