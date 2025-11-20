# 案例库隐私与共享设计方案

## 一、功能概述

将案例库分为两个部分：
1. **我的案例** - 个人/机构的私有案例库，只有创建者可以查看和管理
2. **公共案例库** - 所有机构、导师共享的案例库，用于补充案例库生态

支持功能：
- 我的案例可以设置为"去敏上传"到公共案例库
- 上传前需要用户明确同意
- 上传到公共库时自动去敏处理（隐藏敏感信息）

## 二、数据库设计

### 2.1 需要添加的字段

在 `success_cases` 表中添加以下字段：

```sql
-- 案例类型和权限字段
ALTER TABLE success_cases
ADD COLUMN IF NOT EXISTS case_type TEXT DEFAULT 'private' CHECK (case_type IN ('private', 'public')),
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES employees(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_anonymized BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shared_to_public_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS anonymization_consent BOOLEAN DEFAULT false;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_success_cases_case_type ON success_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_success_cases_created_by ON success_cases(created_by);
```

### 2.2 字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `case_type` | TEXT | 案例类型：'private'（我的案例）或 'public'（公共案例库） |
| `created_by` | INTEGER | 创建者ID（关联到employees表） |
| `is_anonymized` | BOOLEAN | 是否已去敏处理 |
| `shared_to_public_at` | TIMESTAMPTZ | 分享到公共库的时间 |
| `anonymization_consent` | BOOLEAN | 用户是否同意去敏上传 |

### 2.3 去敏规则

上传到公共案例库时，自动进行以下去敏处理：

1. **学生信息去敏**：
   - `student_name` → 保留姓氏，名字用"*"替代（如：张*）
   - `student_id` → 设置为 NULL（取消关联）
   - 如果关联了学生，自动取消关联

2. **联系方式去敏**：
   - 如果案例中有任何联系方式信息，自动清除

3. **保留信息**：
   - 学校、专业、成绩、背景等学术信息保留
   - 导师信息保留（但可以设置为可选）
   - 录取结果、奖学金等结果信息保留

## 三、前端功能设计

### 3.1 页面布局

```
案例库页面
├── 顶部标签切换
│   ├── "我的案例" 标签
│   └── "公共案例库" 标签
├── 统计卡片（根据当前标签显示不同统计）
├── 筛选器
└── 案例列表/网格/表格视图
```

### 3.2 我的案例功能

1. **查看权限**：
   - 只显示当前用户创建的案例（`created_by = current_user_id`）
   - 显示案例总数、已分享数量等统计

2. **操作功能**：
   - 创建案例（默认创建为"我的案例"）
   - 编辑案例（只有创建者可以编辑）
   - 删除案例（只有创建者可以删除）
   - **分享到公共库**按钮（带确认对话框）

3. **分享到公共库流程**：
   ```
   点击"分享到公共库" 
   → 显示去敏确认对话框
   → 用户确认去敏规则
   → 执行去敏处理
   → 更新案例为 public 类型
   → 显示成功提示
   ```

### 3.3 公共案例库功能

1. **查看权限**：
   - 所有用户都可以查看
   - 显示所有 `case_type = 'public'` 的案例

2. **操作限制**：
   - 不能编辑（只读）
   - 不能删除
   - 可以查看详情
   - 可以收藏（可选功能）

3. **显示信息**：
   - 显示案例来源（创建者信息，可选）
   - 显示分享时间
   - 标注"已去敏"标识

### 3.4 去敏确认对话框

对话框内容：
- 标题：确认分享到公共案例库
- 说明文字：分享后案例将对所有用户可见，系统将自动进行去敏处理
- 去敏规则列表：
  - ✓ 学生姓名只保留姓的字母 比如张三 Z同学
  - ✓ 学生关联信息将被移除
  - ✓ 联系方式将被清除
  - ✓ 学术信息、相关经历将保留
- 确认按钮："确认分享"（紫色）
- 取消按钮："取消"

## 四、技术实现方案

### 4.1 类型定义更新

```typescript
export interface CaseStudy {
  // ... 现有字段
  case_type?: 'private' | 'public';
  created_by?: number;
  is_anonymized?: boolean;
  shared_to_public_at?: string;
  anonymization_consent?: boolean;
  // 创建者信息（通过查询获取）
  creator?: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}
```

### 4.2 服务层函数

