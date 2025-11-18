import { createElement } from 'react';
import { Activity, Clock4, Star, Users } from 'lucide-react';

import { supabase } from '../../../../lib/supabase';
import type { MentorEducation } from '../types';
import type { MentorRecord, MentorRole, SummaryMetric } from '../types';

/**
 * 数据库中的导师记录结构
 */
interface DatabaseMentor {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  gender?: string;
  avatar_url?: string;
  specializations?: string[] | null;
  service_scope?: string[] | null;
  expertise_level?: string;
  hourly_rate?: number;
  bio?: string;
  is_active?: boolean;
  employee_id?: number;
  location?: string;
  education?: any; // JSONB 格式的教育背景
  created_at?: string;
  updated_at?: string;
}

/**
 * 导师统计数据
 */
interface MentorStats {
  mentorId: number;
  studentsCount: number;
  activeServicesCount: number;
}

/**
 * 将数据库导师数据转换为前端 MentorRecord 类型
 */
function transformMentorToRecord(
  dbMentor: DatabaseMentor,
  stats: MentorStats | null,
): MentorRecord {
  // 处理专业领域数组
  const specializations = Array.isArray(dbMentor.specializations)
    ? dbMentor.specializations
    : dbMentor.specializations
      ? [dbMentor.specializations]
      : [];

  // 处理服务范围数组
  const serviceScope = Array.isArray(dbMentor.service_scope)
    ? dbMentor.service_scope
    : dbMentor.service_scope
      ? [dbMentor.service_scope]
      : [];

  // 根据服务范围推断角色
  const primaryRole: MentorRole = determinePrimaryRole(serviceScope);
  const secondaryRoles: MentorRole[] = determineSecondaryRoles(serviceScope, primaryRole);

  // 生成头像URL（如果没有则使用默认）
  const avatar =
    dbMentor.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbMentor.name)}`;

  // 计算可用率和利用率（基于统计数据）
  const availabilityRate = calculateAvailabilityRate(stats);
  const utilizationRate = calculateUtilizationRate(stats);

  // 计算满意度（暂时使用默认值，后续可以从评价表获取）
  const satisfaction = 4.5;

  // 判断风险等级
  const risk: '正常' | '关注' = utilizationRate > 80 ? '关注' : '正常';

  // 处理标签（从专业领域和服务范围生成）
  const tags = [...specializations, ...serviceScope].slice(0, 5);

  // 处理语言（暂时使用默认，后续可以从员工表获取）
  const languages = ['中文', '英文'];

  // 处理教育背景（如果存在）
  let educationArray: MentorEducation[] = [];
  if (dbMentor.education) {
    try {
      const educationData = dbMentor.education;
      
      interface EducationData {
        school?: string;
        university?: string;
        degree?: string;
        major?: string;
        year?: string;
        period?: string;
        graduation_year?: string;
      }

      if (Array.isArray(educationData)) {
        educationArray = educationData.map((edu: EducationData) => {
          // 处理学位：如果有 degree 和 major，组合显示；否则只显示其中一个
          let degreeText = '';
          if (edu.degree && edu.major) {
            degreeText = `${edu.degree} ${edu.major}`;
          } else {
            degreeText = edu.degree || edu.major || '未知学位';
          }
          
          // 处理学校名称
          const schoolText = edu.school || edu.university || '未知学校';
          
          // 处理时间：如果 period 为空字符串，则不显示
          const periodText = edu.year || edu.period || edu.graduation_year || '';
          
          return {
            school: schoolText,
            degree: degreeText,
            period: periodText || '未知时间',
          };
        });
      } else if (educationData && typeof educationData === 'object') {
        // 单个教育背景对象
        const edu = educationData as EducationData;
        let degreeText = '';
        if (edu.degree && edu.major) {
          degreeText = `${edu.degree} ${edu.major}`;
        } else {
          degreeText = edu.degree || edu.major || '未知学位';
        }
        
        educationArray = [
          {
            school: edu.school || edu.university || '未知学校',
            degree: degreeText,
            period: edu.year || edu.period || edu.graduation_year || '未知时间',
          },
        ];
      }
    } catch (err) {
      console.warn('解析教育背景失败:', err);
    }
  }

  return {
    id: `mentor-${dbMentor.id}`,
    name: dbMentor.name || '未知导师',
    avatar,
    primaryRole,
    secondaryRoles,
    email: dbMentor.email || '',
    phone: dbMentor.contact || '',
    timezone: 'GMT+8', // 默认时区，后续可以从员工表获取
    region: dbMentor.location || '未知地区',
    tags,
    languages,
    availabilityRate,
    utilizationRate,
    studentsCount: stats?.studentsCount || 0,
    satisfaction,
    risk,
    lastActivity: dbMentor.updated_at || dbMentor.created_at || new Date().toISOString(),
    headline: dbMentor.bio ? `${dbMentor.bio.substring(0, 30)}...` : undefined,
    bio: dbMentor.bio,
    focusAreas: specializations,
    serviceScope,
    pricePerHour: dbMentor.hourly_rate,
    education: educationArray.length > 0 ? educationArray : undefined,
  };
}

/**
 * 根据服务范围确定主要角色
 */
function determinePrimaryRole(serviceScope: string[]): MentorRole {
  if (serviceScope.some((scope) => scope.includes('文书') || scope.includes('PS') || scope.includes('Essay'))) {
    return '文书';
  }
  if (serviceScope.some((scope) => scope.includes('材料') || scope.includes('文档'))) {
    return '材料';
  }
  if (serviceScope.some((scope) => scope.includes('质检') || scope.includes('审核'))) {
    return '质检';
  }
  if (serviceScope.some((scope) => scope.includes('面试') || scope.includes('Interview'))) {
    return '面试官';
  }
  return '顾问';
}

/**
 * 确定次要角色
 */
function determineSecondaryRoles(serviceScope: string[], primaryRole: MentorRole): MentorRole[] {
  const roles: MentorRole[] = [];
  const roleMap: Record<string, MentorRole> = {
    文书: '文书',
    材料: '材料',
    质检: '质检',
    面试: '面试官',
    顾问: '顾问',
  };

  serviceScope.forEach((scope) => {
    Object.entries(roleMap).forEach(([key, role]) => {
      if (scope.includes(key) && role !== primaryRole && !roles.includes(role)) {
        roles.push(role);
      }
    });
  });

  return roles.slice(0, 2); // 最多返回2个次要角色
}

/**
 * 计算可用率（基于活跃服务数量）
 */
function calculateAvailabilityRate(stats: MentorStats | null): number {
  if (!stats) return 70;
  // 简单的计算逻辑：学生数越多，可用率可能越低
  if (stats.studentsCount === 0) return 100;
  if (stats.studentsCount <= 5) return 90;
  if (stats.studentsCount <= 10) return 80;
  if (stats.studentsCount <= 15) return 70;
  return 60;
}

/**
 * 计算利用率（基于活跃服务数量）
 */
function calculateUtilizationRate(stats: MentorStats | null): number {
  if (!stats) return 50;
  // 简单的计算逻辑：活跃服务数越多，利用率越高
  if (stats.activeServicesCount === 0) return 0;
  if (stats.activeServicesCount <= 3) return 30;
  if (stats.activeServicesCount <= 6) return 50;
  if (stats.activeServicesCount <= 10) return 70;
  return 85;
}

/**
 * 获取所有导师的统计数据
 */
async function getMentorStats(): Promise<Map<number, MentorStats>> {
  try {
    const statsMap = new Map<number, MentorStats>();

    // 从 student_services 表统计每个导师的学生数量和服务数量
    const { data: services, error } = await supabase
      .from('student_services')
      .select('mentor_ref_id, status')
      .not('mentor_ref_id', 'is', null);

    if (error) {
      console.error('获取导师统计数据失败:', error);
      return statsMap;
    }

    // 统计每个导师的数据
    services?.forEach((service) => {
      const mentorId = service.mentor_ref_id as number;
      if (!mentorId) return;

      if (!statsMap.has(mentorId)) {
        statsMap.set(mentorId, {
          mentorId,
          studentsCount: 0,
          activeServicesCount: 0,
        });
      }

      const stats = statsMap.get(mentorId)!;
      stats.activeServicesCount++;

      // 统计唯一学生数（需要去重，这里简化处理）
      // 实际应该通过关联查询获取唯一学生数
    });

    // 获取每个导师的唯一学生数
    const mentorIds = Array.from(statsMap.keys());
    for (const mentorId of mentorIds) {
      const { data: uniqueStudents } = await supabase
        .from('student_services')
        .select('student_ref_id')
        .eq('mentor_ref_id', mentorId)
        .not('student_ref_id', 'is', null);

      if (uniqueStudents) {
        const uniqueStudentIds = new Set(
          uniqueStudents.map((s) => s.student_ref_id).filter((id) => id != null),
        );
        const stats = statsMap.get(mentorId);
        if (stats) {
          stats.studentsCount = uniqueStudentIds.size;
        }
      }
    }

    return statsMap;
  } catch (error) {
    console.error('获取导师统计数据时出错:', error);
    return new Map();
  }
}

/**
 * 根据ID获取单个导师详情
 */
export async function fetchMentorById(mentorId: string | number): Promise<MentorRecord | null> {
  try {
    console.log(`🔄 从数据库加载导师详情，ID: ${mentorId}`);

    // 提取数字ID（格式可能是 mentor-123 或 123）
    const id = typeof mentorId === 'string' ? parseInt(mentorId.replace('mentor-', '')) : mentorId;

    if (isNaN(id)) {
      throw new Error('无效的导师ID');
    }

    // 获取导师数据（包括 employee_id）
    const { data: mentor, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取导师详情失败:', error);
      if (error.code === 'PGRST116') {
        // 未找到记录
        return null;
      }
      throw new Error(error.message || '获取导师详情失败');
    }

    if (!mentor) {
      return null;
    }

    // 获取统计数据
    const statsMap = await getMentorStats();
    const stats = statsMap.get(id) || null;

    // 转换数据
    const mentorRecord = transformMentorToRecord(mentor as DatabaseMentor, stats);
    
    // 保存 employee_id 到记录中（用于后续查询任务）
    (mentorRecord as MentorRecord & { employeeId?: number }).employeeId = (mentor as DatabaseMentor).employee_id;

    // 首先尝试从 mentors 表的 education 字段读取教育背景
    if ((mentor as DatabaseMentor).education) {
      try {
        const educationData = (mentor as DatabaseMentor).education;
        let educationArray: MentorEducation[] = [];

        interface EducationData {
          school?: string;
          university?: string;
          degree?: string;
          major?: string;
          year?: string;
          period?: string;
          graduation_year?: string;
        }

        if (Array.isArray(educationData)) {
          educationArray = educationData.map((edu: EducationData) => {
            // 处理学位：如果有 degree 和 major，组合显示；否则只显示其中一个
            let degreeText = '';
            if (edu.degree && edu.major) {
              degreeText = `${edu.degree} ${edu.major}`;
            } else {
              degreeText = edu.degree || edu.major || '未知学位';
            }
            
            // 处理学校名称
            const schoolText = edu.school || edu.university || '未知学校';
            
            // 处理时间：如果 period 为空字符串，则不显示
            const periodText = edu.year || edu.period || edu.graduation_year || '';
            
            return {
              school: schoolText,
              degree: degreeText,
              period: periodText || '未知时间',
            };
          });
        } else if (educationData && typeof educationData === 'object') {
          // 单个教育背景对象
          const edu = educationData as EducationData;
          let degreeText = '';
          if (edu.degree && edu.major) {
            degreeText = `${edu.degree} ${edu.major}`;
          } else {
            degreeText = edu.degree || edu.major || '未知学位';
          }
          
          educationArray = [
            {
              school: edu.school || edu.university || '未知学校',
              degree: degreeText,
              period: edu.year || edu.period || edu.graduation_year || '未知时间',
            },
          ];
        }

        if (educationArray.length > 0) {
          mentorRecord.education = educationArray;
        }
      } catch (err) {
        console.warn('解析导师教育背景失败:', err);
      }
    }

    // 如果导师表中没有教育背景，且导师关联了员工，尝试获取员工的教育背景
    if (!mentorRecord.education && (mentor as DatabaseMentor).employee_id) {
      try {
        const { data: employee } = await supabase
          .from('employees')
          .select('education')
          .eq('id', (mentor as DatabaseMentor).employee_id)
          .single();

        if (employee && employee.education) {
          // 将员工的教育背景转换为导师教育背景格式
          // education 可能是 JSONB 对象 { degree, school, year } 或数组
          let educationArray: MentorEducation[] = [];

          interface EducationData {
            school?: string;
            university?: string;
            degree?: string;
            major?: string;
            year?: string;
            period?: string;
            graduation_year?: string;
          }

          if (Array.isArray(employee.education)) {
            educationArray = employee.education.map((edu: EducationData) => {
              // 处理学位：如果有 degree 和 major，组合显示；否则只显示其中一个
              let degreeText = '';
              if (edu.degree && edu.major) {
                degreeText = `${edu.degree} ${edu.major}`;
              } else {
                degreeText = edu.degree || edu.major || '未知学位';
              }
              
              // 处理学校名称
              const schoolText = edu.school || edu.university || '未知学校';
              
              // 处理时间：如果 period 为空字符串，则不显示
              const periodText = edu.year || edu.period || edu.graduation_year || '';
              
              return {
                school: schoolText,
                degree: degreeText,
                period: periodText || '未知时间',
              };
            });
          } else if (employee.education && typeof employee.education === 'object') {
            // 单个教育背景对象
            const edu = employee.education as EducationData;
            let degreeText = '';
            if (edu.degree && edu.major) {
              degreeText = `${edu.degree} ${edu.major}`;
            } else {
              degreeText = edu.degree || edu.major || '未知学位';
            }
            
            educationArray = [
              {
                school: edu.school || edu.university || '未知学校',
                degree: degreeText,
                period: edu.year || edu.period || edu.graduation_year || '未知时间',
              },
            ];
          }

          if (educationArray.length > 0) {
            mentorRecord.education = educationArray;
          }
        }
      } catch (err) {
        console.warn('获取员工教育背景失败:', err);
        // 忽略错误，继续使用导师数据
      }
    }

    console.log(`✅ 成功加载导师详情: ${mentorRecord.name}`);
    return mentorRecord;
  } catch (error) {
    console.error('获取导师详情时发生错误:', error);
    throw error;
  }
}

/**
 * 获取导师相关的任务列表
 */
export interface MentorTask {
  id: string;
  title: string;
  student: string;
  type: string;
  status: string;
  deadline: string;
  priority: '高' | '中' | '低';
}

export async function getMentorTasks(mentorId: number, employeeId?: number): Promise<MentorTask[]> {
  try {
    // 如果导师关联了员工，通过员工ID查找任务
    // 否则通过 student_services 表的 mentor_ref_id 查找相关服务，再找相关任务
    let tasks: MentorTask[] = [];

    if (employeeId) {
      // 通过员工ID查找分配给该员工的任务
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          status,
          priority,
          due_date,
          related_student_id,
          student:related_student_id(id, name)
        `)
        .contains('assigned_to', [employeeId])
        .in('status', ['待处理', '进行中'])
        .order('due_date', { ascending: true })
        .limit(10);

      if (!error && tasksData) {
        interface TaskStudent {
          id: number;
          name: string;
        }
        tasks = tasksData.map((task) => {
          const student = Array.isArray(task.student) ? task.student[0] : task.student;
          return {
            id: `task-${task.id}`,
            title: task.title,
            student: (student as TaskStudent | null)?.name || '未知学生',
            type: '任务',
            status: task.status === '待处理' ? '待开始' : task.status === '进行中' ? '进行中' : '已完成',
            deadline: task.due_date || '',
            priority: (task.priority as '高' | '中' | '低') || '中',
          };
        });
      }
    }

    // 也可以通过 student_services 查找相关服务
    const { data: services } = await supabase
      .from('student_services')
      .select(`
        id,
        student_ref_id,
        status,
        student:student_ref_id(id, name)
      `)
      .eq('mentor_ref_id', mentorId)
      .in('status', ['进行中', 'in_progress', '未开始', 'not_started'])
      .limit(5);

    // 将服务转换为任务格式（简化处理）
    if (services) {
      interface ServiceStudent {
        id: number;
        name: string;
      }
      const serviceTasks: MentorTask[] = services.map((service) => {
        const student = Array.isArray(service.student) ? service.student[0] : service.student;
        return {
          id: `service-${service.id}`,
          title: '服务跟进',
          student: (student as ServiceStudent | null)?.name || '未知学生',
          type: '服务',
          status: '进行中',
          deadline: '',
          priority: '中',
        };
      });

      tasks = [...tasks, ...serviceTasks];
    }

    return tasks.slice(0, 10); // 最多返回10个
  } catch (error) {
    console.error('获取导师任务失败:', error);
    return [];
  }
}

