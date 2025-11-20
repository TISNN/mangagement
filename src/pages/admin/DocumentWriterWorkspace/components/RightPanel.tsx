/**
 * 右侧面板组件
 * 包含多个标签页：学生信息、知识库、AI问答、会议记录、相关文档
 */

import React from 'react';
import { User, BookOpen, MessageSquare, Calendar, FileText, X } from 'lucide-react';
import type { RightPanelTab } from '../types';
import StudentInfoPanel from './panels/StudentInfoPanel';
import KnowledgeBasePanel from './panels/KnowledgeBasePanel';
import AIChatPanel from './panels/AIChatPanel';
import MeetingRecordsPanel from './panels/MeetingRecordsPanel';
import RelatedDocumentsPanel from './panels/RelatedDocumentsPanel';

interface RightPanelProps {
  isCollapsed: boolean;
  activeTab: RightPanelTab;
  studentId: number | null;
  documentId: number | null;
  documentType?: string;
  onTabChange: (tab: RightPanelTab) => void;
  onCollapse: () => void;
  onInsertTemplate?: (templateId: number) => void;
  onInsertSnippet?: (snippetId: number) => void;
}

export default function RightPanel({
  isCollapsed,
  activeTab,
  studentId,
  documentId,
  documentType,
  onTabChange,
  onCollapse,
  onInsertTemplate,
  onInsertSnippet,
}: RightPanelProps) {
  if (isCollapsed) {
    return (
      <div className="w-12 border-l border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center py-3 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              onCollapse();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800'
            }`}
            title={tab.label}
          >
            <tab.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 flex-shrink-0 border-l border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      {/* 标签页头部 */}
      <div className="flex-none px-5 py-4 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h3>
          <button
            onClick={onCollapse}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
            title="折叠面板"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 标签页切换 */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 dark:text-slate-400'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'student' && studentId && (
          <StudentInfoPanel studentId={studentId} />
        )}
        {activeTab === 'knowledge' && (
          <KnowledgeBasePanel
            documentType={documentType}
            onInsertTemplate={onInsertTemplate}
            onInsertSnippet={onInsertSnippet}
          />
        )}
        {activeTab === 'ai' && (
          <AIChatPanel studentId={studentId} documentId={documentId} />
        )}
        {activeTab === 'meetings' && studentId && (
          <MeetingRecordsPanel studentId={studentId} />
        )}
        {activeTab === 'documents' && studentId && (
          <RelatedDocumentsPanel studentId={studentId} currentDocumentId={documentId} />
        )}
        {activeTab === 'student' && !studentId && (
          <div className="p-8 text-center text-sm text-slate-500">
            请先选择学生
          </div>
        )}
        {(activeTab === 'meetings' || activeTab === 'documents') && !studentId && (
          <div className="p-8 text-center text-sm text-slate-500">
            请先选择学生
          </div>
        )}
      </div>
    </div>
  );
}

const tabs: Array<{
  id: RightPanelTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'student', label: '学生档案', icon: User },
  { id: 'knowledge', label: '知识库', icon: BookOpen },
  { id: 'ai', label: 'AI问答', icon: MessageSquare },
  { id: 'meetings', label: '会议记录', icon: Calendar },
  { id: 'documents', label: '相关文档', icon: FileText },
];

