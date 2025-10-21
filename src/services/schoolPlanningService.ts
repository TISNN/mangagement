import { supabase } from '../utils/supabaseClient';

// 数据类型定义
export interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  description: string;
  requirements: string;
  employment: string;
  category?: string;
  subCategory?: string;
}

export interface School {
  id: string;
  name: string;
  location: string;
  country?: string;
  region?: string;
  programs: Program[];
  acceptance: string;
  ranking: string;
  tuition: string;
  description: string;
  logoUrl?: string;
}

export interface SchoolWithNote extends School {
  note?: string;
  interestedPrograms?: string[];
}

export interface SchoolSelection {
  id: string;
  timestamp: string;
  schools: SchoolWithNote[];
  name: string;
  studentId?: number;
}

// 申请规划记录的数据结构
export interface SchoolPlanningRecord {
  id: number;
  title: string;
  date: string;
  version: string;
  planner: string;
  description: string;
  schools: SchoolPlan[];
}

export interface SchoolPlan {
  school: string;
  program: string;
  type: string;
  status: 'current' | 'pending' | 'completed';
  requirements: {
    gpa: string;
    ielts: string;
    deadline: string;
    preferences: string[];
  };
  notes?: string;
}

/**
 * 保存选校方案到本地存储
 */
export const saveSelectionToLocalStorage = (selection: SchoolSelection): void => {
  try {
    // 获取现有的选校记录
    const existingSelectionsStr = localStorage.getItem('schoolSelections');
    const existingSelections: SchoolSelection[] = existingSelectionsStr 
      ? JSON.parse(existingSelectionsStr) 
      : [];
    
    // 添加新记录
    const updatedSelections = [...existingSelections, selection];
    
    // 保存回本地存储
    localStorage.setItem('schoolSelections', JSON.stringify(updatedSelections));
  } catch (error) {
    console.error('保存选校方案到本地存储失败:', error);
  }
};

/**
 * 从本地存储获取所有选校方案
 */
export const getSelectionsFromLocalStorage = (): SchoolSelection[] => {
  try {
    const selectionsStr = localStorage.getItem('schoolSelections');
    return selectionsStr ? JSON.parse(selectionsStr) : [];
  } catch (error) {
    console.error('从本地存储获取选校方案失败:', error);
    return [];
  }
};

/**
 * 保存选校方案到学生记录
 */
export const saveSelectionToStudent = async (
  studentId: number, 
  selection: SchoolSelection
): Promise<boolean> => {
  try {
    // 实际使用Supabase保存数据
    const { error } = await supabase
      .from('student_school_selections')
      .insert([
        {
          student_id: studentId,
          name: selection.name,
          timestamp: selection.timestamp,
          data: selection.schools
        }
      ]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('保存选校方案到学生记录失败:', error);
    return false;
  }
};

/**
 * 获取学生的所有选校方案
 */
export const getStudentSelections = async (studentId: number): Promise<SchoolSelection[]> => {
  try {
    const { data, error } = await supabase
      .from('student_school_selections')
      .select('*')
      .eq('student_id', studentId);
    
    if (error) throw error;
    
    // 将数据库记录转换为应用程序使用的格式
    return data.map((record: any) => ({
      id: record.id.toString(),
      timestamp: record.timestamp,
      schools: record.data,
      name: record.name,
      studentId: record.student_id
    }));
  } catch (error) {
    console.error('获取学生选校方案失败:', error);
    return [];
  }
};

/**
 * 同步选校方案到申请记录
 */
export const syncToApplicationRecord = async (
  studentId: number,
  selection: SchoolSelection
): Promise<boolean> => {
  try {
    // 获取最新版本号
    const { data: plannings, error: fetchError } = await supabase
      .from('application_school_plannings')
      .select('version')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (fetchError) throw fetchError;
    
    // 计算新版本号
    let newVersion = 'V1.0';
    if (plannings && plannings.length > 0) {
      const latestVersion = plannings[0].version;
      const versionNumber = parseInt(latestVersion.substring(1, latestVersion.indexOf('.'))) || 0;
      newVersion = `V${versionNumber + 1}.0`;
    }
    
    // 获取当前用户信息
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    
    // 插入新的规划记录
    const { error } = await supabase
      .from('application_school_plannings')
      .insert([
        {
          student_id: studentId,
          title: selection.name,
          date: new Date().toISOString().split('T')[0],
          version: newVersion,
          planner_id: userId,
          description: `${selection.name} - 通过选校助手创建`,
          schools: selection.schools.map(school => ({
            school: school.name,
            program: school.interestedPrograms && school.interestedPrograms.length > 0
              ? school.programs.find(p => p.id === school.interestedPrograms![0])?.name || '未指定专业'
              : '未指定专业',
            type: determineSchoolType(school),
            status: 'pending',
            requirements: {
              gpa: '待定',
              ielts: '待定',
              deadline: '待定',
              preferences: ['待补充详细要求']
            },
            notes: school.note || ''
          }))
        }
      ]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('同步选校方案到申请记录失败:', error);
    return false;
  }
};

/**
 * 根据学校信息确定学校类型（冲刺/目标/保底）
 */
const determineSchoolType = (school: SchoolWithNote): string => {
  // 从排名或录取率判断学校类型
  const rankingStr = school.ranking.replace(/\D/g, '');
  const rankingNum = parseInt(rankingStr);
  
  if (!isNaN(rankingNum)) {
    if (rankingNum <= 10) return '冲刺院校';
    if (rankingNum <= 50) return '目标院校';
    return '保底院校';
  }
  
  // 如果没有排名，尝试通过录取率判断
  const acceptanceStr = school.acceptance.replace(/[^0-9.]/g, '');
  const acceptanceNum = parseFloat(acceptanceStr);
  
  if (!isNaN(acceptanceNum)) {
    if (acceptanceNum < 10) return '冲刺院校';
    if (acceptanceNum < 30) return '目标院校';
    return '保底院校';
  }
  
  // 默认为目标院校
  return '目标院校';
}; 