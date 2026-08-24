'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { IconAlarm, IconDownload, IconFilter, IconFingerprint, IconServer } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';

const dummyPunches = [
  {
    id: 'P-10001',
    timestamp: '2026-07-20 08:55:12',
    employeeCode: 'EMP-002',
    device: 'Gate 1 Biometric (DEV-01)',
    punchType: 'In',
    importBatch: 'BATCH-20260720-0900',
    status: 'Processed'
  },
  {
    id: 'P-10002',
    timestamp: '2026-07-20 22:15:45',
    employeeCode: 'EMP-004',
    device: 'Baddi Gate 1 (DEV-04)',
    punchType: 'In',
    importBatch: 'BATCH-20260720-2230',
    status: 'Processed'
  },
  {
    id: 'P-10003',
    timestamp: '2026-07-20 09:15:02',
    employeeCode: 'UNKNOWN-999',
    device: 'Gate 2 Face ID (DEV-02)',
    punchType: 'Unknown',
    importBatch: 'BATCH-20260720-0930',
    status: 'Orphaned'
  },
  {
    id: 'P-10004',
    timestamp: '2026-07-20 18:10:33',
    employeeCode: 'EMP-002',
    device: 'Gate 1 Biometric (DEV-01)',
    punchType: 'Out',
    importBatch: 'BATCH-20260720-1830',
    status: 'Processed'
  }
];

export default function RawPunchesPage() {
  const [punches] = useState(dummyPunches);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPunches = punches.filter(p => 
    p.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterNode = (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Date</label>
        <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Device / Source</label>
        <select className="form-control">
          <option>All Devices</option>
          <option>Gate 1 Biometric</option>
          <option>Gate 2 Face ID</option>
          <option>Mobile App Geo-Punch</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Status</label>
        <select className="form-control">
          <option>All Statuses</option>
          <option>Processed</option>
          <option>Orphaned</option>
          <option>Duplicate</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
        <button className="btn btn-secondary"><IconFilter size={18} /> Apply</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Raw Punch Viewer" description="Immutable log of all source events synced from biometric devices and API integrations." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search punches by employee, device, or ID..."
        filterNode={filterNode}
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp</th>
              <th>Employee Code</th>
              <th>Punch Type</th>
              <th>Device / Source</th>
              <th>Processing Status</th>
              <th>Import Batch</th>
            </tr>
          </thead>
          <tbody>
            {filteredPunches.map((punch) => (
              <tr key={punch.id} className="directory-row">
                <td className="text-muted text-sm font-medium">{punch.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconAlarm size={16} className="text-muted" />
                    <span className="font-medium text-primary">{punch.timestamp}</span>
                  </div>
                </td>
                <td className={punch.employeeCode.includes('UNKNOWN') ? 'text-danger font-bold' : 'font-medium'}>
                  {punch.employeeCode}
                </td>
                <td>
                  <span className={`badge badge-info`}>{punch.punchType}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconFingerprint size={16} className="text-muted" />
                    {punch.device}
                  </div>
                </td>
                <td>
                  <StatusBadge 
                    status={punch.status === 'Processed' ? 'Active' : 'Draft'} 
                    customLabel={punch.status} 
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconServer size={16} className="text-muted" />
                    <a href={`/system/import-jobs?batch=${punch.importBatch}`} className="text-primary text-sm font-medium" style={{ textDecoration: 'none' }}>
                      {punch.importBatch}
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPunches.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No raw punches found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>
    </div>
  );
}
