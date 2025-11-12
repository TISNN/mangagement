import { supabase } from '../lib/supabase';
import {
  StudentService,
  Person,
  StudentProfile,
  ServiceProjectOverview,
  ServiceProgressLog,
} from '../types/people';
import { getCurrentLocalISOString } from '../utils/dateUtils';

// 学生数据视图类型
interface StudentData {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  is_active: boolean;
  education_level?: string;
  school?: string;
  major?: string;
  graduation_year?: number;
  status?: string;
  location?: string; // 所在地区
  address?: string;  // 详细地址
  contact?: string;  // 联系电话
}

// 导师数据视图类型
interface MentorData {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  specializations?: string[];
  expertise_level?: string;
  is_active: boolean;
}

interface MentorTeamRow {
  mentor_id: number;
  mentor_name: string;
  role_key?: string;
  role_name?: string;
  responsibilities?: string;
  is_primary?: boolean;
}

// 服务视图类型
interface ServiceData {
  id: number;
  student_id: number;
  student_ref_id?: number;
  service_type_id: number;
  mentor_id?: number;
  mentor_ref_id?: number;
  status: string;
  enrollment_date: string;
  end_date?: string;
  progress?: number;
  payment_status?: string;
  detail_data?: Record<string, unknown>;
  mentor_team?: MentorTeamRow[];
  service_type?: {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    category: string;
    education_level?: string | null;
    parent_id?: number | null;
  };
  mentor?: MentorData;
}

// 服务进度记录接口
interface ServiceProgressRecord {
  student_service_id: number;
  milestone: string;      // 进度里程碑，如 "25%"
  progress_date: string;
  description: string;    // 进度描述
  notes?: string;         // 额外备注
  completed_items?: Record<string, unknown>[]; // 已完成项目，JSON 格式
  next_steps?: Record<string, unknown>[];     // 下一步计划，JSON 格式
  attachments?: Record<string, unknown>[];    // 附件，JSON 格式
  recorded_by: number;    // 记录人ID
  employee_ref_id?: number; // 员工引用ID
}

// 服务进度历史记录接口
interface ServiceProjectsQueryRow {
  id: number;
  student_id?: number | null;
  student_ref_id?: number | null;
  service_type_id: number;
  mentor_ref_id?: number | null;
  status: string;
  enrollment_date: string;
  end_date?: string | null;
  progress?: number | null;
  detail_data?: Record<string, unknown> | null;
  mentor_team?: Record<string, unknown>[] | null;
  updated_at: string | null;
  created_at?: string | null;
  service_type?: {
    id: number;
    name: string;
    category?: string | null;
    education_level?: string | null;
  } | null;
  student?: {
    id: number;
    name: string;
    avatar_url?: string | null;
    status?: string | null;
    is_active?: boolean | null;
  } | null;
  mentor?: {
    id: number;
    name?: string | null;
    email?: string | null;
    department?: string | null;
    position?: string | null;
  } | null;
}

type StudentLite = {
  id: number;
  name: string;
  avatar_url?: string | null;
  status?: string | null;
  is_active?: boolean | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const normalizeJsonArray = (value: unknown): Record<string, unknown>[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }
  if (isRecord(value)) {
    return [value];
  }
  return [];
};

const INACTIVE_STATUS_KEYWORDS = ['完成', '结束', '取消', '终止', '归档', '关闭', '暂停', '完成', 'close', 'done'];
const INACTIVE_STATUS_VALUES = new Set(
  [
    'completed',
    'complete',
    'closed',
    'cancelled',
    'canceled',
    'finished',
    'archived',
    'inactive',
    'stopped',
    'terminated',
    'paused',
  ].map((item) => item.toLowerCase()),
);

