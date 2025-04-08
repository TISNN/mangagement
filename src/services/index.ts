// 服务导出文件
import { peopleService } from './peopleService';
import { authService } from './authService';
import { SyncService } from './syncService';
import { financeService } from './finance/financeService';
import { employeeService } from './employeeService';
import * as schoolPlanningService from './schoolPlanningService';
import * as schoolService from './schoolService';

// 创建syncService实例
const syncService = new SyncService();

export {
  peopleService,
  authService,
  syncService,
  financeService,
  employeeService,
  schoolPlanningService,
  schoolService
};