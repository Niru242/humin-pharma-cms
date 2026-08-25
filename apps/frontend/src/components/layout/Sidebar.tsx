'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  IconDashboard, 
  IconUsers, 
  IconBuilding, 
  IconSettings, 
  IconFileText, 
  IconClock, 
  IconCalendarStar, 
  IconChartPie, 
  IconBriefcase, 
  IconShieldCheck, 
  IconShield, 
  IconAdjustments 
} from '@tabler/icons-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const MAIN_MODULES = [
  { id: 'dashboard', label: 'Main Dashboard', shortLabel: 'Dashboard', href: '/dashboard', icon: IconDashboard },
  { id: 'employees', label: 'Employee Hub', shortLabel: 'Employees', href: '/employees', icon: IconUsers },
  { id: 'organization', label: 'Organization', shortLabel: 'Organization', href: '/organization/companies', match: '/organization', icon: IconBuilding },
  { id: 'configuration', label: 'Configuration', shortLabel: 'Configuration', href: '/configuration/grades', match: '/configuration', icon: IconSettings },
  { id: 'policies', label: 'Policies', shortLabel: 'Policies', href: '/policies/leave', match: '/policies', icon: IconFileText },
  { id: 'time', label: 'Time & Attendance', shortLabel: 'Attendance', href: '/time/dashboard', match: '/time', icon: IconClock },
  { id: 'leave', label: 'Leave', shortLabel: 'Leave', href: '/leave/dashboard', match: '/leave', icon: IconCalendarStar },
  { id: 'performance', label: 'Performance', shortLabel: 'Performance', href: '/performance/dashboard', match: '/performance', icon: IconChartPie },
  { id: 'payroll', label: 'Payroll & Finance', shortLabel: 'Payroll', href: '/payroll/increments', match: '/payroll', icon: IconBriefcase },
  { id: 'compliance', label: 'Compliance', shortLabel: 'Compliance', href: '/compliance/discipline', match: '/compliance', icon: IconShieldCheck },
  { id: 'system', label: 'System & Admin', shortLabel: 'Admin', href: '/inbox', match: '/(system|inbox)', icon: IconShield },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', href: '/settings', match: '/settings', icon: IconAdjustments }
];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/humin-pharma' : '');

export function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();

  const getActiveModuleId = () => {
    if (pathname.startsWith('/system') || pathname.startsWith('/inbox')) return 'system';
    if (pathname.startsWith('/organization')) return 'organization';
    if (pathname.startsWith('/configuration')) return 'configuration';
    if (pathname.startsWith('/policies')) return 'policies';
    if (pathname.startsWith('/time')) return 'time';
    if (pathname.startsWith('/leave')) return 'leave';
    if (pathname.startsWith('/performance')) return 'performance';
    if (pathname.startsWith('/payroll')) return 'payroll';
    if (pathname.startsWith('/compliance')) return 'compliance';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname.startsWith('/employees')) return 'employees';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeModuleId = getActiveModuleId();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* 1. Profile and Brand Section */}
      <div className="profile-section" onClick={toggle} style={{ cursor: 'pointer' }}>
        <img
          src={isOpen ? `${BASE_PATH}/humin-logo-1.svg` : `${BASE_PATH}/humin-logo-2.svg`}
          alt="Humin Logo"
          width={isOpen ? 80 : 50}
          height={50}
          className="brand-logo-image"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* 2. Unified Navigation Section */}
      <div className="navigation-section">
        {MAIN_MODULES.map((module) => {
          const isActive = module.id === activeModuleId;

          return (
            <Link 
              key={module.id} 
              href={module.href} 
              prefetch={false}
              className={`nav-link ${isActive ? 'active' : ''}`} 
              title={module.label}
            >
              <div className="nav-icon-wrapper">
                <module.icon size={isActive ? 28 : 24} />
              </div>

              {isActive ? (
                <div className="active-label">{module.shortLabel}</div>
              ) : (
                <div className="inactive-label">{module.shortLabel}</div>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
