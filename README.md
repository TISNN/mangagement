# Infinite.ai - 留学全周期服务平台

## 项目概述

Infinite.ai是一个专注于留学全周期服务的数字化平台，连接学生、顾问和机构的智能生态系统。通过专业知识库和数字化服务，重新定义留学申请体验。我们致力于解决留学申请过程中的痛点问题，让每一位学生都能获得高质量的留学咨询服务。

## 系统架构

本项目采用React + TypeScript + Tailwind CSS开发，使用Vite作为构建工具。项目结构清晰，代码模块化，便于维护和扩展。

### 主要功能模块

#### 学生端
- **总览仪表盘**：展示申请进度、待办事项和重要通知
- **数据分析**：提供申请数据的可视化分析
- **材料管理**：集中管理申请材料和文档
- **社区交流**：与其他申请者交流经验
- **学习资源**：提供留学相关的学习资料

#### 机构端
- **客户管理**：管理学生信息和申请进度
- **数据分析**：分析业务数据和市场趋势
- **团队协作**：支持团队成员之间的协作
- **运营管理**：优化业务流程和提升效率
- **知识库管理**：创建和管理留学相关的知识资源，支持文档、视频、文章、模板四种类型

## 技术栈

- **前端框架**：React 18
- **类型系统**：TypeScript
- **样式方案**：Tailwind CSS
- **构建工具**：Vite
- **状态管理**：React Context API
- **路由管理**：React Router
- **动画效果**：Framer Motion
- **图标库**：Lucide Icons

## 开发指南

### 环境要求
- Node.js 16+
- npm 8+

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 自动化部署

本项目使用GitHub Actions实现自动化部署到Vercel平台。

### 🚀 快速开始

**只需3步启用自动部署:**

1. **运行配置脚本**
   ```bash
   ./setup-github-actions.sh
   ```

2. **提交配置文件**
   ```bash
   git add .github/
   git commit -m "ci: 添加GitHub Actions自动部署"
   ```

3. **推送到GitHub**
   ```bash
   git push origin main
   ```

完成! 每次推送代码到main分支都会自动部署到Vercel。

### 📖 详细文档

- **[快速开始](.github/QUICK_START.md)** - 最快的配置方法
- **[完整设置指南](.github/SETUP_GUIDE.md)** - 详细配置步骤
- **[环境变量配置](.github/ENV_SETUP.md)** - 环境变量说明
- **[文档索引](.github/INDEX.md)** - 所有文档导航

### 部署工作流

- **推送到main分支** → 自动部署到生产环境
- **创建Pull Request** → 自动创建预览部署

### 配置要求

需要在GitHub仓库中配置以下Secrets:
- `VERCEL_TOKEN` - Vercel访问令牌
- `VERCEL_ORG_ID` - Vercel组织ID  
- `VERCEL_PROJECT_ID` - Vercel项目ID
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥

详细获取方法请查看 [设置指南](.github/SETUP_GUIDE.md)

### 手动部署

如果需要手动部署:

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

## 项目规划与改进

### 当前状态
目前项目已完成基础功能开发，包括学生端和机构端的核心功能。

### 未来规划
1. 优化用户体验，提升界面交互
2. 增强数据分析能力，提供更多洞察
3. 完善社区功能，促进用户交流
4. 扩展学习资源库，提供更多优质内容

## 注意事项

本项目中的学生端功能专注于提供基础的申请管理和学习资源服务，高级功能如文书优化、选校推荐等服务由留学机构的专业顾问提供，以保证服务质量和专业性。

## 联系方式

- **客服热线**：400-XXX-XXXX（7*24小时）
- **商务合作**：010-XXXX-XXXX
- **邮箱地址**：contact@infinite.ai 

# 教育咨询管理系统

这是一个专为教育咨询机构设计的管理系统，用于管理学生、财务、考勤和服务项目。系统基于React和Supabase构建，提供了直观的用户界面和强大的数据管理功能。

## 主要功能

### 1. 财务管理
- 记录所有收入和支出交易
- 支持按人员、项目、服务类型、分类和账户进行关联
- 提供Excel批量导入功能
- 财务报表和统计数据可视化

### 2. 学生管理
- 多服务类型支持（语言培训、标准化考试、学术辅导、研究指导、申请服务、作品集指导等）
- 服务开始和结束时间记录
- 学生信息详细页面
- 导师关系管理

### 3. 考勤系统
- 员工打卡功能
- 个人和团队考勤记录查看
- 考勤统计

### 4. 仪表盘
- 关键数据概览
- 待办事项
- 个人欢迎信息

## 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 状态管理：React Hooks
- 数据库：Supabase (PostgreSQL)
- 数据可视化：自定义组件
- 文件处理：XLSX库

## 数据库结构

系统使用Supabase（基于PostgreSQL）作为数据库。主要数据表包括：

### 财务相关表
- `finance_transactions`: 存储交易记录
- `finance_categories`: 交易分类
- `finance_accounts`: 财务账户
- `finance_service_types`: 服务类型

### 人员和项目相关表
- `people`: 人员信息（学生、客户、合作伙伴等）
- `projects`: 项目信息

## 开始使用

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 使用说明

### 1. 财务管理
- 进入"财务管理"页面可以查看所有交易
- 点击"添加交易"按钮创建新交易
- 使用Excel批量导入功能可以一次导入多条交易记录
- 交易可以按日期、金额、类型等进行筛选

### 2. 学生管理
- 在"学生管理"页面可以查看所有学生
- 支持按服务类型和状态筛选学生
- 点击学生行可查看学生详细信息和服务记录
- 学生可以同时参与多种服务项目

## 常见问题解答 (FAQ)

### 1. 学生数据保存失败，提示"Key (id)=(9) already exists"

**问题描述**：
在添加新学生时偶尔会出现错误提示"Key (id)=(9) already exists"，这是因为数据库序列值与已存在记录产生了主键冲突。

**解决方案**：
系统已进行优化，当检测到ID冲突时会自动尝试以下步骤：
1. 删除请求中的ID字段，让数据库自动生成新ID
2. 若仍然冲突，会查询当前最大ID并手动生成新的ID值
3. 使用新生成的ID重新尝试保存学生数据

**技术说明**：
- 数据库使用 `students_id_seq` 序列生成新的学生ID
- 系统会记录详细错误日志以便于跟踪问题
- 如果问题频繁发生，请联系技术支持重置ID序列

