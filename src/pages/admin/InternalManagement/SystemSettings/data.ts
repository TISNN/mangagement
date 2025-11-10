import type {
  IntegrationHealth,
  MaintenanceTask,
  NotificationTemplate,
} from '../types';

export const INTEGRATION_HEALTH: IntegrationHealth[] = [
  {
    id: 'integration-01',
    name: 'Supabase 主数据库',
    type: '数据库',
    status: '正常',
    lastCheck: '2025-11-09 08:10',
    owner: 'DevOps',
    description: '每 10 分钟健康检查，启用只读副本与慢查询告警。',
  },
  {
    id: 'integration-02',
    name: '企业微信消息推送',
    type: '消息服务',
    status: '警告',
    lastCheck: '2025-11-09 08:09',
    owner: '运营配置',
    description: '近 1 小时存在 5 条失败记录，需要检查应用凭证有效期。',
  },
  {
    id: 'integration-03',
    name: '支付回调网关',
    type: '支付',
    status: '正常',
    lastCheck: '2025-11-09 08:05',
    owner: '财务技术组',
    description: '实时监控响应延时，异常将触发短信告警。',
  },
];

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'nt-01',
    channel: '邮件',
    name: '新生欢迎邮件',
    trigger: '学生建档成功',
    lastUpdated: '2025-11-07',
    enabled: true,
    metrics: {
      send: 312,
      click: 198,
    },
  },
  {
    id: 'nt-02',
    channel: '短信',
    name: '面试提醒短信',
    trigger: '面试前 2 小时',
    lastUpdated: '2025-11-05',
    enabled: true,
    metrics: {
      send: 126,
      click: 0,
    },
  },
  {
    id: 'nt-03',
    channel: '站内信',
    name: '报表导出完成通知',
    trigger: '导出任务结束',
    lastUpdated: '2025-11-02',
    enabled: false,
    metrics: {
      send: 45,
      click: 31,
    },
  },
];

export const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'mt-01',
    title: '生产数据库备份验证',
    scope: '数据库',
    schedule: '每周六 02:00',
    owner: 'DevOps',
    status: '计划中',
    notes: '本周重点验证恢复脚本执行时间，目标 < 15 分钟。',
  },
  {
    id: 'mt-02',
    title: '通知模板多语言上线',
    scope: '通知系统',
    schedule: '2025-11-12 21:00',
    owner: '运营配置',
    status: '进行中',
    notes: '需与内容团队同步英文版模板，同时做好灰度发布。',
  },
  {
    id: 'mt-03',
    title: '日志留存策略更新',
    scope: '系统日志',
    schedule: '2025-11-15 20:00',
    owner: '安全团队',
    status: '计划中',
    notes: '将留存 90 天的日志归档至冷存储，保留关键访问日志。',
  },
];

