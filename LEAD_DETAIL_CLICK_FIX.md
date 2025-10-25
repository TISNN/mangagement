# 线索详情点击功能修复

## 🔧 修复内容

### 问题
用户点击线索无法查看详情

### 原因
路由参数名不匹配:
- **AppRoutes**: 使用 `:id`
- **LeadDetailPage**: 使用 `leadId`

### 解决方案

#### 1. 修复路由参数名
**文件**: `src/AppRoutes.tsx`

```typescript
// 修改前
<Route path="leads/:id" element={<LeadDetailPage />} />

// 修改后
<Route path="leads/:leadId" element={<LeadDetailPage />} />
```

#### 2. 优化点击跳转逻辑
**文件**: `src/pages/admin/LeadsPage.tsx`

```typescript
// 修改前 - 使用window.location.href强制刷新
const handleViewLead = (lead: Lead) => {
  console.log('正在跳转到线索详情页:', lead.id);
  const currentPort = window.location.port;
  window.location.href = `${window.location.protocol}//${window.location.hostname}:${currentPort}/admin/leads/${lead.id}`;
};

// 修改后 - 使用React Router导航
const handleViewLead = (lead: Lead) => {
  navigate(`/admin/leads/${lead.id}`);
};
```

#### 3. 移除多余按钮
- ❌ 移除"查看详情"(眼睛图标)按钮
- ❌ 移除"编辑"按钮
- ✅ 保留"添加跟进"按钮
- ✅ 点击整行直接跳转到详情页

#### 4. 清理多余文件
- 删除 `src/components/LeadDetailPanel/index.tsx` (使用LeadDetailPage替代)
- 删除相关文档文件

## ✅ 现在的功能

### 用户操作流程
1. **查看详情**: 直接点击线索行 → 跳转到详情页
2. **添加跟进**: 点击"跟进"图标 → 打开快捷跟进弹窗
3. **编辑线索**: 在详情页中直接编辑

### UI变化
```
线索列表行:
┌────────────────────────────────────────────┐
│ [头像] 张三                    [跟进]      │ ← 点击行跳转到详情
│       13800138000  3天前                   │
└────────────────────────────────────────────┘
```

### 技术细节
- 使用React Router的`navigate`函数进行SPA导航
- 路由参数:`/admin/leads/:leadId`
- 在LeadDetailPage中使用`useParams<{ leadId: string }>()`获取ID

## 📋 相关文件

### 修改的文件
1. `src/AppRoutes.tsx` - 修复路由参数名
2. `src/pages/admin/LeadsPage.tsx` - 优化跳转逻辑,移除多余按钮

### 删除的文件
1. `src/components/LeadDetailPanel/index.tsx`
2. `LEAD_DETAIL_PANEL.md`

## 🎯 测试要点

1. ✅ 点击线索行能否正常跳转
2. ✅ URL是否正确: `/admin/leads/{leadId}`
3. ✅ 详情页能否正确加载线索数据
4. ✅ 快捷跟进按钮是否还能正常工作
5. ✅ 在详情页中能否正常编辑

## 📝 注意事项

- 不再使用侧边面板,改用独立详情页面
- 详情页UI参考任务详情页面设计
- 所有编辑操作在详情页中完成
- 快捷跟进功能保留在列表页

---

**修复日期**: 2025-01-22
**状态**: ✅ 已完成

