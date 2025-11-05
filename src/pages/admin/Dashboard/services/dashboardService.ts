/**
 * Dashboard 数据服务层
 * 负责从Supabase获取所有Dashboard需要的数据
 */

import { supabase } from '../../../../lib/supabase';
import { DashboardStats, DashboardTask, DashboardActivity, DashboardEvent } from '../types/dashboard.types';

/**
 * 获取Dashboard统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 获取活跃学生数
    const { count: activeStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // 获取本月线索数
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // 获取本月签约数（通过student_services表）
    const { count: monthlySignups } = await supabase
      .from('student_services')
      .select('*', { count: 'exact', head: true })
      .gte('enrollment_date', startOfMonth.toISOString().split('T')[0]);

    // 获取本月收入（从finance_transactions表，这里暂时mock）
    const { data: transactions } = await supabase
      .from('finance_transactions')
      .select('amount')
      .gte('transaction_date', startOfMonth.toISOString().split('T')[0])
      .eq('direction', '收入');

    const monthlyRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    // 这里简单计算增长率（实际应该对比上月数据）
    return {
      activeStudents: activeStudents || 0,
      activeStudentsChange: '+12.5%', // TODO: 计算实际增长率
      monthlyLeads: monthlyLeads || 0,
      monthlyLeadsChange: '+18.2%',
      monthlySignups: monthlySignups || 0,
      monthlySignupsChange: '+25.5%',
      monthlyRevenue: monthlyRevenue,
      monthlyRevenueChange: '+15.8%',
    };
  } catch (error) {
    console.error('获取Dashboard统计数据失败:', error);
    return {
      activeStudents: 0,
      activeStudentsChange: '0%',
      monthlyLeads: 0,
      monthlyLeadsChange: '0%',
      monthlySignups: 0,
      monthlySignupsChange: '0%',
      monthlyRevenue: 0,
      monthlyRevenueChange: '0%',
    };
  }
}

/**
 * 获取我的任务列表（当前用户分配的任务）
 */
