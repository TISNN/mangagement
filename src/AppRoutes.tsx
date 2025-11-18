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
import LeadDetailPage from './pages/admin/LeadDetailPage';
import MentorManagementPage, { MentorMarketplacePage } from './pages/admin/MentorManagement';
import MentorDetailPage from './pages/admin/MentorDetailPage';
import InterviewPage from './pages/admin/InterviewPage';
import CaseStudiesPage from './pages/admin/CaseStudies';
import SocialMediaPage from './pages/admin/SocialMediaPage';
import SettingsPage from './pages/admin/SettingsPage';
import SchoolLibraryPage from './pages/admin/SchoolLibraryPage';
import ProgramLibraryPage from './pages/admin/ProgramLibraryPage';
import SchoolDetailPageNew from './pages/admin/SchoolDetailPageNew';
import ProgramDetailPageNew from './pages/admin/ProgramDetailPageNew';
import AddSchoolPage from './pages/admin/AddSchoolPage';
import AddProgramPage from './pages/admin/AddProgramPage';
// import ProjectsPage from './pages/admin/ProjectsPage'; // 服务项目页面已删除
// import KnowledgeBase from './pages/admin/KnowledgeBase'; // 已迁移到知识库中心，不再使用
import KnowledgeDetailPage from './pages/admin/KnowledgeDetailPage';
import KnowledgeGardenPortalPage from './pages/KnowledgeGardenPortalPage';
import MeetingsPage from './pages/admin/MeetingsPage';
import MeetingDetailPage from './pages/admin/MeetingDetailPage';
import MeetingDocumentEditorPage from './pages/admin/MeetingDocumentEditorPage';
import AdminServicesPage from './pages/admin/Services/ServicesPage';
import AIChatAssistantPage from './pages/AIChatAssistant';
import SkyOfficePage from './pages/admin/SkyOfficePage';
import ApplicationWorkbenchPage from './pages/admin/ApplicationWorkbench';
import ApplicationWorkstationPage from './pages/admin/ApplicationWorkstation';
import ProjectMissionBoardPage from './pages/admin/ProjectMissionBoard';
import ServiceChronologyPage from './pages/admin/ServiceChronology';
import { ProjectMarketplaceDetailPage, ProjectMarketplacePage } from './pages/admin/ProjectMarketplace';
import { ProfessorDirectoryPage, ProfessorDetailPage } from './pages/admin/ProfessorDirectory';
import PhDOpportunitiesPage from './pages/admin/PhDOpportunities/PhDOpportunitiesPage';
import PhDOpportunityDetailPage from './pages/admin/PhDOpportunities/PhDOpportunityDetailPage';
import PartnerManagementPage from './pages/admin/PartnerManagement/PartnerManagementPage';
import { CRMContractDockPage } from './pages/admin/CRMContractDock';
import { CRMLeadListPage } from './pages/admin/CRMLeadList';
import { CRMClientInsightsPage } from './pages/admin/CRMClientInsights';
import { CRMCollaborationHubPage } from './pages/admin/CRMCollaborationHub';
import { CRMTemplateLibraryPage, CRMTemplateDetailPage } from './pages/admin/CRMTemplateLibrary';
import { KnowledgeHubMarketPage } from './pages/admin/KnowledgeHubMarket';
import KnowledgeHubMarketDetailPage from './pages/admin/KnowledgeHubMarket/KnowledgeHubMarketDetailPage';
import MyPublishedPage from './pages/admin/KnowledgeHubMarket/MyPublishedPage';
import { CloudDocsHomePage } from './pages/admin/CloudDocsHome';
import { CloudDocsDrivePage } from './pages/admin/CloudDocsDrive';
import { CloudDocsKnowledgePage } from './pages/admin/CloudDocsKnowledge';
import { CloudDocumentEditorPage } from './pages/admin/CloudDocsDocument';
import FinanceSuitePage from './pages/admin/FinanceSuite/FinanceSuitePage';
import { InstitutionIntroductionPage } from './pages/admin/InstitutionIntroduction';
// 教育培训相关页面导入 - 暂时隐藏
// import { PlacementAssessmentPage } from './pages/admin/EducationTraining/PlacementAssessment';
// import { SchedulingClassroomPage } from './pages/admin/EducationTraining/SchedulingClassroom';
// import { LearnerPortalPage } from './pages/admin/EducationTraining/LearnerPortal';
// import { TutorPortalPage } from './pages/admin/EducationTraining/TutorPortal';
import AppCenterPage from './pages/admin/AppCenter/AppCenterPage';
import { SchoolSelectionPlannerPage } from './pages/admin/SchoolSelectionPlanner';
import AIRecommendationPage from './pages/admin/SchoolSelectionPlanner/AIRecommendationPage';
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
  RecruitmentInterviewCenterPage,
  StaffDetailPage,
} from './pages/admin/InternalManagement';
import {
  SharedOfficeSpacePage,
  OverviewPage,
  MySpacesPage,
  SearchSpacesPage,
  MyRequestsPage,
  MyBookingsPage,
  SpaceDetailPage,
  CreateSpacePage,
  CreateRequestPage,
  RequestDetailPage,
} from './pages/admin/SharedOfficeSpace';
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import DataAnalytics from './pages/student/DataAnalytics';
import ApplicationProgressPage from './pages/student/ApplicationProgressPage';
import MaterialsCenter from './pages/student/MaterialsCenter';
import InternshipPage from './pages/student/InternshipPage';
import InternshipDetailPage from './pages/student/InternshipDetailPage';
import ReferralDetailPage from './pages/student/ReferralDetailPage';
import SchoolSelectionPage from './pages/student/SchoolSelectionPage';
import CompetitionPage from './pages/student/CompetitionPage';
import CompetitionDetailPage from './pages/student/CompetitionDetailPage';
import Community from './pages/student/Community';
import LearningResources from './pages/student/LearningResources';

