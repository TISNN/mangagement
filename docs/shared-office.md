# 共享办公空间匹配系统设计文档

## 1. 功能定位与目标

### 1.1 业务背景
在留学服务行业中，顾问、团队或公司常驻某个城市（如深圳），但需要到其他城市（如上海）面谈客户时，往往面临以下痛点：
- 没有固定办公室或会谈场所
- 临时租用成本高、流程繁琐
- 缺乏合适的会谈环境（私密性、专业性）
- 资源浪费：有办公空间的人空间闲置，需要的人找不到

### 1.2 解决方案
构建一个**共享办公空间匹配平台**，实现：
- **空间提供方**：愿意共享办公空间/会谈场所的个人或机构可以发布提供信息
- **需求方**：需要临时办公/会谈场所的人可以发布需求
- **智能匹配**：平台根据地理位置、时间、设施需求等自动匹配供需双方
- **共享生态**：形成平台内的资源共享生态，降低运营成本，提升资源利用率

### 1.3 核心价值
- ✅ **降低运营成本**：避免临时租用高额费用
- ✅ **提升资源利用率**：闲置空间得到有效利用
- ✅ **增强服务灵活性**：支持跨城市业务拓展
- ✅ **构建社区生态**：促进平台内成员互助合作
- ✅ **提升专业形象**：提供合适的会谈环境

---

## 2. 用户角色与权限

### 2.1 空间提供方（Space Provider）
- **身份**：个人顾问、团队、公司、机构
- **权限**：
  - 发布空间提供信息
  - 管理自己的空间信息（编辑、下架、删除）
  - 查看预约申请并审核
  - 确认/取消预约
  - 查看使用记录和评价
  - 设置空间可用时间、价格、规则
- **激励**：
  - 获得平台积分/信用值
  - 优先匹配权
  - 平台推荐曝光

### 2.2 需求方（Space Seeker）
- **身份**：个人顾问、团队、公司、机构
- **权限**：
  - 发布空间需求
  - 浏览可用空间列表
  - 申请预约空间
  - 查看预约状态
  - 确认使用并评价
  - 管理自己的需求信息
- **激励**：
  - 快速找到合适空间
  - 降低使用成本
  - 建立合作关系

### 2.3 平台管理员（Admin）
- **权限**：
  - 审核空间提供信息（真实性、合规性）
  - 审核需求信息
  - 处理纠纷和投诉
  - 数据统计和分析
  - 设置平台规则和政策
  - 管理用户信用体系

---

## 3. 核心功能模块

### 3.1 空间提供管理（Space Provider Management）

#### 3.1.1 发布空间信息
**功能描述**：提供方可以发布自己的办公空间/会谈场所信息

**必填信息**：
- 空间名称（如："上海静安区共享办公室"）
- 空间类型（办公室/会议室/会谈室/共享工位/其他）
- 详细地址（省/市/区/街道/门牌号）
- 地理位置（经纬度，用于地图展示和距离计算）
- 空间面积（平方米）
- 可容纳人数
- 可用时间段（工作日/周末/节假日，具体时间段）
- 价格模式（免费/按小时/按天/按次/面议）
- 价格（如果收费）
- 空间描述（设施、环境、特色等）
- 空间照片（至少3张，最多10张）
- 联系方式（电话/微信/邮箱）

**可选信息**：
- 设施清单（投影仪/白板/打印机/WiFi/茶水间/停车位等）
- 使用规则（如：禁止吸烟、保持安静、使用后清洁等）
- 特殊说明（如：需要提前预约、仅工作日可用等）
- 认证信息（营业执照、空间所有权证明等，用于平台认证）

**状态管理**：
- 草稿：保存但未发布
- 待审核：已提交，等待平台审核
- 已发布：审核通过，对外可见
- 已下架：暂时不可用
- 已删除：永久删除

#### 3.1.2 空间信息管理
- 编辑空间信息
- 上架/下架空间
- 查看预约申请列表
- 审核预约申请（同意/拒绝）
- 查看使用记录
- 查看评价和反馈

#### 3.1.3 预约管理
- 查看待审核的预约申请
- 查看已确认的预约（待使用/使用中/已完成）
- 确认预约（生成预约凭证）
- 取消预约（需说明原因）
- 标记使用完成

### 3.2 需求发布与管理（Space Request Management）

#### 3.2.1 发布空间需求
**功能描述**：需求方可以发布对办公空间/会谈场所的需求

**必填信息**：
- 需求标题（如："上海客户面谈需要会议室"）
- 需求类型（办公室/会议室/会谈室/共享工位/其他）
- 目标城市/区域（省/市/区，可多选）
- 使用日期和时间段
- 预计使用时长（小时/天）
- 预计人数
- 预算范围（免费/100元以下/100-300元/300-500元/500元以上/面议）
- 需求描述（用途、特殊要求等）

**可选信息**：
- 必需设施（投影仪/白板/打印机等）
- 偏好要求（安静环境/交通便利/停车位等）
- 紧急程度（一般/较急/紧急）
- 联系方式

**状态管理**：
- 草稿：保存但未发布
- 已发布：对外可见，等待匹配
- 匹配中：已有提供方响应
- 已预约：已确定空间并预约
- 已完成：使用完成
- 已取消：取消需求

#### 3.2.2 需求管理
- 编辑需求信息
- 查看匹配推荐（系统推荐的空间）
- 申请预约空间
- 查看预约状态
- 确认使用并评价
- 取消需求

### 3.3 智能匹配系统（Smart Matching System）

#### 3.3.1 匹配算法
**匹配维度**：
1. **地理位置匹配**（权重：30%）
   - 需求方目标区域 vs 提供方空间位置
   - 距离计算（直线距离/交通距离）
   - 优先匹配同城、同区

2. **时间匹配**（权重：25%）
   - 需求时间段 vs 空间可用时间段
   - 精确匹配 > 部分重叠 > 可调整

3. **空间类型匹配**（权重：20%）
   - 需求类型 vs 提供类型
   - 完全匹配 > 兼容匹配（如：需要会议室，提供会谈室也可）

4. **容量匹配**（权重：10%）
   - 需求人数 vs 空间可容纳人数
   - 容量充足 > 刚好匹配 > 略小但可用

5. **价格匹配**（权重：10%）
   - 需求预算 vs 空间价格
   - 免费优先 > 预算内 > 略超预算但可协商

6. **设施匹配**（权重：5%）
   - 需求必需设施 vs 空间提供设施
   - 完全满足 > 部分满足

**匹配分数计算**：
```
总分 = 地理位置得分 × 0.3 + 时间得分 × 0.25 + 类型得分 × 0.2 + 
       容量得分 × 0.1 + 价格得分 × 0.1 + 设施得分 × 0.05
```

