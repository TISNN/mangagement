import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Image, Paperclip, Plus, Trash2, AlertTriangle, RefreshCw, Maximize, Minimize, Move, Database, Cloud } from 'lucide-react';
import { sendChatMessage, formatMessagesForAPI, testConnection } from '../api/aiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  media?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<Message['media']>([]);
  const [dialogSize, setDialogSize] = useState({ width: 400, height: 600 });
  const [dialogPosition, setDialogPosition] = useState({ right: 6, bottom: 20 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 400, height: 600 });
  const [resizeStartPosition, setResizeStartPosition] = useState({ right: 6, bottom: 20 });
  const [resizeDirection, setResizeDirection] = useState<'all' | 'right' | 'bottom' | 'left' | 'left-top' | 'left-bottom'>('all');
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeSize, setPreMaximizeSize] = useState({ width: 400, height: 600 });
  const [preMaximizePosition, setPreMaximizePosition] = useState({ right: 6, bottom: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ right: 6, bottom: 20 });
  const [useLocalKnowledge, setUseLocalKnowledge] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // 从本地存储加载消息历史和对话框尺寸
  useEffect(() => {
    const savedMessages = localStorage.getItem('aiAssistantMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load messages from localStorage', e);
      }
    }

    // 加载保存的对话框尺寸和位置
    const savedSize = localStorage.getItem('aiAssistantSize');
    if (savedSize) {
      try {
        const size = JSON.parse(savedSize);
        setDialogSize(size);
        setResizeStartSize(size);
        setPreMaximizeSize(size);
      } catch (e) {
        console.error('Failed to load dialog size from localStorage', e);
      }
    }

    const savedPosition = localStorage.getItem('aiAssistantPosition');
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        setDialogPosition(position);
        setResizeStartPosition(position);
        setPreMaximizePosition(position);
      } catch (e) {
        console.error('Failed to load dialog position from localStorage', e);
      }
    }

    // 测试连接状态
    checkServerStatus();
  }, []);

  // 保存消息到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiAssistantMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // 保存对话框尺寸和位置到本地存储
  useEffect(() => {
    localStorage.setItem('aiAssistantSize', JSON.stringify(dialogSize));
  }, [dialogSize]);

  useEffect(() => {
    localStorage.setItem('aiAssistantPosition', JSON.stringify(dialogPosition));
  }, [dialogPosition]);

  // 处理窗口中的鼠标移动（用于调整大小）
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;

        let newWidth = resizeStartSize.width;
        let newHeight = resizeStartSize.height;
        const newRight = resizeStartPosition.right;
        const newBottom = resizeStartPosition.bottom;

        // 根据调整方向更新大小和位置
        switch (resizeDirection) {
          case 'all': // 右下角
            newWidth = Math.max(300, resizeStartSize.width + deltaX);
            newHeight = Math.max(400, resizeStartSize.height + deltaY);
            break;

          case 'right': // 右边框
            newWidth = Math.max(300, resizeStartSize.width + deltaX);
            break;

          case 'bottom': // 底部边框
            newHeight = Math.max(400, resizeStartSize.height + deltaY);
            break;

          case 'left': // 左边框
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            break;

          case 'left-top': // 左上角
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            newHeight = Math.max(400, resizeStartSize.height - deltaY);
            break;

          case 'left-bottom': // 左下角
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            newHeight = Math.max(400, resizeStartSize.height + deltaY);
            break;
        }

        setDialogSize({
          width: newWidth,
          height: newHeight
        });

        setDialogPosition({
          right: newRight,
          bottom: newBottom
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStartPos, resizeStartSize, resizeStartPosition, resizeDirection]);

  // 开始调整大小
  const startResize = (e: React.MouseEvent, direction: 'all' | 'right' | 'bottom' | 'left' | 'left-top' | 'left-bottom') => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ ...dialogSize });
    setResizeStartPosition({ ...dialogPosition });
    setResizeDirection(direction);
  };

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  // 打字机效果
  useEffect(() => {
    if (!isTyping || !typingText) return;

    let index = 0;
    const fullText = typingText;
    setTypingText('');

    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypingText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);

        // 打字完成后，将完整消息添加到历史记录
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: fullText,
          timestamp: Date.now()
        }]);
        setTypingText('');
        setIsProcessing(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isTyping]);

  // 处理本地知识库的回复
  const getLocalKnowledgeResponse = async (query: string) => {
    // 这里可以实现本地知识库的查询逻辑
    // 示例实现，实际项目中需要连接到真实的本地知识库
    return {
      content: `[本地知识库] 您好，这是来自本地知识库的回复。\n\n您的问题是: "${query}"\n\n由于这是一个示例实现，实际项目中这里应该返回从本地知识库中检索到的相关信息。\n\n如需使用在线AI服务，请点击右上角的切换按钮。`
    };
  };

  const handleSend = async () => {
    if ((!input.trim() && (!pendingMedia || pendingMedia.length === 0)) || isProcessing) return;

    // 如果使用在线AI并且服务器状态离线，先尝试重新连接
    if (!useLocalKnowledge && serverStatus === 'offline') {
      const result = await testConnection();
      if (!result.success) {
        // 显示尝试重连失败消息
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: '无法连接到AI服务器，请检查网络连接或稍后再试。您也可以切换到本地知识库模式。',
          timestamp: Date.now()
        }]);
        return;
      } else {
        setServerStatus('online'); // 连接恢复
      }
    }

    // 设置处理状态，防止重复发送
    setIsProcessing(true);

    // 生成新消息ID
    const newMessageId = Date.now().toString();

    // 添加用户消息
    const userMessage: Message = {
      id: newMessageId,
      type: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      media: pendingMedia && pendingMedia.length > 0 ? [...pendingMedia] : undefined
    };

    setMessages(prev => [...prev, userMessage]);

    // 清空输入和待发送媒体
    setInput('');
    setPendingMedia([]);

    let response;

    if (useLocalKnowledge) {
      // 使用本地知识库
      response = await getLocalKnowledgeResponse(userMessage.content);
    } else {
      // 使用在线AI服务
      // 准备发送给API的消息
      const apiMessages = formatMessagesForAPI([
        ...messages.filter(msg => !msg.media || msg.media.length === 0), // 过滤掉带有媒体的消息，API不支持
        userMessage
      ]);

      // 调用API获取响应
      response = await sendChatMessage(apiMessages);

      // 检查是否有API错误消息，如果是连接问题，则更新服务器状态
      if (response.content.includes('连接') || response.content.includes('网络')) {
        setServerStatus('offline');
      }
    }

    // 开始AI打字回复效果
    if (response && response.content) {
      setTypingText(response.content);
      setIsTyping(true);
    } else {
      // 如果API返回为空，显示错误消息
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
        timestamp: Date.now()
      }]);
      setIsProcessing(false);
    }
  };

  // 文件和图片上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPendingMedia(prev => [
          ...(prev || []),
          {
            type,
            url: result,
            name: file.name
          }
        ]);
      };

      reader.readAsDataURL(file);
    }

    // 重置input,允许重复选择同一文件
    event.target.value = '';
  };

  const handleImageUpload = () => {
    setShowAttachOptions(false);
    imageInputRef.current?.click();
  };

  const handleFileUpload = () => {
    setShowAttachOptions(false);
    fileInputRef.current?.click();
  };

  const removePendingMedia = (index: number) => {
    setPendingMedia(prev => (prev || []).filter((_, i) => i !== index));
  };

  const clearHistory = () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      setMessages([]);
      localStorage.removeItem('aiAssistantMessages');
    }
  };

  // 测试服务器连接
  const checkServerStatus = async () => {
    if (isTestingConnection) return;

    setIsTestingConnection(true);
    const result = await testConnection();
    setServerStatus(result.success ? 'online' : 'offline');
    setIsTestingConnection(false);
  };

  // 最大化/还原对话框
  const toggleMaximize = () => {
    if (isMaximized) {
      // 还原尺寸和位置
      setDialogSize(preMaximizeSize);
      setDialogPosition(preMaximizePosition);
      setIsMaximized(false);
    } else {
      // 记住当前尺寸和位置
      setPreMaximizeSize(dialogSize);
      setPreMaximizePosition(dialogPosition);

      // 最大化
      const maxWidth = window.innerWidth - 40; // 留出一些边距
      const maxHeight = window.innerHeight - 40;
      setDialogSize({ width: maxWidth, height: maxHeight });
      setDialogPosition({ right: 20, bottom: 20 });
      setIsMaximized(true);
    }
  };

  // 开始拖动对话框
  const startDragging = (e: React.MouseEvent) => {
    if (isMaximized) return; // 最大化状态下不允许拖动

    e.preventDefault();
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartPosition({ ...dialogPosition });
  };

  // 处理对话框拖动
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.x;
        const deltaY = e.clientY - dragStartPos.y;

        // 计算新位置（考虑到位置是从右下角开始计算的）
        const newRight = Math.max(0, dragStartPosition.right - deltaX);
        const newBottom = Math.max(0, dragStartPosition.bottom - deltaY);

        setDialogPosition({
          right: newRight,
          bottom: newBottom
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartPos, dragStartPosition]);

  return (
    <>
      {/* AI助手图标按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors z-50"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* 对话框 */}
      {isOpen && (
        <div
          className="fixed z-50"
          style={{
            right: `${dialogPosition.right}px`,
            bottom: `${dialogPosition.bottom}px`
          }}
        >
          <div
            ref={dialogRef}
            className="bg-white dark:bg-gray-800 rounded-2xl flex flex-col shadow-xl relative"
            style={{
              width: `${dialogSize.width}px`,
              height: `${dialogSize.height}px`
            }}
          >
            {/* 对话框头部 - 添加可拖动区域 */}
            <div
              className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"
              onMouseDown={startDragging}
            >
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-lg font-semibold dark:text-white">小IN助手</h2>
                  {/* 服务器状态指示器 */}
                  <div className="flex items-center text-xs">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        useLocalKnowledge
                          ? 'bg-green-500'
                          : serverStatus === 'online'
                            ? 'bg-green-500'
                            : serverStatus === 'offline'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                      }`}
                    ></span>
                    <span
                      className={`${
                        useLocalKnowledge
                          ? 'text-green-500'
                          : serverStatus === 'online'
                            ? 'text-green-500'
                            : serverStatus === 'offline'
                              ? 'text-red-500'
                              : 'text-yellow-500'
                      }`}
                    >
                      {useLocalKnowledge
                        ? '本地知识库'
                        : serverStatus === 'online'
                          ? '在线AI服务'
                          : serverStatus === 'offline'
                            ? 'AI服务异常'
                            : '状态未知'}
                    </span>
                    {(!useLocalKnowledge && (serverStatus === 'offline' || serverStatus === 'unknown')) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 防止触发拖动
                          checkServerStatus();
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={isTestingConnection}
                      >
                        <RefreshCw className={`h-3 w-3 ${isTestingConnection ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {/* 添加切换知识库/AI服务按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发拖动
                    setUseLocalKnowledge(!useLocalKnowledge);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
                  title={useLocalKnowledge ? "切换到在线AI" : "切换到本地知识库"}
                >
                  {useLocalKnowledge ?
                    <Cloud className="h-5 w-5" /> :
                    <Database className="h-5 w-5" />
                  }
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发拖动
                    clearHistory();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
                  title="清空聊天记录"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发拖动
                    toggleMaximize();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
                  title={isMaximized ? "还原" : "最大化"}
                >
                  {isMaximized ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发拖动
                    setIsOpen(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 服务器状态警告 - 只在使用在线AI且连接异常时显示 */}
              {!useLocalKnowledge && serverStatus === 'offline' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 mb-4 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">AI服务连接异常</p>
                    <p className="text-sm">无法连接到AI服务器，请检查网络连接或稍后再试。</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={checkServerStatus}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 rounded text-xs flex items-center"
                        disabled={isTestingConnection}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${isTestingConnection ? 'animate-spin' : ''}`} />
                        重试连接
                      </button>
                      <button
                        onClick={() => setUseLocalKnowledge(true)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <Database className="h-3 w-3 mr-1" />
                        切换到本地知识库
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 本地知识库模式通知 */}
              {useLocalKnowledge && messages.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 mb-4">
                  <div className="flex items-center font-medium mb-1">
                    <Database className="h-4 w-4 mr-2" />
                    本地知识库模式
                  </div>
                  <p className="text-sm">您正在使用本地知识库模式，回答将基于预先存储的知识内容，不会连接到在线AI服务。</p>
                </div>
              )}

              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>您好，我是小IN，请问有什么可以帮助您的？</p>
                    {useLocalKnowledge && (
                      <p className="mt-2 text-sm flex items-center justify-center">
                        <Database className="h-4 w-4 mr-1" />
                        当前使用本地知识库提供答案
                      </p>
                    )}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[80%] space-y-2">
                    {/* 消息内容 */}
                    {message.content && (
                      <div
                        className={`p-3 rounded-xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        } whitespace-pre-wrap`}
                      >
                        {message.content}
                      </div>
                    )}

                    {/* 媒体内容 */}
                    {message.media && message.media.length > 0 && (
                      <div className="space-y-2">
                        {message.media.map((item, index) => (
                          <div key={index} className="rounded-xl overflow-hidden">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.name}
                                className="max-w-full rounded-xl"
                              />
                            ) : (
                              <a
                                href={item.url}
                                download={item.name}
                                className={`flex items-center gap-2 p-2 rounded-xl ${
                                  message.type === 'user'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                }`}
                              >
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm truncate max-w-[180px]">{item.name}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 消息时间 */}
                    <div
                      className={`text-xs ${
                        message.type === 'user'
                          ? 'text-right text-gray-300'
                          : 'text-left text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* 打字中效果 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white whitespace-pre-wrap">
                    {typingText}
                    <span className="inline-block w-2 h-4 ml-1 bg-gray-500 animate-pulse"></span>
                  </div>
                </div>
              )}

              {/* 用于自动滚动到底部的引用元素 */}
              <div ref={messagesEndRef} />
            </div>

            {/* 待发送媒体预览 */}
            {pendingMedia && pendingMedia.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                {pendingMedia.map((media, index) => (
                  <div key={index} className="relative">
                    {media.type === 'image' ? (
                      <div className="w-16 h-16 rounded-md overflow-hidden relative">
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePendingMedia(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 pr-6 relative">
                        <Paperclip className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs truncate max-w-[80px]">{media.name}</span>
                        <button
                          onClick={() => removePendingMedia(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 输入框 */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {/* 附件按钮和选项 */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttachOptions(!showAttachOptions)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>

                  {showAttachOptions && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <button
                        onClick={handleImageUpload}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Image className="h-4 w-4 text-blue-500" />
                        <span>图片</span>
                      </button>
                      <button
                        onClick={handleFileUpload}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Paperclip className="h-4 w-4 text-green-500" />
                        <span>文件</span>
                      </button>
                    </div>
                  )}

                  {/* 隐藏的文件输入 */}
                  <input
                    type="file"
                    id="ai-assistant-file-input"
                    name="ai-assistant-file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'file')}
                  />

                  {/* 隐藏的图片输入 */}
                  <input
                    type="file"
                    id="ai-assistant-image-input"
                    name="ai-assistant-image"
                    ref={imageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                </div>

                <input
                  type="text"
                  id="ai-assistant-input"
                  name="ai-assistant-message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入您的问题..."
                  className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  autocomplete="off"
                />
                <button
                  onClick={handleSend}
                  className={`p-2 ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl transition-colors`}
                  disabled={isProcessing}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 调整大小的各个把手 - 只在非最大化状态显示 */}
            {!isMaximized && (
              <>
                {/* 右下角 */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
                  onMouseDown={(e) => startResize(e, 'all')}
                  title="拖动调整大小"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-6 h-6 text-gray-400 dark:text-gray-500 opacity-60"
                  >
                    <path
                      d="M14,16 L16,14 L16,16 L14,16 Z M10,16 L16,10 L16,12 L12,16 L10,16 Z M6,16 L16,6 L16,8 L8,16 L6,16 Z M4,14 L14,4 L16,4 L4,16 L4,14 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* 左上角 */}
                <div
                  className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize"
                  onMouseDown={(e) => startResize(e, 'left-top')}
                  title="拖动调整大小"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-6 h-6 text-gray-400 dark:text-gray-500 opacity-60 rotate-180"
                  >
                    <path
                      d="M14,16 L16,14 L16,16 L14,16 Z M10,16 L16,10 L16,12 L12,16 L10,16 Z M6,16 L16,6 L16,8 L8,16 L6,16 Z M4,14 L14,4 L16,4 L4,16 L4,14 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* 左下角 */}
                <div
                  className="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize"
                  onMouseDown={(e) => startResize(e, 'left-bottom')}
                  title="拖动调整大小"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-6 h-6 text-gray-400 dark:text-gray-500 opacity-60 rotate-90"
                  >
                    <path
                      d="M14,16 L16,14 L16,16 L14,16 Z M10,16 L16,10 L16,12 L12,16 L10,16 Z M6,16 L16,6 L16,8 L8,16 L6,16 Z M4,14 L14,4 L16,4 L4,16 L4,14 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* 右侧边缘 */}
                <div
                  className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
                  onMouseDown={(e) => startResize(e, 'right')}
                ></div>

                {/* 底部边缘 */}
                <div
                  className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                  onMouseDown={(e) => startResize(e, 'bottom')}
                ></div>

                {/* 左侧边缘 */}
                <div
                  className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
                  onMouseDown={(e) => startResize(e, 'left')}
                ></div>
              </>
            )}

            {/* 拖拽提示图标 - 只在非拖拽状态下显示 */}
            {!isDragging && !isMaximized && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-400 opacity-40 pointer-events-none">
                <Move className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}