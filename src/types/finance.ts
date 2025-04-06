// 基本类型定义
export type TransactionDirection = '收入' | '支出';
export type TransactionStatus = '已完成' | '待收款' | '待支付' | '已取消';

// 从people模块引入Person类型
import { Person, StudentService } from './people';

// 旧的Person类型保留为兼容历史代码
export interface LegacyPerson {
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
  is_active?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  direction: TransactionDirection;
  is_active?: boolean;
}

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  is_active?: boolean;
}

// 数据库中的交易记录接口
export interface TransactionDB {
  id: number;
  person_id: number;
  project_id?: number;
  service_type_id?: number;
  amount: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  category_id: number;
  transaction_date: string;
  account_id: number;
  notes?: string;
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

// 学生服务类型（带ServiceType信息）
export interface StudentServiceWithType extends Omit<StudentService, 'service_type'> {
  service_type: ServiceType;
}

// 学生财务数据
export interface StudentFinancialData {
  transactions: Transaction[];
  totalPaid: number;
  pendingPayments: number;
  serviceRevenue: ServiceRevenue[];
  services: StudentServiceWithType[]; // 使用具体的类型而不是any
}

export interface ServiceRevenue {
  serviceId: number;
  serviceName: string;
  totalAmount: number;
  paidAmount: number;
  transactions: Transaction[];
}