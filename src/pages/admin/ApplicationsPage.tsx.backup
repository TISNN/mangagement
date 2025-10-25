import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, FileText, GraduationCap, ChevronRight, CheckCircle, Calendar, User, School, Briefcase, Filter, ChevronLeft, ChevronDown, BarChart3, ClipboardList, Map } from 'lucide-react';

// 申请阶段定义
const applicationStages = [
  { id: 'evaluation', name: '背景评估', icon: ClipboardList },
  { id: 'schoolSelection', name: '选校规划', icon: Map },
  { id: 'preparation', name: '材料准备', icon: FileText },
  { id: 'submission', name: '提交申请', icon: CheckCircle },
  { id: 'interview', name: '面试阶段', icon: User },
  { id: 'decision', name: '录取决定', icon: School },
  { id: 'visa', name: '签证办理', icon: Briefcase }
];

// 获取当前进度对应的阶段
const getStageFromProgress = (progress: number) => {
  if (progress < 15) return 0; // 背景评估
  if (progress < 30) return 1; // 选校规划
  if (progress < 45) return 2; // 材料准备
  if (progress < 60) return 3; // 提交申请
  if (progress < 75) return 4; // 面试阶段
  if (progress < 90) return 5; // 录取决定
  return 6; // 签证办理
};

// 申请数据
const applicationsData = [
          {
            student: 'Evan',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '伦敦大学学院',
            program: '计算机科学 本科',
            status: '材料准备',
            deadline: '2024-05-15',
            mentor: '刘老师',
            progress: 40,
    tags: ['本科', '英国', '紧急'],
            timeline: [
              { date: '2024-03-01', title: '开始准备申请', status: 'completed' },
              { date: '2024-03-15', title: '完成个人陈述', status: 'completed' },
              { date: '2024-04-02', title: '提交申请', status: 'current' },
              { date: '2024-04-20', title: '预计面试', status: 'upcoming' },
              { date: '2024-05-15', title: '录取决定', status: 'upcoming' }
            ]
          },
          {
            student: '李华',
            avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '多伦多大学',
            program: '金融经济 研究生',
            status: '面试阶段',
            deadline: '2024-04-20',
            mentor: '王老师',
            progress: 80,
    tags: ['研究生', '加拿大', '紧急'],
            timeline: [
              { date: '2024-02-10', title: '开始准备申请', status: 'completed' },
              { date: '2024-02-25', title: '完成个人陈述', status: 'completed' },
              { date: '2024-03-05', title: '提交申请', status: 'completed' },
              { date: '2024-03-25', title: '收到面试邀请', status: 'completed' },
              { date: '2024-04-05', title: '完成面试', status: 'current' },
              { date: '2024-04-20', title: '录取决定', status: 'upcoming' }
            ]
          },
          {
            student: '王芳',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
            school: '墨尔本大学',
            program: '市场营销 本科',
            status: '申请中',
            deadline: '2024-06-01',
            mentor: '张老师',
            progress: 60,
    tags: ['本科', '澳大利亚'],
            timeline: [
              { date: '2024-02-15', title: '开始准备申请', status: 'completed' },
              { date: '2024-03-01', title: '完成个人陈述', status: 'completed' },
              { date: '2024-03-20', title: '提交申请', status: 'completed' },
              { date: '2024-04-10', title: '收到材料补充通知', status: 'current' },
              { date: '2024-04-25', title: '预计面试', status: 'upcoming' },
              { date: '2024-06-01', title: '录取决定', status: 'upcoming' }
            ]
  },
  {
    student: '张明',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    school: '哥伦比亚大学',
    program: '人工智能 研究生',
    status: '材料准备',
    deadline: '2024-07-01',
    mentor: '李老师',
    progress: 20,
    tags: ['研究生', '美国'],
    timeline: [
      { date: '2024-03-15', title: '开始准备申请', status: 'completed' },
      { date: '2024-04-05', title: '完成个人陈述', status: 'current' },
      { date: '2024-05-01', title: '预计提交申请', status: 'upcoming' },
      { date: '2024-06-15', title: '预计面试', status: 'upcoming' },
      { date: '2024-07-01', title: '录取决定', status: 'upcoming' }
    ]
  }
];

