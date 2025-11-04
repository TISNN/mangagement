# 组件 Props 修复说明 🔧

## ❌ 遇到的错误

```
Uncaught Error: Element type is invalid: expected a string 
(for built-in components) or a class/function (for composite components) 
but got: undefined.

Check the render method of `TextAlignButton`.
```

---

## 🔍 问题根源

### 错误的组件使用方式

我之前错误地给组件传递了 `editor` prop：

```tsx
// ❌ 错误：这些组件不需要 editor prop
<TextAlignButton editor={editor} alignment="left" />
<UndoRedoButton editor={editor} />
<MarkButton editor={editor} mark="bold" />
```

### 为什么会出错？

**原因**：
1. Simple Editor 的组件通过 **EditorContext** 自动获取编辑器实例
2. 不需要也不接受 `editor` prop
3. 传入错误的 props 导致组件渲染失败

---

## ✅ 正确的使用方式

### EditorContext 模式

```tsx
// 1. 包装在 EditorContext.Provider 中
<EditorContext.Provider value={{ editor }}>
  <Toolbar>
    {/* 2. 组件自动从 Context 获取 editor */}
    <UndoRedoButton action="undo" />  {/* ✅ 不传 editor */}
    <MarkButton mark="bold" />        {/* ✅ 不传 editor */}
    <TextAlignButton align="left" />  {/* ✅ 不传 editor */}
  </Toolbar>
  <EditorContent editor={editor} />
</EditorContext.Provider>
```

---

## 🔧 已修复的组件

### 1. UndoRedoButton

**错误**：
```tsx
<UndoRedoButton editor={editor} />  // ❌
```

**正确**：
```tsx
<UndoRedoButton action="undo" />   // ✅
<UndoRedoButton action="redo" />   // ✅
```

### 2. MarkButton

**错误**：
```tsx
<MarkButton editor={editor} mark="bold" />  // ❌
```

**正确**：
```tsx
<MarkButton mark="bold" />      // ✅
<MarkButton mark="italic" />    // ✅
<MarkButton mark="underline" /> // ✅
```

### 3. TextAlignButton

**错误**：
```tsx
<TextAlignButton editor={editor} alignment="left" />  // ❌
```

**正确**：
```tsx
<TextAlignButton align="left" />     // ✅
<TextAlignButton align="center" />   // ✅
<TextAlignButton align="right" />    // ✅
<TextAlignButton align="justify" />  // ✅
```

### 4. HeadingDropdownMenu

**错误**：
```tsx
<HeadingDropdownMenu editor={editor} />  // ❌
```

**正确**：
```tsx
<HeadingDropdownMenu levels={[1, 2, 3, 4]} />  // ✅
```

### 5. ListDropdownMenu

**错误**：
```tsx
<ListDropdownMenu editor={editor} />  // ❌
```

**正确**：
```tsx
<ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />  // ✅
```

### 6. 其他按钮

**正确**：
```tsx
<BlockquoteButton />      // ✅ 无需任何 prop
<CodeBlockButton />       // ✅ 无需任何 prop
<ImageUploadButton />     // ✅ 无需任何 prop
```

---

## 📚 EditorContext 原理

### 什么是 EditorContext？

Simple Editor 使用 React Context 来共享编辑器实例：

```tsx
// 1. 提供编辑器实例
<EditorContext.Provider value={{ editor }}>
  
  {/* 2. 所有子组件都可以访问 */}
  <UndoRedoButton />  {/* 内部使用 useCurrentEditor() 获取 editor */}
  <MarkButton />      {/* 内部使用 useCurrentEditor() 获取 editor */}
  
</EditorContext.Provider>
```

### 组件内部实现

```tsx
// 组件内部（Simple Editor 的组件）
export function TextAlignButton({ align }: Props) {
  // 自动从 Context 获取 editor
  const { editor } = useCurrentEditor()
  
  // 不需要外部传入 editor
  return (
    <button onClick={() => editor.commands.setTextAlign(align)}>
      对齐
    </button>
  )
}
```

---

## ✅ 完整的修复清单

### SimpleEditorWrapper 组件

所有按钮组件现在都使用正确的 props：

| 组件 | Props | 说明 |
|------|-------|------|
| UndoRedoButton | `action="undo/redo"` | 操作类型 |
| MarkButton | `mark="bold/italic/..."` | 标记类型 |
| TextAlignButton | `align="left/center/..."` | 对齐方式 |
| HeadingDropdownMenu | `levels={[1,2,3,4]}` | 标题级别 |
| ListDropdownMenu | `types={[...]}` | 列表类型 |
| BlockquoteButton | 无 props | - |
| CodeBlockButton | 无 props | - |
| ImageUploadButton | 无 props | - |

---

## 🚀 现在应该可以了

### 刷新浏览器

```
Cmd + Shift + R (Mac)
Ctrl + Shift + F5 (Windows)
```

### 验证

1. **没有错误** - 控制台干净
2. **编辑器显示** - Simple Editor 界面
3. **工具栏正常** - 所有按钮都显示
4. **功能正常** - 点击按钮有响应

---

## 📝 学到的经验

### Simple Editor 组件的特点

1. **使用 EditorContext** - 不需要传递 `editor` prop
2. **特定的 Props** - 每个组件有自己的 props 要求
3. **完全匹配官方** - 必须按照官方示例使用

### 对比我们之前的 RichTextEditor

| | RichTextEditor | Simple Editor |
|---|----------------|--------------|
| Editor 传递 | 通过 props | 通过 Context ✨ |
| 组件结构 | 单文件 | 模块化 ✨ |
| 使用方式 | 自由 | 严格按照官方 |

---

## ✅ 总结

### 已修复
- ✅ 扩展导入错误（TaskItem, TaskList）
- ✅ 组件 Props 错误（去掉 editor prop）
- ✅ 完全匹配官方使用方式

### 现在的状态
- ✅ 所有导入正确
- ✅ 所有组件 Props 正确
- ✅ 完全符合 Simple Editor 官方规范

---

**刷新浏览器，Simple Editor 应该完美显示了！** 🎉

