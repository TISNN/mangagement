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
import ServicesPage from './website/ServicesPage';

// 导入管理员页面
import DashboardPage from './pages/admin/Dashboard';
import EmployeeFormPage from './pages/admin/EmployeeFormPage';
import EmployeeDetailPage from './pages/admin/EmployeeDetailPage';
import TaskManagementPage from './pages/admin/TaskManagement';
import StudyServicesPortalPage from './pages/admin/StudyServices';
import StudentManagementPage from './pages/admin/StudentManagement';
import StudentsPage from './pages/admin/StudentsPage/StudentsPage';
import StudentDetailPage from './pages/admin/StudentsPage/StudentDetailPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import ApplicationDetailPage from './pages/admin/ApplicationDetailPage';
import PlanningDetailPage from './pages/admin/PlanningDetailPage';
import LeadsPage from './pages/admin/LeadsPage';
import LeadDetailPage from './pages/admin/LeadDetailPage';
import MentorManagementPage from './pages/admin/MentorManagement';
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
import KnowledgeGardenPortalPage from './pages/KnowledgeGardenPortalPage';
import MeetingsPage from './pages/admin/MeetingsPage';
import MeetingDetailPage from './pages/admin/MeetingDetailPage';
import MeetingDocumentEditorPage from './pages/admin/MeetingDocumentEditorPage';
import AdminServicesPage from './pages/admin/Services/ServicesPage';
import AIChatAssistantPage from './pages/AIChatAssistant';
import SkyOfficePage from './pages/admin/SkyOfficePage';
import ApplicationWorkbenchPage from './pages/admin/ApplicationWorkbench';
import ProjectMissionBoardPage from './pages/admin/ProjectMissionBoard';
import ServiceChronologyPage from './pages/admin/ServiceChronology';
import { ProjectMarketplaceDetailPage, ProjectMarketplacePage } from './pages/admin/ProjectMarketplace';
import { ProfessorDirectoryPage } from './pages/admin/ProfessorDirectory';
import { CRMLeadOverviewPage } from './pages/admin/CRMLeadOverview';
import { CRMEngagementDeskPage } from './pages/admin/CRMEngagementDesk';
import { CRMContractDockPage } from './pages/admin/CRMContractDock';
import { CRMLeadListPage } from './pages/admin/CRMLeadList';
import { CRMClientInsightsPage } from './pages/admin/CRMClientInsights';
import { CRMCollaborationHubPage } from './pages/admin/CRMCollaborationHub';
import { KnowledgeHubDashboardPage } from './pages/admin/KnowledgeHubDashboard';
import { KnowledgeHubMySpacePage } from './pages/admin/KnowledgeHubMySpace';
import { KnowledgeHubTeamSpacePage } from './pages/admin/KnowledgeHubTeamSpace';
import { KnowledgeHubMarketPage } from './pages/admin/KnowledgeHubMarket';
import KnowledgeHubMarketDetailPage from './pages/admin/KnowledgeHubMarket/KnowledgeHubMarketDetailPage';
import { KnowledgeGardenAdminPage } from './pages/admin/KnowledgeGardenAdmin';
import { KnowledgeModerationPage } from './pages/admin/KnowledgeModeration';
import { KnowledgeSettingsPage } from './pages/admin/KnowledgeSettings';
import FinanceSuitePage from './pages/admin/FinanceSuite/FinanceSuitePage';
import { PlacementAssessmentPage } from './pages/admin/EducationTraining/PlacementAssessment';
import { SchedulingClassroomPage } from './pages/admin/EducationTraining/SchedulingClassroom';
import { LearnerPortalPage } from './pages/admin/EducationTraining/LearnerPortal';
import { TutorPortalPage } from './pages/admin/EducationTraining/TutorPortal';
import { SchoolSelectionPlannerPage } from './pages/admin/SchoolSelectionPlanner';
import {
  ServiceCenterAnalyticsPage,
  ServiceCenterCatalogPage,
  ServiceCenterClientPortalPage,
  ServiceCenterOverviewPage,
  ServiceCenterPage,
  ServiceCenterProjectsPage,
  ServiceCenterResourcesPage,
} from './pages/admin/ServiceCenter';
import {
  EmployeeAndSchedulingPage,
  OnboardingOffboardingCenterPage,
  RecruitmentInterviewCenterPage,
  StaffDetailPage,
  SystemSettingsPage,
} from './pages/admin/InternalManagement';

