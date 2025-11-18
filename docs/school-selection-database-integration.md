# 选校规划页面与全球数据库协同设计方案

> 📅 文档创建时间: 2025年1月  
> 🎯 目标: 实现选校规划页面与全球数据库的完整数据协同

---

## 1. 设计目标

### 1.1 核心需求
- **数据同步**: 选校规划页面能够实时从全球数据库读取学校/专业数据
- **数据持久化**: AI推荐、人工筛选的候选项目能够保存到数据库
- **数据关联**: 与成功案例、最终选校列表等模块建立关联
- **智能辅助**: AI推荐作为辅助工具,通过条件匹配帮助人工筛选
- **协同设计**: AI推荐和人工筛选无缝协同,AI结果可直接加入候选池

### 1.2 设计原则
- **AI辅助而非替代**: AI推荐作为辅助工具,顾问主导决策
- **条件匹配优先**: 基于直观的条件(国家、专业、成绩等)而非复杂的权重百分比
- **数据标准化**: 统一的数据模型和转换逻辑
- **性能优化**: 合理使用缓存,避免频繁查询
- **无缝协同**: AI推荐结果可直接加入人工筛选的候选池

---

## 2. 数据模型映射

### 2.1 核心实体映射关系

```
页面数据模型                ↔  数据库表
─────────────────────────────────────────────
RecommendationDefinition  →  school_selection_recommendations (新建)
CandidateProgram          →  school_selection_candidates (新建)
RecommendationVersion     →  school_selection_versions (新建)
StudentProfile            ↔  students + student_profile
推荐的学校/专业             ↔  schools + programs
相似案例                   ↔  success_cases
最终选校                   ↔  final_university_choices
```

### 2.2 数据库表设计(新增)

#### 2.2.1 `school_selection_scenarios` (选校规划场景)
存储每个学生的选校规划会话上下文。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `student_id` | integer | 学生ID,关联 `students` |
| `title` | text | 场景名称(如"2026 Fall 美国CS硕士") |
| `status` | enum | 状态: draft(草稿)/discussing(讨论中)/confirmed(已确认)/archived(已归档) |
| `target_intake` | text | 目标入学时间 |
| `target_countries` | text[] | 目标国家列表 |
| `target_programs` | text[] | 目标专业方向列表 |
| `budget_range` | jsonb | 预算范围 {min, max, currency} |
| `current_school` | text | 学生当前学校 |
| `gpa` | numeric | GPA成绩 |
| `gpa_scale` | text | GPA制式(如"4.0"、"100分制") |
| `language_scores` | jsonb | 语言成绩 {toefl, ielts, gre, gmat等} |
| `target_distribution` | jsonb | 目标档位分布 {sprint, match, safety} |
| `created_by` | UUID | 创建人ID,关联 `employees` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

**索引**:
- `idx_scenarios_student` ON (student_id, status)
- `idx_scenarios_created_at` ON (created_at DESC)

#### 2.2.2 `school_selection_recommendations` (AI推荐结果)
存储AI生成的推荐院校/项目。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `scenario_id` | UUID | 场景ID,关联 `school_selection_scenarios` |
| `version_id` | UUID | 版本ID,关联 `school_selection_versions` |
| `school_id` | integer | 学校ID,关联 `schools` |
| `program_id` | integer | 项目ID,关联 `programs` (可选) |
| `school_name` | text | 学校名称(冗余,便于查询) |
| `program_name` | text | 项目名称(冗余,便于查询) |
| `level` | enum | 档位: 冲刺/匹配/保底 |
| `match_score` | integer | 匹配度分数(0-100) |
| `match_reason` | text | 匹配理由 |
| `match_factors` | jsonb | 匹配因子 {country_match, program_match, gpa_match, language_match, budget_match等} |
| `rationale` | text | 推荐理由 |
| `highlight` | text[] | 亮点标签 |
| `requirements` | text[] | 需补充材料 |
| `case_reference_ids` | integer[] | 相似案例ID列表,关联 `success_cases` |
| `created_at` | timestamptz | 创建时间 |

**索引**:
- `idx_recommendations_scenario` ON (scenario_id, version_id)
- `idx_recommendations_score` ON (final_score DESC)
- `idx_recommendations_level` ON (level)

#### 2.2.3 `school_selection_candidates` (候选项目池)
存储人工筛选或AI推荐的候选项目。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `scenario_id` | UUID | 场景ID |
| `school_id` | integer | 学校ID,关联 `schools` |
| `program_id` | integer | 项目ID,关联 `programs` (可选) |
| `school_name` | text | 学校名称 |
| `program_name` | text | 项目名称 |
| `source` | enum | 来源: ai_recommendation(AI推荐)/manual(人工添加) |
| `stage` | enum | 档位: 冲刺/匹配/保底 |
| `status` | enum | 状态: pending(待讨论)/approved(通过)/rejected(淘汰) |
| `notes` | text | 备注说明 |
| `owner_id` | UUID | 负责人ID,关联 `employees` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

**索引**:
- `idx_candidates_scenario` ON (scenario_id, status)
- `idx_candidates_stage` ON (stage)

