# RichTextEditor 统一使用指南 📝

## 🎯 设计理念

**统一的富文本编辑器组件** - 在整个项目中复用，保持一致的用户体验。

---

## 📁 组件位置

```
src/
└── components/
    └── RichTextEditor/
        ├── index.tsx        # 主组件
        └── styles.css       # 样式文件
```

### 为什么放在这里？
- ✅ **全局共享** - 任何页面都可以导入使用
- ✅ **独立维护** - 编辑器功能独立，易于更新
- ✅ **一致体验** - 所有地方使用相同的编辑器

---

## 🛠️ 技术栈

基于 [Tiptap](https://tiptap.dev/docs/editor/getting-started/install/react) 构建：

```json
{
  "@tiptap/react": "^3.8.0",
  "@tiptap/starter-kit": "^3.8.0",
  "@tiptap/extension-placeholder": "^3.8.0",
  "@tiptap/extension-link": "^3.8.0",
  "@tiptap/extension-image": "^3.8.0",
  "@tiptap/extension-highlight": "^3.8.0",
  "@tiptap/extension-task-list": "^3.8.0",
  "@tiptap/extension-task-item": "^3.8.0",
  "@tiptap/extension-table": "^3.8.0"
}
```

### 为什么选择 Tiptap？
- ✅ 基于 ProseMirror（强大的编辑器内核）
- ✅ 完全开源免费
- ✅ React 原生支持
- ✅ 高度可扩展
- ✅ 活跃的社区维护

---

## 📦 组件接口

```typescript
interface RichTextEditorProps {
  content: string;              // 编辑器内容（HTML格式）
  onChange: (content: string) => void;  // 内容变化回调
  placeholder?: string;         // 占位符文本
  readOnly?: boolean;           // 是否只读
  minHeight?: string;           // 最小高度
}
```

---

## 🎨 功能特性

### 工具栏功能（完整）

#### 1. 撤销/重做
- **撤销** (Ctrl/Cmd + Z)
- **重做** (Ctrl/Cmd + Shift + Z)

#### 2. 文本格式
- **粗体** (Ctrl/Cmd + B) - `<strong>`
- **斜体** (Ctrl/Cmd + I) - `<em>`
- **删除线** (Ctrl/Cmd + Shift + X) - `<s>`
- **行内代码** (Ctrl/Cmd + E) - `<code>`
- **高亮** - `<mark>`

#### 3. 标题
- **H1** - 一级标题
- **H2** - 二级标题
- **H3** - 三级标题

#### 4. 列表
- **无序列表** - `<ul><li>`
- **有序列表** - `<ol><li>`
- **任务列表** - 可勾选的 checkbox

#### 5. 块元素
- **引用** - `<blockquote>`
- **代码块** - `<pre><code>`

#### 6. 高级功能
- **链接** - 插入超链接
- **图片** - 插入图片 URL
- **表格** - 插入 3x3 表格

---

## 💻 使用方法

### 基础用法

```tsx
import RichTextEditor from '../../components/RichTextEditor';

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

### 自定义配置

```tsx
<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="输入你的想法..."
  minHeight="300px"
  readOnly={false}
/>
```

### 只读模式

```tsx
<RichTextEditor
  content={savedContent}
  onChange={() => {}} // 提供空函数
  readOnly={true}      // 设为只读
/>
```

---

## 📍 当前使用位置

### 1. 会议管理 - 会议纪要编辑
**文件**: `src/pages/admin/MeetingDetailPage.tsx`

```tsx
import RichTextEditor from '../../components/RichTextEditor';

// 在会议详情页编辑纪要
<RichTextEditor
  content={editedNotes}
  onChange={setEditedNotes}
  placeholder="编写会议纪要..."
  minHeight="300px"
/>
```

### 2. 会议管理 - 会议文档创建
**文件**: `src/pages/admin/MeetingDocumentEditorPage.tsx`

```tsx
import RichTextEditor from '../../components/RichTextEditor';

// 独立的会议文档编辑页面
<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="开始编写会议文档..."
  minHeight="500px"
/>
```

### 3. 知识库 - 文章类型资源
**文件**: `src/pages/admin/KnowledgeBase/components/ResourceFormModal/index.tsx`

```tsx
import RichTextEditor from '../../../../../components/RichTextEditor';

// 创建和编辑文章类型的知识库资源
{formData.type === 'article' && (
  <RichTextEditor
    content={formData.content || ''}
    onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
    placeholder="开始编写文章内容... 使用工具栏格式化文本 ✨"
    minHeight="400px"
  />
)}
```

---

## 🚀 如何在新地方使用

### Step 1: 导入组件

```tsx
import RichTextEditor from '../../components/RichTextEditor';
// 或根据你的文件位置调整路径
```

### Step 2: 准备状态

```tsx
const [content, setContent] = useState('');
```

### Step 3: 添加到 JSX

```tsx
<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="开始编写..."
  minHeight="400px"
/>
```

### Step 4: 保存到数据库

```tsx
// 内容是 HTML 格式，可以直接保存
const handleSave = async () => {
  await supabase
    .from('your_table')
    .insert({ content: content }); // content 是 HTML 字符串
};
```

---

## 📊 数据格式

### 输入/输出格式：HTML

```html
<!-- 编辑器返回的格式 -->
<h1>标题</h1>
<p>这是一个<strong>粗体</strong>和<em>斜体</em>的段落。</p>
<ul>
  <li>列表项 1</li>
  <li>列表项 2</li>
</ul>
<blockquote>这是一个引用</blockquote>
```

### 存储到数据库

```typescript
// Supabase 表结构
CREATE TABLE your_table (
  id SERIAL PRIMARY KEY,
  content TEXT,  -- 存储 HTML 格式的内容
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 显示内容

```tsx
// 显示富文本内容
<div 
  dangerouslySetInnerHTML={{ __html: content }}
  className="prose dark:prose-invert"
/>

// 或使用只读编辑器
<RichTextEditor
  content={content}
  onChange={() => {}}
  readOnly={true}
/>
```

---

## 🎨 样式定制

### 编辑器样式文件

**文件**: `src/components/RichTextEditor/styles.css`

包含：
- ✅ 工具栏按钮样式
- ✅ 编辑器内容区域样式
- ✅ 占位符样式
- ✅ 表格样式
- ✅ 任务列表样式
- ✅ 暗色模式支持

### 自定义样式

```tsx
// 添加自定义 className
<div className="my-editor-wrapper">
  <RichTextEditor
    content={content}
    onChange={setContent}
  />
</div>
```

---

## 🔧 扩展功能

### 如果需要添加新功能

1. **查看 Tiptap 文档**: https://tiptap.dev/docs/editor/extensions
2. **安装扩展**: `npm install @tiptap/extension-xxx`
3. **修改 RichTextEditor**: 在 `extensions` 数组中添加
4. **添加工具栏按钮**: 在 toolbar 部分添加对应按钮

示例 - 添加文字颜色：

```tsx
// 1. 安装
npm install @tiptap/extension-color @tiptap/extension-text-style

// 2. 在 RichTextEditor/index.tsx 导入
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

// 3. 添加到 extensions
const editor = useEditor({
  extensions: [
    // ... 其他扩展
    TextStyle,
    Color,
  ],
});

// 4. 添加工具栏按钮
<button
  onClick={() => editor.chain().focus().setColor('#FF0000').run()}
  title="红色文字"
>
  <span style={{ color: '#FF0000' }}>A</span>
</button>
```

---

## ⚠️ 注意事项

### 1. 内容为空时的处理

```tsx
// 编辑器返回空内容时可能是 '<p></p>'
const isEmpty = content === '' || content === '<p></p>';
```

### 2. 初始内容加载

```tsx
// 从数据库加载时，确保内容不为 null
<RichTextEditor
  content={savedContent || ''}  // 使用默认空字符串
  onChange={setContent}
/>
```

### 3. 只读模式

```tsx
// 只读模式仍需要提供 onChange
<RichTextEditor
  content={content}
  onChange={() => {}}  // 空函数
  readOnly={true}
/>
```

### 4. 性能优化

```tsx
// 对于大量内容，考虑防抖
import { debounce } from 'lodash';

const debouncedSave = debounce((content) => {
  saveToDatabase(content);
}, 1000);

<RichTextEditor
  content={content}
  onChange={debouncedSave}
/>
```

---

## 🎯 最佳实践

### 1. 统一占位符文案

```tsx
// 根据使用场景提供友好的提示
placeholder="开始编写..."           // 通用
placeholder="编写会议纪要..."       // 会议纪要
placeholder="开始编写文章内容..."   // 知识库文章
```

### 2. 合理设置最小高度

```tsx
minHeight="300px"  // 简短内容
minHeight="400px"  // 中等内容
minHeight="500px"  // 长文档
```

### 3. 提供用户提示

```tsx
<RichTextEditor ... />
<p className="text-xs text-gray-500 mt-2">
  💡 使用工具栏编辑格式：支持标题、列表、粗体、斜体、链接、图片、表格等
</p>
```

### 4. 保存前验证

```tsx
const handleSave = () => {
  if (!content || content === '<p></p>') {
    alert('请输入内容');
    return;
  }
  
  // 保存逻辑
};
```

---

## 📚 参考资源

### Tiptap 官方文档
- **安装指南**: https://tiptap.dev/docs/editor/getting-started/install/react
- **扩展列表**: https://tiptap.dev/docs/editor/extensions
- **API 文档**: https://tiptap.dev/docs/editor/api/editor

### 项目内示例
1. **会议纪要**: `src/pages/admin/MeetingDetailPage.tsx`
2. **会议文档**: `src/pages/admin/MeetingDocumentEditorPage.tsx`
3. **知识库**: `src/pages/admin/KnowledgeBase/components/ResourceFormModal/index.tsx`

---

## 🎉 总结

### RichTextEditor 是项目的统一富文本编辑解决方案

#### 优势
- ✅ **统一体验** - 所有地方使用相同编辑器
- ✅ **功能完整** - 支持常用的所有格式
- ✅ **易于使用** - 简单的 API，一行导入即可
- ✅ **易于维护** - 集中管理，统一更新
- ✅ **可扩展** - 基于 Tiptap，轻松添加新功能

#### 使用原则
1. **需要富文本编辑** → 使用 RichTextEditor
2. **需要纯文本** → 使用 `<textarea>`
3. **需要 Markdown** → 考虑添加 Markdown 扩展

---

**现在，你可以在项目的任何地方轻松使用统一的富文本编辑器了！** 🚀

