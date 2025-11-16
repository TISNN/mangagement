# 学生端功能规划 - 申请业务闭环设计

## 📋 概述

本文档详细规划学生端需要实现的功能，以确保与管理端系统形成完整的申请业务逻辑闭环，实现顾问老师与学生之间的数字化流程同步。

## 🎯 核心目标

1. **信息透明化**：学生可实时查看申请进度、任务状态、材料清单
2. **协作高效化**：学生可上传材料、反馈文书、响应任务，与管理端实时同步
3. **流程自动化**：学生操作自动触发管理端状态更新，减少人工沟通成本
4. **体验优化**：提供友好的学生界面，降低使用门槛

---

## 📊 功能模块架构

```
学生端系统
├─ 1. 总览仪表盘 (Dashboard)
├─ 2. 申请进度中心 (Application Progress)
├─ 3. 材料管理中心 (Materials Center)
├─ 4. 文书协作中心 (Document Collaboration)
├─ 5. 任务与待办 (Tasks & Todos)
├─ 6. 选校规划 (School Selection)
├─ 7. 会议记录 (Meeting Records)
├─ 8. 网申进度 (Submission Tracker)
├─ 9. 通知中心 (Notifications)
└─ 10. 个人档案 (Profile)
```

---

## 🔄 业务闭环流程

### 流程 1：材料上传闭环
```
管理端创建材料任务 
  → 学生端收到通知 
  → 学生上传材料 
  → 管理端自动更新状态 
  → 触发下一步流程
```

### 流程 2：文书协作闭环
```
文书老师撰写/修改文书 
  → 学生端收到"待反馈"通知 
  → 学生查看版本并评论反馈 
  → 管理端收到反馈 
  → 文书老师继续修改 
  → 循环直到定稿
```

### 流程 3：任务执行闭环
```
顾问创建任务并指派给学生 
  → 学生端显示待办 
  → 学生完成任务并标记完成 
  → 管理端自动更新任务状态 
  → 顾问收到完成通知
```

### 流程 4：选校确认闭环
```
顾问创建选校列表 
  → 学生端显示选校方案 
  → 学生确认/修改选校 
  → 管理端同步确认状态 
  → 触发材料准备流程
```

---

## 📝 详细功能清单

### 1. 总览仪表盘 (Dashboard)

#### 1.1 核心功能
- ✅ **申请进度概览**
  - 显示当前申请阶段（7个阶段：背景评估→选校规划→材料准备→提交申请→面试阶段→录取决定→签证办理）
  - 进度百分比可视化
  - 下一个关键截止日期提醒
  
- ✅ **待办事项汇总**
  - 今日/本周/逾期任务统计
  - 按优先级排序
  - 快速跳转到任务详情

- ✅ **材料状态概览**
  - 材料完成度统计
  - 待上传/待审核/已完成材料数量
  - 紧急材料提醒（临近截止日期）

- ✅ **文书状态概览**
  - 待反馈文书数量
  - 进行中/待审核/已定稿文书统计
  - 最新版本更新提醒

- ✅ **选校列表预览**
  - 已确认选校数量
  - 冲刺/目标/保底分布
  - 最近截止日期提醒

#### 1.2 数据来源
- `application_overview` 表
- `application_documents_checklist` 表
- `application_document` 表（文书）
- `final_university_choices` 表
- `tasks` 表（学生相关任务）

#### 1.3 实时同步机制
- 使用 Supabase Realtime 订阅数据变化
- 管理端状态更新自动推送到学生端
- 页面刷新时重新拉取最新数据

#### 1.4 详细设计深化

##### 1.4.1 UI/UX 设计

**页面布局结构：**
```
┌─────────────────────────────────────────────────────────┐
│ 顶部欢迎语区域（渐变背景卡片）                              │
│ - 日期显示 + 个性化问候语                                  │
│ - 目标项目/服务状态/下一步动作（3个信息卡片）                │
├─────────────────────────────────────────────────────────┤
│ 申请进度概览卡片                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 当前阶段：材料准备 (3/7)                              │ │
│ │ [████████░░░░░░░░] 43%                               │ │
│ │ 下一个截止日期：2025-02-15 (UCB 成绩单提交)            │ │
│ │ 阶段详情：点击查看 →                                   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 统计卡片区域（4列网格布局）                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ 待办事项 │ │ 材料状态│ │ 文书状态  │ │ 选校列表 │    │
│ │ 今日: 3  │ │ 待上传:5 │ │ 待反馈:2 │ │ 已确认:8 │    │
│ │ 本周: 8  │ │ 待审核:2 │ │ 进行中:3 │ │ 冲刺:3  │    │
│ │ 逾期: 1  │ │ 已完成:12│ │ 已定稿:5 │ │ 目标:3  │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│ 快速操作区域                                              │
│ - 上传材料按钮 | 查看任务 | 反馈文书 | 查看选校            │
└─────────────────────────────────────────────────────────┘
```

