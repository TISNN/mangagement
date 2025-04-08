import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import WebsiteRoutes from './website/routes';
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import DataAnalytics from './pages/student/DataAnalytics';
import MaterialsCenter from './pages/student/MaterialsCenter';
import Community from './pages/student/Community';
import LearningResources from './pages/student/LearningResources';
import LoginPage from './pages/LoginPage';
import InterviewPage from './pages/admin/InterviewPage';
import TrainingDetailPage from './pages/admin/TrainingDetailPage';
import InternshipPage from './pages/student/InternshipPage';
import InternshipDetailPage from './pages/student/InternshipDetailPage';
import ReferralDetailPage from './pages/student/ReferralDetailPage';
import SchoolSelectionPage from './pages/admin/SchoolSelectionPage';
import CompetitionPage from './pages/student/CompetitionPage';
import CompetitionDetailPage from './pages/student/CompetitionDetailPage';
import EmployeeManagementPage from './pages/admin/EmployeeManagementPage';
import EmployeeDetailPage from './pages/admin/EmployeeDetailPage';
import EmployeeFormPage from './pages/admin/EmployeeFormPage';
import TeamChatPage from './pages/admin/TeamChatPage';
import TaskManagementPage from './pages/admin/TaskManagementPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import ApplicationDetailPage from './pages/admin/ApplicationDetailPage';
import PlanningDetailPage from './pages/admin/PlanningDetailPage';
import AIModelPage from './pages/admin/AIModelPage';
import SchoolAssistantPage from './pages/admin/SchoolAssistantPage';
import SchoolDetailPage from './pages/admin/SchoolDetailPage';
import ProgramDetailPage from './pages/admin/ProgramDetailPage';
import CaseStudiesPage from './pages/admin/CaseStudiesPage';
import ContractsPage from './pages/admin/ContractsPage';
import FinancePage from './pages/admin/FinancePage';
import SocialMediaPage from './pages/admin/SocialMediaPage';
import SettingsPage from './pages/admin/SettingsPage';
import AttendancePage from './pages/admin/AttendancePage';
import StudentsPage from './pages/admin/StudentsPage/StudentsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import LeadsPage from './pages/admin/LeadsPage';
import MentorsPage from './pages/admin/MentorsPage';
import KnowledgePage from './pages/admin/KnowledgePage';
import KnowledgeDetailPage from './pages/admin/KnowledgeDetailPage';
import DashboardPage from './pages/admin/DashboardPage';
import StudentDetailPage from './pages/admin/StudentsPage/StudentDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 官网路由 */}
      <Route path="/website/*" element={<WebsiteRoutes />} />
      
      {/* 登录页面路由 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 后台管理系统路由 - 所有Admin路由改为嵌套在App组件内 */}
      <Route path="/admin" element={<App />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* 管理页面路由 */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeeManagementPage />} />
        <Route path="employees/new" element={<EmployeeFormPage />} />
        <Route path="employees/edit/:id" element={<EmployeeFormPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="team-chat" element={<TeamChatPage />} />
        <Route path="tasks" element={<TaskManagementPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="interview/:id" element={<TrainingDetailPage />} />
        
        {/* 申请相关路由 */}
        <Route path="applications" element={<ApplicationsPage setCurrentPage={() => {}} />} />
        <Route path="applications/detail" element={<ApplicationDetailPage setCurrentPage={() => {}} />} />
        <Route path="applications/planning-detail" element={<PlanningDetailPage setCurrentPage={() => {}} />} />
        
        {/* 知识库路由 */}
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="knowledge/detail/:id" element={<KnowledgeDetailPage />} />
        
        {/* 添加缺失的其他路由 - 这些路由将使用App.tsx中定义的组件 */}
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:studentId" element={<StudentDetailPage />} />
        <Route path="school-assistant" element={<SchoolAssistantPage />} />
        <Route path="school-detail/:schoolId" element={<SchoolDetailPage />} />
        <Route path="program-detail/:programId" element={<ProgramDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="aiModel" element={<AIModelPage />} />
        <Route path="cases" element={<CaseStudiesPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="social" element={<SocialMediaPage setCurrentPage={() => {}} />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
      </Route>
      
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