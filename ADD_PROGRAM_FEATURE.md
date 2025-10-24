# 添加专业功能实现说明

## 📅 实现时间
2025-10-24

---

## ✅ 功能概述

实现了一个完整的添加专业功能,允许管理员通过表单界面添加新专业到数据库,并支持关联到已存在的学校。

---

## 🎯 核心特性

### 主要功能
- ✅ **学校关联**: 从数据库拉取学校列表供选择
- ✅ **智能搜索**: 支持按学校名称/国家搜索
- ✅ **完整字段**: 支持programs表所有20个字段
- ✅ **外键关联**: 自动关联到schools表的id
- ✅ **实时验证**: 必填字段验证
- ✅ **标签管理**: 动态添加/删除标签
- ✅ **自动提示**: 下拉列表实时过滤

### 用户体验
- ✅ 学校搜索下拉框
- ✅ 已选学校卡片展示
- ✅ 字段分组展示
- ✅ 成功/错误提示
- ✅ 自动跳转
- ✅ 深色模式支持

---

## 📂 文件结构

### 新增文件
```
src/pages/admin/AddProgramPage.tsx  - 添加专业页面(完整表单)
ADD_PROGRAM_FEATURE.md             - 功能说明文档
```

### 修改文件
```
src/AppRoutes.tsx                  - 添加路由配置
src/pages/admin/ProgramLibraryPage.tsx  - 添加"添加专业"按钮
```

---

## 🔗 数据库关系

### programs表结构
```sql
CREATE TABLE programs (
  id integer PRIMARY KEY,
  school_id integer NOT NULL REFERENCES schools(id),  -- 外键关联
  en_name text NOT NULL,
  cn_name text,
  degree text,
  category text,
  faculty text,
  duration text,
  entry_month text,
  tuition_fee text,
  language_requirements text,
  apply_requirements text,
  curriculum text,
  objectives text,
  analysis text,
  interview text,
  url text,
  tags text[],
  career text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### 关联关系
```
schools (学校表)
   ↓ 一对多
programs (专业表)
   ↑
school_id 外键
```

---

## 📝 表单字段说明

### 1. 选择学校 (必填) ⭐

| 功能 | 说明 |
|------|------|
| **数据来源** | 从schools表实时加载 |
| **搜索功能** | 支持按英文名、中文名、国家搜索 |
| **显示格式** | 中文名(英文名) · 国家 |
| **选择方式** | 下拉列表点击选择 |
| **已选显示** | 蓝色卡片,可点击X取消 |

### 2. 基本信息

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `en_name` | text | ✅ | 英文名称 | Master of Science in Computer Science |
| `cn_name` | text | ❌ | 中文名称 | 计算机科学硕士 |
| `degree` | text | ❌ | 学位类型 | 本科/硕士/博士/MBA/预科 |
| `category` | text | ❌ | 专业类别 | 商科/工科/理科/社科/文科/艺术/医学/法律 |
| `faculty` | text | ❌ | 所属学院 | 工程学院, 商学院 |
| `duration` | text | ❌ | 学制 | 1年/1.5年/2年/3年/4年/5年 |
| `entry_month` | text | ❌ | 入学月份 | 9月, 1月, 9月/1月 |
| `tuition_fee` | text | ❌ | 学费 | 30000英镑/年 |

### 3. 申请要求

| 字段 | 类型 | 行数 | 说明 |
|------|------|------|------|
| `language_requirements` | text | 2行 | 语言要求 |
| `apply_requirements` | text | 3行 | 申请要求 |
| `interview` | text | 2行 | 面试要求 |

### 4. 项目详情

| 字段 | 类型 | 行数 | 说明 |
|------|------|------|------|
| `curriculum` | text | 4行 | 课程设置 |
| `objectives` | text | 3行 | 培养目标 |
| `analysis` | text | 3行 | 项目分析 |
| `career` | text | 3行 | 职业发展 |

### 5. 其他信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `url` | text | 项目链接 |
| `tags` | text[] | 标签数组 |

---

## 🎨 UI界面设计

### 学校选择界面

#### 未选择状态
```
┌─────────────────────────────────────┐
│ 🔍 [搜索学校名称或国家...         ] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 剑桥大学                         │ │
│ │ University of Cambridge · 英国   │ │
│ ├─────────────────────────────────┤ │
│ │ 牛津大学                         │ │
│ │ University of Oxford · 英国      │ │
│ ├─────────────────────────────────┤ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 提示: 共有 175 所学校可选择      │
└─────────────────────────────────────┘
```

#### 已选择状态
```
┌─────────────────────────────────────┐
│ ┌───────────────────────────────┬─┐ │
│ │ 剑桥大学                       │X│ │
│ │ University of Cambridge · 英国 │ │ │
│ └───────────────────────────────┴─┘ │
│                                     │
│ 💡 提示: 共有 175 所学校可选择      │
└─────────────────────────────────────┘
```

### 完整表单结构
```
┌─────────────────────────────────────┐
│ [←] 添加专业                        │
│     填写专业信息并保存到数据库       │
└─────────────────────────────────────┘
│                                     │
│ [✓ 成功提示] / [✗ 错误提示]        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 选择学校*                     │ │
│ │   [学校搜索/选择界面]            │ │
│ │                                  │ │
│ │ 📝 基本信息                      │ │
│ │   英文名称* [         ]          │ │
│ │   中文名称  [         ]          │ │
│ │   学位类型  [▼ 硕士  ]          │ │
│ │   专业类别  [▼ 工科  ]          │ │
│ │   所属学院  [         ]          │ │
│ │   学制      [▼ 1年   ]          │ │
│ │   入学月份  [         ]          │ │
│ │   学费      [         ]          │ │
│ │                                  │ │
│ │ 📋 申请要求                      │ │
│ │   语言要求  [         ]          │ │
│ │   申请要求  [         ]          │ │
│ │   面试要求  [         ]          │ │
│ │                                  │ │
│ │ 📚 项目详情                      │ │
│ │   课程设置  [         ]          │ │
│ │   培养目标  [         ]          │ │
│ │   项目分析  [         ]          │ │
│ │   职业发展  [         ]          │ │
│ │                                  │ │
│ │ 🔗 其他信息                      │ │
│ │   项目链接  [         ]          │ │
│ │   标签      [tag1] [tag2] ...    │ │
│ │                                  │ │
│ │   [保存专业] [重置] [取消]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔄 使用流程

