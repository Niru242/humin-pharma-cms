'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './ModuleTabs.css';

export function ModuleTabs() {
  const pathname = usePathname();

  const getTabs = () => {
    if (pathname.startsWith('/organization')) {
      return [
        { label: 'Overview', href: '/organization' },
        { label: 'Companies', href: '/organization/companies' },
        { label: 'Plants', href: '/organization/plants' },
        { label: 'Departments', href: '/organization/departments' },
        { label: 'Designations', href: '/organization/designations' },
        { label: 'Positions', href: '/organization/positions' },
      ];
    }
    if (pathname.startsWith('/configuration')) {
      return [
        { label: 'Grades', href: '/configuration/grades' },
        { label: 'Shifts', href: '/configuration/shifts' },
        { label: 'Holidays', href: '/configuration/holidays' },
      ];
    }
    if (pathname.startsWith('/policies')) {
      return [
        { label: 'Leave Policy', href: '/policies/leave' },
        { label: 'Attendance Policy', href: '/policies/attendance' },
      ];
    }
    if (pathname.startsWith('/time')) {
      return [
        { label: 'Dashboard', href: '/time/dashboard' },
        { label: 'Attendance Register', href: '/time/register' },
        { label: 'Shift Roster', href: '/time/roster' },
        { label: 'Regularizations', href: '/time/regularizations' },
        { label: 'Exception Queue', href: '/time/exceptions' },
        { label: 'Overtime', href: '/time/overtime' },
        { label: 'Raw Punches', href: '/time/raw-punches' },
        { label: 'Punch Import', href: '/time/punch-import' },
        { label: 'Monthly Summary', href: '/time/monthly' },
        { label: 'Period Lock', href: '/time/lock' },
      ];
    }
    if (pathname.startsWith('/leave')) {
      return [
        { label: 'Dashboard', href: '/leave/dashboard' },
        { label: 'Apply Request', href: '/leave/apply' },
        { label: 'Approvals', href: '/leave/approvals' },
        { label: 'Balances', href: '/leave/balances' },
        { label: 'Adjustments', href: '/leave/adjustments' },
      ];
    }
    if (pathname.startsWith('/employees')) {
      return [
        { label: 'Directory', href: '/employees' },
        { label: 'Add Employee', href: '/employees/add' },
        { label: 'HR Remarks', href: '/employees/remarks' },
        { label: 'Lifecycle', href: '/employees/lifecycle' },
      ];
    }
    if (pathname.startsWith('/performance')) {
      return [
        { label: 'Dashboard', href: '/performance/dashboard' },
        { label: 'Reviews', href: '/performance/reviews' },
        { label: 'Evidence Tracking', href: '/performance/evidence' },
        { label: 'HOD Scores', href: '/performance/scores' },
        { label: 'Configuration', href: '/performance/config' },
        { label: 'Report Card Config', href: '/performance/report-card-config' },
      ];
    }
    if (pathname.startsWith('/payroll')) {
      return [
        { label: 'Increments', href: '/payroll/increments' },
        { label: 'Loans', href: '/payroll/loans' },
        { label: 'Incentive Slots', href: '/payroll/incentives' },
      ];
    }
    if (pathname.startsWith('/compliance')) {
      return [
        { label: 'Discipline', href: '/compliance/discipline' },
        { label: 'Decisions', href: '/compliance/decisions' },
        { label: 'Punch Rules', href: '/compliance/punches' },
      ];
    }
    if (pathname.startsWith('/system') || pathname === '/inbox') {
      return [
        { label: 'Inbox', href: '/inbox' },
        { label: 'Users', href: '/system/users' },
        { label: 'Roles & Access', href: '/system/roles' },
        { label: 'Workflows', href: '/system/workflows' },
        { label: 'Bulk Import', href: '/system/import' },
        { label: 'Import Jobs', href: '/system/import-jobs' },
        { label: 'Notifications', href: '/system/notifications' },
        { label: 'Audit Log', href: '/system/audit' },
      ];
    }
    
    return [];
  };

  const tabs = getTabs();

  if (tabs.length === 0) return null;

  return (
    <>
      <div className="module-tabs-container">
        {tabs.map((tab) => (
          <Link 
            key={tab.href} 
            href={tab.href}
            className={`module-tab ${pathname.replace(/\/$/, '') === tab.href.replace(/\/$/, '') ? 'active' : ''}`}
          >
            {tab.label}
            {pathname.replace(/\/$/, '') === tab.href.replace(/\/$/, '') && <span className="tab-indicator" />}
          </Link>
        ))}
      </div>
    </>
  );
}