**匹配结果排序**：
- 按匹配分数降序排列
- 优先显示认证空间
- 优先显示高评价空间
- 优先显示历史合作过的空间

#### 3.3.2 匹配推荐
- **主动推荐**：系统自动为需求推荐匹配的空间（Top 10）
- **双向推荐**：为空间提供方推荐可能的需求
- **实时匹配**：新需求发布后立即匹配
- **智能提醒**：通过站内信/邮件/短信通知匹配结果

### 3.4 预约与使用流程（Booking & Usage Flow）

#### 3.4.1 预约流程
1. **需求方发起预约**
   - 浏览匹配推荐的空间列表
   - 查看空间详情（照片、设施、评价、位置等）
   - 选择心仪空间，点击"申请预约"
   - 填写预约信息（使用时间、人数、用途、备注等）
   - 提交预约申请

2. **提供方审核预约**
   - 收到预约申请通知
   - 查看预约详情和需求方信息
   - 审核预约（同意/拒绝/需要沟通）
   - 如果同意，确认预约并生成预约凭证

3. **预约确认**
   - 系统生成预约凭证（包含：空间信息、使用时间、联系方式、使用规则等）
   - 双方收到确认通知
   - 预约状态更新为"已确认"

4. **使用前准备**
   - 需求方：确认时间、准备材料、联系提供方
   - 提供方：准备空间、确认设施、提供指引

5. **使用确认**
   - 需求方到达后，提供方确认使用开始
   - 或需求方自主签到（扫码/定位验证）

6. **使用完成**
   - 需求方确认使用完成
   - 提供方确认使用完成
   - 双方互评（可选）

#### 3.4.2 预约状态流转
```
待审核 → 已确认 → 待使用 → 使用中 → 已完成
   ↓        ↓        ↓
已拒绝   已取消   已取消
```

#### 3.4.3 取消与变更
- **需求方取消**：
  - 使用前24小时可免费取消
  - 使用前12-24小时取消，扣除部分费用（如已付费）
  - 使用前12小时内取消，扣除全部费用
  - 紧急情况可申请平台介入处理

- **提供方取消**：
  - 需提前通知需求方
  - 平台协助寻找替代方案
  - 影响提供方信用评分

- **时间变更**：
  - 双方协商一致后可修改时间
  - 系统更新预约信息

### 3.5 评价与信用体系（Rating & Credit System）

#### 3.5.1 评价系统
**评价维度**：
- **空间提供方评价需求方**：
  - 准时性（是否按时到达/离开）
  - 文明使用（是否遵守规则、保持整洁）
  - 沟通顺畅度
  - 综合评分（1-5星）
  - 文字评价（可选）

- **需求方评价空间提供方**：
  - 空间环境（整洁、舒适、专业）
  - 设施完善度（是否与描述一致）
  - 服务态度（响应及时、沟通友好）
  - 性价比
  - 综合评分（1-5星）
  - 文字评价（可选）

**评价规则**：
- 使用完成后7天内可评价
- 双方互评后评价才公开显示
- 匿名评价（不显示真实姓名）
- 可追评（补充评价）

#### 3.5.2 信用体系
**信用分计算**：
- 基础分：100分
- 加分项：
  - 成功完成预约：+5分/次
  - 获得好评：+2分/次
  - 获得差评：-5分/次
  - 取消预约（无正当理由）：-10分/次
  - 违规行为：-20分/次
  - 平台认证：+20分

**信用等级**：
- 优秀（≥150分）：金色标识，优先推荐
- 良好（120-149分）：绿色标识，正常推荐
- 一般（100-119分）：蓝色标识，正常推荐
- 较差（80-99分）：黄色标识，降权推荐
- 差（<80分）：红色标识，限制使用

**信用应用**：
- 影响匹配优先级
- 影响搜索结果排序
- 影响平台推荐曝光
- 低信用用户可能被限制发布或使用

### 3.6 搜索与筛选（Search & Filter）

#### 3.6.1 空间搜索
**搜索方式**：
- 关键词搜索（空间名称、地址、描述）
- 地图搜索（在地图上选择区域）
- 筛选搜索（多条件组合）

**筛选条件**：
- 城市/区域
- 空间类型
- 价格范围
- 可用时间
- 设施要求
- 可容纳人数
- 认证状态
- 信用等级
- 评价分数

**排序方式**：
- 匹配度（默认）
- 距离最近
- 价格最低
- 评价最高
- 最新发布

#### 3.6.2 需求搜索
**搜索方式**：
- 关键词搜索（需求标题、描述）
- 筛选搜索（多条件组合）

**筛选条件**：
- 城市/区域
- 需求类型
- 使用时间
- 预算范围
- 紧急程度
- 状态（已发布/匹配中/已预约）

### 3.7 消息与通知（Messaging & Notification）

#### 3.7.1 站内消息
- 预约申请通知
- 预约审核结果通知
- 预约确认通知
- 预约变更通知
- 使用提醒通知
- 评价提醒通知
- 系统消息（匹配推荐、活动通知等）

#### 3.7.2 外部通知
- 邮件通知（重要事件）
- 短信通知（紧急事件，如预约取消）
- 微信/企业微信通知（可选）

### 3.8 数据统计与分析（Analytics & Statistics）

#### 3.8.1 个人统计
**提供方统计**：
- 发布空间数量
- 总预约次数
- 完成使用次数
- 平均评价分数
- 总收入（如收费）
- 空间利用率

**需求方统计**：
- 发布需求数量
- 总预约次数
- 完成使用次数
- 总支出（如付费）
- 常用城市/区域

#### 3.8.2 平台统计（管理员）
- 总空间数量
- 总需求数量
- 总匹配次数
- 总完成次数
- 匹配成功率
- 热门城市/区域
- 热门空间类型
- 平均价格趋势
- 用户活跃度

---

## 4. 数据库设计

### 4.1 核心表结构

