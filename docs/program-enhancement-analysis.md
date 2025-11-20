# 专业信息完善方案分析

> 基于 NUS 可持续与绿色金融硕士项目文档的分析，提出专业库数据结构和前端展示的完善方案

---

## 📊 一、现状分析

### 1.1 现有数据库字段（programs表）

根据当前数据库结构，`programs` 表包含以下字段：

| 字段名 | 类型 | 说明 | 状态 |
|--------|------|------|------|
| `id` | integer | 主键 | ✅ |
| `school_id` | integer | 学校ID | ✅ |
| `en_name` | text | 英文名称 | ✅ |
| `cn_name` | text | 中文名称 | ✅ |
| `degree` | text | 学位类型 | ✅ |
| `category` | text | 专业类别 | ✅ |
| `faculty` | text | 所属学院 | ✅ |
| `duration` | text | 学制 | ✅ |
| `entry_month` | text | 入学月份 | ✅ |
| `tuition_fee` | text | 学费 | ✅ |
| `language_requirements` | text | 语言要求 | ✅ |
| `apply_requirements` | text | 申请要求 | ✅ |
| `curriculum` | text | 课程设置 | ✅ |
| `objectives` | text | 培养目标 | ✅ |
| `analysis` | text | 项目分析 | ✅ |
| `interview` | text | 面试要求 | ✅ |
| `url` | text | 项目链接 | ✅ |
| `tags` | text[] | 标签 | ✅ |
| `career` | text | 职业发展 | ✅ |

### 1.2 现有前端展示字段（Program类型）

```typescript
interface Program {
  id: string;
  school_id: string;
  cn_name?: string;
  en_name: string;
  name?: string;
  degree: string;
  duration: string;
  tuition_fee: string;
  faculty: string;
  category: string;
  subCategory: string;
  tags?: string[];
  apply_requirements: string;
  language_requirements: string;
  curriculum: string;
  analysis: string;
  url: string;
  interview: string;
  objectives: string;
  rawData?: Record<string, unknown>;
}
```

---

## 🔍 二、文档内容分析（基于NUS GF示例）

### 2.1 文档包含的信息维度

#### ✅ 已有字段可覆盖的内容
1. **基本信息**：项目名称、院系、学制、学费 → 已有对应字段
2. **培养目标**：`objectives` 字段可覆盖
3. **课程设置**：`curriculum` 字段可覆盖（但需要结构化）
4. **申请要求**：`apply_requirements` 字段可覆盖（但需要结构化）
5. **语言要求**：`language_requirements` 字段可覆盖
6. **面试信息**：`interview` 字段可覆盖
7. **职业发展**：`career` 字段可覆盖

#### ❌ 缺失的关键信息

**1. 项目基本信息扩展**
- ❌ **学分要求**（如：普通路径40学分，含实习44学分）
- ❌ **授课方式**（如：密集型授课、在线/线下）
- ❌ **学习模式**（全日制/兼职，如：全日制12个月，兼职21个月）
- ❌ **项目定位**（核心定位描述，区别于培养目标）

**2. 课程结构详细信息**
- ❌ **入学前预备课**（具体课程列表和内容）
- ❌ **核心课程列表**（结构化数据，每门课程4学分）
- ❌ **选修课程列表**（结构化数据，每门课程4学分）
- ❌ **体验式学习模块**（Capstone项目、实习等）

**3. 申请相关信息**
- ❌ **申请时间线**（开放时间、截止时间、结果发放时间）
- ❌ **申请材料清单**（结构化列表：简历、成绩单、动机信等）
- ❌ **奖学金信息**（奖学金类型、申请截止时间）

**4. 就业相关信息**
- ❌ **就业行业列表**（咨询、金融服务、公共部门等）
- ❌ **典型岗位职能**（FPA分析师、投资组合经理等）
- ❌ **就业数据**（就业率、平均薪资等）

**5. 学习体验特色**
- ❌ **项目特色**（与SGFIN合作、行业讲座、研究资源等）
- ❌ **学习资源**（数据库权限、研究机构资源等）

**6. 面试相关信息**
- ❌ **面试常见问题**（结构化列表）
- ❌ **面试准备建议**

**7. 申请指导信息**
- ❌ **简历撰写要点**（项目特定要求）
- ❌ **PS/SOP写作要点**（项目特定要求）

