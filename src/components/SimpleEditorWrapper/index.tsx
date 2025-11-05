/**
 * Simple Editor 适配器（完整版）
 * 包装 Tiptap Simple Editor，支持 content 和 onChange API
 */

"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import type { Editor } from "@tiptap/react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import AIAssistant from '../AIAssistant/index';
import AIGenerationPanel from '../AIAssistant/AIGenerationPanel';
import ColorPicker from './ColorPicker';
import {
  callAIStream,
  getAvailableModels,
  getActiveModel,
  setActiveModel,
  subscribeActiveModel,
} from '../../services/aiService';

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { Selection } from "@tiptap/extensions"
import { Placeholder } from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"

// --- UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"
import { LinkPopover } from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Utils ---
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"
import "./styles.css"

interface SimpleEditorWrapperProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  readOnly?: boolean
  renderBeforeEditor?: () => React.ReactNode
}

const handleImageUpload = async (file: File): Promise<string> => {
  // 简单的 base64 转换（实际项目中应该上传到服务器）
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function SimpleEditorWrapper({
  content: externalContent,
  onChange,
  placeholder = '输入文本，按"空格"启用 AI',
  readOnly = false,
  renderBeforeEditor,
}: SimpleEditorWrapperProps & { content: string }) {
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">("main")
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  // AI 相关状态
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPosition, setAIPosition] = useState({ top: 0, left: 0 })
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [aiGeneratedText, setAIGeneratedText] = useState('')
  const [showAIActions, setShowAIActions] = useState(false)
  const [aiInsertPosition, setAIInsertPosition] = useState<number | null>(null)
  const [currentAIAction, setCurrentAIAction] = useState('')
  const [lastAIPrompt, setLastAIPrompt] = useState<string | undefined>(undefined)
  const editorRef = useRef<Editor | null>(null)
  const anchorPosRef = useRef<number | null>(null)
  const modelOptions = useMemo(() => getAvailableModels(), [])
  const [selectedModelId, setSelectedModelId] = useState(() => getActiveModel().id)

  useEffect(() => {
    setActiveModel(selectedModelId)
  }, [selectedModelId])

  useEffect(() => {
    const unsubscribe = subscribeActiveModel(() => {
      const current = getActiveModel().id
      setSelectedModelId((prev) => (prev === current ? prev : current))
    })
    return unsubscribe
  }, [])

  const updatePositionFromEditor = useCallback(
    (pos?: number, updateHorizontal = false) => {
      const ed = editorRef.current
      if (!ed || !ed.view) return
      const targetPos = typeof pos === "number" ? pos : ed.state.selection.from
      anchorPosRef.current = targetPos
      const coords = ed.view.coordsAtPos(targetPos)
      
      // 根据参数决定是否更新水平位置
      if (updateHorizontal) {
        setAIPosition({ top: coords.top, left: coords.left })
      } else {
        setAIPosition(prev => ({ top: coords.top, left: prev.left }))
      }
    },
    []
  )

  const openAssistant = useCallback(
    (positionOverride?: { top: number; left: number }) => {
      if (positionOverride) {
        setAIPosition(positionOverride)
        anchorPosRef.current = editorRef.current?.state.selection.from ?? null
      } else if (editorRef.current) {
        // 先聚焦编辑器，确保光标位置准确
        editorRef.current.commands.focus()
        
        // 使用 setTimeout 确保聚焦后 DOM 已更新
        setTimeout(() => {
          if (editorRef.current) {
            const pos = editorRef.current.state.selection.from
            updatePositionFromEditor(pos, true) // 首次打开，更新水平位置
            setShowAIAssistant(true)
          }
        }, 0)
        return // 提前返回，避免重复设置 showAIAssistant
      } else {
        setAIPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        })
      }
      setShowAIAssistant(true)
    },
    [updatePositionFromEditor]
  )

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autoComplete: "off",
        autoCorrect: "off",
        autoCapitalize: "off",
        "aria-label": placeholder,
        class: "simple-editor",
      },
      handleKeyDown: (view, event) => {
        if (event.isComposing) {
          return false;
        }

        if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
          event.preventDefault()
          openAssistant()
          return true
        }

        if (event.key === ' ' || event.key === 'Space' || event.code === 'Space' || event.key === 'Spacebar') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          if (!selection.empty) {
            return false;
          }

          const parent = $from.parent;
          const clean = (value: string) => value.replace(/[\u200b\u00a0]/g, '');

          const beforeTextRaw = parent.textBetween(0, $from.parentOffset, '\u0000', '\u0000');
          const beforeText = clean(beforeTextRaw);
          const beforeTextLower = beforeText.trim().toLowerCase();

          const afterText = clean(parent.textBetween($from.parentOffset, parent.content.size, '\u0000', '\u0000'));
          const hasContentAfter = afterText.trim().length > 0;
          const hasContentBefore = beforeText.trim().length > 0;

          // Slash 命令：/ai + 空格
          if (beforeTextLower === '/ai') {
            event.preventDefault();

            const commandLength = 3; // "/ai"
            const fromPos = Math.max(selection.from - commandLength, 0);
            const tr = view.state.tr.delete(fromPos, selection.from);
            view.dispatch(tr);

            const coords = view.coordsAtPos(fromPos);
            anchorPosRef.current = fromPos;
            setAIPosition({ top: coords.top, left: coords.left });
            setShowAIAssistant(true);
            return true;
          }

          if (!hasContentBefore && !hasContentAfter) {
            event.preventDefault();

            const coords = view.coordsAtPos(selection.from);
            anchorPosRef.current = selection.from;
            setAIPosition({ top: coords.top, left: coords.left });
            setShowAIAssistant(true);
            return true;
          }
        }

        return false;
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: externalContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // 当外部 content 变化时更新编辑器（但避免循环更新）
  useEffect(() => {
    if (editor && externalContent && externalContent !== editor.getHTML()) {
      editor.commands.setContent(externalContent, { emitUpdate: false })
    }
  }, [externalContent, editor])

  useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAIAssistant(false);
        // 关闭 AI 生成面板
        setShowAIActions(false);
        setAIGeneratedText('');
        setIsAIThinking(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [])

  // 处理 AI 操作 (Notion 风格 - 悬浮面板)
  const handleAIAction = useCallback(async (action: string, customPrompt?: string) => {
    if (!editor) return;
    
    setShowAIAssistant(false);
    setCurrentAIAction(action);
    setLastAIPrompt(customPrompt);
    
    // 记录插入位置
    const insertPos = editor.state.selection.from;
    setAIInsertPosition(insertPos);
    
    // 开始思考
    setIsAIThinking(true);
    setAIGeneratedText('');
    setShowAIActions(true); // 显示面板
    
    try {
      // 准备上下文
      const currentText = editor.getText() || '';
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      ) || '';
      const promptText = customPrompt?.trim();
      const contextText = selectedText || currentText || promptText || '当前文档内容';
      
      // 构建提示词
      let aiPrompt = '';
      switch (action) {
        case 'continue':
          aiPrompt = `请根据以下内容续写下一段，保持风格和语气一致：\n\n${contextText}`;
          break;
        case 'write':
          aiPrompt = `请基于以下主题或上下文创作一段流畅、具备故事性的内容，长度约为300字：\n\n${promptText || contextText}`;
          break;
        case 'draft':
          aiPrompt = `请围绕以下主题创作一篇内容：${promptText || contextText}\n\n要求：结构清晰，内容充实，约300-500字。`;
          break;
        case 'outline':
          aiPrompt = `请为以下主题起草一个详细提纲：${promptText || contextText}\n\n要求：层次分明，要点完整。`;
          break;
        case 'brainstorm':
          aiPrompt = `请围绕以下主题进行头脑风暴，提供10个创意想法：${promptText || contextText}`;
          break;
        case 'summarize':
          aiPrompt = `请用3-5个要点总结以下内容：\n\n${contextText}`;
          break;
        case 'table':
          aiPrompt = `请根据以下主题或上下文整理一份 Markdown 表格，包含至少3列和4行：\n\n${promptText || contextText}\n\n请只返回 Markdown 表格内容。`;
          break;
        case 'flowchart':
          aiPrompt = `请将以下主题拆解为流程步骤，返回编号步骤列表，并在每一步说明关键要点：\n\n${promptText || contextText}`;
          break;
        case 'code':
          aiPrompt = `以下是相关上下文：\n${contextText}\n\n请根据上下文，完成这项编码请求：${promptText || '请根据上下文提供示例代码'}`;
          break;
        case 'translate':
          aiPrompt = `请将以下内容翻译为英文：\n\n${contextText}`;
          break;
        case 'improve':
          aiPrompt = `请优化以下文字，使其更专业、更流畅、更易读：\n\n${selectedText || contextText}`;
          break;
        case 'custom':
          aiPrompt = promptText ? `${promptText}\n\n参考内容：\n${contextText}` : contextText;
          break;
        default:
          aiPrompt = promptText || action;
      }
      
      // 流式生成
      let generatedText = '';
      await callAIStream(aiPrompt, (chunk) => {
        generatedText += chunk;
        setAIGeneratedText(generatedText);
      });
      
      // 生成完成
      setIsAIThinking(false);
      
    } catch (error) {
      console.error('AI 生成失败:', error);
      setIsAIThinking(false);
      setAIGeneratedText('AI 生成失败，请重试。');
    }
  }, [editor]);
  
  // 接受 AI 结果 - 替换到原位置
  const handleAcceptAI = useCallback(() => {
    if (!editor || !aiGeneratedText) return;
    
    const html = aiGeneratedText.includes('<')
      ? aiGeneratedText
      : aiGeneratedText
          .split('\n\n')
          .map((block) => `<p>${block.trim().replace(/\n/g, '<br/>')}</p>`)
          .join('');
    
    // 在插入位置插入内容
    if (aiInsertPosition !== null) {
      editor.chain()
        .focus()
        .setTextSelection(aiInsertPosition)
        .insertContent(html)
        .run();
    }
    
    // 清理状态
    setShowAIActions(false);
    setAIGeneratedText('');
    setIsAIThinking(false);
  }, [editor, aiGeneratedText, aiInsertPosition]);
  
  // 放弃 AI 结果
  const handleDiscardAI = useCallback(() => {
    setShowAIActions(false);
    setAIGeneratedText('');
    setIsAIThinking(false);
  }, []);
  
  // 插入到下方
  const handleInsertBelowAI = useCallback(() => {
    if (!editor || !aiGeneratedText) return;
    
    const html = aiGeneratedText.includes('<')
      ? aiGeneratedText
      : aiGeneratedText
          .split('\n\n')
          .map((block) => `<p>${block.trim().replace(/\n/g, '<br/>')}</p>`)
          .join('');
    
    // 在当前位置下方插入
    editor.chain()
      .focus()
      .insertContent('<p></p>' + html)
      .run();
    
    // 清理状态
    setShowAIActions(false);
    setAIGeneratedText('');
    setIsAIThinking(false);
  }, [editor, aiGeneratedText]);
  
  // 重新生成
  const handleRetryAI = useCallback(() => {
    if (currentAIAction) {
      handleAIAction(currentAIAction, lastAIPrompt);
    }
  }, [currentAIAction, lastAIPrompt, handleAIAction]);
  
  // 取消生成
  const handleCancelAI = useCallback(() => {
    setIsAIThinking(false);
    setShowAIActions(false);
    setAIGeneratedText('');
  }, []);

  // 同步 editor 到 ref
  useEffect(() => {
    if (editor) {
      editorRef.current = editor
      anchorPosRef.current = editor.state.selection.from
    }
    return () => {
      if (editorRef.current === editor) {
        editorRef.current = null
      }
    }
  }, [editor])

  // 监听选区更新
  useEffect(() => {
    if (!editor) return
    
    const handleSelectionUpdate = ({ editor: activeEditor }: { editor: Editor }) => {
      anchorPosRef.current = activeEditor.state.selection.from
      if (showAIAssistant) {
        // 选区更新时只更新垂直位置，不更新水平位置
        updatePositionFromEditor(anchorPosRef.current ?? undefined, false)
      }
    }
    
    editor.on('selectionUpdate', handleSelectionUpdate)
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editor, showAIAssistant, updatePositionFromEditor])

  // 监听滚动和窗口大小变化
  useEffect(() => {
    if (!showAIAssistant) return
    
    const handleReposition = () => {
      const pos = anchorPosRef.current ?? editorRef.current?.state.selection.from
      if (typeof pos === 'number') {
        // 滚动/resize 时只更新垂直位置，保持水平位置不变
        updatePositionFromEditor(pos, false)
      }
    }
    
    const handleScroll = () => handleReposition()
    const handleResize = () => handleReposition()
    
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [showAIAssistant, updatePositionFromEditor])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <EditorContext.Provider value={{ editor }}>
          {/* 工具栏 - 在顶部 */}
          <Toolbar ref={toolbarRef} className="flex-none border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {isMobile ? (
            // 移动端简化工具栏
            <>
              <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="underline" />
              </ToolbarGroup>
            </>
          ) : (
            // 桌面端完整工具栏
            <>
              <Spacer />
              
              <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                <ListDropdownMenu
                  types={["bulletList", "orderedList", "taskList"]}
                  portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="underline" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <ColorPicker />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup>
                <LinkPopover />
                <ColorHighlightPopover />
                <ImageUploadButton />
              </ToolbarGroup>

              <Spacer />
            </>
          )}
        </Toolbar>

          {/* 自定义内容（例如标题） */}
          {renderBeforeEditor && renderBeforeEditor()}

          {/* 编辑器内容区域 */}
          <div className={`flex-1 overflow-y-auto p-8 ${showAIAssistant ? 'hide-placeholder' : ''}`}>
            <EditorContent 
              editor={editor}
              className="prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-full"
            />
          </div>
        </EditorContext.Provider>
      </div>
      
      {/* AI 助手对话框 */}
      {showAIAssistant && (
        <>
          <AIAssistant
            onClose={() => {
              setShowAIAssistant(false);
            }}
            onSelect={handleAIAction}
            position={aiPosition}
            models={modelOptions}
            selectedModelId={selectedModelId}
            onModelChange={setSelectedModelId}
          />
        </>
      )}
      
      {/* AI 生成面板（Notion 风格）*/}
      {showAIActions && (
        <AIGenerationPanel
          isThinking={isAIThinking}
          generatedText={aiGeneratedText}
          position={aiPosition}
          onCancel={handleCancelAI}
          onAccept={handleAcceptAI}
          onDiscard={handleDiscardAI}
          onInsertBelow={handleInsertBelowAI}
          onRetry={handleRetryAI}
        />
      )}
    </>
  )
}
