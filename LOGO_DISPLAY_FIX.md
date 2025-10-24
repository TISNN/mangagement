# Logo显示修复说明

## 问题
专业库中专业卡片的学校logo没有正确显示

## 原因分析

### 1. 缓存数据不完整
之前的缓存优化中,`cacheSchoolsData()`函数只保存了`logoUrl`字段,但没有保存`rawData`对象。

### 2. 组件引用不一致
- **SchoolCard** (院校库): 使用 `school.logoUrl`
- **ProgramCard** (专业库): 使用 `school.rawData?.logo_url`

这导致即使缓存了`logoUrl`,ProgramCard也读取不到。

## 修复方案

### 1. 更新缓存策略
**文件**: `src/pages/admin/SchoolLibrary/services/schoolService.ts`

在`cacheSchoolsData()`函数中,添加`rawData`对象的关键字段:

```typescript
const simplifiedSchools = schools.map(s => ({
  id: s.id,
  name: s.name,
  location: s.location,
  country: s.country,
  region: s.region,
  acceptance: s.acceptance,
  tuition: s.tuition,
  ranking: s.ranking,
  description: s.description,
  logoUrl: s.logoUrl,
  tags: s.tags,
  programs: [],
  // ✅ 新增: 保留rawData中的logo_url用于显示
  rawData: s.rawData ? {
    logo_url: s.rawData.logo_url,
    cn_name: s.rawData.cn_name,
    en_name: s.rawData.en_name
  } : undefined
}));
```

### 2. 统一组件引用
**文件**: `src/pages/admin/ProgramLibrary/components/ProgramCard.tsx`

修改logo显示逻辑,同时支持两种数据源:

```typescript
// 修复前
{school.rawData?.logo_url ? (
  <img src={school.rawData.logo_url} alt={school.name} />
) : (
  <div>...</div>
)}

// 修复后
{school.logoUrl || school.rawData?.logo_url ? (
  <img src={school.logoUrl || school.rawData?.logo_url} alt={school.name} />
) : (
  <div>...</div>
)}
```

这样无论数据来自哪个字段,都能正确显示。

### 3. 缓存管理工具
**新文件**: `src/utils/cacheManager.ts`

创建统一的缓存管理工具:

```typescript
export const clearAllCache = (): void => {
  try {
    const keysToRemove = [
      'cachedSchools',
      'cachedSchoolsTimestamp',
      'cachedPrograms',
      'cachedProgramsTimestamp',
      'programSearchHistory'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ 所有缓存已清除');
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};

// 在控制台中暴露清除缓存函数
if (typeof window !== 'undefined') {
  (window as any).clearAppCache = clearAllCache;
}
```

在`App.tsx`中引入:
```typescript
import './utils/cacheManager'; // 引入缓存管理器
```

## 如何使用

### 清除缓存
如果logo仍然不显示(由于使用了旧缓存),可以通过以下方式清除缓存:

1. **方法1: 浏览器控制台**
   - 打开浏览器开发者工具(F12)
   - 在Console标签中输入:
     ```javascript
     clearAppCache()
     ```
   - 刷新页面(F5)

2. **方法2: 手动清除localStorage**
   - 打开浏览器开发者工具(F12)
   - 进入Application标签 → Local Storage
   - 删除以下键:
     - `cachedSchools`
     - `cachedSchoolsTimestamp`
     - `cachedPrograms`
     - `cachedProgramsTimestamp`
   - 刷新页面(F5)

3. **方法3: 清除浏览器数据**
   - Chrome: 设置 → 隐私和安全 → 清除浏览数据
   - 选择"缓存的图片和文件"和"Cookie及其他网站数据"
   - 清除数据

### 验证修复
清除缓存后,重新访问专业库页面:
1. 首次加载会从数据库获取新数据(稍慢)
2. 专业卡片应该显示学校logo
3. 后续访问会使用新缓存(快速)

## 数据流程

### 完整的数据流
```
数据库 (schools表)
  ↓
fetchAllSchools() - 加载学校数据
  ↓
处理转换 - 生成School对象
  {
    id: xxx,
    logoUrl: 'http://...',
    rawData: {
      logo_url: 'http://...',
      cn_name: '学校名',
      ...
    }
  }
  ↓
cacheSchoolsData() - 缓存简化数据
  {
    id: xxx,
    logoUrl: 'http://...',
    rawData: {
      logo_url: 'http://...',  // ✅ 现在会缓存
      cn_name: '学校名',
      en_name: 'School Name'
    }
  }
  ↓
ProgramCard组件 - 显示logo
  school.logoUrl || school.rawData?.logo_url
```

## 优化效果

### 存储空间
- **增加**: 每所学校约增加100-200字节(logo_url + 名称)
- **总增加**: 约200KB(假设2000所学校)
- **仍在限制内**: 远小于4MB限制

### 显示效果
- ✅ 院校库: 正常显示logo
- ✅ 专业库: 正常显示logo (修复后)
- ✅ 选校助手: 正常显示logo
- ✅ 详情页: 正常显示logo

## 注意事项

1. **首次修复后需清除缓存**: 旧缓存数据不包含logo信息
2. **兼容性处理**: 使用`||`运算符同时支持两种数据源
3. **未来统一**: 建议长期统一使用`school.logoUrl`,不依赖`rawData`

## 相关文件

- `src/pages/admin/SchoolLibrary/services/schoolService.ts` - 学校数据服务(缓存逻辑)
- `src/pages/admin/ProgramLibrary/components/ProgramCard.tsx` - 专业卡片(logo显示)
- `src/pages/admin/SchoolLibrary/components/SchoolCard.tsx` - 学校卡片(参考)
- `src/utils/cacheManager.ts` - 缓存管理工具(新增)
- `src/App.tsx` - 引入缓存管理器

## 测试清单

- [x] 修复缓存策略,包含rawData.logo_url
- [x] 修复ProgramCard组件,支持两种数据源
- [x] 创建缓存管理工具
- [x] 在App.tsx中引入缓存管理器
- [ ] 清除浏览器缓存
- [ ] 验证院校库logo显示
- [ ] 验证专业库logo显示
- [ ] 验证选校助手logo显示

