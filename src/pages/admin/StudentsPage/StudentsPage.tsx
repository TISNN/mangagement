import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, UserPlus, FileCheck, Download, SlidersHorizontal, PenTool, Layers, Book, BookOpen, Languages, Award, Briefcase, FileText, FileSpreadsheet, Users, Calendar, Edit, Trash2, AlertCircle, Mail, GraduationCap, MoreVertical, Grid3x3, List, PlayCircle, Clock, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { peopleService } from '../../../services'; // 导入peopleService
import { exportStudentsToCSV, exportStudentsDetailToCSV, downloadCSV } from '../../../utils/export';
import StudentAddModal from '../../../components/StudentAddModal';
import { ServiceType } from '../../../types/service';
import { formatDate } from '../../../utils/dateUtils';
import { useDataContext } from '../../../context/DataContext'; // 导入数据上下文

// 用于显示的学生数据类型
export interface StudentDisplay {
  id: string;
  person_id: number; // 关联的person_id
  name: string;
  email: string;
  avatar: string;
  enrollmentDate: string;
  status: string;
  // 添加学生档案字段
  school?: string;
  education_level?: string;
  major?: string;
  graduation_year?: number;
  // 新增字段
  location?: string; // 所在地区
  address?: string;  // 详细地址
  contact?: string;  // 联系电话
  services: {
    id: string;
    serviceType: ServiceType;
    standardizedTestType?: string;
    status: string;
    enrollmentDate: string;
    endDate?: string;
    mentors: {
      id: string;
      name: string;
      avatar: string;
      roles: string[];
      isPrimary?: boolean;
    }[];
  }[];
}


// 确认删除对话框组件
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ isOpen, studentName, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full dark:bg-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold dark:text-white">确认删除</h3>
        </div>
        <p className="text-gray-600 mb-6 dark:text-gray-300">
          您确定要删除学生 <span className="font-semibold">{studentName}</span> 吗？此操作无法撤销，该学生的所有相关数据将被永久删除。
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

