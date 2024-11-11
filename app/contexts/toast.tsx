import { CreateToasterReturn } from "@ark-ui/react";
import { createContext, useContext, ReactNode } from "react";
import { Toast } from "terra-design-system/react";

interface ToastContextType {
  showToast: (props: {
    title?: string;
    description?: string;
    close?: {
      label: string;
    };
  }) => void;
  toaster: CreateToasterReturn;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toaster = Toast.createToaster({
    placement: "bottom",
    // overlap: true,
    gap: 16,
    removeDelay: 300,
    duration: 2000,
  });

  const showToast: ToastContextType["showToast"] = ({
    title,
    description,
  }: {
    title?: string;
    description?: string;
    close?: {
      label: string;
    };
  }) => {
    toaster.create({
      title,
      description,
    });
  };

  const ctx = {
    showToast,
    toaster,
  };

  return <ToastContext.Provider value={ctx}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
