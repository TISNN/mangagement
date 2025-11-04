import React, { useState } from 'react';
import { 
  Brain,
  ChevronDown,
  Mic,
  Send,
  Plus,
  Settings,
  Image,
  Paperclip,
  Table,
  Smile,
  Diamond
} from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChatAssistant: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState('常规模式');
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [isKnowledgeBaseEnabled, setIsKnowledgeBaseEnabled] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState('默认助手');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: '你好！我是你的AI留学助手。我可以帮你：\n1. 优化文书和简历\n2. 选校选专业分析\n3. 回答留学相关问题\n4. 模拟面试训练\n请告诉我你需要什么帮助？',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 添加用户消息
    setMessages(prev => [...prev, {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }]);

    // 模拟AI回复
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: '我正在分析你的问题，请稍等...',
        timestamp: new Date()
      }]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
      <div className="flex h-full">
        {/* 左侧消息列表 */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* 助手选择 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium dark:text-white">助手</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* 新建对话按钮 */}
          <button className="w-full flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
            <Plus className="h-4 w-4" />
            <span>新建对话</span>
          </button>

          {/* 对话列表 */}
          <div className="space-y-1">
            {[
              { name: '默认助手', icon: Brain, active: true },
              { name: '文书助手', icon: Brain },
              { name: '选校助手', icon: Brain }
            ].map((chat) => (
              <button
                key={chat.name}
                onClick={() => setSelectedChat(chat.name)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  chat.name === selectedChat
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } transition-colors`}
              >
                <chat.icon className="h-4 w-4" />
                <span>{chat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧对话区域 */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          {/* 控制按钮区域 */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-6">
              {/* 模式选择 */}
              <div className="relative">
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[140px]"
                >
                  <span>{selectedMode}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showModeDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[140px] bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                    {['常规模式', '创意模式', '专业模式', '简洁模式'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setSelectedMode(mode);
                          setShowModeDropdown(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 模型选择 */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[140px]"
                >
                  <span>{selectedModel}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showModelDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[140px] bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                    {['GPT-4', 'GPT-3.5', 'Claude-3'].map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 知识库开关 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">使用留学知识库</span>
              <button
                onClick={() => setIsKnowledgeBaseEnabled(!isKnowledgeBaseEnabled)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  isKnowledgeBaseEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isKnowledgeBaseEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 聊天区域 */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-6">
                <div className={`w-10 h-10 rounded-xl ${
                  message.type === 'ai' ? 'bg-blue-500' : 'bg-green-500'
                } flex items-center justify-center flex-shrink-0`}>
                  {message.type === 'ai' ? (
                    <Brain className="h-6 w-6 text-white" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 text-gray-700 dark:text-gray-300 max-w-3xl shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* 输入区域 */}
          <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="min-h-[60px] mb-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="在这里输入消息..."
                  className="w-full bg-transparent border-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-0 text-base"
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Table className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>发送</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant; 
