import React, { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Drawer({ isOpen, onClose, title, children, footer, size = 'lg' }: DrawerProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getWidth = () => {
    switch(size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'xl': return '1200px';
      case 'lg':
      default: return '800px';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        width: '100%',
        maxWidth: getWidth(),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card)'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>{title}</h2>
          <button className="icon-btn text-muted" onClick={onClose} aria-label="Close drawer">
            <IconX size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          flex: 1,
          background: 'var(--bg-main)'
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {footer}
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
