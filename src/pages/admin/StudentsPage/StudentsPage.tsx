import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Users, UserPlus, FileCheck, GraduationCap, Download, SlidersHorizontal, UserCheck, FilePlus, School } from 'lucide-react';

// 导师角色类型
type MentorRole = '申请导师' | '文书导师' | '选校导师';

// 导师类型
interface Mentor {
  id: string;
  name: string;
  avatar: string;
  roles: MentorRole[];
  isPrimary: boolean;
}

// 学生类型
interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  project: string;
  school: string;
  status: '申请中' | '材料准备' | '已录取' | '已结业';
  mentors: Mentor[];
}

function StudentsPage() {
  // 状态
  const [activeTab, setActiveTab] = useState<string>('全部学生');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<MentorRole | '全部'>('全部');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');

  // 模拟学生数据
  const students: Student[] = [
    {
      id: '1',
      name: 'Evan',
      email: 'zhang.ming@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      project: '本科申请',
      school: '伦敦大学学院',
      status: '申请中',
      mentors: [
        { id: '1', name: '刘老师', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', roles: ['申请导师'], isPrimary: true },
        { id: '2', name: '张老师', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', roles: ['文书导师'], isPrimary: false },
      ]
    },
    {
      id: '2',
      name: '李华',
      email: 'li.hua@example.com',
      avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      project: '研究生申请',
      school: '多伦多大学',
      status: '已录取',
      mentors: [
        { id: '3', name: '王老师', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', roles: ['申请导师', '选校导师'], isPrimary: true },
        { id: '4', name: '陈老师', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', roles: ['文书导师'], isPrimary: false },
      ]
    },
    {
      id: '3',
      name: '王芳',
      email: 'wang.fang@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      project: '本科申请',
      school: '墨尔本大学',
      status: '材料准备',
      mentors: [
        { id: '5', name: '张老师', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', roles: ['申请导师'], isPrimary: true },
        { id: '6', name: '黄老师', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', roles: ['选校导师'], isPrimary: false },
        { id: '7', name: '林老师', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', roles: ['文书导师'], isPrimary: false },
      ]
    },
    {
      id: '4',
      name: '赵伟',
      email: 'zhao.wei@example.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      project: '研究生申请',
      school: '新加坡国立大学',
      status: '已录取',
      mentors: [
        { id: '8', name: '李老师', avatar: 'https://randomuser.me/api/portraits/men/8.jpg', roles: ['申请导师', '文书导师', '选校导师'], isPrimary: true },
      ]
    },
  ];

  // 过滤学生数据
  const filteredStudents = students.filter(student => {
    // 搜索条件
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 状态筛选
    const matchesStatus = selectedStatus === '全部' || student.status === selectedStatus;
    
    // 导师角色筛选
    const matchesRole = selectedRole === '全部' || 
      student.mentors.some(mentor => mentor.roles.includes(selectedRole as MentorRole));
    
    // 标签页筛选
    const matchesTab = activeTab === '全部学生' || 
      (activeTab === '申请中' && student.status === '申请中') ||
      (activeTab === '材料准备' && student.status === '材料准备') ||
      (activeTab === '已录取' && student.status === '已录取') ||
      (activeTab === '已结业' && student.status === '已结业');
    
    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

  // 导师角色图标
  const roleIcons = {
    '申请导师': <UserCheck className="h-3 w-3" />,
    '文书导师': <FilePlus className="h-3 w-3" />,
    '选校导师': <School className="h-3 w-3" />
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已录取':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case '申请中':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '材料准备':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case '已结业':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={`${filterOpen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'} px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            筛选
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            <Download className="h-4 w-4" />
            导出
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            添加学生
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {filterOpen && (
        <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 dark:bg-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">状态筛选</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="全部">全部状态</option>
              <option value="申请中">申请中</option>
              <option value="材料准备">材料准备</option>
              <option value="已录取">已录取</option>
              <option value="已结业">已结业</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">导师角色筛选</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as MentorRole | '全部')}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="全部">全部角色</option>
              <option value="申请导师">申请导师</option>
              <option value="文书导师">文书导师</option>
              <option value="选校导师">选校导师</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus('全部');
                setSelectedRole('全部');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              重置筛选
            </button>
          </div>
        </div>
      )}

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
            {['全部学生', '申请中', '材料准备', '已录取', '已结业'].map((tab) => (
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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      {student.mentors.map((mentor) => (
                        <div key={mentor.id} className="flex items-center gap-2">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className={`h-7 w-7 rounded-full object-cover ${mentor.isPrimary ? 'border-2 border-blue-500' : ''}`}
                          />
                          <span className="text-sm dark:text-gray-300">
                            {mentor.name}
                            {mentor.isPrimary && <span className="text-blue-500 text-xs ml-1">主导师</span>}
                          </span>
                          <div className="flex gap-1 ml-1">
                            {mentor.roles.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={role}
                              >
                                <span className="mr-1">{roleIcons[role]}</span>
                                <span className="hidden sm:inline">{role}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <Search className="h-10 w-10 mb-2 text-gray-400" />
                    <p>未找到符合条件的学生</p>
                    <button
                      onClick={() => {
                        setSelectedStatus('全部');
                        setSelectedRole('全部');
                        setSearchTerm('');
                        setActiveTab('全部学生');
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      清除筛选条件
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 {filteredStudents.length} 条，共 {students.length} 条
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