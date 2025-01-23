import React from 'react';
import { Search, Filter, FileText, FolderKanban, FileCheck, Users, GraduationCap, ChevronRight } from 'lucide-react';

interface ApplicationsPageProps {
  setCurrentPage: (page: string) => void;
}

function ApplicationsPage({ setCurrentPage }: ApplicationsPageProps) {
  return (
    <div className="space-y-6">
      {/* 顶部标题和搜索 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">申请进度</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索申请..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            新建申请
          </button>
        </div>
      </div>

      {/* 申请列表 */}
      <div className="space-y-4">
        {[
          {
            student: '张明',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '伦敦大学学院',
            program: '计算机科学 本科',
            status: '材料准备',
            deadline: '2024-05-15',
            mentor: '刘老师',
            progress: 40
          },
          {
            student: '李华',
            avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '多伦多大学',
            program: '金融经济 研究生',
            status: '面试阶段',
            deadline: '2024-04-20',
            mentor: '王老师',
            progress: 80
          },
          {
            student: '王芳',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '墨尔本大学',
            program: '市场营销 本科',
            status: '申请中',
            deadline: '2024-06-01',
            mentor: '张老师',
            progress: 60
          }
        ].map((application, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              {/* 左侧信息 */}
              <div className="flex items-start gap-4">
                <img
                  src={application.avatar}
                  alt={application.student}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-medium dark:text-white">{application.student}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      申请院校：{application.school}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      申请项目：{application.program}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      负责导师：{application.mentor}
                    </p>
                  </div>
                </div>
              </div>

              {/* 右侧状态和操作 */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    application.status === '面试阶段'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : application.status === '申请中'
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {application.status}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    截止日期: {application.deadline}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentPage('applicationDetail')}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">申请进度</span>
                <span className="text-sm font-medium dark:text-white">{application.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
                <div 
                  className="h-2 bg-blue-600 rounded-full dark:bg-blue-500"
                  style={{ width: `${application.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationsPage; 