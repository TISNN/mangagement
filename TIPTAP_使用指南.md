# Tiptap 富文本编辑器使用指南

## 🎯 Tiptap 简介

Tiptap 是一个基于 ProseMirror 的无头(headless)富文本编辑器框架,专为 React/Vue 应用设计。

### 为什么选择 Tiptap?

- ✅ **完全可定制** - 无头设计,UI完全由你控制
- ✅ **TypeScript支持** - 完整的类型定义
- ✅ **模块化** - 按需引入扩展
- ✅ **性能优秀** - 基于 ProseMirror
- ✅ **实时协作** - 支持多人编辑(可选)
- ✅ **React友好** - 原生 React Hooks

## 📦 已安装的扩展

```bash
@tiptap/react              # React 绑定
@tiptap/starter-kit        # 基础扩展包
@tiptap/extension-placeholder    # 占位符
@tiptap/extension-link           # 链接
@tiptap/extension-image          # 图片
@tiptap/extension-highlight      # 高亮
@tiptap/extension-task-list      # 任务列表
@tiptap/extension-task-item      # 任务项
@tiptap/extension-table          # 表格
@tiptap/extension-table-row      # 表格行
@tiptap/extension-table-cell     # 表格单元格
@tiptap/extension-table-header   # 表格头
```

## 🚀 快速使用

### 基础用法

```tsx
import RichTextEditor from '@/components/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="开始编写..."
    />
  );
}
```

### 只读模式

```tsx
<RichTextEditor
  content={content}
  onChange={setContent}
  readOnly={true}
/>
```

### 自定义高度

```tsx
<RichTextEditor
  content={content}
  onChange={setContent}
  minHeight="400px"
/>
```

## 🎨 工具栏功能

### 1. 撤销/重做
- **撤销** - `Ctrl/Cmd + Z`
- **重做** - `Ctrl/Cmd + Shift + Z`

### 2. 文本格式化

#### 粗体
- 工具栏: `[B]` 按钮
- 快捷键: `Ctrl/Cmd + B`
- Markdown: `**文本**`

#### 斜体
- 工具栏: `[I]` 按钮
- 快捷键: `Ctrl/Cmd + I`
- Markdown: `*文本*`

#### 删除线
- 工具栏: `[S]` 按钮
- 快捷键: `Ctrl/Cmd + Shift + X`
- Markdown: `~~文本~~`

#### 行内代码
- 工具栏: `[</>]` 按钮
- 快捷键: `Ctrl/Cmd + E`
- Markdown: `` `code` ``

#### 高亮
- 工具栏: `[H]` 按钮
- 效果: 黄色背景高亮

### 3. 标题

#### H1 标题
- 工具栏: `[H1]` 按钮
- Markdown: `# 标题`

#### H2 标题
- 工具栏: `[H2]` 按钮
- Markdown: `## 标题`

#### H3 标题
- 工具栏: `[H3]` 按钮
- Markdown: `### 标题`

### 4. 列表

#### 无序列表
- 工具栏: `[• • •]` 按钮
- Markdown: `- 项目`

#### 有序列表
- 工具栏: `[1 2 3]` 按钮
- Markdown: `1. 项目`

#### 任务列表
- 工具栏: `[☐]` 按钮
- Markdown: `- [ ] 任务`
- 完成: `- [x] 任务`

### 5. 引用和代码

#### 引用
- 工具栏: `["]` 按钮
- Markdown: `> 引用文本`

#### 代码块
- 工具栏: `[</>]` 按钮
- Markdown: ` ``` `

### 6. 富媒体

#### 插入链接
1. 点击 `[🔗]` 按钮
2. 输入URL
3. 确认

#### 插入图片
1. 点击 `[🖼️]` 按钮
2. 输入图片URL
3. 确认

#### 插入表格
1. 点击 `[表格]` 按钮
2. 自动创建 3x3 表格
3. 可调整大小

## ⌨️ Markdown 快捷输入

Tiptap 支持 Markdown 语法快速输入:

```
# + 空格    →  H1 标题
## + 空格   →  H2 标题
### + 空格  →  H3 标题
- + 空格    →  无序列表
1. + 空格   →  有序列表
[ ] + 空格  →  任务列表
> + 空格    →  引用
``` + 空格  →  代码块
**文本**   →  粗体
*文本*     →  斜体
~~文本~~   →  删除线
`代码`     →  行内代码
```

## 💾 数据存储

### HTML 格式

Tiptap 输出 HTML 格式的内容:

```html
<h1>标题</h1>
<p>这是一段<strong>粗体</strong>文本。</p>
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>
```

### 保存到数据库

