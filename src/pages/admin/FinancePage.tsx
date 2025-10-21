// 新的FinancePage文件
import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Upload,
  Lock
} from "lucide-react";
import {
  Transaction,
  TransactionForm,
  Project,
  ServiceType,
  Category,
  Account,
  TransactionStatus,
  TransactionDirection
} from "../../types/finance";
import { Person } from "../../types/people";
import { financeService } from "../../services/finance/financeService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "../../components/ui/use-toast";
import ExcelImporter from "../../components/finance/ExcelImporter";

const FinancePage: React.FC = () => {
  // 密码验证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financeSummary, setFinanceSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0
  });
  
  // 关联表数据
  const [people, setPeople] = useState<Person[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  // 交易表单
  const [newTransaction, setNewTransaction] = useState<Partial<TransactionForm>>({
    direction: "收入" as TransactionDirection,
    status: "待支付" as TransactionStatus,
    amount: 0,
    transaction_date: new Date().toISOString().split('T')[0],
  });
  
  // 处理密码验证
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '959946') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('密码错误，请重试');
      setPassword('');
    }
  };

  // 刷新交易数据
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const transactions = await financeService.getAllTransactions();
      setTransactions(transactions);
      const summary = await financeService.getDashboardData();
      setFinanceSummary(summary);
      setIsLoading(false);
    } catch (error) {
      console.error('获取交易数据失败', error);
      setIsLoading(false);
    }
  };
  
  // 加载所有数据
  useEffect(() => {
    // 只有验证通过后才加载数据
    if (!isAuthenticated) return;
    
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 并行加载交易记录和关联数据
        const [transactions, summary, relatedData] = await Promise.all([
          financeService.getAllTransactions(),
          financeService.getDashboardData(),
          financeService.getRelatedData()
        ]);
        
        setTransactions(transactions);
        setFinanceSummary(summary);
        
        // 设置关联表数据
        setPeople(relatedData.people);
        setProjects(relatedData.projects);
        setServiceTypes(relatedData.serviceTypes);
        setCategories(relatedData.categories);
        setAccounts(relatedData.accounts);
        
        // 如果有关联数据，设置默认选项
        if (relatedData.serviceTypes.length > 0) {
          setNewTransaction(prev => ({
            ...prev,
            service_type_id: relatedData.serviceTypes[0].id
          }));
        }
        
        if (relatedData.categories.length > 0) {
          setNewTransaction(prev => ({
            ...prev,
            category_id: relatedData.categories[0].id
          }));
        }
        
        if (relatedData.accounts.length > 0) {
          setNewTransaction(prev => ({
            ...prev,
            account_id: relatedData.accounts[0].id
          }));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('加载数据失败', error);
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [isAuthenticated]);
  
  // 处理添加交易
  const handleAddTransaction = async () => {
    try {
      await financeService.addTransaction(newTransaction as TransactionForm);
      
      // 重新加载交易记录
      const transactions = await financeService.getAllTransactions();
      setTransactions(transactions);
      
      // 更新财务概览
      const summary = await financeService.getDashboardData();
      setFinanceSummary(summary);
      
      // 清空表单并关闭弹窗
      setIsNewTransactionModalOpen(false);
    setNewTransaction({
        direction: "收入" as TransactionDirection,
        status: "待支付" as TransactionStatus,
        amount: 0,
        transaction_date: new Date().toISOString().split('T')[0],
        category_id: categories[0]?.id,
        account_id: accounts[0]?.id,
        service_type_id: serviceTypes[0]?.id
      });
      
      // 显示成功消息
      toast.success("交易记录已成功添加");
    } catch (error) {
      console.error('添加交易失败', error);
      toast.error("添加交易记录时出错");
    }
  };
  
  // 如果未验证，显示密码输入界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900">
              <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              财务管理系统
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              请输入访问密码以继续
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="请输入访问密码"
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {passwordError}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                进入系统
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
          {/* 添加Excel导入按钮 */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Upload className="h-4 w-4" />
            批量导入
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
      
      {/* 财务概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总收入</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
                ¥{financeSummary.totalIncome.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">本月: ¥{financeSummary.monthlyIncome.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总支出</p>
              <h3 className="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">
                ¥{financeSummary.totalExpense.toLocaleString()}
              </h3>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <TrendingUp className="text-red-500 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">本月: ¥{financeSummary.monthlyExpense.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">净余额</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                financeSummary.balance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-500 dark:text-red-400'
              }`}>
                ¥{financeSummary.balance.toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <DollarSign className="text-blue-600 dark:text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              月度收支: ¥{(financeSummary.monthlyIncome - financeSummary.monthlyExpense).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总交易数</p>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-500 mt-1">
                {transactions.length}
              </h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <FileText className="text-purple-600 dark:text-purple-500" />
        </div>
      </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transactions.filter(t => {
                const date = new Date(t.transaction_date);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length} 条本月交易
            </p>
          </div>
          </div>
          
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">待处理交易</p>
              <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
                {transactions.filter(t => t.status === '待支付').length}
              </h3>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transactions.filter(t => t.status === '已完成').length} 条已完成交易
            </p>
          </div>
        </div>
            </div>
            
      {/* 交易记录选项卡 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setCurrentTab("all")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                currentTab === "all"
                  ? "border-blue-500 text-blue-600 dark:text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              全部交易
            </button>
            <button
              onClick={() => setCurrentTab("income")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                currentTab === "income"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              收入
            </button>
            <button
              onClick={() => setCurrentTab("expense")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                currentTab === "expense"
                  ? "border-red-500 text-red-600 dark:text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              支出
            </button>
            <button
              onClick={() => setCurrentTab("pending")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                currentTab === "pending"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Clock className="mr-2 h-4 w-4" />
              待处理
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      分类
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      金额
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      人员
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      项目
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      服务类型
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">操作</span>
                    </th>
            </tr>
          </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {transactions
                    .filter(transaction => {
                      if (currentTab === "all") return true;
                      if (currentTab === "income") return transaction.direction === "收入";
                      if (currentTab === "expense") return transaction.direction === "支出";
                      if (currentTab === "pending") return transaction.status === "待支付";
                      return true;
                    })
                    .map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaction.category?.name || '-'}
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.direction === "收入" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
                            {transaction.direction === "收入" ? "+" : "-"}
                            ¥{transaction.amount.toLocaleString()}
                  </span>
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === "已完成"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}>
                    {transaction.status}
                  </span>
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaction.person?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaction.project?.name || '-'}
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {transaction.service_type?.name || '-'}
                </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400">
                            详情
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
          )}
        </div>
      </div>
      
      {/* 新增交易弹窗 */}
      <Dialog open={isNewTransactionModalOpen} onOpenChange={setIsNewTransactionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增交易记录</DialogTitle>
            <DialogDescription>
              请填写交易的各项信息，带*为必填项。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-right">
                  金额*
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="direction" className="text-right">
                  收支方向*
                </Label>
                <Select
                  value={newTransaction.direction}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, direction: value as TransactionDirection })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择收支方向" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="收入">收入</SelectItem>
                    <SelectItem value="支出">支出</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-right">
                  分类*
                </Label>
                <Select
                  value={newTransaction.category_id?.toString()}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(category => category.direction === newTransaction.direction)
                      .map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
                    <div>
                <Label htmlFor="account" className="text-right">
                  账户*
                </Label>
                <Select
                  value={newTransaction.account_id?.toString()}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, account_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择账户" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                      </div>
                    </div>
                    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-right">
                  状态*
                </Label>
                <Select
                  value={newTransaction.status}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, status: value as TransactionStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="待支付">待支付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                    <div>
                <Label htmlFor="transaction_date" className="text-right">
                  交易日期*
                </Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={newTransaction.transaction_date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                  className="w-full"
                />
                  </div>
                </div>
                
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <Label htmlFor="person" className="text-right">
                  人员
                </Label>
                <Select
                  value={newTransaction.person_id?.toString() || ''}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, person_id: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择人员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无</SelectItem>
                    {people.map(person => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>
                  <div>
                <Label htmlFor="project" className="text-right">
                  项目
                </Label>
                <Select
                  value={newTransaction.project_id?.toString() || ''}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, project_id: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择项目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">无</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>
                </div>
                
                <div>
              <Label htmlFor="service_type" className="text-right">
                服务类型
              </Label>
              <Select
                value={newTransaction.service_type_id?.toString() || ''}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, service_type_id: value ? parseInt(value) : undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择服务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">无</SelectItem>
                  {serviceTypes.map(serviceType => (
                    <SelectItem key={serviceType.id} value={serviceType.id.toString()}>
                      {serviceType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                  </div>
                  
                  <div>
              <Label htmlFor="notes" className="text-right">
                备注
              </Label>
              <Input
                id="notes"
                value={newTransaction.notes || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                className="w-full"
                      />
                    </div>
                  </div>
                  
          <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setIsNewTransactionModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 text-sm font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                  >
                    取消
                  </button>
                  <button
              type="button"
              onClick={handleAddTransaction}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors"
                  >
              添加
                  </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Excel导入弹窗 */}
      {isImportModalOpen && (
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>批量导入Excel交易数据</DialogTitle>
              <DialogDescription>
                请上传符合格式要求的Excel文件，系统将自动导入数据
              </DialogDescription>
            </DialogHeader>
            <ExcelImporter 
              onSuccess={() => {
                fetchTransactions();
                setIsImportModalOpen(false);
                toast.success("Excel数据已成功导入系统");
              }}
              onClose={() => setIsImportModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FinancePage;