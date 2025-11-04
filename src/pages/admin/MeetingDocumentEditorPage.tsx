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
    <div className={`h-screen flex flex-col ${isFullscreen ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950'}`}>
      {/* 顶部工具栏 - 现代化设计 */}
      <div className="flex-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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

      {/* 主编辑区域 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 编辑器主体 */}
        <div className={`flex-1 flex flex-col ${isFullscreen ? 'max-w-none' : 'max-w-4xl'} mx-auto w-full`}>
          {/* 标题区域 - 聚焦设计 */}
          <div className="flex-none px-8 pt-8 pb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="无标题文档"
              className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
            />
            
            {/* 文档元信息 */}
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {isEditMode ? '最后编辑' : '创建于'} {formatDateTime(lastSaved || new Date())}
                </span>
              </div>
            </div>
          </div>

          {/* 编辑器区域 */}
          <div className="flex-1 overflow-hidden px-8 pb-8">
            <SimpleEditorWrapper
              content={content}
              onChange={setContent}
              placeholder='输入文本，按"空格"启用 AI，按"/"启用指令...'
              minHeight="100%"
            />
          </div>
        </div>
        
        {/* 右侧边栏（可选） */}
        {!isFullscreen && (
          <div className="flex-none w-64 border-l border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-4">
            <div className="space-y-6">
              {/* 文档统计 */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  文档统计
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">字数</span>
                    <span className="font-medium text-gray-900 dark:text-white">{wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">段落</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {content.split('<p>').length - 1 || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 快捷操作 */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  快捷键
                </h3>
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>保存</span>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">⌘ S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>粗体</span>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">⌘ B</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>斜体</span>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">⌘ I</kbd>
                  </div>
                </div>
              </div>
              
              {/* 提示 */}
              <div className="mt-auto pt-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    💡 文档每30秒自动保存
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
