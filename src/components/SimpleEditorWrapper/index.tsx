/**
 * Simple Editor 适配器（完整版）
 * 包装 Tiptap Simple Editor，支持 content 和 onChange API
 */

"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import type { Editor } from "@tiptap/react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import AIAssistant from '../AIAssistant/index';
import AIResultDialog from '../AIAssistant/AIResultDialog';
import {
  aiBrainstorm,
  aiCode,
  aiContinue,
  aiCustom,
  aiDraft,
  aiFlowchart,
  aiImprove,
  aiOutline,
  aiTable,
  aiSummarize,
  aiTranslate,
  aiWrite,
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

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
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
import { Sparkles } from "lucide-react"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
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
  minHeight?: string
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
  placeholder = '输入文本，按"空格"启用 AI，按"/"启用指令...',
  readOnly = false,
  minHeight = "400px",
}: SimpleEditorWrapperProps) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">("main")
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  // AI 相关状态
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPosition, setAIPosition] = useState({ top: 0, left: 0 })
  const [showAIResult, setShowAIResult] = useState(false)
  const [aiResult, setAIResult] = useState('')
  const [aiLoading, setAILoading] = useState(false)
  const [currentAIAction, setCurrentAIAction] = useState('')
  const [lastAIPrompt, setLastAIPrompt] = useState<string | undefined>(undefined)
  const editorRef = useRef<Editor | null>(null)
  const anchorPosRef = useRef<number | null>(null)
  const modelOptions = useMemo(() => getAvailableModels(), [])
  const [selectedModelId, setSelectedModelId] = useState(() => getActiveModel().id)
  const activeModelOption = useMemo(
    () => modelOptions.find((item) => item.id === selectedModelId),
    [modelOptions, selectedModelId]
  )

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
    (pos?: number) => {
      const ed = editorRef.current
      if (!ed || !ed.view) return
      const targetPos = typeof pos === "number" ? pos : ed.state.selection.from
      anchorPosRef.current = targetPos
      const coords = ed.view.coordsAtPos(targetPos)
      setAIPosition({ top: coords.top, left: coords.left })
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
            updatePositionFromEditor(pos)
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
      editor.commands.setContent(externalContent, false)
    }
  }, [externalContent, editor])

  const rect = useCursorVisibility({
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
        if (showAIResult) {
          setShowAIResult(false);
          setAIResult('');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [showAIResult])

  // 处理 AI 操作
  const handleAIAction = useCallback(async (action: string, customPrompt?: string) => {
    setShowAIAssistant(false);
    setShowAIResult(true);
    setAILoading(true);
    setCurrentAIAction(action);
    setAIResult('');
    
    try {
      let result = '';
      const currentText = editor?.getText() || '';
      const selectedText = editor?.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      ) || '';
      const promptText = customPrompt?.trim();
      const contextText = selectedText || currentText || promptText || '当前文档内容';
      setLastAIPrompt(promptText || undefined);
      
      switch (action) {
        case 'continue':
          result = await aiContinue(contextText);
          break;
        case 'write':
          result = await aiWrite(promptText || contextText);
          break;
        case 'draft':
          result = await aiDraft(promptText || contextText);
          break;
        case 'outline':
          result = await aiOutline(promptText || contextText);
          break;
        case 'brainstorm':
          result = await aiBrainstorm(promptText || contextText);
          break;
        case 'summarize':
          result = await aiSummarize(contextText);
          break;
        case 'table':
          result = await aiTable(promptText || contextText);
          break;
        case 'flowchart':
          result = await aiFlowchart(promptText || contextText);
          break;
        case 'code':
          result = await aiCode(promptText || '请根据上下文提供示例代码', contextText);
          break;
        case 'translate': {
          let targetLang: 'en' | 'zh' | 'ja' | 'ko' = 'en';
          if (promptText) {
            if (/中文|Chinese/i.test(promptText)) targetLang = 'zh';
            else if (/日文|Japanese/i.test(promptText)) targetLang = 'ja';
            else if (/韩文|Korean/i.test(promptText)) targetLang = 'ko';
            else if (/英文|English/i.test(promptText)) targetLang = 'en';
          }
          result = await aiTranslate(contextText, targetLang);
          break;
        }
        case 'improve':
          result = await aiImprove(selectedText || contextText);
          break;
        case 'custom':
          result = await aiCustom(promptText || '请回答这个问题', contextText);
          break;
        default:
          result = await aiDraft(promptText || action);
      }
      
      setAIResult(result);
    } catch (error) {
      console.error('AI 生成失败:', error);
      setAIResult('AI 生成失败，请重试。');
    } finally {
      setAILoading(false);
    }
  }, [editor, openAssistant]);
  
  // 接受 AI 结果
  const handleAcceptAI = useCallback(() => {
    if (editor && aiResult) {
      const html = aiResult.includes('<')
        ? aiResult
        : aiResult
            .split('\n\n')
            .map((block) => `<p>${block.trim().replace(/\n/g, '<br/>')}</p>`)
            .join('');
      editor.chain().focus().insertContent(html).run();
      setShowAIResult(false);
      setAIResult('');
      setLastAIPrompt(undefined);
    }
  }, [editor, aiResult]);
  
  // 拒绝 AI 结果
  const handleRejectAI = useCallback(() => {
    setShowAIResult(false);
    setAIResult('');
    setLastAIPrompt(undefined);
  }, []);
  
  // 重新生成
  const handleRegenerateAI = useCallback(() => {
    if (currentAIAction) {
      handleAIAction(currentAIAction, lastAIPrompt);
    }
  }, [currentAIAction, handleAIAction, lastAIPrompt]);

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <EditorContext.Provider value={{ editor }}>
          <Toolbar ref={toolbarRef} className="flex-none">
          {isMobile ? (
            // 移动端简化工具栏
            <>
              <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarGroup>
                <MarkButton mark="bold" />
                <MarkButton mark="italic" />
                <MarkButton mark="underline" />
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
                <MarkButton mark="bold" />
                <MarkButton mark="italic" />
                <MarkButton mark="underline" />
                <MarkButton mark="strike" />
                <MarkButton mark="code" />
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
      
      {/* AI 结果对话框 */}
      {showAIResult && (
        <AIResultDialog
          content={aiResult}
          loading={aiLoading}
          onAccept={handleAcceptAI}
          onReject={handleRejectAI}
          onRegenerate={handleRegenerateAI}
        />
      )}
    </>
  )

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

  useEffect(() => {
    if (!editor) return
    const unsubscribe = editor.on('selectionUpdate', ({ editor: activeEditor }) => {
      anchorPosRef.current = activeEditor.state.selection.from
      if (showAIAssistant) {
        updatePositionFromEditor(anchorPosRef.current ?? undefined)
      }
    })
    return () => {
      unsubscribe?.()
    }
  }, [editor, showAIAssistant, updatePositionFromEditor])

  useEffect(() => {
    if (!showAIAssistant) return
    const handleReposition = (event?: Event) => {
      if (event && panelRef.current && panelRef.current.contains(event.target as Node)) {
        return
      }
      const pos = anchorPosRef.current ?? editorRef.current?.state.selection.from
      if (typeof pos === 'number') {
        updatePositionFromEditor(pos)
      }
    }
    const handleScroll = (event: Event) => handleReposition(event)
    const handleResize = () => handleReposition()
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [showAIAssistant, updatePositionFromEditor])
}
