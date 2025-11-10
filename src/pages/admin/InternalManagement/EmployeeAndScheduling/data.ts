import type {
  AttendanceSummary,
  ShiftConflict,
  StaffProfile,
} from '../types';

export const STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-01',
    name: '刘畅',
    role: '资深导师',
    team: '英本递交组',
    workload: 82,
    skills: ['面试辅导', 'G5 项目', '家长沟通'],
    avatarUrl: 'https://api.dicebear.com/6.x/big-smile/svg',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '北京 · 总部 5F',
    education: {
      degree: '教育学硕士',
      school: '伦敦大学学院 UCL',
      year: '2018',
    },
    availability: [
      { day: '周一', start: '09:00', end: '18:00', location: '总部 5F' },
      { day: '周三', start: '10:00', end: '18:00', location: '总部 5F' },
      { day: '周五', start: '13:00', end: '21:00', location: '线上' },
    ],
    status: '在岗',
  },
  {
    id: 'staff-02',
    name: '王若',
    role: '留学顾问',
    team: '北美规划组',
    workload: 68,
    skills: ['选校规划', '材料校审', 'CRM 建档'],
    avatarUrl: 'https://api.dicebear.com/6.x/big-smile/svg',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '上海 · 北美规划组',
    education: {
      degree: '国际商务学士',
      school: '纽约大学 Stern',
      year: '2017',
    },
    availability: [
      { day: '周二', start: '09:00', end: '18:00', location: '总部 4F' },
      { day: '周四', start: '09:00', end: '18:00', location: '总部 4F' },
      { day: '周六', start: '10:00', end: '16:00', location: '线上' },
    ],
    status: '在岗',
  },
  {
    id: 'staff-03',
    name: '陈悦',
    role: '文书老师',
    team: '综合项目组',
    workload: 54,
    skills: ['文书打磨', 'Essay Review', '语言润色'],
    avatarUrl: 'https://api.dicebear.com/6.x/big-smile/svg',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '深圳 · 远程',
    education: {
      degree: '应用语言学硕士',
      school: '悉尼大学',
      year: '2019',
    },
    availability: [
      { day: '周三', start: '13:00', end: '21:00', location: '线上' },
      { day: '周四', start: '14:00', end: '21:00', location: '线上' },
      { day: '周日', start: '09:00', end: '12:00', location: '线上' },
    ],
    status: '请假',
  },
  {
    id: 'staff-04',
    name: '赵晨',
    role: '实习助教',
    team: '语言中心',
    workload: 40,
    skills: ['托福口语', '课堂签到', '排班协助'],
    avatarUrl: 'https://api.dicebear.com/6.x/big-smile/svg',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '广州 · 培训中心',
    education: {
      degree: '英语教育本科',
      school: '中山大学',
      year: '2024',
    },
    availability: [
      { day: '周一', start: '14:00', end: '20:00', location: '培训中心' },
      { day: '周三', start: '09:00', end: '13:00', location: '培训中心' },
      { day: '周五', start: '09:00', end: '12:00', location: '培训中心' },
    ],
    status: '在岗',
  },
  {
    id: 'staff-05',
    name: '林雨潼',
    role: '新媒体运营',
    team: '品牌内容组',
    workload: 76,
    skills: ['内容策划', '短视频剪辑', '数据复盘', '渠道投放'],
    avatarUrl: 'https://api.dicebear.com/6.x/big-smile/svg',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '杭州 · 品牌办公室',
    education: {
      degree: '传媒学硕士',
      school: '香港城市大学',
      year: '2020',
    },
    availability: [
      { day: '周一', start: '10:00', end: '19:00', location: '总部 3F' },
      { day: '周三', start: '10:00', end: '19:00', location: '总部 3F' },
      { day: '周五', start: '11:00', end: '20:00', location: '线上' },
    ],
    status: '在岗',
  },
];

export const SHIFT_CONFLICTS: ShiftConflict[] = [
  {
    id: 'conflict-01',
    staff: '刘畅',
    issue: '周五 19:00-21:00 同时分配两场模拟面试',
    impact: '影响 2 位学生模拟面试安排',
    suggestedAction: '拆分班次或指派备用导师',
    detectedAt: '2025-11-08 21:20',
  },
  {
    id: 'conflict-02',
    staff: '王若',
    issue: '周六全天已标记「线上咨询日」，但错配线下面谈',
    impact: '需重新安排地点，避免客户体验下降',
    suggestedAction: '改派线上顾问或调整面谈时间',
    detectedAt: '2025-11-08 15:05',
  },
];

export const ATTENDANCE_SUMMARIES: AttendanceSummary[] = [
  {
    month: '2025-09',
    present: 262,
    leave: 18,
    overtimeHours: 36,
    alerts: ['6 人补卡次数 > 3', '周末排班高峰需提前协调'],
  },
  {
    month: '2025-10',
    present: 271,
    leave: 22,
    overtimeHours: 41,
    alerts: ['正在统计国庆调休情况', '排班冲突率下降 12%'],
  },
  {
    month: '2025-11',
    present: 88,
    leave: 6,
    overtimeHours: 9,
    alerts: ['无异常，请继续关注模拟面试高峰'],
  },
];

