/**
 * 工作区数据管理 Hook
 * 前端模拟版本 - 使用localStorage存储数据
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getStudentDocuments,
  getDocument,
  createDocument,
  updateDocument,
  autosaveDocument,
  deleteDocument,
} from '../services/documentService';
import type { Document, StudentInfo, CreateDocumentParams, UpdateDocumentParams } from '../types';

export function useWorkspaceData() {
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(null);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [favoriteStudentIds, setFavoriteStudentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载学生列表
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      // 前端模拟版本 - 使用模拟数据
      // 尝试从localStorage读取，如果没有则使用默认模拟数据
      const savedStudents = localStorage.getItem('documentWriterWorkspace_students');
      
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        // 默认模拟数据
        const mockStudents: StudentInfo[] = [
          { id: 1, name: '张三', service_type: '本科申请', current_stage: '文书撰写' },
          { id: 2, name: '李四', service_type: '研究生申请', current_stage: '材料准备' },
          { id: 3, name: '王五', service_type: '本科申请', current_stage: '选校阶段' },
        ];
        setStudents(mockStudents);
        localStorage.setItem('documentWriterWorkspace_students', JSON.stringify(mockStudents));
      }
    } catch (error) {
      console.error('加载学生列表失败:', error);
      // 即使出错也设置默认数据
      setStudents([
        { id: 1, name: '示例学生', service_type: '本科申请', current_stage: '文书撰写' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载收藏的学生ID
  const loadFavoriteStudents = useCallback(() => {
    const saved = localStorage.getItem('documentWriterWorkspace.favoriteStudentIds');
    if (saved) {
      try {
        setFavoriteStudentIds(JSON.parse(saved));
      } catch (error) {
        console.error('加载收藏学生失败:', error);
      }
    }
  }, []);

  // 保存收藏的学生ID
  const saveFavoriteStudents = useCallback((ids: number[]) => {
    localStorage.setItem('documentWriterWorkspace.favoriteStudentIds', JSON.stringify(ids));
    setFavoriteStudentIds(ids);
  }, []);

  // 切换收藏状态
  const toggleFavoriteStudent = useCallback(
    (studentId: number) => {
      const newFavorites = favoriteStudentIds.includes(studentId)
        ? favoriteStudentIds.filter((id) => id !== studentId)
        : [...favoriteStudentIds, studentId];
      saveFavoriteStudents(newFavorites);
    },
    [favoriteStudentIds, saveFavoriteStudents]
  );

  // 切换学生
  const handleStudentChange = useCallback(
    async (studentId: number) => {
      setCurrentStudentId(studentId);
      setCurrentDocumentId(null);
      setCurrentDocument(null);

      try {
        setLoading(true);
        const docs = await getStudentDocuments(studentId);
        setDocuments(docs);
      } catch (error) {
        console.error('加载学生文档失败:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 切换文档
  const handleDocumentChange = useCallback(
    async (documentId: number) => {
      setCurrentDocumentId(documentId);

      try {
        setLoading(true);
        const doc = await getDocument(documentId);
        setCurrentDocument(doc);
      } catch (error) {
        console.error('加载文档失败:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 创建文档
  const handleCreateDocument = useCallback(
    async (params: CreateDocumentParams) => {
      try {
        setLoading(true);
        const newDoc = await createDocument(params);
        setDocuments((prev) => [newDoc, ...prev]);
        setCurrentDocumentId(newDoc.id);
        setCurrentDocument(newDoc);
        return newDoc;
      } catch (error) {
        console.error('创建文档失败:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 更新文档
  const handleUpdateDocument = useCallback(
    async (documentId: number, params: UpdateDocumentParams) => {
      try {
        const updated = await updateDocument(documentId, params);
        setCurrentDocument(updated);
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === documentId ? updated : doc))
        );
        return updated;
      } catch (error) {
        console.error('更新文档失败:', error);
        throw error;
      }
    },
    []
  );

  // 自动保存文档
  const handleAutosave = useCallback(
    async (documentId: number, content: string) => {
      try {
        await autosaveDocument(documentId, content);
        // 更新本地状态
        setCurrentDocument((prev) =>
          prev
            ? {
                ...prev,
                content,
                word_count: content.replace(/<[^>]*>/g, '').trim().length,
                updated_at: new Date().toISOString(),
              }
            : null
        );
      } catch (error) {
        console.error('自动保存失败:', error);
        throw error;
      }
    },
    []
  );

  // 删除文档
  const handleDeleteDocument = useCallback(
    async (documentId: number) => {
      try {
        await deleteDocument(documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        if (currentDocumentId === documentId) {
          setCurrentDocumentId(null);
          setCurrentDocument(null);
        }
      } catch (error) {
        console.error('删除文档失败:', error);
        throw error;
      }
    },
    [currentDocumentId]
  );

  // 初始化
  useEffect(() => {
    loadStudents();
    loadFavoriteStudents();
  }, [loadStudents, loadFavoriteStudents]);

  return {
    // 状态
    currentStudentId,
    currentDocumentId,
    students,
    documents,
    currentDocument,
    favoriteStudentIds,
    loading,

    // 方法
    handleStudentChange,
    handleDocumentChange,
    handleCreateDocument,
    handleUpdateDocument,
    handleAutosave,
    handleDeleteDocument,
    toggleFavoriteStudent,
  };
}