### 3. 考勤系统
- 在首页的欢迎信息下方可以进行打卡
- "考勤管理"页面可查看考勤记录
- 可切换查看个人或团队考勤情况

## 系统需求

- Node.js 16+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

## 授权协议

本项目为内部使用软件，未经授权不得分发或使用。

# 留学服务管理系统

本系统是一个专门为留学服务机构设计的全功能管理平台，用于管理学生、服务、导师和财务等各方面信息。

## 主要功能

### 学生管理模块

学生管理模块是系统的核心部分，提供了完整的学生信息管理功能，包括：

#### 1. 学生列表浏览
- 查看所有学生基本信息和服务状态
- 按状态分类：活跃、休学、毕业、退学等
- 快速搜索学生姓名或邮箱
- 按服务类型和状态进行筛选

#### 2. 学生信息管理
- 添加新学生：包含基本信息和服务选择
- 查看学生详情：个人信息、教育背景、服务情况
- 修改学生信息和状态

#### 3. 服务管理
- 为学生添加多种服务：语言培训、标化培训、全包申请等
- 跟踪服务进度和状态
- 分配导师并查看服务历史

#### 4. 数据导出
- 导出基础学生信息到CSV文件
- 导出详细学生和服务数据，包含服务详情和状态

### 如何使用学生管理模块

#### 浏览学生
1. 导航至管理后台的"学生管理"页面
2. 使用顶部的搜索框按名称或邮箱搜索学生
3. 使用筛选按钮打开高级筛选面板，按状态或服务类型筛选
4. 点击标签页切换不同状态的学生视图

#### 添加新学生
1. 点击页面右上角的"添加学生"按钮
2. 填写必要的学生基本信息（姓名为必填）
3. 选择至少一种服务类型
4. 点击"添加学生"按钮提交

#### 查看学生详情
1. 在学生列表中点击任意学生行
2. 查看学生的详细信息、服务记录和进度

#### 导出学生数据
1. 点击页面右上角的"导出"按钮
2. 选择导出基础信息或详细信息
3. 基础信息：包含学生基本信息和服务摘要
4. 详细信息：分别导出学生信息和服务详情两个CSV文件

## 技术栈

- 前端：React, TypeScript, TailwindCSS
- 后端：Supabase (PostgreSQL)
- 状态管理：React Hooks
- 数据可视化：适用的图表库

## 数据模型

### 主要实体

1. **Person**: 所有人员的基本信息
2. **StudentProfile**: 学生特有的信息和教育背景
3. **StudentService**: 学生接受的服务记录
4. **ServiceType**: 服务类型定义
5. **MentorProfile**: 导师信息和专业领域

## 开发与部署

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产部署
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 未来计划

- 实现学生服务进度的可视化展示
- 添加导师分配和管理系统
- 整合财务模块，实现服务付款追踪
- 实现学生申请材料的在线管理和协作
- 提供数据分析和业务报表功能

## 服务进度跟踪功能

### 功能概述
服务进度跟踪功能允许管理员和导师记录和查看学生服务的进度情况。主要功能包括：

1. 进度更新
   - 通过进度条直观显示服务完成度
   - 支持0-100%的进度记录（以里程碑形式保存，如"25%"）
   - 可添加进度说明、已完成项目和下一步计划

2. 进度历史记录
   - 记录每次进度更新的详细信息
   - 包含更新时间、里程碑、进度说明等信息
   - 以时间线形式展示进度发展历程

3. 任务管理
   - 记录已完成的任务项目
   - 计划下一步的工作内容
   - 支持JSON格式存储结构化数据

### 使用方法

1. 更新服务进度
   - 在学生详情页面的服务卡片中点击"更新进度"按钮
   - 在弹出的模态框中设置新的进度值
   - 添加进度说明、已完成项目和下一步计划
   - 点击"更新进度"保存

2. 查看进度历史
   - 在学生详情页面点击任意服务卡片
   - 在页面下方查看该服务的进度历史记录
   - 历史记录按时间倒序排列，以时间线形式展示
   - 查看每个阶段的完成项目和下一步计划

### 数据库结构

系统使用现有的 `service_progress` 表记录进度历史：

```sql
-- 服务进度表结构
CREATE TABLE service_progress (
    id BIGSERIAL PRIMARY KEY,
    student_service_id BIGINT,
    recorded_by BIGINT,
    progress_date TIMESTAMP WITH TIME ZONE,
    milestone VARCHAR,         -- 进度里程碑，如 "25%"
    description TEXT,          -- 进度描述
    notes TEXT,                -- 额外备注
    completed_items JSONB,     -- 已完成项目，JSON格式
    next_steps JSONB,          -- 下一步计划，JSON格式
    attachments JSONB,         -- 附件，JSON格式
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    employee_ref_id BIGINT     -- 员工引用ID
);
```

在 `student_services` 表中，使用 `progress` 字段记录当前进度值。

### API接口

系统提供以下API接口用于服务进度管理：

1. 添加服务进度记录
   ```typescript
   addServiceProgress(progress: ServiceProgressRecord): Promise<void>
   ```

2. 获取服务进度历史记录
   ```typescript
   getServiceProgressHistory(studentServiceId: number): Promise<ServiceProgressHistory[]>
   ```

### 数据测试

系统提供了测试数据SQL脚本用于添加初始进度记录：
`service_progress_test_data.sql`

### 注意事项

1. 进度值以百分比形式存储（如"25%"）
2. 已完成项目和下一步计划使用JSON格式存储，每项包含"content"字段
3. 每次更新服务进度时会同时更新`student_services`表中的进度值
4. 若要上传附件，可以使用attachments字段（当前版本未实现） 

# 团队聊天功能

本系统提供了一个基于Supabase实时数据库的团队内部聊天系统，支持多频道聊天、实时消息推送和消息历史记录查询等功能。

## 功能特点

- 实时消息发送与接收
- 多频道支持（公共/私有）
- 私聊功能（一对一聊天）
- 消息历史记录
- 用户在线状态
- 频道搜索功能
- 创建新频道
- 查看频道成员
- 未读消息提醒

## 数据库结构

### 表结构

1. **chat_channels**: 聊天频道表
   - id: UUID (主键)
   - name: 频道名称
   - description: 频道描述
   - is_public: 是否公开
   - created_at: 创建时间
   - type: 频道类型（'channel'或'direct'）

