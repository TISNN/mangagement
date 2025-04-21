import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Star,
  Edit,
  Trash2,
  ArrowUpDown,
  Check,
  X,
  Info,
  Target,
  Shield,
  DollarSign,
  BarChart,
  FileText,
  Save,
  History,
  ChevronRight,
  ArrowLeft,
  Filter,
  Search,
  Plus
} from 'lucide-react';

// 学校类型定义
interface School {
  id: string;
  name: string;
  country: string;
  ranking: number;
  program: string;
  deadline: string;
  tuition: string;
  acceptance_rate: string;
  status: 'dream' | 'target' | 'safety';
  notes: string;
  priority: number;
}

// 选校记录类型定义
interface SelectionRecord {
  id: string;
  date: string;
  schools: School[];
  notes: string;
}

const SchoolSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SelectionRecord | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof School | '';
    direction: 'ascending' | 'descending';
  }>({ key: '', direction: 'ascending' });
  const [filters, setFilters] = useState({
    status: [] as School['status'][],
    countries: [] as string[]
  });

  // 模拟数据 - 当前选校列表
  const [currentSchools, setCurrentSchools] = useState<School[]>([
    {
      id: "1",
      name: "Stanford University",
      country: "美国",
      ranking: 2,
      program: "Computer Science",
      deadline: "2024-12-01",
      tuition: "$58,000/年",
      acceptance_rate: "4%",
      status: "dream",
      notes: "需要准备强有力的个人陈述和推荐信",
      priority: 1
    },
    {
      id: "2",
      name: "University of California, Berkeley",
      country: "美国",
      ranking: 4,
      program: "Computer Science",
      deadline: "2024-12-15",
      tuition: "$44,000/年",
      acceptance_rate: "16%",
      status: "target",
      notes: "需要GRE成绩，重点准备研究计划",
      priority: 2
    },
    {
      id: "3",
      name: "Carnegie Mellon University",
      country: "美国",
      ranking: 3,
      program: "Computer Science",
      deadline: "2024-12-10",
      tuition: "$52,000/年",
      acceptance_rate: "7%",
      status: "dream",
      notes: "强调项目经验和技术能力",
      priority: 3
    },
    {
      id: "4",
      name: "University of Michigan",
      country: "美国",
      ranking: 23,
      program: "Computer Science",
      deadline: "2025-01-15",
      tuition: "$55,000/年",
      acceptance_rate: "23%",
      status: "target",
      notes: "需要准备详细的研究计划",
      priority: 4
    },
    {
      id: "5",
      name: "University of Washington",
      country: "美国",
      ranking: 18,
      program: "Computer Science",
      deadline: "2025-01-05",
      tuition: "$39,000/年",
      acceptance_rate: "21%",
      status: "safety",
      notes: "强调实习经验和项目成果",
      priority: 5
    },
    {
      id: "6",
      name: "University of Toronto",
      country: "加拿大",
      ranking: 26,
      program: "Computer Science",
      deadline: "2025-01-20",
      tuition: "CAD $58,000/年",
      acceptance_rate: "25%",
      status: "safety",
      notes: "需要准备研究计划和个人陈述",
      priority: 6
    }
  ]);

  // 模拟数据 - 历史选校记录
  const [selectionHistory, setSelectionHistory] = useState<SelectionRecord[]>([
    {
      id: "1",
      date: "2024-05-01",
      schools: [
        {
          id: "1",
          name: "Stanford University",
          country: "美国",
          ranking: 2,
          program: "Computer Science",
          deadline: "2024-12-01",
          tuition: "$58,000/年",
          acceptance_rate: "4%",
          status: "dream",
          notes: "需要准备强有力的个人陈述和推荐信",
          priority: 1
        },
        {
          id: "2",
          name: "University of California, Berkeley",
          country: "美国",
          ranking: 4,
          program: "Computer Science",
          deadline: "2024-12-15",
          tuition: "$44,000/年",
          acceptance_rate: "16%",
          status: "target",
          notes: "需要GRE成绩，重点准备研究计划",
          priority: 2
        },
        {
          id: "3",
          name: "Carnegie Mellon University",
          country: "美国",
          ranking: 3,
          program: "Computer Science",
          deadline: "2024-12-10",
          tuition: "$52,000/年",
          acceptance_rate: "7%",
          status: "dream",
          notes: "强调项目经验和技术能力",
          priority: 3
        }
      ],
      notes: "初步选校，重点考虑计算机科学排名前10的学校"
    },
    {
      id: "2",
      date: "2024-06-15",
      schools: [
        {
          id: "1",
          name: "Stanford University",
          country: "美国",
          ranking: 2,
          program: "Computer Science",
          deadline: "2024-12-01",
          tuition: "$58,000/年",
          acceptance_rate: "4%",
          status: "dream",
          notes: "需要准备强有力的个人陈述和推荐信",
          priority: 1
        },
        {
          id: "2",
          name: "University of California, Berkeley",
          country: "美国",
          ranking: 4,
          program: "Computer Science",
          deadline: "2024-12-15",
          tuition: "$44,000/年",
          acceptance_rate: "16%",
          status: "target",
          notes: "需要GRE成绩，重点准备研究计划",
          priority: 2
        },
        {
          id: "3",
          name: "Carnegie Mellon University",
          country: "美国",
          ranking: 3,
          program: "Computer Science",
          deadline: "2024-12-10",
          tuition: "$52,000/年",
          acceptance_rate: "7%",
          status: "dream",
          notes: "强调项目经验和技术能力",
          priority: 3
        },
        {
          id: "4",
          name: "University of Michigan",
          country: "美国",
          ranking: 23,
          program: "Computer Science",
          deadline: "2025-01-15",
          tuition: "$55,000/年",
          acceptance_rate: "23%",
          status: "target",
          notes: "需要准备详细的研究计划",
          priority: 4
        },
        {
          id: "5",
          name: "University of Washington",
          country: "美国",
          ranking: 18,
          program: "Computer Science",
          deadline: "2025-01-05",
          tuition: "$39,000/年",
          acceptance_rate: "21%",
          status: "safety",
          notes: "强调实习经验和项目成果",
          priority: 5
        }
      ],
      notes: "增加了两所保底学校，确保申请策略更加全面"
    }
  ]);

  // 排序函数
  const requestSort = (key: keyof School) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  // 排序后的学校列表
  const sortedSchools = React.useMemo(() => {
    const schools = [...currentSchools];
    if (sortConfig.key !== '') {
      schools.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return schools;
  }, [currentSchools, sortConfig]);

  // 过滤函数
  const filteredSchools = React.useMemo(() => {
    if (!searchQuery) return sortedSchools;
    return sortedSchools.filter(
      school => 
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedSchools, searchQuery]);

  // 保存当前选校为历史记录
  const saveCurrentSelectionAsHistory = () => {
    const newRecord: SelectionRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      schools: [...currentSchools],
      notes: ""
    };
    setSelectionHistory([newRecord, ...selectionHistory]);
    alert("当前选校已保存到历史记录中！");
  };

  // 恢复历史选校记录
  const restoreSelectionRecord = (record: SelectionRecord) => {
    setCurrentSchools([...record.schools]);
    setShowHistoryModal(false);
  };

  // 获取状态标签样式
  const getStatusStyle = (status: School['status']) => {
    switch (status) {
      case 'dream':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'target':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'safety':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 获取状态中文名称
  const getStatusName = (status: School['status']) => {
    switch (status) {
      case 'dream':
        return '梦想校';
      case 'target':
        return '目标校';
      case 'safety':
        return '保底校';
      default:
        return '未分类';
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/school-assistant')}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">选校管理</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-4 py-2 flex items-center gap-1 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <History className="h-4 w-4" />
            历史记录
          </button>
          
          <button
            onClick={() => saveCurrentSelectionAsHistory()}
            className="px-4 py-2 flex items-center gap-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <Save className="h-4 w-4" />
            保存当前选校
          </button>
        </div>
      </div>

      {/* 选校概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '总申请学校',
            value: currentSchools.length.toString(),
            icon: GraduationCap,
            color: 'blue'
          },
          {
            title: '梦想学校',
            value: currentSchools.filter(s => s.status === 'dream').length.toString(),
            icon: Star,
            color: 'purple'
          },
          {
            title: '目标学校',
            value: currentSchools.filter(s => s.status === 'target').length.toString(),
            icon: Target,
            color: 'blue'
          },
          {
            title: '保底学校',
            value: currentSchools.filter(s => s.status === 'safety').length.toString(),
            icon: Shield,
            color: 'green'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 学校列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">当前选校列表</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>总计: {filteredSchools.length} 所学校</span>
          </div>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('priority')}
                  >
                    优先级
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('name')}
                  >
                    学校名称
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('program')}
                  >
                    申请专业
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('ranking')}
                  >
                    排名
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('deadline')}
                  >
                    截止日期
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => requestSort('status')}
                  >
                    类型
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school, index) => (
                <tr 
                  key={school.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {school.priority}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium dark:text-white">{school.name}</span>
                      <span className="text-xs text-gray-500">{school.country}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {school.program}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {school.ranking}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(school.deadline).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(school.status)}`}>
                      {getStatusName(school.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchools.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">没有找到匹配的学校</p>
          </div>
        )}
      </div>

      {/* 历史记录模态框 */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">选校历史记录</h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {selectionHistory.map((record) => (
                <div 
                  key={record.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium dark:text-white">记录 #{record.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        保存日期: {new Date(record.date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <button
                      onClick={() => restoreSelectionRecord(record)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
                    >
                      恢复此记录
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {record.notes}
                  </p>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    包含 {record.schools.length} 所学校:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {record.schools.map((school) => (
                      <div 
                        key={school.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          school.status === 'dream' ? 'bg-purple-500' :
                          school.status === 'target' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <span className="font-medium dark:text-white">{school.name}</span>
                        <span className="text-xs text-gray-500">({school.program})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchoolSelectionPage; 