import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMaintenanceMode } from './hooks/useMaintenanceMode';

// Public Pages (Loaded synchronously for SEO/Performance)
import Portfolio from './pages/Portfolio';
import ShortURLRedirect from './pages/ShortURLRedirect';
import MaintenancePage from './pages/MaintenancePage';

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
const URLShortenerManager = lazy(() => import('./pages/admin/URLShortenerManager'));
const QRCodeGenerator = lazy(() => import('./pages/admin/QRCodeGenerator'));
const ArticlesManager = lazy(() => import('./pages/admin/ArticlesManager'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const WorksPage = lazy(() => import('./pages/WorksPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

// Brand Splash Screen matching identical hero coordinates down to the subpixel
const BrandSplashScreen = () => (
  <div className="fixed inset-0 z-[9999] bg-white select-none pointer-events-none">
    <div className="relative w-full h-screen overflow-hidden select-none">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="z-20 px-4 w-full flex justify-center items-center">
          <div className="will-change-transform">
            <div className="px-6 sm:px-14 py-3 sm:py-6 overflow-visible relative border border-transparent flex items-center justify-center text-center">
              <h1 className="text-[36px] min-[360px]:text-[44px] min-[400px]:text-[52px] sm:text-[88px] md:text-[116px] lg:text-[144px] font-bold tracking-[-0.04em] leading-none text-[#141414] select-none whitespace-nowrap block text-center m-0 p-0">
                ghiffa.dev
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Admin Loading Fallback
const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const { isMaintenanceMode, loading } = useMaintenanceMode();

  // Only block admin routes while checking maintenance mode; public pages render immediately
  if (loading && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return <AdminLoader />;
  }

  // If maintenance mode is active, show maintenance page for all public routes
  // Admin routes are still accessible
  if (isMaintenanceMode) {
    return (
      <Routes>
        {/* Admin routes remain accessible during maintenance */}
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
          <Route path="articles" element={<ArticlesManager />} />
          <Route path="url-shortener" element={<URLShortenerManager />} />
          <Route path="qr-generator" element={<QRCodeGenerator />} />
        </Route>

        {/* All other routes redirect to maintenance page */}
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Portfolio />} />
      <Route path="/article/:slug" element={
        <Suspense fallback={<BrandSplashScreen />}>
          <ArticleDetailPage />
        </Suspense>
      } />
      <Route path="/articles" element={
        <Suspense fallback={<BrandSplashScreen />}>
          <ArticlesPage />
        </Suspense>
      } />
      <Route path="/works" element={
        <Suspense fallback={<BrandSplashScreen />}>
          <WorksPage />
        </Suspense>
      } />
      <Route path="/projects" element={<Navigate to="/works" replace />} />
      <Route path="/project/:slug" element={
        <Suspense fallback={<BrandSplashScreen />}>
          <ProjectDetailPage />
        </Suspense>
      } />
      <Route path="/work/:slug" element={
        <Suspense fallback={<BrandSplashScreen />}>
          <ProjectDetailPage />
        </Suspense>
      } />
      
      {/* Short URL Redirect */}
      <Route path="/s/:shortCode" element={<ShortURLRedirect />} />

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
        <Route path="articles" element={<ArticlesManager />} />
        <Route path="url-shortener" element={<URLShortenerManager />} />
        <Route path="qr-generator" element={<QRCodeGenerator />} />
      </Route>
    </Routes>
  );
}