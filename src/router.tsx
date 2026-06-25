import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AdminRouter = lazy(() =>
  import('@/admin/router').then((m) => ({ default: m.AdminRouter })),
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    Loading...
  </div>
);

export const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