---

## 📋 三、完善方案

### 3.1 数据库字段扩展建议

#### 方案A：最小改动（推荐用于快速实现）

在现有字段基础上，使用JSONB字段存储结构化数据：

```sql
-- 新增字段
ALTER TABLE programs ADD COLUMN IF NOT EXISTS credit_requirements TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS teaching_mode TEXT; -- 授课方式
ALTER TABLE programs ADD COLUMN IF NOT EXISTS study_mode TEXT; -- 全日制/兼职
ALTER TABLE programs ADD COLUMN IF NOT EXISTS program_positioning TEXT; -- 项目定位
ALTER TABLE programs ADD COLUMN IF NOT EXISTS course_structure JSONB; -- 课程结构（结构化）
ALTER TABLE programs ADD COLUMN IF NOT EXISTS application_timeline JSONB; -- 申请时间线
ALTER TABLE programs ADD COLUMN IF NOT EXISTS application_materials JSONB; -- 申请材料清单
ALTER TABLE programs ADD COLUMN IF NOT EXISTS career_info JSONB; -- 就业信息（结构化）
ALTER TABLE programs ADD COLUMN IF NOT EXISTS program_features JSONB; -- 项目特色
ALTER TABLE programs ADD COLUMN IF NOT EXISTS interview_guide JSONB; -- 面试指导
ALTER TABLE programs ADD COLUMN IF NOT EXISTS application_guide JSONB; -- 申请指导
```

#### 方案B：完整扩展（推荐用于长期维护）

创建关联表存储详细结构化信息：

```sql
-- 课程结构表
CREATE TABLE program_courses (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id),
  course_type TEXT, -- 'preparatory' | 'core' | 'elective' | 'experiential'
  course_name TEXT,
  course_name_cn TEXT,
  credits INTEGER,
  description TEXT,
  learning_outcomes TEXT[],
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 申请时间线表
CREATE TABLE program_application_timeline (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id),
  event_name TEXT, -- '开放申请' | '第一轮截止' | '最终截止' | '结果发放'
  event_date DATE,
  description TEXT,
  is_scholarship_deadline BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 申请材料表
CREATE TABLE program_application_materials (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id),
  material_name TEXT, -- '简历' | '成绩单' | '动机信' | '推荐信'
  material_name_en TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  description TEXT,
  format_requirements TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 就业信息表
CREATE TABLE program_career_info (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id),
  industry TEXT, -- 就业行业
  job_titles TEXT[], -- 典型岗位
  employment_rate DECIMAL(5,2), -- 就业率
  avg_salary TEXT, -- 平均薪资
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 TypeScript类型定义扩展

```typescript
// 扩展后的Program接口
export interface Program {
  // ... 现有字段 ...
  
  // 新增字段
  credit_requirements?: string; // 学分要求
  teaching_mode?: string; // 授课方式
  study_mode?: string; // 学习模式（全日制/兼职）
  program_positioning?: string; // 项目定位
  
  // JSONB结构化字段
  course_structure?: {
    preparatory_courses?: CourseInfo[]; // 入学前预备课
    core_courses?: CourseInfo[]; // 核心课程
    elective_courses?: CourseInfo[]; // 选修课程
    experiential_learning?: ExperientialLearningInfo[]; // 体验式学习
  };
  
  application_timeline?: ApplicationTimelineEvent[]; // 申请时间线
  application_materials?: ApplicationMaterial[]; // 申请材料清单
  career_info?: {
    industries?: string[]; // 就业行业
    job_titles?: string[]; // 典型岗位
    employment_rate?: number; // 就业率
    avg_salary?: string; // 平均薪资
  };
  program_features?: string[]; // 项目特色
  interview_guide?: {
    common_questions?: string[]; // 常见问题
    preparation_tips?: string; // 准备建议
  };
  application_guide?: {
    resume_tips?: string; // 简历要点
    ps_tips?: string; // PS写作要点
  };
}

// 辅助类型定义
interface CourseInfo {
  name: string;
  name_cn?: string;
  credits?: number;
  description?: string;
  learning_outcomes?: string[];
}

interface ExperientialLearningInfo {
  type: 'capstone' | 'internship' | 'research' | 'other';
  name: string;
  credits?: number;
  description?: string;
}