2. **chat_messages**: 聊天消息表
   - id: UUID (主键)
   - channel_id: 频道ID，关联chat_channels表
   - sender_id: 发送者ID，关联employees表
   - content: 消息内容
   - created_at: 发送时间

3. **channel_members**: 频道成员表
   - id: UUID (主键)
   - channel_id: 频道ID，关联chat_channels表
   - member_id: 成员ID，关联employees表
   - joined_at: 加入时间

4. **direct_messages**: 私聊关系表
   - id: UUID (主键)
   - channel_id: 频道ID，关联chat_channels表
   - user_id_1: 用户1 ID，关联employees表
   - user_id_2: 用户2 ID，关联employees表
   - created_at: 创建时间
   
5. **unread_messages**: 未读消息计数表
   - id: UUID (主键)
   - channel_id: 频道ID，关联chat_channels表
   - user_id: 用户ID，关联employees表 
   - count: 未读消息数量
   - last_read: 最后阅读时间

## 使用说明

### 进入聊天

1. 在导航栏中点击"团队聊天"图标进入聊天界面
2. 左侧显示所有可访问的聊天频道列表和可私聊的用户列表
3. 点击频道名称或用户名进入相应的聊天室

### 发送消息

1. 在聊天窗口底部的输入框中输入要发送的消息
2. 按回车键或点击发送按钮发送消息
3. 支持基本的文本格式

### 频道管理

1. 系统默认创建一个名为"公共频道"的聊天室，所有用户自动加入
2. 点击搜索框旁边的"+"按钮可以创建新的聊天频道
3. 创建频道时可以选择公开或私有类型
4. 点击频道头部的用户图标可以查看该频道的所有成员

### 私聊功能

1. 在"私聊"标签页下可以查看所有一对一聊天
2. 点击用户开始新的私聊会话
3. 私聊窗口显示与对方的聊天历史
4. 未读私聊消息会显示消息数量提醒

## 实现原理

本功能使用Supabase的实时订阅功能实现消息的即时推送和接收：

```typescript
// 设置实时订阅
const subscription = supabase
  .channel(`channel-${channelId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `channel_id=eq.${channelId}`
  }, (payload) => {
    // 处理新消息
    const newMessage = payload.new;
    // 更新UI显示
  })
  .subscribe();
```

## 权限控制

此聊天功能通过Supabase的Row Level Security (RLS)策略来控制权限：

1. 公共频道：所有员工都可以查看和发送消息
2. 私有频道：只有频道成员可以查看和发送消息
3. 私聊会话：只有会话双方可以查看和发送消息
4. 频道管理：只有管理员可以创建频道和管理频道成员

```sql
-- 消息查看权限
CREATE POLICY "允许查看公开频道或自己是成员的频道的消息" ON "public"."chat_messages"
  USING (
    EXISTS (
      SELECT 1 FROM chat_channels c 
      WHERE c.id = channel_id AND (
        c.is_public = true OR 
        EXISTS (SELECT 1 FROM channel_members cm WHERE cm.channel_id = c.id AND cm.member_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM direct_messages dm WHERE dm.channel_id = c.id AND (dm.user_id_1 = auth.uid() OR dm.user_id_2 = auth.uid()))
      )
    )
  );
```

## 组件结构

- `TeamChatPage`: 主聊天页面组件
- `CreateChannelModal`: 创建频道的模态框组件
- `ChannelMembersModal`: 查看频道成员的模态框组件

## 完成总结

我们已经成功地完成了团队聊天功能的开发工作！现在，让我简要总结一下我们所实现的功能：
- 创建了基于Supabase实时数据库的团队聊天系统
- 实现了多频道聊天功能，包括公共和私有频道
- 添加了私聊功能，支持一对一聊天
- 添加了未读消息提醒功能
- 实现了实时消息推送和接收功能
- 支持消息历史记录查询和展示
- 实现了频道搜索功能
- 添加了创建新频道的功能
- 提供了查看频道成员的功能
- 完善了项目文档，包括功能说明、数据结构和使用方法

该聊天功能现在已经可以满足团队内部沟通的基本需求，用户可以通过导航栏进入聊天页面，选择不同的频道或私聊对象进行交流，也可以创建新的频道以满足特定的沟通需求。

在后续的开发中，我们可以进一步丰富这个功能，例如：
- 添加文件和图片上传功能
- 实现消息编辑和删除功能
- 添加@提及用户功能
- 完善频道管理界面，包括添加/移除成员的功能
- 添加表情反应和贴纸功能

这些功能将在未来的迭代中逐步实现，以满足团队更加多样化的沟通需求。

# 留学项目管理系统

这是一个专为留学顾问公司设计的管理系统，包含学生管理、学校库、留学服务管理等功能。

## 主要功能

- 学生信息管理
- 顾问/导师管理
- 财务交易记录
- 服务进度跟踪
- 世界大学数据库
- 聊天/消息系统

## 技术栈

- 前端: React + TypeScript + Vite
- 后端: Supabase (PostgreSQL数据库)
- 样式: TailwindCSS

## 开发环境设置

1. 克隆仓库
```bash
git clone <仓库URL>
cd <项目目录>
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

## 数据导入工具

项目包含一些数据导入工具，用于导入学校、排名等数据。

### QS世界大学排名导入

该工具可以将QS世界大学排名数据导入到系统的学校数据库中。

#### 使用方法

1. 安装导入工具依赖
```bash
cd import-tools
npm install
```

2. 运行导入脚本
```bash
npm run import-qs
```

脚本会自动读取项目根目录下的`2025 QS World University Rankings 2.2 (For qs.com).csv`文件，并将数据导入到Supabase数据库中。

## 数据库结构

系统使用Supabase作为后端数据库，主要表包括：

- students: 学生信息
- schools: 学校信息
- programs: 专业课程信息
- mentors: 导师信息
- employees: 员工信息
- service_types: 服务类型
- student_services: 学生服务记录
- service_progress: 服务进度记录
- finance_transactions: 财务交易记录
- chat_channels: 聊天频道
- chat_messages: 聊天消息

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## JSON到CSV转换工具

项目中包含一个将JSON文件转换为CSV格式的Python脚本，主要用于处理学校专业信息数据。

### 功能说明

`json_to_csv_converter.py` 脚本可以：

1. 递归遍历 `/Users/evanxu/Downloads/project/src/programme` 目录及其所有子目录
2. 查找所有 `.json` 文件并读取内容
3. 提取JSON文件中的字段（如学校名称、专业名称、英文名称等）
4. 自动从文件路径中提取国家/地区信息
5. 将所有数据整合到一个CSV文件中输出
6. 支持按国家/地区单独处理，可以只转换特定国家的专业数据

