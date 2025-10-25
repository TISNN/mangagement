# 线索详情页负责人头像显示

## ✨ 更新内容

在线索详情页的负责人字段前添加头像显示,提升视觉识别度。

## 🔧 实现细节

### 修改文件
**文件**: `src/pages/admin/LeadDetailPage.tsx`

### 1. 添加获取导师完整信息函数

```typescript
// 获取顾问完整信息
const getMentorInfo = (mentorId: string) => {
  if (!mentorId) return null;
  return mentors.find(m => m.id === parseInt(mentorId)) || null;
};
```

### 2. 更新负责人显示UI

**修改前** - 只显示姓名:
```typescript
<p className="font-medium dark:text-white">
  {getMentorName(lead?.assignedTo || '')}
</p>
```

**修改后** - 显示头像+姓名:
```typescript
{lead?.assignedTo ? (
  <div className="flex items-center gap-2">
    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
      <img
        src={getMentorInfo(lead.assignedTo)?.avatar_url || 
             `https://api.dicebear.com/7.x/avataaars/svg?seed=${getMentorName(lead.assignedTo)}`}
        alt={getMentorName(lead.assignedTo)}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
    <span className="font-medium dark:text-white">
      {getMentorName(lead.assignedTo)}
    </span>
  </div>
) : (
  <p className="font-medium text-gray-500 dark:text-gray-400">未分配</p>
)}
```

## 🎨 UI效果

### 显示效果
```
负责人
┌────────────────────────┐
│ [头像] 李老师          │  ← 有头像+名字
└────────────────────────┘

或

┌────────────────────────┐
│ 未分配                 │  ← 没有负责人时显示
└────────────────────────┘
```

## 📋 技术特性

### 头像来源
1. **优先使用**: 从数据库获取的 `avatar_url`
2. **备用方案**: 使用 DiceBear API 根据姓名生成头像
3. **失败处理**: 图片加载失败时隐藏,只显示蓝色背景圆圈

### 样式特点
- **大小**: 8x8 (32px)
- **形状**: 圆形
- **背景**: 蓝色 (bg-blue-100)
- **间距**: 头像和名字之间2个单位间距
- **响应式**: flex布局自适应

### 状态处理
- ✅ **有负责人**: 显示头像+姓名
- ✅ **未分配**: 显示灰色"未分配"文字
- ✅ **编辑模式**: 下拉选择框(不显示头像)

## 🎯 用户体验提升

### 优势
1. **视觉识别**: 快速识别负责人
2. **一致性**: 与线索列表页保持一致
3. **专业感**: 提升整体UI质感
4. **信息密度**: 在不增加空间的情况下提供更多信息

### 交互逻辑
```
查看模式:
  有负责人 → [头像] 李老师
  无负责人 → 未分配

编辑模式:
  下拉选择框 → 选择负责人
```

## 📊 对比

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 显示内容 | 仅姓名 | 头像+姓名 |
| 视觉识别 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 信息密度 | 低 | 中 |
| UI一致性 | 一般 | 优秀 |

## 🔗 相关代码

### Mentor类型定义
```typescript
interface Mentor {
  id: number;
  name: string;
  avatar_url?: string;
  // ... 其他字段
}
```

### 数据来源
- `mentors` 数组从 `mentorService.getAllMentors()` 获取
- 在组件 `useEffect` 中加载

## 📝 注意事项

1. **性能**: 使用 `find()` 查找mentor,数量不多时性能可接受
2. **容错**: 头像加载失败时有降级方案
3. **无障碍**: 添加了适当的 `alt` 属性
4. **响应式**: 使用 `flex-shrink-0` 确保头像不被压缩

---

**更新日期**: 2025-01-22  
**状态**: ✅ 已完成

