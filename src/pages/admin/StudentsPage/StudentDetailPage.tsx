import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Mail, Phone, MapPin, School, Briefcase, Plus, 
  Users, Book, FileCheck, Layers, MessageSquare, Bell, FileText, CircleDollarSign,
  ChevronDown, Check, Bug, RefreshCw, BookOpen
} from 'lucide-react';
import { StudentDisplay } from './StudentsPage';
import StudentServiceCard from '../../../components/StudentServiceCard';
import { formatDate } from '../../../utils/dateUtils';
import { useDataContext } from '../../../context/DataContext'; // 导入数据上下文
import StudentAddModal from '../../../components/StudentAddModal'; // 导入学生添加/编辑模态框
import { peopleService } from '../../../services'; // 导入服务
import { checkStudentMapping, diagnoseStudentDataSync, setupAPILogger } from '../../../utils/debug';

// 调试模式开关
const DEBUG_MODE = true;

const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('概览');
  const [student, setStudent] = useState<StudentDisplay | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  // 添加控制编辑模态框显示的状态
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  // 添加控制状态菜单显示
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  // 创建菜单引用，用于点击外部关闭
  const statusMenuRef = useRef<HTMLDivElement>(null);
  
  // 定义可用的状态选项
  const statusOptions = ['活跃', '休学', '毕业', '退学'];
  
  // 使用DataContext获取所有学生数据
  const { students, loadingStudents, refreshStudents } = useDataContext();

  // 启用API日志记录（仅在调试模式下）
  useEffect(() => {
    if (DEBUG_MODE) {
      setupAPILogger();
    }
  }, []);

  // 使用上下文中的学生数据
  useEffect(() => {
    if (loadingStudents) {
      setIsLoading(true);
      return;
    }
    
    if (studentId && students.length > 0) {
      // 从上下文中找到指定的学生
      const foundStudent = students.find(s => s.id === studentId);
      setStudent(foundStudent || null);
      setIsLoading(false);
    } else {
      setStudent(null);
      setIsLoading(false);
    }
  }, [studentId, students, loadingStudents]);
  
  // 处理点击外部关闭状态菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 返回上一页
  const handleGoBack = () => {
    navigate('/admin/students');
  };
  
  // 打开编辑模态框
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  
  // 学生信息编辑完成后的回调
  const handleStudentEdited = async () => {
    // 刷新学生数据
    await refreshStudents();
    // 关闭编辑模态框
    setShowEditModal(false);
  };
  
  // 处理状态更改
  const handleStatusChange = async (newStatus: string) => {
    if (!student) return;
    
    try {
      setIsUpdatingStatus(true);
      // 更新学生状态，只需要传递status字段，服务会自动处理is_active
      await peopleService.upsertStudent({
        id: student.person_id,
        status: newStatus
      });
      
      // 刷新学生数据
      await refreshStudents();
      // 关闭状态菜单
      setShowStatusMenu(false);
    } catch (error) {
      console.error('更新学生状态失败:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // 人工强制同步状态
  const forceSyncStatus = async () => {
    if (!student) return;
    
    try {
      setIsUpdatingStatus(true);
      // 从数据库获取最新状态
      const dbData = await peopleService.getStudentById(student.person_id);
      console.log('数据库学生数据:', dbData);
      
      // 强制更新状态，确保数据库状态和前端显示一致
      await peopleService.upsertStudent({
        id: student.person_id,
        status: student.status, // 使用前端当前显示的状态
        is_active: student.status === '活跃' // 根据状态文本设置is_active
      });
      
      // 刷新学生数据
      await refreshStudents();
      alert('状态同步完成');
    } catch (error) {
      console.error('同步状态失败:', error);
      alert('同步状态失败: ' + (error as Error).message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // 检查数据映射
  const handleDebugClick = async () => {
    if (!student) return;
    
    try {
      // 获取数据库原始数据
      const dbData = await peopleService.getStudentById(student.person_id);
      
      // 检查数据映射
      const result = checkStudentMapping(dbData, student);
      
      // 显示诊断信息
      diagnoseStudentDataSync();
      
      // 如果有问题，打开调试面板
      if (!result.isCorrect) {
        setShowDebugPanel(true);
      }
    } catch (error) {
      console.error('调试检查失败:', error);
    }
  };
  
  // 获取状态样式类
  const getStatusClass = (status: string) => {
    switch (status) {
      case '活跃':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case '休学':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case '毕业':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '退学':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-4 dark:text-white">未找到学生信息</h1>
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回学生列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">学生详情</h1>
          
          {/* 添加手动同步按钮 */}
          <button
            onClick={forceSyncStatus}
            disabled={isUpdatingStatus}
            className="ml-4 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
            title="强制同步状态"
          >
            <RefreshCw className="h-3 w-3" />
            {isUpdatingStatus ? '同步中...' : '强制同步状态'}
          </button>
          
          {/* 调试按钮 */}
          {DEBUG_MODE && (
            <button
              onClick={handleDebugClick}
              className="ml-2 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1"
              title="检查数据映射"
            >
              <Bug className="h-3 w-3" />
              数据诊断
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              console.log('强制刷新学生数据');
              console.log('当前学生数据:', student);
              if (student) {
                try {
                  const dbData = await peopleService.getStudentById(student.person_id);
                  console.log('数据库学生数据:', dbData);
                  console.log('数据比较:', {
                    '前端状态': student.status,
                    '数据库状态': dbData.status,
                    '数据库is_active': dbData.is_active
                  });
                } catch (error) {
                  console.error('获取数据库数据失败:', error);
                }
              }
              await refreshStudents();
            }}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            title="刷新数据"
          >
            <div className="h-5 w-5 text-gray-500 dark:text-gray-400">↻</div>
          </button>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            添加服务
          </button>
        </div>
      </div>
      
      {/* 调试面板 */}
      {showDebugPanel && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold dark:text-white">数据同步诊断面板</h3>
            <button 
              onClick={() => setShowDebugPanel(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              关闭
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-semibold mb-2 dark:text-white">数据状态</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">前端状态</p>
                  <p className="text-lg font-semibold dark:text-white">{student.status}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">刷新次数</p>
                  <p className="text-lg font-semibold dark:text-white">-</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-2 dark:text-white">操作</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={forceSyncStatus}
                  disabled={isUpdatingStatus}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  强制同步状态
                </button>
                <button
                  onClick={() => refreshStudents()}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  刷新数据
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('supabase.auth.token');
                    window.location.reload();
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  清除缓存并刷新
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 学生个人信息卡片 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧基本信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={student.avatar} 
                alt={student.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold dark:text-white">{student.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(student.status)}`}>
                    {student.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{student.email}</p>
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={handleEditClick}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    编辑资料
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-1 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                          更新中...
                        </>
                      ) : (
                        <>
                          修改状态
                          <ChevronDown className="h-3 w-3 opacity-70" />
                        </>
                      )}
                    </button>
                    
                    {/* 状态选择下拉菜单 */}
                    {showStatusMenu && (
                      <div 
                        ref={statusMenuRef}
                        className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg z-10 py-1 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                          >
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(status)}`}>
                              {status}
                            </span>
                            {status === student.status && (
                              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">入学日期</p>
                  <p className="dark:text-white">{formatDate(student.enrollmentDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">联系电话</p>
                  <p className="dark:text-white">{student.contact || "+86 138-0000-0000"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">电子邮箱</p>
                  <p className="dark:text-white">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">所在地区</p>
                  <p className="dark:text-white">{student.location || "上海市"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">就读学校</p>
                  <p className="dark:text-white">{student.school || "上海外国语大学附属外国语学校"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">年级</p>
                  <p className="dark:text-white">{student.education_level || "高中二年级"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">专业</p>
                  <p className="dark:text-white">{student.major || "暂无"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400 opacity-60" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">详细地址</p>
                  <p className="dark:text-white">{student.address || "暂无"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧服务统计 */}
          <div className="lg:w-80 bg-gray-50 rounded-xl p-4 dark:bg-gray-700/50">
            <h3 className="font-semibold mb-4 dark:text-white">服务概况</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">活跃服务</span>
                <span className="text-gray-900 font-medium dark:text-white">
                  {student.services.filter(s => s.status === '进行中').length} 项
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">已完成服务</span>
                <span className="text-gray-900 font-medium dark:text-white">
                  {student.services.filter(s => s.status === '已完成').length} 项
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">总服务数</span>
                <span className="text-gray-900 font-medium dark:text-white">
                  {student.services.length} 项
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">总服务费</span>
                <span className="text-gray-900 font-medium dark:text-white">￥87,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">首次服务</span>
                <span className="text-gray-900 font-medium dark:text-white">
                  {student.services.length > 0 ? formatDate(student.services.reduce((earliest, service) => 
                    service.enrollmentDate < earliest ? service.enrollmentDate : earliest, 
                    student.services[0].enrollmentDate
                  )) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">负责导师</span>
                <span className="text-gray-900 font-medium dark:text-white">
                  {student.services.length > 0 ? 
                   new Set(student.services.flatMap(s => s.mentors.map(m => m.name))).size : 0} 位
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                管理缴费记录
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                <FileText className="h-4 w-4" />
                查看跟进记录
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['概览', '服务项目', '导师团队', '学习记录', '跟进记录', '缴费记录', '文件管理'].map((tab) => (
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

        {/* 概览内容 */}
        {activeTab === '概览' && (
          <div className="p-6">
            {/* 服务项目列表 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">服务项目</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400" onClick={() => setActiveTab('服务项目')}>查看全部</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {student.services.slice(0, 2).map((service) => (
                  <StudentServiceCard
                    key={service.id}
                    id={service.id}
                    serviceType={service.serviceType}
                    standardizedTestType={service.standardizedTestType}
                    status={service.status}
                    enrollmentDate={service.enrollmentDate}
                    endDate={service.endDate}
                    progress={service.status === '已完成' ? 100 : service.status === '进行中' ? 60 : 30}
                    mentors={service.mentors}
                    fee={service.serviceType === '全包申请' ? '45,000' : 
                         service.serviceType === '标化培训' ? '25,000' : 
                         service.serviceType === '语言培训' ? '15,000' : 
                         service.serviceType === '课业辅导' ? '12,000' : '20,000'}
                    paymentStatus="已缴清"
                    onClick={() => setActiveTab('服务项目')}
                  />
                ))}
              </div>
            </div>

            {/* 导师团队概览 */}
            {student.services.some(service => service.mentors.length > 0) && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">导师团队</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400" onClick={() => setActiveTab('导师团队')}>查看全部</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 dark:bg-gray-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 提取所有唯一导师并展示 */}
                    {Array.from(new Set(student.services.flatMap(s => s.mentors.map(m => m.id))))
                      .slice(0, 3)
                      .map(mentorId => {
                        const mentor = student.services.flatMap(s => s.mentors).find(m => m.id === mentorId);
                        if (!mentor) return null;
                        
                        return (
                          <div key={mentor.id} className="flex items-center gap-3 p-3 bg-white rounded-xl dark:bg-gray-800">
                            <img 
                              src={mentor.avatar} 
                              alt={mentor.name} 
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className="font-medium dark:text-white">{mentor.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {mentor.roles.slice(0, 2).join('、')}
                                {mentor.roles.length > 2 && '...'}
                              </p>
                              <div className="flex mt-1">
                                {student.services
                                  .filter(s => s.mentors.some(m => m.id === mentor.id))
                                  .slice(0, 2)
                                  .map((service, idx) => (
                                    <span 
                                      key={idx}
                                      className="mr-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {service.serviceType}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* 如果有更多导师，显示"更多"提示 */}
                      {new Set(student.services.flatMap(s => s.mentors.map(m => m.id))).size > 3 && (
                        <div 
                          className="flex items-center justify-center p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/70"
                          onClick={() => setActiveTab('导师团队')}
                        >
                          <div className="text-center">
                            <p className="font-medium dark:text-white">查看更多导师</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              共 {new Set(student.services.flatMap(s => s.mentors.map(m => m.id))).size} 位导师
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* 服务统计摘要 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">服务概览</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-600 dark:text-gray-300">总服务时长</h4>
                    <span className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2 dark:text-white">
                    {student.services.length > 0 ? 
                      (() => {
                        const firstDate = new Date(student.services.reduce((earliest, service) => 
                          service.enrollmentDate < earliest ? service.enrollmentDate : earliest, 
                          student.services[0].enrollmentDate
                        ));
                        const now = new Date();
                        const diffMonths = (now.getFullYear() - firstDate.getFullYear()) * 12 + 
                          now.getMonth() - firstDate.getMonth();
                        return diffMonths >= 12 ? 
                          `${Math.floor(diffMonths / 12)}年${diffMonths % 12}个月` : 
                          `${diffMonths}个月`;
                      })() : 
                      '0个月'
                    }
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-600 dark:text-gray-300">活跃服务</h4>
                    <span className="p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
                      <Book className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2 dark:text-white">
                    {student.services.filter(s => s.status === '进行中').length} 项
                  </p>
                  <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                    {Math.round(student.services.filter(s => s.status === '进行中').length / student.services.length * 100) || 0}% 的服务正在进行中
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-600 dark:text-gray-300">服务类型数</h4>
                    <span className="p-2 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                      <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2 dark:text-white">
                    {new Set(student.services.map(s => s.serviceType)).size} 种
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.from(new Set(student.services.map(s => s.serviceType))).slice(0, 3).map((type, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300"
                      >
                        {type}
                      </span>
                    ))}
                    {new Set(student.services.map(s => s.serviceType)).size > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300">
                        ...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 最近活动 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">最近活动</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400" onClick={() => setActiveTab('跟进记录')}>查看全部</button>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    type: '添加服务', 
                    content: '添加了新服务：全包申请', 
                    date: '2023-03-15 10:30', 
                    user: '张老师',
                    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
                  },
                  { 
                    type: '学习记录', 
                    content: '完成了SAT模拟考试，分数1450', 
                    date: '2023-03-10 15:45', 
                    user: '刘老师',
                    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
                  },
                  { 
                    type: '缴费记录', 
                    content: '缴纳了全包申请服务费用 ¥45,000', 
                    date: '2023-03-01 09:15', 
                    user: '系统',
                    avatar: ''
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === '添加服务' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                      activity.type === '学习记录' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {activity.type === '添加服务' ? 
                        <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" /> : 
                        activity.type === '学习记录' ? 
                        <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" /> : 
                        <CircleDollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium dark:text-white">{activity.type}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{activity.content}</p>
                      {activity.user && (
                        <div className="flex items-center gap-2 mt-2">
                          {activity.avatar ? (
                            <img 
                              src={activity.avatar} 
                              alt={activity.user} 
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.user}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 服务项目详情 */}
        {activeTab === '服务项目' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold dark:text-white">所有服务项目</h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
                <Plus className="h-4 w-4" />
                添加服务
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.services.map((service) => (
                <StudentServiceCard
                  key={service.id}
                  id={service.id}
                  serviceType={service.serviceType}
                  standardizedTestType={service.standardizedTestType}
                  status={service.status}
                  enrollmentDate={service.enrollmentDate}
                  endDate={service.endDate}
                  progress={service.status === '已完成' ? 100 : service.status === '进行中' ? 60 : 30}
                  mentors={service.mentors}
                  fee={service.serviceType === '全包申请' ? '45,000' : 
                       service.serviceType === '标化培训' ? '25,000' : 
                       service.serviceType === '语言培训' ? '15,000' : 
                       service.serviceType === '课业辅导' ? '12,000' : '20,000'}
                  paymentStatus="已缴清"
                  onClick={() => alert(`查看服务详情: ${service.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 占位符：其他标签页内容 */}
        {activeTab !== '概览' && activeTab !== '服务项目' && (
          <div className="p-6 text-center py-20">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-4 dark:bg-gray-700">
              {activeTab === '导师团队' ? <Users className="h-10 w-10 text-gray-400" /> :
               activeTab === '学习记录' ? <FileCheck className="h-10 w-10 text-gray-400" /> :
               activeTab === '跟进记录' ? <MessageSquare className="h-10 w-10 text-gray-400" /> :
               activeTab === '缴费记录' ? <CircleDollarSign className="h-10 w-10 text-gray-400" /> :
               <FileText className="h-10 w-10 text-gray-400" />
              }
            </div>
            <h3 className="text-lg font-medium mb-2 dark:text-white">{activeTab}功能开发中</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              该功能正在开发中，敬请期待。您可以先查看学生的基本信息和服务项目。
            </p>
          </div>
        )}
      </div>
      
      {/* 编辑学生信息模态框 */}
      {showEditModal && student && (
        <StudentAddModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onStudentAdded={handleStudentEdited}
          studentToEdit={student}
        />
      )}
    </div>
  );
};

export default StudentDetailPage; 