export async function getDashboardTasks(userId?: string): Promise<DashboardTask[]> {
  console.log('=== getDashboardTasks 开始执行 ===');
  
  try {
    let personId: number | null = null;

    // 方案1: 从localStorage获取当前员工的person_id
    const userType = localStorage.getItem('userType');
    console.log('用户类型:', userType);
    
    if (userType === 'admin') {
      const employeeData = localStorage.getItem('currentEmployee');
      console.log('localStorage中的employeeData:', employeeData);
      
      if (employeeData) {
        try {
          const employee = JSON.parse(employeeData);
          console.log('解析后的employee对象:', employee);
          console.log('employee的所有key:', Object.keys(employee));
          
          personId = employee.person_id;
          console.log('从localStorage获取到person_id:', personId);
          
          // 如果没有person_id，尝试使用id字段
          if (!personId && employee.id) {
            console.log('使用employee.id作为person_id:', employee.id);
            personId = employee.id;
          }
        } catch (e) {
          console.error('解析employee数据失败:', e);
        }
      }
    }

    // 方案2: 如果localStorage没有，尝试从Supabase Auth获取
    if (!personId && !userId) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const authId = user.id;
        console.log('从Supabase Auth获取到auth_id:', authId);

        // 从employees表获取person_id
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('person_id')
          .eq('auth_id', authId)
          .single();

        if (employeeError || !employeeData?.person_id) {
          console.log('未找到对应的员工记录或person_id:', employeeError);
        } else {
          personId = employeeData.person_id;
          console.log('从数据库查询到person_id:', personId);
        }
      } else {
        console.warn('未获取到用户信息');
      }
    }

    // 如果传入了userId参数，使用它查询
    if (!personId && userId) {
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('person_id')
        .eq('auth_id', userId)
        .single();

      if (employeeError || !employeeData?.person_id) {
        console.log('通过userId未找到对应的员工记录:', employeeError);
      } else {
        personId = employeeData.person_id;
      }
    }

    if (!personId) {
      console.warn('无法获取person_id');
      return [];
    }

    console.log('最终使用的person_id:', personId);

    // 从tasks表获取分配给当前用户的任务
    // assigned_to是数组类型,使用contains查询
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        assigned_to
      `)
      .contains('assigned_to', [personId])
      .not('status', 'in', '(已完成,已取消)')  // 排除已完成和已取消的任务（使用中文状态值）
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('priority', { ascending: false })
      .limit(5);

    if (error) {
      console.error('查询任务失败:', error);
      return [];
    }

    console.log('查询到的任务数据:', tasksData);

    if (!tasksData || tasksData.length === 0) {
      console.log('没有找到分配给person_id', personId, '的任务');
      return [];
    }

    // 转换为Dashboard任务格式
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks: DashboardTask[] = tasksData.map((task: any) => {
      // 确定任务图标
      let icon = '📋';
      if (task.priority === 'high' || task.priority === 'urgent') {
        icon = '🔴';
      } else if (task.priority === 'medium') {
        icon = '🟡';
      } else if (task.priority === 'low') {
        icon = '🟢';
      }

      // 计算截止时间文本
      let deadline = '';
      let type: 'urgent' | 'normal' | 'message' = 'normal';
      
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        
        if (dueDate < now) {
          deadline = '已过期';
          type = 'urgent';
        } else if (dueDate < tomorrow) {
          deadline = '今日截止';
          type = 'urgent';
        } else if (dueDate < nextWeek) {
          const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          deadline = `${daysUntil}天后`;
          type = 'normal';
        } else {
          deadline = dueDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
          type = 'normal';
        }
      }

      return {
        id: task.id,
        title: task.title,
        deadline,
        type,
        icon,
        completed: task.status === '已完成',  // 使用中文状态值
      };
    });
    
    console.log('=== 返回的任务列表 ===', tasks);
    return tasks;
  } catch (error) {
    console.error('=== getDashboardTasks 发生错误 ===');
    console.error('错误详情:', error);
    return [];
  }
}

/**
 * 获取最新动态
 */
export async function getDashboardActivities(limit: number = 5): Promise<DashboardActivity[]> {
  try {
    const activities: DashboardActivity[] = [];

    // 获取最近的学生服务更新
    const { data: recentServices } = await supabase
      .from('student_services')
      .select(`
        id,
        updated_at,
        status,
        students (name, avatar_url)
      `)
      .order('updated_at', { ascending: false })
      .limit(3);

    if (recentServices) {
      recentServices.forEach((service: any, index) => {
        activities.push({
          id: `service-${service.id}`,
          user: service.students?.name || '未知学生',
          action: '更新了',
          content: `服务状态: ${service.status}`,
          time: formatTimeAgo(service.updated_at),
          avatar: service.students?.avatar_url || null,
          type: 'student',
        });
      });
    }

    // 获取最近的线索
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id, name, created_at, avatar_url, source')
      .order('created_at', { ascending: false })
      .limit(2);

    if (recentLeads) {
      recentLeads.forEach((lead: any) => {
        activities.push({
          id: `lead-${lead.id}`,
          user: lead.name,
          action: '成为新线索',
          content: `来源: ${lead.source}`,
          time: formatTimeAgo(lead.created_at),
          avatar: lead.avatar_url || null,
          type: 'student',
        });
      });
    }

    // 按时间排序
    activities.sort((a, b) => {
      // 简单排序，实际应该基于真实时间戳
      return 0;
    });

    return activities.slice(0, limit);
  } catch (error) {
    console.error('获取Dashboard动态失败:', error);
    return [];
  }
}

/**
 * 获取即将到来的日程（从tasks表获取有截止日期的未完成任务）
 */
export async function getDashboardEvents(): Promise<DashboardEvent[]> {
  try {
    // 获取今天和未来7天内有截止日期的任务
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select('id, title, due_date, priority')
      .not('due_date', 'is', null)
      .gte('due_date', today.toISOString().split('T')[0])
      .lte('due_date', nextWeek.toISOString().split('T')[0])
      .not('status', 'in', '(已完成,已取消)')  // 排除已完成和已取消的任务（使用中文状态值）
      .order('due_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('获取Dashboard日程失败:', error);
      return [];
    }

    if (!tasksData || tasksData.length === 0) {
      return [];
    }

    // 转换为日程格式
    const now = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const events: DashboardEvent[] = tasksData.map((task: any) => {
      const dueDate = new Date(task.due_date);
      
      // 确定日期显示文本
      let dateText = '';
      if (dueDate.toDateString() === today.toDateString()) {
        dateText = '今天';
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        dateText = '明天';
      } else {
        dateText = dueDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      }

      // 根据优先级确定颜色和类型
      let color: 'blue' | 'purple' | 'green' | 'orange' | 'red' = 'blue';
      let type: 'meeting' | 'deadline' | 'event' = 'event';
      
      if (task.priority === 'high' || task.priority === 'urgent') {
        color = 'red';
        type = 'deadline';
      } else if (task.priority === 'medium') {
        color = 'orange';
        type = 'meeting';
      } else {
        color = 'blue';
        type = 'event';
      }

      return {
        id: task.id,
        date: dateText,
        time: '', // 任务没有具体时间，留空
        title: task.title,
        type,
        color,
      };
    });

    return events;
  } catch (error) {
    console.error('获取Dashboard日程失败:', error);
    return [];
  }
}

/**
 * 更新任务完成状态
 */
export async function toggleTaskCompletion(taskId: number, completed: boolean): Promise<boolean> {
  try {
    const newStatus = completed ? '已完成' : '进行中';  // 使用中文状态值
    
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      console.error('更新任务状态失败:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('更新任务状态失败:', error);
    return false;
  }
}

/**
 * 辅助函数：格式化时间为"xx前"
 */
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return '刚刚';
  if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
  if (diffInHours < 24) return `${diffInHours}小时前`;
  if (diffInDays < 7) return `${diffInDays}天前`;
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

