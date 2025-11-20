/**
 * 文书老师工作区主页面
 * 整合文档编辑、学生信息、知识库、AI助手等功能
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkspaceData } from './hooks/useWorkspaceData';
import StudentSelector from './components/StudentSelector';
import DocumentListPanel from './components/DocumentListPanel';
import DocumentEditorArea from './components/DocumentEditorArea';
import RightPanel from './components/RightPanel';
import type { RightPanelTab } from './types';

export default function DocumentWriterWorkspacePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 面板状态
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [rightPanelActiveTab, setRightPanelActiveTab] = useState<RightPanelTab>('student');
  const [showCreateDocumentModal, setShowCreateDocumentModal] = useState(false);

  // 工作区数据
  const {
    currentStudentId,
    currentDocumentId,
    students,
    documents,
    currentDocument,
    favoriteStudentIds,
    loading,
    handleStudentChange,
    handleDocumentChange,
    handleCreateDocument,
    handleUpdateDocument,
    handleAutosave,
    handleDeleteDocument,
    toggleFavoriteStudent,
  } = useWorkspaceData();

  // 从URL参数初始化
  useEffect(() => {
    const studentId = searchParams.get('student');
    const documentId = searchParams.get('document');

    if (studentId) {
      handleStudentChange(parseInt(studentId));
    }
    if (documentId) {
      handleDocumentChange(parseInt(documentId));
    }
  }, [searchParams, handleStudentChange, handleDocumentChange]);

  // 保存文档
  const handleSave = async (content: string) => {
    if (!currentDocumentId) return;
    await handleAutosave(currentDocumentId, content);
  };

  // 更新文档
  const handleUpdate = async (updates: {
    title?: string;
    content?: string;
    status?: string;
  }) => {
    if (!currentDocumentId) return;
    await handleUpdateDocument(currentDocumentId, updates);
  };

  // 创建文档
  const handleCreateDocumentClick = () => {
    if (!currentStudentId) {
      alert('请先选择学生');
      return;
    }
    setShowCreateDocumentModal(true);
  };

  const handleCreateDocumentSubmit = async (params: {
    document_type: string;
    title: string;
    template_id?: number;
  }) => {
    try {
      await handleCreateDocument({
        student_id: currentStudentId!,
        document_type: params.document_type as any,
        title: params.title,
        template_id: params.template_id,
      });
      setShowCreateDocumentModal(false);
    } catch (error) {
      console.error('创建文档失败:', error);
      alert('创建文档失败，请重试');
    }
  };

  // 恢复面板状态
  useEffect(() => {
    const savedLeftCollapsed = localStorage.getItem(
      'documentWriterWorkspace.leftPanelCollapsed'
    );
    const savedRightCollapsed = localStorage.getItem(
      'documentWriterWorkspace.rightPanelCollapsed'
    );
    const savedActiveTab = localStorage.getItem('documentWriterWorkspace.rightPanelActiveTab');

    if (savedLeftCollapsed === 'true') setLeftPanelCollapsed(true);
    if (savedRightCollapsed === 'true') setRightPanelCollapsed(true);
    if (savedActiveTab) setRightPanelActiveTab(savedActiveTab as RightPanelTab);
  }, []);

  // 保存面板状态
  useEffect(() => {
    localStorage.setItem(
      'documentWriterWorkspace.leftPanelCollapsed',
      String(leftPanelCollapsed)
    );
  }, [leftPanelCollapsed]);

  useEffect(() => {
    localStorage.setItem(
      'documentWriterWorkspace.rightPanelCollapsed',
      String(rightPanelCollapsed)
    );
  }, [rightPanelCollapsed]);

  useEffect(() => {
    localStorage.setItem('documentWriterWorkspace.rightPanelActiveTab', rightPanelActiveTab);
  }, [rightPanelActiveTab]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-gray-950 overflow-hidden">
      {/* 顶部导航栏 - 重新设计 */}
      <div className="flex-none h-14 px-8 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/admin/application-workbench')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="返回申请工作台"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="h-5 w-px bg-slate-200 dark:bg-gray-700" />
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            文书老师工作区
          </h1>
        </div>

        <div className="flex items-center">
          <StudentSelector
            currentStudentId={currentStudentId}
            students={students}
            favoriteStudentIds={favoriteStudentIds}
            onStudentChange={handleStudentChange}
            onToggleFavorite={toggleFavoriteStudent}
            isLoading={loading}
          />
        </div>
      </div>

      {/* 主内容区 - 重新设计布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧面板 - 文档列表 */}
        {!leftPanelCollapsed ? (
          <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <DocumentListPanel
              documents={documents}
              currentDocumentId={currentDocumentId}
              onDocumentSelect={handleDocumentChange}
              onCreateDocument={handleCreateDocumentClick}
              onDeleteDocument={handleDeleteDocument}
              isLoading={loading}
            />
          </div>
        ) : (
          <button
            onClick={() => setLeftPanelCollapsed(false)}
            className="w-8 flex-shrink-0 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            title="展开文档列表"
          >
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {/* 折叠按钮 */}
        {!leftPanelCollapsed && (
          <button
            onClick={() => setLeftPanelCollapsed(true)}
            className="absolute left-72 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 p-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
            title="折叠文档列表"
          >
            <ChevronLeft className="h-3 w-3 text-slate-500" />
          </button>
        )}

        {/* 中央编辑区 - 主要工作区域 */}
        <div className="flex-1 relative min-w-0">
          <DocumentEditorArea
            document={currentDocument}
            onSave={handleSave}
            onUpdate={handleUpdate}
            isLoading={loading}
          />
        </div>

        {/* 右侧面板 */}
        <RightPanel
          isCollapsed={rightPanelCollapsed}
          activeTab={rightPanelActiveTab}
          studentId={currentStudentId}
          documentId={currentDocumentId}
          documentType={currentDocument?.document_type}
          onTabChange={setRightPanelActiveTab}
          onCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        />

        {/* 右侧折叠按钮 */}
        {rightPanelCollapsed && (
          <button
            onClick={() => setRightPanelCollapsed(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 p-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
            title="展开右侧面板"
          >
            <ChevronLeft className="h-3 w-3 text-slate-500 rotate-180" />
          </button>
        )}
      </div>

      {/* 创建文档模态框 */}
      {showCreateDocumentModal && (
        <CreateDocumentModal
          onClose={() => setShowCreateDocumentModal(false)}
          onSubmit={handleCreateDocumentSubmit}
        />
      )}
    </div>
  );
}

// 创建文档模态框组件
interface CreateDocumentModalProps {
  onClose: () => void;
  onSubmit: (params: {
    document_type: string;
    title: string;
    template_id?: number;
  }) => void;
}

function CreateDocumentModal({ onClose, onSubmit }: CreateDocumentModalProps) {
  const [documentType, setDocumentType] = useState('PS');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('请输入文档标题');
      return;
    }
    onSubmit({
      document_type: documentType,
      title: title.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200 border border-slate-200/50 dark:border-gray-800/50">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          新建文档
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
              文档类型
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              <option value="PS">个人陈述 (PS)</option>
              <option value="Essay">Essay</option>
              <option value="CV">简历 (CV)</option>
              <option value="RL">推荐信 (RL)</option>
              <option value="SOP">目的陈述 (SOP)</option>
              <option value="Other">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
              文档标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文档标题"
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