**申请进度卡片详细设计：**
- **进度条样式**：
  - 已完成阶段：蓝色渐变 (#3B82F6 → #8B5CF6)
  - 进行中阶段：黄色高亮 (#F59E0B)
  - 未开始阶段：灰色 (#E5E7EB)
  - 每个阶段可点击，跳转到对应详情页
- **阶段标签**：
  - 显示阶段名称、完成百分比、预计完成时间
  - 阻塞状态显示红色警告图标 + 阻塞原因
- **截止日期提醒**：
  - 3天内：红色高亮 + 闪烁动画
  - 7天内：黄色提醒
  - 超过7天：正常显示

**统计卡片详细设计：**
- **待办事项卡片**：
  - 顶部图标：📋 任务清单图标
  - 数字显示：大号字体，颜色根据数量变化（红色=紧急，黄色=注意，绿色=正常）
  - 点击卡片跳转到任务列表页，自动筛选对应状态
- **材料状态卡片**：
  - 顶部图标：📁 文件夹图标
  - 进度环：显示完成度百分比（已完成/总数）
  - 紧急材料：红色数字 + 感叹号图标
  - 点击跳转到材料中心，自动筛选对应状态
- **文书状态卡片**：
  - 顶部图标：📝 文档图标
  - 待反馈数量：红色徽章显示
  - 最新更新：显示"X分钟前更新"
  - 点击跳转到文书协作中心
- **选校列表卡片**：
  - 顶部图标：🎓 学位帽图标
  - 分布饼图：冲刺/目标/保底比例可视化
  - 最近截止日期：显示学校名称 + 日期
  - 点击跳转到选校规划页

##### 1.4.2 数据模型

**API 响应数据结构：**
```typescript
interface DashboardData {
  // 申请进度
  applicationProgress: {
    currentStage: 'evaluation' | 'schoolSelection' | 'preparation' | 
                  'submission' | 'interview' | 'decision' | 'visa';
    currentStageIndex: number; // 0-6
    totalStages: number; // 7
    progressPercentage: number; // 0-100
    nextDeadline: {
      date: string; // ISO 8601
      description: string;
      daysRemaining: number;
      isUrgent: boolean; // 3天内
    } | null;
    blockingReasons: string[]; // 阻塞原因列表
  };
  
  // 待办事项统计
  taskStats: {
    today: {
      total: number;
      highPriority: number;
      mediumPriority: number;
      lowPriority: number;
    };
    thisWeek: {
      total: number;
      byStatus: {
        pending: number;
        inProgress: number;
        completed: number;
      };
    };
    overdue: {
      total: number;
      items: Array<{
        id: number;
        title: string;
        daysOverdue: number;
      }>;
    };
  };
  
  // 材料状态统计
  materialStats: {
    total: number;
    pendingUpload: number;
    pendingReview: number;
    completed: number;
    urgent: Array<{
      id: number;
      name: string;
      dueDate: string;
      daysRemaining: number;
    }>;
    completionRate: number; // 0-100
  };
  
  // 文书状态统计
  documentStats: {
    total: number;
    pendingFeedback: number;
    inProgress: number;
    pendingReview: number;
    finalized: number;
    latestUpdate: {
      documentId: number;
      documentType: string;
      updatedAt: string;
      minutesAgo: number;
    } | null;
  };
  
  // 选校列表统计
  schoolSelectionStats: {
    total: number;
    confirmed: number;
    byType: {
      reach: number; // 冲刺
      target: number; // 目标
      safety: number; // 保底
    };
    nearestDeadline: {
      schoolId: number;
      schoolName: string;
      programName: string;
      deadline: string;
      daysRemaining: number;
    } | null;
  };
}
```

##### 1.4.3 API 接口设计

**获取仪表盘数据：**
```typescript
// GET /api/student/dashboard
// Headers: Authorization: Bearer <token>

Response 200:
{
  success: true,
  data: DashboardData,
  timestamp: string
}

Response 401:
{
  success: false,
  error: "Unauthorized"
}
```

**Supabase 查询实现：**
```typescript
// services/studentDashboardService.ts

export async function getDashboardData(studentId: number) {
  const [
    applicationOverview,
    tasks,
    materials,
    documents,
    schoolChoices
  ] = await Promise.all([
    // 申请进度概览
    supabase
      .from('application_overview')
      .select('*')
      .eq('student_id', studentId)
      .single(),
    
    // 任务统计
    supabase
      .from('tasks')
      .select('id, title, status, priority, due_date')
      .eq('assignee_id', studentId)
      .in('status', ['pending', 'in_progress', 'completed']),
    
    // 材料统计
    supabase
      .from('application_documents_checklist')
      .select('id, name, status, due_date, progress')
      .eq('student_id', studentId),
    
    // 文书统计
    supabase
      .from('application_document')
      .select('id, document_type, status, updated_at')
      .eq('student_id', studentId),
    
    // 选校统计
    supabase
      .from('final_university_choices')
      .select('id, school_name, program_name, application_type, deadline, status')
      .eq('student_id', studentId)
  ]);
  
  // 数据处理和聚合逻辑
  return transformToDashboardData({
    applicationOverview,
    tasks,
    materials,
    documents,
    schoolChoices
  });
}
```

##### 1.4.4 实时同步实现

**Supabase Realtime 订阅：**
```typescript
// hooks/useDashboardRealtime.ts

export function useDashboardRealtime(studentId: number) {
  const [data, setData] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    // 初始加载
    loadDashboardData();
    
    // 订阅任务变化
    const taskChannel = supabase
      .channel('student-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `assignee_id=eq.${studentId}`
      }, (payload) => {
        console.log('Task changed:', payload);
        refreshTaskStats();
      })
      .subscribe();
    
    // 订阅材料变化
    const materialChannel = supabase
      .channel('student-materials')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'application_documents_checklist',
        filter: `student_id=eq.${studentId}`
      }, (payload) => {
        console.log('Material changed:', payload);
        refreshMaterialStats();
      })
      .subscribe();
    
    // 订阅文书变化
    const documentChannel = supabase
      .channel('student-documents')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'application_document',
        filter: `student_id=eq.${studentId}`
      }, (payload) => {
        console.log('Document changed:', payload);
        refreshDocumentStats();
      })
      .subscribe();
    
    return () => {
      taskChannel.unsubscribe();
      materialChannel.unsubscribe();
      documentChannel.unsubscribe();
    };
  }, [studentId]);
  
  return { data, refresh: loadDashboardData };
}
```

##### 1.4.5 交互流程

**用户操作流程：**
1. **页面加载**：
   - 显示骨架屏（Skeleton Loading）
   - 并行请求所有数据源
   - 数据加载完成后淡入显示
   - 加载失败显示错误提示 + 重试按钮

2. **点击统计卡片**：
   - 添加点击动画反馈
   - 导航到对应页面，并传递筛选参数
   - 例如：点击"待上传:5" → 跳转到材料中心，自动筛选"待上传"状态

3. **点击进度条阶段**：
   - 显示阶段详情抽屉（Drawer）
   - 展示该阶段的详细任务、材料、文书
   - 提供"查看详情"按钮跳转到完整页面

4. **实时更新**：
   - 数据变化时显示轻量提示（Toast）
   - 例如："您有1个新任务" + 跳转按钮
   - 避免整页刷新，仅更新对应卡片

##### 1.4.6 边界情况处理

1. **无数据状态**：
   - 显示友好的空状态插画
   - 提示文案："还没有申请进度，请联系顾问开始申请流程"
   - 提供"联系顾问"按钮

2. **数据加载失败**：
   - 显示错误卡片，包含错误信息
   - 提供"重试"按钮
   - 记录错误日志到监控系统

3. **部分数据缺失**：
   - 使用默认值填充（如 0、null）
   - 在对应卡片显示"暂无数据"提示
   - 不影响其他卡片正常显示

4. **网络断开**：
   - 检测网络状态
   - 显示离线提示
   - 使用缓存数据显示（如果存在）
   - 网络恢复后自动同步

##### 1.4.7 性能优化

1. **数据缓存**：
   - 使用 React Query 或 SWR 缓存数据
   - 缓存时间：5分钟
   - 后台自动刷新

2. **懒加载**：
   - 初始只加载关键数据
   - 非关键数据（如历史记录）按需加载

3. **防抖节流**：
   - 实时更新使用节流（throttle），避免频繁刷新
   - 搜索输入使用防抖（debounce）

4. **虚拟滚动**：
   - 如果列表项过多，使用虚拟滚动优化性能

##### 1.4.8 测试用例

**单元测试：**
```typescript
describe('Dashboard Component', () => {
  it('应该正确计算进度百分比', () => {
    const progress = calculateProgress(3, 7);
    expect(progress).toBe(43);
  });
  
  it('应该正确识别紧急截止日期', () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2); // 2天后
    expect(isUrgentDeadline(deadline)).toBe(true);
  });
  
  it('应该正确聚合任务统计', () => {
    const tasks = [
      { status: 'pending', priority: 'high' },
      { status: 'pending', priority: 'medium' },
      { status: 'completed', priority: 'low' }
    ];
    const stats = aggregateTaskStats(tasks);
    expect(stats.today.total).toBe(3);
    expect(stats.today.highPriority).toBe(1);
  });
});
```

**集成测试：**
```typescript
describe('Dashboard Integration', () => {
  it('应该成功加载并显示所有数据', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('申请进度概览')).toBeInTheDocument();
      expect(screen.getByText('待办事项')).toBeInTheDocument();
    });
  });
  
  it('应该正确处理实时更新', async () => {
    const { rerender } = render(<Dashboard />);
    // 模拟 Supabase Realtime 更新
    mockSupabaseRealtime.emit('task-created');
    await waitFor(() => {
      expect(screen.getByText('今日: 4')).toBeInTheDocument();
    });
  });
});
```

---

### 2. 申请进度中心 (Application Progress)

#### 2.1 核心功能
- ✅ **阶段进度可视化**
  - 7个申请阶段的进度条
  - 每个阶段的完成状态（未开始/进行中/已完成）
  - 阶段阻塞原因提示

- ✅ **申请档案查看**
  - 基本信息（姓名、联系方式、教育背景）
  - 语言考试成绩（IELTS、TOEFL、GRE、GMAT）
  - 考试账号信息（仅查看，不可编辑）

- ✅ **申请统计**
  - 总申请数量
  - 各状态申请数量（未投递/已投递/审核中/已录取/已拒绝/Waitlist）
  - 录取率可视化

#### 2.2 数据来源
- `student_profile` 表
- `final_university_choices` 表
- `application_overview` 表

#### 2.3 权限控制
- 学生只能查看自己的申请信息
- 敏感信息（如考试密码）需要二次确认查看

---

### 3. 材料管理中心 (Materials Center)

#### 3.1 核心功能
- ✅ **材料清单查看**
  - 按申请项目/学校分组显示
  - 材料类型分类（成绩单、推荐信、个人陈述、简历、护照等）
  - 材料状态标识（未完成/进行中/已完成/已提交）

- ✅ **材料上传**
  - 支持拖拽上传
  - 多文件批量上传
  - 文件格式验证（PDF、DOC、DOCX、JPG、PNG）
  - 文件大小限制提示

- ✅ **材料状态跟踪**
  - 上传时间记录
  - 审核状态（待审核/已通过/需修改）
  - 审核意见查看

- ✅ **材料下载**
  - 下载已上传的材料
  - 下载模板文件（如推荐信模板）

- ✅ **材料历史记录**
  - 版本历史查看
  - 修改记录追踪

#### 3.2 数据来源
- `application_documents_checklist` 表
- `application_material` 表（如果存在）
- Supabase Storage（文件存储）

#### 3.3 业务闭环
```
学生上传材料 
  → 更新 application_documents_checklist.status = '已提交'
  → 触发管理端通知（顾问/文书老师）
  → 管理端审核材料
  → 更新状态为'已通过'或'需修改'
  → 学生端收到通知并显示审核结果
```

#### 3.4 详细设计深化

##### 3.4.1 UI/UX 设计

**页面布局结构：**
```
┌─────────────────────────────────────────────────────────┐
│ 顶部操作栏                                                │
│ [搜索框] [筛选:全部/待上传/待审核/已完成] [上传材料按钮]    │
├─────────────────────────────────────────────────────────┤
│ 材料分组视图（可切换：按学校/按类型/按状态）                │
│                                                          │
│ ┌─ 按学校分组 ───────────────────────────────────────┐  │
│ │ 📍 UCB - Master of Computer Science                │  │
│ │   ├─ ✅ 成绩单 (已完成) - 2025-01-15 上传           │  │
│ │   ├─ ⏳ 推荐信 (待上传) - 截止: 2025-02-01 [紧急]   │  │
│ │   └─ 📝 个人陈述 (待审核) - 2025-01-20 上传         │  │
│ │                                                      │  │
│ │ 📍 Stanford - Master of Computer Science           │  │
│ │   ├─ ✅ 成绩单 (已完成)                             │  │
│ │   └─ ⏳ 推荐信 (待上传)                             │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌─ 材料详情抽屉（点击材料项展开）──────────────────────┐  │
│ │ 材料名称: 推荐信                                       │  │
│ │ 状态: 待上传 | 截止日期: 2025-02-01 (3天后)          │  │
│ │ 进度: [████░░░░] 60%                                  │  │
│ │                                                      │  │
│ │ 📎 已上传文件:                                        │  │
│ │   - recommendation_letter_v1.pdf (2.3 MB)           │  │
│ │     上传时间: 2025-01-20 14:30                       │  │
│ │     [下载] [删除] [替换]                             │  │
│ │                                                      │  │
│ │ 📝 审核意见:                                          │  │
│ │   "推荐信格式正确，但需要补充推荐人联系方式"            │  │
│ │   审核人: 张老师 | 审核时间: 2025-01-21 10:00        │  │
│ │                                                      │  │
│ │ 📜 历史记录:                                          │  │
│ │   - v1: 2025-01-20 14:30 上传                        │  │
│ │   - v2: 2025-01-21 09:00 审核需修改                  │  │
│ └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**材料卡片设计：**
- **状态标识**：
  - 未完成：灰色圆点 + "待上传"标签
  - 进行中：黄色圆点 + "进行中"标签
  - 待审核：蓝色圆点 + "待审核"标签 + 旋转加载动画
  - 已完成：绿色对勾 + "已完成"标签
  - 需修改：红色警告 + "需修改"标签
- **紧急提示**：
  - 3天内截止：红色边框 + 闪烁动画
  - 7天内截止：黄色边框
  - 显示倒计时："还剩X天"
- **进度条**：
  - 显示完成百分比
  - 颜色根据状态变化（绿色=完成，黄色=进行中，红色=逾期）

**上传界面设计：**
```
┌─────────────────────────────────────────────────────────┐
│ 上传材料对话框                                            │
│                                                          │
│ 材料名称: [推荐信] (自动填充或手动输入)                    │
│ 关联学校: [UCB ▼]                                        │
│ 材料类型: [推荐信 ▼]                                       │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                      │ │
│ │         📎 拖拽文件到此处或点击上传                    │ │
│ │                                                      │ │
│ │         支持格式: PDF, DOC, DOCX, JPG, PNG          │ │
│ │         最大文件: 10 MB                               │ │
│ │                                                      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ 已选择文件:                                              │
│   ✓ recommendation_letter.pdf (2.3 MB) [删除]          │
│   ✓ recommendation_letter_backup.pdf (1.8 MB) [删除]   │
│                                                          │
│ 备注: [可选，填写材料说明...]                            │
│                                                          │
│ [取消] [上传]                                            │
└─────────────────────────────────────────────────────────┘
```

##### 3.4.2 数据模型

**材料数据结构：**
```typescript
interface Material {
  id: number;
  student_id: number;
  school_id?: number; // 关联学校
  school_name?: string;
  program_name?: string;
  name: string; // 材料名称
  type: 'transcript' | 'recommendation' | 'personal_statement' | 
        'resume' | 'passport' | 'language_test' | 'other';
  status: 'pending' | 'in_progress' | 'submitted' | 
          'under_review' | 'approved' | 'needs_revision' | 'completed';
  progress: number; // 0-100
  due_date: string | null; // ISO 8601
  completed_date: string | null;
  
  // 文件信息
  files: Array<{
    id: number;
    file_name: string;
    file_url: string; // Supabase Storage URL
    file_size: number; // bytes
    mime_type: string;
    uploaded_at: string;
    uploaded_by: 'student' | 'advisor';
    version: number;
  }>;
  
  // 审核信息
  review?: {
    reviewed_by: number; // employee_id
    reviewed_by_name: string;
    reviewed_at: string;
    status: 'approved' | 'needs_revision';
    comments: string;
    revision_requirements?: string[];
  };
  
  // 历史记录
  history: Array<{
    action: 'uploaded' | 'reviewed' | 'approved' | 'revision_requested';
    performed_by: string;
    performed_at: string;
    notes?: string;
  }>;
  
  notes?: string; // 学生备注
  created_at: string;
  updated_at: string;
}
```

##### 3.4.3 API 接口设计

**获取材料列表：**
```typescript
// GET /api/student/materials
// Query params: ?school_id=123&type=recommendation&status=pending

Response 200:
{
  success: true,
  data: {
    materials: Material[];
    stats: {
      total: number;
      byStatus: Record<string, number>;
      byType: Record<string, number>;
      urgent: number; // 3天内截止
    };
  }
}
```

**上传材料：**
```typescript
// POST /api/student/materials/:id/upload
// Content-Type: multipart/form-data
// Body: { file: File, notes?: string }

Response 200:
{
  success: true,
  data: {
    material: Material;
    file: {
      id: number;
      file_url: string;
      file_name: string;
    };
  }
}

Response 400:
{
  success: false,
  error: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE" | "UPLOAD_FAILED"
}
```

**Supabase 实现：**
```typescript
// services/studentMaterialService.ts

export async function uploadMaterial(
  materialId: number,
  file: File,
  notes?: string
) {
  // 1. 验证文件
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('文件大小不能超过 10MB');
  }
  
  const allowedTypes = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('不支持的文件格式');
  }
  
  // 2. 上传到 Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${materialId}/${Date.now()}.${fileExt}`;
  const filePath = `materials/${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('student-materials')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  // 3. 获取公开 URL
  const { data: { publicUrl } } = supabase.storage
    .from('student-materials')
    .getPublicUrl(filePath);
  
  // 4. 更新材料记录
  const { data: material, error: materialError } = await supabase
    .from('application_documents_checklist')
    .update({
      status: 'submitted',
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      updated_at: new Date().toISOString(),
      notes: notes || null
    })
    .eq('id', materialId)
    .select()
    .single();
  
  if (materialError) throw materialError;
  
  // 5. 记录历史
  await supabase.from('material_history').insert({
    material_id: materialId,
    action: 'uploaded',
    performed_by: 'student',
    performed_at: new Date().toISOString(),
    file_url: publicUrl
  });
  
  // 6. 触发通知（通过 Edge Function 或数据库触发器）
  await notifyAdvisors(materialId, 'material_uploaded');
  
  return material;
}
```

##### 3.4.4 文件上传流程

**完整上传流程：**
1. **文件选择**：
   - 支持点击选择或拖拽
   - 实时显示文件预览（图片）或文件信息
   - 显示文件大小和格式验证结果

2. **上传前验证**：
   - 文件大小检查（≤10MB）
   - 文件类型检查（白名单）
   - 文件名安全检查（防止路径遍历）

3. **上传进度**：
   - 显示上传进度条（0-100%）
   - 显示上传速度（MB/s）
   - 支持取消上传

4. **上传后处理**：
   - 自动更新材料状态为"已提交"
   - 记录上传历史
   - 触发管理端通知
   - 显示成功提示

5. **错误处理**：
   - 网络错误：显示重试按钮
   - 文件过大：提示压缩建议
   - 格式错误：显示支持格式列表
   - 服务器错误：记录日志并提示联系支持

##### 3.4.5 审核状态同步

**实时订阅审核状态：**
```typescript
// hooks/useMaterialReview.ts

export function useMaterialReview(materialId: number) {
  const [material, setMaterial] = useState<Material | null>(null);
  
  useEffect(() => {
    // 订阅材料状态变化
    const channel = supabase
      .channel(`material-${materialId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'application_documents_checklist',
        filter: `id=eq.${materialId}`
      }, (payload) => {
        const updated = payload.new as Material;
        setMaterial(updated);
        
        // 如果状态变为"需修改"，显示通知
        if (updated.status === 'needs_revision') {
          showNotification({
            type: 'warning',
            title: '材料需修改',
            message: `"${updated.name}"需要修改，请查看审核意见`,
            action: {
              label: '查看详情',
              onClick: () => navigate(`/student/materials/${materialId}`)
            }
          });
        }
      })
      .subscribe();
    
    return () => channel.unsubscribe();
  }, [materialId]);
  
  return material;
}
```

##### 3.4.6 边界情况处理

1. **文件上传失败**：
   - 显示具体错误信息
   - 提供重试按钮
   - 大文件提供分片上传选项

2. **网络中断**：
   - 检测网络状态
   - 暂停上传，网络恢复后自动继续
   - 显示离线提示

3. **重复上传**：
   - 检测文件名和大小
   - 提示是否替换现有文件
   - 保留历史版本

4. **存储空间不足**：
   - 检查用户存储配额
   - 提示清理旧文件
   - 提供升级选项

##### 3.4.7 性能优化

1. **分片上传**：
   - 大文件（>5MB）自动分片
   - 并行上传多个分片
   - 失败分片自动重试

2. **图片压缩**：
   - 上传前自动压缩图片
   - 保持质量的同时减小文件大小
   - 使用 WebP 格式（如果支持）

3. **懒加载**：
   - 材料列表虚拟滚动
   - 文件预览按需加载
   - 历史记录分页加载

4. **缓存策略**：
   - 已上传文件 URL 缓存
   - 材料列表缓存 5 分钟
   - 使用 Service Worker 离线缓存

##### 3.4.8 测试用例

**单元测试：**
```typescript
describe('Material Upload', () => {
  it('应该验证文件大小', () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf');
    expect(validateFileSize(largeFile)).toBe(false);
  });
  
  it('应该验证文件类型', () => {
    const invalidFile = new File(['content'], 'file.exe');
    expect(validateFileType(invalidFile)).toBe(false);
  });
  
  it('应该正确计算上传进度', () => {
    const progress = calculateProgress(50, 100);
    expect(progress).toBe(50);
  });
});
```

**集成测试：**
```typescript
describe('Material Upload Flow', () => {
  it('应该成功上传材料并更新状态', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = await uploadMaterial(1, file);
    expect(result.status).toBe('submitted');
    expect(result.files).toHaveLength(1);
  });
  
  it('应该正确处理审核状态更新', async () => {
    // 模拟管理端审核
    await updateMaterialReview(1, {
      status: 'needs_revision',
      comments: '需要修改'
    });
    
    // 验证学生端收到通知
    await waitFor(() => {
      expect(screen.getByText('材料需修改')).toBeInTheDocument();
    });
  });
});
```

---

### 4. 文书协作中心 (Document Collaboration)

#### 4.1 核心功能
- ✅ **文书列表查看**
  - 按文书类型分组（PS、Essay、CV、推荐信等）
  - 文书状态显示（草稿/待反馈/审核中/已定稿）
  - 最新版本标识

- ✅ **文书版本查看**
  - 版本历史列表
  - 版本对比功能（差异高亮）
  - 版本时间线

- ✅ **文书反馈**
  - 在线查看文书内容
  - 选中文本添加评论
  - 整体反馈提交
  - @ 提及顾问/文书老师

- ✅ **文书下载**
  - 下载当前版本
  - 下载历史版本
  - PDF 导出

- ✅ **文书状态通知**
  - 新版本发布通知
  - 待反馈提醒
  - 定稿确认通知

#### 4.2 数据来源
- `application_document` 表
- `document_version` 表
- Supabase Storage（文书文件）

#### 4.3 业务闭环
```
文书老师创建/更新文书版本
  → 学生端收到"待反馈"通知
  → 学生查看新版本
  → 学生添加评论/反馈
  → 管理端收到反馈通知
  → 文书老师根据反馈修改
  → 循环直到学生确认定稿
