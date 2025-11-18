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
  },

  // ========== 发票相关方法 ==========
  
  // 获取所有发票
  async getAllInvoices() {
    try {
      const { data, error } = await supabase
        .from('finance_invoices')
        .select('*')
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取发票列表失败', error);
      throw error;
    }
  },

  // 根据状态过滤发票
  async getInvoicesByStatus(status?: string) {
    try {
      let query = supabase
        .from('finance_invoices')
        .select('*')
        .order('issued_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取发票失败', error);
      throw error;
    }
  },

  // 添加发票
  async addInvoice(invoice: any) {
    try {
      const { data, error } = await supabase
        .from('finance_invoices')
        .insert([invoice])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('添加发票失败', error);
      throw error;
    }
  },

  // 更新发票
  async updateInvoice(id: number, invoice: any) {
    try {
      const { data, error } = await supabase
        .from('finance_invoices')
        .update({ ...invoice, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新发票失败', error);
      throw error;
    }
  },

  // ========== 税务相关方法 ==========
  
  // 获取所有税务任务
  async getAllTaxTasks() {
    try {
      const { data, error } = await supabase
        .from('finance_tax_tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取税务任务失败', error);
      throw error;
    }
  },

  // 获取税务日历
  async getTaxCalendar() {
    try {
      const { data, error } = await supabase
        .from('finance_tax_calendar')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取税务日历失败', error);
      throw error;
    }
  },

  // 添加税务任务
  async addTaxTask(task: any) {
    try {
      const { data, error } = await supabase
        .from('finance_tax_tasks')
        .insert([task])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('添加税务任务失败', error);
      throw error;
    }
  },

  // 添加税务日历项
  async addTaxCalendarItem(item: any) {
    try {
      const { data, error } = await supabase
        .from('finance_tax_calendar')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('添加税务日历项失败', error);
      throw error;
    }
  },

  // ========== KPI 和统计数据计算 ==========
  
  // 计算财务概览 KPI
  async calculateOverviewKPIs(period: 'mom' | 'qoq' | 'yoy' = 'mom') {
    try {
      const transactions = await this.getAllTransactions();
      
      const now = new Date();
      let startDate: Date;
      let endDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 本月最后一天
      
      if (period === 'mom') {
        // 本月 vs 上月
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        const currentMonthIncome = transactions
          .filter(t => {
            const date = new Date(t.transaction_date);
            return date >= startDate && date <= endDate && t.direction === '收入' && t.status === '已完成';
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const lastMonthIncome = transactions
          .filter(t => {
            const date = new Date(t.transaction_date);
            return date >= lastMonthStart && date <= lastMonthEnd && t.direction === '收入' && t.status === '已完成';
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const delta = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : '0';
        
        return {
          revenue: {
            value: `¥ ${currentMonthIncome.toLocaleString()}`,
            delta: `${delta.startsWith('-') ? '' : '+'}${delta}%`,
            tone: Number(delta) >= 0 ? 'positive' : 'negative'
          }
        };
      }
      
      // 简化版本，返回基础数据
      const currentMonthIncome = transactions
        .filter(t => {
          const date = new Date(t.transaction_date);
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear() && 
                 t.direction === '收入' && 
                 t.status === '已完成';
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        revenue: {
          value: `¥ ${currentMonthIncome.toLocaleString()}`,
          delta: '+0%',
          tone: 'neutral' as const
        }
      };
    } catch (error) {
      console.error('计算 KPI 失败', error);
      throw error;
    }
  },

  // 计算收入管道数据
  async calculateRevenueStreams() {
    try {
      const transactions = await this.getAllTransactions();
      const serviceTypes = await this.getServiceTypes();
      
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // 按服务类型分组计算收入
      const revenueByService = serviceTypes.map(service => {
        const serviceTransactions = transactions.filter(t => 
          t.service_type_id === service.id &&
          t.direction === '收入' &&
          t.status === '已完成' &&
          new Date(t.transaction_date) >= currentMonthStart &&
          new Date(t.transaction_date) <= currentMonthEnd
        );
        
        const total = serviceTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        return {
          serviceId: service.id,
          name: service.name || '未知服务',
          value: total
        };
      });
      
      const totalRevenue = revenueByService.reduce((sum, r) => sum + r.value, 0);
      
      return revenueByService
        .filter(r => r.value > 0)
        .map(r => ({
          name: r.name,
          value: r.value,
          proportion: totalRevenue > 0 ? r.value / totalRevenue : 0,
          yoy: 0 // 需要历史数据才能计算
        }))
        .sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('计算收入管道失败', error);
      throw error;
    }
  },

  // 计算支出结构
  async calculateSpendStructure() {
    try {
      const transactions = await this.getAllTransactions();
      const relatedData = await this.getRelatedData();
      
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const expenseTransactions = transactions.filter(t => 
        t.direction === '支出' &&
        new Date(t.transaction_date) >= currentMonthStart &&
        new Date(t.transaction_date) <= currentMonthEnd
      );
      
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      
      const spendByCategory = relatedData.categories
        .filter(c => c.direction === '支出')
        .map(category => {
          const categoryTransactions = expenseTransactions.filter(t => t.category_id === category.id);
          const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
          return {
            name: category.name || '未知分类',
            value: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0
          };
        })
        .filter(s => s.value > 0)
        .sort((a, b) => b.value - a.value);
      
      return spendByCategory;
    } catch (error) {
      console.error('计算支出结构失败', error);
      throw error;
    }
  },

  // ========== 社保相关方法 ==========
  
  // 获取所有社保记录
  async getAllSocialSecurityRecords() {
    try {
      const { data, error } = await supabase
        .from('finance_social_security_records')
        .select(`
          *,
          employee:employee_id(id, name, email)
        `)
        .order('period_start', { ascending: false })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取社保记录失败', error);
      throw error;
    }
  },

  // 根据期间获取社保记录
  async getSocialSecurityRecordsByPeriod(periodStart?: string, periodEnd?: string) {
    try {
      let query = supabase
        .from('finance_social_security_records')
        .select(`
          *,
          employee:employee_id(id, name, email)
        `)
        .order('period_start', { ascending: false })
        .order('name', { ascending: true });
      
      if (periodStart) {
        query = query.gte('period_start', periodStart);
      }
      
      if (periodEnd) {
        query = query.lte('period_end', periodEnd);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取社保记录失败', error);
      throw error;
    }
  },

  // 根据员工ID获取社保记录
  async getSocialSecurityRecordsByEmployee(employeeId: number) {
    try {
      const { data, error } = await supabase
        .from('finance_social_security_records')
        .select(`
          *,
          employee:employee_id(id, name, email)
        `)
        .eq('employee_id', employeeId)
        .order('period_start', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取员工社保记录失败', error);
      throw error;
    }
  },

  // 添加社保记录
  async addSocialSecurityRecord(record: any) {
    try {
      // 自动计算合计
      const employerTotal = 
        (Number(record.endowment_insurance_employer_amount) || 0) +
        (Number(record.migrant_unemployment_employer_amount) || 0) +
        (Number(record.urban_unemployment_employer_amount) || 0) +
        (Number(record.medical_insurance_employer_amount) || 0) +
        (Number(record.work_injury_amount) || 0);
      
      const individualTotal = 
        (Number(record.endowment_insurance_individual_amount) || 0) +
        (Number(record.migrant_unemployment_individual_amount) || 0) +
        (Number(record.urban_unemployment_individual_amount) || 0) +
        (Number(record.medical_insurance_individual_amount) || 0);
      
      const totalAmount = employerTotal + individualTotal;
      
      const recordWithTotals = {
        ...record,
        employer_total: employerTotal,
        individual_total: individualTotal,
        total_amount: totalAmount
      };
      
      const { data, error } = await supabase
        .from('finance_social_security_records')
        .insert([recordWithTotals])
        .select(`
          *,
          employee:employee_id(id, name, email)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('添加社保记录失败', error);
      throw error;
    }
  },

  // 更新社保记录
  async updateSocialSecurityRecord(id: number, record: any) {
    try {
      // 自动计算合计
      const employerTotal = 
        (Number(record.endowment_insurance_employer_amount) || 0) +
        (Number(record.migrant_unemployment_employer_amount) || 0) +
        (Number(record.urban_unemployment_employer_amount) || 0) +
        (Number(record.medical_insurance_employer_amount) || 0) +
        (Number(record.work_injury_amount) || 0);
      
      const individualTotal = 
        (Number(record.endowment_insurance_individual_amount) || 0) +
        (Number(record.migrant_unemployment_individual_amount) || 0) +
        (Number(record.urban_unemployment_individual_amount) || 0) +
        (Number(record.medical_insurance_individual_amount) || 0);
      
      const totalAmount = employerTotal + individualTotal;
      
      const recordWithTotals = {
        ...record,
        employer_total: employerTotal,
        individual_total: individualTotal,
        total_amount: totalAmount,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('finance_social_security_records')
        .update(recordWithTotals)
        .eq('id', id)
        .select(`
          *,
          employee:employee_id(id, name, email)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新社保记录失败', error);
      throw error;
    }
  },

  // 删除社保记录
  async deleteSocialSecurityRecord(id: number) {
    try {
      const { error } = await supabase
        .from('finance_social_security_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('删除社保记录失败', error);
      throw error;
    }
  },

  // 获取社保统计汇总
  async getSocialSecuritySummary(periodStart?: string, periodEnd?: string) {
    try {
      const records = await this.getSocialSecurityRecordsByPeriod(periodStart, periodEnd);
      
      const totalEmployer = records.reduce((sum, r) => sum + Number(r.employer_total || 0), 0);
      const totalIndividual = records.reduce((sum, r) => sum + Number(r.individual_total || 0), 0);
      const totalAmount = records.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
      
      // 按期间分组统计
      const byPeriod: Record<string, any> = {};
      records.forEach(record => {
        const period = record.period_start;
        if (!byPeriod[period]) {
          byPeriod[period] = {
            period,
            count: 0,
            employerTotal: 0,
            individualTotal: 0,
            totalAmount: 0
          };
        }
        byPeriod[period].count++;
        byPeriod[period].employerTotal += Number(record.employer_total || 0);
        byPeriod[period].individualTotal += Number(record.individual_total || 0);
        byPeriod[period].totalAmount += Number(record.total_amount || 0);
      });
      
      return {
        totalRecords: records.length,
        totalEmployer,
        totalIndividual,
        totalAmount,
        byPeriod: Object.values(byPeriod).sort((a: any, b: any) => b.period.localeCompare(a.period))
      };
    } catch (error) {
      console.error('获取社保统计失败', error);
      throw error;
    }
  }
};

export default financeService;