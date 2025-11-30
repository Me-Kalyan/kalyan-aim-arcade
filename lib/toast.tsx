"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type ToastVariant = "default" | "success" | "error";

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastInternal = Required<ToastOptions>;

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const newToast: ToastInternal = {
      id,
      title: options.title ?? "",
      description: options.description ?? "",
      variant: options.variant ?? "default",
      duration: options.duration ?? 2500,
    };

    setToasts((prev) => [...prev, newToast]);

    // auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}

function ToastViewport({ toasts }: { toasts: ToastInternal[] }) {
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={toastClassForVariant(t.variant)}
        >
          {t.title && (
            <p className="text-xs font-semibold text-ink-primary">
              {t.title}
            </p>
          )}
          {t.description && (
            <p className="mt-0.5 text-[11px] text-ink-soft">
              {t.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function toastClassForVariant(variant: ToastVariant) {
  const base =
    "pointer-events-auto rounded-card border px-3 py-2 shadow-card bg-surface-card";

  switch (variant) {
    case "success":
      return `${base} border-success/40 bg-success/5`;
    case "error":
      return `${base} border-danger/40 bg-danger/5`;
    default:
      return `${base} border-surface-borderSoft`;
  }
}