### 添加专业完整流程
```
1. 访问专业库页面
   ↓
2. 点击右上角"添加专业"按钮
   ↓
3. 系统加载学校列表
   ↓
4. 搜索并选择学校
   ↓
5. 填写专业信息
   - 英文名称(必填)
   - 其他可选字段
   ↓
6. 点击"保存专业"
   ↓
7. 系统验证:
   - school_id必填
   - en_name必填
   ↓
8. 插入数据库
   - 自动关联到schools表
   - 生成唯一ID
   ↓
9. 显示成功提示
   ↓
10. 2秒后自动跳转
   ↓
11. 返回专业库
   ↓
12. 新专业立即可见
```

---

## 💻 核心代码实现

### 1. 加载学校列表
```typescript
useEffect(() => {
  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, en_name, cn_name, country')
        .order('en_name', { ascending: true });

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('加载学校列表失败:', err);
    }
  };

  loadSchools();
}, []);
```

### 2. 学校搜索过滤
```typescript
const filteredSchools = schools.filter(school => {
  const query = schoolSearchQuery.toLowerCase();
  return (
    school.en_name.toLowerCase().includes(query) ||
    (school.cn_name && school.cn_name.toLowerCase().includes(query)) ||
    school.country.toLowerCase().includes(query)
  );
});
```

### 3. 选择学校
```typescript
const handleSelectSchool = (school: School) => {
  setFormData(prev => ({
    ...prev,
    school_id: school.id  // 设置外键
  }));
  setSchoolSearchQuery('');
  setShowSchoolDropdown(false);
};
```

### 4. 数据库插入
```typescript
const dataToInsert = {
  school_id: formData.school_id,  // 外键
  en_name: formData.en_name.trim(),
  cn_name: formData.cn_name.trim() || null,
  // ... 其他字段
};

const { data, error } = await supabase
  .from('programs')
  .insert([dataToInsert])
  .select();
```

---

## 🎯 使用示例

### 示例1: 添加剑桥大学计算机硕士
```javascript
{
  school_id: 1,  // 剑桥大学的ID
  en_name: "Master of Science in Computer Science",
  cn_name: "计算机科学硕士",
  degree: "硕士",
  category: "工科",
  faculty: "计算机学院",
  duration: "1年",
  entry_month: "9月",
  tuition_fee: "35000英镑/年",
  language_requirements: "雅思7.0(单项不低于6.5)",
  apply_requirements: "本科计算机相关专业,GPA 3.5+",
  tags: ["STEM", "热门专业", "就业率高"]
}
```

**操作步骤**:
1. 搜索"剑桥"或"Cambridge"
2. 点击选择"剑桥大学"
3. 填写专业英文名称
4. 选择学位类型: 硕士
5. 选择专业类别: 工科
6. 填写其他信息
7. 添加标签
8. 点击保存

---

## 🔍 表单验证

### 必填字段验证
```typescript
if (!formData.school_id) {
  setError('请选择所属学校');
  return false;
}
if (!formData.en_name.trim()) {
  setError('请输入专业英文名称');
  return false;
}
```

### 验证规则
1. **学校选择**: 必须选择一所学校
2. **英文名称**: 不能为空
3. **URL字段**: 如果填写,应该是有效URL格式
4. **其他字段**: 都是可选的

---

## 🎨 样式特性

### 学校选择样式
```css
/* 搜索框 */
pl-10 pr-4 py-3          /* 左侧为图标留空间 */
focus:ring-2 focus:ring-blue-500

/* 下拉列表 */
max-h-60 overflow-y-auto  /* 最大高度,滚动 */
hover:bg-gray-50          /* 悬停效果 */

/* 已选学校卡片 */
bg-blue-50                /* 蓝色背景 */
border-blue-200           /* 蓝色边框 */
```

