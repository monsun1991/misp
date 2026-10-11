import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ showSidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    el.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white/30 dark:bg-gray-800/50 transition-colors duration-300">
      <Header
        onMenuClick={toggleSidebar}
        showMenuButton={showSidebar}
      />

      <div className="flex overflow-hidden">
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        <main
          ref={mainRef}
          className={cn(
            "h-[calc(100vh-4rem)] top-16",
            "flex-1 bg-white/30 dark:bg-gray-800/50 rounded-lg",
            "overflow-x-hidden",
            "border border-gray-200 dark:border-gray-700",
            "transition-colors duration-300",
            showSidebar ? "m-1 md:m-2 lg:m-3" : "m-2 md:m-3 lg:m-4"
          )}
        >
          <div className="w-full h-full flex flex-col p-2 md:p-3 lg:p-6 gap-responsive">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
