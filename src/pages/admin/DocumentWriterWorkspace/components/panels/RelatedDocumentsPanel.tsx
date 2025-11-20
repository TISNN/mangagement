/**
 * 相关文档面板组件
 * 显示该学生的其他相关文档
 */

import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { getStudentDocuments } from '../../services/documentService';
import type { Document } from '../../types';

interface RelatedDocumentsPanelProps {
  studentId: number;
  currentDocumentId: number | null;
}

export default function RelatedDocumentsPanel({
  studentId,
  currentDocumentId,
}: RelatedDocumentsPanelProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [studentId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getStudentDocuments(studentId);
      // 排除当前文档
      setDocuments(docs.filter((doc) => doc.id !== currentDocumentId));
    } catch (error) {
      console.error('加载相关文档失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        暂无其他文档
      </div>
    );
  }

  return (
    <div className="p-5 space-y-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PS: '个人陈述',
      Essay: 'Essay',
      CV: '简历',
      RL: '推荐信',
      SOP: '目的陈述',
      Other: '其他',
    };
    return labels[type] || type;
  };

  return (
    <div className="p-4 border border-slate-200/60 dark:border-gray-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 hover:border-slate-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {document.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-6">
            <span className="font-medium">{getTypeLabel(document.document_type)}</span>
            <span>•</span>
            <span>{document.word_count} 字</span>
          </div>
        </div>
        <a
          href={`/admin/document-writer-workspace?student=${document.student_id}&document=${document.id}`}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all group-hover:scale-110"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

