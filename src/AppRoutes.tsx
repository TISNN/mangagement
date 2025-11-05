import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// 导入网站页面
import Layout from './website/Layout';
import HomePage from './website/HomePage';
import AboutPage from './website/AboutPage';
import PricingPage from './website/PricingPage';
import ContactPage from './website/ContactPage';

// 导入管理员页面
import DashboardPage from './pages/admin/Dashboard';
import EmployeeManagementPage from './pages/admin/EmployeeManagementPage';
import EmployeeFormPage from './pages/admin/EmployeeFormPage';
import EmployeeDetailPage from './pages/admin/EmployeeDetailPage';
import TaskManagementPage from './pages/admin/TaskManagement';
import StudentsPage from './pages/admin/StudentsPage/StudentsPage';
import StudentDetailPage from './pages/admin/StudentsPage/StudentDetailPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import ApplicationDetailPage from './pages/admin/ApplicationDetailPage';
import PlanningDetailPage from './pages/admin/PlanningDetailPage';
import LeadsPage from './pages/admin/LeadsPage';
import LeadDetailPage from './pages/admin/LeadDetailPage';
import MentorsPage from './pages/admin/MentorsPage';
import MentorDetailPage from './pages/admin/MentorDetailPage';
import InterviewPage from './pages/admin/InterviewPage';
import CaseStudiesPage from './pages/admin/CaseStudies';
import ContractsPage from './pages/admin/ContractsPage';
import SocialMediaPage from './pages/admin/SocialMediaPage';
import FinancePage from './pages/admin/FinancePage';
import SettingsPage from './pages/admin/SettingsPage';
import SchoolLibraryPage from './pages/admin/SchoolLibraryPage';
import ProgramLibraryPage from './pages/admin/ProgramLibraryPage';
import SchoolDetailPageNew from './pages/admin/SchoolDetailPageNew';
import SmartSchoolSelectionPage from './pages/admin/SmartSchoolSelection';
import ProgramDetailPageNew from './pages/admin/ProgramDetailPageNew';
import AddSchoolPage from './pages/admin/AddSchoolPage';
import AddProgramPage from './pages/admin/AddProgramPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import KnowledgeBase from './pages/admin/KnowledgeBase';
import KnowledgeDetailPage from './pages/admin/KnowledgeDetailPage';
import StudyCopilotPage from './pages/admin/StudyCopilot';
import ConsultationPage from './pages/admin/StudyCopilot/ConsultationPage';
import MeetingsPage from './pages/admin/MeetingsPage';
import MeetingDetailPage from './pages/admin/MeetingDetailPage';
import MeetingDocumentEditorPage from './pages/admin/MeetingDocumentEditorPage';
import AIChatAssistantPage from './pages/AIChatAssistant';

// 导入路由保护组件
import { PrivateRoute } from './components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 网站主页路由 */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      
      {/* 认证相关路由 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* 管理系统路由 - 需要登录才能访问 */}
      <Route path="/admin" element={<PrivateRoute><App /></PrivateRoute>}>
        {/* 默认重定向到控制台 */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* 管理员路由 */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeeManagementPage />} />
        <Route path="employees/new" element={<EmployeeFormPage />} />
        <Route path="employees/edit/:id" element={<EmployeeFormPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="tasks" element={<TaskManagementPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:studentId" element={<StudentDetailPage />} />
        <Route path="study-copilot" element={<StudyCopilotPage />} />
        <Route path="study-copilot/consultation" element={<ConsultationPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="applications/:studentId/planning" element={<PlanningDetailPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:leadId" element={<LeadDetailPage />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="mentors/:id" element={<MentorDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="knowledge/detail/:id" element={<KnowledgeDetailPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="cases" element={<CaseStudiesPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="social" element={<SocialMediaPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="ai-chat-assistant" element={<AIChatAssistantPage />} />
        
        {/* 会议管理 */}
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="meetings/:id" element={<MeetingDetailPage />} />
        <Route path="meeting-documents/new" element={<MeetingDocumentEditorPage />} />
        <Route path="meeting-documents/:id" element={<MeetingDocumentEditorPage />} />
        
        {/* 院校和专业库 */}
        <Route path="school-library" element={<SchoolLibraryPage />} />
        <Route path="school-library/add" element={<AddSchoolPage />} />
        <Route path="program-library" element={<ProgramLibraryPage />} />
        <Route path="program-library/add" element={<AddProgramPage />} />
        
        {/* 智能选校Agent */}
        <Route path="smart-selection" element={<SmartSchoolSelectionPage />} />
        
        {/* 详情页 */}
        <Route path="school/:schoolId" element={<SchoolDetailPageNew />} />
        <Route path="school-detail/:schoolId" element={<SchoolDetailPageNew />} />
        <Route path="program/:programId" element={<ProgramDetailPageNew />} />
        <Route path="programs/:programId" element={<ProgramDetailPageNew />} />
        <Route path="program-detail/:programId" element={<ProgramDetailPageNew />} />
        
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 