#### 4.1.1 `shared_office_spaces` - 共享办公空间表
```sql
CREATE TABLE shared_office_spaces (
  id BIGSERIAL PRIMARY KEY,
  
  -- 基本信息
  name VARCHAR(200) NOT NULL,                    -- 空间名称
  space_type VARCHAR(50) NOT NULL,              -- 空间类型：office/meeting_room/conference_room/shared_desk/other
  description TEXT,                              -- 空间描述
  address TEXT NOT NULL,                         -- 详细地址
  city VARCHAR(100) NOT NULL,                   -- 城市
  district VARCHAR(100),                        -- 区/县
  street VARCHAR(200),                          -- 街道
  building VARCHAR(200),                        -- 楼栋/门牌号
  latitude DECIMAL(10, 7),                       -- 纬度
  longitude DECIMAL(10, 7),                     -- 经度
  
  -- 空间属性
  area DECIMAL(8, 2),                           -- 面积（平方米）
  capacity INTEGER NOT NULL,                    -- 可容纳人数
  facilities JSONB DEFAULT '[]'::jsonb,         -- 设施清单：["projector", "whiteboard", "wifi", ...]
  photos JSONB DEFAULT '[]'::jsonb,             -- 照片URL数组
  
  -- 可用性
  available_days JSONB DEFAULT '[]'::jsonb,      -- 可用日期：["weekday", "weekend", "holiday"]
  available_time_slots JSONB DEFAULT '[]'::jsonb, -- 可用时间段：[{"start": "09:00", "end": "18:00"}]
  is_available BOOLEAN DEFAULT true,             -- 是否可用
  
  -- 价格
  pricing_model VARCHAR(50) NOT NULL,           -- 价格模式：free/hourly/daily/per_use/negotiable
  price DECIMAL(10, 2),                         -- 价格（如果收费）
  currency VARCHAR(10) DEFAULT 'CNY',           -- 货币单位
  
  -- 规则与说明
  rules TEXT,                                    -- 使用规则
  special_notes TEXT,                           -- 特殊说明
  
  -- 认证与状态
  is_verified BOOLEAN DEFAULT false,            -- 是否平台认证
  verification_docs JSONB DEFAULT '[]'::jsonb,  -- 认证文档
  status VARCHAR(50) DEFAULT 'draft',           -- 状态：draft/pending/released/suspended/deleted
  
  -- 统计信息
  view_count INTEGER DEFAULT 0,                -- 浏览次数
  booking_count INTEGER DEFAULT 0,              -- 预约次数
  completed_count INTEGER DEFAULT 0,            -- 完成次数
  average_rating DECIMAL(3, 2) DEFAULT 0,      -- 平均评分
  rating_count INTEGER DEFAULT 0,                -- 评价数量
  
  -- 关联信息
  provider_id INTEGER NOT NULL,                 -- 提供方ID（关联employees表）
  provider_type VARCHAR(50) DEFAULT 'employee', -- 提供方类型：employee/team/company
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER REFERENCES employees(id),
  updated_by INTEGER REFERENCES employees(id)
);

-- 索引
CREATE INDEX idx_spaces_city ON shared_office_spaces(city);
CREATE INDEX idx_spaces_district ON shared_office_spaces(district);
CREATE INDEX idx_spaces_type ON shared_office_spaces(space_type);
CREATE INDEX idx_spaces_status ON shared_office_spaces(status);
CREATE INDEX idx_spaces_provider ON shared_office_spaces(provider_id);
CREATE INDEX idx_spaces_location ON shared_office_spaces USING GIST (point(longitude, latitude));
```

#### 4.1.2 `shared_office_requests` - 空间需求表
```sql
CREATE TABLE shared_office_requests (
  id BIGSERIAL PRIMARY KEY,
  
  -- 基本信息
  title VARCHAR(200) NOT NULL,                 -- 需求标题
  request_type VARCHAR(50) NOT NULL,           -- 需求类型：office/meeting_room/conference_room/shared_desk/other
  description TEXT,                             -- 需求描述
  
  -- 位置要求
  target_cities JSONB DEFAULT '[]'::jsonb,     -- 目标城市：["上海", "北京"]
  target_districts JSONB DEFAULT '[]'::jsonb,  -- 目标区域：["静安区", "黄浦区"]
  max_distance INTEGER,                         -- 最大距离（公里，可选）
  
  -- 时间要求
  use_date DATE NOT NULL,                       -- 使用日期
  use_time_start TIME NOT NULL,                 -- 开始时间
  use_time_end TIME NOT NULL,                   -- 结束时间
  duration_hours DECIMAL(4, 2),                 -- 预计使用时长（小时）
  
  -- 空间要求
  expected_capacity INTEGER NOT NULL,           -- 预计人数
  required_facilities JSONB DEFAULT '[]'::jsonb, -- 必需设施：["projector", "whiteboard"]
  preferences TEXT,                            -- 偏好要求
  
  -- 预算
  budget_range VARCHAR(50),                     -- 预算范围：free/under_100/100_300/300_500/over_500/negotiable
  max_budget DECIMAL(10, 2),                    -- 最大预算（如指定）
  
  -- 状态
  status VARCHAR(50) DEFAULT 'draft',           -- 状态：draft/published/matching/booked/completed/cancelled
  urgency VARCHAR(50) DEFAULT 'normal',        -- 紧急程度：normal/urgent/emergency
  
  -- 匹配信息
  matched_space_id BIGINT,                      -- 匹配的空间ID
  booking_id BIGINT,                            -- 预约ID
  
  -- 关联信息
  requester_id INTEGER NOT NULL,                 -- 需求方ID（关联employees表）
  requester_type VARCHAR(50) DEFAULT 'employee', -- 需求方类型：employee/team/company
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,                       -- 需求过期时间
  created_by INTEGER REFERENCES employees(id),
  updated_by INTEGER REFERENCES employees(id)
);

-- 索引
CREATE INDEX idx_requests_cities ON shared_office_requests USING GIN (target_cities);
CREATE INDEX idx_requests_type ON shared_office_requests(request_type);
CREATE INDEX idx_requests_date ON shared_office_requests(use_date);
CREATE INDEX idx_requests_status ON shared_office_requests(status);
CREATE INDEX idx_requests_requester ON shared_office_requests(requester_id);
```

