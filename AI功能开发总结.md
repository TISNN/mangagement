# AI 协作功能开发总结

## 📋 功能目标

为会议文档编辑器和知识库文档编辑器添加 **Notion 风格的 AI 协作功能**，实现：

### 核心功能
1. **空行按空格触发 AI**：在编辑器中，当光标在空行时按空格键，弹出 AI 助手对话框
2. **AI 助手菜单**：提供多种 AI 功能选项
   - 📝 **撰写类**：随心写作、继续写作
   - 💡 **思考类**：头脑风暴、帮助编写代码
   - 📊 **创建类**：起草提纲、制作表格、制作流程图
   - 🔧 **优化类**：改写、总结、翻译等
3. **AI 结果对话框**：展示 AI 生成结果，支持接受、拒绝、重新生成
4. **自定义提示词**：用户可以输入自定义的 AI 指令

---

## ✅ 已完成内容

### 1. 编辑器升级
- ✅ 替换旧编辑器为 **Tiptap Simple Template**（更好的 UI 和功能）
- ✅ 修复了大量路径别名冲突（`@/lib/utils` vs `@/lib/tiptap-utils`）
- ✅ 解决了 Tiptap 扩展导入错误（TaskItem、TaskList 等）
- ✅ 将工具栏和菜单全部翻译为中文
- ✅ 创建了 `SimpleEditorWrapper` 组件，统一编辑器接口

### 2. AI 组件开发
- ✅ **AIAssistant 组件** (`src/components/AIAssistant/index.tsx`)
  - 完整的 Notion 风格 UI 设计
  - 分类建议菜单（建议、撰写、思考/询问/对话）
  - 搜索输入框
  - 作用域选择（当前页面）
  
- ✅ **AIResultDialog 组件** (`src/components/AIAssistant/AIResultDialog.tsx`)
  - 显示 AI 生成结果
  - 提供接受、拒绝、重新生成三个操作按钮
  - 加载状态动画

- ✅ **AI 服务层** (`src/services/aiService.ts`)
  - 定义了所有 AI 功能接口（继续写作、优化、起草、提纲、头脑风暴、自定义）
  - 提供模拟数据（用于开发测试）
  - 预留了真实 AI API 集成接口（通义千问、OpenAI 等）
  - 支持从 `.env` 读取多模型配置（`VITE_AI_API_MODEL` / `VITE_AI_MODEL_*`），并在前端实时切换

### 3. 触发机制
- ✅ 在 `SimpleEditorWrapper` 中添加了 `handleKeyDown` 监听
- ✅ 实现了空行检测逻辑（检查 `$from.parent.textContent.trim() === ''`）
- ✅ 计算光标位置（`view.coordsAtPos(selection.from)`）
- ✅ 状态管理（`showAIAssistant`, `aiPosition`, `showAIResult`, `aiResult` 等）

### 4. 页面集成
- ✅ 在 `MeetingDocumentEditorPage.tsx` 中添加了 AI 测试按钮（紫色 Sparkles 图标）
- ✅ 导入了 `AIAssistant` 组件
- ✅ 测试了简单对话框（已确认状态管理和渲染机制正常）

---