#### 2.2.4 `school_selection_versions` (推荐版本历史)
存储每次AI推荐的版本记录。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `scenario_id` | UUID | 场景ID |
| `version_number` | integer | 版本号(1, 2, 3...) |
| `created_by` | text | 创建者(AI Copilot / 员工姓名) |
| `created_by_id` | UUID | 创建者ID,关联 `employees` (可选) |
| `summary` | text | 版本摘要 |
| `adopted` | boolean | 是否已采用 |
| `weight_config` | jsonb | 使用的权重配置 |
| `risk_preference` | enum | 使用的风险偏好 |
| `recommendation_count` | integer | 推荐数量 |
| `created_at` | timestamptz | 创建时间 |

**索引**:
- `idx_versions_scenario` ON (scenario_id, created_at DESC)

#### 2.2.5 `school_selection_meetings` (选校会议记录)
存储选校相关的会议记录。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `scenario_id` | UUID | 场景ID |
| `meeting_type` | enum | 会议类型: student_meeting(学生会议)/advisor_meeting(顾问会商) |
| `title` | text | 会议标题 |
| `start_time` | timestamptz | 开始时间 |
| `end_time` | timestamptz | 结束时间 |
| `participants` | text[] | 参会人员列表 |
| `agenda` | text[] | 议程列表 |
| `minutes` | text | 会议纪要 |
| `actions` | text[] | 行动项列表 |
| `created_by` | UUID | 创建人ID |
| `created_at` | timestamptz | 创建时间 |

**关联关系**:
- 可关联到 `meetings` 表(如果复用通用会议功能)

#### 2.2.6 `school_selection_snapshots` (决策快照)
存储关键决策点的快照。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | UUID | 主键 |
| `scenario_id` | UUID | 场景ID |
| `title` | text | 快照标题 |
| `summary` | text | 摘要说明 |
| `author` | text | 创建人 |
| `author_id` | UUID | 创建人ID |
| `candidate_ids` | UUID[] | 候选项目ID列表 |
| `attachments` | jsonb | 附件列表 [{name, url, type}] |
| `created_at` | timestamptz | 创建时间 |

---

## 3. 服务层设计

### 3.1 数据获取服务

#### 3.1.1 `schoolSelectionService.ts`

```typescript
// 获取学生的所有选校场景
async getScenariosByStudentId(studentId: number): Promise<SelectionScenario[]>

// 获取场景详情(包含推荐、候选、版本等)
async getScenarioById(scenarioId: string): Promise<SelectionScenarioDetail>

// 创建新场景
async createScenario(data: CreateScenarioInput): Promise<SelectionScenario>

// 更新场景
async updateScenario(scenarioId: string, updates: Partial<SelectionScenario>): Promise<SelectionScenario>
```

#### 3.1.2 `schoolSelectionRecommendationService.ts`

```typescript
// AI推荐匹配条件接口
interface AIMatchCriteria {
  targetCountries: string[];        // 目标国家
  targetPrograms: string[];         // 专业方向
  budgetRange?: {                    // 预算范围
    min?: number;
    max?: number;
    currency?: string;
  };
  currentSchool?: string;            // 学生当前学校
  gpa?: number;                      // GPA成绩
  gpaScale?: string;                 // GPA制式
  languageScores?: {                 // 语言成绩
    toefl?: number;
    ielts?: number;
    gre?: number;
    gmat?: number;
  };
  targetDistribution?: {             // 目标档位分布(可选)
    sprint?: number;
    match?: number;
    safety?: number;
  };
}

// 生成AI推荐(基于条件匹配,保存到数据库)
async generateRecommendations(
  scenarioId: string, 
  criteria: AIMatchCriteria
): Promise<RecommendationVersion>

// 获取场景的所有推荐版本
async getVersionsByScenarioId(scenarioId: string): Promise<RecommendationVersion[]>

// 获取指定版本的推荐列表
async getRecommendationsByVersionId(versionId: string): Promise<RecommendationProgram[]>

// 从数据库读取推荐并转换为页面数据模型
async getRecommendationsForDisplay(scenarioId: string): Promise<RecommendationProgram[]>

// 将AI推荐结果批量添加到候选池
async addRecommendationsToCandidates(
  scenarioId: string,
  recommendationIds: string[],
  stage?: '冲刺' | '匹配' | '保底'
): Promise<CandidateProgram[]>
```

#### 3.1.3 `schoolSelectionCandidateService.ts`

```typescript
// 添加候选项目(从AI推荐或人工添加)
async addCandidate(candidate: CreateCandidateInput): Promise<CandidateProgram>

// 批量添加候选项目
async addCandidates(candidates: CreateCandidateInput[]): Promise<CandidateProgram[]>

// 更新候选项目状态
async updateCandidate(
  candidateId: string, 
  updates: Partial<CandidateProgram>
): Promise<CandidateProgram>

// 获取场景的所有候选项目
async getCandidatesByScenarioId(scenarioId: string): Promise<CandidateProgram[]>

// 将候选项目同步到最终选校列表
async syncToFinalChoices(scenarioId: string, candidateIds: string[]): Promise<void>
```

### 3.2 数据查询服务(从全球数据库读取)

#### 3.2.1 学校/专业查询

```typescript
// 使用现有的 schoolService 和 programService
import { schoolService } from '@/services/schoolService';
import { programService } from '@/services/programService';

// 在人工筛选面板中:
// 1. 从数据库读取学校列表(带筛选条件)
const schools = await schoolService.searchSchools({
  countries: ['美国', '英国'],
  qsRankRange: [1, 100],
  tags: ['计算机科学']
});

// 2. 从数据库读取专业列表(带筛选条件)
const programs = await programService.searchPrograms({
  schoolIds: selectedSchoolIds,
  category: 'Computer Science',
  degree: '硕士'
});
```