#### 4.1.3 `shared_office_bookings` - 预约记录表
```sql
CREATE TABLE shared_office_bookings (
  id BIGSERIAL PRIMARY KEY,
  
  -- 关联信息
  space_id BIGINT NOT NULL REFERENCES shared_office_spaces(id),
  request_id BIGINT REFERENCES shared_office_requests(id),
  requester_id INTEGER NOT NULL REFERENCES employees(id),
  provider_id INTEGER NOT NULL REFERENCES employees(id),
  
  -- 预约信息
  booking_date DATE NOT NULL,                   -- 预约日期
  start_time TIME NOT NULL,                     -- 开始时间
  end_time TIME NOT NULL,                       -- 结束时间
  expected_attendees INTEGER,                   -- 预计人数
  purpose TEXT,                                 -- 使用用途
  special_requirements TEXT,                    -- 特殊要求
  contact_phone VARCHAR(20),                     -- 联系电话
  contact_wechat VARCHAR(100),                   -- 微信
  
  -- 价格与支付
  pricing_model VARCHAR(50),                     -- 价格模式
  price DECIMAL(10, 2),                         -- 价格
  payment_status VARCHAR(50) DEFAULT 'pending', -- 支付状态：pending/paid/refunded
  payment_method VARCHAR(50),                    -- 支付方式
  payment_time TIMESTAMPTZ,                      -- 支付时间
  
  -- 状态
  status VARCHAR(50) DEFAULT 'pending',          -- 状态：pending/confirmed/cancelled/completed
  cancellation_reason TEXT,                      -- 取消原因
  cancelled_by INTEGER,                         -- 取消人ID
  cancelled_at TIMESTAMPTZ,                     -- 取消时间
  
  -- 使用确认
  check_in_time TIMESTAMPTZ,                     -- 签到时间
  check_out_time TIMESTAMPTZ,                    -- 签退时间
  actual_attendees INTEGER,                      -- 实际人数
  usage_notes TEXT,                              -- 使用备注
  
  -- 评价
  requester_rated BOOLEAN DEFAULT false,         -- 需求方是否已评价
  provider_rated BOOLEAN DEFAULT false,         -- 提供方是否已评价
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,                     -- 确认时间
  completed_at TIMESTAMPTZ                       -- 完成时间
);

-- 索引
CREATE INDEX idx_bookings_space ON shared_office_bookings(space_id);
CREATE INDEX idx_bookings_request ON shared_office_bookings(request_id);
CREATE INDEX idx_bookings_requester ON shared_office_bookings(requester_id);
CREATE INDEX idx_bookings_provider ON shared_office_bookings(provider_id);
CREATE INDEX idx_bookings_date ON shared_office_bookings(booking_date);
CREATE INDEX idx_bookings_status ON shared_office_bookings(status);
```

#### 4.1.4 `shared_office_ratings` - 评价表
```sql
CREATE TABLE shared_office_ratings (
  id BIGSERIAL PRIMARY KEY,
  
  -- 关联信息
  booking_id BIGINT NOT NULL REFERENCES shared_office_bookings(id),
  space_id BIGINT REFERENCES shared_office_spaces(id),
  rater_id INTEGER NOT NULL REFERENCES employees(id),  -- 评价人ID
  rated_id INTEGER NOT NULL REFERENCES employees(id),   -- 被评价人ID（提供方或需求方）
  rating_type VARCHAR(50) NOT NULL,                    -- 评价类型：provider_rating/requester_rating
  
  -- 评价内容
  overall_rating INTEGER NOT NULL,                     -- 综合评分（1-5）
  punctuality_rating INTEGER,                          -- 准时性评分（1-5）
  cleanliness_rating INTEGER,                          -- 整洁度评分（1-5）
  facility_rating INTEGER,                             -- 设施评分（1-5）
  service_rating INTEGER,                              -- 服务评分（1-5）
  value_rating INTEGER,                                -- 性价比评分（1-5）
  comment TEXT,                                        -- 文字评价
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT true                   -- 是否匿名
);

-- 索引
CREATE INDEX idx_ratings_booking ON shared_office_ratings(booking_id);
CREATE INDEX idx_ratings_space ON shared_office_ratings(space_id);
CREATE INDEX idx_ratings_rater ON shared_office_ratings(rater_id);
CREATE INDEX idx_ratings_rated ON shared_office_ratings(rated_id);
```

#### 4.1.5 `shared_office_matches` - 匹配记录表
```sql
CREATE TABLE shared_office_matches (
  id BIGSERIAL PRIMARY KEY,
  
  -- 关联信息
  space_id BIGINT NOT NULL REFERENCES shared_office_spaces(id),
  request_id BIGINT NOT NULL REFERENCES shared_office_requests(id),
  
  -- 匹配信息
  match_score DECIMAL(5, 2) NOT NULL,            -- 匹配分数（0-100）
  location_score DECIMAL(5, 2),                   -- 地理位置匹配分
  time_score DECIMAL(5, 2),                       -- 时间匹配分
  type_score DECIMAL(5, 2),                       -- 类型匹配分
  capacity_score DECIMAL(5, 2),                   -- 容量匹配分
  price_score DECIMAL(5, 2),                      -- 价格匹配分
  facility_score DECIMAL(5, 2),                   -- 设施匹配分
  
  -- 状态
  status VARCHAR(50) DEFAULT 'recommended',       -- 状态：recommended/viewed/applied/ignored
  is_auto_recommended BOOLEAN DEFAULT true,       -- 是否自动推荐
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,                          -- 查看时间
  applied_at TIMESTAMPTZ                           -- 申请时间
);

-- 索引
CREATE INDEX idx_matches_space ON shared_office_matches(space_id);
CREATE INDEX idx_matches_request ON shared_office_matches(request_id);
CREATE INDEX idx_matches_score ON shared_office_matches(match_score DESC);
CREATE INDEX idx_matches_status ON shared_office_matches(status);
```

#### 4.1.6 `shared_office_credit_scores` - 信用分表
```sql
CREATE TABLE shared_office_credit_scores (
  id BIGSERIAL PRIMARY KEY,
  
  -- 关联信息
  user_id INTEGER NOT NULL REFERENCES employees(id),
  user_type VARCHAR(50) DEFAULT 'employee',       -- 用户类型：employee/team/company
  
  -- 信用信息
  credit_score INTEGER DEFAULT 100,               -- 信用分（基础100分）
  credit_level VARCHAR(50) DEFAULT 'normal',     -- 信用等级：excellent/good/normal/poor/bad
  
  -- 统计信息
  total_bookings INTEGER DEFAULT 0,               -- 总预约次数
  completed_bookings INTEGER DEFAULT 0,           -- 完成次数
  cancelled_bookings INTEGER DEFAULT 0,           -- 取消次数
  average_rating DECIMAL(3, 2) DEFAULT 0,         -- 平均评分
  violation_count INTEGER DEFAULT 0,             -- 违规次数
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_calculated_at TIMESTAMPTZ                  -- 最后计算时间
);

-- 索引
CREATE UNIQUE INDEX idx_credit_user ON shared_office_credit_scores(user_id);
CREATE INDEX idx_credit_score ON shared_office_credit_scores(credit_score DESC);
CREATE INDEX idx_credit_level ON shared_office_credit_scores(credit_level);
```

#### 4.1.7 `shared_office_credit_logs` - 信用分变更日志表
```sql
CREATE TABLE shared_office_credit_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- 关联信息
  user_id INTEGER NOT NULL REFERENCES employees(id),
  
  -- 变更信息
  change_type VARCHAR(50) NOT NULL,               -- 变更类型：booking_completed/rating_received/cancellation/violation/verification
  change_amount INTEGER NOT NULL,                 -- 变更数量（+/-）
  previous_score INTEGER NOT NULL,                -- 变更前分数
  new_score INTEGER NOT NULL,                     -- 变更后分数
  reason TEXT,                                    -- 变更原因
  related_booking_id BIGINT,                      -- 关联预约ID
  related_rating_id BIGINT,                      -- 关联评价ID
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER REFERENCES employees(id)     -- 操作人（系统或管理员）
);

-- 索引
CREATE INDEX idx_credit_logs_user ON shared_office_credit_logs(user_id);
CREATE INDEX idx_credit_logs_type ON shared_office_credit_logs(change_type);
CREATE INDEX idx_credit_logs_date ON shared_office_credit_logs(created_at DESC);
```

