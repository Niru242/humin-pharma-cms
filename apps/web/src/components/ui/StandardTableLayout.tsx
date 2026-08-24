import React from 'react';
import { IconFilter, IconPlus, IconSearch } from '@tabler/icons-react';
import { GlobalFilters } from '@/components/ui/GlobalFilters';

interface StandardTableLayoutProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;
  addBtnText?: string;
  searchPlaceholder?: string;
  filterNode?: React.ReactNode;
  children: React.ReactNode;
}

export function StandardTableLayout({
  searchQuery,
  onSearchChange,
  onAddClick,
  addBtnText,
  searchPlaceholder = 'Search...',
  filterNode,
  children
}: StandardTableLayoutProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="table-wrapper">
      <div
        className="filter-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          fontFamily: '"Nunito", sans-serif'
        }}
      >
        <div className="search-bar" style={{ position: 'relative', flex: '1 1 auto', maxWidth: '350px' }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.75rem',
              borderRadius: '9999px',
              border: '1px solid #e5e7eb',
              outline: 'none',
              fontSize: '0.875rem',
              fontFamily: '"Nunito", sans-serif',
              color: '#374151'
            }}
          />
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <GlobalFilters />
          
          {filterNode && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid #e5e7eb',
                backgroundColor: showFilters ? '#f3f4f6' : '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontFamily: '"Nunito", sans-serif',
                transition: 'all 0.2s'
              }}
            >
              <IconFilter size={18} />
              Filters
            </button>
          )}
          {onAddClick && addBtnText && (
            <button
              type="button"
              onClick={onAddClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: '"Nunito", sans-serif'
              }}
            >
              <IconPlus size={18} style={{ marginRight: '0.25rem' }} />
              {addBtnText}
            </button>
          )}
        </div>
      </div>

      {filterNode && showFilters && (
        <div style={{ marginTop: '1rem', animation: 'fadeIn 0.2s ease-in-out' }}>
          {filterNode}
        </div>
      )}

      <div className="data-grid-container">
        {children}
      </div>
    </div>
  );
}
