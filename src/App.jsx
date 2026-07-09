import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages (Loaded synchronously for SEO/Performance)
import Portfolio from './pages/Portfolio';

// Admin Pages (Lazy loaded to reduce main bundle size)
const Login = lazy(() => import('./pages/admin/Login'));
const AppLayout = lazy(() => import('./components/admin-ui/AppLayout'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const SettingsManager = lazy(() => import('./pages/admin/SettingsManager'));
const PersonalInfoManager = lazy(() => import('./pages/admin/PersonalInfoManager'));
const ExperienceManager = lazy(() => import('./pages/admin/ExperienceManager'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const EducationManager = lazy(() => import('./pages/admin/EducationManager'));
const BioLinksManager = lazy(() => import('./pages/admin/BioLinksManager'));

// Admin Loading Fallback
const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Portfolio />} />
      <Route path="/article/:slug" element={<Portfolio />} />
      <Route path="/project/:slug" element={<Portfolio />} />

      {/* Admin Routes with Suspense Boundary */}
      <Route path="/admin" element={
        <Suspense fallback={<AdminLoader />}>
          <Login />
        </Suspense>
      } />

      <Route path="/admin/panel" element={
        <Suspense fallback={<AdminLoader />}>
          <AppLayout />
        </Suspense>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="personal" element={<PersonalInfoManager />} />
        <Route path="experiences" element={<ExperienceManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="qualifications" element={<EducationManager />} />
        <Route path="links" element={<BioLinksManager />} />
      </Route>
    </Routes>
  );
}