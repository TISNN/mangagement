import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Mail, Phone, MapPin, School, Briefcase, Plus, 
  Users, Book, FileCheck, Layers, FileText, CircleDollarSign,
  ChevronDown, Check, BookOpen, MessageSquare, ExternalLink, Workflow, Video
} from 'lucide-react';
import { StudentDisplay } from './StudentsPage';
import StudentServiceCard from '../../../components/StudentServiceCard';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
import { useDataContext } from '../../../context/DataContext'; // 导入数据上下文
import StudentAddModal from '../../../components/StudentAddModal'; // 导入学生添加/编辑模态框
import AddServiceModal from '../../../components/AddServiceModal'; // 导入添加服务模态框
import { peopleService, financeService } from '../../../services'; // 导入服务
import { getAllTasks } from '../../../services/taskService'; // 导入任务服务
import { applicationDocumentService, studentMeetingService } from '../../../pages/admin/ApplicationProgress/services/applicationService'; // 导入申请服务
import { getDocumentsByStudentId } from '../../../services/cloudDocumentService'; // 导入云文档服务
import type { Task } from '../../../services/taskService'; // 导入任务类型
import type { StudentMeeting } from '../../../pages/admin/ApplicationProgress/types'; // 导入会议类型
import CreateRecurringMeetingModal from '../../admin/MeetingManagement/components/CreateRecurringMeetingModal'; // 导入定期会议模态框
import { createRecurringMeetingTemplate } from '../../admin/MeetingManagement/services/recurringMeetingService'; // 导入定期会议服务
import { RecurringMeetingTemplateFormData } from '../../admin/MeetingManagement/types/recurring'; // 导入定期会议类型

