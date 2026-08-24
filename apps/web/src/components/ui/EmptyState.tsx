import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 0', animation: 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'var(--bg-hover)', 
        border: '1px solid var(--border-color)',
        color: 'var(--brand-500)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 1.5rem auto',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ transform: 'scale(1.5)' }}>
          {icon}
        </div>
      </div>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', letterSpacing: '-0.025em' }}>{title}</h3>
      <p className="text-muted" style={{ marginBottom: action ? '2rem' : '0', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>{message}</p>
      {action && <div style={{ marginTop: '2rem' }}>{action}</div>}
    </div>
  );
}
