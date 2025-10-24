# 🔧 路由问题已修复

## 问题描述
用户反馈学校详情和专业详情页面打不开。

## 问题原因
路由配置中缺少以下页面的路由定义:
- 学校详情页 (SchoolDetailPage)
- 专业详情页 (ProgramDetailPage)
- 选校页面 (SchoolSelectionPage)

## 修复内容

### 1. 添加路由导入 (`src/AppRoutes.tsx`)

```typescript
import SchoolDetailPage from './pages/admin/SchoolDetailPage';
import SchoolSelectionPage from './pages/admin/SchoolSelectionPage';
import ProgramDetailPage from './pages/admin/ProgramDetailPage';
```

### 2. 添加路由配置

为了兼容新旧链接格式,添加了以下路由:

```typescript
// 学校详情 - 兼容两种路径格式
<Route path="school/:schoolId" element={<SchoolDetailPage />} />
<Route path="school-detail/:schoolId" element={<SchoolDetailPage />} />

// 专业详情 - 兼容两种路径格式
<Route path="program/:programId" element={<ProgramDetailPage />} />
<Route path="program-detail/:programId" element={<ProgramDetailPage />} />

// 选校页面
<Route path="school-selection" element={<SchoolSelectionPage />} />
```

### 3. 确认链接路径

SchoolCard组件中的链接使用正确的路径:
- 学校详情: `/admin/school-detail/${school.id}`
- 专业详情: `/admin/program-detail/${program.id}`

## 支持的路由路径

### 学校详情页
✅ `/admin/school/:schoolId` (新格式)  
✅ `/admin/school-detail/:schoolId` (原格式)

### 专业详情页
✅ `/admin/program/:programId` (新格式)  
✅ `/admin/program-detail/:programId` (原格式)

### 选校页面
✅ `/admin/school-selection`

## 测试清单

- [ ] 点击学校卡片"详情"按钮能正常打开学校详情页
- [ ] 点击专业列表中的专业能正常打开专业详情页
- [ ] 学校详情页能正常显示学校信息
- [ ] 专业详情页能正常显示专业信息
- [ ] 选校页面能正常访问

## 相关文件

- `src/AppRoutes.tsx` - 路由配置文件
- `src/pages/admin/SchoolDetailPage.tsx` - 学校详情页
- `src/pages/admin/ProgramDetailPage.tsx` - 专业详情页
- `src/pages/admin/SchoolSelectionPage.tsx` - 选校页面
- `src/pages/admin/SchoolLibrary/components/SchoolCard.tsx` - 学校卡片组件

## 验证方法

1. 访问选校助手: `http://localhost:5174/admin/school-assistant`
2. 找到任意学校卡片
3. 点击"详情"按钮 → 应该打开学校详情页
4. 点击"专业"按钮展开专业列表
5. 点击任意专业 → 应该打开专业详情页

---

**修复时间**: 2025-10-23  
**修复状态**: ✅ 完成  
**Lint 错误**: ✅ 无错误  

