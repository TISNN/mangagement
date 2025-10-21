# ⏰ 系统时间说明

## 📍 时间定义方式

### 当前使用的时间源

项目中使用 **JavaScript 原生 `Date` 对象**,它基于:

```javascript
// 获取当前时间
new Date()

// 获取当前小时数 (0-23)
new Date().getHours()

// 获取时间戳
Date.now()

// 获取完整 ISO 字符串
new Date().toISOString()
```

---

## 🌍 时区处理

### 1. 浏览器时区 (默认)

**当前实现:**
```typescript
// DashboardPage.tsx
const hour = new Date().getHours(); // 使用浏览器本地时间
```

**特点:**
- ✅ 自动使用用户设备的时区
- ✅ 无需额外配置
- ⚠️ 不同用户看到的时间可能不同

### 2. 时区偏移计算

在 `src/utils/dateUtils.ts` 中有时区处理:

```typescript
const now = new Date();
const offset = now.getTimezoneOffset() * 60000; // 分钟转毫秒
const localDate = new Date(now.getTime() - offset);
```

**说明:**
- `getTimezoneOffset()` 返回本地时间与 UTC 的分钟差
- 北京时间 (UTC+8): offset = -480 (分钟)

---

## 🕐 时间获取方式

### 1. Dashboard 问候语

```typescript
// src/pages/admin/DashboardPage.tsx
const getGreeting = () => {
  const hour = new Date().getHours(); // 获取当前小时 (0-23)
  
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 17) return '下午好';
  if (hour < 19) return '傍晚好';
  if (hour < 22) return '晚上好';
  return '夜深了';
};
```

**时间来源:**
- 用户浏览器的本地时间
- 自动适应用户时区

### 2. 考勤打卡

```typescript
// src/pages/admin/AttendancePage.tsx
const now = new Date();
{new Date().toLocaleTimeString()}  // 显示本地时间
{new Date().toLocaleDateString('zh-CN', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
```

**显示格式:**
- `toLocaleTimeString()`: "14:30:45"
- `toLocaleDateString('zh-CN')`: "2025年10月20日 星期一"

### 3. 数据记录

```typescript
// 创建 ISO 格式时间戳
new Date().toISOString()  // "2025-10-20T06:15:30.123Z"

// 只要日期
new Date().toISOString().split('T')[0]  // "2025-10-20"

// 时间戳 (毫秒)
Date.now()  // 1729406130123
```

---

## ⚙️ 时间配置选项

### 方案 1: 使用浏览器时间 (当前方案)

**优点:**
- ✅ 简单直接
- ✅ 自动适应用户时区
- ✅ 无需服务器同步

**缺点:**
- ⚠️ 依赖用户设备时间
- ⚠️ 用户可能手动修改时间
- ⚠️ 不同时区用户体验不一致

**适用场景:**
- 个人设备使用
- 时区不敏感的应用
- 前端展示为主

---

### 方案 2: 使用服务器时间 (推荐用于生产环境)

**实现方式:**

```typescript
// 1. 从服务器获取时间
async function getServerTime() {
  const response = await fetch('/api/server-time');
  const data = await response.json();
  return new Date(data.serverTime);
}

// 2. 在组件中使用
const [serverTime, setServerTime] = useState<Date | null>(null);

useEffect(() => {
  getServerTime().then(time => setServerTime(time));
}, []);

const getGreeting = () => {
  const hour = serverTime ? serverTime.getHours() : new Date().getHours();
  // ... 问候逻辑
};
```

**优点:**
- ✅ 统一时间基准
- ✅ 不受用户设备影响
- ✅ 适合多时区团队

**缺点:**
- ⚠️ 需要后端支持
- ⚠️ 网络延迟影响

---

### 方案 3: 指定时区 (企业级方案)

**使用时区库:**

```bash
npm install dayjs
npm install dayjs/plugin/timezone
```

**实现:**

