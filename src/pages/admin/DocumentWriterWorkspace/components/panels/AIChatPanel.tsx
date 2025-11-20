/**
 * AI问答面板组件
 * 提供AI问答、润色、内容建议等功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Wand2, Lightbulb, CheckCircle2, X } from 'lucide-react';
import type { AIMessage } from '../../types';

interface AIChatPanelProps {
  studentId: number | null;
  documentId: number | null;
}

export default function AIChatPanel({ studentId, documentId }: AIChatPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: 调用AI API
    setTimeout(() => {
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个AI回复示例。实际功能需要接入AI API。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const quickActions = [
    {
      icon: Wand2,
      label: '润色选中文本',
      onClick: () => {
        // TODO: 实现润色功能
        alert('请先选中要润色的文本');
      },
    },
    {
      icon: Sparkles,
      label: '生成段落',
      onClick: () => {
        // TODO: 实现生成段落功能
        setInputValue('请根据学生背景生成一段PS开头段落');
      },
    },
    {
      icon: Lightbulb,
      label: '内容建议',
      onClick: () => {
        // TODO: 实现内容建议功能
        setInputValue('请提供一些写作建议');
      },
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 快捷操作 - 优化设计 */}
      <div className="p-5 border-b border-slate-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-slate-700 dark:text-slate-300 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 hover:from-slate-100 hover:to-blue-100/50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 rounded-xl border border-slate-200/60 dark:border-gray-700/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-200 group"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 group-hover:scale-110 transition-transform">
                <action.icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 对话历史 - 优化设计 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              开始与AI助手对话
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              可以询问写作建议、请求润色等
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800">
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>AI正在思考...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 - 优化设计 */}
      <div className="p-5 border-t border-slate-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex gap-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入问题..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-slate-50/50 dark:bg-gray-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: AIMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            : 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-gray-700/60'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className="text-xs mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

