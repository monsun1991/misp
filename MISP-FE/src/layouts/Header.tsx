import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, User, Moon, Sun, ExternalLink, MapPin, Building2, ChevronDown, Check } from 'lucide-react';
import React from 'react';
import { useUserStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useDarkModeStore } from '@/store/useDarkModeStore';
import { useMipsStore } from '@/store/useMipsStore';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '@/utils/common';
import { useAuth } from '@/api/queries/auth';
interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = false,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const { profileImage } = useUserStore();
  const logout = useUserStore((state) => state.logout);
  const notificationCount = useNotificationStore((state) => state.count);
  const user = useUserStore((state) => state.user);
  const isExternal = useUserStore((state) => state.isExternal);
  const { isDarkMode, toggleDarkMode } = useDarkModeStore();
  const accessToken = useUserStore((state) => state.accessToken);
  const { logoutMutation } = useAuth();

  const hostname = window.location.hostname.toLowerCase();
  const isManasum = hostname.includes("manasum");

  const { selectedPlant, setSelectedPlant, plants } = useMipsStore();

  const plantOptions = [
    ...(plants || []).map((p) => ({
      id: p.name,
      name: p.name,
      description: `${p.type} • ${p.city}`,
    })),
    {
      id: 'All Plants (Global View)',
      name: 'All Plants (Global View)',
      description: 'Consolidated Multi-Plant Enterprise View',
    },
  ];

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await logoutMutation.mutateAsync({ accessToken });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.clear();
      logout();
      navigate('/login');
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full  bg-transparent">
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Left side - Logo */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <img src={isManasum ? "/manasum.svg" : "/assets/eiffel-logo.jpg"} alt="Logo" className="h-14 mix-blend-multiply dark:mix-blend-normal" />
          </div>
        </div>

        {/* Right side - Location Selector + Dark Mode + Notifications + User */}
        <div className="flex items-center gap-3">

          {/* UBAC Plant / Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-400/20 animate-pulse" />
                  <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">{selectedPlant}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-1.5" align="end">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Facility / Plant (UBAC)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Switch operating plant context
                </div>
              </div>

              {plantOptions.map((plant) => {
                const isSelected = selectedPlant === plant.id;
                return (
                  <DropdownMenuItem
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-[#183638] text-[#d4e967] font-semibold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#84cc16]' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{plant.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#84cc16]" />}
                      </div>
                      <span className={`text-[10px] font-normal ${isSelected ? 'text-[#c6d9d4]' : 'text-slate-400 dark:text-slate-500'}`}>
                        {plant.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium leading-none">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              </div>
            )}
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >

                <Avatar className="rounded-full shadow-lg ring-4 ring-white/80 dark:ring-gray-800/80 overflow-hidden">
                  <AvatarImage
                    src={profileImage || ""}
                    alt="@user"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="bg-primaryColor1/10 text-primaryColor1 font-semibold">
                    {getInitials(user?.fullName || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" align="end" forceMount>

              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>

              {isExternal && (
                <DropdownMenuItem
                  onClick={() => {
                    const assistUrl = import.meta.env.VITE_ROLE_SELECT_URL;
                    if (assistUrl) {
                      window.location.href = `${assistUrl}`;
                    }
                  }}
                  className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Switch Application
                </DropdownMenuItem>
              )}

              {!isExternal && (
                <>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Log out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </header>
  );
};