const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('概览');
  const [student, setStudent] = useState<StudentDisplay | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 添加控制编辑模态框显示的状态
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  // 添加控制添加服务模态框显示的状态
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  // 添加控制定期会议模态框显示的状态
  const [showRecurringMeetingModal, setShowRecurringMeetingModal] = useState<boolean>(false);
  // 添加控制状态菜单显示
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  // 创建菜单引用，用于点击外部关闭
  const statusMenuRef = useRef<HTMLDivElement>(null);
  
  // 跟进记录数据状态
  const [followUpTasks, setFollowUpTasks] = useState<Task[]>([]);
  const [loadingFollowUp, setLoadingFollowUp] = useState<boolean>(false);
  
  // 缴费记录数据状态
  const [paymentRecords, setPaymentRecords] = useState<Array<{
    id: number;
    amount: number;
    status: string;
    transaction_date: string;
    service_type?: { name: string };
    category?: { name: string };
    notes?: string;
  }>>([]);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(false);
  
  // 文件管理数据状态
  const [applicationDocuments, setApplicationDocuments] = useState<Array<{
    id: number;
    document_name: string;
    document_type?: string;
    status?: string;
    is_required?: boolean;
    progress?: number;
    due_date?: string;
    completed_date?: string;
    file_url?: string;
    notes?: string;
  }>>([]);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);
  
  // 会议记录数据状态
  const [meetings, setMeetings] = useState<StudentMeeting[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState<boolean>(false);
  
  // 文档列表数据状态
  const [cloudDocuments, setCloudDocuments] = useState<Array<{
    id: number;
    title: string;
    content: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    creator?: { name: string };
  }>>([]);
  const [loadingCloudDocuments, setLoadingCloudDocuments] = useState<boolean>(false);
  
  // 定义可用的状态选项
  const statusOptions = ['活跃', '休学', '毕业', '退学'];
  
  // 使用DataContext获取所有学生数据
  const { students, loadingStudents, refreshStudents } = useDataContext();
  
  // 财务数据状态
  const [totalServiceFee, setTotalServiceFee] = useState<number | null>(null);
  const [loadingFinancialData, setLoadingFinancialData] = useState<boolean>(false);


  // 使用上下文中的学生数据
  useEffect(() => {
    if (loadingStudents) {
      setIsLoading(true);
      return;
    }
    
    if (studentId && students.length > 0) {
      // 调试日志
      console.log('正在查找学生，studentId:', studentId);
      console.log('学生列表中的ID:', students.map(s => s.id));
      
      // 从上下文中找到指定的学生
      const foundStudent = students.find(s => s.id === studentId);
      
      if (!foundStudent) {
        console.warn('未找到学生，studentId:', studentId);
        console.warn('可用的学生ID列表:', students.map(s => s.id).join(', '));
      } else {
        console.log('找到学生:', foundStudent.name);
      }
      
      setStudent(foundStudent || null);
      setIsLoading(false);
      
      // 如果找到学生，加载财务数据和会议数据
      if (foundStudent) {
        loadFinancialData(foundStudent.person_id);
        // 在概览页显示最近的会议
        loadMeetings(parseInt(foundStudent.id));
      }
    } else {
      console.log('条件不满足 - studentId:', studentId, 'students.length:', students.length);
      setStudent(null);
      setIsLoading(false);
    }
  }, [studentId, students, loadingStudents]);
  
  // 加载财务数据
  const loadFinancialData = async (personId: number) => {
    try {
      setLoadingFinancialData(true);
      const financialData = await financeService.getStudentFinancialData(personId);
      // 计算总服务费（所有已完成的收入交易）
      const total = financialData.totalPaid || 0;
      setTotalServiceFee(total);
    } catch (error) {
      console.error('获取财务数据失败:', error);
      setTotalServiceFee(null);
    } finally {
      setLoadingFinancialData(false);
    }
  };
  
  // 加载跟进记录（从任务管理获取）
  const loadFollowUpRecords = async (personId: number) => {
    try {
      setLoadingFollowUp(true);
      const allTasks = await getAllTasks();
      // 筛选与该学生相关的任务
      const studentTasks = allTasks.filter(task => 
        task.related_student_id === personId || 
        (task.linked_entity_type === 'student' && task.linked_entity_id === personId)
      );
      setFollowUpTasks(studentTasks);
    } catch (error) {
      console.error('获取跟进记录失败:', error);
      setFollowUpTasks([]);
    } finally {
      setLoadingFollowUp(false);
    }
  };
  
  // 加载缴费记录
  const loadPaymentRecords = async (personId: number) => {
    try {
      setLoadingPayments(true);
      const financialData = await financeService.getStudentFinancialData(personId);
      // 获取所有收入交易记录
      const payments = financialData.transactions.filter(t => t.direction === '收入');
      setPaymentRecords(payments);
    } catch (error) {
      console.error('获取缴费记录失败:', error);
      setPaymentRecords([]);
    } finally {
      setLoadingPayments(false);
    }
  };
  
  // 加载申请文件记录（只显示学生已上传的文件）
  const loadFileRecords = async (studentId: number) => {
    try {
      setLoadingDocuments(true);
      // 使用getUploadedDocumentsByStudentId只获取已上传的文件
      const documents = await applicationDocumentService.getUploadedDocumentsByStudentId(studentId);
      setApplicationDocuments(documents);
    } catch (error) {
      console.error('获取申请文件失败:', error);
      setApplicationDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };
  
  // 加载会议记录
  const loadMeetings = async (studentId: number) => {
    try {
      setLoadingMeetings(true);
      const meetingsData = await studentMeetingService.getMeetingsByStudentId(studentId);
      setMeetings(meetingsData);
    } catch (error) {
      console.error('获取会议记录失败:', error);
      setMeetings([]);
    } finally {
      setLoadingMeetings(false);
    }
  };
  
  // 加载文档列表
  const loadCloudDocuments = async (studentId: number) => {
    try {
      setLoadingCloudDocuments(true);
      const documents = await getDocumentsByStudentId(studentId);
      setCloudDocuments(documents);
    } catch (error) {
      console.error('获取文档列表失败:', error);
      setCloudDocuments([]);
    } finally {
      setLoadingCloudDocuments(false);
    }
  };
  
  // 当切换标签页时加载数据
  useEffect(() => {
    if (!student) return;
    
    if (activeTab === '跟进记录') {
      loadFollowUpRecords(student.person_id);
    } else if (activeTab === '缴费记录') {
      loadPaymentRecords(student.person_id);
    } else if (activeTab === '申请文件') {
      loadFileRecords(parseInt(student.id));
    } else if (activeTab === '文档列表') {
      loadCloudDocuments(parseInt(student.id));
    } else if (activeTab === '会议记录') {
      loadMeetings(parseInt(student.id));
    }
  }, [activeTab, student]);
  
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

  // 返回上一页 - 跳转到学生总览
  const handleGoBack = () => {
    navigate('/admin/students-legacy');
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
    }
  };

  // 处理创建定期会议
  const handleCreateRecurringMeeting = async (data: RecurringMeetingTemplateFormData) => {
    if (!student) return;
    
    try {
      // 从 localStorage 获取当前用户信息
      const employeeData = localStorage.getItem('currentEmployee');
      if (!employeeData) {
        alert('用户信息获取失败');
        return;
      }

      const employee = JSON.parse(employeeData);
      
      // 确保关联到当前学生
      const meetingData = {
        ...data,
        student_id: parseInt(student.id)
      };
      
      await createRecurringMeetingTemplate(meetingData, employee.id);
      
      // 刷新会议数据
      await loadMeetings(parseInt(student.id));
      
      alert('定期会议创建成功!系统将自动生成未来的会议实例。');
      setShowRecurringMeetingModal(false);
    } catch (error) {
      console.error('创建定期会议失败:', error);
      alert('创建定期会议失败，请重试');
      throw error;
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

  // 加载进度历史记录
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
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // 检查学生是否有申请服务
              const hasApplicationService = student.services.some(s => 
                s.serviceCategory === '全包申请' || 
                s.serviceCategory === '半DIY申请' ||
                s.serviceType.includes('申请')
              );
              if (hasApplicationService) {
                navigate(`/admin/application-workbench?studentId=${student.id}`);
              } else {
                navigate(`/admin/service-chronology?studentId=${student.id}`);
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
            title="进入工作台"
          >
            <Workflow className="h-4 w-4" />
            工作台
          </button>
          <button
            onClick={() => navigate(`/admin/service-chronology?studentId=${student.id}`)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            title="查看服务进度"
          >
            <FileCheck className="h-4 w-4" />
            服务进度
          </button>
          <button
            onClick={() => {
              setShowAddServiceModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            添加服务
          </button>
        </div>
      </div>

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
                    >
                      修改状态
                      <ChevronDown className="h-3 w-3 opacity-70" />
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
                  <p className={`${student.contact ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.contact || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">电子邮箱</p>
                  <p className={`${student.email ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">所在地区</p>
                  <p className={`${student.location ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.location || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">就读学校</p>
                  <p className={`${student.school ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.school || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">年级</p>
                  <p className={`${student.education_level ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.education_level || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">专业</p>
                  <p className={`${student.major ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.major || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400 opacity-60" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">详细地址</p>
                  <p className={`${student.address ? 'dark:text-white' : 'text-gray-400 italic dark:text-gray-500'}`}>
                    {student.address || "N/A"}
                  </p>
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
                <span className="text-gray-900 font-medium dark:text-white">
                  {loadingFinancialData ? (
                    <span className="text-xs text-gray-400">加载中...</span>
                  ) : totalServiceFee !== null ? (
                    `¥${totalServiceFee.toLocaleString()}`
                  ) : (
                    <span className="text-gray-400 italic dark:text-gray-500">暂无数据</span>
                  )}
                </span>
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
              <button
                onClick={() => {
                  // 跳转到财务模块，筛选该学生的交易记录
                  navigate(`/admin/finance?personId=${student.person_id}&personType=student`);
                }}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <CircleDollarSign className="h-4 w-4" />
                管理缴费记录
              </button>
              <button
                onClick={() => {
                  // 跳转到任务管理，筛选该学生的任务（作为跟进记录）
                  navigate(`/admin/tasks?relatedStudentId=${student.person_id}`);
                }}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <FileText className="h-4 w-4" />
                查看跟进记录
              </button>
              {student.businessLines.includes('study_application') && (
                <button
                  onClick={() => {
                    navigate(`/admin/application-workbench?studentId=${student.id}`);
                  }}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  申请工作台
                </button>
              )}
              <button
                onClick={() => {
                  navigate(`/admin/students?search=${encodeURIComponent(student.name)}`);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                申请学生中心
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['概览', '服务项目', '导师团队', '跟进记录', '缴费记录', '申请文件', '文档列表', '会议记录'].map((tab) => (
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
                    fee={totalServiceFee !== null ? `¥${totalServiceFee.toLocaleString()}` : '暂无数据'}
                    paymentStatus={loadingFinancialData ? '加载中...' : totalServiceFee !== null ? '已缴费' : '暂无数据'}
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
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 dark:text-blue-400" onClick={() => setActiveTab('会议记录')}>查看会议</button>
                  <button className="text-sm text-blue-600 dark:text-blue-400" onClick={() => setActiveTab('跟进记录')}>查看跟进</button>
                </div>
              </div>
              {meetings.length > 0 ? (
                <div className="space-y-3">
                  {meetings.slice(0, 3).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium dark:text-white">{meeting.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              meeting.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              meeting.status === '进行中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {meeting.status || '已安排'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(meeting.start_time)}
                            {meeting.meeting_type && ` · ${meeting.meeting_type}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {meetings.length > 3 && (
                    <button
                      onClick={() => setActiveTab('会议记录')}
                      className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      查看全部 {meetings.length} 个会议 →
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <p className="italic">暂无活动记录</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 服务项目详情 */}
        {activeTab === '服务项目' && (
          <>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">所有服务项目</h3>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  添加服务
                </button>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">服务记录</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {student?.services.map((service) => (
                    <div 
                      key={service.id}
                      className="transition-all hover:shadow-md"
                    >
                      <StudentServiceCard
                        {...service}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 导师团队详情 */}
        {activeTab === '导师团队' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">导师团队</h3>
            {student.services.some(service => service.mentors.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(student.services.flatMap(s => s.mentors.map(m => m.id))))
                  .map(mentorId => {
                    const mentor = student.services.flatMap(s => s.mentors).find(m => m.id === mentorId);
                    if (!mentor) return null;
                    
                    const relatedServices = student.services.filter(s => 
                      s.mentors.some(m => m.id === mentorId)
                    );
                    
                    return (
                      <div key={mentor.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={mentor.avatar} 
                            alt={mentor.name} 
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-medium dark:text-white">{mentor.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {mentor.roles.join('、')}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">负责服务：</p>
                          <div className="flex flex-wrap gap-1">
                            {relatedServices.map((service, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full dark:bg-blue-900/20 dark:text-blue-300"
                              >
                                {service.serviceType}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂未分配导师团队</p>
                <p className="text-sm mt-2">请通过"编辑资料"功能为学生分配导师</p>
              </div>
            )}
          </div>
        )}

        {/* 跟进记录 - 从任务管理获取数据 */}
        {activeTab === '跟进记录' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">跟进记录</h3>
              <button
                onClick={() => navigate(`/admin/tasks?relatedStudentId=${student.person_id}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                查看完整任务记录
              </button>
            </div>
            
            {loadingFollowUp ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : followUpTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无跟进记录</p>
                <p className="text-sm mt-2">该学生目前没有相关的任务记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {followUpTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium dark:text-white">{task.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            task.status === '进行中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            task.status === '待处理' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.priority === '高' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            task.priority === '中' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {task.priority}优先级
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {task.due_date && (
                            <span>截止日期: {formatDate(task.due_date)}</span>
                          )}
                          {task.created_at && (
                            <span>创建时间: {formatDate(task.created_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 缴费记录 - 从财务模块获取数据 */}
        {activeTab === '缴费记录' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">缴费记录</h3>
              <button
                onClick={() => navigate(`/admin/finance?personId=${student.person_id}&personType=student`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                查看完整财务记录
              </button>
            </div>
            
            {loadingPayments ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : paymentRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CircleDollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无缴费记录</p>
                <p className="text-sm mt-2">该学生目前没有缴费记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentRecords.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium dark:text-white">
                            {payment.service_type?.name || payment.category?.name || '其他费用'}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            payment.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            payment.status === '待收款' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            payment.status === '已取消' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ¥{payment.amount.toLocaleString()}
                          </span>
                          {payment.transaction_date && (
                            <span className="text-gray-500 dark:text-gray-400">
                              缴费日期: {formatDate(payment.transaction_date)}
                            </span>
                          )}
                        </div>
                        {payment.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 申请文件 - 从申请材料清单获取数据，只显示学生上传的申请文件 */}
        {activeTab === '申请文件' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">申请文件</h3>
              <div className="flex gap-2">
                {student.businessLines.includes('study_application') && (
                  <button
                    onClick={() => navigate(`/admin/applications/${student.id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    申请材料清单
                  </button>
                )}
                <button
                  onClick={() => navigate(`/admin/cloud-docs?studentId=${student.id}`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  云文档
                </button>
              </div>
            </div>
            
            {loadingDocuments ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : applicationDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无申请文件</p>
                <p className="text-sm mt-2">该学生目前没有已上传的申请文件</p>
                {student.businessLines.includes('study_application') && (
                  <button
                    onClick={() => navigate(`/admin/applications/${student.id}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    前往申请材料清单
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {applicationDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium dark:text-white">{doc.document_name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            doc.status === '已完成' || doc.status === '已提交' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            doc.status === '进行中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            doc.status === '未完成' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {doc.status || '未完成'}
                          </span>
                          {doc.is_required && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                              必需
                            </span>
                          )}
                        </div>
                        {doc.document_type && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            类型: {doc.document_type}
                          </p>
                        )}
                        {doc.progress !== null && doc.progress !== undefined && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span>进度</span>
                              <span>{doc.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${doc.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {doc.due_date && (
                            <span>截止日期: {formatDate(doc.due_date)}</span>
                          )}
                          {doc.completed_date && (
                            <span>完成日期: {formatDate(doc.completed_date)}</span>
                          )}
                        </div>
                        {doc.file_url && (
                          <div className="mt-2">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              查看文件 →
                            </a>
                          </div>
                        )}
                        {doc.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{doc.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 文档列表 - 从云文档表获取数据 */}
        {activeTab === '文档列表' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">文档列表</h3>
              <button
                onClick={() => navigate(`/admin/cloud-docs?studentId=${student.id}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                查看完整文档
              </button>
            </div>
            
            {loadingCloudDocuments ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : cloudDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无文档记录</p>
                <p className="text-sm mt-2">该学生目前没有关联的云文档</p>
                <button
                  onClick={() => navigate(`/admin/cloud-docs?studentId=${student.id}`)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  创建文档
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cloudDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/admin/cloud-docs/documents/${doc.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium dark:text-white">{doc.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            doc.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            doc.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {doc.status === 'published' ? '已发布' : doc.status === 'draft' ? '草稿' : '已归档'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {doc.creator && (
                            <span>创建人: {doc.creator.name}</span>
                          )}
                          <span>更新时间: {formatDateTime(doc.updated_at)}</span>
                        </div>
                        {doc.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {doc.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <FileText className="h-5 w-5 text-gray-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 会议记录 - 从学生会议表获取数据 */}
        {activeTab === '会议记录' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">会议记录</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRecurringMeetingModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  创建定期会议
                </button>
                <button
                  onClick={() => navigate(`/admin/meetings?studentId=${student.id}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  查看完整会议记录
                </button>
              </div>
            </div>
            
            {loadingMeetings ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无会议记录</p>
                <p className="text-sm mt-2">该学生目前没有会议记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium dark:text-white">{meeting.title}</h4>
                          {meeting.meeting_type && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                              {meeting.meeting_type}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            meeting.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            meeting.status === '进行中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            meeting.status === '已安排' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            meeting.status === '已取消' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {meeting.status || '已安排'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>开始时间: {formatDateTime(meeting.start_time)}</span>
                          </div>
                          {meeting.end_time && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>结束时间: {formatDateTime(meeting.end_time)}</span>
                            </div>
                          )}
                        </div>
                        {meeting.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{meeting.summary}</p>
                        )}
                        {meeting.participants && meeting.participants.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              参会人: {meeting.participants.join('、')}
                            </span>
                          </div>
                        )}
                        {meeting.meeting_link && (
                          <div className="mt-2">
                            <a
                              href={meeting.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <Video className="h-4 w-4" />
                              会议链接 →
                            </a>
                          </div>
                        )}
                        {meeting.meeting_notes && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">会议笔记:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{meeting.meeting_notes}</p>
                          </div>
                        )}
                        {meeting.meeting_documents && meeting.meeting_documents.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">会议文档:</p>
                            <div className="flex flex-wrap gap-2">
                              {meeting.meeting_documents.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  {doc.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      
      {/* 添加服务模态框 */}
      {showAddServiceModal && student && (
        <AddServiceModal
          isOpen={showAddServiceModal}
          onClose={() => setShowAddServiceModal(false)}
          onServiceAdded={async () => {
            await refreshStudents();
            setShowAddServiceModal(false);
          }}
          studentId={parseInt(student.id)}
          existingServiceTypeIds={[]} // AddServiceModal内部会处理已存在的服务
        />
      )}

      {/* 创建定期会议模态框 */}
      {showRecurringMeetingModal && student && (
        <CreateRecurringMeetingModal
          onClose={() => setShowRecurringMeetingModal(false)}
          onSave={handleCreateRecurringMeeting}
          initialStudentId={parseInt(student.id)}
        />
      )}

    </div>
  );
};

export default StudentDetailPage; 