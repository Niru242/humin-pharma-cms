'use client';

import { useState } from 'react';
import { IconAlertTriangle, IconDownload, IconFilter, IconLock, IconRefresh } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';

const dummySummary = [
  {
    id: '1',
    employee: 'Sarah Jenkins (EMP-001)',
    department: 'Operations',
    totalDays: 31,
    present: 22,
    weeklyOff: 4,
    holiday: 1,
    paidLeave: 3,
    lwp: 1,
    absent: 0,
    payableDays: 30,
    lateDays: 2,
    otHours: 12.5,
    status: 'Calculated'
  },
  {
    id: '2',
    employee: 'Rahul Sharma (EMP-002)',
    department: 'R&D',
    totalDays: 31,
    present: 24,
    weeklyOff: 4,
    holiday: 1,
    paidLeave: 2,
    lwp: 0,
    absent: 0,
    payableDays: 31,
    lateDays: 0,
    otHours: 0,
    status: 'Calculated'
  },
  {
    id: '3',
    employee: 'Amit Kumar (EMP-004)',
    department: 'Production',
    totalDays: 31,
    present: 20,
    weeklyOff: 4,
    holiday: 1,
    paidLeave: 0,
    lwp: 0,
    absent: 6,
    payableDays: 25,
    lateDays: 5,
    otHours: 24,
    status: 'Exceptions Pending'
  }
];

export default function MonthlySummaryPage() {
  const [data] = useState(dummySummary);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(row => 
    row.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterNode = (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Summary Month</label>
        <select className="form-control" defaultValue="2026-07">
          <option value="2026-07">July 2026</option>
          <option value="2026-06">June 2026</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Department</label>
        <select className="form-control">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Production</option>
          <option>Sales</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Status</label>
        <select className="form-control">
          <option>All Statuses</option>
          <option>Calculated</option>
          <option>Exceptions Pending</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
        <button className="btn btn-secondary"><IconFilter size={18} /> Filter Data</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Monthly Attendance Summary" description="Consolidated pre-payroll attendance metrics for the selected month." />
      <div className="page-header" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">
            <IconRefresh size={20} />
            Recalculate
          </button>
          <button className="btn btn-primary">
            <IconLock size={20} />
            Lock Period
          </button>
        </div>
      </div>
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search employee or department..."
        filterNode={filterNode}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="data-grid directory-grid" style={{ minWidth: '1200px' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ borderRight: '1px solid var(--border-color)' }}>Employee</th>
                <th rowSpan={2}>Total Days</th>
                <th colSpan={6} style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>Attendance Breakdown</th>
                <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', background: 'rgba(var(--primary-color-rgb), 0.05)' }}>Payroll Metrics</th>
              </tr>
              <tr>
                <th>Present</th>
                <th>W-Off</th>
                <th>Holiday</th>
                <th>Paid Leave</th>
                <th>LWP</th>
                <th style={{ borderRight: '1px solid var(--border-color)' }}>Absent</th>
                
                <th style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }}>Payable Days</th>
                <th style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }}>Late Days</th>
                <th style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }}>Total OT (Hrs)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="directory-row">
                  <td style={{ borderRight: '1px solid var(--border-color)' }}>
                    <div className="font-medium text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {row.status === 'Exceptions Pending' && <IconAlertTriangle size={16} className="text-danger" />}
                      {row.employee}
                    </div>
                    <div className="text-sm text-muted font-bold">{row.department}</div>
                  </td>
                  <td className="font-medium">{row.totalDays}</td>
                  
                  {/* Breakdown */}
                  <td>{row.present}</td>
                  <td>{row.weeklyOff}</td>
                  <td>{row.holiday}</td>
                  <td>{row.paidLeave}</td>
                  <td className={row.lwp > 0 ? 'text-warning font-medium' : ''}>{row.lwp}</td>
                  <td style={{ borderRight: '1px solid var(--border-color)' }} className={row.absent > 0 ? 'text-danger font-bold' : ''}>{row.absent}</td>
                  
                  {/* Payroll Metrics */}
                  <td style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }} className="font-bold text-primary">{row.payableDays}</td>
                  <td style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }}>
                    {row.lateDays > 0 ? <span className="text-danger font-bold">{row.lateDays}</span> : row.lateDays}
                  </td>
                  <td style={{ background: 'rgba(var(--primary-color-rgb), 0.05)' }} className="font-medium">
                    {row.otHours > 0 ? <span className="text-success font-bold">{row.otHours}</span> : row.otHours}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center' }}>
                    <EmptyState 
                      title="No Employees Found"
                      message="No attendance metrics match your search."
                      icon={<IconAlertTriangle size={32} />}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </StandardTableLayout>

    </div>
  );
}
