import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import WebsiteRoutes from './website/routes';
import StudentLayout from './pages/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import DataAnalytics from './pages/DataAnalytics';
import MaterialsCenter from './pages/MaterialsCenter';
import Community from './pages/Community';
import AIAssistant from './pages/AIAssistant';
import LearningResources from './pages/LearningResources';
import LoginPage from './pages/LoginPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 官网路由 */}
      <Route path="/website/*" element={<WebsiteRoutes />} />
      
      {/* 登录页面路由 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 后台管理系统路由 */}
      <Route path="/admin/*" element={<App />} />
      
      {/* 学生端路由 */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="analytics" element={<DataAnalytics />} />
        <Route path="materials" element={<MaterialsCenter />} />
        <Route path="community" element={<Community />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="resources" element={<LearningResources />} />
      </Route>
      
      {/* 默认重定向到官网首页 */}
      <Route path="/" element={<Navigate to="/website" replace />} />
    </Routes>
  );
};

export default AppRoutes; 