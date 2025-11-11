import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  PieChart, 
  Award, 
  BarChart3,
  Edit3,
  Trash2,
  UserCheck,
  LucideIcon,
  FileText,
  Landmark,
  GraduationCap,
  Users,
  Crown,
  Clock
} from 'lucide-react';
import { employeeService, Employee } from '../../services/employeeService';
import { departmentOptions } from '../../utils/constants';

// 标签组件接口
interface TagProps {
  text: string;
  color: string;
}

// 标签组件
const Tag: React.FC<TagProps> = ({ text, color }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
    {text}
  </span>
);

// 信息项组件接口
interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
}

// 信息项组件
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// 员工详情页组件
const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取员工详情
  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
        setError(null);
      } catch (err) {
        console.error('获取员工详情失败:', err);
        setError('加载员工详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  // 处理删除员工
  const handleDeleteEmployee = async () => {
    if (!employee) return;
    
    if (window.confirm(`确定要删除员工 ${employee.name} 吗？此操作无法撤销。`)) {
      try {
        await employeeService.deleteEmployee(employee.id);
        navigate('/admin/internal-management/employee-and-scheduling');
      } catch (err) {
        console.error('删除员工失败:', err);
        alert('删除员工失败，请稍后重试');
      }
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resigned':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '在职';
      case 'on_leave':
        return '休假中';
      case 'resigned':
        return '已离职';
      default:
        return status;
    }
  };

  // 获取部门文本
  const getDepartmentText = (departmentId: string) => {
    const department = departmentOptions.find(dep => dep.id === departmentId);
    return department ? department.name : departmentId;
  };

  // 计算任务完成百分比
  const calculateTaskCompletionPercentage = (employee: Employee) => {
    if (!employee.tasks || employee.tasks.total === 0) return 0;
    return Math.round((employee.tasks.completed / employee.tasks.total) * 100);
  };

  // 显示日期格式
  const formatDate = (dateString: string) => {
    if (!dateString) return '未设置';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error || '未找到员工数据'}</p>
          <button 
            onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}
            className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white"
          >
            返回员工列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/internal-management/employee-and-scheduling')}
            className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">员工详情</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>编辑</span>
          </button>
          <button 
            onClick={handleDeleteEmployee}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>删除</span>
          </button>
        </div>
      </div>

      {/* 员工基本信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧头像和基本信息 */}
          <div className="flex flex-col items-center text-center md:w-1/4">
            <div className="relative">
              <img 
                src={employee.avatar_url} 
                alt={employee.name} 
                className="w-32 h-32 rounded-full object-cover border-2 border-purple-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                }}
              />
              <span className={`absolute bottom-2 right-2 w-5 h-5 ${employee.status === 'active' ? 'bg-green-500' : employee.status === 'on_leave' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full border-2 border-white dark:border-gray-800`}></span>
            </div>
            <h2 className="font-semibold text-xl mt-4 dark:text-white">{employee.name}</h2>
            <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">{employee.position}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Tag 
                text={getStatusText(employee.status)} 
                color={getStatusStyle(employee.status)} 
              />
              
              {employee.is_partner && (
                <Tag 
                  text="合伙人" 
                  color="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" 
                />
              )}
            </div>
            
            <div className="w-full flex justify-center gap-4 mt-6">
              <button 
                onClick={() => window.location.href = `mailto:${employee.email}`}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                title="发送邮件"
              >
                <Mail className="h-5 w-5" />
              </button>
              {employee.phone && (
                <button 
                  onClick={() => window.location.href = `tel:${employee.phone}`}
                  className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                  title="拨打电话"
                >
                  <Phone className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* 右侧详细信息 */}
          <div className="md:w-3/4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">个人信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem 
                icon={Mail} 
                label="电子邮箱" 
                value={employee.email}
              />
              <InfoItem 
                icon={Phone} 
                label="联系电话" 
                value={employee.phone || '未设置'}
              />
              <InfoItem 
                icon={MapPin} 
                label="所在地区" 
                value={employee.location || '未设置'}
              />
              <InfoItem 
                icon={Briefcase} 
                label="所属部门" 
                value={getDepartmentText(employee.department) || '未设置'}
              />

              <InfoItem 
                icon={Clock} 
                label="工作状态" 
                value={
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </span>
                }
              />
              {employee.is_partner && (
                <InfoItem 
                  icon={Crown} 
                  label="合伙人身份" 
                  value={
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                      合伙人
                    </span>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 工作信息和技能 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 工作信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            <span>工作概况</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">任务完成率</p>
                <p className="text-gray-900 dark:text-white font-semibold">{calculateTaskCompletionPercentage(employee)}%</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateTaskCompletionPercentage(employee)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>已完成: {employee.tasks.completed}</span>
                <span>总任务: {employee.tasks.total}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">参与项目数</p>
                  <p className="font-medium text-gray-900 dark:text-white">{employee.projects || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 技能 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span>专业技能</span>
          </h3>
          
          {employee.skills && employee.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无技能数据</p>
          )}
        </div>
      </div>
      
      {/* 其他信息 - 可根据需要扩展 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <span>更多信息</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-col items-center">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">团队协作</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">优秀</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-col items-center">
            <GraduationCap className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">培训次数</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-col items-center">
            <Landmark className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">司龄</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">2年</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage; 