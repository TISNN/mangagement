/**
 * 申请阶段相关工具函数
 */

import { 
  ClipboardList, 
  Map, 
  FileText, 
  CheckCircle, 
  User, 
  School, 
  Briefcase 
} from 'lucide-react';
import { StageInfo } from '../types/stage';

export const applicationStages: StageInfo[] = [
  { id: 'evaluation', name: '背景评估', icon: ClipboardList },
  { id: 'schoolSelection', name: '选校规划', icon: Map },
  { id: 'preparation', name: '材料准备', icon: FileText },
  { id: 'submission', name: '提交申请', icon: CheckCircle },
  { id: 'interview', name: '面试阶段', icon: User },
  { id: 'decision', name: '录取决定', icon: School },
  { id: 'visa', name: '签证办理', icon: Briefcase }
];

/**
 * 根据进度百分比获取当前阶段索引
 */
export const getStageFromProgress = (progress: number): number => {
  if (progress < 15) return 0; // 背景评估
  if (progress < 30) return 1; // 选校规划
  if (progress < 45) return 2; // 材料准备
  if (progress < 60) return 3; // 提交申请
  if (progress < 75) return 4; // 面试阶段
  if (progress < 90) return 5; // 录取决定
  return 6; // 签证办理
};