## ❌ 当前遇到的问题

 ### ✅ 核心问题：AIAssistant 组件无法显示（已解决）
 
 - 问题原因：组件被渲染在编辑器内部容器中，受限于层级与定位，未能在视窗中出现，调试日志也因此未打印。
 - 解决方案：
   - 使用 `createPortal` 将组件挂载到 `document.body`，并结合 `coordsAtPos` 实时计算位置，支持窗口尺寸与滚动变化。
   - 在空白行触发时计算光标坐标，提供与 Notion 相同的悬浮菜单体验，同时支持 ESC、遮罩点击关闭。
   - 清理调试日志、统一遮罩样式，保证在会议文档与知识库场景下表现一致。
 - 当前状态：在会议文档编辑器与知识库编辑器中均可通过空格唤起，悬浮面板稳定显示；自定义提示词与预置指令均能正常触发 AI。
 - 新增备用入口：支持在工具栏点击"AI 助手"按钮、快捷键 `⌘⇧A / Ctrl+Shift+A`、以及 `/ai` + 空格命令触发，确保在输入法或特殊节点下依然可用。

 ### ✅ 横向漂移问题（已解决 - 2025-11-04）
 
 - **问题描述**：滑动建议列表时，AI 对话框会横向漂移，而不是固定在当前文本行。
 - **问题原因**：
   1. 监听了全局 `scroll` 事件，建议列表内部滚动会触发重新计算位置
   2. 输入框（560px）和建议列表（360px）宽度不同，导致 `rect.width` 变化
   3. 水平位置计算依赖面板宽度（`position.left - rect.width / 2`），每次滚动都会重新计算
 - **解决方案**：
   1. **保存初始水平位置**：使用 `initialLeftRef` 保存首次计算的水平位置
   2. **首次计算后固定**：基于输入框宽度（560px）计算水平居中位置，后续不再改变
   3. **移除滚动监听**：只监听窗口 `resize` 事件，不再监听 `scroll`，避免不必要的重新计算
   4. **独立的垂直位置**：窗口 resize 时仅重新计算垂直位置，水平位置保持不变
 - **技术实现**：
   ```typescript
   const initialLeftRef = useRef<number | null>(null); // 保存初始水平位置
   
   const recalculatePosition = useCallback((isInitial = false) => {
     // ... 计算垂直位置 ...
     
     // 水平位置：首次计算后固定
     let left: number;
     if (isInitial || initialLeftRef.current === null) {
       const desiredLeft = position.left - 280; // 560 / 2 = 280
       left = Math.min(Math.max(desiredLeft, padding), ...);
       initialLeftRef.current = left; // 保存
     } else {
       left = initialLeftRef.current; // 使用保存的值
     }
   }, [position]);
   ```
 - **效果验证**：
   - ✅ 建议列表内部滚动时，对话框水平位置保持固定
   - ✅ 窗口 resize 时，对话框自动调整垂直位置，水平位置保持居中
   - ✅ 不再有横向漂移现象

 ### ❌ 工具栏 AI 按钮定位问题（已放弃 - 2025-11-04）
 
 - **问题描述**：点击工具栏的 "AI 助手" 按钮时，弹窗位置不在当前文本行，而是显示在右下角。
 - **问题原因**：
   1. 工具栏按钮点击时，编辑器可能未聚焦，光标位置不准确
   2. `coordsAtPos` 返回的坐标可能存在偏差
   3. 编辑器容器的定位和滚动影响了坐标计算
 - **尝试的解决方案**：
   1. 先聚焦编辑器，延迟获取位置
   2. 添加调试日志查看坐标计算
   3. 检查编辑器容器的边界矩形
 - **最终决策**：
   - **删除工具栏 AI 按钮**，简化触发方式
   - **只保留命令触发**：空格（空行）、快捷键（⌘⇧A / Ctrl+Shift+A）、`/ai` 命令
   - **添加提示语**：在编辑器 placeholder 中显示 `'输入文本，按"空格"启用 AI，按"/"启用指令...'`
 - **改动内容**：
   1. 删除 `SimpleEditorWrapper` 工具栏中的 AI 助手按钮
   2. 删除 `MeetingDocumentEditorPage.tsx` 中的测试按钮和相关代码
   3. 更新编辑器默认 placeholder 为提示语
   4. 清理所有调试日志
 - **当前状态**：
   - ✅ 空行按空格触发 AI 对话框
   - ✅ 快捷键 `⌘⇧A / Ctrl+Shift+A` 触发
   - ✅ `/ai` + 空格命令触发
   - ✅ 编辑器显示操作提示
   - ❌ 工具栏按钮已移除

---

## 🔧 待完成内容

### 短期任务（调试阶段）
1. **🔥 优先级 1：解决 AIAssistant 组件显示问题**
   - [x] 确认组件是否被正确导入
   - [x] 检查组件内部是否有渲染错误
   - [x] 验证 CSS 样式是否生效
   - [x] 测试组件独立渲染（Portal + 定位）

2. **空行按空格触发（SimpleEditorWrapper 中）**
   - [x] 确认触发逻辑正常
   - [x] 测试 AI 对话框是否在正确位置显示
   - [x] 处理 ESC 键关闭对话框

3. **AI 结果对话框测试**
   - [x] 测试 "接受并插入" 功能
   - [x] 测试 "拒绝" 功能
   - [x] 测试 "重新生成" 功能（保留上一次指令，便于重复生成）

### 中期任务（功能完善）
4. **AI API 集成**
   - [ ] 配置真实的 AI API（通义千问/OpenAI/Ollama）
   - [ ] 替换模拟数据为真实 API 调用
   - [ ] 处理 API 错误和超时
   - [ ] 添加 API Key 配置（环境变量 `VITE_AI_API_KEY`）

