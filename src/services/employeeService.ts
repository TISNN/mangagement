import { supabase } from '../supabase';

// 员工类型定义
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on_leave' | 'resigned';
  avatar_url: string;
  join_date: string;
  location: string;
  skills: string[];
  projects: number;
  tasks: {
    total: number;
    completed: number;
  };
  is_partner: boolean;
}

class EmployeeService {
  /**
   * 获取所有员工
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) throw error;

      // 处理数据格式，确保与前端组件期望的格式匹配
      return data.map((employee: any) => ({
        id: employee.id.toString(),
        name: employee.name || '',
        position: employee.position || '',
        department: employee.department || '',
        email: employee.email || '',
        phone: employee.phone || '',
        status: employee.status || 'active',
        avatar_url: employee.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${employee.name}&backgroundColor=b6e3f4`,
        join_date: employee.join_date || '',
        location: employee.location || '',
        skills: employee.skills ? JSON.parse(employee.skills) : [],
        projects: employee.projects || 0,
        tasks: {
          total: employee.task_total || 0,
          completed: employee.task_completed || 0
        },
        is_partner: employee.is_partner || false
      }));
    } catch (error) {
      console.error('获取员工列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取单个员工详情
   */
  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id.toString(),
        name: data.name || '',
        position: data.position || '',
        department: data.department || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || 'active',
        avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}&backgroundColor=b6e3f4`,
        join_date: data.join_date || '',
        location: data.location || '',
        skills: data.skills ? JSON.parse(data.skills) : [],
        projects: data.projects || 0,
        tasks: {
          total: data.task_total || 0,
          completed: data.task_completed || 0
        },
        is_partner: data.is_partner || false
      };
    } catch (error) {
      console.error(`获取员工(ID: ${id})失败:`, error);
      throw error;
    }
  }

  /**
   * 添加或更新员工
   */
  async upsertEmployee(employee: Partial<Employee>): Promise<Employee> {
    try {
      // 转换数据格式以适应数据库表结构
      const employeeData = {
        id: employee.id ? parseInt(employee.id) : undefined,
        name: employee.name,
        position: employee.position,
        department: employee.department,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        avatar_url: employee.avatar_url,
        join_date: employee.join_date,
        location: employee.location,
        skills: employee.skills ? JSON.stringify(employee.skills) : null,
        projects: employee.projects,
        task_total: employee.tasks?.total,
        task_completed: employee.tasks?.completed,
        is_partner: employee.is_partner
      };

      const { data, error } = await supabase
        .from('employees')
        .upsert(employeeData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id.toString(),
        name: data.name || '',
        position: data.position || '',
        department: data.department || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || 'active',
        avatar_url: data.avatar_url || '',
        join_date: data.join_date || '',
        location: data.location || '',
        skills: data.skills ? JSON.parse(data.skills) : [],
        projects: data.projects || 0,
        tasks: {
          total: data.task_total || 0,
          completed: data.task_completed || 0
        },
        is_partner: data.is_partner || false
      };
    } catch (error) {
      console.error('保存员工失败:', error);
      throw error;
    }
  }

  /**
   * 删除员工
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`删除员工(ID: ${id})失败:`, error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService(); 