interface ApplicationTimelineEvent {
  event_name: string;
  event_date: string; // ISO date string
  description?: string;
  is_scholarship_deadline?: boolean;
}

interface ApplicationMaterial {
  name: string;
  name_en?: string;
  is_required: boolean;
  description?: string;
  format_requirements?: string;
}
```

---

## 🎨 四、前端展示完善方案

### 4.1 专业详情页面结构优化

#### 当前展示结构：
```
1. 顶部大图 + 基本信息
2. 学校信息卡片
3. 专业基本信息卡片
4. 培养目标卡片
5. 课程设置卡片
6. 申请要求卡片
7. 语言要求卡片
8. 专业分析卡片
```

#### 建议优化后的结构：

```
1. 顶部大图 + 基本信息
   - 项目名称、学位类型、学制
   - 学习模式（全日制/兼职）
   - 学分要求
   - 授课方式

2. 学校信息卡片（保持）

3. 项目定位与特色
   - 核心定位
   - 项目特色列表
   - 学习体验特色

4. 专业基本信息卡片（扩展）
   - 学位类型、学制、学习模式
   - 学分要求、授课方式
   - 学费、入学月份

5. 课程结构（结构化展示）
   - 入学前预备课（可折叠）
   - 核心课程列表（每门课程详情）
   - 选修课程列表（每门课程详情）
   - 体验式学习模块

6. 培养目标卡片（保持）

7. 申请信息（结构化展示）
   - 申请时间线（时间轴展示）
   - 申请材料清单（列表展示）
   - 申请要求（文本）
   - 语言要求（文本）
   - 奖学金信息（如有）

8. 面试信息（扩展）
   - 面试要求
   - 常见问题列表
   - 准备建议

9. 就业信息（新增）
   - 就业行业列表
   - 典型岗位职能
   - 就业数据（如有）

10. 申请指导（新增）
    - 简历撰写要点
    - PS/SOP写作要点

