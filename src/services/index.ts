// 服务导出文件
import { peopleService } from './peopleService';
import * as authService from './authService';
import { SyncService } from './syncService';
import { financeService } from './finance/financeService';
import { employeeService } from './employeeService';
import { leadService } from './leadService';
import * as schoolPlanningService from './schoolPlanningService';
import * as schoolService from './schoolService';
import { mentorService } from './mentorService';
import { serviceTypeService } from './serviceTypeService';

// 创建syncService实例
const syncService = new SyncService();

export {
  peopleService,
  authService,
  syncService,
  financeService,
  employeeService,
  leadService,
  schoolPlanningService,
  schoolService,
  mentorService,
  serviceTypeService,
};