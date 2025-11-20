/**
 * 文书文档服务
 * 前端模拟版本 - 使用localStorage存储数据，不调用真实API
 */

import type {
  Document,
  DocumentVersion,
  DocumentComment,
  CreateDocumentParams,
  UpdateDocumentParams,
  DocumentType,
  DocumentStatus,
} from '../types';

/**
 * 获取学生的所有文档
 * 前端模拟版本 - 从localStorage读取或返回空数组
 */
export async function getStudentDocuments(
  studentId: number,
  filters?: {
    document_type?: DocumentType;
    status?: DocumentStatus;
    sort?: 'updated_at' | 'created_at' | 'title';
  }
): Promise<Document[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // 尝试从localStorage读取
    const storageKey = `documentWriterWorkspace_documents_${studentId}`;
    const savedDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');

    let docs = savedDocs as Document[];

    // 应用筛选
    if (filters?.document_type) {
      docs = docs.filter(doc => doc.document_type === filters.document_type);
    }
    if (filters?.status) {
      docs = docs.filter(doc => doc.status === filters.status);
    }

    // 排序
    const sortField = filters?.sort || 'updated_at';
    docs.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return docs.map((doc) => ({
      ...doc,
      word_count: doc.word_count || 0,
      is_favorite: doc.is_favorite || false,
    }));
  } catch (error) {
    console.error('获取学生文档列表失败:', error);
    return [];
  }
}

/**
 * 获取文档详情
 * 前端模拟版本 - 从localStorage读取
 */
export async function getDocument(documentId: number): Promise<Document | null> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 150));

  try {
    // 从所有学生的文档中查找
    const keys = Object.keys(localStorage);
    const docKeys = keys.filter(key => key.startsWith('documentWriterWorkspace_documents_'));

    for (const key of docKeys) {
      const docs = JSON.parse(localStorage.getItem(key) || '[]') as Document[];
      const doc = docs.find(d => d.id === documentId);
      if (doc) {
        return {
          ...doc,
          word_count: doc.word_count || 0,
          is_favorite: doc.is_favorite || false,
          unread_comments_count: 0,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('获取文档详情失败:', error);
    return null;
  }
}

/**
 * 创建文档
 * 前端模拟版本 - 不调用真实API
 */
export async function createDocument(params: CreateDocumentParams): Promise<Document> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 生成模拟文档数据
  const newDocument: Document = {
    id: Date.now(), // 使用时间戳作为临时ID
    student_id: params.student_id,
    project_id: params.project_id || null,
    document_type: params.document_type,
    title: params.title,
    content: params.template_id ? '<p>模板内容...</p>' : '',
    status: 'draft',
    word_count: 0,
    is_favorite: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1, // 模拟创建者ID
    assigned_to: null,
    assigned_to_name: null,
    deadline: null,
    unread_comments_count: 0,
  };

  // 将文档保存到localStorage（用于前端演示）
  const storageKey = `documentWriterWorkspace_documents_${params.student_id}`;
  const existingDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingDocs.push(newDocument);
  localStorage.setItem(storageKey, JSON.stringify(existingDocs));

  return newDocument;
}

/**
 * 更新文档
 * 前端模拟版本 - 更新localStorage中的数据
 */
export async function updateDocument(
  documentId: number,
  params: UpdateDocumentParams
): Promise<Document> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // 从localStorage查找并更新文档
    const keys = Object.keys(localStorage);
    const docKeys = keys.filter(key => key.startsWith('documentWriterWorkspace_documents_'));

    for (const key of docKeys) {
      const docs = JSON.parse(localStorage.getItem(key) || '[]') as Document[];
      const docIndex = docs.findIndex(d => d.id === documentId);
      
      if (docIndex !== -1) {
        const updatedDoc = {
          ...docs[docIndex],
          updated_at: new Date().toISOString(),
        };

        if (params.title !== undefined) updatedDoc.title = params.title;
        if (params.content !== undefined) {
          updatedDoc.content = params.content;
          // 计算字数
          const text = params.content.replace(/<[^>]*>/g, '').trim();
          updatedDoc.word_count = text.length;
        }
        if (params.status !== undefined) updatedDoc.status = params.status;

        docs[docIndex] = updatedDoc;
        localStorage.setItem(key, JSON.stringify(docs));

        return updatedDoc;
      }
    }

    throw new Error('文档未找到');
  } catch (error) {
    console.error('更新文档失败:', error);
    throw error;
  }
}

/**
 * 自动保存文档
 * 前端模拟版本 - 更新localStorage中的数据
 */
