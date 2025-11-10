import type {
  WorkflowDefinition,
  WorkflowInsight,
  WorkflowTimelineItem,
} from '../types';

export const WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: 'wf-essay-review',
    name: '文书初稿审阅',
    scope: '文书团队',
    version: 'v3.2',
    status: '启用',
    avgCompletionHours: 36,
    completionRate: 0.92,
    bottleneckNode: '顾问复核',
  },
  {
    id: 'wf-offer-follow',
    name: 'Offer 跟进回访',
    scope: '顾问团队',
    version: 'v1.7',
    status: '灰度中',
    avgCompletionHours: 48,
    completionRate: 0.86,
  },
  {
    id: 'wf-classroom',
    name: '课堂质检巡检',
    scope: '教务中心',
    version: 'v2.5',
    status: '启用',
    avgCompletionHours: 12,
    completionRate: 0.95,
    bottleneckNode: '质检录入',
  },
  {
    id: 'wf-refund',
    name: '退费审批',
    scope: '财务与合规',
    version: 'v2.0',
    status: '草稿',
    avgCompletionHours: 60,
    completionRate: 0.0,
  },
];

export const WORKFLOW_INSIGHTS: WorkflowInsight[] = [
  {
    id: 'insight-01',
    title: '文书初稿平均耗时下降 18%',
    description: '通过引入 AI 辅助修改建议，减少顾问返工次数，平均耗时从 44h 降至 36h。',
    improvement: '继续扩展 AI 模板库，并对顾问进行高频共创培训。',
    owner: '流程负责人 许颖',
    updatedAt: '2025-11-04',
  },
  {
    id: 'insight-02',
    title: 'Offer 回访流失率仍偏高',
    description: '灰度版本的新增节点完成率仅 68%，顾问反馈提醒过多、资料整理重复。',
    improvement: '合并提醒节点，增加 CRM 自动整理材料功能。',
    owner: '顾问运营 李航',
    updatedAt: '2025-11-07',
  },
  {
    id: 'insight-03',
    title: '退费审批流程待上线',
    description: '草稿流程缺少财务复核节点，需补充相关材料清单模板。',
    improvement: '与财务确认模板内容，预计 11/12 完成并上线。',
    owner: '财务合规团队',
    updatedAt: '2025-11-08',
  },
];

export const WORKFLOW_TIMELINE: WorkflowTimelineItem[] = [
  {
    id: 'tl-01',
    entity: '学生 王芷若 · 文书初稿',
    state: '顾问复核完成',
    handler: '李航',
    completedAt: '2025-11-08 17:23',
    duration: '32h',
    status: '正常',
  },
  {
    id: 'tl-02',
    entity: '项目 G5-2025-Q1 · Offer 回访',
    state: '家长确认延迟',
    handler: '张婷',
    completedAt: '2025-11-08 14:12',
    duration: '56h',
    status: '延迟',
  },
  {
    id: 'tl-03',
    entity: '课堂巡检 · 雅思冲刺班',
    state: '质检记录缺失',
    handler: '系统机器人',
    completedAt: '2025-11-08 12:05',
    duration: '8h',
    status: '阻塞',
  },
];

