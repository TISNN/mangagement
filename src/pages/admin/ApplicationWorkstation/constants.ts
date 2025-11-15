import { ApplicationStage } from '../ApplicationProgress/types';

export const STAGE_ORDER: ApplicationStage[] = [
  'evaluation',
  'schoolSelection',
  'preparation',
  'submission',
  'interview',
  'decision',
  'visa'
];

export const STAGE_META: Record<ApplicationStage, { label: string; description: string; accent: string }> = {
  evaluation: {
    label: '背景评估',
    description: '采集学生背景、考试与兴趣，给出可行性研判',
    accent: 'from-slate-500/10 via-slate-500/5 to-transparent'
  },
  schoolSelection: {
    label: '选校规划',
    description: '制定院校项目清单、等级划分与排期',
    accent: 'from-blue-500/10 via-blue-500/5 to-transparent'
  },
  preparation: {
    label: '材料准备',
    description: '材料/文书制作、版本管理与质检',
    accent: 'from-amber-500/10 via-amber-500/5 to-transparent'
  },
  submission: {
    label: '网申提交',
    description: '网申门户填写、附件上传与提交校验',
    accent: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
  },
  interview: {
    label: '面试阶段',
    description: '面试准备、模拟、总结与反馈',
    accent: 'from-purple-500/10 via-purple-500/5 to-transparent'
  },
  decision: {
    label: '录取决定',
    description: '录取/拒信跟进、奖学金与offer管理',
    accent: 'from-pink-500/10 via-pink-500/5 to-transparent'
  },
  visa: {
    label: '签证与行前',
    description: '签证材料、体检、住宿与行前准备',
    accent: 'from-cyan-500/10 via-cyan-500/5 to-transparent'
  }
};

export const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
  in_progress: 'bg-blue-500/10 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200',
  blocked: 'bg-rose-500/10 text-rose-600 dark:bg-rose-900/40 dark:text-rose-200',
  completed: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200',
  paused: 'bg-amber-500/10 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200'
};

export const INDICATOR_TONE_CLASS: Record<'info' | 'warning' | 'success' | 'danger', string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-100'
};

