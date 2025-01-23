import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import WebsiteRoutes from './website/routes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 官网路由 */}
      <Route path="/website/*" element={<WebsiteRoutes />} />
      
      {/* 后台管理系统路由 */}
      <Route path="/admin/*" element={<App />} />
      
      {/* 默认重定向到官网 */}
      <Route path="/" element={<Navigate to="/website" replace />} />
    </Routes>
  );
};

export default AppRoutes; 