import { useEffect } from 'react';
import { cn } from '@/utils';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useUIStore } from '@/stores/uiStore';
import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import { LangSwitch } from './components/LangSwitch';
import { BurgerMenuButton } from './components/BurgerMenuButton';
import { MobileNav } from './components/MobileNav';

export const Header = () => {
  const { isScrolled } = useScrollPosition({ threshold: 50 });
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const setScrolled = useUIStore((s) => s.setScrolled);

  // Sync scroll state to store
  useEffect(() => {
    setScrolled(isScrolled);
  }, [isScrolled, setScrolled]);

  return (
    <header
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-[var(--z-sticky)]',
        'transition-all duration-300',
        isScrolled
          ? 'bg-surface/95 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Logo variant="header" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Navigation orientation="horizontal" />
          </div>

          {/* Desktop right side: LangSwitch */}
          <div className="hidden md:flex items-center gap-3">
            <LangSwitch position="header" />
          </div>

          {/* Mobile: Burger */}
          <BurgerMenuButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
        </div>
      </div>

      {/* Mobile Nav overlay/panel */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};
