# AI 模型配置说明

## 📋 配置格式

您的项目已经支持多模型配置！只需要在 `.env` 文件中按以下格式配置即可。

---

## ✅ 正确的配置示例

### 方式 1: DeepSeek V3 + GPT-4o（您的需求）

```bash
# DeepSeek V3 (默认模型)
VITE_AI_API_KEY=your-deepseek-api-key
VITE_AI_API_HOST=https://api.deepseek.com
VITE_AI_API_MODEL=deepseek-chat
VITE_AI_API_MODEL_LABEL=deepseek-v3（默认）

# GPT-4o (额外模型)
VITE_AI_MODEL_GPT4O=gpt-4o
VITE_AI_MODEL_GPT4O_LABEL=GPT-4o
VITE_AI_API_KEY_GPT4O=your-openai-api-key
VITE_AI_API_HOST_GPT4O=https://api.openai.com
```

### 方式 2: 多个模型并存

```bash
# 默认模型 (DeepSeek V3)
VITE_AI_API_KEY=sk-xxxxx
VITE_AI_API_HOST=https://api.deepseek.com
VITE_AI_API_MODEL=deepseek-chat
VITE_AI_API_MODEL_LABEL=deepseek-v3（默认）

# 额外模型 1: GPT-4
VITE_AI_MODEL_GPT4=gpt-4
VITE_AI_MODEL_GPT4_LABEL=GPT-4
VITE_AI_API_KEY_GPT4=sk-your-openai-key
VITE_AI_API_HOST_GPT4=https://api.openai.com

# 额外模型 2: GPT-3.5
VITE_AI_MODEL_GPT35=gpt-3.5-turbo
VITE_AI_MODEL_GPT35_LABEL=GPT-3.5 Turbo
VITE_AI_API_KEY_GPT35=sk-your-openai-key
VITE_AI_API_HOST_GPT35=https://api.openai.com

# 额外模型 3: Claude
VITE_AI_MODEL_CLAUDE=claude-3-opus-20240229
VITE_AI_MODEL_CLAUDE_LABEL=Claude 3 Opus
VITE_AI_API_KEY_CLAUDE=sk-ant-xxxxx
VITE_AI_API_HOST_CLAUDE=https://api.anthropic.com
```

---

## 📝 配置规则

### 1. 默认模型（必填）

这是系统启动时默认使用的模型：

```bash
VITE_AI_API_KEY=your-api-key           # API 密钥
VITE_AI_API_HOST=https://api.xxx.com   # API 地址
VITE_AI_API_MODEL=model-name            # 模型名称
VITE_AI_API_MODEL_LABEL=显示名称（可选）  # 在界面中显示的名称
```

### 2. 额外模型（可选，可配置多个）

格式规则：
- `VITE_AI_MODEL_{名称}` = 模型名称
- `VITE_AI_MODEL_{名称}_LABEL` = 显示标签（可选）
- `VITE_AI_API_KEY_{名称}` = API Key（可选，不填则使用默认）
- `VITE_AI_API_HOST_{名称}` = API Host（可选，不填则使用默认）

其中 `{名称}` 可以是：
- ✅ `GPT4` → 识别为 `gpt4`
- ✅ `GPT4O` → 识别为 `gpt4o`
- ✅ `DEEPSEEK_V3` → 识别为 `deepseek-v3`
- ✅ `CLAUDE` → 识别为 `claude`
- ❌ 不能包含特殊字符（除了下划线）

---

## ❌ 常见错误配置

### 错误 1: GPT-5 不存在

```bash
# ❌ 错误：OpenAI 没有 gpt-5 模型
VITE_AI_MODEL_GPT5=gpt-5
```

OpenAI 目前的模型是：
- `gpt-4` - GPT-4
- `gpt-4o` - GPT-4o (更快)
- `gpt-4o-mini` - GPT-4o Mini (更便宜)
- `gpt-3.5-turbo` - GPT-3.5 Turbo

### 错误 2: 缺少必要配置

