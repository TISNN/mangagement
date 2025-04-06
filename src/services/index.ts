// 服务导出文件
import { peopleService } from './peopleService';
import { authService } from './authService';
import { SyncService } from './syncService';
import { financeService } from './finance/financeService';

// 创建syncService实例
const syncService = new SyncService();

export {
  peopleService,
  authService,
  syncService,
  financeService
}; 