```

---

### 5. 任务与待办 (Tasks & Todos)

#### 5.1 核心功能
- ✅ **任务列表**
  - 按状态筛选（待处理/进行中/已完成/已逾期）
  - 按优先级排序
  - 按截止日期排序

- ✅ **任务详情**
  - 任务描述
  - 截止日期
  - 优先级标识
  - 关联材料/文书

- ✅ **任务操作**
  - 标记为进行中
  - 标记为已完成
  - 添加完成备注
  - 上传完成证据（如截图）

- ✅ **任务提醒**
  - 今日到期任务提醒
  - 逾期任务高亮
  - 即将到期任务预警（3天/7天前）

#### 5.2 数据来源
- `tasks` 表（筛选 `assignee_id` = 当前学生ID）
- `task_comments` 表（如果存在）

#### 5.3 业务闭环
```
顾问创建任务并指派给学生
  → 学生端显示新任务通知
  → 学生查看任务详情
  → 学生完成任务
  → 学生标记完成并上传证据
  → 管理端自动更新任务状态
  → 顾问收到完成通知
```

---

### 6. 选校规划 (School Selection)

#### 6.1 核心功能
- ✅ **选校列表查看**
  - 按申请类型分组（冲刺/目标/保底）
  - 按申请轮次分组（ED/EA/RD/Rolling）
  - 按状态筛选

- ✅ **选校详情**
  - 学校信息
  - 专业信息
  - 截止日期
  - 申请账号（仅查看）

- ✅ **选校确认**
  - 确认选校方案
  - 提出修改建议
  - 添加备注

- ✅ **选校进度跟踪**
  - 投递状态更新
  - 录取结果查看
  - 时间线记录

#### 6.2 数据来源
- `final_university_choices` 表
- `schools` 表（学校详情）
- `programs` 表（专业详情）

#### 6.3 业务闭环
```
顾问创建选校列表
  → 学生端显示选校方案
  → 学生查看并确认/提出修改
  → 管理端收到确认/修改请求
  → 顾问根据反馈调整
  → 最终确认后触发材料准备流程
