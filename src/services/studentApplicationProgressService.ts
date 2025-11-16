/**
 * 学生端申请进度服务
 * 提供申请进度中心所需的所有数据查询功能（只读）
 */

import { supabase } from '../lib/supabase';
import {
  StudentProfile,
  FinalUniversityChoice,
  ApplicationStage,
  StandardizedTest
} from '../pages/admin/ApplicationProgress/types';

/**
 * 获取学生ID（从localStorage）
 */
function getStudentId(): number | null {
  try {
    const stored = localStorage.getItem('currentStudent');
    if (stored) {
      const student = JSON.parse(stored);
      return student?.id || null;
    }
  } catch (error) {
    console.error('[StudentApplicationProgressService] 解析学生ID失败:', error);
  }
  return null;
}

/**
 * 申请进度数据接口
 */
export interface ApplicationProgressData {
  // 阶段进度
  stageProgress: {
    currentStage: ApplicationStage;
    currentStageIndex: number;
    totalStages: number;
    progressPercentage: number;
    stages: Array<{
      id: ApplicationStage;
      name: string;
      status: 'not_started' | 'in_progress' | 'completed';
      blockingReasons?: string[];
    }>;
  };
  
  // 申请档案
  profile: StudentProfile | null;
  
  // 申请统计
  statistics: {
    totalApplications: number;
    byStatus: {
      notSubmitted: number;      // 未投递
      submitted: number;           // 已投递
      underReview: number;         // 审核中
      accepted: number;            // 已录取
      rejected: number;            // 已拒绝
      waitlist: number;            // Waitlist
    };
    acceptanceRate: number;        // 录取率（已录取 / 已出结果）
    byType: {
      reach: number;              // 冲刺
      target: number;             // 目标
      safety: number;             // 保底
    };
  };
  
  // 选校列表
  schoolChoices: FinalUniversityChoice[];
}

/**
 * 申请阶段定义
 */
const APPLICATION_STAGES: Array<{ id: ApplicationStage; name: string }> = [
  { id: 'evaluation', name: '背景评估' },
  { id: 'schoolSelection', name: '选校规划' },
  { id: 'preparation', name: '材料准备' },
  { id: 'submission', name: '提交申请' },
  { id: 'interview', name: '面试阶段' },
  { id: 'decision', name: '录取决定' },
  { id: 'visa', name: '签证办理' }
];

/**
 * 推断当前申请阶段
 */
function inferCurrentStage(
  profile: StudentProfile | null,
  choices: FinalUniversityChoice[],
  documents: any[]
): { stage: ApplicationStage; index: number; blockingReasons: string[] } {
  const blockingReasons: string[] = [];
  
  // 阶段1: 背景评估 - 需要学生档案
  if (!profile || !profile.full_name) {
    return { stage: 'evaluation', index: 0, blockingReasons: ['学生档案未完成'] };
  }
  
  // 阶段2: 选校规划 - 需要至少一个选校
  if (choices.length === 0) {
    return { stage: 'schoolSelection', index: 1, blockingReasons: ['尚未确定选校方案'] };
  }
  
  // 阶段3: 材料准备 - 需要材料清单
  const hasMaterials = documents && documents.length > 0;
  if (!hasMaterials) {
    return { stage: 'preparation', index: 2, blockingReasons: ['材料清单未创建'] };
  }
  
  // 检查材料完成度
  const completedMaterials = documents.filter((d: any) => 
    d.status === '已完成' || d.status === '已提交'
  ).length;
  const materialProgress = documents.length > 0 ? (completedMaterials / documents.length) * 100 : 0;
  
  if (materialProgress < 80) {
    return { 
      stage: 'preparation', 
      index: 2, 
      blockingReasons: [`材料完成度不足（${Math.round(materialProgress)}%）`] 
    };
  }
  
  // 阶段4: 提交申请 - 需要至少一个已投递
  const submittedCount = choices.filter(c => 
    c.submission_status === '已投递' || c.submission_status === '审核中'
  ).length;
  
  if (submittedCount === 0) {
    return { stage: 'submission', index: 3, blockingReasons: ['尚未提交任何申请'] };
  }
  
  // 阶段5: 面试阶段 - 需要面试邀请
  const hasInterview = choices.some(c => 
    c.submission_status === '审核中' && c.decision_result?.includes('面试')
  );
  
  if (submittedCount > 0 && !hasInterview) {
    // 可能还在等待面试邀请，或者已经进入下一阶段
    const hasDecision = choices.some(c => 
      c.decision_result === '已录取' || c.decision_result === '已拒绝'
    );
    if (!hasDecision) {
      return { stage: 'interview', index: 4, blockingReasons: [] };
    }
  }
  
  // 阶段6: 录取决定 - 需要至少一个录取结果
  const acceptedCount = choices.filter(c => c.decision_result === '已录取').length;
  const rejectedCount = choices.filter(c => c.decision_result === '已拒绝').length;
  
  if (acceptedCount === 0 && rejectedCount === 0) {
    return { stage: 'decision', index: 5, blockingReasons: ['等待录取结果'] };
  }
  
  if (acceptedCount > 0) {
    // 阶段7: 签证办理
    return { stage: 'visa', index: 6, blockingReasons: [] };
  }
  
  // 默认返回当前最高阶段
  return { stage: 'decision', index: 5, blockingReasons: [] };
}

