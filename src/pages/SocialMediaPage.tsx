import React, { useState } from 'react';
import { 
  Search, Filter, Plus, BarChart3, Share2, ChevronRight,
  MessageSquare, Sparkles, Brain, Calendar, Clock, 
  Instagram, Send, FileEdit, Megaphone, ArrowUpRight
} from 'lucide-react';
import { CommonPageProps } from '../types';

const SocialMediaPage: React.FC<CommonPageProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('全部平台');

  return (
    <div className="space-y-6">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center">
        <div className="flex-1 relative max-w-lg">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索内容..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-blue-900/20 dark:text-blue-400">
            <Brain className="h-4 w-4" />
            AI 助手
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            创建内容
          </button>
        </div>
      </div>

      {/* AI 助手功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'AI 内容创作',
            description: '智能生成多平台内容,一键适配不同平台风格',
            icon: Brain,
            features: ['智能选题建议', '多平台内容生成', '平台风格适配', '热点话题分析']
          },
          {
            title: 'AI 运营助手',
            description: '智能制定运营计划,优化发布时间和频率',
            icon: Sparkles,
            features: ['最佳发布时间', '内容排期规划', '竞品分析', '效果预测']
          },
          {
            title: 'AI 互动管理',
            description: '智能回复评论,提高粉丝互动效率',
            icon: MessageSquare,
            features: ['智能评论回复', '粉丝互动建议', '舆情监控', '危机预警']
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 rounded-xl dark:bg-blue-900/20">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400">
                立即使用
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

      {/* 平台数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: '总粉丝量',
            value: '128.6K',
            change: '+12.5%',
            icon: Share2,
            platforms: {
              微信公众号: '45.2K',
              小红书: '38.4K',
              抖音: '25.8K',
              视频号: '19.2K'
            }
          },
          { 
            title: '总互动量',
            value: '26.8K',
            change: '+8.2%',
            icon: MessageSquare,
            platforms: {
              微信公众号: '8.5K',
              小红书: '10.2K',
              抖音: '5.6K',
              视频号: '2.5K'
            }
          },
          { 
            title: '内容转化',
            value: '5.6%',
            change: '+1.2%',
            icon: ArrowUpRight,
            platforms: {
              微信公众号: '6.2%',
              小红书: '5.8%',
              抖音: '4.8%',
              视频号: '5.2%'
            }
          },
          { 
            title: '品牌提及',
            value: '2.8K',
            change: '+15.4%',
            icon: Megaphone,
            platforms: {
              微信公众号: '960',
              小红书: '850',
              抖音: '620',
              视频号: '370'
            }
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-xl dark:bg-blue-900/20">
                <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
            <div className="space-y-2">
              {Object.entries(stat.platforms).map(([platform, value]) => (
                <div key={platform} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{platform}</span>
                  <span className="font-medium dark:text-gray-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 内容管理 */}
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {['全部平台', '微信公众号', '微信视频号', '小红书', '抖音'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: '2024英国留学申请全攻略',
              platform: '微信公众号',
              status: '已发布',
              date: '2024-03-15 12:30',
              stats: {
                views: 2860,
                likes: 326,
                comments: 128,
                shares: 86
              },
              aiScore: 92
            },
            {
              title: '留学生的一天|英国篇',
              platform: '小红书',
              status: '待发布',
              date: '2024-03-16 18:00',
              stats: {
                views: '-',
                likes: '-',
                comments: '-',
                shares: '-'
              },
              aiScore: 88
            },
            {
              title: '3分钟了解英国硕士申请流程',
              platform: '抖音',
              status: '草稿',
              date: '待定',
              stats: {
                views: '-',
                likes: '-',
                comments: '-',
                shares: '-'
              },
              aiScore: 85
            }
          ].map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium dark:text-white">{content.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    content.status === '已发布'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : content.status === '待发布'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {content.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{content.platform}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {content.date}
                  </span>
                  <span>浏览 {content.stats.views}</span>
                  <span>点赞 {content.stats.likes}</span>
                  <span>评论 {content.stats.comments}</span>
                  <span>分享 {content.stats.shares}</span>
                  <span className="flex items-center gap-1">
                    <Brain className="h-4 w-4 text-blue-600" />
                    AI 评分 {content.aiScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FileEdit className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Send className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            共 24 条内容
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              上一页
            </button>
            <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/20 dark:text-blue-400">
              1
            </button>
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              2
            </button>
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              3
            </button>
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPage; 