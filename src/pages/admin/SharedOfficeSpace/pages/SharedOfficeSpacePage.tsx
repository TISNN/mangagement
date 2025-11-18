/**
 * 共享办公空间匹配系统 - 主页面
 * 作为路由入口，提供标签页导航
 */

import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, Search, FileText, Calendar, Settings } from 'lucide-react';

const TABS = [
  {
    id: 'overview',
    label: '概览',
    icon: Building2,
    path: '/admin/shared-office/overview',
  },
  {
    id: 'my-spaces',
    label: '我的空间',
    icon: Building2,
    path: '/admin/shared-office/my-spaces',
  },
  {
    id: 'search',
    label: '搜索空间',
    icon: Search,
    path: '/admin/shared-office/search',
  },
  {
    id: 'my-requests',
    label: '我的需求',
    icon: FileText,
    path: '/admin/shared-office/my-requests',
  },
  {
    id: 'my-bookings',
    label: '我的预约',
    icon: Calendar,
    path: '/admin/shared-office/my-bookings',
  },
];

export const SharedOfficeSpacePage: React.FC = () => {
  const location = useLocation();

  const activeTabId = useMemo(() => {
    const matched = TABS.find((tab) => location.pathname.includes(tab.path));
    return matched?.id ?? 'overview';
  }, [location.pathname]);

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            共享办公空间
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Shared Office Space Matching
          </p>
        </div>
        <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-300">
          连接空间提供方和需求方，实现资源共享，降低运营成本，提升资源利用率。
          支持跨城市业务拓展，构建平台内成员互助合作的共享生态。
        </p>
      </header>

      {/* 标签页导航 */}
      <section className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </section>

      {/* 子页面内容 */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

