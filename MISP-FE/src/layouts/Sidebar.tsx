import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  TrendingUp,
  Layers,
  Factory,
  Award,
  Users2,
  Database,
  Settings,
  FileBarChart,
  X,
  ChevronUp,
  ChevronDown,
  Send,
  PackageCheck,
} from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  requiredPermissions?: string[];
  badge?: number;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}


const SidebarItem: React.FC<{ item: SidebarItem; onClick?: () => void }> = ({ item, onClick }) => {
  return (
    <Link
      to={item.href || '#'}
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-1.5 md:py-2 transition-all duration-200 hover:scale-95 relative"
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 md:w-full md:h-11 rounded-lg transition-all duration-200",
        item.isActive
          ? "bg-[#183638] text-[#84cc16] shadow-md shadow-[#183638]/30 border border-[#84cc16]/40"
          : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
      )}>
        <div className={cn(
          "flex items-center justify-center relative",
          item.isActive ? "text-[#84cc16]" : "text-slate-500 dark:text-slate-400"
        )}>
          {item.icon}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ed795d] text-white text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full shadow-md z-10">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </div>
      </div>
      <span className={cn(
        "text-[10px] font-medium text-center hidden md:block leading-tight px-1",
        item.isActive ? "text-[#183638] dark:text-[#84cc16] font-bold" : "text-slate-500 dark:text-slate-400"
      )}>
        {item.label}
      </span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const userPermissions = useUserStore((state) => state.permissions || []);
  const whatsappCount = useNotificationStore((state) => state.whatsappCount);
  const allSidebarItems: SidebarItem[] = useMemo(() => [
    {
      icon: <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <Boxes className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Inventory',
      href: '/inventory',
    },
    {
      icon: <PackageCheck className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Finished Goods',
      href: '/finished-goods',
    },
    {
      icon: <Truck className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Procurement',
      href: '/procurement',
    },
    {
      icon: <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Forecast',
      href: '/forecast',
    },
    {
      icon: <Layers className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Kits',
      href: '/kits',
    },
    {
      icon: <Factory className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Production',
      href: '/production',
    },
    {
      icon: <Send className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Dispatch & POs',
      href: '/orders-dispatch',
    },
    {
      icon: <Award className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Productivity',
      href: '/productivity',
    },
    {
      icon: <Database className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Masters',
      href: '/masters',
    },
    {
      icon: <Users2 className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Workforce',
      href: '/employees',
    },
    {
      icon: <Settings className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Settings',
      href: '/settings',
    },
    {
      icon: <FileBarChart className="h-4 w-4 md:h-5 md:w-5" />,
      label: 'Reports',
      href: '/reports',
    },
  ], [whatsappCount]);

  // Filter sidebar items based on route permissions only.
  const user = useUserStore((state) => state.user);
  const sidebarItems = allSidebarItems.filter(item => {
    if (!item.href) {
      return true;
    }
    const permissionsAllowed = user?.role === 'SuperAdmin' || !item.requiredPermissions || item.requiredPermissions.some((permission: string) => userPermissions.includes(permission));
    return permissionsAllowed;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const nextShowTopArrow = scrollTop > 0;
      const nextShowBottomArrow = scrollTop + clientHeight < scrollHeight - 1;

      setShowTopArrow((current) => (current === nextShowTopArrow ? current : nextShowTopArrow));
      setShowBottomArrow((current) => (current === nextShowBottomArrow ? current : nextShowBottomArrow));
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      const timeoutId = setTimeout(checkScroll, 100);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const scrollBy = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-md md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-16 z-50 md:top-0 md:z-10 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-fit",
        " h-[calc(100vh-4rem)] ", // Mobile: 128px, Medium: 144px, Large: 160px
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-1 md:p-2 lg:p-3 pr-0 md:pr-0 lg:pr-0">

          <div
            className="flex-1 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-gray-600/50 p-2 md:p-3 overflow-hidden relative group"
          >
            {showTopArrow && (
              <div className="absolute top-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
                <button
                  onClick={() => scrollBy(-100)}
                  className="p-1 rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-md shadow-lg border border-white/50 dark:border-gray-600/50 text-primary pointer-events-auto hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-200 animate-bounce"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
            )}

            <div
              ref={scrollContainerRef}
              className="flex flex-col h-full overflow-y-auto no-scrollbar"
            >
              <div className="md:hidden flex items-center justify-center pb-1">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg border border-white/40 dark:border-gray-600/50 hover:bg-white/40 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  onClick={onClose}
                  item={{
                    ...item,
                    isActive:
                      location.pathname === item.href ||
                      location.pathname.startsWith(`${item.href}/`),
                  }}
                />
              ))}
            </div>

            {showBottomArrow && (
              <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
                <button
                  onClick={() => scrollBy(100)}
                  className="p-1 rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-md shadow-lg border border-white/50 dark:border-gray-600/50 text-primary pointer-events-auto hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-200 animate-bounce"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}; 
