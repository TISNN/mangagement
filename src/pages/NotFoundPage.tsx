import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

/**
 * 404 页面组件
 * 当用户访问不存在的路由时显示此页面
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-md text-center px-4">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-4 text-6xl font-bold text-slate-900 dark:text-white">404</h1>
          <h2 className="mb-2 text-2xl font-semibold text-slate-700 dark:text-slate-300">
            页面未找到
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          {location.pathname && (
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              路径: <code className="rounded bg-slate-200 px-2 py-1 dark:bg-slate-700">{location.pathname}</code>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            返回上一页
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Home className="h-4 w-4" />
            返回控制台
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

