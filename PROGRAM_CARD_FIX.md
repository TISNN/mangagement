# 🔧 专业卡片点击跳转修复

## ✅ 问题已修复

### 问题描述
在专业库列表中点击专业卡片无法跳转到专业详情页。

### 问题原因
`ProgramCard` 组件缺少点击事件处理,整个卡片没有 `onClick` 导航逻辑。

### 修复内容

#### 文件: `src/pages/admin/ProgramLibrary/components/ProgramCard.tsx`

**Before**:
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ...">
  {/* 卡片内容 */}
</div>
```

**After**:
```tsx
<div 
  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ... cursor-pointer"
  onClick={() => navigate(`/admin/programs/${program.id}`)}
>
  {/* 卡片内容 */}
</div>
```

### 修复细节

1. ✅ 添加 `onClick` 事件处理器
2. ✅ 点击跳转到 `/admin/programs/${program.id}`
3. ✅ 添加 `cursor-pointer` 样式,鼠标悬停显示手型
4. ✅ 保持内部按钮的 `stopPropagation`,防止事件冒泡

### 事件冒泡处理

卡片内部的按钮已正确处理事件冒泡:

```tsx
// 收藏按钮 - 阻止冒泡
<button onClick={(e) => {
  e.stopPropagation();
  onToggleProgramInterest(program.school_id, program.id);
}}>
  <Heart />
</button>

// 外部链接 - 阻止冒泡
<a onClick={(e) => e.stopPropagation()}>
  <ExternalLink />
</a>
```

这样点击按钮不会触发卡片的导航,只有点击卡片其他区域才会跳转。

---

## 🧪 测试方法

### 1. 访问专业库
```
http://localhost:5174/admin/school-assistant
→ 切换到"专业库"标签
```

### 2. 点击专业卡片
- 点击专业卡片的任意空白区域
- 应该跳转到专业详情页
- URL应该是 `/admin/programs/[专业ID]`

### 3. 测试按钮
- 点击"收藏"按钮 → 应该只触发收藏,不跳转
- 点击"外部链接"按钮 → 应该打开新标签,不跳转

---

## ✅ 验证清单

- [x] 点击专业卡片可以跳转
- [x] 跳转到正确的专业详情页
- [x] 鼠标悬停显示手型
- [x] 收藏按钮不会触发跳转
- [x] 外部链接不会触发跳转
- [x] 深色模式样式正常
- [x] Hover效果正常(阴影变化)
- [x] 0 Lint错误

---

## 📊 所有专业相关跳转现已正常

### 从不同位置跳转到专业详情

| 位置 | 触发方式 | 跳转路径 | 状态 |
|------|---------|---------|------|
| 学校详情页 | 点击专业列表项 | `/admin/programs/:id` | ✅ |
| 学校卡片 | 点击展开的专业 | `/admin/programs/:id` | ✅ |
| 专业库列表 | 点击专业卡片 | `/admin/programs/:id` | ✅ 修复 |

---

## 🎯 支持的路由

专业详情页现在支持以下所有路径格式:

```
✅ /admin/program/:id
✅ /admin/programs/:id
✅ /admin/program-detail/:id
```

---

**修复时间**: 2025-10-23  
**修复状态**: ✅ 完成  
**Lint错误**: ✅ 0错误  
**功能状态**: ✅ 完全可用  

