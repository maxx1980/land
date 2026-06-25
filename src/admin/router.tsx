import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const NavigationPage = lazy(() => import('./pages/NavigationPage').then((m) => ({ default: m.NavigationPage })));
const HeroPage = lazy(() => import('./pages/HeroPage').then((m) => ({ default: m.HeroPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const TeamPage = lazy(() => import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage').then((m) => ({ default: m.TestimonialsPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ThemesPage = lazy(() => import('./pages/ThemesPage').then((m) => ({ default: m.ThemesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const Loader = () => (
  <div className="flex items-center justify-center h-32 text-slate-400">Загрузка...</div>
);

export const AdminRouter = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route element={<AdminLayout />}>
      <Route
        index
        element={
          <Suspense fallback={<Loader />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="navigation"
        element={
          <Suspense fallback={<Loader />}>
            <NavigationPage />
          </Suspense>
        }
      />
      <Route
        path="hero"
        element={
          <Suspense fallback={<Loader />}>
            <HeroPage />
          </Suspense>
        }
      />
      <Route
        path="about"
        element={
          <Suspense fallback={<Loader />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="contact"
        element={
          <Suspense fallback={<Loader />}>
            <ContactPage />
          </Suspense>
        }
      />
      <Route
        path="projects"
        element={
          <Suspense fallback={<Loader />}>
            <ProjectsPage />
          </Suspense>
        }
      />
      <Route
        path="services"
        element={
          <Suspense fallback={<Loader />}>
            <ServicesPage />
          </Suspense>
        }
      />
      <Route
        path="team"
        element={
          <Suspense fallback={<Loader />}>
            <TeamPage />
          </Suspense>
        }
      />
      <Route
        path="testimonials"
        element={
          <Suspense fallback={<Loader />}>
            <TestimonialsPage />
          </Suspense>
        }
      />
      <Route
        path="gallery"
        element={
          <Suspense fallback={<Loader />}>
            <GalleryPage />
          </Suspense>
        }
      />
      <Route
        path="themes"
        element={
          <Suspense fallback={<Loader />}>
            <ThemesPage />
          </Suspense>
        }
      />
      <Route
        path="settings"
        element={
          <Suspense fallback={<Loader />}>
            <SettingsPage />
          </Suspense>
        }
      />
    </Route>
  </Routes>
);
