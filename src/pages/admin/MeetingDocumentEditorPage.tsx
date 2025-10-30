/**
 * 会议文档编辑页面
 * 独立的富文本编辑器页面,用于创建和编辑会议文档
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import NovelEditor from '../../components/NovelEditor';

export default function MeetingDocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

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
        alert('文档保存成功!');
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
        alert('文档创建成功!');
        
        // 创建成功后跳转到编辑模式
        if (data) {
          navigate(`/admin/meeting-documents/${data.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('保存文档失败:', error);
      alert('保存失败,请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部操作栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => navigate('/admin/meetings')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <FileText className="h-6 w-6 text-blue-600" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文档标题..."
                className="flex-1 text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  保存
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <NovelEditor
          content={content}
          onChange={setContent}
          placeholder="输入 '/' 打开命令菜单, 选中文字显示格式化工具..."
          minHeight="500px"
        />
      </div>
    </div>
  );
}

