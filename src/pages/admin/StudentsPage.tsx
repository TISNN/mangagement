import React from 'react';
import { Search, ChevronLeft, ChevronRight, Users, UserPlus, FileCheck, GraduationCap, Filter } from 'lucide-react';

interface StudentsPageProps {
  setCurrentPage?: (page: string) => void;
}

function StudentsPage({ setCurrentPage }: StudentsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">学生管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索学生..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            筛选
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            添加学生
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '总学生数', value: '2,851', icon: Users, color: 'blue' },
          { title: '本月新增', value: '128', icon: UserPlus, color: 'green' },
          { title: '申请中', value: '386', icon: FileCheck, color: 'yellow' },
          { title: '成功录取', value: '1,204', icon: GraduationCap, color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 学生列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部学生', '申请中', '已录取', '已结业'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">学生信息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">申请项目</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">申请学校</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">负责导师</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: 'Evan',
                email: 'zhang.ming@example.com',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '本科申请',
                school: '伦敦大学学院',
                status: '申请中',
                mentor: '刘老师'
              },
              {
                name: '李华',
                email: 'li.hua@example.com',
                avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '研究生申请',
                school: '多伦多大学',
                status: '已录取',
                mentor: '王老师'
              },
              {
                name: '王芳',
                email: 'wang.fang@example.com',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '本科申请',
                school: '墨尔本大学',
                status: '材料准备',
                mentor: '张老师'
              },
              {
                name: '赵伟',
                email: 'zhao.wei@example.com',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
                project: '研究生申请',
                school: '新加坡国立大学',
                status: '已录取',
                mentor: '李老师'
              },
            ].map((student, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 dark:text-gray-300">{student.project}</td>
                <td className="py-4 px-6 dark:text-gray-300">{student.school}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === '已录取'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : student.status === '申请中'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 dark:text-gray-300">{student.mentor}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 10 条，共 156 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, 3, '...', 16].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-xl text-sm ${
                    page === 1
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsPage; 