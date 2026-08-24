'use client';

import { useState } from 'react';
import { IconAlarm, IconDownload, IconFilter } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';

const dummyAttendance = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    employeeCode: 'EMP-002',
    shift: 'GEN (09:00 - 18:00)',
    firstIn: '08:55',
    lastOut: '18:10',
    workHours: '09:15',
    lateMinutes: 0,
    earlyMinutes: 0,
    otMinutes: 0,
    status: 'Present',
    exception: null,
  },
  {
    id: '2',
    employeeName: 'Amit Kumar',
    employeeCode: 'EMP-004',
    shift: 'Night (22:00 - 06:00)',
    firstIn: '22:15',
    lastOut: '06:00',
    workHours: '07:45',
    lateMinutes: 15,
    earlyMinutes: 0,
    otMinutes: 0,
    status: 'Present',
    exception: 'Late In',
  },
  {
    id: '3',
    employeeName: 'Priya Patel',
    employeeCode: 'EMP-003',
    shift: 'GEN (09:00 - 18:00)',
    firstIn: '--:--',
    lastOut: '--:--',
    workHours: '00:00',
    lateMinutes: 0,
    earlyMinutes: 0,
    otMinutes: 0,
    status: 'Absent',
    exception: 'Missing Punch',
  }
];

export default function AttendanceRegisterPage() {
  const [records, setRecords] = useState(dummyAttendance);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records.filter(r => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSearch = r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present': return 'Active';
      case 'Absent': return 'Inactive';
      case 'Leave': return 'Active';
      case 'Half Day': return 'Draft';
      default: return 'Draft';
    }
  };

  const filterNode = (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Date</label>
        <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Plant / Location</label>
        <select className="form-control">
          <option>All Plants</option>
          <option>Mumbai HO</option>
          <option>Baddi Plant</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Department</label>
        <select className="form-control">
          <option>All Departments</option>
          <option>Production</option>
          <option>Quality Control</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Status Filter</label>
        <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Half Day">Half Day</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
        <button className="btn btn-secondary"><IconFilter size={18} /> Apply</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Attendance Register" description="Daily view of employee in/out punches, work hours, and exceptions." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search employees..."
        filterNode={filterNode}
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Planned Shift</th>
              <th>First In</th>
              <th>Last Out</th>
              <th>Work Hrs</th>
              <th>Late (Min)</th>
              <th>OT (Min)</th>
              <th>Status</th>
              <th>Exceptions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="directory-row">
                <td>
                  <div className="font-medium">{rec.employeeName}</div>
                  <div className="text-muted text-sm">{rec.employeeCode}</div>
                </td>
                <td className="text-muted">{rec.shift}</td>
                <td className="font-medium text-primary">{rec.firstIn}</td>
                <td className="font-medium text-primary">{rec.lastOut}</td>
                <td>{rec.workHours}</td>
                <td>
                  {rec.lateMinutes > 0 ? (
                    <span className="badge badge-danger">{rec.lateMinutes}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {rec.otMinutes > 0 ? (
                    <span className="badge badge-success">{rec.otMinutes}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <StatusBadge status={getStatusBadge(rec.status)} customLabel={rec.status} />
                </td>
                <td>
                  {rec.exception ? (
                    <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IconAlarm size={14} /> {rec.exception}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>No attendance records found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>
    </div>
  );
}
