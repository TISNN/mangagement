# Tiptap 高级功能通俗说明 📚

根据 [Tiptap 官方 React 指南](https://tiptap.dev/docs/editor/getting-started/install/react)，这三个高级功能的用途和适用场景：

---

## 1️⃣ EditorContext（编辑器上下文）

### 是什么？
让你在组件树的**任何地方**访问编辑器实例，而不需要层层传递 props。

### 打个比方 🌰
就像"远程控制器"：

```
想象你的编辑器是一台电视机
普通方式：需要走到电视前按按钮（层层传递 props）
EditorContext：有了遥控器，在沙发上就能控制（任何组件都能访问）
```

### 代码示例

#### 没有 EditorContext（传统方式）：
```tsx
function Page() {
  const [content, setContent] = useState('');
  
  return (
    <div>
      <Toolbar content={content} setContent={setContent} />
      <RichTextEditor content={content} onChange={setContent} />
      <Preview content={content} />
      <WordCount content={content} />  // 要传来传去，很麻烦
    </div>
  );
}
```

#### 使用 EditorContext（高级方式）：
```tsx
function Page() {
  const editor = useEditor({ ... });
  
  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar />              {/* 不需要传 props */}
      <EditorContent />         {/* 不需要传 props */}
      <Preview />              {/* 不需要传 props */}
      <WordCount />            {/* 不需要传 props */}
    </EditorContext.Provider>
  );
}

// 任何子组件都可以直接访问
function WordCount() {
  const { editor } = useCurrentEditor();  // 直接拿到编辑器
  return <div>字数: {editor?.getText().length}</div>;
}
```

### 什么时候需要？
- ✅ **需要**：编辑器和工具栏分开在不同组件
- ✅ **需要**：有多个地方需要访问编辑器状态
- ❌ **不需要**：编辑器和工具栏在同一个组件（我们当前就是这样）

### 我们需要吗？
**目前不需要** ❌

原因：我们的 RichTextEditor 组件已经包含了工具栏和编辑器，都在一个文件里，不需要跨组件访问。

---

## 2️⃣ useEditorState（状态优化）

### 是什么？
专门用来**监听编辑器状态变化**的 Hook，性能更好。

### 打个比方 🌰
就像"订阅服务"：

```
想象你在关注股票价格
普通方式：每秒刷新整个页面看价格（整个组件重新渲染）
useEditorState：只更新价格数字（只更新你关心的部分）
```

### 代码示例

#### 没有 useEditorState（会导致频繁重渲染）：
```tsx
function Toolbar() {
  const editor = useEditor({ ... });
  
  // 每次编辑器内容变化，整个组件都会重新渲染
  const isBold = editor?.isActive('bold');
  const isItalic = editor?.isActive('italic');
  
  return (
    <div>
      <button className={isBold ? 'active' : ''}>粗体</button>
      <button className={isItalic ? 'active' : ''}>斜体</button>
    </div>
  );
}
```

#### 使用 useEditorState（性能优化）：
```tsx
function Toolbar() {
  const editor = useEditor({ ... });
  
  // 只有当 isBold 或 isItalic 变化时才重新渲染
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
    }),
  });
  
  return (
    <div>
      <button className={editorState.isBold ? 'active' : ''}>粗体</button>
      <button className={editorState.isItalic ? 'active' : ''}>斜体</button>
    </div>
  );
}
```

### 什么时候需要？
- ✅ **需要**：编辑器内容很长（几千字以上）
- ✅ **需要**：有性能问题（输入时卡顿）
- ✅ **需要**：多个组件都在监听编辑器状态
- ❌ **不需要**：内容不多，性能够用

### 我们需要吗？
**目前不需要** ❌

原因：
1. 我们的使用场景（会议纪要、知识库文章）内容一般不超过几千字
2. 目前没有性能问题
3. 如果将来有长文档编辑卡顿，再优化也不迟

---

## 3️⃣ SSR 支持（服务端渲染）

### 是什么？
让编辑器在 Next.js 等服务端渲染框架中正常工作。

### 打个比方 🌰
就像"预先准备"：

```
想象你开一家餐厅
普通网站（客户端渲染）：客人来了才开始做菜（浏览器加载页面）
SSR（服务端渲染）：提前做好菜，客人来了直接上（服务器先渲染好 HTML）

但是！编辑器需要浏览器环境（需要 DOM），服务器没有浏览器
所以要告诉编辑器："等到浏览器再初始化"
```

### 代码示例

#### 不支持 SSR（会报错）：
```tsx
// Next.js 中会报错：window is not defined
export function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello</p>',
  });
  
  return <EditorContent editor={editor} />;  // ❌ 服务器渲染会出错
}
```

#### 支持 SSR（正确方式）：
```tsx
'use client'  // Next.js 13+ 需要这个

export function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello</p>',
    immediatelyRender: false,  // ✅ 关键：告诉编辑器不要在服务器渲染
  });
  
  if (!editor) return null;  // ✅ 服务器渲染时返回 null
  
  return <EditorContent editor={editor} />;
}
```

### 什么时候需要？
- ✅ **需要**：使用 Next.js 的 App Router（服务端组件）
- ✅ **需要**：使用 Remix、Gatsby 等 SSR 框架
- ❌ **不需要**：使用 Vite（纯客户端渲染，就是我们当前的）
- ❌ **不需要**：使用 Create React App（纯客户端渲染）

### 我们需要吗？
**完全不需要** ❌❌❌

原因：我们用的是 **Vite**，是纯客户端渲染，根本不涉及服务端渲染。

---

## 📊 功能对比总结

| 功能 | 解决什么问题 | 我们需要吗 | 原因 |
|------|------------|----------|------|
| **EditorContext** | 跨组件访问编辑器 | ❌ 不需要 | 编辑器和工具栏在一起 |
| **useEditorState** | 性能优化 | ❌ 暂不需要 | 内容量不大，没性能问题 |
| **SSR 支持** | 服务端渲染兼容 | ❌ 完全不需要 | 我们用 Vite（客户端渲染） |

---

## 🎯 什么时候需要这些功能？

### EditorContext - 复杂布局时
```
场景：编辑器页面很复杂
┌─────────────────────────┐
│    顶部工具栏组件        │ ← 需要访问编辑器
├─────────────────────────┤
│                         │
│    编辑器组件           │
│                         │
├─────────────────────────┤
│  侧边栏：                │
│  - 字数统计组件         │ ← 需要访问编辑器
│  - 目录组件             │ ← 需要访问编辑器
│  - 历史记录组件         │ ← 需要访问编辑器
└─────────────────────────┘

这种情况下用 EditorContext 会很方便
```

### useEditorState - 长文档时
```
场景：编辑超长文档
- 文档长度：10000+ 字
- 实时字数统计
- 实时目录生成
- 多个工具栏同时监听状态

没有优化：每次输入都要重新渲染所有组件（卡顿）
使用 useEditorState：只更新变化的部分（流畅）
```

### SSR - 使用 Next.js 时
```
场景：使用 Next.js 13+ App Router
- 需要 SEO 优化
- 需要首屏快速加载
- 使用服务端组件

必须添加 immediatelyRender: false
```

---

## 💡 我们当前的最佳实践

### 我们的技术栈
```
前端框架：React 18
构建工具：Vite
渲染方式：客户端渲染（CSR）
编辑器：Tiptap 3.8
使用场景：会议纪要、知识库文章
```

### 我们的使用方式（已经很好）
```tsx
// 简单、直接、够用
import RichTextEditor from '../../components/RichTextEditor';

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="开始编写..."
  minHeight="400px"
/>
```

### 什么时候考虑升级？

#### 1. 如果出现性能问题
→ 添加 `useEditorState` 优化

#### 2. 如果要做复杂的编辑器页面
→ 使用 `EditorContext` 重构

#### 3. 如果要迁移到 Next.js
→ 添加 `immediatelyRender: false`

---

## 🎓 学习建议

### 现在不需要学
这三个功能都是**可选的增强功能**，不是必需的。

就像买车：
- 基础功能：能开就行（我们现在有）
- 高级功能：自动泊车、车道保持（等需要再说）

### 什么时候学？
**等遇到具体问题再学**，不要过早优化。

---

## 📚 参考资料

### 官方文档
- **EditorContext**: https://tiptap.dev/docs/editor/getting-started/install/react#using-the-editorcontext
- **useEditorState**: https://tiptap.dev/docs/editor/getting-started/install/react#reacting-to-editor-state-changes
- **SSR**: https://tiptap.dev/docs/editor/getting-started/install/react#use-ssr-with-react-and-tiptap

---

## ✅ 结论

### 对于我们的项目
**三个高级功能都不需要！**

我们当前的实现：
- ✅ 功能完整
- ✅ 性能够用
- ✅ 代码简洁
- ✅ 易于维护

**除非遇到以下情况，否则不用管这些高级功能：**
1. 编辑器输入时明显卡顿
2. 需要做超复杂的编辑器布局
3. 决定迁移到 Next.js

---

**记住：简单就是美！当前的实现已经很好了！** ✨

