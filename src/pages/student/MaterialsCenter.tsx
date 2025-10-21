import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  File,
  Folder,
  History,
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const MaterialsCenter: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* 顶部标题和搜索栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">材料管理中心</h1>
          <p className="text-gray-500 dark:text-gray-400">集中管理你的所有申请材料</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索材料..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Plus className="h-5 w-5" />
            <span>上传材料</span>
          </button>
        </div>
      </div>

      {/* 材料概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '总文件数',
            value: '24',
            icon: File,
            color: 'blue'
          },
          {
            title: '待处理',
            value: '5',
            icon: Clock,
            color: 'yellow'
          },
          {
            title: '已完成',
            value: '16',
            icon: CheckCircle,
            color: 'green'
          },
          {
            title: '需修改',
            value: '3',
            icon: AlertCircle,
            color: 'red'
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

      {/* 最近文件 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">最近文件</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400">
            查看全部
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              name: 'Stanford_SOP_V3.pdf',
              type: 'PDF',
              size: '2.5 MB',
              lastModified: '2024-02-10',
              status: 'completed'
            },
            {
              name: 'UCB_CV_Final.docx',
              type: 'Word',
              size: '1.8 MB',
              lastModified: '2024-02-09',
              status: 'completed'
            },
            {
              name: 'MIT_Research_Statement.pdf',
              type: 'PDF',
              size: '3.2 MB',
              lastModified: '2024-02-08',
              status: 'in-progress'
            },
            {
              name: 'CMU_Transcript.pdf',
              type: 'PDF',
              size: '4.1 MB',
              lastModified: '2024-02-07',
              status: 'pending'
            }
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">{file.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {file.type} · {file.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {file.lastModified}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 文件夹视图 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">文书材料</h2>
            <Plus className="h-5 w-5 text-blue-500 cursor-pointer" />
          </div>
          <div className="space-y-4">
            {[
              { name: '个人陈述', count: 5 },
              { name: '研究计划', count: 3 },
              { name: '推荐信', count: 4 },
              { name: '简历', count: 2 }
            ].map((folder, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <span className="font-medium dark:text-white">{folder.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {folder.count} 个文件
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">证明材料</h2>
            <Plus className="h-5 w-5 text-blue-500 cursor-pointer" />
          </div>
          <div className="space-y-4">
            {[
              { name: '成绩单', count: 3 },
              { name: '语言成绩', count: 2 },
              { name: '获奖证书', count: 6 },
              { name: '实习证明', count: 2 }
            ].map((folder, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <span className="font-medium dark:text-white">{folder.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {folder.count} 个文件
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 版本历史 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">版本历史</h2>
          <History className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-4">
          {[
            {
              file: 'Stanford_SOP.pdf',
              version: 'V3',
              changes: '根据导师建议修改结构',
              date: '2024-02-10 14:30',
              user: '张同学'
            },
            {
              file: 'Stanford_SOP.pdf',
              version: 'V2',
              changes: 'AI优化语言表达',
              date: '2024-02-09 16:45',
              user: '张同学'
            },
            {
              file: 'Stanford_SOP.pdf',
              version: 'V1',
              changes: '初稿完成',
              date: '2024-02-08 10:20',
              user: '张同学'
            }
          ].map((version, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <History className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium dark:text-white">{version.file}</h3>
                    <span className="text-sm text-blue-500">{version.version}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {version.changes}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">{version.date}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{version.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialsCenter; 