import { ReactNode } from "react";
import { create } from "zustand";

type AlertType = {
  title: ReactNode;
  description: ReactNode;
};
interface AlertDialogState {
  isOpen: boolean;
  alert: AlertType;
}
interface AlertDialogAction {
  onClose: () => void;
  showAlert: (alert: AlertType) => void;
}

export const useAlertStore = create<AlertDialogState & AlertDialogAction>(
  (set) => ({
    isOpen: false,
    alert: {
      title: "",
      description: "",
    },
    showAlert: (alert) => {
      set({
        alert: alert,
        isOpen: true,
      });
    },
    onClose: () => {
      set({ isOpen: false });
    },
  })
);