### 4.2 关系图
```
shared_office_spaces (空间)
    ├─< shared_office_bookings (预约)
    ├─< shared_office_ratings (评价)
    └─< shared_office_matches (匹配)

shared_office_requests (需求)
    ├─< shared_office_bookings (预约)
    └─< shared_office_matches (匹配)

shared_office_bookings (预约)
    ├─> shared_office_ratings (评价)
    └─> shared_office_credit_logs (信用日志)

employees (员工)
    ├─< shared_office_spaces.provider_id (提供方)
    ├─< shared_office_requests.requester_id (需求方)
    ├─< shared_office_bookings.requester_id (预约需求方)
    ├─< shared_office_bookings.provider_id (预约提供方)
    ├─< shared_office_ratings.rater_id (评价人)
    ├─< shared_office_ratings.rated_id (被评价人)
    └─< shared_office_credit_scores.user_id (信用分)
```

---

## 5. 页面设计

### 5.1 空间提供方页面

#### 5.1.1 我的空间列表页 (`/admin/shared-office/my-spaces`)
**功能**：
- 显示我发布的所有空间
- 快速操作：编辑、上架/下架、删除
- 统计卡片：总空间数、已发布、待审核、总预约数
- 筛选：按状态、类型筛选
- 搜索：按名称、地址搜索

**布局**：
```
┌─────────────────────────────────────────────────┐
│  我的共享空间                                    │
│  [统计卡片：总空间数 | 已发布 | 待审核 | 预约数] │
├─────────────────────────────────────────────────┤
│  [搜索框] [筛选：状态/类型] [+ 发布新空间]       │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │ [空间卡片1] │  │ [空间卡片2] │              │
│  │ 名称/类型    │  │ 名称/类型    │              │
│  │ 地址        │  │ 地址        │              │
│  │ 状态/预约数 │  │ 状态/预约数 │              │
│  │ [编辑][管理]│  │ [编辑][管理]│              │
│  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────┘
```

#### 5.1.2 发布/编辑空间页 (`/admin/shared-office/spaces/new` / `/admin/shared-office/spaces/:id/edit`)
**功能**：
- 表单填写空间信息
- 图片上传（支持拖拽、预览、删除）
- 地图选择位置（集成地图API）
- 设置可用时间段（日历选择）
- 实时保存草稿
- 提交审核

**表单字段**：
- 基本信息：名称、类型、描述
- 位置信息：地址选择器、地图定位
- 空间属性：面积、容量、设施选择（多选）
- 可用性：可用日期、时间段设置
- 价格：价格模式、价格输入
- 规则说明：使用规则、特殊说明
- 照片：上传、预览、排序

#### 5.1.3 空间详情页 (`/admin/shared-office/spaces/:id`)
**功能**：
- 显示空间完整信息
- 查看预约申请列表
- 审核预约申请
- 查看使用记录
- 查看评价和反馈
- 统计数据

**标签页**：
- 基本信息
- 预约管理（待审核/已确认/已完成/已取消）
- 使用记录
- 评价反馈
- 统计数据

#### 5.1.4 预约管理页 (`/admin/shared-office/bookings`)
**功能**：
- 查看所有预约（我的空间收到的预约）
- 筛选：按状态、日期筛选
- 批量操作：批量审核、批量确认
- 预约详情：查看预约信息、需求方信息
- 操作：同意/拒绝/取消预约

### 5.2 需求方页面

#### 5.2.1 空间搜索页 (`/admin/shared-office/search`)
**功能**：
- 地图视图/列表视图切换
- 搜索框（关键词搜索）
- 筛选器（城市、类型、价格、设施等）
- 排序（匹配度/距离/价格/评价）
- 空间卡片展示
- 快速申请预约

**布局**：
```
┌─────────────────────────────────────────────────┐
│  搜索共享空间                                    │
│  [搜索框] [筛选器] [排序] [地图/列表切换]        │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │ [空间卡片1] │  │ [空间卡片2] │              │
│  │ [照片]      │  │ [照片]      │              │
│  │ 名称/类型   │  │ 名称/类型   │              │
│  │ 地址/距离   │  │ 地址/距离   │              │
│  │ 价格/评分   │  │ 价格/评分   │              │
│  │ [查看详情] │  │ [查看详情] │              │
│  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────┘
```

#### 5.2.2 空间详情页 (`/admin/shared-office/spaces/:id/detail`)
**功能**：
- 空间完整信息展示
- 照片轮播
- 地图位置
- 设施清单
- 可用时间日历
- 评价列表
- 申请预约按钮
- 收藏功能

#### 5.2.3 我的需求页 (`/admin/shared-office/my-requests`)
**功能**：
- 显示我发布的所有需求
- 查看匹配推荐
- 申请预约
- 管理需求（编辑、取消）
- 查看预约状态

**布局**：
```
┌─────────────────────────────────────────────────┐
│  我的空间需求                                    │
│  [+ 发布新需求]                                  │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐  │
│  │ [需求卡片1]                               │  │
│  │ 标题/类型/日期/地点                        │  │
│  │ 状态：已发布                              │  │
│  │ [匹配推荐：3个空间] [查看详情] [取消]    │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ [需求卡片2]                               │  │
│  │ ...                                       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

#### 5.2.4 发布需求页 (`/admin/shared-office/requests/new`)
**功能**：
- 表单填写需求信息
- 日期时间选择器
- 城市/区域选择（多选）
- 设施需求选择（多选）
- 预算范围选择
- 实时保存草稿
- 提交发布

#### 5.2.5 需求详情页 (`/admin/shared-office/requests/:id`)
**功能**：
- 显示需求完整信息
- 匹配推荐列表（Top 10）
- 申请预约按钮
- 查看预约状态
- 编辑/取消需求

**标签页**：
- 需求详情
- 匹配推荐（按匹配分数排序）
- 预约状态

#### 5.2.6 我的预约页 (`/admin/shared-office/my-bookings`)
**功能**：
- 显示我申请的所有预约
- 筛选：按状态、日期筛选
- 查看预约详情
- 取消预约
- 确认使用
- 评价

**状态分类**：
- 待审核
- 已确认（待使用）
- 使用中
- 已完成
- 已取消

### 5.3 通用页面

#### 5.3.1 预约详情页 (`/admin/shared-office/bookings/:id`)
**功能**：
- 显示预约完整信息
- 空间信息
- 需求方/提供方信息
- 使用规则
- 操作按钮（确认/取消/评价）

#### 5.3.2 个人中心 (`/admin/shared-office/profile`)
**功能**：
- 我的统计（提供方/需求方数据）
- 信用分和等级
- 评价历史
- 设置（通知偏好、隐私设置）

### 5.4 管理员页面

#### 5.4.1 空间审核页 (`/admin/shared-office/admin/spaces/review`)
**功能**：
- 待审核空间列表
- 查看空间详情
- 审核操作（通过/拒绝）
- 批量审核

#### 5.4.2 需求审核页 (`/admin/shared-office/admin/requests/review`)
**功能**：
- 待审核需求列表
- 查看需求详情
- 审核操作（通过/拒绝）

#### 5.4.3 数据统计页 (`/admin/shared-office/admin/analytics`)
**功能**：
- 平台总览数据
- 空间统计（总数、类型分布、城市分布）
- 需求统计（总数、类型分布、城市分布）
- 匹配统计（匹配次数、成功率）
- 使用统计（完成次数、平均时长）
- 用户统计（活跃用户、信用分布）

---

## 6. 业务流程

### 6.1 空间发布流程
```
1. 提供方登录系统
2. 进入"我的空间"页面
3. 点击"发布新空间"
4. 填写空间信息表单
   - 基本信息（名称、类型、描述）
   - 位置信息（地址、地图定位）
   - 空间属性（面积、容量、设施）
   - 可用性（日期、时间段）
   - 价格信息
   - 规则说明
   - 上传照片