### 使用方法

**处理所有国家的数据：**
```bash
python3 json_to_csv_converter.py
```

**处理特定国家的数据：**
```bash
python3 json_to_csv_converter.py --country uk
```

**指定输出文件：**
```bash
python3 json_to_csv_converter.py --country australia --output australia_programs.csv
```

### 可用的国家/地区文件夹

- australia（澳大利亚）
- uk（英国）
- hongkong（香港）
- singapore（新加坡）
- macau（澳门）
- us（美国）

### 输出文件

脚本执行后，将生成以下文件：

- 处理所有国家时：`/Users/evanxu/Downloads/project/programmes.csv`
- 处理特定国家时：`/Users/evanxu/Downloads/project/{国家名}_programmes.csv`
- 如果指定了`--output`参数，则输出到指定文件路径

### CSV文件字段说明

- school_name: 学校名称
- major_name: 专业名称
- ename: 英文名称
- tags: 标签（如学科分类）
- introduction: 专业介绍
- requirements: 入学要求
- objectives: 专业目标
- language_requirements: 语言要求
- curriculum: 课程设置
- success_cases: 成功案例
- country: 国家/地区（从文件路径提取）
- filename: 原始JSON文件名

# 新加坡大学专业数据导入工具

这个项目包含用于将新加坡大学专业数据批量导入到Supabase数据库的工具。以下是三种不同的导入方法，可以根据需要选择最适合的一种。

## 文件说明

项目包含以下主要文件：

- `process_programs.py` - 处理原始CSV数据并转换为SQL和JSON格式
- `process_programs_update.py` - 更新版的处理脚本，修复了tuition_fee字段的处理
- `all_batches.sql` - 合并后的所有SQL批次文件，包含全部导入语句
- `singapore_programs_processed.json` - 处理后的JSON格式数据
- `import_programs.py` - 使用Supabase Python SDK解析SQL并导入数据
- `import_programs_simple.py` - 使用Supabase SQL API直接执行SQL语句导入数据
- `import_programs_rest.py` - 使用Supabase REST API直接导入JSON数据

## 导入方法选择

根据不同情况，可以选择以下三种导入方法之一：

1. **Python SDK解析SQL导入** (`import_programs.py`)
   - 通过解析SQL文件提取记录，并使用Supabase Python SDK导入
   - 适合需要在导入前对数据进行灵活处理的情况

2. **SQL API直接执行** (`import_programs_simple.py`)
   - 直接使用Supabase SQL API执行SQL语句
   - 处理大批量SQL文件导入，保留原始SQL语句的完整性

3. **REST API直接导入JSON** (`import_programs_rest.py`)
   - 使用Supabase REST API直接从JSON数据导入
   - 最简单可靠的方法，不依赖第三方SDK

## 使用方法

### 安装依赖

```bash
pip install supabase requests
```

### 配置

在使用前，需要修改脚本中的Supabase配置：

1. 打开要使用的导入脚本
2. 找到以下配置行并更新为实际值：

```python
SUPABASE_URL = "https://swyajeiqqewyckzbfkid.supabase.co"
SUPABASE_KEY = "你的Supabase服务密钥"  # 需要替换为实际的服务密钥
```

### 执行导入

根据需要执行对应的脚本：

```bash
# 方法1: 使用Python SDK解析SQL
python import_programs.py

# 方法2: 使用SQL API执行SQL语句
python import_programs_simple.py

# 方法3: 使用REST API导入JSON数据
python import_programs_rest.py
```

## 脚本功能详解

### import_programs.py

这个脚本通过以下步骤工作：

1. 读取SQL文件(`all_batches.sql`)
2. 使用正则表达式解析出每个INSERT语句中的值
3. 将解析出的值构造成Python字典
4. 使用Supabase SDK批量插入记录
5. 处理任何错误并报告结果

### import_programs_simple.py

这个脚本通过以下步骤工作：

1. 读取SQL文件(`all_batches.sql`)
2. 将SQL文件分割成单个INSERT语句
3. 将多个语句合并成事务块
4. 使用Supabase SQL API直接执行这些事务
5. 如果批量执行失败，会尝试逐条执行

### import_programs_rest.py

这个脚本通过以下步骤工作：

1. 读取JSON文件(`singapore_programs_processed.json`)
2. 确定数据库中已有的记录数，避免重复导入
3. 使用REST API发送POST请求，批量插入记录
4. 如果批量插入失败，会尝试逐条插入
5. 显示导入统计信息

## 错误处理

所有脚本都包含错误处理逻辑：

- 批量处理失败时会尝试逐条处理
- 导入过程中会记录成功和失败的记录数
- 每个批次之间有短暂暂停，避免触发API限制

## 注意事项

- 请确保在执行导入前已创建好目标表结构
- 默认会按10条记录为一批进行导入，可在脚本中调整批次大小
- 敏感的API密钥不应硬编码在脚本中，建议使用环境变量

# CSV数据导入Supabase脚本

这个脚本用于将CSV数据文件导入到Supabase数据库的programs表中。

## 功能特点

- 读取CSV文件中的项目数据
- 自动将数据导入到Supabase数据库的programs表
- 支持批量导入，避免大数据量导致的超时问题
- 提供清晰的导入过程日志
- 支持两种导入模式：仅插入新记录或更新已存在的记录
- 自动根据学校名称（school字段）查找对应的school_id
- 支持学校英文名和中文名的匹配查找
- 跳过找不到匹配学校的记录
- 命令行参数支持，便于灵活使用

## 前提条件

- Node.js 18.x 或更高版本
- 已有Supabase账户和项目
- 数据库中已创建了schools表和programs表
- schools表中必须包含学校数据（至少有id、en_name和cn_name字段）

## 安装步骤

1. 克隆或下载此仓库到本地
2. 安装依赖包:
   ```
   npm install
   ```

## CSV文件格式要求

CSV文件应包含以下字段（标题行必须与下面列出的字段名称完全匹配）:

- `school` - 学校名称（必填，除非已有school_id）
- `school_id` - 对应schools表中的id（可选，如果提供则优先使用）
- `en_name` - 英文名称
- `duration` - 持续时间
- `apply_requirements` - 申请要求
- `cn_name` - 中文名称
- `language_requirements` - 语言要求
- `curriculum` - 课程
- `tags` - 标签
- `objectives` - 目标
- `faculty` - 院系
- `category` - 类别
- `entry_month` - 入学月份
- `interview` - 面试
- `analysis` - 分析
- `url` - 网址
- `tuition_fee` - 学费
- `degree` - 学位