#### 3.2.2 成功案例关联

```typescript
// 为每个推荐项目查找相似成功案例
async findSimilarCases(
  schoolId: number,
  programId: number,
  studentBackground: StudentBackground
): Promise<SuccessCase[]>

// 查询逻辑:
// 1. 匹配相同学校/专业
// 2. 相似背景(GPA、语言成绩等)
// 3. 相同申请年份
```

### 3.3 数据同步服务

#### 3.3.1 与最终选校列表同步

```typescript
// 将候选项目中"已通过"的项目同步到 final_university_choices
async syncApprovedCandidatesToFinalChoices(
  scenarioId: string
): Promise<void> {
  // 1. 获取场景中所有 status='approved' 的候选
  const approvedCandidates = await getCandidatesByScenarioId(scenarioId)
    .filter(c => c.status === 'approved');
  
  // 2. 转换为 final_university_choices 格式
  const choices = approvedCandidates.map(c => ({
    student_id: scenario.student_id,
    school_name: c.school_name,
    program_name: c.program_name,
    application_type: c.stage, // 冲刺/匹配/保底
    priority_rank: calculatePriority(c.stage, c.score)
  }));
  
  // 3. 批量插入或更新
  await universityChoiceService.batchUpsert(choices);
}
```

---

## 4. 数据流设计

### 4.1 页面初始化流程

```
用户打开选校规划页面
    ↓
检查是否有活跃场景(通过student_id查询)
    ↓
如果没有 → 创建新场景(基于student_profile数据)
如果有 → 加载场景数据
    ↓
加载场景关联数据:
  - 推荐版本列表
  - 当前版本的推荐列表
  - 候选项目池
  - 会议记录
  - 决策快照
    ↓
渲染页面
```

### 4.2 AI推荐生成流程(基于条件匹配)

```
用户在人工筛选面板点击"AI智能推荐"按钮
    ↓
弹出AI推荐配置对话框,自动填充学生基本信息:
  - 目标国家(从场景获取)
  - 专业方向(从场景获取)
  - 预算范围(从场景获取)
  - 学生当前学校(从student_profile获取)
  - GPA成绩(从student_profile获取)
  - 语言成绩(从student_profile获取)
    ↓
顾问可以调整匹配条件(国家、专业、预算等)
    ↓
点击"生成推荐"按钮
    ↓
调用AI匹配算法:
  1. 从数据库读取学校/专业数据(根据条件筛选)
  2. 匹配条件:
     - 国家匹配: 筛选目标国家的学校
     - 专业匹配: 筛选目标专业方向的项目
     - GPA匹配: 根据GPA和学校要求判断冲刺/匹配/保底
     - 语言成绩匹配: 根据语言成绩判断是否符合要求
     - 预算匹配: 根据预算筛选合适的学校
     - 成功案例匹配: 查找相似背景的成功案例
  3. 计算匹配度分数(0-100)
  4. 自动分类为冲刺/匹配/保底
  5. 生成推荐理由和相似案例参考
    ↓
保存到数据库:
  1. 创建新版本记录(school_selection_versions)
  2. 批量插入推荐记录(school_selection_recommendations)
    ↓
在弹窗中展示推荐结果(卡片列表):
  - 显示学校名称、专业名称
  - 显示匹配度分数和档位(冲刺/匹配/保底)
  - 显示推荐理由和相似案例
  - 提供"加入候选池"按钮(可批量选择)
    ↓
顾问选择需要的推荐项目,点击"加入候选池"
    ↓
批量添加到候选池(school_selection_candidates)
    ↓
关闭弹窗,返回人工筛选面板
候选池自动刷新显示新增的候选项目
```

### 4.3 AI推荐与人工筛选协同流程

```
人工筛选面板(主工作区)
    ↓
包含功能:
  1. 筛选器(国家、排名、专业、语言要求、费用等)
  2. 候选项目列表(从数据库实时加载)
  3. AI智能推荐按钮(右上角)
    ↓
两种工作方式:

方式一: AI辅助模式
  顾问点击"AI智能推荐"按钮
    ↓
  AI基于条件匹配生成推荐列表
    ↓
  顾问浏览推荐结果,选择需要的项目
    ↓
  点击"加入候选池"批量添加
    ↓
  返回人工筛选面板,候选池显示新项目

方式二: 纯人工模式
  顾问直接在筛选器中设置条件
    ↓
  从数据库查询匹配的学校/专业
    ↓
  手动选择项目添加到候选池
    ↓
  候选池显示所有已添加的项目

协同特点:
- AI推荐结果和人工筛选结果都在同一个候选池中
- 候选池中显示项目来源(AI推荐/人工添加)
- 顾问可以对候选项目进行统一管理(编辑、删除、标记状态)
- 最终都通过候选池统一管理,然后同步到最终选校列表
```

### 4.4 人工筛选流程

```
用户在人工筛选面板操作
    ↓
选择筛选条件(国家、排名、专业、语言要求、费用等)
    ↓
从数据库查询匹配的学校/专业
    ↓
用户选择候选项目添加到候选池
    ↓
保存到数据库(school_selection_candidates)
    ↓
更新候选池显示
```

### 4.5 AI推荐匹配算法设计