```

---

### 7. 会议记录 (Meeting Records)

#### 7.1 核心功能
- ✅ **会议列表**
  - 按时间排序
  - 按会议类型筛选（初次咨询/选校讨论/文书指导等）
  - 会议状态显示（已安排/进行中/已完成/已取消）

- ✅ **会议详情**
  - 会议标题和概要
  - 会议时间（开始/结束）
  - 参会人员
  - 会议文档下载

- ✅ **会议预约**
  - 查看可预约时间段
  - 提交预约请求
  - 取消预约

#### 7.2 数据来源
- `student_meetings` 表
- `meeting_documents` 表（会议文档）

#### 7.3 业务闭环
```
顾问创建会议
  → 学生端收到会议通知
  → 学生查看会议详情
  → 会议进行中/完成后
  → 学生可查看会议记录和文档
```

---

### 8. 网申进度 (Submission Tracker)

#### 8.1 核心功能
- ✅ **网申阶段跟踪**
  - 7个阶段可视化（账号创建→表单填写→材料上传→缴费→提交→补件→录取结果）
  - 每个阶段的完成状态
  - 阶段完成时间记录

- ✅ **网申详情**
  - 申请账号信息（仅查看）
  - 表单填写进度
  - 材料上传状态
  - 缴费状态

- ✅ **补件提醒**
  - 补件要求查看
  - 补件截止日期提醒
  - 补件材料上传

#### 8.2 数据来源
- `submission_progress` 表
- `final_university_choices` 表（申请账号）

#### 8.3 业务闭环
```
顾问记录网申进度
  → 学生端实时更新显示
  → 需要学生操作时（如补件）
  → 学生端收到通知
  → 学生完成操作
  → 管理端更新状态