export async function autosaveDocument(
  documentId: number,
  content: string
): Promise<{ saved_at: string }> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const wordCount = text.length;

    // 从localStorage查找并更新文档
    const keys = Object.keys(localStorage);
    const docKeys = keys.filter(key => key.startsWith('documentWriterWorkspace_documents_'));

    for (const key of docKeys) {
      const docs = JSON.parse(localStorage.getItem(key) || '[]') as Document[];
      const docIndex = docs.findIndex(d => d.id === documentId);
      
      if (docIndex !== -1) {
        docs[docIndex] = {
          ...docs[docIndex],
          content,
          word_count: wordCount,
          updated_at: new Date().toISOString(),
        };

        localStorage.setItem(key, JSON.stringify(docs));
        return { saved_at: new Date().toISOString() };
      }
    }

    return { saved_at: new Date().toISOString() };
  } catch (error) {
    console.error('自动保存失败:', error);
    return { saved_at: new Date().toISOString() };
  }
}

/**
 * 获取文档版本列表
 */
export async function getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
  try {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*, created_by:employees(name)')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false });

    if (error) throw error;

    return (data || []).map((version: any) => ({
      ...version,
      created_by_name: version.created_by?.name,
    })) as DocumentVersion[];
  } catch (error) {
    console.error('获取文档版本列表失败:', error);
    throw error;
  }
}

/**
 * 创建文档版本
 */
export async function createDocumentVersion(
  documentId: number,
  content: string,
  changeSummary?: string
): Promise<DocumentVersion> {
  try {
    // 获取当前最大版本号
    const { data: versions } = await supabase
      .from('document_versions')
      .select('version_number')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber = versions && versions.length > 0
      ? versions[0].version_number + 1
      : 1;

    // 获取当前用户ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    const { data: employee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!employee) throw new Error('未找到员工信息');

    const text = content.replace(/<[^>]*>/g, '').trim();
    const wordCount = text.length;

    const { data, error } = await supabase
      .from('document_versions')
      .insert({
        document_id: documentId,
        version_number: nextVersionNumber,
        content,
        word_count: wordCount,
        change_summary: changeSummary,
        created_by: employee.id,
      })
      .select()
      .single();

    if (error) throw error;

    return data as DocumentVersion;
  } catch (error) {
    console.error('创建文档版本失败:', error);
    throw error;
  }
}

/**
 * 获取文档评论列表
 */
export async function getDocumentComments(documentId: number): Promise<DocumentComment[]> {
  try {
    const { data, error } = await supabase
      .from('document_comments')
      .select(`
        *,
        created_by:employees(id, name, avatar_url),
        replies:document_comments(*, created_by:employees(id, name, avatar_url))
      `)
      .eq('document_id', documentId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((comment: any) => ({
      ...comment,
      created_by_name: comment.created_by?.name,
      created_by_avatar: comment.created_by?.avatar_url,
      replies: comment.replies || [],
    })) as DocumentComment[];
  } catch (error) {
    console.error('获取文档评论列表失败:', error);
    throw error;
  }
}

/**
 * 添加文档评论
 */
export async function addDocumentComment(
  documentId: number,
  comment: {
    content: string;
    selected_text?: string;
    start_position?: number;
    end_position?: number;
    mentioned_user_ids?: number[];
    parent_comment_id?: number;
  }
): Promise<DocumentComment> {
  try {
    // 获取当前用户ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    const { data: employee } = await supabase
      .from('employees')
      .select('id, name, avatar_url')
      .eq('user_id', user.id)
      .single();

    if (!employee) throw new Error('未找到员工信息');

    const { data, error } = await supabase
      .from('document_comments')
      .insert({
        document_id: documentId,
        content: comment.content,
        selected_text: comment.selected_text,
        start_position: comment.start_position,
        end_position: comment.end_position,
        mentioned_user_ids: comment.mentioned_user_ids,
        parent_comment_id: comment.parent_comment_id,
        status: 'open',
        created_by: employee.id,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      created_by_name: employee.name,
      created_by_avatar: employee.avatar_url,
    } as DocumentComment;
  } catch (error) {
    console.error('添加文档评论失败:', error);
    throw error;
  }
}

/**
 * 删除文档
 * 前端模拟版本 - 从localStorage中删除
 */
export async function deleteDocument(documentId: number): Promise<void> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // 从localStorage查找并删除文档
    const keys = Object.keys(localStorage);
    const docKeys = keys.filter(key => key.startsWith('documentWriterWorkspace_documents_'));

    for (const key of docKeys) {
      const docs = JSON.parse(localStorage.getItem(key) || '[]') as Document[];
      const filteredDocs = docs.filter(d => d.id !== documentId);
      
      if (filteredDocs.length !== docs.length) {
        localStorage.setItem(key, JSON.stringify(filteredDocs));
        return;
      }
    }
  } catch (error) {
    console.error('删除文档失败:', error);
    // 前端版本不抛出错误，允许继续操作
  }
}

