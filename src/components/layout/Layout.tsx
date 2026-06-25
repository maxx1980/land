import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import { ToastContainer } from '@/components/ui/Toast';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    <SkipToContent />
    <Header />
    <main id="main-content">{children}</main>
    <Footer />
    <ScrollToTopButton />
    <ToastContainer />
  </>
);
