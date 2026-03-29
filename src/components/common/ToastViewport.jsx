import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useUiStore } from "../../store/uiStore";

const iconMap = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info
};

export default function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] ?? Info;

          return (
            <motion.article
              key={toast.id}
              className={`toast toast--${toast.type ?? "info"}`}
              initial={{ opacity: 0, x: 20, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="toast__icon">
                <Icon size={16} />
              </div>
              <div className="toast__content">
                <strong>{toast.title}</strong>
                {toast.description ? <p>{toast.description}</p> : null}
              </div>
              <button className="toast__close" type="button" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