CSV文件示例（第一行是标题行）:
```
school,en_name,duration,apply_requirements,cn_name,language_requirements,curriculum,tags,objectives,faculty,category,entry_month,interview,analysis,url,tuition_fee,degree
"哈佛大学","Business Administration","2 years","Bachelor's degree","工商管理","IELTS 6.5","Marketing, Finance","MBA,Business","Leadership","Business School","MBA","September","Yes","Good career prospects","https://example.com/mba","$50,000","Master"
```

## 学校名称匹配规则

脚本使用以下规则查找学校ID:

1. 首先检查CSV记录中是否已有school_id字段且不为空，如有则直接使用
2. 如果school_id为空，则使用school字段查找匹配的学校ID:
   - 优先匹配完全一致的学校名称（不区分大小写）
   - 如果没有完全匹配，尝试部分匹配（学校名称互相包含的情况）
3. 如果找不到匹配的学校ID，该记录将被跳过并记录在日志中

## 使用方法

1. 准备您的CSV数据文件，并将其命名为`programs_data.csv`，放在脚本同一目录下
   - 如果您的文件名不同，可以在运行脚本时指定

2. 确保`.env`文件包含Supabase的连接信息:
   ```
   VITE_SUPABASE_URL=你的Supabase项目URL
   VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
   ```

3. 运行导入脚本:

   **基本用法**
   ```
   npm start
   ```
   
   **使用自定义CSV文件**
   ```
   node import_programs.js ./your_custom_file.csv
   ```
   
   **使用更新模式（更新已存在的记录）**
   ```
   node import_programs.js ./programs_data.csv upsert
   ```
   
   **查看帮助**
   ```
   node import_programs.js --help
   ```

4. 观察控制台输出，确认导入过程是否成功

## 导入模式说明

脚本支持两种导入模式:

1. **insert模式（默认）**: 仅插入新记录，如果遇到已存在的记录（根据school_id和en_name判断），将会报错并跳过

2. **upsert模式**: 插入新记录，同时更新已存在的记录（根据school_id和en_name判断）

## 故障排除

常见问题及解决方法:

1. **连接错误**: 确保您的Supabase URL和密钥正确，并且网络连接正常

2. **字段不匹配**: 如果CSV文件的列名与脚本中的字段名不一致，请调整`import_programs.js`文件中的映射关系

3. **找不到匹配学校**: 确保CSV中的school字段与schools表中的en_name或cn_name相匹配，也可以直接提供school_id

4. **数据格式问题**: 检查CSV文件中的数据格式是否正确，特别是日期、数字等特殊类型

5. **批处理失败**: 如果导入失败，可以尝试在脚本中减小`BATCH_SIZE`常量的值（默认为50）

## 脚本执行流程

1. 加载schools表中的所有学校数据，创建名称到ID的映射
2. 读取并解析CSV文件
3. 对每条记录，查找对应的school_id
4. 过滤掉找不到匹配学校的记录
5. 批量处理有效记录
6. 根据指定的模式（insert或upsert）导入数据
7. 输出导入结果摘要

## 注意事项

- 此脚本默认以insert模式运行，只会添加新记录
- 如需更新已存在的记录，请使用upsert模式
- 大量数据导入可能需要较长时间，请耐心等待
- 学校名称匹配不区分大小写，支持部分匹配
- school_id字段会自动转换为数字类型（如果是有效数字）

## 许可证

MIT

## 作者

[您的名字]

## 最近更新

### 版本 2.0.0 (2025-11-02) 🎉 重大更新

**任务管理模块重大升级**

#### 核心功能
- **任务域系统**: 支持4个业务域分类（通用/学生服务/公司运营/市场营销）
- **关联对象系统**: 统一管理学生/线索/员工关联
- **会议关联**: 任务可关联会议，支持快速创建会议
- **多维筛选**: 9个筛选维度（任务域、关联类型、学生、会议等）
- **可视化统计**: 任务域分布统计面板

#### 数据库更新
- 新增 `task_domain`, `linked_entity_type`, `linked_entity_id` 字段
- 新增 `meeting_id` 字段并建立外键关联
- 创建5个性能索引优化查询
- 创建4个统计视图
- 自动触发器同步会议状态

#### UI/UX改进
- **筛选器升级**: 彩色标签系统（7种颜色区分不同维度）
- **统计面板**: 新增任务域分布可视化
- **三视图优化**: 列表/看板/日历视图统一显示任务域和会议标识
- **侧边栏增强**: 11个可编辑字段，支持任务域、关联对象、会议编辑
- **快速创建**: QuickMeetingCreator组件，一键创建会议并关联

#### 历史数据兼容
- 自动数据回填策略
- LegacyTaskBanner提示横幅
- 向后兼容保证平滑升级

#### 其他优化
- 删除默认库克头像，使用DiceBear API动态生成
- 学生筛选只显示已关联学生
- 会议筛选只显示已关联会议

**📚 相关文档**:
- `2025-11-02_完整功能更新报告.md` - 完整更新说明
- `任务域和关联对象功能使用指南.md` - 任务域使用手册
- `任务与会议关联功能使用指南.md` - 会议关联手册
- `database_migrations/001_add_task_domain_and_linked_entity.sql` - 数据库迁移1
- `database_migrations/002_add_meeting_relation_to_tasks.sql` - 数据库迁移2

**⚠️ 部署注意**: 需要执行2个数据库迁移SQL才能使用新功能

---

### 版本 1.4.0 (2025-10-16)

- **UI优化**: 学生管理页面重大升级，新增卡片视图模式
  - 实现了现代化的卡片式布局，提升视觉效果和用户体验
  - 添加视图切换功能，支持卡片视图和传统表格视图切换
  - 卡片设计采用渐变背景、阴影效果和悬浮动画
  - 优化信息层次结构，突出重点信息
  - 增强响应式设计，支持多种屏幕尺寸
  - 改进状态指示器，使用彩色圆点显示学生活跃状态
  - 优化服务展示，每个卡片显示前2个服务项目
  - 添加导师团队头像展示，采用堆叠式设计
  - 实现悬浮时显示操作按钮的交互效果
  - 保留原有表格视图供需要详细数据的用户使用

