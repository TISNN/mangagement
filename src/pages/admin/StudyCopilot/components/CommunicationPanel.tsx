import React, { useState } from 'react';
import { MessageSquare, Send, Mic, Lightbulb, Copy, Check } from 'lucide-react';

interface Message {
  id: number;
  type: 'advisor' | 'note' | 'ai';
  content: string;
  timestamp: string;
}

interface CommunicationPanelProps {
  onAddNote: (content: string) => void;
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ onAddNote }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'note', content: '学生表示对英国和新加坡都有兴趣', timestamp: '14:30' },
    { id: 2, type: 'ai', content: '💡 建议话术：根据您的背景，英国QS前100院校的传媒专业录取机会较大，新加坡NTU、NUS也很匹配。', timestamp: '14:31' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // 快捷话术建议
  const suggestedPhrases = [
    '根据您的GPA和语言成绩，建议申请QS排名50-100的院校',
    '您的本科背景非常适合传媒方向的硕士项目',
    '建议准备2-3个月的语言提升计划',
    '我们可以先确定申请国家和院校范围',
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      type: 'note',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    onAddNote(newMessage);
    setNewMessage('');
  };

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseSuggestion = (phrase: string) => {
    setNewMessage(phrase);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          沟通与记录
        </h3>
        <button className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* 快捷话术 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Lightbulb className="w-4 h-4" />
          <span className="font-medium">AI话术建议</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleUseSuggestion(phrase)}
              className="text-xs px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.type === 'ai'
                ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{msg.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{msg.timestamp}</p>
              </div>
              <button
                onClick={() => handleCopy(msg.content, msg.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="复制"
              >
                {copiedId === msg.id ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="输入沟通记录或备注..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CommunicationPanel;