/**
 * 获取导师相关的学生列表
 */
export interface MentorStudent {
  id: number;
  name: string;
  avatar_url?: string;
  serviceCount: number;
}

export async function getMentorStudents(mentorId: number): Promise<MentorStudent[]> {
  try {
    const { data: services, error } = await supabase
      .from('student_services')
      .select(`
        student_ref_id,
        student:student_ref_id(id, name, avatar_url)
      `)
      .eq('mentor_ref_id', mentorId)
      .not('student_ref_id', 'is', null);

    if (error) {
      console.error('获取导师学生列表失败:', error);
      return [];
    }

    if (!services) return [];

    // 统计每个学生的服务数量
    interface ServiceStudent {
      id: number;
      name: string;
      avatar_url?: string;
    }
    const studentMap = new Map<number, { student: ServiceStudent; count: number }>();
    services.forEach((service) => {
      const studentId = service.student_ref_id;
      if (studentId && service.student) {
        const student = Array.isArray(service.student) ? service.student[0] : service.student;
        const studentData = student as ServiceStudent;
        const existing = studentMap.get(studentId);
        if (existing) {
          existing.count++;
        } else {
          studentMap.set(studentId, {
            student: studentData,
            count: 1,
          });
        }
      }
    });

    return Array.from(studentMap.values()).map(({ student, count }) => ({
      id: student.id,
      name: student.name || '未知学生',
      avatar_url: student.avatar_url,
      serviceCount: count,
    }));
  } catch (error) {
    console.error('获取导师学生列表失败:', error);
    return [];
  }
}