### 字段分组配色
```css
基本信息: 默认配色
申请要求: 默认配色
项目详情: 默认配色
其他信息: 默认配色
```

---

## 📊 数据流向

### 学校数据流
```
Supabase schools表
    ↓
SELECT id, en_name, cn_name, country
    ↓
前端schools数组
    ↓
搜索过滤
    ↓
下拉列表展示
    ↓
用户选择
    ↓
formData.school_id = school.id
```

### 专业数据流
```
用户填写表单
    ↓
formData对象
    ↓
表单验证
    ↓
数据准备(trim, null处理)
    ↓
INSERT INTO programs
    ↓
外键关联到schools(school_id)
    ↓
生成新记录(id, created_at, updated_at)
    ↓
返回到专业库
```

---

## 🔗 外键关联说明

### 关联机制
```sql
-- programs表的school_id字段
school_id integer NOT NULL REFERENCES schools(id)

-- 插入时自动验证
INSERT INTO programs (school_id, en_name, ...)
VALUES (1, 'MSc Computer Science', ...)

-- 数据库会检查:
-- 1. school_id不能为null
-- 2. schools表中必须存在id=1的记录
-- 3. 如果不存在,插入失败
```

### 数据完整性
```
✅ 保证每个专业都属于一所存在的学校
✅ 删除学校时可以设置级联删除/限制
✅ 查询时可以JOIN获取学校信息
```

---

## 🎯 下拉选项配置

### 学位类型
```typescript
['本科', '硕士', '博士', 'MBA', '预科']
```

### 专业类别
```typescript
['商科', '工科', '理科', '社科', '文科', '艺术', '医学', '法律']
```

### 学制
```typescript
['1年', '1.5年', '2年', '3年', '4年', '5年']
```

---

## 🔔 使用提示

### 学校选择技巧
1. **按中文名搜索**: 输入"剑桥"
2. **按英文名搜索**: 输入"Cambridge"
3. **按国家搜索**: 输入"英国"或"UK"
4. **清空搜索**: 删除搜索框内容查看所有学校
5. **取消选择**: 点击已选学校卡片的X图标

### 表单填写建议
1. **英文名称**: 使用学校官网的正式名称
2. **学费**: 包含单位和周期,如"30000英镑/年"
3. **入学月份**: 多个入学季用"/"分隔,如"9月/1月"
4. **标签**: 使用简短关键词,如"STEM"、"热门"
5. **链接**: 使用学校官网的专业详情页链接

---

## ⚠️ 注意事项

### 必须先有学校
- 添加专业前,确保学校已存在于schools表
- 如果找不到学校,先去"添加学校"页面添加

### 外键约束
- school_id必须是schools表中存在的id
- 数据库会自动验证,不存在会报错

### 数据实时性
- 缓存已禁用,新添加的专业立即可见
- 学校列表实时从数据库加载

---

## 📈 后续优化建议

### 功能增强
1. **批量导入**: CSV/Excel批量导入专业
2. **复制专业**: 基于现有专业创建相似专业
3. **模板功能**: 保存常用的表单模板
4. **关联建议**: 根据学校推荐专业类别
5. **数据验证**: 更严格的URL、学费格式验证

### UI优化
1. **步骤向导**: 分步骤填写表单
2. **自动保存**: 定时保存草稿
3. **智能提示**: 基于历史数据的自动建议
4. **预览模式**: 提交前预览最终效果
5. **快速填充**: 快速选择常见值

### 数据增强
1. **学校信息预览**: 选择学校时显示详细信息
2. **同校专业查看**: 显示该学校已有的专业
3. **重复检测**: 检测是否已存在相同专业
4. **数据补全**: 根据学校自动填充部分信息

---

## ✅ 测试清单

- [x] 页面正常访问
- [x] 学校列表加载
- [x] 学校搜索功能
- [x] 学校选择功能
- [x] 必填字段验证
- [x] 数据库插入成功
- [x] 外键关联正确
- [x] 成功提示显示
- [x] 自动跳转功能
- [x] 错误提示显示
- [x] 表单重置功能
- [x] 标签添加/删除
- [x] 深色模式适配
- [x] 响应式布局

---

## 🎉 总结

### 实现的功能
1. ✅ 完整的添加专业表单
2. ✅ 学校关联(外键)
3. ✅ 学校搜索和选择
4. ✅ 所有数据库字段支持
5. ✅ 表单验证和错误处理
6. ✅ 数据库自动插入
7. ✅ 成功提示和自动跳转
8. ✅ 专业库入口按钮

### 核心特色
- ✅ **智能学校选择**: 搜索+下拉列表
- ✅ **外键关联**: 自动关联到schools表
- ✅ **完整字段**: 支持programs表全部字段
- ✅ **用户友好**: 清晰的界面和提示

### 数据库关系
```
schools.id (主键)
    ↓ 一对多
programs.school_id (外键)
```

**现在可以通过专业库页面的"添加专业"按钮来添加新专业了!** 🎊

**访问路径**: 专业库 → 添加专业按钮 → 选择学校 → 填写表单 → 保存

