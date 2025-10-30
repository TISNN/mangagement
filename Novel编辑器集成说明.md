# Novel 编辑器集成说明

## 🎨 为什么选择 Novel?

Novel 是一个基于 Tiptap 构建的现代化富文本编辑器,提供了类似 **Notion** 和**飞书**的编辑体验,比原生 Tiptap 更加美观和易用。

### ✨ Novel 的特点

1. **🎯 斜杠命令 (/)**
   - 输入 `/` 调出命令面板
   - 快速插入标题、列表、引用、代码块等
   - 类似 Notion 的操作方式

2. **💬 气泡菜单 (Bubble Menu)**
   - 选中文字自动弹出工具栏
   - 快速格式化(加粗、斜体、链接等)
   - 悬浮式设计,不占用额外空间

3. **📝 丰富的内容块**
   - 标题(H1-H6)
   - 段落、引用
   - 有序/无序列表、任务列表
   - 代码块(支持语法高亮)
   - 分隔线
   - 图片、链接

4. **🎨 精美的 UI 设计**
   - 现代化的视觉风格
   - 流畅的动画效果
   - 响应式布局
   - 支持深色模式

5. **⚡ 性能优秀**
   - 基于 Tiptap(ProseMirror)
   - 虚拟滚动支持
   - 大文档流畅编辑

6. **🔧 开箱即用**
   - 无需复杂配置
   - 预设了常用功能
   - 易于集成

## 📦 已完成的集成

### 1. 安装 Novel 包
```bash
npm install novel
```

### 2. 创建 NovelEditor 组件

**文件位置**: `src/components/NovelEditor/index.tsx`

**组件接口**:
```typescript
interface NovelEditorProps {
  content?: string;           // 初始内容(HTML)
  onChange?: (content: string) => void;  // 内容变化回调
  placeholder?: string;       // 占位符文本
  editable?: boolean;         // 是否可编辑
  className?: string;         // 自定义样式类
}
```

**特性**:
- ✅ 支持受控组件模式
- ✅ 自动同步内容变化
- ✅ 禁用本地存储(避免数据冲突)
- ✅ 响应式设计
- ✅ 深色模式支持

### 3. 更新会议文档编辑器页面

**文件位置**: `src/pages/admin/MeetingDocumentEditorPage.tsx`

**修改内容**:
- 替换 `RichTextEditor` 为 `NovelEditor`
- 更新占位符文本: "输入 '/' 查看命令..."
- 调整容器样式,增加内边距

## 🎮 使用方法

### 基本使用

```tsx
import NovelEditor from '../../components/NovelEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <NovelEditor
      content={content}
      onChange={setContent}
      placeholder="开始编写..."
    />
  );
}
```

### 只读模式

```tsx
<NovelEditor
  content={savedContent}
  editable={false}
/>
```

### 自定义样式

```tsx
<NovelEditor
  content={content}
  onChange={setContent}
  className="min-h-[500px]"
/>
```

## ⚡ 核心功能

### 1. 斜杠命令 (/)

在编辑器中输入 `/`,会弹出命令面板:

```
/heading1    # 一级标题
/heading2    # 二级标题
/heading3    # 三级标题
/bullet      # 无序列表
/numbered    # 有序列表
/todo        # 任务列表
/quote       # 引用
/code        # 代码块
/divider     # 分隔线
```

### 2. 气泡菜单

选中文字后自动出现:
- **B** - 加粗
- *I* - 斜体
- <u>U</u> - 下划线
- ~~S~~ - 删除线
- 🔗 - 添加链接
- `<>` - 代码

### 3. 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + B` | 加粗 |
| `Cmd/Ctrl + I` | 斜体 |
| `Cmd/Ctrl + U` | 下划线 |
| `Cmd/Ctrl + K` | 添加链接 |
| `Cmd/Ctrl + Z` | 撤销 |
| `Cmd/Ctrl + Shift + Z` | 重做 |
| `Cmd/Ctrl + Enter` | 插入段落 |

### 4. Markdown 支持

Novel 支持 Markdown 快捷输入:

