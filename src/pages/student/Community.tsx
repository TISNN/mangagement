import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Heart,
  Share2,
  BookOpen,
  Star,
  ThumbsUp,
  MessageCircle,
  User,
  Search,
  Filter,
  Plus,
  Tag
} from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">留学社区</h1>
          <p className="text-gray-500 dark:text-gray-400">分享经验，互助成长</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索话题..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Plus className="h-5 w-5" />
            <span>发布帖子</span>
          </button>
        </div>
      </div>

      {/* 热门话题标签 */}
      <div className="flex flex-wrap gap-2">
        {[
          '文书写作', '选校策略', '面试经验', '考试备考', 
          '签证申请', '住宿', '实习经验', '奖学金申请'
        ].map((tag, index) => (
          <div 
            key={index}
            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            #{tag}
          </div>
        ))}
      </div>

      {/* 社区统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '社区成员',
            value: '2,851',
            icon: Users,
            color: 'blue'
          },
          {
            title: '今日发帖',
            value: '128',
            icon: MessageSquare,
            color: 'green'
          },
          {
            title: '经验分享',
            value: '1,024',
            icon: BookOpen,
            color: 'purple'
          },
          {
            title: '问题解答',
            value: '3,672',
            icon: MessageCircle,
            color: 'orange'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 热门讨论 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">热门讨论</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            查看全部
          </button>
        </div>
        <div className="space-y-6">
          {[
            {
              title: '分享：我的斯坦福申请经验',
              content: '从准备到最终录取，分享一下我的申请经验和一些建议...',
              author: '张同学',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
              tags: ['申请经验', '斯坦福'],
              likes: 128,
              comments: 45,
              time: '2小时前'
            },
            {
              title: 'TOEFL口语满分经验分享',
              content: '分享一下我是如何准备TOEFL口语，最终拿到30分的...',
              author: '李同学',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
              tags: ['TOEFL', '考试经验'],
              likes: 256,
              comments: 89,
              time: '4小时前'
            },
            {
              title: '关于UCB CS专业选课的一些建议',
              content: '作为一名在UCB CS专业就读的学长，给大家分享一下选课经验...',
              author: '王同学',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty',
              tags: ['选课', 'UCB', 'CS'],
              likes: 189,
              comments: 67,
              time: '6小时前'
            }
          ].map((post, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="flex items-start gap-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium dark:text-white">{post.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.time}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 优秀导师 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">优秀导师</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Johnson',
              title: 'Stanford University',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
              rating: 4.9,
              students: 128,
              expertise: ['文书指导', 'CS专业申请']
            },
            {
              name: 'Michael Chen',
              title: 'UC Berkeley',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
              rating: 4.8,
              students: 156,
              expertise: ['面试辅导', '选校咨询']
            },
            {
              name: 'Emily Wang',
              title: 'MIT',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
              rating: 4.9,
              students: 142,
              expertise: ['科研指导', '推荐信修改']
            }
          ].map((mentor, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium dark:text-white">{mentor.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.title}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{mentor.rating}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    · {mentor.students} 学生
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community; 