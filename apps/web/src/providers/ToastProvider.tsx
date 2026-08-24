'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, type, title, message, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <IconCheck size={18} style={{ color: 'var(--success, #10b981)' }} />;
      case 'error':
        return <IconAlertCircle size={18} style={{ color: 'var(--error, #ef4444)' }} />;
      case 'warning':
        return <IconAlertTriangle size={18} style={{ color: 'var(--warning, #f59e0b)' }} />;
      case 'info':
      default:
        return <IconInfoCircle size={18} style={{ color: 'var(--brand-500, #3b82f6)' }} />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              background: 'var(--bg-card, #ffffff)',
              color: 'var(--text-main, #0f172a)',
              border: `1px solid ${getBorderColor(t.type)}`,
              borderRadius: '12px',
              padding: '14px 16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                marginTop: '2px',
                flexShrink: 0,
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--bg-main, #f8fafc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon(t.type)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.3 }}>
                {t.title}
              </div>
              {t.message && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted, #64748b)',
                    marginTop: '3px',
                    lineHeight: 1.4,
                  }}
                >
                  {t.message}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted, #94a3b8)',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Close notification"
            >
              <IconX size={16} />
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
