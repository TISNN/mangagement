import React, { useState } from 'react';
import { 
  Search, Filter, Plus, BarChart3, Share2, ChevronRight,
  MessageSquare, Sparkles, Brain, Calendar, Clock, 
  Instagram, Send, FileEdit, Megaphone, ArrowUpRight,
  PlusCircle, ListTodo, UserCircle, Trash2, Grid, Table,
  Hash, PenTool, CircleDashed, CheckCircle, X
} from 'lucide-react';
import { CommonPageProps } from '../types';
import { useNavigate } from 'react-router-dom';

// 定义内容选题接口
interface ContentTopic {
  id: string;
  title: string;
  description: string;
  targetPlatforms: string[];
  category: string;
  tags: string[];
  status: string;
  plannedDate: string;
  assignee?: string;
  references?: string[];
}

// 定义平台账号接口
interface PlatformAccount {
  id: string;
  platform: string;
  name: string;
  avatar: string;
  description: string;
  followers: number;
  position: string;
}

const SocialMediaPage: React.FC<CommonPageProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('全部平台');
  const [activeSectionTab, setActiveSectionTab] = useState('内容管理');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // 平台账号数据
  const platformAccounts: PlatformAccount[] = [
    {
      id: 'xhs1',
      platform: '小红书',
      name: '留学生日常',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      description: '留学生活方式、学习经验分享',
      followers: 12500,
      position: '生活方式博主'
    },
    {
      id: 'xhs2',
      platform: '小红书',
      name: '留学申请顾问',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      description: '专业申请指导、录取案例分析',
      followers: 18200,
      position: '教育顾问'
    },
    {
      id: 'wechat1',
      platform: '微信公众号',
      name: '海外升学指南',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      description: '权威留学资讯、申请指导',
      followers: 45200,
      position: '官方账号'
    },
    {
      id: 'douyin1',
      platform: '抖音',
      name: '1分钟留学攻略',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      description: '短视频留学知识科普',
      followers: 25800,
      position: '教育创作者'
    }
  ];
  
  // 内容选题示例数据
  const contentTopics: ContentTopic[] = [
    {
      id: 't1',
      title: '托福备考经验分享',
      description: '分享考试技巧、复习方法和备考资源',
      targetPlatforms: ['小红书', '微信公众号'],
      category: '语言考试',
      tags: ['托福', '备考', '英语学习'],
      status: '已规划',
      plannedDate: '2024-04-05',
      assignee: '张明',
      references: ['托福官方指南', '往年真题分析']
    },
    {
      id: 't2',
      title: '美国TOP50大学申请时间规划',
      description: '详细介绍各阶段申请准备工作和截止日期',
      targetPlatforms: ['微信公众号', '抖音'],
      category: '申请指南',
      tags: ['美国大学', '申请规划', '时间节点'],
      status: '进行中',
      plannedDate: '2024-04-12',
      assignee: '李华'
    },
    {
      id: 't3',
      title: '留学生打工攻略 | 校内VS校外',
      description: '分析不同打工方式的优缺点、薪资对比和申请流程',
      targetPlatforms: ['小红书'],
      category: '生活指南',
      tags: ['打工', '兼职', '留学生活'],
      status: '待分配',
      plannedDate: '2024-04-18'
    },
    {
      id: 't4',
      title: '英国G5大学录取背景分析',
      description: '深入分析近三年录取学生的背景和申请亮点',
      targetPlatforms: ['微信公众号'],
      category: '申请分析',
      tags: ['英国', 'G5', '录取标准'],
      status: '已规划',
      plannedDate: '2024-04-25',
      assignee: '王芳'
    }
  ];

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
          <button 
            onClick={() => setShowTopicModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            创建内容
          </button>
        </div>
      </div>

      {/* 模块切换导航 */}
      <div className="bg-white rounded-2xl p-1 dark:bg-gray-800">
        <div className="flex items-center gap-1">
          {['内容管理', '内容规划', '账号管理'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSectionTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeSectionTab === tab
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 根据活动模块显示不同内容 */}
      {activeSectionTab === '内容规划' ? (
        <div className="space-y-6">
          {/* 内容规划顶部操作区 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold dark:text-white">内容选题与规划</h2>
                <button
                  onClick={() => setShowCalendarView(!showCalendarView)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    showCalendarView
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Calendar className="h-4 w-4 inline mr-2" />
                  日历视图
                </button>
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <option value="">所有类别</option>
                  <option value="语言考试">语言考试</option>
                  <option value="申请指南">申请指南</option>
                  <option value="生活指南">生活指南</option>
                  <option value="申请分析">申请分析</option>
                  <option value="行业洞察">行业洞察</option>
                </select>
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <option value="">所有状态</option>
                  <option value="已规划">已规划</option>
                  <option value="进行中">进行中</option>
                  <option value="待分配">待分配</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
            </div>

            {/* 选题列表 */}
            {!showCalendarView && (
              <div className="border rounded-xl overflow-hidden dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">选题</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">平台</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">分类</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">计划日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">负责人</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {contentTopics.map((topic) => (
                      <tr key={topic.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{topic.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{topic.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {topic.targetPlatforms.map((platform) => (
                              <span key={platform} className="px-2 py-1 bg-gray-100 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300">{platform}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs dark:bg-purple-900/20 dark:text-purple-400">{topic.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {topic.plannedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {topic.assignee || "待分配"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            topic.status === '已规划'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                              : topic.status === '进行中'
                              ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : topic.status === '待分配'
                              ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {topic.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => navigate('/admin/tasks')}>
                              同步任务
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              <FileEdit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* 日历视图占位 */}
            {showCalendarView && (
              <div className="border rounded-xl p-4 dark:border-gray-700 min-h-[600px]">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">日历视图会显示每月内容规划</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">点击日期查看或添加当天内容计划</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeSectionTab === '账号管理' ? (
        <div className="space-y-6">
          {/* 账号管理 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">平台账号管理</h2>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Plus className="h-4 w-4" />
                添加账号
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformAccounts.map((account) => (
                <div 
                  key={account.id}
                  className={`p-6 rounded-xl border transition-all ${
                    selectedAccount === account.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-400' 
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedAccount(account.id === selectedAccount ? null : account.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={account.avatar} alt={account.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-medium dark:text-white">{account.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          account.platform === '小红书' 
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                            : account.platform === '微信公众号'
                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {account.platform}
                        </span>
                        <span>{account.position}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">{account.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">粉丝: <span className="font-medium text-gray-700 dark:text-gray-300">{account.followers.toLocaleString()}</span></span>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">查看内容</button>
                      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <FileEdit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
      ) : (
        <div className="space-y-6">
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
      )}

      {/* 内容选题创建模态框 */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 dark:bg-black/70">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">创建内容选题</h2>
              <button 
                onClick={() => setShowTopicModal(false)} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">选题标题</label>
                <input
                  type="text"
                  placeholder="输入选题标题..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">内容描述</label>
                <textarea
                  placeholder="描述内容要点..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">目标平台</label>
                  <div className="space-y-2">
                    {['微信公众号', '微信视频号', '小红书', '抖音'].map((platform) => (
                      <label key={platform} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">内容分类</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <option value="">选择分类</option>
                    <option value="语言考试">语言考试</option>
                    <option value="申请指南">申请指南</option>
                    <option value="生活指南">生活指南</option>
                    <option value="申请分析">申请分析</option>
                    <option value="行业洞察">行业洞察</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">计划日期</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">负责人</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <option value="">选择负责人</option>
                    <option value="张明">张明</option>
                    <option value="李华">李华</option>
                    <option value="王芳">王芳</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">标签</label>
                <input
                  type="text"
                  placeholder="输入标签，用逗号分隔..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="sync-task" className="rounded text-blue-600 focus:ring-blue-500" />
                <label htmlFor="sync-task" className="text-sm text-gray-700 dark:text-gray-300">同步创建为任务</label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  取消
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                  创建选题
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPage; 