```

---

### 9. 通知中心 (Notifications)

#### 9.1 核心功能
- ✅ **通知列表**
  - 按类型分类（任务/材料/文书/会议/系统）
  - 按时间排序
  - 未读/已读标识

- ✅ **通知类型**
  - 新任务通知
  - 材料审核结果
  - 文书新版本
  - 会议安排/提醒
  - 选校确认请求
  - 系统公告

- ✅ **通知操作**
  - 标记为已读
  - 一键跳转到相关页面
  - 批量标记已读

#### 9.2 数据来源
- `notifications` 表（如果存在）
- 或通过 Supabase Realtime 实时推送

#### 9.3 实时同步
- 使用 Supabase Realtime 订阅通知
- 管理端操作自动触发通知
- 浏览器推送通知（可选）

---

### 10. 个人档案 (Profile)

#### 10.1 核心功能
- ✅ **基本信息**
  - 姓名、邮箱、电话
  - 头像上传
  - 密码修改

- ✅ **申请档案查看**
  - 教育背景（本科/硕士）
  - 语言考试成绩
  - 考试账号（仅查看）

- ✅ **偏好设置**
  - 通知偏好
  - 语言设置
  - 主题设置（暗黑模式）

#### 10.2 数据来源
- `students` 表
- `student_profile` 表
- `auth.users` 表（认证信息）

---

## 🔗 数据同步机制

### 1. 实时同步（Supabase Realtime）
- 材料状态更新
- 文书版本发布
- 任务状态变更
- 通知推送

### 2. 定时同步
- 每日凌晨同步申请进度统计
- 每小时检查逾期任务

### 3. 手动刷新
- 页面刷新按钮
- 下拉刷新（移动端）

---

## 🎨 UI/UX 设计原则

1. **简洁明了**：信息层次清晰，避免信息过载
2. **实时反馈**：操作后立即显示状态变化
3. **友好提示**：重要操作前确认，错误信息清晰
4. **移动适配**：响应式设计，支持移动端访问
5. **无障碍设计**：支持键盘导航，屏幕阅读器友好

---

## 📱 移动端优化

1. **关键功能优先**：任务、材料上传、文书反馈
2. **简化操作流程**：减少点击步骤
3. **离线支持**：关键信息缓存，离线查看
4. **推送通知**：重要提醒推送

---

## 🔒 权限与安全

1. **数据隔离**：学生只能查看自己的数据
2. **敏感信息保护**：考试密码等需要二次确认
3. **操作审计**：记录关键操作日志
4. **文件安全**：上传文件病毒扫描，大小限制

---

## 📈 成功指标（KPI）

1. **学生活跃度**：日活跃用户数、周活跃用户数
2. **任务完成率**：学生任务及时完成率
3. **材料上传及时率**：材料在截止日期前上传比例
4. **文书反馈及时率**：文书反馈平均响应时间
5. **系统满意度**：学生满意度评分

---

## 🚀 实施优先级

### Phase 1: MVP（核心闭环）
1. ✅ 总览仪表盘
2. ✅ 材料管理中心（上传/查看）
3. ✅ 任务与待办（查看/完成）
4. ✅ 通知中心

### Phase 2: 协作增强
5. ✅ 文书协作中心
6. ✅ 选校规划（查看/确认）
7. ✅ 申请进度中心

### Phase 3: 体验优化
8. ✅ 会议记录
9. ✅ 网申进度跟踪
10. ✅ 个人档案管理

---

## 📚 相关文档

- `application-workbench.md` - 文书工作台设计
- `APPLICATION_PROGRESS_IMPLEMENTATION.md` - 申请进度实现
- `application-workstation-plan.md` - 申请工作站规划

---

**创建日期**: 2025-01-22  
**状态**: 📋 规划中  
**优先级**: 🔥 高

