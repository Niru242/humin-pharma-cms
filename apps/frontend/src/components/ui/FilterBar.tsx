import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="filter-bar" style={{ 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '1rem', 
      padding: '1rem 0', 
      background: 'transparent',
      borderBottom: '1px solid var(--border-color)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      {children}
    </div>
  );
}

export function FilterGroup({ children, flex = 1 }: { children: React.ReactNode, flex?: number }) {
  return (
    <div className="form-group" style={{ margin: 0, flex }}>
      {children}
    </div>
  );
}

export function FilterAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
      {children}
    </div>
  );
}