// 导入路由保护组件
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import NotFoundPage from './pages/NotFoundPage';

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
      <Route
        path="/admin"
        element={
          <AuthProvider>
            <PrivateRoute>
              <App />
            </PrivateRoute>
          </AuthProvider>
        }
      >
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
        {/* <Route path="projects" element={<ProjectsPage />} /> 服务项目页面已删除 */}
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="applications/:studentId/planning" element={<PlanningDetailPage />} />
        <Route path="application-workbench" element={<ApplicationWorkbenchPage />} />
        <Route path="application-workstation" element={<ApplicationWorkstationPage />} />
        <Route path="project-mission-board" element={<ProjectMissionBoardPage />} />
        <Route path="service-chronology" element={<ServiceChronologyPage />} />
        <Route path="project-marketplace" element={<ProjectMarketplacePage />} />
        <Route path="project-marketplace/:projectId" element={<ProjectMarketplaceDetailPage />} />
        <Route path="institution-introduction" element={<InstitutionIntroductionPage />} />
        <Route path="professor-directory" element={<ProfessorDirectoryPage />} />
        <Route path="professor-directory/:professorId" element={<ProfessorDetailPage />} />
        <Route path="phd-opportunities" element={<PhDOpportunitiesPage />} />
        <Route path="phd-opportunities/:positionId" element={<PhDOpportunityDetailPage />} />
        <Route path="partner-management" element={<PartnerManagementPage />} />
        <Route path="crm-lead-list" element={<CRMLeadListPage />} />
        <Route path="crm-template-library" element={<CRMTemplateLibraryPage />} />
        <Route path="crm-template-library/:templateId" element={<CRMTemplateDetailPage />} />
        <Route path="crm-contract-dock" element={<CRMContractDockPage />} />
        <Route path="crm-client-insights" element={<CRMClientInsightsPage />} />
        <Route path="crm-collaboration-hub" element={<CRMCollaborationHubPage />} />
        <Route path="internal-management" element={<Navigate to="/admin/internal-management/employee-and-scheduling" replace />} />
        <Route path="internal-management/employee-and-scheduling" element={<EmployeeAndSchedulingPage />} />
        <Route path="internal-management/employee-and-scheduling/:staffId" element={<StaffDetailPage />} />
        <Route path="internal-management/recruitment" element={<RecruitmentInterviewCenterPage />} />
        <Route path="service-center" element={<ServiceCenterPage />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ServiceCenterOverviewPage />} />
          <Route path="catalog" element={<ServiceCenterCatalogPage />} />
          <Route path="projects" element={<ServiceCenterProjectsPage />} />
          <Route path="resources" element={<ServiceCenterResourcesPage />} />
          <Route path="client-portal" element={<ServiceCenterClientPortalPage />} />
          <Route path="analytics" element={<ServiceCenterAnalyticsPage />} />
        </Route>
        <Route path="cloud-docs" element={<Navigate to="/admin/cloud-docs/home" replace />} />
        <Route path="cloud-docs/home" element={<CloudDocsHomePage />} />
        <Route path="cloud-docs/drive" element={<CloudDocsDrivePage />} />
        <Route path="cloud-docs/knowledge" element={<CloudDocsKnowledgePage />} />
        <Route path="cloud-docs/documents/new" element={<CloudDocumentEditorPage />} />
        <Route path="cloud-docs/documents/:id" element={<CloudDocumentEditorPage />} />
        <Route path="knowledge-hub" element={<Navigate to="/admin/knowledge-hub/market" replace />} />
        <Route path="knowledge-hub/market" element={<KnowledgeHubMarketPage />} />
        <Route path="knowledge-hub/market/my-published" element={<MyPublishedPage />} />
        <Route path="knowledge-hub/market/:marketId" element={<KnowledgeHubMarketDetailPage />} />
        <Route path="knowledge-hub/garden" element={<Navigate to="/admin/knowledge-hub/market/my-published" replace />} />
        <Route path="school-selection-planner" element={<SchoolSelectionPlannerPage />} />
        <Route path="school-selection-planner/ai-recommendation/:studentId" element={<AIRecommendationPage />} />
        <Route path="leads/:leadId" element={<LeadDetailPage />} />
        <Route path="mentors" element={<MentorManagementPage />} />
        <Route path="mentor-marketplace" element={<MentorMarketplacePage />} />
        <Route path="mentors/:id" element={<MentorDetailPage />} />
        {/* 知识库页面已迁移到知识库中心 */}
        <Route path="knowledge" element={<Navigate to="/admin/cloud-docs/knowledge" replace />} />
        <Route path="knowledge/detail/:id" element={<KnowledgeDetailPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="cases" element={<CaseStudiesPage />} />
        <Route path="social" element={<SocialMediaPage />} />
        <Route path="finance-suite" element={<FinanceSuitePage />} />
        {/* 教育培训相关路由 - 暂时隐藏 */}
        {/* <Route path="education-training/placement-assessment" element={<PlacementAssessmentPage />} /> */}
        {/* <Route path="education-training/scheduling-classroom" element={<SchedulingClassroomPage />} /> */}
        {/* <Route path="education-training/learner-portal" element={<LearnerPortalPage />} /> */}
        {/* <Route path="education-training/tutor-portal" element={<TutorPortalPage />} /> */}
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="ai-chat-assistant" element={<AIChatAssistantPage />} />
        <Route path="sky-office" element={<SkyOfficePage />} />
        <Route path="app-center" element={<AppCenterPage />} />
        
        {/* 会议管理 */}
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="meetings/:id" element={<MeetingDetailPage />} />
        <Route path="meeting-documents/new" element={<MeetingDocumentEditorPage />} />
        <Route path="meeting-documents/:id" element={<MeetingDocumentEditorPage />} />
        
        {/* 共享办公空间 */}
        <Route path="shared-office" element={<SharedOfficeSpacePage />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="my-spaces" element={<MySpacesPage />} />
          <Route path="my-spaces/new" element={<CreateSpacePage />} />
          <Route path="my-spaces/:id/edit" element={<CreateSpacePage />} />
          <Route path="search" element={<SearchSpacesPage />} />
          <Route path="my-requests" element={<MyRequestsPage />} />
          <Route path="my-requests/new" element={<CreateRequestPage />} />
          <Route path="my-requests/:id/edit" element={<CreateRequestPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
        </Route>
        <Route path="shared-office/spaces/:id" element={<SpaceDetailPage />} />
        <Route path="shared-office/requests/:id" element={<RequestDetailPage />} />
        
        {/* 院校和专业库 */}
        <Route path="school-library" element={<SchoolLibraryPage />} />
        <Route path="school-library/add" element={<AddSchoolPage />} />
        <Route path="program-library" element={<ProgramLibraryPage />} />
        <Route path="program-library/add" element={<AddProgramPage />} />
        
        {/* 详情页 */}
        <Route path="school/:schoolId" element={<SchoolDetailPageNew />} />
        <Route path="school-detail/:schoolId" element={<SchoolDetailPageNew />} />
        <Route path="program/:programId" element={<ProgramDetailPageNew />} />
        <Route path="programs/:programId" element={<ProgramDetailPageNew />} />
        <Route path="program-detail/:programId" element={<ProgramDetailPageNew />} />
        
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 学生系统路由 */}
      <Route
        path="/student"
        element={
          <AuthProvider>
            <PrivateRoute>
              <StudentLayout />
            </PrivateRoute>
          </AuthProvider>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="analytics" element={<DataAnalytics />} />
        <Route path="application-progress" element={<ApplicationProgressPage />} />
        <Route path="materials" element={<MaterialsCenter />} />
        <Route path="internships" element={<InternshipPage />} />
        <Route path="internships/:id" element={<InternshipDetailPage />} />
        <Route path="referrals/:id" element={<ReferralDetailPage />} />
        <Route path="school-selection" element={<SchoolSelectionPage />} />
        <Route path="competitions" element={<CompetitionPage />} />
        <Route path="competitions/:id" element={<CompetitionDetailPage />} />
        <Route path="community" element={<Community />} />
        <Route path="resources" element={<LearningResources />} />
      </Route>


      {/* 404 路由 - 显示 404 页面而不是重定向到首页 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