function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 2;

  // 筛选应用数据
  const filteredApplications = applicationsData.filter(application => {
    const matchesSearch = searchTerm === '' || 
      application.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      application.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.program.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = selectedStatus === null || application.status === selectedStatus;
    const matchesProgram = selectedProgram === null || application.tags.includes(selectedProgram);
    const matchesRegion = selectedRegion === null || application.tags.some(tag => ['英国', '美国', '加拿大', '澳大利亚'].includes(tag) && (selectedRegion === tag));
    
    return matchesSearch && matchesStatus && matchesProgram && matchesRegion;
  });

  // 计算分页数据
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentApplications = filteredApplications.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage
  );

  // 计算统计数据
  const totalApplications = applicationsData.length;
  const urgentApplications = applicationsData.filter(app => app.tags.includes('紧急')).length;
  const completedApplications = applicationsData.filter(app => app.progress >= 80).length;
  const percentageCompleted = Math.round((completedApplications / totalApplications) * 100);

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus(null);
    setSelectedProgram(null);
    setSelectedRegion(null);
    setPageIndex(1);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 顶部标题和搜索 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">申请进度</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索申请..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            筛选
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            新建申请
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">申请状态</label>
              <select 
                value={selectedStatus || ''}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="">全部状态</option>
                <option value="材料准备">材料准备</option>
                <option value="申请中">申请中</option>
                <option value="面试阶段">面试阶段</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">项目类型</label>
              <select 
                value={selectedProgram || ''}
                onChange={(e) => setSelectedProgram(e.target.value || null)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="">全部项目</option>
                <option value="本科">本科</option>
                <option value="研究生">研究生</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">申请地区</label>
              <select 
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="">全部地区</option>
                <option value="英国">英国</option>
                <option value="美国">美国</option>
                <option value="加拿大">加拿大</option>
                <option value="澳大利亚">澳大利亚</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              重置筛选条件
            </button>
          </div>
        </div>
      )}

      {/* 统计摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/20">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">申请总数</p>
            <p className="font-semibold text-xl dark:text-white">{totalApplications}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-full dark:bg-yellow-900/20">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">紧急申请</p>
            <p className="font-semibold text-xl dark:text-white">{urgentApplications}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-full dark:bg-green-900/20">
            <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">完成率</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xl dark:text-white">{percentageCompleted}%</p>
              <div className="w-24 h-2 bg-gray-100 rounded-full dark:bg-gray-700">
                <div className="h-full bg-green-500 rounded-full dark:bg-green-400" style={{ width: `${percentageCompleted}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 申请列表 */}
      {currentApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">没有找到匹配的申请</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">尝试调整筛选条件或搜索词，或者创建一个新的申请。</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {currentApplications.map((application, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
            >
              {/* 紧急标签 */}
              {application.tags.includes('紧急') && (
                <div className="mb-4 inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/20 dark:text-red-400">
                  紧急申请
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              {/* 左侧信息 */}
              <div className="flex items-start gap-4">
                <img
                  src={application.avatar}
                  alt={application.student}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-medium text-lg dark:text-white">{application.student}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <School className="h-4 w-4 mr-1" />
                      {application.school}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {application.program}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      负责导师：{application.mentor}
                    </p>
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {application.tags.filter(tag => tag !== '紧急').map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                  </div>
                </div>
              </div>

              {/* 右侧状态和操作 */}
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  application.status === '面试阶段'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : application.status === '申请中'
                    ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {application.status}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  截止日期: {application.deadline}
                </p>
                <button 
                  onClick={() => setCurrentPage('applicationDetail')}
                  className="mt-2 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  查看详情
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* 步骤跟踪器 */}
            <div className="mb-6">
                <div className="flex justify-between items-center relative">
                  {/* 添加背景连接线 */}
                  <div className="absolute top-1/2 left-9 right-9 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
                  {/* 添加进度连接线 */}
                  <div 
                    className="absolute top-1/2 left-9 h-0.5 bg-blue-600 dark:bg-blue-500 -translate-y-1/2" 
                    style={{ 
                      width: `${application.progress}%`, 
                      maxWidth: 'calc(100% - 18px)'
                    }}
                  ></div>
                  
                {applicationStages.map((stage, stageIndex) => {
                  const currentStage = getStageFromProgress(application.progress);
                  const StageIcon = stage.icon;
                  return (
                    <div 
                      key={stage.id} 
                        className={`flex flex-col items-center z-10 ${stageIndex <= currentStage ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      <div className="relative">
                        <div className={`rounded-full p-2 ${
                          stageIndex < currentStage 
                            ? 'bg-blue-600 dark:bg-blue-500' 
                            : stageIndex === currentStage 
                              ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600 dark:border-blue-400' 
                              : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <StageIcon className={`h-5 w-5 ${
                            stageIndex < currentStage 
                              ? 'text-white' 
                              : stageIndex === currentStage 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-400 dark:text-gray-500'
                          }`} />
                        </div>
                      </div>
                      <span className="text-xs mt-2 font-medium whitespace-nowrap">{stage.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* 时间线视图 - 可切换显示 */}
            <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
              {application.timeline.map((event, eventIndex) => (
                <div key={eventIndex} className="relative">
                  <div className={`absolute -left-[21px] mt-1 w-4 h-4 rounded-full ${
                    event.status === 'completed' 
                      ? 'bg-green-500 dark:bg-green-400' 
                      : event.status === 'current' 
                        ? 'bg-yellow-500 dark:bg-yellow-400' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  } flex items-center justify-center`}>
                    {event.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                    {event.status === 'current' && <Clock className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className={`text-xs font-medium ${
                      event.status === 'completed' 
                        ? 'text-green-600 dark:text-green-400' 
                        : event.status === 'current' 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {event.date}
                    </span>
                    <span className={`text-sm ${
                      event.status === 'upcoming' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {event.title}
                    </span>
                    {event.status === 'current' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full ml-auto">进行中</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
              disabled={pageIndex === 1}
              className={`p-2 rounded-lg ${
                pageIndex === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPageIndex(page)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg ${
                  pageIndex === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages))}
              disabled={pageIndex === totalPages}
              className={`p-2 rounded-lg ${
                pageIndex === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationsPage; 