5. 保存草稿（可选）或提交审核
6. 系统自动检查必填项和格式
7. 提交后状态变为"待审核"
8. 管理员审核
   - 通过：状态变为"已发布"，空间对外可见
   - 拒绝：状态变为"草稿"，返回修改意见
9. 提供方收到审核结果通知
10. 空间上线，可被搜索和预约
```

### 6.2 需求发布流程
```
1. 需求方登录系统
2. 进入"我的需求"页面
3. 点击"发布新需求"
4. 填写需求信息表单
   - 需求标题和描述
   - 目标城市/区域
   - 使用日期和时间
   - 空间类型和容量
   - 必需设施
   - 预算范围
5. 保存草稿（可选）或提交发布
6. 系统自动检查必填项
7. 提交后状态变为"已发布"
8. 系统立即执行匹配算法
9. 生成匹配推荐列表（Top 10）
10. 需求方收到匹配推荐通知
11. 需求对外可见，提供方也可看到需求
```

### 6.3 匹配与预约流程
```
1. 需求方查看匹配推荐
2. 浏览推荐空间列表（按匹配分数排序）
3. 点击空间查看详情
   - 查看照片、设施、评价
   - 查看位置地图
   - 查看可用时间
4. 选择心仪空间，点击"申请预约"
5. 填写预约信息
   - 确认使用时间
   - 填写预计人数
   - 填写使用用途
   - 填写特殊要求
   - 填写联系方式
6. 提交预约申请
7. 提供方收到预约申请通知
8. 提供方查看预约详情
   - 查看需求方信息
   - 查看需求详情
   - 查看信用分
9. 提供方审核预约
   - 同意：确认预约，生成预约凭证
   - 拒绝：填写拒绝原因
   - 需要沟通：发送消息给需求方
10. 需求方收到审核结果通知
11. 如果同意，预约状态变为"已确认"
12. 双方收到预约确认通知和凭证
```

### 6.4 使用与完成流程
```
1. 预约确认后，状态为"待使用"
2. 使用前24小时，系统发送提醒通知
3. 使用当天，需求方到达空间
4. 提供方确认使用开始（或需求方扫码签到）
   - 状态变为"使用中"
   - 记录签到时间
5. 使用过程中
   - 双方可随时沟通
   - 如有问题可联系平台客服
6. 使用结束
   - 需求方确认使用完成
   - 提供方确认使用完成
   - 状态变为"已完成"
   - 记录签退时间
7. 系统发送评价提醒（使用完成后7天内）
8. 双方互评（可选）
   - 评价完成后评价公开显示
   - 更新空间平均评分
   - 更新用户信用分
9. 流程结束
```

### 6.5 取消流程
```
需求方取消：
1. 需求方进入"我的预约"
2. 找到要取消的预约
3. 点击"取消预约"
4. 选择取消原因
5. 系统检查取消时间
   - 使用前24小时：免费取消
   - 使用前12-24小时：扣除部分费用（如已付费）
   - 使用前12小时内：扣除全部费用
6. 确认取消
7. 提供方收到取消通知
8. 如有费用，处理退款
9. 更新预约状态为"已取消"
10. 更新信用分（如无正当理由）

提供方取消：
1. 提供方进入"预约管理"
2. 找到要取消的预约
3. 点击"取消预约"
4. 填写取消原因（必填）
5. 确认取消
6. 需求方收到取消通知
7. 平台协助寻找替代方案
8. 更新预约状态为"已取消"
9. 更新提供方信用分（扣分）
10. 如有费用，全额退款
```

---

## 7. 技术实现方案

### 7.1 前端技术栈
- **框架**：React + TypeScript
- **UI组件库**：Ant Design / Material-UI
- **状态管理**：React Context / Redux
- **路由**：React Router
- **地图组件**：高德地图 / 百度地图 / Google Maps API
- **日期时间选择**：Ant Design DatePicker / react-datepicker
- **图片上传**：Ant Design Upload / react-dropzone
- **表单处理**：React Hook Form / Formik
- **HTTP客户端**：Axios / Fetch API
- **实时通信**：Supabase Realtime（用于消息通知）

### 7.2 后端技术栈
- **数据库**：PostgreSQL（Supabase）
- **API框架**：Supabase REST API / PostgreSQL Functions
- **认证授权**：Supabase Auth
- **文件存储**：Supabase Storage（用于照片存储）
- **实时订阅**：Supabase Realtime（用于实时通知）
- **任务队列**：Supabase Edge Functions（用于异步任务，如匹配算法）

### 7.3 核心服务实现

#### 7.3.1 匹配算法服务
**位置**：`src/services/sharedOffice/matchService.ts`

**核心函数**：
```typescript
/**
 * 执行智能匹配算法
 * @param requestId 需求ID
 * @returns 匹配结果列表（按分数降序）
 */
async function performMatching(requestId: number): Promise<MatchResult[]>

/**
 * 计算匹配分数
 * @param request 需求信息
 * @param space 空间信息
 * @returns 匹配分数（0-100）
 */
function calculateMatchScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算地理位置匹配分
 */
function calculateLocationScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算时间匹配分
 */
function calculateTimeScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算类型匹配分
 */
function calculateTypeScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算容量匹配分
 */
function calculateCapacityScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算价格匹配分
 */
function calculatePriceScore(request: SpaceRequest, space: OfficeSpace): number

/**
 * 计算设施匹配分
 */
function calculateFacilityScore(request: SpaceRequest, space: OfficeSpace): number
```

#### 7.3.2 空间管理服务
**位置**：`src/services/sharedOffice/spaceService.ts`

**核心函数**：
```typescript
/**
 * 创建空间
 */
async function createSpace(data: CreateSpaceData, userId: number): Promise<OfficeSpace>

/**
 * 更新空间
 */
async function updateSpace(id: number, data: UpdateSpaceData, userId: number): Promise<OfficeSpace>

/**
 * 获取空间列表
 */
async function getSpaces(filters: SpaceFilters): Promise<OfficeSpace[]>

/**
 * 获取空间详情
 */
async function getSpaceById(id: number): Promise<OfficeSpace | null>

/**
 * 删除空间
 */
async function deleteSpace(id: number, userId: number): Promise<void>

/**
 * 上架/下架空间
 */
async function toggleSpaceStatus(id: number, status: string, userId: number): Promise<void>
```

#### 7.3.3 需求管理服务
**位置**：`src/services/sharedOffice/requestService.ts`

**核心函数**：
```typescript
/**
 * 创建需求
 */
async function createRequest(data: CreateRequestData, userId: number): Promise<SpaceRequest>

/**
 * 更新需求
 */
async function updateRequest(id: number, data: UpdateRequestData, userId: number): Promise<SpaceRequest>

/**
 * 获取需求列表
 */
async function getRequests(filters: RequestFilters): Promise<SpaceRequest[]>

/**
 * 获取需求详情
 */
async function getRequestById(id: number): Promise<SpaceRequest | null>

/**
 * 获取匹配推荐
 */
async function getMatchRecommendations(requestId: number): Promise<MatchResult[]>
```

#### 7.3.4 预约管理服务
**位置**：`src/services/sharedOffice/bookingService.ts`

**核心函数**：
```typescript
/**
 * 创建预约申请
 */
async function createBooking(data: CreateBookingData, userId: number): Promise<Booking>

/**
 * 审核预约申请
 */
async function reviewBooking(bookingId: number, action: 'approve' | 'reject', providerId: number, reason?: string): Promise<Booking>

/**
 * 确认预约
 */
async function confirmBooking(bookingId: number, providerId: number): Promise<Booking>

/**
 * 取消预约
 */
async function cancelBooking(bookingId: number, userId: number, reason: string): Promise<Booking>

/**
 * 签到
 */
async function checkIn(bookingId: number, userId: number): Promise<Booking>

/**
 * 签退
 */
async function checkOut(bookingId: number, userId: number): Promise<Booking>
```

#### 7.3.5 评价服务
**位置**：`src/services/sharedOffice/ratingService.ts`

**核心函数**：
```typescript
/**
 * 创建评价
 */
async function createRating(data: CreateRatingData, userId: number): Promise<Rating>

/**
 * 获取空间评价列表
 */
async function getSpaceRatings(spaceId: number): Promise<Rating[]>

/**
 * 获取用户评价历史
 */
async function getUserRatings(userId: number): Promise<Rating[]>
```

#### 7.3.6 信用分服务
**位置**：`src/services/sharedOffice/creditService.ts`

**核心函数**：
```typescript
/**
 * 获取用户信用分
 */
async function getCreditScore(userId: number): Promise<CreditScore>

/**
 * 更新信用分
 */
async function updateCreditScore(userId: number, changeType: string, changeAmount: number, reason: string): Promise<CreditScore>

/**
 * 计算信用等级
 */
function calculateCreditLevel(score: number): string
```

### 7.4 地图集成

#### 7.4.1 地图选择位置
- 使用高德地图 / 百度地图 API
- 支持搜索地址
- 支持拖拽标记
- 自动获取经纬度
- 显示周边设施（地铁、公交、停车场）

#### 7.4.2 地图展示空间
- 在地图上标记所有可用空间
- 点击标记显示空间卡片
- 支持筛选显示
- 显示距离和路线规划

### 7.5 实时通知

#### 7.5.1 通知类型
- 预约申请通知
- 预约审核结果通知
- 预约确认通知
- 预约变更通知
- 使用提醒通知
- 评价提醒通知
- 匹配推荐通知

#### 7.5.2 通知渠道
- 站内消息（Supabase Realtime）
- 邮件通知（Supabase Edge Functions + 邮件服务）
- 短信通知（可选，紧急情况）
- 微信/企业微信通知（可选）

### 7.6 图片上传与存储

#### 7.6.1 存储方案
- 使用 Supabase Storage
- 存储路径：`shared-office/spaces/{spaceId}/photos/{filename}`
- 支持格式：JPG、PNG、WebP
- 最大文件大小：5MB
- 自动压缩和缩略图生成

#### 7.6.2 上传流程
1. 前端选择图片
2. 预览图片
3. 上传到 Supabase Storage
4. 获取文件URL
5. 保存URL到数据库

---

## 8. API设计

### 8.1 空间管理API

#### 8.1.1 创建空间
```
POST /api/shared-office/spaces
Request Body:
{
  name: string,
  space_type: string,
  description: string,
  address: string,
  city: string,
  district: string,
  latitude: number,
  longitude: number,
  area: number,
  capacity: number,
  facilities: string[],
  available_days: string[],
  available_time_slots: object[],
  pricing_model: string,
  price: number,
  rules: string,
  photos: string[]
}

Response:
{
  id: number,
  ...space data
}
```

#### 8.1.2 获取空间列表
```
GET /api/shared-office/spaces?city={city}&type={type}&status={status}&page={page}&limit={limit}

Response:
{
  data: OfficeSpace[],
  total: number,
  page: number,
  limit: number
}
```

#### 8.1.3 获取空间详情
```
GET /api/shared-office/spaces/:id

Response:
{
  ...space data,
  bookings: Booking[],
  ratings: Rating[]
}
```

### 8.2 需求管理API

#### 8.2.1 创建需求
```
POST /api/shared-office/requests
Request Body:
{
  title: string,
  request_type: string,
  target_cities: string[],
  use_date: string,
  use_time_start: string,
  use_time_end: string,
  expected_capacity: number,
  required_facilities: string[],
  budget_range: string
}

Response:
{
  id: number,
  ...request data,
  matches: MatchResult[]
}
```

#### 8.2.2 获取匹配推荐
```
GET /api/shared-office/requests/:id/matches

Response:
{
  matches: MatchResult[]
}
```

### 8.3 预约管理API

#### 8.3.1 创建预约
```
POST /api/shared-office/bookings
Request Body:
{
  space_id: number,
  request_id: number,
  booking_date: string,
  start_time: string,
  end_time: string,
  expected_attendees: number,
  purpose: string,
  contact_phone: string
}

