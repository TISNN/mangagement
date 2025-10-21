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
  employee_name?: string; // 非数据库字段，用于显示
  log_date: string;
  content: string;
  next_follow_up: string | null;
  created_at: string;
  // 移除所有不在数据库中的字段
}

/**
 * 添加日志创建参数接口
 */
export interface CreateLeadLogParams {
  lead_id: string | number;
  employee_id?: string | number;
  content: string;
  next_follow_up?: string | null;
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
    const MAX_RETRIES = 2;
    let retries = 0;
    
    while (retries <= MAX_RETRIES) {
      try {
        console.log(`尝试获取线索数据 (尝试 ${retries + 1}/${MAX_RETRIES + 1})，id=${id}`);
        
        // 创建一个带超时的Promise
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('获取线索数据超时')), 10000)
        );
        
        // 执行查询并处理超时
        const queryPromise = supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single();
          
        // 使用Promise.race处理超时
        const { data, error } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => { throw new Error('获取线索数据超时'); })
        ]);
      
        if (error) throw error;
        
        if (!data) {
          throw new Error(`未找到ID为${id}的线索`);
        }
        
        // 转换数据格式
        return transformDbToFrontend(data);
      } catch (error) {
        console.error(`获取线索详情失败，id=${id}, 尝试=${retries + 1}/${MAX_RETRIES + 1}`, error);
        
        // 如果已达到最大重试次数，抛出异常
        if (retries >= MAX_RETRIES) {
          if (error instanceof Error && 
             (error.message.includes('timeout') || 
              error.message.includes('超时') ||
              error.message.includes('network') ||
              error.message.includes('connection'))) {
            throw new Error(`网络连接问题: ${error.message}`);
          }
          throw error;
        }
        
        retries++;
        // 等待一段时间后重试，每次重试延迟增加
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    // 理论上不会执行到这里
    throw new Error(`未能获取ID为${id}的线索数据`);
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
   * 获取线索日志
   */
  async getLeadLogs(leadId: string | number): Promise<LeadLog[]> {
    const MAX_RETRIES = 2;
    let retries = 0;
    
    while (retries <= MAX_RETRIES) {
      try {
        console.log(`尝试获取线索日志 (尝试 ${retries + 1}/${MAX_RETRIES + 1})，leadId=${leadId}`);
        
        // 确保leadId是数字
        const numericLeadId = typeof leadId === 'string' ? parseInt(leadId, 10) : leadId;
        
        if (isNaN(numericLeadId)) {
          throw new Error(`无效的线索ID: ${leadId}`);
        }
        
        // 执行查询获取日志
        const { data, error } = await supabase
          .from('lead_logs')
          .select('*')
          .eq('lead_id', numericLeadId)
          .order('log_date', { ascending: false });
        
        if (error) throw error;
        
        // 如果没有数据，返回空数组
        if (!data || !Array.isArray(data)) {
          console.log(`未找到线索日志，leadId=${leadId}`);
          return [];
        }
        
        // 处理员工名称 - 添加错误捕获
        let logsWithEmployeeName: LeadLog[] = [];
        try {
          // 获取员工ID列表
          const employeeIds = [...new Set(data.filter(log => log.employee_id).map(log => log.employee_id))];
          
          // 只有在有员工ID时才获取员工信息
          let employeeMap: Record<number, string> = {};
          
          if (employeeIds.length > 0) {
            const { data: employees, error: empError } = await supabase
              .from('employees')
              .select('id, name')
              .in('id', employeeIds);
            
            if (empError) {
              console.warn('获取员工信息失败，将使用默认名称', empError);
            } else if (employees) {
              // 创建ID到名称的映射
              employeeMap = employees.reduce((map: Record<number, string>, emp) => {
                map[emp.id] = emp.name;
                return map;
              }, {});
            }
          }
          
          // 添加员工名称
          logsWithEmployeeName = data.map(log => ({
            ...log,
            // 确保日期字段正确格式化
            log_date: log.log_date || log.created_at || new Date().toISOString(),
            // 添加员工名称，如果没有找到则使用默认值
            employee_name: log.employee_id ? (employeeMap[log.employee_id] || `员工${log.employee_id}`) : '系统'
          }));
        } catch (empProcessError) {
          console.error('处理员工名称时出错', empProcessError);
          // 即使处理员工名称失败，也要返回基本日志信息
          logsWithEmployeeName = data.map(log => ({
            ...log,
            log_date: log.log_date || log.created_at || new Date().toISOString(),
            employee_name: log.employee_id ? `员工${log.employee_id}` : '系统'
          }));
        }
        
        console.log(`成功获取线索日志，共${logsWithEmployeeName.length}条`);
        return logsWithEmployeeName;
      } catch (error) {
        console.error(`获取线索日志失败 (尝试 ${retries + 1}/${MAX_RETRIES + 1})，leadId=${leadId}`, error);
        retries++;
        
        // 如果已达到最大重试次数，抛出异常
        if (retries > MAX_RETRIES) {
          console.error(`获取线索日志达到最大重试次数，放弃，leadId=${leadId}`);
          return []; // 返回空数组而不是抛出异常，更具弹性
        }
        
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    // 这行代码理论上不会执行，因为重试循环会返回或抛出异常
    return [];
  },
  
  /**
   * 创建线索日志
   */
  async createLeadLog(params: CreateLeadLogParams): Promise<LeadLog> {
    try {
      // 参数验证和处理
      if (!params.lead_id) {
        throw new Error('缺少必要参数: lead_id');
      }
      
      if (!params.content || params.content.trim() === '') {
        throw new Error('缺少必要参数: content');
      }
      
      // 确保lead_id是数字
      const lead_id = typeof params.lead_id === 'string' ? parseInt(params.lead_id, 10) : params.lead_id;
      
      // 设置员工ID，如果没有提供则使用操作人ID
      let employee_id = params.employee_id;
      if (!employee_id && params.operator) {
        employee_id = typeof params.operator === 'string' ? parseInt(params.operator, 10) : params.operator;
      }
      
      // 如果依然没有员工ID，尝试从localStorage获取
      if (!employee_id) {
        try {
          const userStr = localStorage.getItem('currentUser');
          if (userStr) {
            const user = JSON.parse(userStr);
            employee_id = user.id;
          }
        } catch (e) {
          console.warn('无法从localStorage获取当前用户', e);
        }
      }
      
      // 日志日期处理，优先使用传入的日期，否则使用当前时间
      const log_date = params.date || new Date().toISOString();
      
      // 插入日志
      const { data, error } = await supabase
        .from('lead_logs')
        .insert({
          lead_id,
          employee_id: employee_id || null,
          log_date,
          content: params.content.trim(),
          next_follow_up: params.next_follow_up || null
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // 更新线索的最后联系时间
      try {
        await supabase
          .from('leads')
          .update({ 
            lastContact: log_date,
            // 如果有下次跟进时间，也更新线索的下次跟进时间
            nextFollowUp: params.next_follow_up || undefined 
          })
          .eq('id', lead_id);
      } catch (updateError) {
        console.error('更新线索最后联系时间失败', updateError);
        // 不阻止流程继续
      }
      
      return {
        ...data,
        employee_name: data.employee_id ? `员工${data.employee_id}` : '系统'
      };
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
      next_follow_up: params.next_follow_up
    });
  },
  
  /**
   * 删除线索日志
   */
  async deleteLeadLog(logId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('lead_logs')
        .delete()
        .eq('id', logId);
        
      if (error) throw error;
    } catch (error) {
      console.error(`删除线索日志失败: ${logId}`, error);
      throw error;
    }
  },
  
  /**
   * 更新线索日志
   */
  async updateLeadLog(logId: number, data: { content: string, next_follow_up: string | null }): Promise<void> {
    try {
      // 参数验证
      if (!logId || isNaN(logId)) {
        throw new Error(`无效的日志ID: ${logId}`);
      }
      
      if (!data.content || data.content.trim() === '') {
        throw new Error('日志内容不能为空');
      }
      
      // 准备更新数据
      const updateData: Record<string, string | null> = {
        content: data.content.trim()
      };
      
      // 只有当next_follow_up明确设置（包括null）时才更新
      if (data.next_follow_up !== undefined) {
        updateData.next_follow_up = data.next_follow_up;
      }
      
      // 执行更新
      const { error } = await supabase
        .from('lead_logs')
        .update(updateData)
        .eq('id', logId);
      
      if (error) throw error;
      
      // 如果更新了下次跟进时间，同时更新对应线索的nextFollowUp字段
      if (data.next_follow_up !== undefined) {
        try {
          // 首先查询这个日志属于哪个线索
          const { data: logData, error: logError } = await supabase
            .from('lead_logs')
            .select('lead_id')
            .eq('id', logId)
            .single();
          
          if (!logError && logData && logData.lead_id) {
            // 更新线索的下次跟进时间
            await supabase
              .from('leads')
              .update({ 
                nextFollowUp: data.next_follow_up 
              })
              .eq('id', logData.lead_id);
          }
        } catch (updateLeadError) {
          console.warn('更新线索下次跟进时间失败', updateLeadError);
          // 不阻止主流程
        }
      }
      
      console.log(`成功更新日志 ID: ${logId}`);
    } catch (error) {
      console.error(`更新线索日志失败, ID=${logId}`, error);
      throw error;
    }
  }
};

export default leadService; 