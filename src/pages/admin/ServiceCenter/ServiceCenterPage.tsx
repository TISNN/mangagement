import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { SERVICE_CENTER_TABS, TAB_ICONS, TAB_BADGE_STYLES } from './serviceCenterData';

const ServiceCenterPage: React.FC = () => {
  const location = useLocation();

  const activeTabId = useMemo(() => {
    const matched = SERVICE_CENTER_TABS.find((tab) => location.pathname.includes(`/service-center/${tab.id}`));
    return matched?.id ?? 'overview';
  }, [location.pathname]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">服务中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Service Hub</p>
        </div>
        <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-300">
          面向合作机构与个人顾问的一站式 B 端服务平台，覆盖数字化建设、品牌营销、法律合规、礼品定制与运营支持。
          我们以标准化服务包 + 定制工单驱动交付，通过项目协同、专家资源池与客户门户，构建从需求到回款的闭环。
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {SERVICE_CENTER_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const gradient = TAB_BADGE_STYLES[tab.id];
            const isActive = activeTabId === tab.id;

            return (
              <NavLink
                key={tab.id}
                to={`/admin/service-center/${tab.id}`}
                className={({ isActive: navActive }) =>
                  [
                    'group relative flex flex-col rounded-2xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                    'w-full sm:w-auto sm:min-w-[200px]',
                    isActive || navActive
                      ? 'border-indigo-200 bg-white shadow-sm dark:border-indigo-500/50 dark:bg-gray-900/40'
                      : 'border-gray-200 bg-white/70 dark:border-gray-700 dark:bg-gray-800/60',
                  ].join(' ')
                }
              >
                <div
                  className={`absolute inset-x-3 top-0 h-1 rounded-b-full bg-gradient-to-r ${gradient} opacity-80`}
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-indigo-500 dark:bg-white/10 dark:text-indigo-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tab.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</p>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/60">
        <Outlet />
      </section>
    </div>
  );
};

export default ServiceCenterPage;
