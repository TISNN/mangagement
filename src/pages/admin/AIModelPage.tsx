import React, { useState } from 'react';
import { 
  Search, 
  GraduationCap, 
  Brain,
  Target,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  School,
  Globe,
  Sparkles,
  ChevronDown,
  Mic,
  Send,
  Plus,
  Settings,
  MessageCircle,
  Image,
  Paperclip,
  Table,
  Smile,
  Diamond
} from 'lucide-react';

function AIModelPage() {
  const [selectedMode, setSelectedMode] = useState('常规模式');
  const [selectedModel, setSelectedModel] = useState('GPT-4o mini');
  const [isKnowledgeBaseEnabled, setIsKnowledgeBaseEnabled] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState('默认助手');

  return (
    <div className="space-y-6">
      {/* AI对话区域 */}
      <div className="flex h-[calc(100vh-2rem)] bg-[#1C1C1C] rounded-2xl overflow-hidden">
        {/* 左侧消息列表 */}
        <div className="w-64 bg-[#2C2C2C] p-4 space-y-4">
          {/* 助手选择 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-white font-medium">助手</span>
            </div>
            <button className="text-gray-400 hover:text-white p-1.5 hover:bg-[#3C3C3C] rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* 新建对话按钮 */}
          <button className="w-full flex items-center gap-2 bg-[#3C3C3C] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#4C4C4C] transition-colors">
            <Plus className="h-4 w-4" />
            <span>新建对话</span>
          </button>

          {/* 对话列表 */}
          <div className="space-y-1">
            {[
              { name: '默认助手', icon: Brain, active: true },
              { name: '学术研究者', icon: School },
              { name: '添加助手', icon: Plus }
            ].map((chat) => (
              <button
                key={chat.name}
                onClick={() => setSelectedChat(chat.name)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  chat.name === selectedChat
                    ? 'bg-[#3C3C3C] text-white'
                    : 'text-gray-400 hover:bg-[#3C3C3C] hover:text-white'
                } transition-colors`}
              >
                <chat.icon className="h-4 w-4" />
                <span>{chat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧对话区域 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 控制按钮区域 */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
            <div className="flex gap-6">
              {/* 模式选择 */}
              <div className="relative">
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-3 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors min-w-[140px]"
                >
                  <span>{selectedMode}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showModeDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[140px] bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                    {['常规模式', '创意模式', '专业模式', '简洁模式'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setSelectedMode(mode);
                          setShowModeDropdown(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                  className="flex items-center gap-3 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors min-w-[140px]"
                >
                  <span>{selectedModel}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showModelDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[140px] bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                    {['GPT-4o mini', 'GPT-4', 'Claude 3'].map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
              <span className="text-sm text-gray-700">正在使用所有知识库</span>
              <button
                onClick={() => setIsKnowledgeBaseEnabled(!isKnowledgeBaseEnabled)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  isKnowledgeBaseEnabled ? 'bg-blue-600' : 'bg-gray-300'
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
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
            {/* AI欢迎消息 */}
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 text-gray-700 max-w-3xl shadow-sm border border-gray-100">
                你好，我是默认助手，你可以立即开始跟我聊天。
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="px-8 py-6 border-t border-gray-100 bg-white">
            <div className="bg-gray-50 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="min-h-[60px] mb-4">
                <textarea
                  placeholder="在这里输入消息..."
                  className="w-full bg-transparent border-none text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-0 text-base"
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Table className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="p-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>发送</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'AI 选校助手',
            description: '智能分析学生背景,推荐最适合的申请院校和专业',
            icon: School,
            color: 'blue',
            features: [
              '智能匹配院校',
              '专业适配度分析',
              '录取概率预测',
              '申请策略建议'
            ]
          },
          {
            title: 'AI 背景评估',
            description: '全方位评估学生背景实力,提供提升建议',
            icon: Target,
            color: 'purple',
            features: [
              '学术能力评估',
              '竞争力分析',
              '背景提升建议',
              '申请优势分析'
            ]
          },
          {
            title: 'AI 文书助手',
            description: '智能辅助文书写作,提供修改建议和优化方案',
            icon: FileText,
            color: 'green',
            features: [
              '文书结构建议',
              '内容优化建议',
              '语言表达改进',
              '文书评分反馈'
            ]
          },
          {
            title: 'AI 学习规划',
            description: '制定个性化学习计划,追踪学习进度',
            icon: BookOpen,
            color: 'yellow',
            features: [
              '学习目标制定',
              '时间规划建议',
              '学习进度追踪',
              '效果评估反馈'
            ]
          },
          {
            title: 'AI 面试教练',
            description: '模拟面试训练,提供面试技巧和建议',
            icon: MessageSquare,
            color: 'orange',
            features: [
              '面试问题模拟',
              '答题技巧指导',
              '表达能力训练',
              '面试表现评估'
            ]
          },
          {
            title: 'AI 留学顾问',
            description: '智能解答留学相关问题,提供咨询建议',
            icon: Globe,
            color: 'indigo',
            features: [
              '政策解读咨询',
              '留学费用规划',
              '生活适应建议',
              '签证指导咨询'
            ]
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 bg-${feature.color}-50 rounded-xl dark:bg-${feature.color}-900/20`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                开始使用
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.features.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 使用统计 */}
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-6 dark:text-white">使用统计</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { title: '总使用次数', value: '12,856', icon: Brain, color: 'blue' },
            { title: '本月使用', value: '2,365', icon: BarChart3, color: 'purple' },
            { title: '活跃用户', value: '856', icon: Sparkles, color: 'green' },
            { title: '平均评分', value: '4.8', icon: Target, color: 'yellow' }
          ].map((stat, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold mt-1 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIModelPage; 