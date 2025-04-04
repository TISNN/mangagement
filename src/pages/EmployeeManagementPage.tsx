import React, { useState } from 'react';
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

// 员工类型定义
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on_leave' | 'resigned' | 'partner';
  avatar: string;
  joinDate: string;
  location: string;
  skills: string[];
  projects: number;
  tasks: {
    total: number;
    completed: number;
  };
  isPartner?: boolean;
}

const EmployeeManagementPage: React.FC = () => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 部门选项
  const departmentOptions = [
    { id: 'all', name: '全部部门' },
    { id: 'marketing', name: '市场部' },
    { id: 'development', name: '研发部' },
    { id: 'design', name: '设计部' },
    { id: 'hr', name: '人力资源部' },
    { id: 'sales', name: '销售部' },
  ];

  // 状态选项
  const statusOptions = [
    { id: 'all', name: '全部状态' },
    { id: 'active', name: '在职' },
    { id: 'on_leave', name: '休假中' },
    { id: 'resigned', name: '已离职' },
  ];

  // 模拟员工数据
  const employees: Employee[] = [
    {
      id: "1",
      name: "李志强",
      position: "创始人兼CEO",
      department: "管理层",
      email: "zhiqiang@company.com",
      phone: "138-0000-0001",
      status: "partner",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      joinDate: "2018-03-15",
      location: "珠海",
      skills: ["战略规划", "业务拓展", "团队管理"],
      projects: 12,
      tasks: {
        total: 25,
        completed: 21
      },
      isPartner: true
    },
    {
      id: "2",
      name: "王文静",
      position: "联合创始人兼COO",
      department: "管理层",
      email: "wenjing@company.com",
      phone: "138-0000-0002",
      status: "partner",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      joinDate: "2018-03-15",
      location: "珠海",
      skills: ["运营管理", "流程优化", "客户关系"],
      projects: 10,
      tasks: {
        total: 22,
        completed: 19
      },
      isPartner: true
    },
    {
      id: "3",
      name: "张德国",
      position: "国际业务总监",
      department: "国际部",
      email: "deguo@company.com",
      phone: "138-0000-0003",
      status: "partner",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      joinDate: "2019-06-20",
      location: "柏林",
      skills: ["国际教育", "德语", "英语", "市场开发"],
      projects: 8,
      tasks: {
        total: 18,
        completed: 15
      },
      isPartner: true
    },
    {
      id: "4",
      name: "陈明月",
      position: "西南区域总监",
      department: "区域管理",
      email: "mingyue@company.com",
      phone: "138-0000-0004",
      status: "partner",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      joinDate: "2020-02-10",
      location: "重庆",
      skills: ["市场策略", "团队建设", "业务谈判"],
      projects: 7,
      tasks: {
        total: 16,
        completed: 13
      },
      isPartner: true
    },
    {
      id: "5",
      name: "张三",
      position: "前端开发工程师",
      department: "研发部",
      email: "zhangsan@company.com",
      phone: "138-0000-0001",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      joinDate: "2022-06-15",
      location: "上海",
      skills: ["React", "TypeScript", "Node.js"],
      projects: 5,
      tasks: {
        total: 12,
        completed: 9
      }
    },
    {
      id: "6",
      name: "李四",
      position: "产品经理",
      department: "市场部",
      email: "lisi@company.com",
      phone: "138-0000-0002",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      joinDate: "2021-04-10",
      location: "北京",
      skills: ["产品设计", "用户研究", "数据分析"],
      projects: 8,
      tasks: {
        total: 15,
        completed: 14
      }
    },
    {
      id: "7",
      name: "王五",
      position: "后端开发工程师",
      department: "研发部",
      email: "wangwu@company.com",
      phone: "138-0000-0003",
      status: "on_leave",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      joinDate: "2023-01-05",
      location: "深圳",
      skills: ["Java", "Spring Boot", "MySQL"],
      projects: 3,
      tasks: {
        total: 10,
        completed: 7
      }
    },
    {
      id: "8",
      name: "赵六",
      position: "UI设计师",
      department: "设计部",
      email: "zhaoliu@company.com",
      phone: "138-0000-0004",
      status: "resigned",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      joinDate: "2022-08-20",
      location: "广州",
      skills: ["UI设计", "用户体验", "Figma"],
      projects: 6,
      tasks: {
        total: 8,
        completed: 6
      }
    }
  ];

  // 过滤员工
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'partner':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
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
      case 'partner':
        return '合伙人';
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
    return department ? department.name : '未知部门';
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
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>添加员工</span>
          </button>
        </div>
      </div>

      {/* 合伙人展示区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold dark:text-white">公司合伙人</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.filter(emp => emp.isPartner).map(partner => (
            <div key={partner.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="relative">
                <img 
                  src={partner.avatar} 
                  alt={partner.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></span>
              </div>
              <h3 className="font-semibold text-lg mt-3 dark:text-white">{partner.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm">{partner.position}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{partner.location}</span>
              </div>
              <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-around">
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Mail className="h-4 w-4" />
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      src={employee.avatar}
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
                    <span>入职日期: {employee.joinDate}</span>
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
                      {Math.round((employee.tasks.completed / employee.tasks.total) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-purple-500 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
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
    </div>
  );
};

export default EmployeeManagementPage; 