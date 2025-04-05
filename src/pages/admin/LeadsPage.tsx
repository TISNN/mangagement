import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Phone, Mail, Clock, ChevronLeft, ChevronRight, MoreVertical, Users, CheckCircle2, AlertCircle, Archive, Star, UserCheck } from 'lucide-react';

interface LeadsPageProps {
  setCurrentPage?: (page: string) => void;
}

// 客户线索类型定义
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  date: string;
  avatar: string;
  lastContact: string;
  interest: string;
  assignedTo: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
}

function LeadsPage({ setCurrentPage }: LeadsPageProps) {
  const [activeTab, setActiveTab] = useState('全部线索');
  const [selectedSource, setSelectedSource] = useState('全部来源');
  const [showFilters, setShowFilters] = useState(false);
  
  // 模拟客户线索数据
  const leads: Lead[] = [
    {
      id: 'L001',
      name: '王小明',
      email: 'xiaoming.wang@example.com',
      phone: '13812345678',
      source: '官网表单',
      status: 'new',
      date: '2023-06-15',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-15',
      interest: '美国本科申请',
      assignedTo: '李顾问',
      notes: '对常青藤名校非常感兴趣，希望了解更多申请要求',
      priority: 'high'
    },
    {
      id: 'L002',
      name: '张月',
      email: 'yue.zhang@example.com',
      phone: '13987654321',
      source: '社交媒体',
      status: 'contacted',
      date: '2023-06-12',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-14',
      interest: '英国硕士申请',
      assignedTo: '王顾问',
      notes: '已电话联系过，对伦敦商学院感兴趣',
      priority: 'medium'
    },
    {
      id: 'L003',
      name: '李强',
      email: 'qiang.li@example.com',
      phone: '13765432198',
      source: '转介绍',
      status: 'qualified',
      date: '2023-06-10',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-13',
      interest: '澳大利亚硕士申请',
      assignedTo: '张顾问',
      notes: '已确认需求，准备进行个人评估',
      priority: 'high'
    },
    {
      id: 'L004',
      name: '赵芳',
      email: 'fang.zhao@example.com',
      phone: '13678901234',
      source: '教育展',
      status: 'converted',
      date: '2023-06-05',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-12',
      interest: '加拿大高中申请',
      assignedTo: '刘顾问',
      notes: '已签约，准备申请材料中',
      priority: 'medium'
    },
    {
      id: 'L005',
      name: '陈明',
      email: 'ming.chen@example.com',
      phone: '13567890123',
      source: '官网表单',
      status: 'closed',
      date: '2023-06-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-10',
      interest: '美国硕士申请',
      assignedTo: '黄顾问',
      notes: '线索已关闭，客户决定推迟申请计划',
      priority: 'low'
    },
    {
      id: 'L006',
      name: '林小红',
      email: 'xiaohong.lin@example.com',
      phone: '13456789012',
      source: '社交媒体',
      status: 'new',
      date: '2023-06-14',
      avatar: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-14',
      interest: '英国本科申请',
      assignedTo: '未分配',
      notes: '通过微博咨询，对牛津剑桥感兴趣',
      priority: 'high'
    },
    {
      id: 'L007',
      name: '黄伟',
      email: 'wei.huang@example.com',
      phone: '13345678901',
      source: '转介绍',
      status: 'contacted',
      date: '2023-06-11',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-13',
      interest: '新加坡大学申请',
      assignedTo: '周顾问',
      notes: '已电话联系，准备安排面谈',
      priority: 'medium'
    },
    {
      id: 'L008',
      name: '刘晓',
      email: 'xiao.liu@example.com',
      phone: '13234567890',
      source: '教育展',
      status: 'qualified',
      date: '2023-06-08',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      lastContact: '2023-06-12',
      interest: '香港大学申请',
      assignedTo: '李顾问',
      notes: '已完成需求评估，准备提供方案',
      priority: 'high'
    },
  ];
  
  // 可选的线索来源
  const sources = ['全部来源', '官网表单', '社交媒体', '转介绍', '教育展', '电话咨询'];
  
  // 基于activeTab筛选线索
  const filteredLeads = leads.filter(lead => {
    if (activeTab === '全部线索') return true;
    if (activeTab === '新线索') return lead.status === 'new';
    if (activeTab === '已联系') return lead.status === 'contacted';
    if (activeTab === '已签约') return lead.status === 'converted';
    if (activeTab === '高优先级') return lead.priority === 'high';
    return true;
  }).filter(lead => {
    if (selectedSource === '全部来源') return true;
    return lead.source === selectedSource;
  });
  
  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    converted: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
  };
  
  // 状态中文名称映射
  const statusNameMap: Record<string, string> = {
    new: '新线索',
    contacted: '已联系',
    qualified: '已确认',
    converted: '已签约',
    closed: '已关闭'
  };
  
  // 优先级标签颜色映射
  const priorityColorMap: Record<string, string> = {
    high: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    medium: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
  };
  
  // 优先级中文名称映射
  const priorityNameMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">线索管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索线索..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新增线索
          </button>
        </div>
      </div>

      {/* 筛选器面板 - 条件显示 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl dark:bg-gray-800">
          <h3 className="font-medium mb-4 dark:text-white">筛选条件</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">线索来源</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">日期范围</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="date" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                />
                <span className="text-gray-500 dark:text-gray-400">至</span>
                <input 
                  type="date" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">负责人</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部顾问</option>
                <option value="李顾问">李顾问</option>
                <option value="王顾问">王顾问</option>
                <option value="张顾问">张顾问</option>
                <option value="刘顾问">刘顾问</option>
                <option value="黄顾问">黄顾问</option>
                <option value="周顾问">周顾问</option>
                <option value="unassigned">未分配</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">兴趣项目</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部项目</option>
                <option value="美国本科申请">美国本科申请</option>
                <option value="英国本科申请">英国本科申请</option>
                <option value="美国硕士申请">美国硕士申请</option>
                <option value="英国硕士申请">英国硕士申请</option>
                <option value="澳大利亚硕士申请">澳大利亚硕士申请</option>
                <option value="加拿大高中申请">加拿大高中申请</option>
                <option value="新加坡大学申请">新加坡大学申请</option>
                <option value="香港大学申请">香港大学申请</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">优先级</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部优先级</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2 dark:text-gray-400">状态</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                <option value="all">全部状态</option>
                <option value="new">新线索</option>
                <option value="contacted">已联系</option>
                <option value="qualified">已确认</option>
                <option value="converted">已签约</option>
                <option value="closed">已关闭</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
              重置筛选
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
              应用筛选
            </button>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: '总线索数', value: leads.length, icon: Users, color: 'blue' },
          { title: '新线索', value: leads.filter(lead => lead.status === 'new').length, icon: AlertCircle, color: 'yellow' },
          { title: '已签约', value: leads.filter(lead => lead.status === 'converted').length, icon: CheckCircle2, color: 'green' },
          { title: '本周跟进', value: '12', icon: Clock, color: 'purple' },
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

      {/* 线索表格 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {['全部线索', '新线索', '已联系', '已签约', '高优先级'].map((tab) => (
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
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">来源:</span>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">线索信息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">来源</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">兴趣项目</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">负责人</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">优先级</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{lead.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    {lead.source}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{lead.interest}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[lead.status]}`}>
                    {statusNameMap[lead.status]}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{lead.assignedTo}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColorMap[lead.priority]}`}>
                    {priorityNameMap[lead.priority]}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="更新状态">
                      <UserCheck className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="查看详情">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              显示 1 至 {filteredLeads.length} 条，共 {leads.length} 条
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, '...', 5].map((page, index) => (
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

export default LeadsPage; 