/**
 * 获取所有导师记录
 */
export async function fetchAllMentors(): Promise<MentorRecord[]> {
  try {
    console.log('🔄 从数据库加载导师数据...');

    // 并行获取导师数据和统计数据
    const [mentorsResult, statsMap] = await Promise.all([
      supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      getMentorStats(),
    ]);

    const { data: mentors, error } = mentorsResult;

    if (error) {
      console.error('获取导师数据失败:', error);
      throw new Error(error.message || '获取导师数据失败');
    }

    if (!mentors || mentors.length === 0) {
      console.warn('未找到任何活跃导师');
      return [];
    }

    // 转换数据
    const mentorRecords = mentors.map((mentor) => {
      const stats = statsMap.get(mentor.id) || null;
      return transformMentorToRecord(mentor as DatabaseMentor, stats);
    });

    console.log(`✅ 成功加载 ${mentorRecords.length} 位导师`);
    return mentorRecords;
  } catch (error) {
    console.error('获取导师数据时发生错误:', error);
    throw error;
  }
}

/**
 * 获取导师统计数据（用于 SummaryCards）
 */
export async function getMentorSummaryMetrics(): Promise<SummaryMetric[]> {
  try {
    // 获取所有导师（包括非活跃的用于统计）
    const { data: allMentors, error: mentorsError } = await supabase
      .from('mentors')
      .select('id, is_active, created_at');

    if (mentorsError) {
      console.error('获取导师统计数据失败:', mentorsError);
      return getDefaultSummaryMetrics();
    }

    // 获取活跃导师数
    const activeMentors = allMentors?.filter((m) => m.is_active) || [];
    const totalMentors = allMentors?.length || 0;
    const activeMentorsCount = activeMentors.length;

    // 获取活跃服务数（用于计算活跃度）
    // 注意：状态值可能是中文或英文，需要兼容处理
    const { data: activeServices } = await supabase
      .from('student_services')
      .select('id, status')
      .in('status', ['进行中', 'in_progress', '未开始', 'not_started', '待处理']);

    const activeServicesCount = activeServices?.length || 0;

    // 计算活跃导师比例
    const activeRate = totalMentors > 0 ? Math.round((activeMentorsCount / totalMentors) * 100) : 0;

    // 计算平均利用率（简化计算）
    const avgUtilization = activeServicesCount > 0 ? Math.min(100, Math.round((activeServicesCount / (activeMentorsCount || 1)) * 5)) : 0;

    // 计算本季度新增导师数（简化：最近90天）
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const recentMentors = allMentors?.filter(
      (m) => m.created_at && new Date(m.created_at) >= ninetyDaysAgo,
    ) || [];
    const newMentorsThisQuarter = recentMentors.length;

    // 计算平均满意度（暂时使用固定值，后续可以从评价表获取）
    const avgSatisfaction = 4.7;

    return [
      {
        title: '在册导师',
        value: totalMentors,
        trend: newMentorsThisQuarter > 0 ? `+${newMentorsThisQuarter} 本季度新签` : '暂无新增',
        positive: true,
        icon: createElement(Users, { className: 'h-5 w-5 text-blue-500' }),
      },
      {
        title: '活跃导师',
        value: `${activeRate}%`,
        trend: activeMentorsCount > 0 ? `${activeMentorsCount} 位活跃中` : '暂无活跃导师',
        positive: activeRate >= 70,
        icon: createElement(Activity, { className: 'h-5 w-5 text-emerald-500' }),
      },
      {
        title: '平均利用率',
        value: `${avgUtilization}%`,
        trend: avgUtilization >= 70 ? '利用率良好' : '利用率偏低',
        positive: avgUtilization >= 70,
        icon: createElement(Clock4, { className: 'h-5 w-5 text-amber-500' }),
      },
      {
        title: '满意度',
        value: avgSatisfaction.toFixed(1),
        trend: '学生反馈良好',
        positive: true,
        icon: createElement(Star, { className: 'h-5 w-5 text-purple-500' }),
      },
    ];
  } catch (error) {
    console.error('获取导师统计数据时出错:', error);
    return getDefaultSummaryMetrics();
  }
}