### 版本 1.3.0 (2024-07-18)

- **功能增强**: 实现了交互式选校助手功能，支持在SchoolAssistantPage页面直接进行选校
- **UI优化**: 添加了右侧收藏侧边栏，用户可以直接在学校助手页面添加学校到收藏夹并设置申请策略
- **用户体验**: 新增了选校指南弹窗，帮助用户了解如何使用选校功能
- **功能改进**: 学校和专业卡片支持一键收藏，自动显示收藏侧边栏

### 版本 1.2.0 (2024-07-16)

- **功能增强**: 添加了"选校记录"按钮，用户可以直接从学校助手页面查看历史选校方案
- **UI改进**: 在选校管理页面优化了返回按钮设计，并改进了布局
- **用户体验**: 直接通过URL参数支持打开历史记录视图，便于快速访问

### 版本 1.1.0 (2024-07-15)

- **功能增强**: 完善了"开始选校"按钮功能，现在可以直接从学校助手页面导航到选校管理页面
- **UI改进**: 在选校管理页面添加了返回按钮，方便用户在两个页面之间切换
- **bug修复**: 修复了学校筛选条件不正确应用的问题
- **性能优化**: 改进了学校和专业数据的加载速度

# 案例数据处理与数据库导入工具

本项目包含两个脚本，用于处理成功案例CSV数据文件并将其导入到数据库中。

## 文件说明

1. `casedata/process_case_csv.py` - 处理原始CSV文件，提取背景字段
2. `casedata/upload_to_database.py` - 将处理后的CSV数据导入到数据库
3. `casedata/upload_to_supabase.py` - 专门用于上传数据到Supabase数据库

## 处理CSV文件

这个脚本会读取原始的CSV文件，从`基本背景`字段中提取信息：
- 第一个元素作为`admission_year`
- 第二个元素中提取GPA值作为`gpa`
- 第三个及之后的所有元素作为`language_scores`

### 使用方法

```bash
cd /Users/evanxu/Downloads/project
python casedata/process_case_csv.py
```

脚本会处理`casedata/case.csv`文件，并将结果保存为`casedata/case_processed.csv`。

## 数据库导入

### 上传到普通数据库

这个脚本会将处理后的CSV数据导入到普通数据库，并处理学校和项目的映射关系。

```bash
cd /Users/evanxu/Downloads/project

# 使用SQLite数据库
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type sqlite --db-path database.db

# 使用MySQL数据库
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type mysql --host localhost --user root --password your_password --database your_db

# 使用PostgreSQL数据库
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type postgresql --host localhost --port 5432 --user postgres --password your_password --database your_db

# 试运行模式（不会实际写入数据库）
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type sqlite --db-path database.db --dry-run
```

### 上传到Supabase数据库

这个专用脚本支持将处理后的CSV数据上传到Supabase数据库。

#### 安装依赖

```bash
pip install supabase
```

#### 使用方法

```bash
cd /Users/evanxu/Downloads/project

# 上传到Supabase
python casedata/upload_to_supabase.py --csv casedata/case_processed.csv --url "https://your-project-id.supabase.co" --key "your-supabase-api-key"

# 试运行模式（不会实际写入数据库）
python casedata/upload_to_supabase.py --csv casedata/case_processed.csv --url "https://your-project-id.supabase.co" --key "your-supabase-api-key" --dry-run
```

#### 参数说明

- `--csv`: CSV文件路径（必需）
- `--url`: Supabase项目URL（必需）
- `--key`: Supabase API密钥（必需）
- `--dry-run`: 试运行模式，不会实际写入数据库

## 数据映射

脚本会自动处理以下映射关系：
1. 根据`cn_name`字段匹配schools表中的学校
2. 根据学校ID和`applied_program`字段匹配programs表中的项目
3. 如果直接匹配失败，会尝试模糊匹配

## 日志

程序运行会生成详细的日志文件：
- 普通数据库上传：`db_upload_YYYYMMDD_HHMMSS.log`
- Supabase上传：`supabase_upload_YYYYMMDD_HHMMSS.log`

# 数据处理脚本

## CSV文件处理脚本

本项目包含多个用于处理CSV数据文件和上传数据到数据库的脚本。

### casedata/process_case_csv.py

此脚本用于处理原始案例数据CSV文件，提取和转换关键字段，如背景、GPA和语言成绩。

使用方法：
```bash
python casedata/process_case_csv.py
```

脚本会读取`case.csv`文件，处理后生成`case_processed.csv`文件。

### casedata/upload_to_database.py

此脚本用于将处理后的CSV数据上传到各类关系型数据库（SQLite、MySQL、PostgreSQL）。

使用方法：
```bash
python casedata/upload_to_database.py --csv [CSV文件路径] --db-type [数据库类型] [其他参数]
```

参数说明：
- `--csv`：CSV文件路径（必填）
- `--db-type`：数据库类型，可选值为sqlite、mysql、postgresql，默认为sqlite
- `--db-path`：SQLite数据库文件路径（使用SQLite时必填）
- `--host`：数据库主机地址，默认为localhost
- `--port`：数据库端口
- `--user`：数据库用户名
- `--password`：数据库密码
- `--database`：数据库名称
- `--dry-run`：试运行模式，不会实际写入数据库

示例：
```bash
# 上传到SQLite数据库
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type sqlite --db-path ./database.sqlite

# 上传到MySQL数据库
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type mysql --host localhost --user root --password mypassword --database mydb

# 试运行模式
python casedata/upload_to_database.py --csv casedata/case_processed.csv --db-type postgresql --host localhost --user postgres --database mydb --dry-run
```

### casedata/upload_to_supabase.py

此脚本专门用于将处理后的CSV数据上传到Supabase数据库。它会自动处理学校和项目的映射，以便将数据正确地关联到Supabase中的相应表。

使用方法：
```bash
python casedata/upload_to_supabase.py --csv [CSV文件路径] --url [Supabase项目URL] --key [Supabase API密钥] [--dry-run]
```

参数说明：
- `--csv`：CSV文件路径（必填）
- `--url`：Supabase项目URL（必填）
- `--key`：Supabase API密钥（必填）
- `--dry-run`：试运行模式，不会实际写入数据库

示例：
```bash
# 上传到Supabase数据库
python casedata/upload_to_supabase.py --csv casedata/case_processed.csv --url https://your-project-id.supabase.co --key your-api-key

# 试运行模式
python casedata/upload_to_supabase.py --csv casedata/case_processed.csv --url https://your-project-id.supabase.co --key your-api-key --dry-run
```

