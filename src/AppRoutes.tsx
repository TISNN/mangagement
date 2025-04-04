import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import WebsiteRoutes from './website/routes';
import StudentLayout from './pages/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import DataAnalytics from './pages/DataAnalytics';
import MaterialsCenter from './pages/MaterialsCenter';
import Community from './pages/Community';
import LearningResources from './pages/LearningResources';
import LoginPage from './pages/LoginPage';
import InterviewPage from './pages/InterviewPage';
import TrainingDetailPage from './pages/TrainingDetailPage';
import InternshipPage from './pages/InternshipPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import ReferralDetailPage from './pages/ReferralDetailPage';
import SchoolSelectionPage from './pages/SchoolSelectionPage';
import CompetitionPage from './pages/CompetitionPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import TaskManagementPage from './pages/TaskManagementPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 官网路由 */}
      <Route path="/website/*" element={<WebsiteRoutes />} />
      
      {/* 登录页面路由 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 后台管理系统路由 */}
      <Route path="/admin" element={<App />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      
      {/* 管理页面路由 */}
      <Route path="/admin/dashboard" element={<TaskManagementPage />} />
      <Route path="/admin/employees" element={<EmployeeManagementPage />} />
      <Route path="/admin/tasks" element={<TaskManagementPage />} />
      <Route path="/admin/interview" element={<InterviewPage />} />
      <Route path="/admin/interview/:id" element={<TrainingDetailPage />} />
      
      {/* 学生端路由 */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="analytics" element={<DataAnalytics />} />
        <Route path="materials" element={<MaterialsCenter />} />
        <Route path="community" element={<Community />} />
        <Route path="resources" element={<LearningResources />} />
        <Route path="internships" element={<InternshipPage />} />
        <Route path="internships/:id" element={<InternshipDetailPage />} />
        <Route path="referrals/:id" element={<ReferralDetailPage />} />
        <Route path="school-selection" element={<SchoolSelectionPage />} />
        <Route path="competitions" element={<CompetitionPage />} />
        <Route path="competitions/:id" element={<CompetitionDetailPage />} />
      </Route>
      
      {/* 默认重定向到官网首页 */}
      <Route path="/" element={<Navigate to="/website" replace />} />
    </Routes>
  );
};

export default AppRoutes; 