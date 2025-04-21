import { supabase } from '../lib/supabase';
import { Lead, LeadFilter, LeadStatus, LeadStats, LeadDB, LeadPriority } from '../types/lead';

/**
 * 将数据库格式转换为前端格式
 * 注意：此函数现在包含临时转换逻辑，查询实际数据将在外部完成
 */
const transformDbToFrontend = (dbLead: Record<string, unknown>): Lead => {
  // 确保priority的值是有效的LeadPriority
  let priority = String(dbLead.priority || 'medium');
  if (priority !== 'high' && priority !== 'medium' && priority !== 'low') {
    priority = 'medium';
  }
  
  // 意向项目ID和顾问ID直接转换为字符串，名称将在显示时通过查询确定
  const interestId = dbLead.interest as number;
  const assignedToId = dbLead.assigned_to as number;
  
  return {
    id: String(dbLead.id || ''),
    name: String(dbLead.name || ''),
    email: String(dbLead.email || ''),
    phone: String(dbLead.phone || ''),
    source: String(dbLead.source || ''),
    status: dbLead.status as LeadStatus,
    date: String(dbLead.date || ''),  // date字段作为接入日期
    avatar: String(dbLead.avatar_url || ''),  // avatar_url -> avatar
    lastContact: String(dbLead.last_contact || ''),  // last_contact -> lastContact
    interest: String(interestId || ''),  // 存储ID，显示时查询名称
    assignedTo: String(assignedToId || ''),  // 存储ID，显示时查询名称
    notes: String(dbLead.notes || ''),
    priority: priority as LeadPriority,
    createdAt: dbLead.created_at ? String(dbLead.created_at) : undefined,
    updatedAt: dbLead.updated_at ? String(dbLead.updated_at) : undefined,
    gender: dbLead.gender ? String(dbLead.gender) : undefined,  // 添加性别
  };
};

/**
 * 添加日志相关的接口定义
 */
export interface LeadLog {
  id: number;
  lead_id: number;
  employee_id: number;
  employee_name?: string;
  log_date: string;
  content: string;
  next_follow_up: string | null;
  created_at: string;
  type?: string; // 添加类型字段
  date?: string; // 添加日期字段兼容性
}

/**
 * 添加日志创建参数接口
 */
export interface CreateLeadLogParams {
  lead_id: string | number;
  employee_id?: string | number;
  content: string;
  next_follow_up?: string | null;
  type?: string; // 添加类型字段
  date?: string; // 添加日期字段
  operator?: string; // 添加操作人字段
}

/**
 * 线索服务
 */
