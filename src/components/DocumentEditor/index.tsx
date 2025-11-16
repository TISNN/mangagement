/**
 * 通用文档编辑器组件
 * 可复用的文档编辑器，包含标题输入、富文本编辑、工具栏等功能
 * 
 * 使用场景：
 * - 会议文档编辑
 * - 知识库文章编辑
 * - 其他需要富文本编辑的场景
 */

import { useState, useMemo, ReactNode, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Clock,
  Type,
  FileCheck,
  Maximize2,
  Folder,
  MessageSquare,
  Columns,
} from 'lucide-react';
import SimpleEditorWrapper from '../SimpleEditorWrapper';
import { formatDateTime } from '../../utils/dateUtils';

export interface DocumentEditorProps {
  /** 文档标题 */
  title: string;
  /** 标题变化回调 */
  onTitleChange: (title: string) => void;
  /** 文档内容（HTML） */
  content: string;
  /** 内容变化回调 */
  onContentChange: (content: string) => void;
  /** 保存回调函数 */
  onSave: () => Promise<void>;
  /** 是否正在保存 */
  saving?: boolean;
  /** 最后保存时间 */
  lastSaved?: Date | null;
  /** 是否为编辑模式 */
  isEditMode?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 自定义工具栏左侧内容 */
  toolbarLeft?: ReactNode;
  /** 自定义工具栏右侧额外按钮 */
  toolbarRight?: ReactNode;
  /** 是否显示全屏按钮 */
  showFullscreen?: boolean;
  /** 全屏状态 */
  isFullscreen?: boolean;
  /** 全屏状态变化回调 */
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** 自定义标题输入框样式类名 */
  titleClassName?: string;
  /** 是否显示文档元信息 */
  showMetadata?: boolean;
  /** 自定义元信息内容 */
  customMetadata?: ReactNode;
  /** 分类选择功能（可选） */
  location?: {
    value: string;
    onChange: (location: string) => void;
    options: string[];
    loadOptions?: () => Promise<string[]>;
  };
  /** 批注功能（可选） */
  annotation?: {
    documentId: number;
    currentUserId: number;
    currentUserName: string;
    isOpen: boolean;
    onToggle: () => void;
    AnnotationPanel?: React.ComponentType<any>;
  };
  /** 分屏编辑功能（可选） */
  splitScreen?: {
    onOpen: () => void;
  };
}

export default function DocumentEditor({
  title,
  onTitleChange,
  content,
  onContentChange,
  onSave,
  saving = false,
  lastSaved = null,
  isEditMode = false,
  placeholder = '输入文本，按"空格"启用 AI，按"/"启用指令...',
  toolbarLeft,
  toolbarRight,
  showFullscreen = false,
  isFullscreen = false,
  onFullscreenChange,
  titleClassName = '',
  showMetadata = true,
  customMetadata,
  location,
  annotation,
  splitScreen,
}: DocumentEditorProps) {
  // 字数统计
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.length : 0;
  }, [content]);

  // 加载分类选项（如果提供了 loadOptions）
  const [locationOptions, setLocationOptions] = useState<string[]>(location?.options || []);
  useEffect(() => {
    if (location?.loadOptions) {
      location.loadOptions().then(options => {
        setLocationOptions(options);
      });
    } else if (location?.options) {
      setLocationOptions(location.options);
    }
  }, [location]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* 顶部工具栏 - 磨砂玻璃效果 */}
      <div className="flex-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700 sticky top-0 z-50">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          {/* 左侧：自定义内容或默认内容 */}
          <div className="flex items-center gap-2">
            {toolbarLeft || (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isEditMode ? '编辑文档' : '新建文档'}
              </span>
            )}
            
            {/* 分类选择（如果启用） */}
            {location && (
              <>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select
                    value={location.value}
                    onChange={(e) => location.onChange(e.target.value)}
                    className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[120px]"
                  >
                    <option value="">选择分类</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          
          {/* 中间：状态信息 */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {lastSaved && (
              <div className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5" />
                <span>已保存于 {formatDateTime(lastSaved).split(' ')[1]}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              <span>{wordCount} 字</span>
            </div>
          </div>
          
          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-2">
            {showFullscreen && onFullscreenChange && (
              <>
                <button
                  onClick={() => onFullscreenChange(!isFullscreen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  title={isFullscreen ? '退出全屏' : '全屏编辑'}
                >
                  <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
              </>
            )}
            
            {/* 批注按钮 */}
            {annotation && (
              <>
                <button
                  onClick={annotation.onToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    annotation.isOpen
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title="批注"
                >
                  <MessageSquare className="h-4 w-4" />
                  批注
                </button>
              </>
            )}
            
            {/* 分屏编辑按钮 */}
            {splitScreen && (
              <button
                onClick={splitScreen.onOpen}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                title="分屏编辑另一个文档"
              >
                <Columns className="h-4 w-4" />
                分屏编辑
              </button>
            )}
            
            {toolbarRight}
            
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  保存中
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  保存
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 主编辑区域 - 白色背景 */}
      <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
          <SimpleEditorWrapper
            content={content}
            onChange={onContentChange}
            placeholder={placeholder}
            renderBeforeEditor={() => (
              <div className="flex-none px-8 pt-8 pb-6">
                {/* 标题输入框 */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="无标题文档"
                  className={`w-full text-5xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 mb-4 ${titleClassName}`}
                />
                
                {/* 文档元信息 */}
                {showMetadata && (
                  <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
                    {customMetadata || (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {isEditMode ? '最后编辑' : '创建于'} {formatDateTime(lastSaved || new Date())}
                          </span>
                        </div>
                        {lastSaved && (
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4" />
                            <span>已保存</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