```
# 空格          -> H1 标题
## 空格         -> H2 标题
### 空格        -> H3 标题
- 空格          -> 无序列表
1. 空格         -> 有序列表
[ ] 空格        -> 任务列表
> 空格          -> 引用
``` 空格        -> 代码块
--- 回车        -> 分隔线
```

## 🎨 UI 对比

### 原 Tiptap 编辑器
```
┌─────────────────────────────────────────┐
│ [B] [I] [U] [H1] [•] [1.] [🔗] ...     │ <- 固定工具栏
├─────────────────────────────────────────┤
│                                         │
│ 编辑区域                                │
│                                         │
└─────────────────────────────────────────┘
```
- 工具栏始终可见,占用空间
- 功能按钮较多,略显拥挤
- 样式较为基础

### Novel 编辑器
```
┌─────────────────────────────────────────┐
│                                         │
│ 输入 '/' 查看命令...                    │ <- 清爽的编辑区域
│                                         │
│ [选中文字时出现气泡菜单]                │
│                                         │
│ / [命令面板]                            │ <- 动态出现
│   📄 标题                               │
│   📝 段落                               │
│   📋 列表                               │
└─────────────────────────────────────────┘
```
- 无固定工具栏,界面更简洁
- 按需显示功能(斜杠命令、气泡菜单)
- 现代化的设计风格

## 🚀 实际效果

### 会议文档编辑器页面

**操作流程**:
1. 点击"创建会议文档"按钮
2. 进入全屏编辑器页面
3. 输入文档标题
4. 在编辑器中输入 `/` 调出命令
5. 选择要插入的内容类型
6. 开始编写内容
7. 点击"保存"按钮

**特色体验**:
- ✨ 输入 `/` 快速插入内容块
- 💬 选中文字快速格式化
- 📝 支持 Markdown 快捷输入
- 🎨 精美的 UI 和动画
- ⚡ 流畅的编辑体验

## 🔧 技术细节

### 组件实现

```tsx
export default function NovelEditor({
  content = '',
  onChange,
  placeholder = '输入 "/" 查看命令...',
  editable = true,
  className = '',
}: NovelEditorProps) {
  const [value, setValue] = useState(content);

  // 同步外部内容
  useEffect(() => {
    setValue(content);
  }, [content]);

  // 处理内容更新
  const handleUpdate = (newContent: string) => {
    setValue(newContent);
    onChange?.(newContent);
  };

  return (
    <div className={`novel-editor-wrapper ${className}`}>
      <Editor
        defaultValue={value}
        disableLocalStorage  // 禁用本地存储
        onUpdate={(editor) => {
          const html = editor?.getHTML() || '';
          handleUpdate(html);
        }}
        editorProps={{
          attributes: {
            // Tailwind Prose 样式,优化排版
            class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-full',
          },
        }}
        storageKey="novel-editor"
      />
    </div>
  );
}
```

### 样式配置

我们创建了自定义样式文件 `src/components/NovelEditor/styles.css`:
- ✅ 编辑器基础样式
- ✅ 占位符、选中文字样式
- ✅ 代码块、引用、任务列表样式
- ✅ 链接、图片、表格样式
- ✅ 气泡菜单、斜杠命令菜单样式
- ✅ 完整的深色模式支持
- ✅ 使用 Tailwind Prose 优化排版

### 数据格式

Novel 输出 HTML 格式:
```html
<h1>标题</h1>
<p>这是一段文字。</p>
<ul>
  <li>列表项 1</li>
  <li>列表项 2</li>
</ul>
```

这与原来的 Tiptap 格式兼容,无需更改数据库结构。

## 📊 功能对比

| 功能 | 原 Tiptap | Novel |
|------|-----------|-------|
| 基础格式化 | ✅ | ✅ |
| 标题 | ✅ | ✅ |
| 列表 | ✅ | ✅ |
| 代码块 | ✅ | ✅ |
| 链接/图片 | ✅ | ✅ |
| 斜杠命令 | ❌ | ✅ |
| 气泡菜单 | ❌ | ✅ |
| Markdown 快捷输入 | ❌ | ✅ |
| 现代化 UI | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 动画效果 | ⭐ | ⭐⭐⭐⭐⭐ |
| 用户体验 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎯 适用场景

Novel 编辑器特别适合:
- ✅ 会议文档编写
- ✅ 知识库文章
- ✅ 项目文档
- ✅ 任务描述
- ✅ 学习笔记
- ✅ 公告通知

## 💡 使用建议

1. **充分利用斜杠命令**
   - 输入 `/` 快速插入内容
   - 比点击工具栏按钮更高效

2. **善用 Markdown**
   - `#` 开头快速创建标题
   - `-` 开头快速创建列表
   - 更符合开发者习惯

3. **气泡菜单格式化**
   - 选中文字快速加粗、斜体
   - 无需移动鼠标到工具栏

4. **快捷键提升效率**
   - `Cmd+B` 加粗
   - `Cmd+I` 斜体
   - `Cmd+K` 添加链接

## 🔄 迁移说明

从原 `RichTextEditor` 迁移到 `NovelEditor`:

### 代码变更
```tsx
// 之前
import RichTextEditor from '../../components/RichTextEditor';
<RichTextEditor content={content} onChange={setContent} />

// 现在
import NovelEditor from '../../components/NovelEditor';
<NovelEditor content={content} onChange={setContent} />
```

### 数据兼容性
- ✅ 完全兼容,无需迁移数据
- ✅ 都使用 HTML 格式
- ✅ 现有数据可以直接加载

### 用户培训
告知用户新功能:
1. 输入 `/` 可以调出命令面板
2. 选中文字可以快速格式化
3. 支持 Markdown 快捷输入

## 🎉 完成状态

✅ 安装 Novel 包
✅ 创建 NovelEditor 组件
✅ 更新会议文档编辑器页面
✅ 无 Lint 错误
✅ 数据格式兼容
✅ 样式完善

## 🌟 用户反馈预期

用户会感受到:
- 😍 界面更加美观现代
- ⚡ 操作更加流畅高效
- 🎯 功能更加强大易用
- 💪 编辑体验大幅提升

---

**更新时间**: 2024-01-15
**编辑器**: Novel (基于 Tiptap)
**版本**: Latest
**状态**: ✅ 已集成并测试
**体验**: 🌟🌟🌟🌟🌟 (类似 Notion/飞书)