Response:
{
  id: number,
  ...booking data
}
```

#### 8.3.2 审核预约
```
PATCH /api/shared-office/bookings/:id/review
Request Body:
{
  action: 'approve' | 'reject',
  reason?: string
}

Response:
{
  ...booking data
}
```

### 8.4 评价API

#### 8.4.1 创建评价
```
POST /api/shared-office/ratings
Request Body:
{
  booking_id: number,
  overall_rating: number,
  punctuality_rating: number,
  cleanliness_rating: number,
  facility_rating: number,
  service_rating: number,
  comment: string
}

Response:
{
  id: number,
  ...rating data
}
```

---

## 9. 安全与权限控制

### 9.1 数据访问控制
- 使用 Supabase RLS（Row Level Security）策略
- 用户只能查看和操作自己的数据
- 空间提供方只能管理自己发布的空间
- 需求方只能管理自己发布的需求
- 预约双方都可以查看预约详情

### 9.2 操作权限
- **空间发布**：所有认证用户
- **空间审核**：仅管理员
- **需求发布**：所有认证用户
- **预约申请**：所有认证用户
- **预约审核**：仅空间提供方
- **评价**：仅预约双方

### 9.3 数据验证
- 前端表单验证
- 后端数据验证
- 防止SQL注入（使用参数化查询）
- 防止XSS攻击（输入转义）
- 文件上传验证（类型、大小）

### 9.4 隐私保护
- 评价匿名显示
- 联系方式仅在预约确认后可见
- 地理位置精确度控制（不显示详细门牌号）
- 用户数据加密存储

---

## 10. 性能优化

### 10.1 数据库优化
- 为常用查询字段创建索引
- 使用GIN索引支持JSONB字段查询
- 使用GIST索引支持地理位置查询
- 定期清理过期数据
- 分页查询避免大数据量加载

### 10.2 前端优化
- 图片懒加载
- 列表虚拟滚动
- 防抖和节流
- 缓存常用数据
- 代码分割和懒加载

### 10.3 匹配算法优化
- 异步执行匹配算法（避免阻塞）
- 缓存匹配结果
- 增量匹配（仅匹配新需求）
- 使用数据库函数优化计算

---

## 11. 测试方案

### 11.1 单元测试
- 匹配算法测试
- 信用分计算测试
- 数据验证测试
- 工具函数测试

### 11.2 集成测试
- API接口测试
- 数据库操作测试
- 权限控制测试

### 11.3 端到端测试
- 完整业务流程测试
- 用户交互测试
- 跨浏览器测试

---

## 12. 部署方案

### 12.1 环境配置
- **开发环境**：本地开发 + Supabase开发项目
- **测试环境**：Supabase测试项目
- **生产环境**：Supabase生产项目

### 12.2 数据库迁移
- 使用 Supabase Migration
- 版本控制迁移脚本
- 回滚方案

### 12.3 监控与日志
- Supabase Logs监控
- 错误追踪（Sentry）
- 性能监控
- 用户行为分析

---

## 13. 运营与维护

### 13.1 内容审核
- 空间信息审核（真实性、合规性）
- 需求信息审核
- 评价内容审核
- 违规处理

### 13.2 用户支持
- 帮助文档
- 常见问题FAQ
- 在线客服
- 反馈渠道

### 13.3 数据分析
- 空间利用率分析
- 匹配成功率分析
- 用户行为分析
- 热门城市/区域分析
- 价格趋势分析

### 13.4 功能迭代
- 用户反馈收集
- 功能优先级排序
- 版本发布计划
- A/B测试

---

## 14. 未来扩展

### 14.1 功能扩展
- **长期租赁**：支持按月/按年租赁
- **空间组合**：支持多个空间组合使用
- **企业账户**：支持企业批量管理
- **移动端App**：开发原生移动应用
- **小程序**：开发微信小程序版本

### 14.2 技术扩展
- **AI推荐**：使用机器学习优化匹配算法
- **智能定价**：根据供需关系动态定价
- **区块链**：使用区块链记录交易和评价
- **VR预览**：支持VR查看空间

### 14.3 生态扩展
- **合作伙伴**：与办公空间运营商合作
- **服务集成**：集成其他服务（打印、餐饮等）
- **社区功能**：建立用户社区
- **积分系统**：建立积分奖励机制

---

## 15. 项目排期

### 15.1 第一阶段（MVP - 4周）
- ✅ 数据库设计
- ✅ 空间发布功能
- ✅ 需求发布功能
- ✅ 基础匹配算法
- ✅ 预约申请功能
- ✅ 基础审核流程

### 15.2 第二阶段（完善功能 - 3周）
- ✅ 预约管理功能
- ✅ 评价系统
- ✅ 信用体系
- ✅ 搜索筛选功能
- ✅ 地图集成

### 15.3 第三阶段（优化体验 - 2周）
- ✅ 实时通知
- ✅ 消息系统
- ✅ 数据统计
- ✅ 管理员功能
- ✅ 性能优化

### 15.4 第四阶段（测试上线 - 1周）
- ✅ 全面测试
- ✅ Bug修复
- ✅ 文档完善
- ✅ 上线部署
- ✅ 用户培训

---

## 16. 风险评估

### 16.1 技术风险
- **匹配算法准确性**：需要不断优化和调整
- **并发处理**：高并发场景下的性能问题
- **数据一致性**：分布式环境下的数据同步

### 16.2 业务风险
- **虚假信息**：空间信息不真实
- **违约风险**：预约后不履约
- **纠纷处理**：使用过程中的纠纷

### 16.3 应对措施
- 建立完善的审核机制
- 建立信用体系
- 建立纠纷处理流程
- 购买保险（可选）
- 法律条款保护

---

## 17. 总结

共享办公空间匹配系统是一个创新的资源共享平台，通过智能匹配算法连接空间提供方和需求方，实现资源的有效利用和成本降低。系统设计考虑了用户体验、技术实现、安全性和可扩展性，为留学服务行业提供了一个实用的工具。

### 核心价值
1. **降低运营成本**：避免临时租用高额费用
2. **提升资源利用率**：闲置空间得到有效利用
3. **增强服务灵活性**：支持跨城市业务拓展
4. **构建社区生态**：促进平台内成员互助合作

### 关键成功因素
1. **用户信任**：建立完善的信用体系和审核机制
2. **匹配准确性**：不断优化匹配算法
3. **用户体验**：简洁易用的界面和流畅的流程
4. **运营支持**：及时响应用户需求和问题

---

**文档版本**：v1.0  
**最后更新**：2025-01-22  
**维护者**：产品与技术团队