5. **用户体验优化**
  - [x] 添加加载动画（AI 思考中）
  - [x] 添加错误提示（API 调用失败）
  - [ ] 支持中断 AI 生成（取消按钮）
  - [ ] 添加历史记录（最近使用的 AI 功能）

6. **更多 AI 功能**
  - [x] 改写（Rewrite）
  - [x] 总结（Summarize）
  - [x] 翻译（Translate）
  - [ ] 扩写（Expand）
  - [ ] 语法检查（Grammar Check）
  - [x] 续写（Auto-complete）

### 长期任务（高级功能）
7. **多模型支持**
   - [ ] 允许用户选择 AI 模型（GPT-4、Claude、通义千问等）
   - [ ] 配置不同模型的参数（温度、最大长度等）

8. **智能上下文**
   - [ ] 传递编辑器全文上下文给 AI
   - [ ] 传递相关会议信息/文档信息
   - [ ] 根据文档类型智能推荐 AI 功能

9. **协作增强**
   - [ ] 显示其他用户使用 AI 的状态
   - [ ] AI 生成内容的版本对比
   - [ ] AI 建议的批注模式

---

## 📂 相关文件清单

### 核心组件
- `src/components/AIAssistant/index.tsx` - AI 助手主对话框
- `src/components/AIAssistant/AIResultDialog.tsx` - AI 结果显示对话框

### 服务层
- `src/services/aiService.ts` - AI API 接口封装（支持 `VITE_AI_API_HOST`、`VITE_AI_API_MODEL`、`VITE_AI_API_KEY` 配置，默认指向 chatanywhere 转发服务）

### 编辑器
- `src/components/SimpleEditorWrapper/index.tsx` - Tiptap 编辑器包装器
- `src/components/SimpleEditorWrapper/styles.css` - 编辑器样式

### 页面
- `src/pages/admin/MeetingDocumentEditorPage.tsx` - 会议文档编辑页（已集成）
- `src/pages/admin/KnowledgeBase/components/ResourceFormModal/index.tsx` - 知识库编辑（待集成）

### 配置
- `vite.config.ts` - 路径别名配置
- `tsconfig.app.json` - TypeScript 路径映射

---

## 🎯 下一步行动

### 立即执行（调试）
1. 检查 `AIAssistant` 组件导入是否正确
2. 临时创建一个超级简化版的 AIAssistant 组件测试渲染
3. 对比测试对话框和 AIAssistant 的差异

### 优先级排序
- **P0（紧急）**：解决 AIAssistant 显示问题
- **P1（高）**：完成基础 AI 功能（继续写作、起草提纲）
- **P2（中）**：集成真实 AI API
- **P3（低）**：优化体验和扩展功能

---

## 💡 技术要点

### 空行检测逻辑
```typescript
handleKeyDown: (view, event) => {
  if (event.key === ' ' || event.code === 'Space') {
    const { state } = view;
    const { $from } = state.selection;
    const isEmpty = $from.parent.textContent.trim() === '';
    
    if (isEmpty) {
      event.preventDefault();
      const coords = view.coordsAtPos(state.selection.from);
      // 触发 AI 助手
      setAIPosition({ top: coords.top, left: coords.left });
      setShowAIAssistant(true);
      return true;
    }
  }
  return false;
}
```

### AI 服务接口示例
```typescript
// 继续写作
export const aiContinue = (currentText: string) => 
  callAI(`请根据以下内容继续写作：\n\n${currentText}`, 'continue');

// 自定义提示词
export const aiCustom = (prompt: string, currentText: string) => 
  callAI(`${prompt}\n\n参考内容：\n${currentText}`, 'custom');
```

---

## 📝 备注

- 当前使用 **模拟数据** 进行开发（`aiService.ts` 中的 `mockResponses`）
- 真实 AI API 需要配置 `VITE_AI_API_KEY` 环境变量
- 推荐使用 **通义千问**（国内访问稳定）或 **Ollama**（本地部署，免费）
- 所有 AI 功能都可以在 `aiService.ts` 中扩展

---

**最后更新**：2025-11-04  
**状态**：开发中（卡在 AIAssistant 组件渲染问题）  
**负责人**：AI 助手 + 用户  
**优先级**：P0
