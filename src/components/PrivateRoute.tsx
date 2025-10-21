import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * 私有路由组件 - 保护需要登录才能访问的页面
 * 如果未登录,重定向到登录页面
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // 检查用户是否已登录
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');
  
  if (!isAuthenticated || !userType) {
    // 未登录,重定向到登录页,并保存当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 已登录,渲染子组件
  return <>{children}</>;
};