const isInactiveStatus = (status: unknown): boolean => {
  if (typeof status !== 'string') return false;
  const normalized = status.trim().toLowerCase();
  if (!normalized) return false;
  if (INACTIVE_STATUS_VALUES.has(normalized)) return true;
  return INACTIVE_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const STUDY_APPLICATION_CATEGORY_WHITELIST = new Set(
  ['全包申请', '半DIY申请', '申请服务', '留学申请', '申请项目', '申请服务包', '升学申请', '申请规划'].map((item) =>
    item.toLowerCase(),
  ),
);

const STUDY_APPLICATION_KEYWORDS = ['申请', 'application', '网申', '文书', 'offer', '录取'];

const normalizeString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const includesStudyApplicationKeyword = (value: string): boolean => {
  if (!value) return false;
  const normalizedLower = value.toLowerCase();
  return STUDY_APPLICATION_KEYWORDS.some((keyword) => normalizedLower.includes(keyword.toLowerCase()));
};

const isStudyApplicationCategory = (category?: string | null): boolean => {
  const normalized = normalizeString(category);
  if (!normalized) return false;
  if (STUDY_APPLICATION_CATEGORY_WHITELIST.has(normalized.toLowerCase())) {
    return true;
  }
  return includesStudyApplicationKeyword(normalized);
};

const isStudyApplicationName = (name?: string | null): boolean => {
  const normalized = normalizeString(name);
  if (!normalized) return false;
  return includesStudyApplicationKeyword(normalized);
};

const extractDetailString = (
  detail: Record<string, unknown> | undefined,
  keys: string[],
): string | undefined => {
  if (!detail) return undefined;
  for (const key of keys) {
    const value = detail[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return undefined;
};

const isStudyApplicationServiceRow = (service: ServiceProjectsQueryRow): boolean => {
  const detail = isRecord(service.detail_data) ? service.detail_data : undefined;

  const categoryCandidate =
    service.service_type?.category ??
    extractDetailString(detail, ['service_category', 'category', 'parent_category', 'group', 'primary_category']);

  if (isStudyApplicationCategory(categoryCandidate)) {
    return true;
  }

  const nameCandidate =
    service.service_type?.name ??
    extractDetailString(detail, [
      'service_type_name',
      'service_name',
      'service',
      'name',
      'title',
      'project_name',
      'label',
    ]);

  if (isStudyApplicationName(nameCandidate)) {
    return true;
  }

  return false;
};

const isActiveStudentRecord = (student?: StudentLite | null): boolean => {
  if (!student) {
    return false;
  }
  if (typeof student.is_active === 'boolean') {
    return student.is_active;
  }
  if (typeof student.status === 'string') {
    const statusNormalized = student.status.trim();
    if (!statusNormalized) {
      return false;
    }
    if (statusNormalized === '活跃') {
      return true;
    }
    return statusNormalized.toLowerCase() === 'active';
  }
  return false;
};

interface MentorRolePayload {
  roleKey: string;
  roleName: string;
  responsibilities?: string;
  mentors: Array<{ id: number; name: string; isPrimary?: boolean }>;
}

const peopleService = {
  // 获取所有学生
  async getAllStudents(): Promise<StudentData[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as StudentData[];
    } catch (error) {
      console.error('获取学生列表失败', error);
      throw error;
    }
  },

  // 根据ID获取学生
  async getStudentById(id: number): Promise<StudentData> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as StudentData;
    } catch (error) {
      console.error(`获取学生ID=${id}失败`, error);
      throw error;
    }
  },

  // 创建或更新学生
  async upsertStudent(student: Partial<StudentData>): Promise<StudentData> {
    try {
      console.log('学生数据原始输入:', student);
      
      // 确保status字段的值正确（如果提供）
      if (student.status) {
        // 如果提供了status字段，根据状态值设置is_active
        student.is_active = student.status === '活跃';
      } else if ('is_active' in student) {
        // 如果只提供is_active，需要根据其值设置status
        student.status = student.is_active ? '活跃' : '休学';
      }
      
      // 区分新增和更新操作
      if (student.id) {
        // 更新现有学生
        console.log(`更新学生ID=${student.id}`);
        const { data, error } = await supabase
          .from('students')
          .update(student)
          .eq('id', student.id)
          .select()
          .single();
        
        if (error) {
          console.error('更新学生失败，详细错误:', error);
          throw error;
        }
        return data as StudentData;
      } else {
        // 创建新学生
        console.log('创建新学生');
        
        // 创建一个新对象，确保不包含id属性
        const newStudent = { ...student };
        if ('id' in newStudent) {
          console.log('删除学生数据中的ID字段，让数据库自动生成ID');
          delete newStudent.id; // 明确删除可能存在的id属性，让数据库自动生成
        }
        
        // 检查有没有同名学生
        if (newStudent.name) {
          const { data: existingStudent, error: searchError } = await supabase
            .from('students')
            .select('id, name')
            .eq('name', newStudent.name)
            .maybeSingle();
            
          if (searchError) {
            console.error('检查重名学生时出错:', searchError);
          } else if (existingStudent) {
            console.warn(`发现同名学生: ${existingStudent.name} (ID=${existingStudent.id})`);
            // 这里不抛出错误，而是继续尝试插入，让数据库决定是否允许同名
          }
        }
        
        console.log('即将创建的学生数据:', newStudent);
        
        // 获取当前序列值，用于日志记录检查
        try {
          const { data: seqData, error: seqError } = await supabase
            .rpc('get_next_student_id');
          if (!seqError && seqData) {
            console.log('下一个学生ID将是:', seqData);
          }
        } catch (seqError) {
          console.log('无法获取序列值，继续执行:', seqError);
        }
        
        const { data, error } = await supabase
          .from('students')
          .insert(newStudent)
          .select()
          .single();
        
        if (error) {
          console.error('创建学生失败，详细错误:', error);
          console.error('错误代码:', error.code);
          console.error('错误详情:', error.details);
          console.error('错误消息:', error.message);
          
          // 如果是主键冲突错误，尝试自行生成一个替代ID
          if (error.code === '23505' && error.details?.includes('students_pkey')) {
            console.log('检测到主键冲突，尝试使用自定义ID');
            
            // 获取一个可用的ID
            const { data: maxIdData, error: maxIdError } = await supabase
              .from('students')
              .select('id')
              .order('id', { ascending: false })
              .limit(1)
              .single();
              
            if (maxIdError) {
              console.error('获取最大ID失败:', maxIdError);
              throw error; // 抛出原始错误
            }
            
            const newId = (maxIdData.id || 0) + 1;
            console.log(`尝试使用新ID: ${newId}`);
            
            // 使用新ID重新尝试插入
            const retryStudent = { ...newStudent, id: newId };
            const { data: retryData, error: retryError } = await supabase
              .from('students')
              .insert(retryStudent)
              .select()
              .single();
              
            if (retryError) {
              console.error('使用自定义ID重试失败:', retryError);
              throw error; // 抛出原始错误
            }
            
            console.log('使用自定义ID成功创建学生:', retryData);
            return retryData as StudentData;
          }
          
          throw error;
        }
        
        console.log('成功创建学生:', data);
        return data as StudentData;
      }
    } catch (error: unknown) {
      console.error('保存学生信息失败', error);
      // 打印更多错误信息以便调试
      if (error && typeof error === 'object' && 'code' in error) {
        const dbError = error as { code: string; details?: string; message: string };
        console.error(`错误代码: ${dbError.code}`);
        console.error(`错误详情: ${JSON.stringify(dbError.details || {})}`);
        console.error(`错误消息: ${dbError.message}`);
      }
      throw error;
    }
  },

  // 获取所有导师
  async getAllMentors(): Promise<MentorData[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MentorData[];
    } catch (error) {
      console.error('获取导师列表失败', error);
      throw error;
    }
  },

  // 根据ID获取导师
  async getMentorById(id: number): Promise<MentorData> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as MentorData;
    } catch (error) {
      console.error(`获取导师ID=${id}失败`, error);
      throw error;
    }
  },

  // 获取学生的所有服务
  async getStudentServices(studentId: number): Promise<ServiceData[]> {
    try {
      console.log(`正在获取学生ID=${studentId}的服务`);
      
      const { data, error } = await supabase
        .from('student_services')
        .select(`
          *,
          service_type:service_type_id(id, name, description, is_active, category, education_level, parent_id),
          mentor:mentor_ref_id(*)
        `)
        .eq('student_id', studentId);
      
      if (error) {
        console.error('获取学生服务查询错误:', error);
        throw error;
      }
      
      console.log(`获取到${data.length}项服务数据:`, data);
      
      // detail_data 已弃用 mentor_team 取自新的 json 列
      const servicesWithMentorData = data.map((service) => ({
        ...service,
        mentor_team: Array.isArray(service.mentor_team) ? service.mentor_team : [],
      }));
      
      return servicesWithMentorData as ServiceData[];
    } catch (error) {
      console.error(`获取学生服务失败，studentId=${studentId}`, error);
      throw error;
    }
  },

  // 获取服务项目概览（面向服务进度中心）
  async getServiceProjectsOverview(): Promise<ServiceProjectOverview[]> {
    try {
      console.info('[peopleService] getServiceProjectsOverview 请求发送');
      const { data, error } = await supabase
        .from('student_services')
        .select(`
          id,
          student_id,
          student_ref_id,
          service_type_id,
          mentor_ref_id,
          status,
          enrollment_date,
          end_date,
          progress,
          detail_data,
          mentor_team,
          created_at,
          updated_at,
          service_type:service_type_id (
            id,
            name,
            category,
            education_level
          ),
          student:student_ref_id (
            id,
            name,
            avatar_url,
            status,
            is_active
          ),
          mentor:mentor_ref_id (
            id,
            name,
            location,
            service_scope,
            employee_id
          )
        `)
        .order('updated_at', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false })
        .limit(200)
        .returns<ServiceProjectsQueryRow[]>();

      const servicesRaw = data ?? [];
      const servicesWithTargetCategory = servicesRaw.filter((service) => {
        if (isInactiveStatus(service.status)) {
          return false;
        }
        if (!isStudyApplicationServiceRow(service)) {
          return false;
        }
        return true;
      });

      console.info('[peopleService] getServiceProjectsOverview 响应', {
        error,
        total: servicesRaw.length,
        activeStudyApplication: servicesWithTargetCategory.length,
      });

      if (error) throw error;

      const missingStudentIds = servicesWithTargetCategory
        .filter((service) => !service.student && service.student_id)
        .map((service) => service.student_id as number);

      let fallbackStudents: Record<number, StudentLite> = {};

      if (missingStudentIds.length > 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('students')
          .select('id, name, avatar_url, status, is_active')
          .in('id', missingStudentIds);

        if (fallbackError) {
          console.error('获取学生补充信息失败:', fallbackError);
        } else {
          fallbackStudents = (fallbackData ?? []).reduce<Record<number, StudentLite>>((acc, student) => {
            acc[student.id] = student as StudentLite;
            return acc;
          }, {});
        }
      }

      const visibleServices = servicesWithTargetCategory.filter((service) => {
        const studentInfo =
          service.student ?? (service.student_id ? fallbackStudents[service.student_id] : undefined);
        return isActiveStudentRecord(studentInfo);
      });

      console.info('[peopleService] getServiceProjectsOverview 可见服务', {
        rows: visibleServices.length,
      });

      return visibleServices.map((service) => {
        const studentInfo =
          service.student ??
          (service.student_id ? fallbackStudents[service.student_id] : undefined);

        const mentorTeam = normalizeJsonArray(service.mentor_team);
        const primaryMentorFromTeam = mentorTeam.find((member) => {
          const typed = member as { is_primary?: boolean };
          return typed.is_primary === true;
        }) as { mentor_name?: string; mentor_id?: number } | undefined;

        const detail = isRecord(service.detail_data) ? service.detail_data : undefined;
        const phaseCandidate =
          (detail?.current_phase as string | undefined) ??
          (detail?.phase as string | undefined) ??
          (detail?.stage as string | undefined) ??
          null;

        const progressValue =
          typeof service.progress === 'number'
            ? service.progress
            : typeof service.progress === 'string'
            ? Number.parseInt(service.progress, 10)
            : null;
        const normalizedProgress =
          typeof progressValue === 'number' && Number.isFinite(progressValue) ? progressValue : null;

        return {
          id: service.id,
          student_id: service.student_id ?? null,
          student_ref_id: service.student_ref_id ?? service.student_id ?? null,
          student_name: studentInfo?.name ?? '未命名学生',
          student_avatar: studentInfo?.avatar_url ?? null,
          student_status: studentInfo?.status ?? null,
          student_is_active: isActiveStudentRecord(studentInfo),
          service_type_id: service.service_type?.id ?? service.service_type_id,
          service_type_name: service.service_type?.name ?? '未命名服务',
          service_category: service.service_type?.category ?? null,
          service_education_level: service.service_type?.education_level ?? null,
          status: service.status,
          enrollment_date: service.enrollment_date,
          end_date: service.end_date ?? null,
          progress: normalizedProgress,
          mentor_id:
            service.mentor?.id ??
            (primaryMentorFromTeam?.mentor_id as number | undefined) ??
            null,
          mentor_name:
            service.mentor?.name ??
            (primaryMentorFromTeam?.mentor_name as string | undefined) ??
            null,
          current_phase: typeof phaseCandidate === 'string' ? phaseCandidate : null,
          mentor_team: mentorTeam,
        } as ServiceProjectOverview;
      });
    } catch (error) {
      console.error('获取服务项目概览失败:', error);
      throw error;
    }
  },

  // 保存学生服务
  async upsertStudentService(service: Partial<StudentService>): Promise<StudentService> {
    try {
      console.log('原始服务数据:', JSON.stringify(service, null, 2));
      
      // 调整字段 - 处理student_id和mentor_id
      const updatedService: Record<string, unknown> = { ...service };
      
      // 确保student_ref_id字段被设置
      if ('student_id' in updatedService && !updatedService.student_ref_id) {
        updatedService.student_ref_id = updatedService.student_id;
        console.log(`设置student_ref_id=${updatedService.student_ref_id}`);
      }
      
      // 处理mentor_id
      if ('mentor_id' in updatedService) {
        updatedService.mentor_ref_id = updatedService.mentor_id;
        delete updatedService.mentor_id;
      }
      
      console.log('处理后的服务数据:', JSON.stringify(updatedService, null, 2));
      
      // 尝试插入服务前，先检查是否已存在相同的服务记录
      if (!updatedService.id && updatedService.student_id && updatedService.service_type_id) {
        const { data: existingServices, error: checkError } = await supabase
          .from('student_services')
          .select('id')
          .eq('student_id', updatedService.student_id)
          .eq('service_type_id', updatedService.service_type_id);
          
        if (checkError) {
          console.error('检查已存在服务时出错:', checkError);
        } else if (existingServices && existingServices.length > 0) {
          console.warn(`发现已存在的相同服务: 学生ID=${updatedService.student_id}, 服务类型ID=${updatedService.service_type_id}`);
          // 如果已存在，将其设为更新模式
          updatedService.id = existingServices[0].id;
          console.log(`改为更新已存在的服务ID=${updatedService.id}`);
        }
      }
      
      const { data, error } = await supabase
        .from('student_services')
        .upsert(updatedService)
        .select(`
          *,
          service_type:service_type_id(*),
          mentor:mentor_ref_id(*)
        `)
        .single();
      
      if (error) {
        console.error('保存服务失败，详细错误:', error);
        console.error('错误代码:', error.code);
        console.error('错误详情:', error.details);
        console.error('错误消息:', error.message);
        throw error;
      }
      
      console.log('服务成功保存，返回数据:', data);
      
      // 转换回旧格式以保持接口兼容性
      const result = {
        ...data,
        mentor_id: data.mentor_ref_id
      };
      
      return result as StudentService;
    } catch (error: unknown) {
      console.error('保存学生服务失败', error);
      // 打印更多错误信息以便调试
      if (error && typeof error === 'object' && 'code' in error) {
        const dbError = error as { code?: string; details?: unknown; message?: string };
        console.error(`错误代码: ${dbError.code}`);
        console.error(`错误详情: ${JSON.stringify(dbError.details || {})}`);
        console.error(`错误消息: ${dbError.message}`);
      }
      throw error;
    }
  },

  async updateStudentServiceMentors(
    serviceId: number,
    mentorRoles: MentorRolePayload[],
  ): Promise<StudentService> {
    try {
      const flatMentors: MentorTeamRow[] = [];
      mentorRoles.forEach((role) => {
        role.mentors.forEach((mentor) => {
          flatMentors.push({
            mentor_id: mentor.id,
            mentor_name: mentor.name,
            role_key: role.roleKey,
            role_name: role.roleName,
            responsibilities: role.responsibilities,
            is_primary: Boolean(mentor.isPrimary),
          });
        });
      });

      const uniqueMentorIds = Array.from(new Set(flatMentors.map((item) => item.mentor_id)));

      let primaryMentorId: number | null = null;
      const primaryCandidate = flatMentors.find((item) => item.is_primary);
      if (primaryCandidate) {
        primaryMentorId = primaryCandidate.mentor_id;
      } else if (uniqueMentorIds.length > 0) {
        primaryMentorId = uniqueMentorIds[0];
      }

      const { data, error } = await supabase
        .from('student_services')
        .update({
          mentor_ref_id: primaryMentorId,
          mentor_team: flatMentors,
        })
        .eq('id', serviceId)
        .select(
          `
            *,
            service_type:service_type_id(*),
            mentor:mentor_ref_id(*)
          `,
        )
        .single();

      if (error) {
        console.error('更新学生服务顾问团队失败:', error);
        throw error;
      }

      return {
        ...data,
        mentor_id: data.mentor_ref_id,
      } as StudentService;
    } catch (error) {
      console.error('更新学生服务顾问团队失败', error);
      throw error;
    }
  },

  async updateStudentServiceMentor(
    serviceId: number,
    mentorId: number | null,
  ): Promise<StudentService> {
    if (mentorId === null) {
      return this.updateStudentServiceMentors(serviceId, []);
    }

    const { data, error } = await supabase
      .from('mentors')
      .select('id, name')
      .eq('id', mentorId)
      .single();

    if (error) {
      throw error;
    }

    return this.updateStudentServiceMentors(serviceId, [
      {
        roleKey: 'primary',
        roleName: '主导师',
        mentors: [{ id: mentorId, name: data?.name ?? '', isPrimary: true }],
      },
    ]);
  },

  // 获取所有学生（从student_view）
  async getAllStudentsFromView(): Promise<StudentData[]> {
    try {
      // 不再使用视图，直接从students表获取数据
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StudentData[];
    } catch (error) {
      console.error('获取学生数据失败', error);
      throw error;
    }
  },

  // 删除学生
  async deleteStudent(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`删除学生失败，id=${id}`, error);
      throw error;
    }
  },

  // 删除学生服务
  async deleteStudentService(id: number): Promise<void> {
    try {
      // 首先检查并删除student_service_relations表中的引用记录
      const { error: relationsError } = await supabase
        .from('student_service_relations')
        .delete()
        .eq('service_id', id);
      
      if (relationsError) {
        console.error(`删除服务关系记录失败，service_id=${id}`, relationsError);
        throw relationsError;
      }
      
      // 然后检查是否有服务进度记录，如果有则一并删除
      const { data: progressData } = await supabase
        .from('service_progress')
        .select('id')
        .eq('student_service_id', id);
      
      if (progressData && progressData.length > 0) {
        const progressIds = progressData.map(p => p.id);
        await supabase
          .from('service_progress')
          .delete()
          .in('id', progressIds);
      }
      
      // 最后删除服务本身
      const { error } = await supabase
        .from('student_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`删除学生服务失败，id=${id}`, error);
      throw error;
    }
  },

  // 获取服务进度（包含员工信息）
  async getServiceProgress(serviceId: number): Promise<ServiceProgressLog[]> {
    try {
      const { data, error } = await supabase
        .from('service_progress')
        .select(`
          *,
          employee:employee_ref_id (
            id,
            name,
            email,
            department,
            position
          )
        `)
        .eq('student_service_id', serviceId)
        .order('progress_date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      return (data ?? []).map((record) => ({
        ...record,
        completed_items: normalizeJsonArray(record.completed_items),
        next_steps: normalizeJsonArray(record.next_steps),
        attachments: normalizeJsonArray(record.attachments),
      })) as ServiceProgressLog[];
    } catch (error) {
      console.error(`获取服务进度失败，serviceId=${serviceId}`, error);
      throw error;
    }
  },

  // 添加服务进度记录
  async addServiceProgress(progress: ServiceProgressRecord): Promise<void> {
    try {
      const { error } = await supabase
        .from('service_progress')
        .insert([progress]);

      if (error) throw error;

      // 从milestone字段提取数字部分以更新学生服务的进度
      const progressValue = parseInt(progress.milestone);
      if (!isNaN(progressValue)) {
        const { error: updateError } = await supabase
          .from('student_services')
          .update({ 
            progress: progressValue
          })
          .eq('id', progress.student_service_id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('添加服务进度失败:', error);
      throw error;
    }
  },

  // 获取服务进度历史记录
  async getServiceProgressHistory(studentServiceId: number): Promise<ServiceProgressLog[]> {
    try {
      const { data, error } = await supabase
        .from('service_progress')
        .select(`
          *,
          employee:employee_ref_id (
            id,
            name,
            email,
            department,
            position
          )
        `)
        .eq('student_service_id', studentServiceId)
        .order('progress_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map((record) => ({
        ...record,
        completed_items: normalizeJsonArray(record.completed_items),
        next_steps: normalizeJsonArray(record.next_steps),
        attachments: normalizeJsonArray(record.attachments),
      })) as ServiceProgressLog[];
    } catch (error) {
      console.error('获取服务进度历史记录失败:', error);
      throw error;
    }
  },

  // 检查学生服务表结构
  async checkStudentServicesTable(): Promise<{message: string, records: unknown[]}> {
    try {
      // 获取学生服务表前5条记录，用于检查表结构
      const { data, error } = await supabase
        .from('student_services')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('检查student_services表结构失败:', error);
        throw error;
      }
      
      return {
        message: '成功获取student_services表结构',
        records: data
      };
    } catch (error) {
      console.error('检查表结构发生错误:', error);
      throw error;
    }
  },

  // 获取所有服务类型
  async getAllServiceTypes(): Promise<{id: number, name: string, description?: string, is_active: boolean, category: string, education_level?: string | null, parent_id?: number | null}[]> {
    try {
      console.log('开始获取所有服务类型');
      const { data, error } = await supabase
        .from('service_types')  // 使用新的表名
        .select('*')
        .order('id');
      
      if (error) {
        console.error('获取服务类型失败:', error);
        throw error;
      }
      
      console.log(`获取到${data.length}个服务类型:`, data);
      return data;
    } catch (error) {
      console.error('获取服务类型时发生错误:', error);
      throw error;
    }
  },

  // 根据ID获取人员
  async getPersonById(id: number): Promise<Person> {
    try {
      console.log(`正在获取人员ID=${id}的信息`);
      const { data, error } = await supabase
        .from('students') // 直接从students表获取，因为我们已经移除了people表
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as unknown as Person;
    } catch (error) {
      console.error(`获取人员ID=${id}失败`, error);
      throw error;
    }
  },

  // 创建或更新人员
  async upsertPerson(person: Partial<Person>): Promise<Person> {
    try {
      console.log('正在保存人员信息:', person);
      // 因为表结构已更改，直接将人员数据写入students表
      
      // 准备基本数据
      const studentData = {
        name: person.name,
        email: person.email,
        phone: person.phone,
        gender: person.gender,
        birth_date: person.birth_date,
        is_active: person.is_active || true
      };
      
      let data;
      
      // 区分新增和更新操作
      if (person.id) {
        // 更新现有记录
        console.log(`更新人员ID=${person.id}`);
        const { data: updateData, error: updateError } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', person.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // 创建新记录
        console.log('创建新人员');
        const { data: insertData, error: insertError } = await supabase
          .from('students')
          .insert(studentData)
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertData;
      }
      
      // 转换为Person类型
      const resultPerson: Person = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        is_active: data.is_active || true,
        created_at: data.created_at || getCurrentLocalISOString()
      };
      
      return resultPerson;
    } catch (error) {
      console.error('保存人员信息失败', error);
      throw error;
    }
  },

  // 获取学生档案
  async getStudentProfile(personId: number): Promise<StudentProfile> {
    try {
      console.log(`正在获取学生档案，personId=${personId}`);
      // 在新结构中，student表已经包含了学生档案信息
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', personId)
        .single();
      
      if (error) throw error;
      
      // 转换为旧的StudentProfile格式
      const studentProfile: StudentProfile = {
        id: data.id,
        person_id: data.id, // 在新结构中，person_id 和 id 相同
        education_level: data.education_level,
        school: data.school,
        major: data.major,
        graduation_year: data.graduation_year,
        created_at: data.created_at || getCurrentLocalISOString(),
        updated_at: data.updated_at || getCurrentLocalISOString()
      };
      
      return studentProfile;
    } catch (error) {
      console.error(`获取学生档案失败，personId=${personId}`, error);
      throw error;
    }
  },

  // 更新线索状态
  async updateLeadStatus(leadId: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'): Promise<void> {
    try {
      console.log(`更新线索状态，leadId=${leadId}, status=${status}`);
      
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);
      
      if (error) throw error;
      
      console.log(`成功更新线索状态，leadId=${leadId}, status=${status}`);
    } catch (error) {
      console.error(`更新线索状态失败，leadId=${leadId}`, error);
      throw error;
    }
  },

  // 保存学生档案
  async upsertStudentProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      console.log('正在保存学生档案:', profile);
      
      // 准备基本数据
      const profileData = {
        education_level: profile.education_level,
        school: profile.school,
        major: profile.major,
        graduation_year: profile.graduation_year
      };
      
      // 我们需要确保该学生记录存在
      const studentId = profile.person_id;
      if (!studentId) {
        throw new Error('保存学生档案失败: 缺少person_id');
      }
      
      // 查询学生记录是否存在
      const { data: existingStudent, error: queryError } = await supabase
        .from('students')
        .select('id')
        .eq('id', studentId)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') { // PGRST116: 记录未找到
        throw queryError;
      }
      
      let data;
      
      if (existingStudent) {
        // 更新现有学生档案
        console.log(`更新学生档案ID=${studentId}`);
        const { data: updateData, error: updateError } = await supabase
          .from('students')
          .update(profileData)
          .eq('id', studentId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // 创建新学生档案 (实际上这部分逻辑可能不会被执行，因为我们已经确保学生记录存在)
        console.log(`学生ID=${studentId}不存在，创建新记录`);
        const newStudent = {
          id: studentId,
          ...profileData,
          name: '新学生',  // 必须提供名字字段
          is_active: true
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('students')
          .insert(newStudent)
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertData;
      }
      
      // 转换为StudentProfile格式
      const studentProfile: StudentProfile = {
        id: data.id,
        person_id: data.id,
        education_level: data.education_level,
        school: data.school,
        major: data.major,
        graduation_year: data.graduation_year,
        created_at: data.created_at || getCurrentLocalISOString(),
        updated_at: data.updated_at || getCurrentLocalISOString()
      };
      
      return studentProfile;
    } catch (error) {
      console.error('保存学生档案失败', error);
      throw error;
    }
  },
};

export { peopleService }; 