// 导入路由保护组件
import { PrivateRoute } from './components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 网站主页路由 */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/knowledge-garden" element={<Layout><KnowledgeGardenPortalPage /></Layout>} />
      
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
        <Route path="study-services" element={<StudyServicesPortalPage />} />
        <Route path="employees" element={<Navigate to="/admin/internal-management/employee-and-scheduling" replace />} />
        <Route path="employees/new" element={<EmployeeFormPage />} />
        <Route path="employees/edit/:id" element={<EmployeeFormPage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="tasks" element={<TaskManagementPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="students-legacy" element={<StudentsPage />} />
        <Route path="students/:studentId" element={<StudentDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="applications/:studentId/planning" element={<PlanningDetailPage />} />
        <Route path="application-workbench" element={<ApplicationWorkbenchPage />} />
        <Route path="project-mission-board" element={<ProjectMissionBoardPage />} />
        <Route path="service-chronology" element={<ServiceChronologyPage />} />
        <Route path="project-marketplace" element={<ProjectMarketplacePage />} />
        <Route path="project-marketplace/:projectId" element={<ProjectMarketplaceDetailPage />} />
        <Route path="professor-directory" element={<ProfessorDirectoryPage />} />
        <Route path="crm-lead-overview" element={<CRMLeadOverviewPage />} />
        <Route path="crm-lead-list" element={<CRMLeadListPage />} />
        <Route path="crm-engagement-desk" element={<CRMEngagementDeskPage />} />
        <Route path="crm-contract-dock" element={<CRMContractDockPage />} />
        <Route path="crm-client-insights" element={<CRMClientInsightsPage />} />
        <Route path="crm-collaboration-hub" element={<CRMCollaborationHubPage />} />
        <Route path="internal-management" element={<Navigate to="/admin/internal-management/employee-and-scheduling" replace />} />
        <Route path="internal-management/employee-and-scheduling" element={<EmployeeAndSchedulingPage />} />
        <Route path="internal-management/employee-and-scheduling/:staffId" element={<StaffDetailPage />} />
        <Route path="internal-management/onboarding" element={<OnboardingOffboardingCenterPage />} />
        <Route path="internal-management/recruitment" element={<RecruitmentInterviewCenterPage />} />
        <Route path="internal-management/system-settings" element={<SystemSettingsPage />} />
        <Route path="service-center" element={<ServiceCenterPage />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ServiceCenterOverviewPage />} />
          <Route path="catalog" element={<ServiceCenterCatalogPage />} />
          <Route path="projects" element={<ServiceCenterProjectsPage />} />
          <Route path="resources" element={<ServiceCenterResourcesPage />} />
          <Route path="client-portal" element={<ServiceCenterClientPortalPage />} />
          <Route path="analytics" element={<ServiceCenterAnalyticsPage />} />
        </Route>
        <Route path="knowledge-hub" element={<Navigate to="/admin/knowledge-hub/dashboard" replace />} />
        <Route path="knowledge-hub/dashboard" element={<KnowledgeHubDashboardPage />} />
        <Route path="knowledge-hub/my-space" element={<KnowledgeHubMySpacePage />} />
        <Route path="knowledge-hub/team-space" element={<KnowledgeHubTeamSpacePage />} />
        <Route path="knowledge-hub/market" element={<KnowledgeHubMarketPage />} />
        <Route path="knowledge-hub/market/:marketId" element={<KnowledgeHubMarketDetailPage />} />
        <Route path="knowledge-hub/garden" element={<KnowledgeGardenAdminPage />} />
        <Route path="knowledge-hub/moderation" element={<KnowledgeModerationPage />} />
        <Route path="knowledge-hub/settings" element={<KnowledgeSettingsPage />} />
        <Route path="school-selection-planner" element={<SchoolSelectionPlannerPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:leadId" element={<LeadDetailPage />} />
        <Route path="mentors" element={<MentorManagementPage />} />
        <Route path="mentors-legacy" element={<MentorsPage />} />
        <Route path="mentors/:id" element={<MentorDetailPage />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="knowledge/detail/:id" element={<KnowledgeDetailPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="cases" element={<CaseStudiesPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="social" element={<SocialMediaPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="finance-suite" element={<FinanceSuitePage />} />
        <Route path="education-training/placement-assessment" element={<PlacementAssessmentPage />} />
        <Route path="education-training/scheduling-classroom" element={<SchedulingClassroomPage />} />
        <Route path="education-training/learner-portal" element={<LearnerPortalPage />} />
        <Route path="education-training/tutor-portal" element={<TutorPortalPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="ai-chat-assistant" element={<AIChatAssistantPage />} />
        <Route path="sky-office" element={<SkyOfficePage />} />
        
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
