 // 基本类型定义
export type TransactionDirection = '收入' | '支出';
export type TransactionStatus = '已完成' | '待收款' | '待支付' | '已取消';

// 关联表接口
export interface Person {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  // 其他人员信息
}

export interface Project {
  id: number;
  name: string;
  status: string;
  description?: string;
  // 其他项目信息
}

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  direction?: TransactionDirection;
  active?: boolean;
}

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

// 数据库中的交易记录接口
export interface TransactionDB {
  id: number;
  person_id: number;
  project_id: number;
  service_type_id: number;
  amount: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  category_id: number;
  transaction_date: string;
  account_id: number;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

// 带关联数据的完整交易记录接口
export interface Transaction extends TransactionDB {
  person?: Person;
  project?: Project;
  service_type?: ServiceType;
  category?: Category;
  account?: Account;
}

// 财务交易记录
export interface FinanceTransaction {
  id: number;
  amount: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  transaction_date: string;
  notes?: string;
  category_id: number;
  account_id: number;
  person_id?: number;
  project_id?: number;
  service_type_id?: number;
  created_at: string;
  updated_at: string;
}

// 用于创建交易的表单类型
export type TransactionForm = Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>;

// 交易过滤器接口
export interface TransactionFilter {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  accountId?: number;
  personId?: number;
  direction?: TransactionDirection;
  status?: TransactionStatus;
}