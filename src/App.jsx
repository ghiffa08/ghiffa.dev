import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Portfolio from './pages/Portfolio';
import Login from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import HeroManager from './pages/admin/HeroManager';
import AboutManager from './pages/admin/AboutManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import EducationManager from './pages/admin/EducationManager';
import ArticlesManager from './pages/admin/ArticlesManager';
import ContactManager from './pages/admin/ContactManager';

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Portfolio />} />
      <Route path="/article/:slug" element={<Portfolio />} />
      <Route path="/project/:slug" element={<Portfolio />} />

      {/* Admin Auth */}
      <Route path="/admin" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin/panel" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<div>Welcome to CMS Dashboard. Please select an option from the sidebar.</div>} />
        <Route path="hero" element={<HeroManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="experiences" element={<ExperienceManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="qualifications" element={<EducationManager />} />
        <Route path="articles" element={<ArticlesManager />} />
        <Route path="contact" element={<ContactManager />} />
      </Route>
    </Routes>
  );
}