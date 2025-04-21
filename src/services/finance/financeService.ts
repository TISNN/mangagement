import { supabase } from '../../lib/supabase';
import { 
  Transaction, 
  TransactionFilter, 
  TransactionForm,
  Project,
  ServiceType,
  Category,
  Account
} from '../../types/finance';

// 使用最新的Person类型
import { Person as EnhancedPerson } from '../../types/people';

const TRANSACTIONS_TABLE = 'finance_transactions';

export const financeService = {
  // 获取所有服务类型
  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data as ServiceType[];
    } catch (error) {
      console.error('获取服务类型失败', error);
      throw error;
    }
  },

  // 获取所有交易记录（包含关联数据）
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from(TRANSACTIONS_TABLE)
        .select(`
          *,
          person:person_id(*),
          project:project_id(*),
          service_type:service_type_id(*),
          category:category_id(*),
          account:account_id(*)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Transaction[];
    } catch (error) {
      console.error('获取交易记录失败', error);
      throw error;
    }
  },
  
  // 根据过滤条件获取交易记录
  async getFilteredTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    try {
      let query = supabase
        .from(TRANSACTIONS_TABLE)
        .select(`
          *,
          person:person_id(*),
          project:project_id(*),
          service_type:service_type_id(*),
          category:category_id(*),
          account:account_id(*)
        `);
      
      if (filter.direction) {
        query = query.eq('direction', filter.direction);
      }
      
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      
      if (filter.startDate) {
        query = query.gte('transaction_date', filter.startDate);
      }
      
      if (filter.endDate) {
        query = query.lte('transaction_date', filter.endDate);
      }
      
      if (filter.categoryId) {
        query = query.eq('category_id', filter.categoryId);
      }
      
      if (filter.accountId) {
        query = query.eq('account_id', filter.accountId);
      }
      
      if (filter.personId) {
        query = query.eq('person_id', filter.personId);
      }
      
      const { data, error } = await query.order('transaction_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Transaction[];
    } catch (error) {
      console.error('获取过滤交易记录失败', error);
      throw error;
    }
  },
  
  // 添加交易记录
  async addTransaction(transaction: TransactionForm): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from(TRANSACTIONS_TABLE)
        .insert([transaction])
        .select(`
          *,
          person:person_id(*),
          project:project_id(*),
          service_type:service_type_id(*),
          category:category_id(*),
          account:account_id(*)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Transaction;
    } catch (error) {
      console.error('添加交易记录失败', error);
      throw error;
    }
  },
  
  // 更新交易记录
  async updateTransaction(id: number, transaction: Partial<TransactionForm>): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from(TRANSACTIONS_TABLE)
        .update(transaction)
        .eq('id', id)
        .select(`
          *,
          person:person_id(*),
          project:project_id(*),
          service_type:service_type_id(*),
          category:category_id(*),
          account:account_id(*)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Transaction;
    } catch (error) {
      console.error('更新交易记录失败', error);
      throw error;
    }
  },
  
  // 删除交易记录
  async deleteTransaction(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(TRANSACTIONS_TABLE)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('删除交易记录失败', error);
      throw error;
    }
  },
  
  // 获取财务仪表盘数据
  async getDashboardData() {
    try {
      const transactions = await this.getAllTransactions();
      
      // 收入交易
      const incomeTransactions = transactions.filter(t => t.direction === '收入');
      // 支出交易
      const expenseTransactions = transactions.filter(t => t.direction === '支出');
      
      // 总收入
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      // 总支出
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      // 净余额
      const balance = totalIncome - totalExpense;
      
      // 获取当前月份数据
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const currentMonthTransactions = transactions.filter(t => {
        const date = new Date(t.transaction_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const monthlyIncome = currentMonthTransactions
        .filter(t => t.direction === '收入')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthlyExpense = currentMonthTransactions
        .filter(t => t.direction === '支出')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // 获取过去6个月的月度数据
      const monthlyData = [];
      
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.transaction_date);
          return tDate.getMonth() === month && tDate.getFullYear() === year;
        });
        
        const income = monthTransactions
          .filter(t => t.direction === '收入')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expense = monthTransactions
          .filter(t => t.direction === '支出')
          .reduce((sum, t) => sum + t.amount, 0);
        
        monthlyData.push({
          month: `${year}-${month + 1}`,
          income,
          expense,
          profit: income - expense
        });
      }
      
      return {
        totalIncome,
        totalExpense,
        balance,
        monthlyIncome,
        monthlyExpense,
        monthlyData: monthlyData.reverse()
      };
    } catch (error) {
      console.error('获取财务仪表盘数据失败', error);
      throw error;
    }
  },
  
  // 获取所有关联数据（分类、账户、人员、项目、服务类型）
  async getRelatedData() {
    try {
      // 获取分类
      const { data: categories, error: categoriesError } = await supabase
        .from('finance_categories')
        .select('*');
        
      if (categoriesError) throw categoriesError;
      
      // 获取账户
      const { data: accounts, error: accountsError } = await supabase
        .from('finance_accounts')
        .select('*');
        
      if (accountsError) throw accountsError;
      
      // 获取人员 - 更新为使用新的表结构
      const { data: people, error: peopleError } = await supabase
        .from('people')
        .select('*');
        
      if (peopleError) throw peopleError;
      
      // 获取项目
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
        
      if (projectsError) throw projectsError;
      
      // 获取服务类型
      const { data: serviceTypes, error: serviceTypesError } = await supabase
        .from('service_types')
        .select('*');
        
      if (serviceTypesError) throw serviceTypesError;
      
      return {
        categories: categories as Category[],
        accounts: accounts as Account[],
        people: people as EnhancedPerson[],  // 使用新的增强版Person类型
        projects: projects as Project[],
        serviceTypes: serviceTypes as ServiceType[]
      };
    } catch (error) {
      console.error('获取关联数据失败', error);
      throw error;
    }
  },

  // 获取与学生相关的财务数据
  async getStudentFinancialData(studentId: number) {
    try {
      // 首先获取学生人员ID
      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('person_id')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;
      if (!studentProfile) throw new Error('找不到学生资料');

      const personId = studentProfile.person_id;

      // 获取该学生的所有交易
      const { data: transactions, error: transactionsError } = await supabase
        .from(TRANSACTIONS_TABLE)
        .select(`
          *,
          category:category_id(*),
          account:account_id(*),
          service_type:service_type_id(*)
        `)
        .eq('person_id', personId)
        .order('transaction_date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // 获取学生的所有服务
      const { data: services, error: servicesError } = await supabase
        .from('student_services')
        .select(`
          *,
          service_type:service_type_id(*)
        `)
        .eq('student_id', studentId);

      if (servicesError) throw servicesError;

      // 计算汇总数据
      const totalPaid = transactions
        .filter(t => t.direction === '收入' && t.status === '已完成')
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingPayments = transactions
        .filter(t => t.direction === '收入' && t.status === '待收款')
        .reduce((sum, t) => sum + t.amount, 0);

      // 服务对应的收入
      const serviceRevenue = services.map(service => {
        const serviceTransactions = transactions.filter(
          t => t.service_type_id === service.service_type_id && t.direction === '收入'
        );
        
        return {
          serviceId: service.id,
          serviceName: service.service_type?.name || '未知服务',
          totalAmount: serviceTransactions.reduce((sum, t) => sum + t.amount, 0),
          paidAmount: serviceTransactions
            .filter(t => t.status === '已完成')
            .reduce((sum, t) => sum + t.amount, 0),
          transactions: serviceTransactions
        };
      });

      return {
        transactions,
        totalPaid,
        pendingPayments,
        serviceRevenue,
        services
      };
    } catch (error) {
      console.error('获取学生财务数据失败', error);
      throw error;
    }
  }
};

export default financeService;