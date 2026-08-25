'use client';
import React, { useState, useRef, useEffect } from 'react';
import { IconBellRinging, IconSearch, IconUserCircle, IconUserPlus, IconUpload, IconCalendarEvent, IconSun, IconMoon } from '@tabler/icons-react';
import { useHeader } from '@/providers/HeaderProvider';
import { OperationsStrip } from '@/components/ui/OperationsStrip';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  // Mock dynamic count, can be updated via API later
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('humin-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('humin-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  return (
    <header className="header clean-header">
      <div className="header-left">
        <div className="header-pill header-pill-left">
          <OperationsStrip
            attentionItems={[
              { id: '1', count: 23, label: 'Attendance Exceptions', type: 'critical' },
              { id: '2', count: 8, label: 'Leave Approvals', type: 'warning' },
              { id: '3', count: 4, label: 'Documents Expiring', type: 'warning' },
            ]}
            quickActions={[
              { id: 'qa1', label: 'Add Employee', icon: <IconUserPlus size={16} /> },
              { id: 'qa2', label: 'Import Attendance', icon: <IconUpload size={16} /> },
              { id: 'qa3', label: 'Assign Shift', icon: <IconCalendarEvent size={16} /> },
            ]}
            syncStatus={{ state: 'success', message: '' }}
          />
        </div>
      </div>
      <div className="header-right">
        <div className="header-pill header-pill-right">
          
          <button
            className="minimal-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{ padding: '6px' }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <IconMoon size={16} style={{ color: 'var(--text-main)' }} />
            ) : (
              <IconSun size={16} style={{ color: 'var(--text-main)' }} />
            )}
          </button>

          <div className={`search-wrapper ${isSearchActive ? 'active' : ''}`}>
            {!isSearchActive ? (
              <button
                className="minimal-btn"
                onClick={() => setIsSearchActive(true)}
                aria-label="Open Search"
                style={{ padding: '6px' }}
              >
                <IconSearch size={16} style={{ color: 'var(--text-main)' }} />
              </button>
            ) : (
              <div className="search-bar active">
                <IconSearch size={16} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search employees, documents..."
                  className="input"
                  style={{ background: 'transparent', boxShadow: 'none', height: '32px' }}
                  onBlur={(e) => {
                    setTimeout(() => setIsSearchActive(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchActive(false);
                      e.currentTarget.blur();
                    }
                  }}
                />
                <div className="search-shortcut">
                  <kbd>Esc</kbd>
                </div>
              </div>
            )}
          </div>

          <button
            className="minimal-btn notification-btn"
            style={{ padding: '6px', position: 'relative', overflow: 'visible' }}
          >
            <IconBellRinging size={16} style={{ color: 'var(--text-main)' }} />
            {unreadNotifications > 0 && (
              <span className="badge" style={{ top: '-4px', right: '-4px', border: '1px solid var(--border-color)', minWidth: '16px', height: '16px', fontSize: '0.6rem', zIndex: 10 }}>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>



          <div className="user-profile" style={{
            background: 'transparent',
            boxShadow: 'none',
            padding: '4px',
            height: 'auto',
            marginLeft: 0,
            gap: '0.5rem'
          }}>
            <div
              className="user-avatar-initials"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--brand-500)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '1px'
              }}
            >
              AU
            </div>
            <div className="user-info">
              <span className="user-name" style={{ fontSize: '0.8rem' }}>Admin User</span>
              <span className="user-role" style={{ fontSize: '0.65rem' }}>Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
