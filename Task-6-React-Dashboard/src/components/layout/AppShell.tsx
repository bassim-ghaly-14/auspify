import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const previousMobileOpen = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateScreenSize = () => {
      setIsMobile(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setMobileOpen(false);
      }
    };

    updateScreenSize();
    mediaQuery.addEventListener('change', updateScreenSize);

    return () => {
      mediaQuery.removeEventListener('change', updateScreenSize);
    };
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (previousMobileOpen.current && !mobileOpen && isMobile) {
      mainRef.current?.focus();
    }

    previousMobileOpen.current = mobileOpen;
  }, [mobileOpen, isMobile]);

  useEffect(() => {
    if (!mobileOpen || !isMobile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, isMobile, closeMobileMenu]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} isMobile={isMobile} onSelectItem={closeMobileMenu} />

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <TopBar
          mobileOpen={mobileOpen}
          onToggleMenu={toggleMobileMenu}
          onRefresh={() => {}}
          refreshing={false}
        />

        <main
          ref={mainRef}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto p-4 outline-none sm:p-6"
        >
          {children}
        </main>
      </div>

      {mobileOpen && isMobile && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        />
      )}
    </div>
  );
}