11. 专业分析卡片（保持）
```

### 4.2 新增组件建议

1. **CourseStructureCard** - 课程结构卡片
   - 支持折叠展开
   - 展示课程列表、学分、描述

2. **ApplicationTimelineCard** - 申请时间线卡片
   - 时间轴可视化
   - 标记奖学金截止日期

3. **ApplicationMaterialsCard** - 申请材料卡片
   - 列表展示
   - 标记必填/可选

4. **CareerInfoCard** - 就业信息卡片
   - 行业标签
   - 岗位列表
   - 数据可视化

5. **InterviewGuideCard** - 面试指导卡片
   - 常见问题列表
   - 准备建议

6. **ApplicationGuideCard** - 申请指导卡片
   - 简历要点
   - PS写作要点

---

## 📝 五、实施优先级

### 高优先级（核心功能）
1. ✅ **学分要求** - 基本信息，用户关注度高
2. ✅ **学习模式**（全日制/兼职）- 基本信息
3. ✅ **课程结构结构化** - 核心内容，需要详细展示
4. ✅ **申请时间线** - 申请必需信息
5. ✅ **申请材料清单** - 申请必需信息

### 中优先级（增强体验）
6. ⚠️ **项目定位** - 帮助用户理解项目特色
7. ⚠️ **就业信息结构化** - 帮助用户了解就业前景
8. ⚠️ **面试指导** - 提升申请成功率

### 低优先级（增值服务）
9. ⚪ **申请指导**（简历、PS要点）- 增值内容
10. ⚪ **项目特色** - 差异化展示

---

## 🔧 六、实施步骤建议

### 阶段一：数据库扩展（1-2天）
1. 添加基础字段（credit_requirements, teaching_mode, study_mode等）
2. 添加JSONB字段（course_structure, application_timeline等）
3. 更新TypeScript类型定义

### 阶段二：后端服务更新（1天）
1. 更新 `programService.ts` 中的数据处理逻辑
2. 更新 `updateProgram` 方法支持新字段
3. 更新 `fetchProgramById` 方法返回新字段

### 阶段三：前端组件开发（3-5天）
1. 创建新的展示组件（CourseStructureCard等）
2. 更新 `ProgramDetailView` 组件
3. 更新 `ProgramEditForm` 组件支持编辑新字段

### 阶段四：数据迁移（1天）
1. 为现有专业数据补充新字段
2. 数据验证和测试

---

## 📊 七、数据示例（基于NUS GF）

```json
{
  "credit_requirements": "普通路径：40学分，含实习：44学分",
  "teaching_mode": "密集型授课，课程集中度高",
  "study_mode": "全日制：12个月，兼职：21个月",
  "program_positioning": "在金融框架内解决'社会与环境挑战'，把环境与社会因素系统地纳入金融决策",
  "course_structure": {
    "preparatory_courses": [
      {
        "name": "金融、会计和经济学导论",
        "description": "基础微观经济学概念、供给需求与市场均衡等"
      }
    ],
    "core_courses": [
      {
        "name": "公司治理与可持续发展",
        "name_cn": "公司治理与可持续发展",
        "credits": 4,
        "description": "公司治理在可持续发展中的基础作用"
      },
      {
        "name": "可持续发展经济学",
        "name_cn": "可持续发展经济学",
        "credits": 4,
        "description": "市场失灵与外部性、产权与环境规制"
      }
    ],
    "elective_courses": [
      {
        "name": "碳核算与可持续发展报告",
        "name_cn": "碳核算与可持续发展报告",
        "credits": 4,
        "description": "GHG Protocol、IFRS可持续发展相关披露标准"
      }
    ],
    "experiential_learning": [
      {
        "type": "capstone",
        "name": "毕业设计项目",
        "credits": 8,
        "description": "小组形式，将课程概念与理论应用于真实商业问题"
      },
      {
        "type": "internship",
        "name": "行业实习",
        "credits": 4,
        "description": "在金融行业中分析真实问题"
      }
    ]
  },
  "application_timeline": [
    {
      "event_name": "网申开放",
      "event_date": "2025-09-01",
      "description": "开始接受在线申请"
    },
    {
      "event_name": "第一轮截止",
      "event_date": "2025-11-15",
      "description": "奖学金评定重点轮次",
      "is_scholarship_deadline": true
    },
    {
      "event_name": "最终截止",
      "event_date": "2026-02-15",
      "description": "所有申请人最终截止"
    },
    {
      "event_name": "结果发放",
      "event_date": "2026-06-01",
      "description": "开始发放录取结果"
    }
  ],
  "application_materials": [
    {
      "name": "当前简历",
      "name_en": "Current Resume",
      "is_required": true,
      "description": "最新的个人简历"
    },
    {
      "name": "动机信",
      "name_en": "Motivation Letter",
      "is_required": true,
      "description": "不超过500字",
      "format_requirements": "不超过500字"
    },
    {
      "name": "GMAT/GRE",
      "name_en": "GMAT/GRE",
      "is_required": false,
      "description": "可选，但有加分"
    }
  ],
  "career_info": {
    "industries": [
      "咨询",
      "能源与城市发展",
      "金融服务",
      "基金管理",
      "公共部门"
    ],
    "job_titles": [
      "FPA分析师（可持续发展报告方向）",
      "能源分析师",
      "投资组合经理",
      "可持续发展经理"
    ]
  },
  "program_features": [
    "与SGFIN深度合作",
    "毕业设计项目（Capstone）",
    "每周行业讲座",
    "研究机构资源与数据库使用权限"
  ],
  "interview_guide": {
    "common_questions": [
      "你是通过什么渠道了解这个项目的",
      "说说你最感兴趣的几门课程以及原因",
      "你的短期与长期职业规划",
      "你如何给一家公司估值"
    ],
    "preparation_tips": "准备回答关于可持续金融、公司估值、职业规划等问题"
  }
}
```

---

## ✅ 八、总结

### 核心建议

1. **采用方案A（JSONB字段）**进行快速实现，满足当前需求
2. **分阶段实施**，优先完成高优先级功能
3. **保持向后兼容**，新字段设为可选
4. **前端组件化**，便于维护和复用

### 预期效果

- ✅ 专业信息展示更加完整和结构化
- ✅ 提升用户体验，信息查找更便捷
- ✅ 支持更详细的申请指导
- ✅ 为后续功能扩展打下基础

---

**文档版本**: v1.0  
**创建时间**: 2025-01-XX  
**最后更新**: 2025-01-XX