```typescript
// 获取我的案例
async function getMyCases(userId: number): Promise<CaseStudy[]>

// 获取公共案例
async function getPublicCases(): Promise<CaseStudy[]>

// 分享案例到公共库（带去敏处理）
async function shareCaseToPublic(caseId: string, consent: boolean): Promise<CaseStudy>

// 去敏处理函数
function anonymizeCase(caseStudy: CaseStudy): Partial<CaseStudy>
```

### 4.3 去敏处理逻辑

```typescript
function anonymizeCase(caseStudy: CaseStudy): Partial<CaseStudy> {
  // 处理学生姓名
  let anonymizedName = caseStudy.student_name;
  if (anonymizedName && anonymizedName.length > 1) {
    const firstChar = anonymizedName[0];
    anonymizedName = firstChar + '*';
  }

  return {
    ...caseStudy,
    student_name: anonymizedName,
    student_id: null, // 取消学生关联
    is_anonymized: true,
    case_type: 'public',
    shared_to_public_at: new Date().toISOString(),
    anonymization_consent: true,
  };
}
```

## 五、UI/UX 设计

### 5.1 标签切换组件

```tsx
<Tabs>
  <Tab active={activeTab === 'my'} onClick={() => setActiveTab('my')}>
    我的案例 ({myCasesCount})
  </Tab>
  <Tab active={activeTab === 'public'} onClick={() => setActiveTab('public')}>
    公共案例库 ({publicCasesCount})
  </Tab>
</Tabs>
```

### 5.2 案例卡片标识

- **我的案例**：显示"私有"标签（灰色）
- **公共案例**：显示"公共"标签（蓝色）+ "已去敏"标识（如果已去敏）

### 5.3 操作按钮

- **我的案例**：
  - 编辑按钮（只有创建者可见）
  - 删除按钮（只有创建者可见）
  - 分享到公共库按钮（带确认对话框）

- **公共案例**：
  - 只读模式，无编辑/删除按钮
  - 可以显示来源信息

## 六、权限控制

### 6.1 查看权限

- **我的案例**：`created_by = current_user_id`
- **公共案例**：`case_type = 'public'`（所有人可见）

### 6.2 编辑权限

- 只有案例的创建者（`created_by`）可以编辑
- 公共案例库的案例不可编辑

### 6.3 删除权限

- 只有案例的创建者可以删除
- 公共案例库的案例不可删除（或需要管理员权限）

## 七、实施步骤

### 阶段一：数据库迁移
1. ✅ 添加 `case_type`、`created_by`、`is_anonymized` 等字段
2. ✅ 创建索引
3. ✅ 设置现有案例的默认值（`case_type = 'private'`）

### 阶段二：类型和服务层
1. 更新 `CaseStudy` 类型定义
2. 实现去敏处理函数
3. 更新案例服务函数（支持按类型查询）

### 阶段三：前端UI
1. 创建标签切换组件
2. 更新案例列表页面（支持切换视图）
3. 创建去敏确认对话框组件
4. 更新案例卡片（显示类型标识）

### 阶段四：功能完善
1. 实现分享到公共库功能
2. 实现权限控制
3. 更新统计卡片（分别统计）
4. 测试和优化

## 八、数据迁移策略

### 8.1 现有数据处理

```sql
-- 为现有案例设置默认值
UPDATE success_cases
SET 
  case_type = 'private',
  is_anonymized = false,
  anonymization_consent = false
WHERE case_type IS NULL;
```

### 8.2 创建者追溯

对于现有案例，如果无法追溯创建者：
- 设置为 `created_by = NULL`
- 在UI中显示为"未知创建者"
- 只有管理员可以编辑/删除

## 九、后续优化建议

1. **案例收藏功能**：用户可以收藏公共案例库的案例
2. **案例评分**：公共案例可以评分，帮助筛选优质案例
3. **案例来源标识**：显示案例来源机构/导师（可选）
4. **批量分享**：支持批量选择案例分享到公共库
5. **分享统计**：统计每个用户分享的案例数量
6. **去敏预览**：分享前预览去敏后的效果

## 十、安全考虑

1. **数据隐私**：确保去敏处理彻底，不泄露学生隐私
2. **权限验证**：后端验证用户权限，防止越权操作
3. **审计日志**：记录案例分享操作，便于追溯
4. **撤回功能**：允许用户撤回已分享的案例