```tsx
// 获取 HTML 内容
const htmlContent = editor.getHTML();

// 保存到 Supabase
await supabase
  .from('meetings')
  .update({ minutes: htmlContent })
  .eq('id', meetingId);
```

### 从数据库读取

```tsx
// 从 Supabase 读取
const { data } = await supabase
  .from('meetings')
  .select('minutes')
  .eq('id', meetingId)
  .single();

// 设置内容
setContent(data.minutes);
```

## 🎨 样式定制

### CSS 类名

编辑器使用以下类名:

```css
.rich-text-editor      /* 编辑器容器 */
.toolbar               /* 工具栏 */
.toolbar-btn           /* 工具栏按钮 */
.toolbar-btn.is-active /* 激活状态 */
.editor-content        /* 内容区域 */
.ProseMirror           /* 编辑器核心 */
```

### 自定义样式

在你的组件中覆盖样式:

```tsx
<div className="my-custom-editor">
  <RichTextEditor content={content} onChange={setContent} />
</div>
```

```css
.my-custom-editor .toolbar {
  background: #f0f0f0;
}

.my-custom-editor .ProseMirror {
  font-size: 16px;
  line-height: 1.6;
}
```

## 📱 响应式设计

编辑器已内置响应式设计:

- **桌面** - 完整工具栏
- **平板** - 工具栏可滚动
- **手机** - 优化的按钮大小

## 🌙 暗色模式

编辑器完美支持暗色模式,使用 Tailwind 的 `dark:` 前缀:

```css
.dark .toolbar {
  background: #1f2937;
}

.dark .ProseMirror {
  color: #f3f4f6;
}
```

## 🔧 高级用法

### 获取纯文本

```tsx
const text = editor.getText();
```

### 获取 JSON

```tsx
const json = editor.getJSON();
```

### 设置内容

```tsx
editor.commands.setContent('<p>新内容</p>');
```

### 清空内容

```tsx
editor.commands.clearContent();
```

### 获取字符数

```tsx
const count = editor.storage.characterCount.characters();
```

### 获取单词数

```tsx
const words = editor.storage.characterCount.words();
```

## 🎯 实际应用场景

### 1. 会议纪要编辑器
```tsx
<RichTextEditor
  content={meeting.minutes}
  onChange={(html) => updateMinutes(html)}
  placeholder="记录会议纪要..."
  minHeight="400px"
/>
```

### 2. 任务描述编辑器
```tsx
<RichTextEditor
  content={task.description}
  onChange={(html) => updateTask({ description: html })}
  placeholder="详细描述任务..."
/>
```

### 3. 知识库文档编辑器
```tsx
<RichTextEditor
  content={article.content}
  onChange={(html) => updateArticle({ content: html })}
  placeholder="编写知识库文档..."
  minHeight="600px"
/>
```

### 4. 只读内容展示
```tsx
<RichTextEditor
  content={article.content}
  onChange={() => {}}
  readOnly={true}
/>
```

## 🚀 性能优化

### 1. 防抖保存

```tsx
import { debounce } from 'lodash';

const debouncedSave = debounce((html: string) => {
  saveToDatabase(html);
}, 1000);

<RichTextEditor
  content={content}
  onChange={debouncedSave}
/>
```

### 2. 懒加载

```tsx
import { lazy, Suspense } from 'react';

const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));

function MyComponent() {
  return (
    <Suspense fallback={<div>加载编辑器...</div>}>
      <RichTextEditor content={content} onChange={setContent} />
    </Suspense>
  );
}
```

## 🔄 未来扩展

### 实时协作 (可选)

如果需要实时协作功能:

```bash
npm install @tiptap/extension-collaboration yjs y-websocket
```

```tsx
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';

const ydoc = new Y.Doc();

const editor = useEditor({
  extensions: [
    StarterKit,
    Collaboration.configure({
      document: ydoc,
    }),
  ],
});
```

### 自定义扩展

创建自己的扩展:

```tsx
import { Extension } from '@tiptap/core';

const CustomExtension = Extension.create({
  name: 'customExtension',
  // ... 扩展配置
});
```

## 📚 资源链接

- **官方文档**: https://tiptap.dev/
- **扩展市场**: https://tiptap.dev/extensions
- **示例代码**: https://tiptap.dev/examples
- **GitHub**: https://github.com/ueberdosis/tiptap

## 🎉 总结

Tiptap 是一个功能强大、易于定制的富文本编辑器:

- ✅ 完整的工具栏功能
- ✅ Markdown 快捷输入
- ✅ 暗色模式支持
- ✅ 响应式设计
- ✅ HTML 输出格式
- ✅ 性能优秀
- ✅ 扩展性强

现在你可以在任何需要富文本编辑的地方使用它! 🚀

---

**编辑器版本**: Tiptap 3.x  
**更新时间**: 2025-10-25








