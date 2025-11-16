/**
 * 文档批注侧边栏组件
 * 显示文档的所有批注，支持添加、回复、删除批注
 */

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  CheckCircle2,
  Circle,
  Reply,
  Loader2,
} from 'lucide-react';
import {
  getDocumentAnnotations,
  createAnnotation,
  deleteAnnotation,
  toggleAnnotationResolved,
  formatAnnotationTime,
  type DocumentAnnotation,
} from '../../services/documentAnnotationService';

interface DocumentAnnotationPanelProps {
  documentId: number;
  currentUserId: number;
  currentUserName: string;
  isOpen: boolean;
  onClose: () => void;
  onAnnotationClick?: (annotation: DocumentAnnotation) => void;
}

export default function DocumentAnnotationPanel({
  documentId,
  currentUserId,
  currentUserName,
  isOpen,
  onClose,
  onAnnotationClick,
}: DocumentAnnotationPanelProps) {
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [isCreatingAnnotation, setIsCreatingAnnotation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 加载批注
  useEffect(() => {
    if (isOpen && documentId) {
      loadAnnotations();
    }
  }, [isOpen, documentId]);

  const loadAnnotations = async () => {
    setLoading(true);
    try {
      const data = await getDocumentAnnotations(documentId);
      setAnnotations(data);
    } catch (error) {
      console.error('加载批注失败:', error);
      alert('加载批注失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 监听文本选择
  useEffect(() => {
    if (!isOpen) return;

    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [isOpen]);

  // 创建新批注
  const handleCreateAnnotation = async () => {
    if (!newAnnotationContent.trim()) {
      alert('请输入批注内容');
      return;
    }

    setSubmitting(true);
    try {
      // 获取选中的文本和位置（简化版，实际应该从编辑器获取精确位置）
      const selection = window.getSelection();
      let selectedText = '';
      let startPos = null;
      let endPos = null;

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        selectedText = range.toString();
        // 注意：这里的位置计算是简化版，实际应该从 Tiptap 编辑器获取
        // startPos 和 endPos 应该基于 HTML 内容的字符位置
      }

      await createAnnotation({
        document_id: documentId,
        created_by: currentUserId,
        content: newAnnotationContent,
        selected_text: selectedText || null,
        start_pos: startPos,
        end_pos: endPos,
      });

      setNewAnnotationContent('');
      setSelectedText('');
      setIsCreatingAnnotation(false);
      await loadAnnotations();
    } catch (error) {
      console.error('创建批注失败:', error);
      alert('创建批注失败: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // 回复批注
  const handleReply = async (parentId: number) => {
    if (!replyContent.trim()) {
      alert('请输入回复内容');
      return;
    }

    setSubmitting(true);
    try {
      await createAnnotation({
        document_id: documentId,
        created_by: currentUserId,
        content: replyContent,
        parent_id: parentId,
      });

      setReplyContent('');
      setReplyingTo(null);
      await loadAnnotations();
    } catch (error) {
      console.error('回复批注失败:', error);
      alert('回复失败: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // 删除批注
  const handleDelete = async (annotationId: number) => {
    if (!confirm('确定要删除这条批注吗？')) {
      return;
    }

    try {
      await deleteAnnotation(annotationId);
      await loadAnnotations();
    } catch (error) {
      console.error('删除批注失败:', error);
      alert('删除失败: ' + (error as Error).message);
    }
  };

  // 标记为已解决/未解决
  const handleToggleResolved = async (annotationId: number, currentStatus: boolean) => {
    try {
      await toggleAnnotationResolved(annotationId, !currentStatus);
      await loadAnnotations();
    } catch (error) {
      console.error('更新批注状态失败:', error);
      alert('更新状态失败: ' + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">批注</h3>
          {annotations.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({annotations.length})
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* 创建新批注 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {selectedText && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <div className="font-medium mb-1">已选中文本：</div>
            <div className="text-xs">{selectedText}</div>
          </div>
        )}
        {isCreatingAnnotation ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={newAnnotationContent}
              onChange={(e) => setNewAnnotationContent(e.target.value)}
              placeholder="输入批注内容..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateAnnotation}
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    添加批注
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsCreatingAnnotation(false);
                  setNewAnnotationContent('');
                }}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsCreatingAnnotation(true);
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
            className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            添加批注
          </button>
        )}
      </div>

      {/* 批注列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : annotations.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            暂无批注
            <br />
            <span className="text-xs">选中文本后点击"添加批注"</span>
          </div>
        ) : (
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50"
            >
              {/* 批注头部 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {annotation.creator?.name || '未知用户'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatAnnotationTime(annotation.created_at)}
                    </span>
                  </div>
                  {annotation.selected_text && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded mb-2">
                      "{annotation.selected_text}"
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleResolved(annotation.id, annotation.is_resolved)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title={annotation.is_resolved ? '标记为未解决' : '标记为已解决'}
                  >
                    {annotation.is_resolved ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                  {annotation.created_by === currentUserId && (
                    <button
                      onClick={() => handleDelete(annotation.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="删除批注"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* 批注内容 */}
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {annotation.content}
              </div>

              {/* 回复按钮 */}
              {!replyingTo && (
                <button
                  onClick={() => {
                    setReplyingTo(annotation.id);
                    setTimeout(() => {
                      const replyTextarea = document.querySelector(
                        `textarea[data-reply-to="${annotation.id}"]`
                      ) as HTMLTextAreaElement;
                      replyTextarea?.focus();
                    }, 0);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <Reply className="h-3 w-3" />
                  回复
                </button>
              )}

              {/* 回复输入框 */}
              {replyingTo === annotation.id && (
                <div className="mt-2 space-y-2">
                  <textarea
                    data-reply-to={annotation.id}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="输入回复..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(annotation.id)}
                      disabled={submitting}
                      className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          提交中...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          发送
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors text-xs"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* 回复列表 */}
              {annotation.replies && annotation.replies.length > 0 && (
                <div className="mt-3 space-y-2 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                  {annotation.replies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reply.creator?.name || '未知用户'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatAnnotationTime(reply.created_at)}
                          </span>
                        </div>
                        {reply.created_by === currentUserId && (
                          <button
                            onClick={() => handleDelete(reply.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="删除回复"
                          >
                            <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

