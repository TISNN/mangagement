/**
 * 共享办公空间匹配系统 - 主入口
 */

export { SharedOfficeSpacePage } from './pages/SharedOfficeSpacePage';
export { OverviewPage } from './pages/OverviewPage';
export { MySpacesPage } from './pages/MySpacesPage';
export { SearchSpacesPage } from './pages/SearchSpacesPage';
export { MyRequestsPage } from './pages/MyRequestsPage';
export { MyBookingsPage } from './pages/MyBookingsPage';
export { SpaceDetailPage } from './pages/SpaceDetailPage';
export { CreateSpacePage } from './pages/CreateSpacePage';
export { CreateRequestPage } from './pages/CreateRequestPage';
export { RequestDetailPage } from './pages/RequestDetailPage';

// 导出组件
export { SpaceCard } from './components/SpaceCard';
export { RequestCard } from './components/RequestCard';
export { StatsCard } from './components/StatsCard';

// 导出类型
export * from './types';

// 导出服务
export * from './services/spaceService';
export * from './services/requestService';
export * from './services/bookingService';
export * from './services/matchService';
export * from './services/matchResultService';

