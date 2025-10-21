import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Briefcase,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  ListFilter,
  ArrowUpDown,
  Building2,
  Crown
} from 'lucide-react';
import { employeeService, Employee } from '../../services/employeeService';
import { departmentOptions, statusOptions, employeeTypeOptions, getStatusText, getStatusStyle } from '../../utils/constants';

const EmployeeManagementPage: React.FC = () => {
  // 状态管理
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从数据库加载员工数据
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error('获取员工数据失败:', err);
        setError('加载员工数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 处理员工删除
  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeeService.deleteEmployee(id);
      // 从本地状态中移除已删除的员工
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      console.error('删除员工失败:', err);
      alert('删除员工失败，请稍后重试');
    }
  };

  // 处理员工详情查看
  const handleViewEmployeeDetail = (id: string) => {
    navigate(`/admin/employees/${id}`);
  };

  // 过滤员工
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    const matchesEmployeeType = selectedEmployeeType === 'all' || 
                               (selectedEmployeeType === 'partner' && employee.is_partner) ||
                               (selectedEmployeeType === 'employee' && !employee.is_partner);
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesEmployeeType;
  });

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">员工管理</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>导入</span>
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>导出</span>
          </button>
          <button 
            onClick={() => navigate('/admin/employees/new')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>添加员工</span>
          </button>
        </div>
      </div>

      {/* 显示加载状态或错误 */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white"
          >
            重试
          </button>
        </div>
      ) : (
        <>
      {/* 合伙人展示区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold dark:text-white">公司合伙人</h2>
        </div>
            {employees.filter(emp => emp.is_partner).length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">暂无合伙人数据</p>
            ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employees.filter(emp => emp.is_partner).map(partner => (
            <div key={partner.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={partner.avatar_url} 
                  alt={partner.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                        }}
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
              </div>
              <h3 className="font-semibold text-xl mt-4 dark:text-white">{partner.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">{partner.position}</p>
              
              <div className="w-full mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.location}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{partner.email}</span>
                </div>
                {partner.phone && (
                  <div className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{partner.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-around">
                <button 
                  onClick={() => window.location.href = `mailto:${partner.email}`}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                  title="发送邮件"
                >
                  <Mail className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => window.location.href = `tel:${partner.phone}`}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                  title="拨打电话"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleViewEmployeeDetail(partner.id)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full"
                  title="查看详情"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
            )}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="搜索员工姓名、职位或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`px-4 py-2 rounded-lg border text-gray-700 dark:text-gray-300 flex items-center gap-2 ${isFilterOpen ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
          >
            <Filter className="h-4 w-4" />
            <span>筛选</span>
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span>排序</span>
          </button>
        </div>
      </div>

      {/* 筛选选项 */}
      {isFilterOpen && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">部门</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {departmentOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">状态</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">员工类型</label>
                <select
                  value={selectedEmployeeType}
                  onChange={(e) => setSelectedEmployeeType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {employeeTypeOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
        </div>
      )}

      {/* 员工列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">未找到员工</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              没有找到符合当前筛选条件的员工。尝试调整筛选条件或清除搜索关键词。
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
                setSelectedStatus('all');
                    setSelectedEmployeeType('all');
              }}
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={employee.avatar_url}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(employee.status)}`}>
                      {getStatusText(employee.status)}
                    </span>
                        {employee.is_partner && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                            合伙人
                          </span>
                        )}
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{getDepartmentText(employee.department)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-gray-400" />
                        <span>入职日期: {formatDate(employee.join_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{employee.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {employee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">项目</p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{employee.projects}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">任务完成率</p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {calculateTaskCompletionPercentage(employee)}%
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => handleViewEmployeeDetail(employee.id)}
                    className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
                    className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`确定要删除员工 ${employee.name} 吗？此操作无法撤销。`)) {
                        handleDeleteEmployee(employee.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default EmployeeManagementPage; 