```typescript
// 匹配算法示例
interface MatchResult {
  school: School;
  program?: Program;
  matchScore: number;        // 0-100
  level: '冲刺' | '匹配' | '保底';
  matchFactors: {
    countryMatch: boolean;     // 国家匹配
    programMatch: number;      // 专业匹配度 0-100
    gpaMatch: number;          // GPA匹配度 0-100
    languageMatch: boolean;    // 语言成绩是否满足
    budgetMatch: boolean;      // 预算是否满足
    rankingMatch: number;      // 排名匹配度 0-100
  };
  rationale: string;           // 推荐理由
  similarCases: SuccessCase[]; // 相似案例
}

function matchSchoolsAndPrograms(
  criteria: AIMatchCriteria,
  schools: School[],
  programs: Program[],
  successCases: SuccessCase[]
): MatchResult[] {
  const results: MatchResult[] = [];
  
  // 1. 筛选目标国家的学校
  const filteredSchools = schools.filter(s => 
    criteria.targetCountries.includes(s.country)
  );
  
  // 2. 对每个学校/专业进行匹配
  for (const school of filteredSchools) {
    const schoolPrograms = programs.filter(p => p.school_id === school.id);
    
    // 如果没有专业数据,匹配学校
    if (schoolPrograms.length === 0) {
      const matchResult = calculateSchoolMatch(school, criteria, successCases);
      if (matchResult.matchScore >= 60) { // 只返回匹配度60以上的
        results.push(matchResult);
      }
      continue;
    }
    
    // 如果有专业数据,匹配专业
    for (const program of schoolPrograms) {
      // 专业方向匹配
      if (!isProgramMatch(program, criteria.targetPrograms)) {
        continue;
      }
      
      const matchResult = calculateProgramMatch(
        school, 
        program, 
        criteria, 
        successCases
      );
      
      if (matchResult.matchScore >= 60) {
        results.push(matchResult);
      }
    }
  }
  
  // 3. 根据匹配度分数分类为冲刺/匹配/保底
  return classifyResults(results, criteria);
}

function calculateProgramMatch(
  school: School,
  program: Program,
  criteria: AIMatchCriteria,
  successCases: SuccessCase[]
): MatchResult {
  const factors = {
    countryMatch: criteria.targetCountries.includes(school.country),
    programMatch: calculateProgramSimilarity(program, criteria.targetPrograms),
    gpaMatch: calculateGPAMatch(criteria.gpa, program.apply_requirements),
    languageMatch: checkLanguageRequirement(criteria.languageScores, program.language_requirements),
    budgetMatch: checkBudgetMatch(criteria.budgetRange, program.tuition_fee),
    rankingMatch: calculateRankingScore(school.qs_rank_2025)
  };
  
  // 计算综合匹配度分数
  const matchScore = calculateMatchScore(factors);
  
  // 根据匹配度确定档位
  const level = determineLevel(matchScore, factors);
  
  // 查找相似案例
  const similarCases = findSimilarCases(
    school.id,
    program.id,
    criteria,
    successCases
  );
  
  // 生成推荐理由
  const rationale = generateRationale(factors, level, similarCases);
  
  return {
    school,
    program,
    matchScore,
    level,
    matchFactors: factors,
    rationale,
    similarCases
  };
}

function determineLevel(
  score: number,
  factors: MatchFactors
): '冲刺' | '匹配' | '保底' {
  // 冲刺: 匹配度高但要求高(GPA/排名要求高)
  if (score >= 85 && factors.gpaMatch < 70) {
    return '冲刺';
  }
  
  // 匹配: 匹配度高且要求适中
  if (score >= 70) {
    return '匹配';
  }
  
  // 保底: 匹配度中等但要求较低
  return '保底';
}
```

### 4.6 同步到最终选校流程

```
顾问确认候选项目"通过"
    ↓
更新候选项目状态(status='approved')
    ↓
点击"同步到最终选校"
    ↓
调用同步服务:
  1. 查询所有已通过的候选
  2. 转换为final_university_choices格式
  3. 批量插入/更新
    ↓
提示同步成功
```

---

## 5. 实现步骤

### 5.1 第一阶段: 数据库表创建

1. 创建6个新表(使用Supabase MCP或SQL迁移)
2. 创建索引和约束
3. 设置RLS策略(如果需要)

### 5.2 第二阶段: 服务层实现

1. 实现 `schoolSelectionService.ts`
2. 实现 `schoolSelectionRecommendationService.ts`
3. 实现 `schoolSelectionCandidateService.ts`
4. 实现数据转换函数(页面模型 ↔ 数据库模型)

### 5.3 第三阶段: 页面集成

1. 修改 `SchoolSelectionPlannerPage.tsx`:
   - 从数据库加载场景数据(替换本地data.ts)
   - 保存推荐结果到数据库
   - 保存候选项目到数据库

2. 修改 `ManualSelectionPanel.tsx`:
   - 集成 `schoolService` 和 `programService`
   - 实现筛选查询功能
   - 实现添加候选到数据库

3. 修改 `AIRecommendationPanel.tsx`:
   - 实现AI推荐生成和保存
   - 显示相似成功案例

### 5.4 第四阶段: 数据同步

1. 实现与 `final_university_choices` 的同步
2. 实现与 `success_cases` 的关联查询
3. 实现版本管理和历史回溯

---

## 6. 关键技术点

### 6.1 数据模型转换

需要编写转换函数:

