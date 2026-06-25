import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AppRouter } from './router';

export const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AppRouter />
    </Suspense>
  </ErrorBoundary>
);