```typescript
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区为北京时间
const beijingTime = dayjs().tz('Asia/Shanghai');
const hour = beijingTime.hour(); // 0-23

const getGreeting = () => {
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  // ... 其他逻辑
};
```

**优点:**
- ✅ 精确时区控制
- ✅ 支持时区转换
- ✅ 适合国际化应用

---

## 🔧 当前系统时间流程

### 用户登录到看到问候语

```
1. 用户在北京 (GMT+8) 早上 9:30 登录
   ↓
2. 浏览器获取本地时间: new Date()
   ↓
3. 提取小时数: new Date().getHours() = 9
   ↓
4. 匹配问候语规则:
   - hour = 9
   - 9 < 12 (上午好的条件)
   ↓
5. 显示: "上午好, Evan Xu"
```

### 不同时区的表现

| 用户位置 | 本地时间 | 显示问候 |
|---------|---------|---------|
| 北京 (GMT+8) | 09:00 | 上午好 |
| 纽约 (GMT-5) | 20:00 (前一天) | 晚上好 |
| 伦敦 (GMT+0) | 01:00 | 凌晨好 |

---

## 📊 时间相关功能清单

### 1. 问候语 (Dashboard)
- **使用:** `new Date().getHours()`
- **时区:** 浏览器本地时区
- **更新:** 每次刷新页面

### 2. 考勤打卡
- **使用:** `new Date()`
- **格式:** ISO 8601
- **存储:** Supabase 数据库

### 3. 数据记录
- **创建时间:** `new Date().toISOString()`
- **格式:** "2025-10-20T06:15:30.123Z"
- **时区:** UTC (国际标准时间)

### 4. 任务到期
- **使用:** `new Date().toISOString().split('T')[0]`
- **格式:** "2025-10-20"
- **比较:** 时间戳比较 `.getTime()`

---

## 💡 开发建议

### 本地开发
```javascript
// 当前方案已足够
const hour = new Date().getHours();
```

### 生产环境 (如果需要统一时区)

**选项 A: 后端提供时间 API**
```typescript
// backend/api/server-time.ts
export async function GET() {
  return Response.json({
    serverTime: new Date().toISOString(),
    timezone: 'Asia/Shanghai'
  });
}
```

**选项 B: 前端统一时区**
```typescript
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
const hour = dayjs().tz('Asia/Shanghai').hour();
```

---

## 🧪 测试时间功能

### 方法 1: 修改系统时间
1. 修改设备系统时间
2. 刷新浏览器
3. 查看问候语变化

### 方法 2: 使用开发者工具
```javascript
// 在浏览器控制台运行
const originalDate = Date;
Date = class extends originalDate {
  constructor() {
    super();
    // 模拟时间为晚上 8 点
    return new originalDate('2025-10-20T20:00:00');
  }
};
```

### 方法 3: 添加时间选择器 (开发用)
```typescript
const [debugTime, setDebugTime] = useState<number | null>(null);

const getGreeting = () => {
  const hour = debugTime !== null 
    ? debugTime 
    : new Date().getHours();
  // ... 问候逻辑
};

// 调试用选择器
<input 
  type="number" 
  min="0" 
  max="23" 
  onChange={(e) => setDebugTime(Number(e.target.value))}
/>
```

---

## ✅ 总结

### 当前系统时间定义

| 项目 | 说明 |
|------|------|
| **时间源** | JavaScript `Date` 对象 |
| **时区** | 浏览器本地时区 |
| **格式** | ISO 8601 / 本地化格式 |
| **存储** | UTC 时间戳 (Supabase) |
| **显示** | 本地化时间 |

### 适用场景
- ✅ 个人或小团队使用
- ✅ 同一时区内的用户
- ✅ 时区不敏感的功能

### 如需改进
- 📝 添加服务器时间同步
- 📝 使用 dayjs 等时区库
- 📝 配置默认时区设置
- 📝 添加时区选择器

---

**当前系统使用浏览器本地时间,自动适应用户时区!** ⏰

