/**
 * 文档选择器组件
 * 用于选择要并排打开的文档
 */

import { useState, useEffect } from 'react';
import { Search, FileText, Loader2, X, FilePlus } from 'lucide-react';
import { getAllDocuments } from '../../services/cloudDocumentService';
import type { CloudDocument } from '../../services/cloudDocumentService';

interface DocumentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documentId: number | null) => void; // null 表示创建新文档
  excludeDocumentId?: number; // 排除当前正在编辑的文档
}

export default function DocumentSelector({
  isOpen,
  onClose,
  onSelect,
  excludeDocumentId,
}: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getAllDocuments({ limit: 50 });
      // 排除当前文档
      const filtered = excludeDocumentId
        ? docs.filter(doc => doc.id !== excludeDocumentId)
        : docs;
      setDocuments(filtered);
    } catch (error) {
      console.error('加载文档列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">选择要并排打开的文档</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文档..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 文档列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 新建文档选项 */}
          <button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="w-full text-left p-3 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors mb-3"
          >
            <div className="flex items-center gap-3">
              <FilePlus className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  创建新文档
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  创建一个新文档并分屏打开
                </div>
              </div>
            </div>
          </button>

          {/* 分隔线 */}
          {filteredDocuments.length > 0 && (
            <div className="my-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-2">
                选择已有文档
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchTerm ? '未找到匹配的文档' : '暂无已有文档'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelect(doc.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {doc.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {doc.location || '未分类'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

