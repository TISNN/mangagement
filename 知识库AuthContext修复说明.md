# 知识库 AuthContext 修复说明

## 问题描述
知识库模块在访问时出现错误：
```
Error: useAuth必须在AuthProvider内部使用
```

## 根本原因
自定义 Hooks（`useKnowledgeData`, `useKnowledgeOperations`, `useKnowledgeComments`）内部直接调用了 `useAuth()`，导致在某些情况下这些 hooks 可能在 `AuthProvider` 之外被调用。

## 解决方案
将 `useAuth` 的调用移到主组件中，然后将用户信息作为参数传递给自定义 hooks。

## 修改的文件

### 1. `useKnowledgeData.ts`
**之前:**
```tsx
export function useKnowledgeData() {
  const { profile: currentUser } = useAuth();
  // ...
}
```

**之后:**
```tsx
export function useKnowledgeData(userId?: number) {
  // userId 作为参数传入
  // ...
}
```

### 2. `useKnowledgeOperations.ts`
**之前:**
```tsx
export function useKnowledgeOperations() {
  const { profile: currentUser } = useAuth();
  // ...
}
```

**之后:**
```tsx
export function useKnowledgeOperations(userId?: number, userName?: string) {
  // userId 和 userName 作为参数传入
  // ...
}
```

### 3. `useKnowledgeComments.ts`
**之前:**
```tsx
export function useKnowledgeComments(resourceId: number) {
  const { profile: currentUser } = useAuth();
  // ...
}
```

**之后:**
```tsx
export function useKnowledgeComments(
  resourceId: number, 
  userId?: number, 
  userName?: string, 
  userAvatar?: string
) {
  // 用户信息作为参数传入
  // ...
}
```

### 4. `KnowledgeBase/index.tsx` (主页面)
**添加:**
```tsx
import { useAuth } from '../../../context/AuthContext';

function KnowledgeBase() {
  // 在主组件中调用 useAuth
  const { profile } = useAuth();
  const currentUser = profile as any;

  // 传递用户信息给 hooks
  const { resources, ... } = useKnowledgeData(currentUser?.id);
  const { handleViewResource, ... } = useKnowledgeOperations(
    currentUser?.id, 
    currentUser?.name
  );
}
```

### 5. `ResourceDetailPage/index.tsx` (详情页)
**添加:**
```tsx
const { profile } = useAuth();
const currentUser = profile as any;

// 传递用户信息给 hooks
const { comments, ... } = useKnowledgeComments(
  resourceId, 
  currentUser?.id, 
  currentUser?.name, 
  currentUser?.avatar_url
);
const { handleToggleBookmark, ... } = useKnowledgeOperations(
  currentUser?.id, 
  currentUser?.name
);
```

## 额外修复
同时修复了 Supabase 客户端导入路径：
```tsx
// 之前
import { supabase } from '../lib/supabaseClient';

// 之后
import { supabase } from '../lib/supabase';
```

## 测试验证
- ✅ 页面可以正常加载
- ✅ 不再出现 "useAuth必须在AuthProvider内部使用" 错误
- ✅ 所有 linter 错误已修复
- ✅ 用户登录后可以正常使用收藏、评论等功能
- ✅ 未登录用户可以浏览资源（但无法收藏/评论）

## 设计优势
1. **更好的关注点分离**: Hooks 不再关心认证逻辑
2. **更灵活**: Hooks 可以在任何地方使用，不依赖 AuthContext
3. **更易测试**: 可以直接传入测试数据，无需 mock AuthContext
4. **更明确**: 函数签名清楚地显示了所需的依赖

## 状态
✅ **已完成并验证**

刷新页面即可正常使用知识库功能！

