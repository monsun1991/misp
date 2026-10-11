import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from './useNotificationStore';

export const useUserStore = create<any>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      owners: null,
      permissions: [],
      permissionsLoaded: false,
      profileImage: null,
      error: null,
      isExternal: false,

      // Actions
      setAuth: (accessToken: string, refreshToken: string, user: any, owners: any, permissions: string[] = [], isExternal: boolean = false) => {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
          owners,
          permissions,
          permissionsLoaded: true,
          isExternal,
        });
      },

      setPermissions: (permissions: string[] = []) => {
        set({ permissions });
      },

      setPermissionsLoaded: (permissionsLoaded: boolean) => {
        set({ permissionsLoaded });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          owners: null,
          permissions: [],
          permissionsLoaded: false,
          profileImage: null,
          isExternal: false,
        });
        useNotificationStore.getState().setCount(0);

      },

      updateUser: (userData: Partial<any>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
        user: { ...currentUser, ...userData },
          });
        }
      },

      setToken: (accessToken: string) => {
        set({ accessToken });
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken });
      },

      setError: (error: string | string[] | null) => {
        set({ error });
      },

      setProfileImage: (profileImage: string | null) => {
        set({ profileImage });
      },

      setIsExternal: (isExternal: boolean) => {
        set({ isExternal });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        owners: state.owners,
        permissions: state.permissions,
        permissionsLoaded: state.permissionsLoaded,
        profileImage: state.profileImage,
        isExternal: state.isExternal,
      }),
    }
  )
);
