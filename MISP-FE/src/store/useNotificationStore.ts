import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalFollowupModalState {
    isOpen: boolean;
    modelType: 'contact' | 'lead' | 'deal' | null;
    modelId: string | null;
    assignedId: string | null;
    initialStage: string | null;
}

interface NotificationStore {
    count: number;
    whatsappCount: number;
    fcmToken: string | null;
    isSoundEnabled: boolean;
    notificationSoundUrl: string;
    globalFollowupModal: GlobalFollowupModalState;
    setCount: (count: number) => void;
    setWhatsappCount: (count: number) => void;
    setFcmToken: (token: string) => void;
    setIsSoundEnabled: (enabled: boolean) => void;
    setNotificationSoundUrl: (url: string) => void;
    clearFcmToken: () => void;
    clear: () => void;
    openGlobalFollowupModal: (data: Omit<GlobalFollowupModalState, 'isOpen'>) => void;
    closeGlobalFollowupModal: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set) => ({
            count: 0,
            whatsappCount: 0,
            fcmToken: null,
            isSoundEnabled: true,
            notificationSoundUrl: "https://reverelycrm.s3.ap-south-1.amazonaws.com/dev-crm/attachments/i_phone-1787722220913.mp3",
            globalFollowupModal: {
                isOpen: false,
                modelType: null,
                modelId: null,
                assignedId: null,
                initialStage: null,
            },
            setCount: (count) => set({ count }),
            setWhatsappCount: (count) => set({ whatsappCount: count }),
            setFcmToken: (token) => set({ fcmToken: token }),
            setIsSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
            setNotificationSoundUrl: (url) => set({ notificationSoundUrl: url }),
            clearFcmToken: () => set({ fcmToken: null }),
            clear: () => set({ count: 0, whatsappCount: 0 }),
            openGlobalFollowupModal: (data) => set({ globalFollowupModal: { ...data, isOpen: true } }),
            closeGlobalFollowupModal: () => set((state) => ({ globalFollowupModal: { ...state.globalFollowupModal, isOpen: false } })),
        }),
        {
            name: "notification-store",
            partialize: (state) => ({
                count: state.count,
                whatsappCount: state.whatsappCount,
                fcmToken: state.fcmToken,
                isSoundEnabled: state.isSoundEnabled,
                notificationSoundUrl: state.notificationSoundUrl,
            }),
        }
    )
);