```typescript
// 数据库模型 → 页面模型
function dbRecommendationToPageModel(db: DBRecommendation): RecommendationProgram {
  return {
    id: db.id,
    school: db.school_name,
    program: db.program_name,
    level: db.level,
    baseScore: db.base_score,
    score: db.final_score,
    rationale: db.rationale,
    highlight: db.highlight,
    requirements: db.requirements,
    caseReference: db.case_reference,
    strengths: db.strengths as StrengthKey[]
  };
}

// 页面模型 → 数据库模型
function pageCandidateToDbModel(
  page: CandidateProgram, 
  scenarioId: string
): DBCandidate {
  return {
    scenario_id: scenarioId,
    school_name: page.school,
    program_name: page.program,
    source: page.source === 'AI推荐' ? 'ai_recommendation' : 'manual',
    stage: page.stage,
    status: mapStatusToDb(page.status),
    notes: page.notes,
    owner_id: getEmployeeIdByName(page.owner)
  };
}
```

### 6.2 缓存策略

```typescript
// 学校/专业数据缓存(较少变动)
const SCHOOL_CACHE_TTL = 24 * 60 * 60 * 1000; // 24小时

// 场景数据缓存(实时性要求高)
const SCENARIO_CACHE_TTL = 5 * 60 * 1000; // 5分钟

// 推荐结果缓存(依赖配置,配置变化时失效)
const RECOMMENDATION_CACHE_KEY = (scenarioId, configHash) => 
  `recommendation:${scenarioId}:${configHash}`;
```

### 6.3 性能优化

1. **批量查询**: 使用 `IN` 查询批量获取学校/专业详情
2. **关联查询**: 使用 Supabase 的关联查询减少请求次数
3. **分页加载**: 推荐列表和候选列表支持分页
4. **索引优化**: 确保查询字段都有索引

---

## 7. 数据迁移方案

### 7.1 现有数据迁移

如果已有本地模拟数据,可以编写迁移脚本:

```typescript
// 迁移示例学生的选校数据到数据库
async function migrateStudentData(studentId: string, localData: StudentDataBundle) {
  // 1. 创建场景
  const scenario = await createScenario({
    student_id: parseInt(studentId.replace('student-', '')),
    title: localData.profile.programGoal,
    // ... 其他字段
  });
  
  // 2. 创建版本和推荐
  for (const version of localData.versions) {
    const dbVersion = await createVersion(scenario.id, version);
    // 创建推荐记录...
  }
  
  // 3. 创建候选项目
  for (const candidate of localData.candidates) {
    await addCandidate({
      scenario_id: scenario.id,
      // ... 转换数据
    });
  }
}
```

---

## 8. 后续优化方向

1. **AI推荐算法优化**: 利用数据库中的历史数据训练推荐模型
2. **实时协同**: 使用 Supabase Realtime 实现多用户实时编辑
3. **数据分析**: 统计推荐采纳率、成功率等指标
4. **智能提醒**: 基于数据库数据提醒申请截止日期、材料准备等

---

## 9. 注意事项

1. **数据一致性**: 确保 `school_selection_candidates` 和 `final_university_choices` 的数据一致性
2. **权限控制**: 不同角色对选校数据的访问权限不同
3. **数据备份**: 重要决策快照需要定期备份
4. **性能监控**: 监控数据库查询性能,及时优化慢查询

---

## 10. 页面结构设计

### 10.1 整体布局(调整后)

```
选校规划中心
├─ 顶部导航条
│  ├ 学生信息概览
│  ├ 当前方案状态标签
│  └ 快捷操作按钮
│     ├ 安排选校会议
│     ├ 导出方案
│     └ (移除"生成AI推荐"按钮)
├─ 功能标签页(3个)
│  ├ 人工筛选工作台(主工作区) ⭐
│  │  ├ 顶部操作栏
│  │  │  ├ AI智能推荐按钮 🔘 (新增)
│  │  │  ├ 保存筛选方案
│  │  │  └ 分享给文书团队
│  │  ├ 筛选器区域
│  │  │  ├ 国家筛选
│  │  │  ├ 排名筛选
│  │  │  ├ 专业方向筛选
│  │  │  ├ 语言要求筛选
│  │  │  └ 费用筛选
│  │  ├ 学校/专业列表
│  │  │  └ 从数据库查询显示
│  │  └ 候选项目池
│  │     ├ 项目来源标签(AI推荐/人工添加)
│  │     ├ 项目状态(待讨论/通过/淘汰)
│  │     └ 操作按钮(编辑/删除/标记状态)
│  ├ 会议协同
│  │  ├ 学生协同视图
│  │  ├ 顾问协同视图
│  │  └ 会议纪要与行动项
│  └ 决策档案
│     ├ 方案版本快照
│     ├ 决策记录
│     └ 导出/分享
```

### 10.2 AI推荐功能集成(按钮触发模式)

#### 10.2.1 按钮位置
- **位置**: 人工筛选工作台顶部操作栏右侧
- **样式**: 蓝色主按钮,带AI图标
- **文案**: "AI智能推荐"

#### 10.2.2 触发流程