```bash
# ❌ 错误：只配置了模型名，没有配置 API Key 和 Host
VITE_AI_MODEL_GPT4=gpt-4
# 缺少：VITE_AI_API_KEY_GPT4 和 VITE_AI_API_HOST_GPT4
```

如果额外模型不指定 Key/Host，会使用默认的。如果默认的 Key/Host 不兼容该模型，会调用失败。

### 错误 3: API Host 后面有多余斜杠

```bash
# ❌ 错误：API Host 末尾有斜杠
VITE_AI_API_HOST=https://api.openai.com/
# ✅ 正确
VITE_AI_API_HOST=https://api.openai.com
```

---

## 🔧 您的配置建议

根据您提到的需求（DeepSeek V3 + GPT），建议配置如下：

### 推荐配置：

```bash
# ===================================
# 默认模型：DeepSeek V3
# ===================================
VITE_AI_API_KEY=your-deepseek-api-key
VITE_AI_API_HOST=https://api.deepseek.com
VITE_AI_API_MODEL=deepseek-chat
VITE_AI_API_MODEL_LABEL=deepseek-v3（默认）

# ===================================
# 额外模型：GPT-4o
# ===================================
VITE_AI_MODEL_GPT4O=gpt-4o
VITE_AI_MODEL_GPT4O_LABEL=GPT-4o
VITE_AI_API_KEY_GPT4O=your-openai-api-key
VITE_AI_API_HOST_GPT4O=https://api.openai.com

# ===================================
# 额外模型：GPT-4o Mini（更便宜）
# ===================================
VITE_AI_MODEL_GPT4O_MINI=gpt-4o-mini
VITE_AI_MODEL_GPT4O_MINI_LABEL=GPT-4o Mini
VITE_AI_API_KEY_GPT4O_MINI=your-openai-api-key
VITE_AI_API_HOST_GPT4O_MINI=https://api.openai.com
```

---

## 🚀 配置后的使用

### 1. 重启开发服务器

修改 `.env` 后，必须重启 Vite 开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 2. 在 AI 对话框中切换模型

配置生效后，AI 对话框的输入框右侧会显示模型选择下拉菜单，您可以随时切换。

### 3. 验证配置

打开浏览器控制台（F12），输入：

```javascript
// 查看所有可用模型
console.log(window.aiService?.getAvailableModels())

// 查看当前激活的模型
console.log(window.aiService?.getActiveModel())
```

---

## 📚 API 服务商信息

### DeepSeek
- 官网：https://www.deepseek.com/
- API 文档：https://platform.deepseek.com/api-docs/
- API Host: `https://api.deepseek.com`
- 模型名称：`deepseek-chat`, `deepseek-coder`

### OpenAI
- 官网：https://openai.com/
- API 文档：https://platform.openai.com/docs/
- API Host: `https://api.openai.com`
- 模型名称：`gpt-4`, `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`

### ChatAnywhere（OpenAI 转发）
- 官网：https://api.chatanywhere.tech/
- API Host: `https://api.chatanywhere.tech`
- 使用 OpenAI 模型名称

---

## ❓ 常见问题

### Q1: 为什么下拉菜单只显示一个模型？

**A:** 检查以下几点：
1. `.env` 文件是否保存
2. 是否重启了开发服务器（`npm run dev`）
3. 额外模型的配置格式是否正确
4. 浏览器控制台是否有错误

### Q2: 切换模型后，AI 调用失败？

**A:** 确认该模型的 API Key 和 Host 配置正确：
- 如果额外模型没有单独配置 Key/Host，会使用默认的
- 确保默认的 Key 对该模型有权限

### Q3: 如何查看当前使用的是哪个模型？

**A:** AI 对话框输入框右侧会显示当前模型名称。

---

## 📞 需要帮助？

如果配置后仍有问题，请提供：
1. 您的 `.env` 配置（隐藏 API Key）
2. 浏览器控制台的错误信息
3. AI 对话框下拉菜单显示的内容截图

