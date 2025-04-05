import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  FileText, 
  Download,
  ChevronDown,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Transaction {
  id: string;
  personName: string;
  project: string;
  serviceType: "留学咨询" | "留学申请" | "语言培训" | "职场规划" | "日常支出" | "其他服务";
  amount: number;
  direction: "收入" | "支出";
  status: "已完成" | "待收款" | "待支付" | "已取消";
  category: string;
  date: string;
  account: string;
  month: string;
}

const FinancePage: React.FC = () => {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      personName: "李润泽",
      project: "意大利临床医学本科",
      serviceType: "留学申请",
      amount: 23000,
      direction: "收入",
      status: "已完成",
      category: "学费付款",
      date: "2024年1月1日",
      account: "银行账户",
      month: "一月"
    },
    {
      id: "2",
      personName: "段星宇",
      project: "澳城保录设计学硕士 定金",
      serviceType: "留学申请",
      amount: 10000,
      direction: "收入",
      status: "待收款",
      category: "定金",
      date: "2024年3月23日",
      account: "银行账户",
      month: "三月"
    },
    {
      id: "3",
      personName: "小而美财税",
      project: "企业代账费用",
      serviceType: "日常支出",
      amount: 2200,
      direction: "支出",
      status: "已完成",
      category: "企业服务",
      date: "2024年3月23日",
      account: "微信/支付宝",
      month: "三月"
    },
    {
      id: "4",
      personName: "小而美财税",
      project: "营业执照闪送",
      serviceType: "日常支出",
      amount: 66,
      direction: "支出",
      status: "已完成",
      category: "快递费用",
      date: "2024年3月23日",
      account: "微信/支付宝",
      month: "三月"
    },
    {
      id: "5",
      personName: "美际",
      project: "澳城保录设计学硕士 定金",
      serviceType: "留学申请",
      amount: 5000,
      direction: "支出",
      status: "待支付",
      category: "渠道费用",
      date: "2024年3月23日",
      account: "银行账户",
      month: "三月"
    }
  ]);
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    serviceType: "留学申请",
    direction: "收入",
    status: "已完成",
    category: "学费付款",
    date: new Date().toISOString().split("T")[0],
    month: getCurrentChineseMonth()
  });
  
  function getCurrentChineseMonth() {
    const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };
  
  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const direction = e.target.value as "收入" | "支出";
    setNewTransaction({
      ...newTransaction,
      direction: direction,
      serviceType: direction === "收入" ? "留学申请" : "日常支出",
      status: direction === "收入" ? "待收款" : "待支付"
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: Transaction = {
      id: Date.now().toString(),
      personName: newTransaction.personName || "",
      project: newTransaction.project || "",
      serviceType: newTransaction.serviceType || "留学申请",
      amount: Number(newTransaction.amount) || 0,
      direction: newTransaction.direction || "收入",
      status: newTransaction.status || "已完成",
      category: newTransaction.category || "学费付款",
      date: newTransaction.date || new Date().toISOString().split("T")[0],
      account: newTransaction.account || "",
      month: newTransaction.month || getCurrentChineseMonth()
    };
    
    setTransactions([newEntry, ...transactions]);
    setNewTransaction({
      serviceType: "留学申请",
      direction: "收入",
      status: "已完成",
      category: "学费付款",
      date: new Date().toISOString().split("T")[0],
      month: getCurrentChineseMonth()
    });
    setIsNewTransactionModalOpen(false);
  };
  
  const totalCredit = transactions
    .filter(t => t.direction === "收入")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalDebit = transactions
    .filter(t => t.direction === "支出")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalCredit - totalDebit;

  const filteredTransactions = currentTab === "all" 
    ? transactions
    : currentTab === "income" 
      ? transactions.filter(t => t.direction === "收入") 
      : transactions.filter(t => t.direction === "支出");
  
  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">财务管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索交易记录..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300">
            <Filter className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsNewTransactionModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增交易
          </button>
        </div>
      </div>
      
      {/* 财务概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <ArrowDownCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">总收入</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredit.toLocaleString()} 元</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">本月新增收入 33,000 元</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <ArrowUpCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">总支出</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDebit.toLocaleString()} 元</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">本月新增支出 7,266 元</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">净收益</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{balance.toLocaleString()} 元</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">比上月增长 23.5%</p>
        </div>
      </div>
      
      {/* 交易记录 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {[
              { id: 'all', name: '全部交易' },
              { id: 'income', name: '收入记录' },
              { id: 'expense', name: '支出记录' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select className="bg-transparent text-sm text-gray-500 dark:text-gray-400 focus:outline-none">
                <option value="">所有月份</option>
                <option value="一月">一月</option>
                <option value="二月">二月</option>
                <option value="三月">三月</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select className="bg-transparent text-sm text-gray-500 dark:text-gray-400 focus:outline-none">
                <option value="">所有人员</option>
                <option>李润泽</option>
                <option>段星宇</option>
                <option>小而美财税</option>
                <option>美际</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
              <Download className="h-4 w-4" />
              导出
            </button>
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">人员</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">项目</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">服务类型</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">金额</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">类别</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">分类</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">日期</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">账户</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.personName}
                </td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{transaction.project}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.serviceType === "留学申请"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : transaction.serviceType === "留学咨询" 
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                      : transaction.serviceType === "语言培训"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      : transaction.serviceType === "职场规划"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {transaction.serviceType}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm font-medium">
                  <span className={transaction.direction === "收入" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {transaction.direction === "收入" ? "+" : "-"}{transaction.amount.toLocaleString()} 元
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.direction === "收入"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    {transaction.direction}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === "已完成"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      : transaction.status === "待收款"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : transaction.status === "待支付"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    {transaction.status === "已完成" ? <CheckCircle className="h-3 w-3" /> 
                      : transaction.status === "待收款" || transaction.status === "待支付" ? <Clock className="h-3 w-3" /> 
                      : <XCircle className="h-3 w-3" />}
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    {transaction.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{transaction.date}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.account === "银行账户"
                      ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                      : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                  }`}>
                    {transaction.account}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页 */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">显示 1 - {filteredTransactions.length} 条，共 {filteredTransactions.length} 条</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 新增交易记录模态框 */}
      {isNewTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">新增交易记录</h2>
              <button 
                onClick={() => setIsNewTransactionModalOpen(false)} 
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        交易类型
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="direction" 
                            value="收入" 
                            checked={newTransaction.direction === "收入"} 
                            onChange={handleDirectionChange}
                            className="h-4 w-4 text-blue-600" 
                          />
                          <span>收入</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="direction" 
                            value="支出" 
                            checked={newTransaction.direction === "支出"}
                            onChange={handleDirectionChange}
                            className="h-4 w-4 text-blue-600" 
                          />
                          <span>支出</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        金额 (元)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <input
                          type="number"
                          name="amount"
                          value={newTransaction.amount || ""}
                          onChange={handleInputChange}
                          placeholder="输入金额"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      人员
                    </label>
                    <input
                      type="text"
                      name="personName"
                      value={newTransaction.personName || ""}
                      onChange={handleInputChange}
                      placeholder="输入人员姓名"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      服务类型
                    </label>
                    <select
                      name="serviceType"
                      value={newTransaction.serviceType || "留学申请"}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="留学申请">留学申请</option>
                      <option value="留学咨询">留学咨询</option>
                      <option value="语言培训">语言培训</option>
                      <option value="职场规划">职场规划</option>
                      <option value="日常支出">日常支出</option>
                      <option value="其他服务">其他服务</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    项目
                  </label>
                  <input
                    type="text"
                    name="project"
                    value={newTransaction.project || ""}
                    onChange={handleInputChange}
                    placeholder="输入项目名称"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      状态
                    </label>
                    <select
                      name="status"
                      value={newTransaction.status || "已完成"}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="已完成">已完成</option>
                      <option value="待收款">待收款</option>
                      <option value="待支付">待支付</option>
                      <option value="已取消">已取消</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      分类
                    </label>
                    <select
                      name="category"
                      value={newTransaction.category || "学费付款"}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="学费付款">学费付款</option>
                      <option value="定金">定金</option>
                      <option value="企业服务">企业服务</option>
                      <option value="渠道费用">渠道费用</option>
                      <option value="快递费用">快递费用</option>
                      <option value="办公用品">办公用品</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      日期
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <input
                        type="date"
                        name="date"
                        value={newTransaction.date || ""}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      账户
                    </label>
                    <select
                      name="account"
                      value={newTransaction.account || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">选择账户</option>
                      <option value="银行账户">银行账户</option>
                      <option value="微信/支付宝">微信/支付宝</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 -mx-6 -mb-6 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewTransactionModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