export const leadService = {
  /**
   * 获取所有线索
   */
  async getAllLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // 转换数据格式
      return data.map(transformDbToFrontend);
    } catch (error) {
      console.error('获取所有线索失败', error);
      throw error;
    }
  },
  
  /**
   * 获取所有线索来源类型
   */
  async getLeadSources(): Promise<string[]> {
    try {
      // 从leads表中查询所有不同的source值
      const { data, error } = await supabase
        .from('leads')
        .select('source')
        .order('source');
      
      if (error) throw error;
      
      // 提取不同的source值并删除重复项
      const sources = data.map(item => item.source);
      const uniqueSources = [...new Set(sources)].filter(source => source);
      
      // 如果没有数据或者数据少于默认值，就添加默认来源类型
      const defaultSources = ['官网表单', '社交媒体', '转介绍', '合作方', '电话咨询', '其他'];
      
      if (uniqueSources.length < defaultSources.length) {
        // 合并并删除重复
        return [...new Set([...uniqueSources, ...defaultSources])];
      }
      
      return uniqueSources;
    } catch (error) {
      console.error('获取线索来源失败', error);
      // 出错时返回默认来源
      return ['官网表单', '社交媒体', '转介绍', '合作方', '电话咨询', '其他'];
    }
  },
  
  /**
   * 根据过滤条件获取线索
   */
  async getFilteredLeads(filter: LeadFilter): Promise<Lead[]> {
    try {
      let query = supabase
        .from('leads')
        .select('*');
      
      // 应用各种过滤条件
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      
      if (filter.source && filter.source !== '全部来源') {
        query = query.eq('source', filter.source);
      }
      
      if (filter.startDate) {
        query = query.gte('date', filter.startDate);
      }
      
      if (filter.endDate) {
        query = query.lte('date', filter.endDate);
      }
      
      // 性别筛选
      if (filter.gender) {
        query = query.eq('gender', filter.gender);
      }
      
      if (filter.consultant && filter.consultant !== 'all') {
        // 如果是字符串，尝试转换为数字
        const consultantId = typeof filter.consultant === 'string' 
          ? parseInt(filter.consultant, 10) 
          : filter.consultant;
        
        if (!isNaN(consultantId)) {
          query = query.eq('assigned_to', consultantId);
        }
      }
      
      if (filter.interest && filter.interest !== 'all') {
        // 如果是字符串，尝试转换为数字
        const interestId = typeof filter.interest === 'string'
          ? parseInt(filter.interest, 10)
          : filter.interest;
          
        if (!isNaN(interestId)) {
          query = query.eq('interest', interestId);
        }
      }
      
      if (filter.priority && filter.priority !== 'all') {
        // 如果priority不是'all'字符串（来自UI选择），则应用过滤条件
        query = query.eq('priority', filter.priority);
      }
      
      if (filter.searchQuery) {
        query = query.or(`name.ilike.%${filter.searchQuery}%,email.ilike.%${filter.searchQuery}%,phone.ilike.%${filter.searchQuery}%`);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      
      // 转换数据格式
      return data.map(transformDbToFrontend);
    } catch (error) {
      console.error('获取过滤线索失败', error);
      throw error;
    }
  },
  
  /**
   * 获取线索详情
   */
  async getLeadById(id: string): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // 转换数据格式
      return transformDbToFrontend(data);
    } catch (error) {
      console.error(`获取线索详情失败，id=${id}`, error);
      throw error;
    }
  },
  
  /**
   * 创建线索
   */
  async createLead(lead: { 
    name: string;
    email?: string;
    phone?: string;
    source: string;
    interest?: string;
    assigned_to?: string;
    assignedTo?: string;
    priority: string | LeadPriority;
    notes?: string;
    gender?: string;    // 性别
    date?: string;      // 接入日期 
  }): Promise<Lead> {
    try {
      // 生成当前日期
      const currentDate = new Date().toISOString().split('T')[0];
      
      // 转换前端表单数据为数据库格式
      const { assigned_to, assignedTo, interest, priority, ...rest } = lead;
      
      // 确保priority是有效的LeadPriority
      let priorityValue = priority as string;
      if (priorityValue !== 'high' && priorityValue !== 'medium' && priorityValue !== 'low') {
        priorityValue = 'medium';
      }
      
      // 处理兼容性：使用assigned_to或assignedTo
      const assignedToValue = assigned_to !== undefined ? assigned_to : assignedTo;
      
      const dbLeadData: Partial<LeadDB> = {
        ...rest,
        assigned_to: assignedToValue ? parseInt(assignedToValue, 10) || null : null,
        interest: interest ? parseInt(interest, 10) || null : null,
        priority: priorityValue as LeadPriority,
        date: lead.date || currentDate,  // 使用传入的日期或当前日期
        last_contact: currentDate,
        status: 'new' as LeadStatus,
        avatar_url: `https://api.dicebear.com/7.x/lorelei/svg?seed=${lead.name}`
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert([dbLeadData])
        .select()
        .single();
      
      if (error) throw error;
      
      // 转换数据格式
      return transformDbToFrontend(data);
    } catch (error) {
      console.error('创建线索失败', error);
      throw error;
    }
  },
  
  /**
   * 更新线索
   */
  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
    try {
      // 转换前端数据为数据库格式
      const { assignedTo, interest, lastContact, avatar, ...rest } = lead;
      
      const dbUpdateData: Partial<LeadDB> = {
        ...rest,
        ...(assignedTo !== undefined ? { assigned_to: parseInt(assignedTo, 10) || null } : {}),
        ...(interest !== undefined ? { interest: parseInt(interest, 10) || null } : {}),
        ...(lastContact !== undefined ? { last_contact: lastContact } : {}),
        ...(avatar !== undefined ? { avatar_url: avatar } : {})
      };
      
      const { data, error } = await supabase
        .from('leads')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // 转换数据格式
      return transformDbToFrontend(data);
    } catch (error) {
      console.error(`更新线索失败，id=${id}`, error);
      throw error;
    }
  },
  
  /**
   * 更新线索状态
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`更新线索状态失败，id=${id}`, error);
      throw error;
    }
  },
  
  /**
   * 删除线索
   */
  async deleteLead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`删除线索失败，id=${id}`, error);
      throw error;
    }
  },
  
  /**
   * 获取线索统计数据
   */
  async getLeadStats(): Promise<LeadStats> {
    try {
      const leads = await this.getAllLeads();
      
      return {
        total: leads.length,
        new: leads.filter(lead => lead.status === 'new').length,
        contacted: leads.filter(lead => lead.status === 'contacted').length,
        qualified: leads.filter(lead => lead.status === 'qualified').length,
        converted: leads.filter(lead => lead.status === 'converted').length,
        closed: leads.filter(lead => lead.status === 'closed').length,
        highPriority: leads.filter(lead => lead.priority === 'high').length
      };
    } catch (error) {
      console.error('获取线索统计数据失败', error);
      throw error;
    }
  },
  
  /**
   * 获取线索的跟踪日志
   */
  async getLeadLogs(leadId: string | number): Promise<LeadLog[]> {
    try {
      const { data, error } = await supabase
        .from('lead_logs')
        .select(`
          *,
          employees(name)
        `)
        .eq('lead_id', leadId)
        .order('log_date', { ascending: false });
      
      if (error) throw error;
      
      // 处理员工名称
      return data.map(log => ({
        ...log,
        employee_name: log.employees?.name || '未知员工'
      }));
    } catch (error) {
      console.error(`获取线索日志失败，lead_id=${leadId}`, error);
      throw error;
    }
  },
  
  /**
   * 创建线索跟踪日志
   */
  async createLeadLog(params: CreateLeadLogParams): Promise<LeadLog> {
    try {
      const now = new Date().toISOString();
      
      const logData = {
        lead_id: typeof params.lead_id === 'string' ? parseInt(params.lead_id, 10) : params.lead_id,
        employee_id: params.employee_id || params.operator ? (typeof params.employee_id === 'string' ? parseInt(params.employee_id, 10) : (params.employee_id || params.operator)) : null,
        log_date: params.date || now,
        content: params.content,
        next_follow_up: params.next_follow_up || null,
        created_at: now,
        type: params.type || 'GENERAL' // 默认类型
      };
      
      const { data, error } = await supabase
        .from('lead_logs')
        .insert([logData])
        .select()
        .single();
      
      if (error) throw error;
      
      // 更新线索的最后联系时间
      await this.updateLead(String(params.lead_id), { lastContact: now });
      
      return data;
    } catch (error) {
      console.error('创建线索日志失败', error);
      throw error;
    }
  },
  
  /**
   * addLeadLog 方法 - createLeadLog 的别名，用于兼容性
   */
  async addLeadLog(params: {
    lead_id: string | number;
    type?: string;
    content: string;
    date?: string;
    operator?: string | number;
    next_follow_up?: string | null;
  }): Promise<LeadLog> {
    return this.createLeadLog({
      lead_id: params.lead_id,
      employee_id: params.operator,
      content: params.content,
      date: params.date,
      type: params.type,
      next_follow_up: params.next_follow_up
    });
  }
};

export default leadService; 