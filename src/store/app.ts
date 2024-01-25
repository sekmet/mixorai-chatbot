import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Wallet = {
  address: string;
  balance: any;
}

interface AppPersistState {
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
  isMobile: boolean;
  setIsMobile: (isPremium: boolean) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      sessionId: null,
      setSessionId: (sessionId) => set(() => ({ sessionId })),
      wallet: null,
      setWallet: (wallet) => set(() => ({ wallet })),
      notificationCount: 0,
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      isMobile: false,
      setIsMobile: (isMobile) => set(() => ({ isMobile }))
    }),
    { name: 'mixoraibot.store' }
  )
);
