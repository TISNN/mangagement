import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * 私有路由组件 - 保护需要登录才能访问的页面
 * 如果未登录,重定向到登录页面
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const { loading, userType } = useAuth();

  // 正在加载认证状态 - 等待 Supabase session 完全恢复
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 dark:text-gray-300">正在恢复会话...</p>
        </div>
      </div>
    );
  }

  // 未登录，重定向到登录页
  if (!userType) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录且会话已恢复，渲染子组件
  return <>{children}</>;
};