脚本执行过程中会生成详细的日志，记录处理的数据和可能出现的问题。日志文件格式为`supabase_upload_YYYYMMDD_HHMMSS.log`。

## 日志说明

上述脚本在执行过程中会生成日志文件：
- `upload_to_database.py`生成的日志文件格式为`db_upload_YYYYMMDD_HHMMSS.log`
- `upload_to_supabase.py`生成的日志文件格式为`supabase_upload_YYYYMMDD_HHMMSS.log`

日志文件包含详细的执行步骤、成功/失败记录以及可能的错误信息，方便排查问题。

# Supabase集成指南

## 🔐 认证系统

本系统已实现完整的 Supabase Auth 认证功能!

### 功能特性

- ✅ 邮箱密码登录
- ✅ 用户注册(学生)
- ✅ 忘记密码 / 密码重置
- ✅ 自动关联 Auth 用户到业务表(employees/students)
- ✅ 全局认证状态管理
- ✅ 路由守卫保护

### 配置指南

**详细配置步骤请查看: [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md)**

包含:
- Supabase Auth 配置
- 数据库表结构更新
- RLS 策略配置
- 管理员用户创建
- 邮件服务配置
- 测试流程说明

### 使用方法

**管理员登录:**
1. 访问 `/login`
2. 选择"管理员"角色
3. 使用 Supabase Auth 中创建的账号登录

**学生注册:**
1. 访问 `/register`
2. 填写信息并提交
3. 查收邮件完成验证
4. 返回登录

## Supabase配置

系统使用Supabase作为后端数据库和认证服务。以下是当前配置信息：

### 连接信息
- **Supabase URL**: `https://swyajeiqqewyckzbfkid.supabase.co`
- **Supabase 匿名密钥**: 配置在环境变量中，使用`VITE_SUPABASE_ANON_KEY`变量名

### 环境变量配置
项目根目录下的`.env`文件包含所有必要的环境配置：
```
VITE_SUPABASE_URL=https://swyajeiqqewyckzbfkid.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

前端代码通过以下方式访问这些变量：
```typescript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 客户线索与学生管理的关系

在本系统中，客户线索(Leads)和学生(Students)是两个相关但独立的概念：

### 客户线索 (Leads)
- 代表潜在的客户或咨询者
- 通过网站表单、社交媒体、教育展等渠道收集
- 包含基础联系信息和初步意向
- 状态包括：新线索、已联系、已确认、已签约、已关闭

### 学生 (Students)
- 代表已签约并接受服务的客户
- 包含详细个人信息、教育背景和服务记录
- 可以关联多个服务项目和导师
- 状态包括：活跃、休学、毕业、退学

### 线索转换为学生的流程

当一个线索成功签约后，系统支持将其转换为学生记录：

1. **线索跟进**：通过线索管理页面跟进潜在客户
2. **状态更新**：当线索状态更新为"已签约"时，系统提示是否创建学生记录
3. **信息转移**：线索的基本信息（姓名、联系方式等）会自动填充到学生创建表单
4. **补充信息**：需要补充更多学生特有的信息，如教育背景、服务选择等
5. **创建记录**：确认后创建正式学生记录并关联服务项目

### 数据表关系
- `leads`表存储所有潜在客户线索
- `students`表存储正式签约学生信息
- `student_services`表存储学生的服务记录
- 线索转为学生后，两条记录之间保留关联关系，便于分析转化率

## 使用指南

### 客户线索管理
1. 通过管理后台的"线索管理"页面查看所有潜在客户
2. 使用筛选和搜索功能快速定位特定线索
3. 更新线索状态、添加跟进记录
4. 将"已签约"线索转换为学生

### 学生管理
1. 通过管理后台的"学生管理"页面管理所有正式学生
2. 查看学生详情、服务记录和进度
3. 添加新服务、更新服务进度
4. 导出学生数据进行分析和报告

## 最佳实践
1. 定期审核线索状态，确保及时跟进
2. 记录详细的沟通内容和客户需求
3. 线索转为学生后,保持服务进度的及时更新
4. 利用数据分析功能优化线索转化率和学生服务满意度

## 常见问题解答

### Q: 如何查看系统使用的Supabase配置？
A: 系统使用的Supabase URL和匿名密钥配置在根目录的`.env`文件中，通过环境变量`VITE_SUPABASE_URL`和`VITE_SUPABASE_ANON_KEY`访问。

### Q: 线索记录和学生记录之间是什么关系？
A: 线索记录代表潜在客户，学生记录代表已签约客户。当线索成功转化为客户后，系统支持将线索信息转换为学生记录，并保留关联关系用于分析转化率。

## 权限系统

本系统实现了基于角色的权限控制（RBAC）机制，支持灵活的权限管理和分配。

### 权限系统架构

1. **数据库表结构**
   - `employee_roles`: 角色表，定义了系统中的各种角色
   - `permissions`: 权限表，定义了系统中的各种权限点
   - `role_permissions`: 角色-权限关联表，定义角色拥有的权限
   - `employee_role_assignments`: 员工-角色关联表，定义员工拥有的角色

2. **权限代码**
   系统中定义了多种权限代码，例如：
   - `manage_users`: 管理用户账号
   - `manage_students`: 管理学生信息
   - `manage_services`: 管理服务
   - `manage_finances`: 管理财务
   - `manage_mentors`: 管理导师
   - `manage_leads`: 管理销售线索
   - `view_reports`: 查看报表
   - `manage_schools`: 管理学校和项目信息
   - `courses:create`: 创建课程
   - `courses:update`: 更新课程
   - `courses:delete`: 删除课程
   - 等等...

3. **角色分配**
   - 系统管理员: 拥有系统所有权限
   - 咨询顾问: 负责学生咨询服务
   - 财务人员: 负责财务管理
   - 销售人员: 负责销售线索跟进

### 权限组件

1. **权限服务 (permissionService)**
   提供了以下功能：
   - `hasPermission`: 检查当前用户是否拥有指定权限
   - `employeeHasPermission`: 检查特定员工是否拥有指定权限
   - `getEmployeePermissions`: 获取员工的所有权限
   - `getRolePermissions`: 获取角色的所有权限

2. **权限上下文 (PermissionContext)**
   提供了以下功能：
   - 在应用中全局管理和检查权限
   - 缓存用户权限以提高性能
   - 响应用户登录状态变化自动更新权限