function StudentsPage() {
  const navigate = useNavigate();
  
  // 使用DataContext获取学生数据
  const { students, loadingStudents: loading, refreshStudents } = useDataContext();
  
  // 状态
  const [activeTab, setActiveTab] = useState<string>('全部学生');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | '全部'>('全部');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  
  // 新增状态 - 用于编辑和删除
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  
  // 视图模式切换: 'card' 或 'table'
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // 点击编辑按钮
  const handleEditClick = (e: React.MouseEvent, student: StudentDisplay) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发行点击事件
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  // 点击删除按钮
  const handleDeleteClick = (e: React.MouseEvent, student: StudentDisplay) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发行点击事件
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  // 确认删除学生
  const confirmDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      // 首先删除学生关联的服务
      for (const service of selectedStudent.services) {
        await peopleService.deleteStudentService(parseInt(service.id));
      }
      
      // 删除学生
      await peopleService.deleteStudent(parseInt(selectedStudent.id));
      
      // 刷新学生列表 - 现在使用DataContext来刷新
      await refreshStudents();
      
      // 关闭确认对话框
      setShowDeleteDialog(false);
      setSelectedStudent(null);
      
      // 添加成功通知或提示
      alert('学生删除成功');
    } catch (error) {
      console.error('删除学生失败:', error);
      alert('删除学生失败，请重试');
    }
  };

  // 处理编辑完成 - 使用DataContext刷新数据
  const handleStudentEdited = async () => {
    await refreshStudents();
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  // 过滤学生数据
  const filteredStudents = students.filter(student => {
    // 搜索条件
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 状态筛选
    const matchesStatus = selectedStatus === '全部' || student.status === selectedStatus;
    
    // 服务类型筛选
    const matchesServiceType = selectedServiceType === '全部' || 
      student.services.some(service => service.serviceType === selectedServiceType);
    
    // 标签页筛选
    const matchesTab = activeTab === '全部学生' || 
      (activeTab === '活跃' && student.status === '活跃') ||
      (activeTab === '休学' && student.status === '休学') ||
      (activeTab === '毕业' && student.status === '毕业') ||
      (activeTab === '退学' && student.status === '退学');
    
    return matchesSearch && matchesStatus && matchesServiceType && matchesTab;
  });

  // 服务类型图标映射
  const serviceIcons = {
    '语言培训': <Languages className="h-4 w-4" />,
    '标化培训': <BookOpen className="h-4 w-4" />,
    '全包申请': <Briefcase className="h-4 w-4" />,
    '半DIY申请': <Layers className="h-4 w-4" />,
    '研学': <Award className="h-4 w-4" />,
    '课业辅导': <Book className="h-4 w-4" />,
    '科研指导': <FileCheck className="h-4 w-4" />,
    '作品集辅导': <PenTool className="h-4 w-4" />
  };

  // 获取状态样式类
  const getStatusClass = (status: string) => {
    switch (status) {
      case '活跃':
      case '进行中':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case '休学':
      case '已暂停':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case '毕业':
      case '已完成':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case '退学':
      case '已取消':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // 处理点击学生行
  const handleStudentClick = (studentId: string) => {
    navigate(`/admin/students/${studentId}`);
  };

  // 处理导出
  const handleExport = (type: 'simple' | 'detailed') => {
    setExportLoading(true);
    
    try {
      if (type === 'simple') {
        const csvContent = exportStudentsToCSV(filteredStudents);
        downloadCSV(csvContent, `学生信息_${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        const { studentCsv, serviceCsv } = exportStudentsDetailToCSV(filteredStudents);
        downloadCSV(studentCsv, `学生基本信息_${new Date().toISOString().split('T')[0]}.csv`);
        setTimeout(() => {
          downloadCSV(serviceCsv, `学生服务信息_${new Date().toISOString().split('T')[0]}.csv`);
        }, 500); // 延迟500ms下载第二个文件
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  // 处理添加学生完成 - 使用DataContext刷新数据
  const handleStudentAdded = () => {
    refreshStudents();
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
        <h1 className="text-2xl font-bold dark:text-white">学生管理</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">查看和管理所有学生信息</p>
        </div>
        <div className="flex flex-wrap gap-3">
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
          
          {/* 视图切换按钮 */}
          <div className="flex bg-gray-100 rounded-xl p-1 dark:bg-gray-700">
            <button 
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'card' 
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
              卡片
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'table' 
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
              列表
            </button>
          </div>
          
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={`${filterOpen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'} px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            筛选
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exportLoading}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  导出中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  导出
                </>
              )}
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <button
                    onClick={() => handleExport('simple')}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>导出基础信息</span>
                  </button>
                  <button
                    onClick={() => handleExport('detailed')}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                    <span>导出详细信息</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            添加学生
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {filterOpen && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">学生状态</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="全部">全部状态</option>
                <option value="活跃">活跃</option>
                <option value="休学">休学</option>
                <option value="毕业">毕业</option>
                <option value="退学">退学</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">服务类型</label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value as ServiceType | '全部')}
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="全部">全部服务</option>
                <option value="语言培训">语言培训</option>
                <option value="标化培训">标化培训</option>
                <option value="全包申请">全包申请</option>
                <option value="半DIY申请">半DIY申请</option>
                <option value="研学">研学</option>
                <option value="课业辅导">课业辅导</option>
                <option value="科研指导">科研指导</option>
                <option value="作品集辅导">作品集辅导</option>
              </select>
              </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('全部');
                  setSelectedServiceType('全部');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                重置筛选
              </button>
            </div>
          </div>
      </div>
      )}

      {/* 标签页 */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 gap-2">
        {['全部学生', '活跃', '休学', '毕业', '退学'].map((tab) => (
              <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-xl mb-2 ${
              activeTab === tab ? 
              'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">总学生数</h3>
            <span className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center dark:bg-blue-900/20">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{students.length}</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            实时数据同步
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">活跃学生</h3>
            <span className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center dark:bg-green-900/20">
              <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">
            {students.filter(s => s.status === '活跃').length}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            占总学生 {students.length > 0 ? Math.round(students.filter(s => s.status === '活跃').length / students.length * 100) : 0}%
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">服务总数</h3>
            <span className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center dark:bg-purple-900/20">
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">
            {students.reduce((total, student) => total + student.services.length, 0)}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            平均每人 {students.length > 0 ? (students.reduce((total, student) => total + student.services.length, 0) / students.length).toFixed(1) : 0} 项服务
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">进行中服务</h3>
            <span className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center dark:bg-yellow-900/20">
              <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">
            {students.reduce((total, student) => 
              total + student.services.filter(s => s.status === '进行中').length, 0
            )}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            占总服务 {students.reduce((total, student) => total + student.services.length, 0) > 0 ? 
            Math.round(students.reduce((total, student) => total + student.services.filter(s => s.status === '进行中').length, 0) / 
            students.reduce((total, student) => total + student.services.length, 0) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 学生列表 - 卡片视图 */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                onClick={() => handleStudentClick(student.id)}
              >
                {/* 卡片头部 - 学生基本信息 */}
                <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          className="h-16 w-16 rounded-2xl ring-4 ring-white dark:ring-gray-700 shadow-lg" 
                          src={student.avatar} 
                          alt={student.name} 
                        />
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-700 ${
                          student.status === '活跃' ? 'bg-green-500' : 
                          student.status === '休学' ? 'bg-yellow-500' : 
                          student.status === '毕业' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 下拉菜单按钮 */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* 状态标签 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(student.status)}`}>
                      {student.status}
                    </span>
                    {student.school && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/70 dark:bg-gray-700/70 rounded-full text-xs text-gray-700 dark:text-gray-300">
                        <GraduationCap className="h-3 w-3" />
                        {student.school}
                      </span>
                    )}
                    {student.major && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-purple-50/70 dark:bg-purple-900/20 rounded-full text-xs text-purple-700 dark:text-purple-300">
                        <BookMarked className="h-3 w-3" />
                        {student.major}
                      </span>
                    )}
                  </div>
                </div>

                {/* 卡片主体 - 服务信息 */}
                <div className="p-6 pt-4 space-y-4 flex-1 flex flex-col">
                  {/* 服务列表 */}
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">服务项目</h4>
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                      {student.services.map((service) => (
                        <div 
                          key={service.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            service.status === '进行中' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {serviceIcons[service.serviceType as keyof typeof serviceIcons] || <FileCheck className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {service.serviceType}
                              {service.standardizedTestType && ` (${service.standardizedTestType})`}
                            </span>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <PlayCircle className="h-3.5 w-3.5 text-gray-400" />
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(service.status)}`}>
                                  {service.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(service.enrollmentDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {student.services.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">暂无服务项目</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 导师信息 */}
                  {student.services.some(s => s.mentors.length > 0) && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">导师团队</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {Array.from(new Set(student.services.flatMap(s => s.mentors))).slice(0, 4).map((mentor, idx) => (
                            <img 
                              key={idx}
                              src={mentor.avatar} 
                              alt={mentor.name}
                              title={`${mentor.name} (${mentor.roles.join(', ')})`}
                              className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                        {Array.from(new Set(student.services.flatMap(s => s.mentors))).length > 4 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
                            +{Array.from(new Set(student.services.flatMap(s => s.mentors))).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 卡片底部 - 操作和时间 */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    入学 {formatDate(student.enrollmentDate)}
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleEditClick(e, student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                      title="编辑学生"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(e, student)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      title="删除学生"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <UserPlus className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">没有找到符合条件的学生</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                添加学生
              </button>
            </div>
          )}
        </div>
      ) : (
        // 表格视图（保留原有设计）
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  学生
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  服务
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  入学时间
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  操作
                </th>
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700/50"
                    onClick={() => handleStudentClick(student.id)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img className="h-12 w-12 rounded-xl" src={student.avatar} alt={student.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                          {(student.school || student.major) && (
                            <div className="flex items-center gap-2 mt-1">
                              {student.school && (
                                <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                  <GraduationCap className="h-3 w-3" />
                                  {student.school}
                                </span>
                              )}
                              {student.major && (
                                <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                                  <BookMarked className="h-3 w-3" />
                                  {student.major}
                                </span>
                              )}
                            </div>
                          )}
                    </div>
                  </div>
                </td>
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        {student.services.map((service) => (
                          <div 
                            key={service.id}
                            className="px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-3 dark:bg-gray-700/50"
                          >
                            <div className={`p-2 rounded-lg flex-shrink-0 ${service.status === '进行中' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                              {serviceIcons[service.serviceType as keyof typeof serviceIcons] || <FileCheck className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                                <span className="break-words">
                                  {service.serviceType}
                                  {service.standardizedTestType && ` (${service.standardizedTestType})`}
                                </span>
                                  <div className="flex items-center gap-1">
                                    <PlayCircle className="h-3.5 w-3.5 text-gray-400" />
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(service.status)}`}>
                                      {service.status}
                                    </span>
                                  </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-normal">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{formatDate(service.enrollmentDate)}</span>
                                </div>
                              </div>
                              
                              {service.mentors.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {service.mentors.map((mentor, idx) => (
                                    <img 
                                      key={idx}
                                      src={mentor.avatar} 
                                      alt={mentor.name}
                                      title={`${mentor.name} (${mentor.roles.join(', ')})`}
                                      className={`h-6 w-6 rounded-full ${mentor.isPrimary ? 'ring-2 ring-blue-500' : ''}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusClass(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(student.enrollmentDate)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => handleEditClick(e, student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="编辑学生"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, student)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                          title="删除学生"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <UserPlus className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                      <p>没有找到符合条件的学生</p>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        添加学生
                  </button>
                    </div>
                </td>
              </tr>
              )}
          </tbody>
        </table>
        </div>
        
        {/* 分页 */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between dark:bg-gray-700/50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              上一页
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredStudents.length}</span> 条，共 <span className="font-medium">{filteredStudents.length}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-lg overflow-hidden" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                  <span className="sr-only">上一页</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
                <button className="relative inline-flex items-center px-4 py-2 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                  <span className="sr-only">下一页</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 添加学生模态框 */}
      <StudentAddModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStudentAdded={handleStudentAdded}
      />

      {/* 编辑学生模态框 - 可能需要创建新组件或重用添加模态框 */}
      {showEditModal && selectedStudent && (
        <StudentAddModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          onStudentAdded={handleStudentEdited}
          studentToEdit={selectedStudent}
        />
      )}

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog 
        isOpen={showDeleteDialog}
        studentName={selectedStudent?.name || ''}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedStudent(null);
        }}
        onConfirm={confirmDeleteStudent}
      />
    </div>
  );
}

export default StudentsPage; 