import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Rabbit,
  PenLine,
  List,
  Table,
  GitBranch,
  Lightbulb,
  Code,
  ArrowUp,
  ChevronDown,
  Wand2,
  ScrollText,
  Languages,
} from 'lucide-react';
import { AIModelOption } from '../../services/aiService';

interface AIAssistantProps {
  onClose: () => void;
  onSelect: (action: string, prompt?: string) => void;
  position: { top: number; left: number };
  models: AIModelOption[];
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export default function AIAssistant({
  onClose,
  onSelect,
  position,
  models,
  selectedModelId,
  onModelChange,
}: AIAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState(position);
  const initialLeftRef = useRef<number | null>(null); // 保存初始水平位置
  const initialTopRef = useRef<number | null>(null); // 保存初始垂直位置基准
  const panelRef = useRef<HTMLDivElement>(null);
  const activeModel = useMemo(
    () => models.find((item) => item.id === selectedModelId),
    [models, selectedModelId]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const recalculatePosition = useCallback(() => {
    if (!panelRef.current || typeof window === 'undefined') return;
    const { innerHeight, innerWidth } = window;
    const rect = panelRef.current.getBoundingClientRect();
    const padding = 16;

    // 计算垂直位置（使用初始 top 或当前 top）
    const baseTop = initialTopRef.current ?? position.top;
    const desiredTop = baseTop + 12;
    const top = Math.min(
      Math.max(desiredTop, padding),
      Math.max(innerHeight - rect.height - padding, padding)
    );

    // 使用固定的水平位置（首次计算后不再改变）
    let left: number;
    if (initialLeftRef.current === null) {
      // 首次计算：基于输入框宽度（560px）居中
      const desiredLeft = position.left - 280; // 560 / 2 = 280
      left = Math.min(
        Math.max(desiredLeft, padding),
        Math.max(innerWidth - 560 - padding, padding)
      );
      initialLeftRef.current = left; // 保存初始水平位置
      initialTopRef.current = position.top; // 保存初始垂直基准
    } else {
      // 后续：使用保存的初始水平位置
      left = initialLeftRef.current;
    }

    setPanelPosition({ top, left });
  }, []); // 移除 position 依赖，避免重新计算

  useLayoutEffect(() => {
    recalculatePosition(); // 首次渲染，计算初始位置
  }, [recalculatePosition]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 只监听窗口 resize，不监听滚动（避免横向漂移）
    const handleResize = () => recalculatePosition(); // resize 时重新计算，但保持初始水平位置
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [recalculatePosition]);

  // 当 position prop 变化时，只更新垂直位置，保持水平位置不变
  useEffect(() => {
    if (initialLeftRef.current !== null && panelRef.current) {
      const { innerHeight } = window;
      const rect = panelRef.current.getBoundingClientRect();
      const padding = 16;
      
      const desiredTop = position.top + 12;
      const top = Math.min(
        Math.max(desiredTop, padding),
        Math.max(innerHeight - rect.height - padding, padding)
      );
      
      // 只更新垂直位置，保持水平位置不变
      setPanelPosition(prev => ({ top, left: prev.left }));
    }
  }, [position.top]); // 只监听 position.top 变化

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const suggestions = useMemo(
    () => [
      {
        category: '建议',
        items: [
          { icon: PenLine, text: '随心创作任何内容的初稿', action: 'draft', color: 'text-purple-600' },
          { icon: List, text: '起草提纲', action: 'outline', color: 'text-purple-600' },
          { icon: Table, text: '制作表格', action: 'table', color: 'text-purple-600' },
          { icon: GitBranch, text: '制作流程图', action: 'flowchart', color: 'text-purple-600' },
        ],
      },
      {
        category: '撰写',
        items: [
          { icon: PenLine, text: '随心写作', action: 'write', color: 'text-purple-600' },
          { icon: PenLine, text: '继续写作', action: 'continue', color: 'text-purple-600' },
        ],
      },
      {
        category: '思考、询问、对话',
        items: [
          { icon: Lightbulb, text: '头脑风暴', action: 'brainstorm', color: 'text-green-600' },
          { icon: Code, text: '帮助编写代码', action: 'code', color: 'text-gray-600' },
        ],
      },
      {
        category: '优化与语言',
        items: [
          { icon: Wand2, text: '润色 / 改写', action: 'improve', color: 'text-orange-500' },
          { icon: ScrollText, text: '生成要点总结', action: 'summarize', color: 'text-blue-500' },
          { icon: Languages, text: '翻译成英文', action: 'translate', color: 'text-emerald-500' },
        ],
      },
    ],
    []
  );

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSelect('custom', inputValue.trim());
    setInputValue('');
  };

  const content = (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        ref={panelRef}
        style={{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px` }}
        className="absolute flex flex-col gap-3 transition-all"
      >
        <div className="pointer-events-auto flex w-[560px] items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Rabbit className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="万事问 AI ..."
            className="flex-1 min-w-0 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(event) => onModelChange(event.target.value)}
                className="appearance-none rounded-full border border-transparent bg-gray-100 px-3 pr-7 py-1.5 text-xs font-medium text-gray-700 outline-none transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="pointer-events-auto max-h-[380px] w-[360px] overflow-y-auto rounded-3xl border border-gray-200 bg-white pb-2 shadow-2xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-800">
          {suggestions.map((section) => (
            <div key={section.category} className="space-y-1 border-b border-gray-100 px-4 py-3 last:border-none dark:border-gray-700">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                {section.category}
              </p>
              {section.items.map((item) => (
                <button
                  key={item.action}
                  onClick={() => onSelect(item.action)}
                  className="w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/80"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{item.text}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return createPortal(content, document.body);
}