3. **权限保护组件**
   - `PermissionGuard`: 根据权限条件渲染内容
   - `PermissionButton`: 根据权限控制按钮的可用性
   - `ProtectedRoute`: 保护路由，只允许有权限的用户访问

### 权限管理界面

系统提供了两个权限管理页面：

1. **权限管理页面 (PermissionPage)**
   - 创建、编辑和删除角色
   - 创建、编辑和删除权限
   - 为角色分配权限

2. **员工权限分配页面 (EmployeePermissionPage)**
   - 管理员工的角色分配
   - 查看员工当前拥有的角色和权限

### 使用示例

1. **在组件中使用权限检查**
   ```tsx
   import { usePermission } from '../context/PermissionContext';

   const MyComponent = () => {
     const { checkPermission } = usePermission();
     
     const canCreateCourse = checkPermission('courses:create');
     
     return (
       <div>
         {canCreateCourse && (
           <button>创建课程</button>
         )}
       </div>
     );
   };
   ```

2. **使用权限保护组件**
   ```tsx
   import { PermissionGuard } from '../components/Permission/PermissionGuard';
   
   const MyComponent = () => {
     return (
       <div>
         <PermissionGuard permission="manage_finances">
           <FinancialReportComponent />
         </PermissionGuard>
       </div>
     );
   };
   ```

3. **使用权限按钮**
   ```tsx
   import { PermissionButton } from '../components/Permission/PermissionButton';
   
   const MyComponent = () => {
     return (
       <div>
         <PermissionButton 
           permission="courses:delete"
           onClick={handleDeleteCourse}
           className="btn btn-danger"
         >
           删除课程
         </PermissionButton>
       </div>
     );
   };
   ```

4. **保护路由**
   ```tsx
   import { ProtectedRoute } from '../components/Permission/ProtectedRoute';
   
   const AppRoutes = () => {
     return (
       <Routes>
         <Route path="/admin/finances" element={
           <ProtectedRoute permission="manage_finances">
             <FinancePage />
           </ProtectedRoute>
         } />
       </Routes>
     );
   };
   ```

### 扩展权限系统

如需添加新的权限，请按照以下步骤操作：

1. 在 `permissions` 表中添加新的权限记录
2. 将新权限分配给相应的角色
3. 在代码中使用权限检查功能控制功能访问

---

## 知识库模块 📚

### 功能概述

知识库模块是一个完整的知识管理系统，支持创建、管理和分享留学相关的各类资源。

### 核心功能

#### 资源管理
- ✅ **创建资源** - 支持4种类型：文档、视频、文章、模板
- ✅ **查看资源** - 详细的资源展示页面
- ✅ **下载资源** - 文件下载并统计下载次数
- ✅ **浏览统计** - 自动统计浏览和下载次数

#### 搜索和筛选
- ✅ **全文搜索** - 搜索标题、描述、标签
- ✅ **9维筛选** - 分类/类型/作者/标签/时间/排序等
- ✅ **标签页** - 全部/精选/已收藏/最近更新
- ✅ **实时统计** - 显示筛选结果数量

#### 互动功能
- ✅ **收藏资源** - 一键收藏/取消收藏
- ✅ **评论系统** - 发表评论和查看讨论
- ✅ **点赞功能** - 为评论点赞
- ✅ **相关推荐** - 智能推荐相关资源

#### 统计面板
- ✅ **总资源数** - 显示所有已发布资源
- ✅ **分类统计** - 文档/视频/文章/模板数量
- ✅ **下载统计** - 累计下载次数
- ✅ **实时更新** - 数据实时同步

### 数据库设计

#### 表结构
```sql
knowledge_resources         # 资源表
├── id, title, type        # 基本信息
├── category, description  # 分类和描述
├── content, file_url      # 内容和文件
├── tags (数组)            # 标签
├── views, downloads       # 统计
└── is_featured, status    # 状态

knowledge_comments         # 评论表
├── resource_id           # 关联资源
├── user_id, user_name    # 评论用户
├── content, likes        # 内容和点赞
└── parent_comment_id     # 支持回复

knowledge_bookmarks        # 收藏表
└── resource_id, user_id  # 用户收藏记录

knowledge_comment_likes    # 点赞表
└── comment_id, user_id   # 用户点赞记录
```

### 使用流程

#### 1. 数据库初始化
执行迁移脚本：
```sql
database_migrations/004_create_knowledge_base_tables.sql
```

#### 2. 创建资源
1. 访问 `/admin/knowledge`
2. 点击"上传资源"按钮
3. 填写表单：
   - 标题、类型、分类（必填）
   - 描述、内容/文件链接、标签（可选）
4. 提交创建

#### 3. 管理资源
- **浏览** - 主页网格视图
- **搜索** - 顶部搜索框
- **筛选** - 点击"筛选"使用高级筛选
- **收藏** - 点击书签图标
- **评论** - 进入详情页发表评论

### 技术特性

#### 模块化设计
```
KnowledgeBase/
├── components/      # UI组件
├── types/          # TypeScript类型
├── utils/          # 工具函数
└── hooks/          # 自定义Hooks（备用）
```

#### 性能优化
- 直接 Supabase 查询，无中间层
- localStorage 缓存用户信息
- 简洁的状态管理
- 避免不必要的重新渲染

#### 用户体验
- 友好的空状态提示
- 清晰的错误信息
- 多入口创建资源
- 响应式设计
- 暗黑模式支持

### 文档资源

- **功能说明**: `知识库完整功能说明.md`
- **使用指南**: `知识库使用指南.md`
- **部署指南**: `知识库快速部署指南.md`
- **模块文档**: `src/pages/admin/KnowledgeBase/README.md`

### 快速开始

```bash
# 1. 执行数据库迁移（在 Supabase Dashboard）
database_migrations/004_create_knowledge_base_tables.sql

# 2. 访问知识库页面
http://localhost:5173/admin/knowledge

# 3. 创建第一个资源
点击"上传资源" → 填写表单 → 提交
```

### 功能清单

- [x] 资源创建和展示
- [x] 搜索和多维筛选
- [x] 收藏功能
- [x] 评论和点赞
- [x] 浏览和下载统计
- [x] 相关资源推荐
- [x] 响应式布局
- [x] 暗黑模式
- [ ] 文件上传（待实现）
- [ ] 资源编辑（待实现）
- [ ] 资源删除（待实现）
