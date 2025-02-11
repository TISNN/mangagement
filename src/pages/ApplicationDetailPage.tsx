import React from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Upload,
  Download,
  Plus,
  FileCheck
} from 'lucide-react';

interface ApplicationDetailPageProps {
  setCurrentPage: (page: string) => void;
}

function ApplicationDetailPage({ setCurrentPage }: ApplicationDetailPageProps) {
  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Evan的申请</h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            导出申请
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            编辑申请
          </button>
        </div>
      </div>

      {/* 申请进度追踪 - 调整为全宽 */}
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">申请进度追踪</h3>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">60% 完成</span>
          </div>
          
          {/* 进度阶段和进度条 */}
          <div className="relative">
            {/* 进度条背景 */}
            <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-700">
              <div 
                className="absolute left-0 h-2 bg-blue-600 rounded-full dark:bg-blue-500"
                style={{ width: '60%' }}
              />
            </div>

            {/* 进度节点 */}
            <div className="flex justify-between mt-2">
              {[
                { label: '材料准备', progress: 20, status: 'completed' },
                { label: '文书撰写', progress: 40, status: 'completed' },
                { label: '材料提交', progress: 60, status: 'current' },
                { label: '面试准备', progress: 80, status: 'pending' },
                { label: '录取结果', progress: 100, status: 'pending' }
              ].map((stage, index) => (
                <div key={index} className="relative flex flex-col items-center" style={{ width: '20%' }}>
                  {/* 节点标记 */}
                  <div 
                    className={`absolute -top-3 w-4 h-4 rounded-full border-2 ${
                      stage.status === 'completed'
                        ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                        : stage.status === 'current'
                        ? 'bg-white border-blue-600 dark:border-blue-500'
                        : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                    }`}
                    style={{ left: 'calc(50% - 0.5rem)' }}
                  />
                  
                  {/* 阶段标签 */}
                  <div className="mt-4 text-center">
                    <span className={`text-sm font-medium ${
                      stage.status === 'completed' || stage.status === 'current'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stage.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="col-span-2 space-y-6">
          {/* 选校规划 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-6 dark:text-white">选校规划</h2>
            <div className="space-y-4">
              {[
                {
                  school: '伦敦大学学院',
                  program: '计算机科学 本科',
                  type: '冲刺院校',
                  requirements: {
                    gpa: '85+',
                    ielts: '7.0 (各单项不低于6.5)',
                    deadline: '2024-05-15',
                    preferences: [
                      '较强的数学和编程基础',
                      '计算机相关竞赛获奖经历',
                      '相关研究或项目经验',
                      '课外活动领导力表现'
                    ]
                  },
                  status: 'current'
                },
                {
                  school: '曼彻斯特大学',
                  program: '计算机科学 本科',
                  type: '目标院校',
                  requirements: {
                    gpa: '80+',
                    ielts: '6.5 (各单项不低于6.0)',
                    deadline: '2024-06-30',
                    preferences: [
                      '良好的数理基础',
                      '编程相关实践经验',
                      '团队合作能力',
                      '创新思维能力'
                    ]
                  },
                  status: 'pending'
                },
                {
                  school: '利兹大学',
                  program: '计算机科学 本科',
                  type: '保底院校',
                  requirements: {
                    gpa: '75+',
                    ielts: '6.0 (各单项不低于5.5)',
                    deadline: '2024-07-15',
                    preferences: [
                      '基础的数学能力',
                      '对计算机科学的浓厚兴趣',
                      '良好的学习态度',
                      '基础编程知识'
                    ]
                  },
                  status: 'pending'
                }
              ].map((school, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-6 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium dark:text-white">{school.school}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          school.type === '冲刺院校'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : school.type === '目标院校'
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {school.type}
                        </span>
                        {school.status === 'current' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                            当前申请
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {school.program}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      截止日期: {school.requirements.deadline}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* 申请要求 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">申请要求</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">GPA要求</span>
                          <span className="dark:text-gray-300">{school.requirements.gpa}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">语言要求</span>
                          <span className="dark:text-gray-300">{school.requirements.ielts}</span>
                        </div>
                      </div>
                    </div>

                    {/* 招生偏好 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">招生偏好</h4>
                      <div className="space-y-2">
                        {school.requirements.preferences.map((preference, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            <span>{preference}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 申请进度 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-6 dark:text-white">申请进度</h2>
            <div className="space-y-8">
              {[
                { 
                  title: '个人信息',
                  status: 'completed',
                  date: '2024-03-01',
                  description: '基本信息已完善'
                },
                {
                  title: '学术背景',
                  status: 'completed',
                  date: '2024-03-05',
                  description: '成绩单和学历证明已上传'
                },
                {
                  title: '语言成绩',
                  status: 'current',
                  date: '2024-03-10',
                  description: '雅思成绩单待补充'
                },
                {
                  title: '文书材料',
                  status: 'pending',
                  date: null,
                  description: '个人陈述待撰写'
                },
                {
                  title: '在线提交',
                  status: 'pending',
                  date: null,
                  description: '等待材料齐全后提交'
                }
              ].map((step, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* 时间线 */}
                  <div className="absolute left-6 top-10 bottom-0 w-px bg-gray-100 dark:bg-gray-700" />
                  
                  {/* 状态图标 */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : step.status === 'current'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-50 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : step.status === 'current' ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <AlertCircle className="h-6 w-6" />
                    )}
                  </div>

                  {/* 步骤内容 */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium dark:text-white">{step.title}</h3>
                      {step.date && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 申请材料 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold dark:text-white">申请材料</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400">
                <Plus className="h-4 w-4" />
                上传文件
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: '本科成绩单.pdf',
                  size: '2.5MB',
                  date: '2024-03-01',
                  status: 'verified'
                },
                {
                  name: '学位证书.pdf',
                  size: '1.8MB',
                  date: '2024-03-05',
                  status: 'verified'
                },
                {
                  name: '个人陈述.docx',
                  size: '568KB',
                  date: '2024-03-10',
                  status: 'draft'
                }
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{file.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {file.size} · {file.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'verified' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        已验证
                      </span>
                    )}
                    {file.status === 'draft' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                        草稿
                      </span>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* 申请信息 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">申请信息</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请项目</span>
                <p className="mt-1 dark:text-white">计算机科学 本科</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请学校</span>
                <p className="mt-1 dark:text-white">伦敦大学学院</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">申请截止日期</span>
                <p className="mt-1 dark:text-white">2024-05-15</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">负责导师</span>
                <p className="mt-1 dark:text-white">刘老师</p>
              </div>
            </div>
          </div>

          {/* 申请记录 - 改进版 */}
          <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">申请记录</h2>
            <div className="space-y-6">
              {[
                {
                  date: '2024-03-15',
                  records: [
                    {
                      time: '14:30',
                      action: '提交了雅思成绩单',
                      user: 'Evan',
                      type: 'document',
                      detail: 'Overall: 7.0 (L:7.0, R:7.0, W:6.5, S:7.0)'
                    },
                    {
                      time: '10:15',
                      action: '完成文书修改',
                      user: '刘老师',
                      type: 'review',
                      detail: '个人陈述第三稿完成修改，重点突出了学术背景和研究兴趣'
                    }
                  ]
                },
                {
                  date: '2024-03-10',
                  records: [
                    {
                      time: '16:45',
                      action: '上传推荐信',
                      user: 'Evan',
                      type: 'document',
                      detail: '上传了来自王教授的学术推荐信'
                    },
                    {
                      time: '09:30',
                      action: '文书指导会议',
                      user: '刘老师',
                      type: 'meeting',
                      detail: '讨论个人陈述修改方向，建议加强学术背景描述'
                    }
                  ]
                },
                {
                  date: '2024-03-05',
                  records: [
                    {
                      time: '15:20',
                      action: '确认选校方案',
                      user: '系统',
                      type: 'milestone',
                      detail: '确定UCL为首选院校，完成三所院校的申请规划'
                    }
                  ]
                },
                {
                  date: '2024-03-01',
                  records: [
                    {
                      time: '09:00',
                      action: '开始申请',
                      user: '系统',
                      type: 'milestone',
                      detail: '创建申请档案，开始UCL计算机科学本科申请'
                    }
                  ]
                }
              ].map((day, dayIndex) => (
                <div key={dayIndex}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {day.date}
                    </span>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
                  </div>
                  <div className="space-y-4">
                    {day.records.map((record, recordIndex) => (
                      <div key={recordIndex} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          record.type === 'document'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : record.type === 'review'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                            : record.type === 'meeting'
                            ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium dark:text-white">{record.action}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {record.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {record.detail}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            操作人: {record.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage; 