```
用户点击"AI智能推荐"按钮
    ↓
弹出AI推荐配置对话框(Modal)
    ↓
对话框包含:
├─ 基本信息展示区(只读,自动填充)
│  ├ 学生姓名
│  ├ 当前学校
│  ├ GPA成绩
│  ├ 语言成绩
│  └ (其他基本信息)
├─ 匹配条件调整区(可编辑)
│  ├ 目标国家(多选)
│  ├ 专业方向(多选)
│  ├ 预算范围(范围选择器)
│  └ (可覆盖自动填充的值)
└─ 操作按钮
   ├ 取消
   └ 生成推荐(主要按钮)
    ↓
点击"生成推荐"
    ↓
显示加载状态
    ↓
AI匹配算法执行(后端)
    ↓
显示推荐结果(在同一对话框中)
    ↓
推荐结果展示区:
├─ 推荐统计
│  ├ 冲刺 X 所
│  ├ 匹配 Y 所
│  └ 保底 Z 所
├─ 推荐列表(分档位展示)
│  ├ 冲刺档位
│  │  ├ 学校A - 专业A (匹配度: 92)
│  │  │  ├ 推荐理由
│  │  │  ├ 相似案例(可展开)
│  │  │  └ 复选框(可批量选择)
│  │  └ ...
│  ├ 匹配档位
│  └ 保底档位
└─ 操作按钮
   ├ 全选/取消全选
   ├ 加入候选池(批量)
   └ 关闭
    ↓
顾问选择需要的推荐项目
    ↓
点击"加入候选池"
    ↓
批量添加到候选池
关闭对话框,返回人工筛选面板
候选池自动刷新
```

### 10.3 人工筛选工作台设计(主工作区)

#### 10.3.1 核心功能
1. **筛选器**: 从数据库查询学校/专业
2. **候选池**: 统一管理AI推荐和人工添加的项目
3. **AI推荐按钮**: 触发AI推荐功能

#### 10.3.2 候选池显示

```
候选项目列表
├─ 项目卡片1 (来源: AI推荐)
│  ├ 学校名称
│  ├ 专业名称
│  ├ 标签
│  │  ├ 来源标签(AI推荐 - 蓝色)
│  │  ├ 档位标签(冲刺 - 红色)
│  │  └ 状态标签(待讨论 - 黄色)
│  ├ 匹配度分数(如果来自AI推荐)
│  ├ 推荐理由(如果来自AI推荐)
│  └ 操作按钮(编辑/删除/标记状态)
├─ 项目卡片2 (来源: 人工添加)
│  └ ...
└─ ...
```

#### 10.3.3 协同特点

1. **统一管理**: AI推荐和人工添加的项目都在同一个候选池中
2. **来源区分**: 通过标签区分项目来源
3. **信息展示**: AI推荐的项目显示匹配度分数和推荐理由
4. **批量操作**: 支持批量编辑、删除、标记状态
5. **状态管理**: 统一的状态管理(待讨论/通过/淘汰)

### 10.4 数据模型调整

#### 10.4.1 移除的字段
- ❌ `weight_config` (权重配置)
- ❌ `risk_preference` (风险偏好)
- ❌ `base_score` (基础分数)

#### 10.4.2 新增的字段
- ✅ `budget_range` (预算范围)
- ✅ `current_school` (学生当前学校)
- ✅ `gpa` (GPA成绩)
- ✅ `language_scores` (语言成绩)
- ✅ `match_factors` (匹配因子JSON)

### 10.5 交互设计原则

1. **AI辅助而非替代**: AI推荐作为辅助工具,顾问主导决策
2. **直观的条件匹配**: 基于直观的条件(国家、专业、成绩等)而非复杂的权重百分比
3. **无缝协同**: AI推荐结果可直接加入人工筛选的候选池
4. **统一管理**: 所有候选项目在一个候选池中统一管理

### 10.6 详细交互设计

#### 10.6.1 AI智能推荐按钮

**视觉设计**:
- **位置**: 人工筛选工作台顶部操作栏右侧,与"保存筛选方案"和"分享给文书团队"按钮并列
- **样式**: 
  - 主按钮样式: `bg-blue-600 text-white`
  - 尺寸: `px-4 py-2` (与顶部其他快捷操作按钮保持一致)
  - 图标: `Sparkles` 图标(表示AI智能)
  - 文字: "AI智能推荐"
- **状态**:
  - 默认: 蓝色主按钮,带图标和文字
  - 悬停: `hover:bg-blue-700` 背景色加深
  - 加载中: 显示旋转的 `Loader2` 图标,按钮禁用状态 `disabled:opacity-80 cursor-not-allowed`
  - 禁用: 灰色半透明,不可点击

**交互反馈**:
- 点击按钮后立即显示加载状态(按钮文字变为"生成中...",图标变为旋转的加载图标)
- 按钮禁用,防止重复点击
- 加载完成后恢复按钮状态

#### 10.6.2 AI推荐配置对话框

**对话框布局**:
```
┌─────────────────────────────────────────┐
│ AI智能推荐                    [×] 关闭   │
├─────────────────────────────────────────┤
│                                         │
│ 📋 学生基本信息(只读)                   │
│ ┌───────────────────────────────────┐  │
│ │ 学生姓名: 李沐阳                   │  │
│ │ 当前学校: 中国科学技术大学          │  │
│ │ GPA: 3.7/4.0                      │  │
│ │ 语言成绩: TOEFL 106, GRE 325      │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ⚙️ 匹配条件(可编辑)                     │
│ ┌───────────────────────────────────┐  │
│ │ 目标国家: [美国✓] [英国] [加拿大] │  │
│ │ 专业方向: [CS✓] [SE] [AI]         │  │
│ │ 预算范围: 30万 - 80万 人民币       │  │
│ └───────────────────────────────────┘  │
│                                         │
│           [取消]  [生成推荐 →]          │
└─────────────────────────────────────────┘
```