/**
 * 获取申请进度数据
 */
export async function getApplicationProgressData(): Promise<ApplicationProgressData | null> {
  try {
    const studentId = getStudentId();
    if (!studentId) {
      console.error('[StudentApplicationProgressService] 无法获取学生ID');
      return null;
    }
    
    // 并行获取所有数据
    const [
      profileResult,
      choicesResult,
      documentsResult
    ] = await Promise.all([
      // 获取学生档案
      supabase
        .from('student_profile')
        .select('*')
        .eq('student_id', studentId)
        .single(),
      
      // 获取选校列表
      supabase
        .from('final_university_choices')
        .select('*')
        .eq('student_id', studentId)
        .order('priority_rank', { ascending: true }),
      
      // 获取材料清单
      supabase
        .from('application_documents_checklist')
        .select('*')
        .eq('student_id', studentId)
    ]);
    
    if (profileResult.error && profileResult.error.code !== 'PGRST116') {
      // PGRST116 表示未找到记录，这是允许的
      console.error('[StudentApplicationProgressService] 获取学生档案失败:', profileResult.error);
    }
    
    if (choicesResult.error) {
      console.error('[StudentApplicationProgressService] 获取选校列表失败:', choicesResult.error);
    }
    
    if (documentsResult.error) {
      console.error('[StudentApplicationProgressService] 获取材料清单失败:', documentsResult.error);
    }
    
    const profile = profileResult.data || null;
    const choices = choicesResult.data || [];
    const documents = documentsResult.data || [];
    
    // 推断当前阶段
    const { stage, index, blockingReasons } = inferCurrentStage(profile, choices, documents);
    
    // 计算阶段进度
    const progressPercentage = Math.round(((index + 1) / APPLICATION_STAGES.length) * 100);
    
    // 构建阶段列表
    const stages = APPLICATION_STAGES.map((s, i) => {
      let status: 'not_started' | 'in_progress' | 'completed';
      if (i < index) {
        status = 'completed';
      } else if (i === index) {
        status = 'in_progress';
      } else {
        status = 'not_started';
      }
      
      return {
        id: s.id,
        name: s.name,
        status,
        blockingReasons: i === index ? blockingReasons : undefined
      };
    });
    
    // 计算申请统计
    const totalApplications = choices.length;
    const byStatus = {
      notSubmitted: choices.filter(c => !c.submission_status || c.submission_status === '未投递').length,
      submitted: choices.filter(c => c.submission_status === '已投递').length,
      underReview: choices.filter(c => c.submission_status === '审核中').length,
      accepted: choices.filter(c => c.decision_result === '已录取').length,
      rejected: choices.filter(c => c.decision_result === '已拒绝').length,
      waitlist: choices.filter(c => c.decision_result === 'Waitlist' || c.decision_result === '等待名单').length
    };
    
    // 计算录取率（已出结果的申请中，已录取的比例）
    const decidedCount = byStatus.accepted + byStatus.rejected + byStatus.waitlist;
    const acceptanceRate = decidedCount > 0 
      ? Math.round((byStatus.accepted / decidedCount) * 100) 
      : 0;
    
    // 按类型统计
    const byType = {
      reach: choices.filter(c => c.application_type === '冲刺院校' || c.application_type === '冲刺').length,
      target: choices.filter(c => c.application_type === '目标院校' || c.application_type === '目标').length,
      safety: choices.filter(c => c.application_type === '保底院校' || c.application_type === '保底').length
    };
    
    return {
      stageProgress: {
        currentStage: stage,
        currentStageIndex: index,
        totalStages: APPLICATION_STAGES.length,
        progressPercentage,
        stages
      },
      profile,
      statistics: {
        totalApplications,
        byStatus,
        acceptanceRate,
        byType
      },
      schoolChoices: choices
    };
  } catch (error) {
    console.error('[StudentApplicationProgressService] 获取申请进度数据失败:', error);
    return null;
  }
}

