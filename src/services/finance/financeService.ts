import { supabase } from '../../supabase';
import { Transaction, TransactionFilter } from '../../types/finance';

const TRANSACTIONS_TABLE = 'transactions';

export const financeService = {
  // 获取所有交易记录
  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from(TRANSACTIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // 根据过滤条件获取交易记录
  async getFilteredTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    let query = supabase.from(TRANSACTIONS_TABLE).select('*');
    
    if (filter.direction) {
      query = query.eq('direction', filter.direction);
    }
    
    if (filter.month) {
      query = query.eq('month', filter.month);
    }
    
    if (filter.personName) {
      query = query.ilike('personName', `%${filter.personName}%`);
    }
    
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    
    if (filter.serviceType) {
      query = query.eq('serviceType', filter.serviceType);
    }
    
    if (filter.startDate && filter.endDate) {
      query = query.gte('date', filter.startDate).lte('date', filter.endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching filtered transactions:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // 添加交易记录
  async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TRANSACTIONS_TABLE)
      .insert([transaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // 更新交易记录
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TRANSACTIONS_TABLE)
      .update(transaction)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // 删除交易记录
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from(TRANSACTIONS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
  
  // 获取财务统计信息
  async getFinanceSummary() {
    // 总收入
    const { data: incomeData, error: incomeError } = await supabase
      .from(TRANSACTIONS_TABLE)
      .select('amount')
      .eq('direction', '收入');
    
    // 总支出
    const { data: expenseData, error: expenseError } = await supabase
      .from(TRANSACTIONS_TABLE)
      .select('amount')
      .eq('direction', '支出');
    
    // 当月收入
    const currentMonth = new Date().toISOString().slice(0, 7); // 格式: YYYY-MM
    const { data: currentMonthIncomeData, error: currentMonthIncomeError } = await supabase
      .from(TRANSACTIONS_TABLE)
      .select('amount')
      .eq('direction', '收入')
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-31`);
    
    // 当月支出
    const { data: currentMonthExpenseData, error: currentMonthExpenseError } = await supabase
      .from(TRANSACTIONS_TABLE)
      .select('amount')
      .eq('direction', '支出')
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-31`);
    
    if (incomeError || expenseError || currentMonthIncomeError || currentMonthExpenseError) {
      console.error('Error fetching finance summary', { 
        incomeError, expenseError, currentMonthIncomeError, currentMonthExpenseError 
      });
      throw new Error('获取财务统计信息失败');
    }
    
    const totalIncome = incomeData?.reduce((sum, record) => sum + record.amount, 0) || 0;
    const totalExpense = expenseData?.reduce((sum, record) => sum + record.amount, 0) || 0;
    const monthlyIncome = currentMonthIncomeData?.reduce((sum, record) => sum + record.amount, 0) || 0;
    const monthlyExpense = currentMonthExpenseData?.reduce((sum, record) => sum + record.amount, 0) || 0;
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense
    };
  }
};

export default financeService;