**交互细节**:
1. **打开动画**: 对话框从中心淡入并缩放 `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`
2. **关闭方式**: 
   - 点击右上角"×"按钮
   - 点击"取消"按钮
   - 点击遮罩层(灰色半透明背景)
   - 按 `ESC` 键
3. **基本信息区域**:
   - 只读展示,灰色背景 `bg-gray-50 dark:bg-gray-900/50`
   - 数据自动从 `student_profile` 和场景配置中填充
   - 清晰的标签和值对齐
4. **匹配条件区域**:
   - 可编辑,白色背景
   - 多选下拉框选择国家和专业
   - 预算范围使用滑块或数字输入框
   - 条件改变时实时提示"条件已更新"
5. **按钮交互**:
   - "取消"按钮: 次要样式,点击关闭对话框
   - "生成推荐"按钮: 主按钮样式,点击触发AI匹配算法

#### 10.6.3 AI推荐结果展示

**结果展示布局**:
```
┌─────────────────────────────────────────┐
│ AI智能推荐                    [×] 关闭   │
├─────────────────────────────────────────┤
│                                         │
│ 📊 推荐统计                              │
│ ┌───────────────────────────────────┐  │
│ │ 冲刺: 5所  匹配: 12所  保底: 3所  │  │
│ └───────────────────────────────────┘  │
│                                         │
│ 🎯 推荐列表                              │
│ ┌───────────────────────────────────┐  │
│ │ 冲刺档位 (5所)                     │  │
│ │ ┌───────────────────────────────┐ │  │
│ │ │ [✓] MIT - Computer Science    │ │  │
│ │ │     匹配度: 92分               │ │  │
│ │ │     推荐理由: ...              │ │  │
│ │ │     [查看相似案例 ▼]           │ │  │
│ │ └───────────────────────────────┘ │  │
│ │ ...                               │  │
│ │                                    │  │
│ │ 匹配档位 (12所)                    │  │
│ │ ...                               │  │
│ │                                    │  │
│ │ 保底档位 (3所)                     │  │
│ │ ...                               │  │
│ └───────────────────────────────────┘  │
│                                         │
│ [全选] [取消全选]  [加入候选池(5项) →]  │
└─────────────────────────────────────────┘
```

**交互细节**:
1. **加载状态**:
   - 显示骨架屏或加载动画
   - 提示文字:"正在智能匹配学校/专业..."
   - 预计时间提示:"预计需要 10-15 秒"
2. **推荐统计卡片**:
   - 三个数字卡片横向排列
   - 不同档位使用不同颜色(冲刺-红色,匹配-蓝色,保底-绿色)
   - 数字动画效果(从0递增到实际数字)
3. **推荐列表**:
   - 按档位分组显示,使用折叠面板
   - 默认展开所有档位
   - 每个推荐项包含:
     - 复选框(可多选)
     - 学校名称(粗体)
     - 专业名称
     - 匹配度分数(带颜色进度条)
     - 推荐理由(可展开/收起)
     - 相似案例(可展开查看详情)
   - 悬停效果:卡片背景色变化 `hover:bg-gray-50`
   - 选中状态:复选框勾选,卡片边框高亮
4. **批量操作**:
   - "全选/取消全选"按钮切换所有项的选中状态
   - "加入候选池"按钮显示已选数量
   - 至少选择一个项目才能点击"加入候选池"
   - 点击后显示成功提示,自动关闭对话框

#### 10.6.4 人工筛选工作台

**筛选器区域**:
- **布局**: 横向排列的多个筛选控件
- **筛选条件**:
  - 国家: 多选下拉框,支持搜索
  - 排名范围: 滑块或数字输入(如: Top 50)
  - 专业方向: 多选下拉框,支持搜索
  - 语言要求: 多选下拉框(TOEFL、IELTS等) + 分数范围
  - 费用范围: 滑块或数字输入
- **交互**:
  - 筛选条件改变时实时查询数据库
  - 显示加载状态和结果数量
  - 支持重置筛选条件
  - 保存筛选方案到预设模板

**学校/专业列表**:
- **布局**: 卡片列表或表格视图(可切换)
- **卡片样式**:
  - 学校logo/首字母圆形图标
  - 学校名称(粗体)
  - 位置信息(国家、城市)
  - 排名标签
  - 专业列表(可展开)
  - "添加到候选池"按钮
- **交互**:
  - 悬停效果:卡片阴影加深
  - 点击卡片查看详情
  - 点击"添加到候选池"按钮,显示成功提示
  - 已添加的项目显示"已添加"标签

#### 10.6.5 候选项目池

