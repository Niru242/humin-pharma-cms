import React from 'react';
import { SetPageHeader } from './SetPageHeader';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <>
      {/* We still set the page header context for backward compatibility, but we render the title here too */}
      <SetPageHeader title="" />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontFamily: '"Nunito", sans-serif' }}>
            {title}
          </h2>
          {description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              {description}
            </p>
          )}
        </div>
        
        {children && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {children}
          </div>
        )}
      </div>
    </>
  );
}