/**
 * 获取默认统计数据（当数据库查询失败时使用）
 */
function getDefaultSummaryMetrics(): SummaryMetric[] {
  return [
    {
      title: '在册导师',
      value: 0,
      trend: '暂无数据',
      positive: false,
      icon: createElement(Users, { className: 'h-5 w-5 text-blue-500' }),
    },
    {
      title: '活跃导师',
      value: '0%',
      trend: '暂无数据',
      positive: false,
      icon: createElement(Activity, { className: 'h-5 w-5 text-emerald-500' }),
    },
    {
      title: '平均利用率',
      value: '0%',
      trend: '暂无数据',
      positive: false,
      icon: createElement(Clock4, { className: 'h-5 w-5 text-amber-500' }),
    },
    {
      title: '满意度',
      value: '0.0',
      trend: '暂无数据',
      positive: false,
      icon: createElement(Star, { className: 'h-5 w-5 text-purple-500' }),
    },
  ];
}

/**
 * 创建新导师
 */
export interface CreateMentorData {
  name: string;
  email?: string;
  contact?: string;
  gender?: string;
  avatar_url?: string;
  specializations?: string[];
  service_scope?: string[];
  expertise_level?: string;
  hourly_rate?: number;
  bio?: string;
  location?: string;
  employee_id?: number;
  is_active?: boolean;
}

export async function createMentor(data: CreateMentorData): Promise<number> {
  try {
    console.log('🔄 创建新导师...', data);

    // 准备数据库数据
    const mentorData = {
      name: data.name,
      email: data.email || null,
      contact: data.contact || null,
      gender: data.gender || null,
      avatar_url: data.avatar_url || null,
      specializations: data.specializations && data.specializations.length > 0 ? data.specializations : null,
      service_scope: data.service_scope && data.service_scope.length > 0 ? data.service_scope : null,
      expertise_level: data.expertise_level || null,
      hourly_rate: data.hourly_rate || null,
      bio: data.bio || null,
      location: data.location || null,
      employee_id: data.employee_id || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
    };

    const { data: newMentor, error } = await supabase
      .from('mentors')
      .insert(mentorData)
      .select('id')
      .single();

    if (error) {
      console.error('创建导师失败:', error);
      throw new Error(error.message || '创建导师失败');
    }

    console.log(`✅ 成功创建导师，ID: ${newMentor.id}`);
    return newMentor.id;
  } catch (error) {
    console.error('创建导师时发生错误:', error);
    throw error;
  }
}