**候选列表设计**:
```
┌─────────────────────────────────────────┐
│ 项目1 - MIT - Computer Science          │
│ ┌───────────────────────────────────┐  │
│ │ [AI推荐] [冲刺] [待讨论]           │  │
│ │ 匹配度: 92分                       │  │
│ │ 推荐理由: 科研成果与目标项目...     │  │
│ │ 备注: 需补充推荐信                 │  │
│ │ 负责人: 王晓曼                     │  │
│ │ [编辑] [删除] [标记为通过]         │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**交互细节**:
1. **项目卡片**:
   - 根据档位使用不同边框颜色(冲刺-红色,匹配-蓝色,保底-绿色)
   - 来源标签区分AI推荐和人工添加(不同颜色和图标)
   - 状态标签显示当前状态(待讨论-黄色,通过-绿色,淘汰-红色)
   - AI推荐的项目显示匹配度分数和推荐理由
   - 悬停效果:阴影加深,显示更多操作按钮
2. **操作按钮**:
   - **编辑**: 打开编辑对话框,可修改项目信息、备注、档位等
   - **删除**: 显示确认对话框,确认后删除
   - **标记状态**: 下拉菜单选择(待讨论/通过/淘汰)
   - 按钮图标化,节省空间
3. **批量操作**:
   - 复选框选择多个项目
   - 批量编辑、删除、标记状态
   - 批量同步到最终选校列表
4. **筛选和排序**:
   - 按来源筛选(AI推荐/人工添加)
   - 按档位筛选(冲刺/匹配/保底)
   - 按状态筛选(待讨论/通过/淘汰)
   - 按匹配度排序(仅AI推荐项目)
   - 按添加时间排序

#### 10.6.6 状态反馈和提示

**成功提示**:
- AI推荐生成成功: Toast提示"已生成 20 条推荐"
- 添加候选成功: Toast提示"已添加 3 项到候选池"
- 保存成功: Toast提示"筛选方案已保存"
- Toast样式: 绿色背景,顶部居中显示,3秒后自动消失

**错误提示**:
- 网络错误: 红色Toast提示"网络连接失败,请重试"
- 数据错误: 红色Toast提示"数据格式错误,请联系管理员"
- 权限错误: 红色Toast提示"您没有权限执行此操作"
- 带重试按钮,支持手动重试

**加载状态**:
- 按钮加载: 旋转图标 + 文字变化
- 列表加载: 骨架屏或加载动画
- 全页加载: 顶部进度条

**空状态**:
- 候选池为空: 显示插图 + "暂无候选项目" + "开始筛选"按钮
- 推荐结果为空: 显示"未找到匹配的项目,请调整筛选条件"
- AI推荐失败: 显示错误信息和重试按钮

#### 10.6.7 响应式设计

**桌面端(≥1024px)**:
- 人工筛选工作台: 左侧筛选器 + 右侧列表(3:7比例)
- 候选池: 列表视图,显示完整信息

**平板端(768px-1023px)**:
- 人工筛选工作台: 筛选器可折叠,列表占满宽度
- 候选池: 卡片视图,每行2个

**移动端(<768px)**:
- 人工筛选工作台: 筛选器折叠为抽屉,列表占满宽度
- 候选池: 卡片视图,每行1个
- AI推荐对话框: 全屏模式
- 按钮文字改为图标,节省空间

#### 10.6.8 无障碍设计

1. **键盘导航**:
   - Tab键顺序: 筛选器 → 列表 → 候选池 → 操作按钮
   - Enter键触发主要操作
   - ESC键关闭对话框

2. **屏幕阅读器**:
   - 所有按钮添加 `aria-label`
   - 状态变化时播报(如"已添加3项到候选池")
   - 加载状态播报(如"正在生成推荐...")

3. **颜色对比度**:
   - 文字和背景对比度 ≥ 4.5:1
   - 按钮文字对比度 ≥ 3:1

4. **焦点指示**:
   - 清晰的焦点环(蓝色边框)
   - 焦点可见性不受悬停影响

#### 10.6.9 动画和过渡效果

1. **页面切换**: 淡入淡出效果,300ms
2. **对话框打开/关闭**: 缩放 + 淡入淡出,200ms
3. **列表项添加**: 从顶部滑入,300ms
4. **列表项删除**: 淡出 + 缩小,300ms
5. **状态变化**: 颜色过渡,200ms
6. **加载动画**: 旋转动画,平滑循环

#### 10.6.10 性能优化

1. **虚拟滚动**: 候选池超过50项时启用虚拟滚动
2. **防抖搜索**: 筛选条件输入防抖500ms
3. **懒加载**: 推荐结果分页加载,每页20项
4. **缓存策略**: 筛选结果缓存5分钟
5. **预加载**: 鼠标悬停在项目上时预加载详情数据

---

## 11. 总结

本方案实现了选校规划页面与全球数据库的完整协同,并调整了AI推荐的交互方式:

- ✅ **数据双向流通**: 从数据库读取,向数据库保存
- ✅ **数据关联**: 与学校库、专业库、成功案例、最终选校列表关联
- ✅ **功能完整**: 覆盖AI推荐(按钮触发)、人工筛选、会议协同、决策记录等所有功能
- ✅ **AI辅助设计**: AI推荐作为辅助工具,通过按钮触发,基于条件匹配
- ✅ **无缝协同**: AI推荐结果和人工筛选结果在同一个候选池中统一管理
- ✅ **直观易用**: 使用直观的条件匹配而非复杂的权重百分比
- ✅ **可扩展性**: 为后续功能扩展预留空间

### 核心改进点

1. **交互方式调整**: AI推荐不再作为单独标签页,改为按钮触发
2. **匹配方式优化**: 从权重百分比改为基于条件的匹配(国家、专业、成绩等)
3. **协同设计**: AI推荐和人工筛选无缝协同,统一在候选池中管理
4. **用户体验**: 更直观、更易用的设计,顾问更容易理解和使用

通过本方案,选校规划页面将更加实用和易用,AI真正成为顾问的智能助手,而不是独立的模块。
