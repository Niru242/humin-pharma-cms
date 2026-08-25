'use client';

import { useState } from 'react';
import { IconArrowRight, IconDownload, IconFilter, IconHistory } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyLogs = [
  {
    id: 'AL-1001',
    timestamp: '2026-07-20 10:45:12',
    user: 'Super Admin',
    module: 'Employee Master',
    action: 'UPDATE',
    recordId: 'EMP-001',
    ip: '192.168.1.100',
    details: [
      { field: 'Grade', old: 'L1', new: 'L2' },
      { field: 'Basic Salary', old: '45000', new: '55000' }
    ]
  },
  {
    id: 'AL-1002',
    timestamp: '2026-07-20 09:12:00',
    user: 'HR Manager',
    module: 'Time & Attendance',
    action: 'PERIOD_LOCK',
    recordId: 'PER-2026-06',
    ip: '10.0.0.45',
    details: [
      { field: 'Status', old: 'Open', new: 'Locked' }
    ]
  }
];

export default function AuditLogPage() {
  const [logs] = useState(dummyLogs);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  return (
    <div className="page-container">
      <SetPageHeader title="System Audit Log" description="Track all critical actions, data modifications, and security events." />
      <div className="page-header">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">
            <IconDownload size={20} />
            Export Log
          </button>
        </div>
      </div>
      <ModuleTabs />

      <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>Date Range</label>
          <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>Module</label>
          <select className="form-control">
            <option>All Modules</option>
            <option>Employee Master</option>
            <option>Time & Attendance</option>
            <option>System Admin</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>Action</label>
          <select className="form-control">
            <option>All Actions</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>User</label>
          <input type="text" className="form-control" placeholder="Search by username..." />
        </div>
        <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn btn-secondary"><IconFilter size={18} /> Apply</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 260px)' }}>
        
        {/* Log Grid */}
        <div className="data-grid-container" style={{ flex: selectedLog ? '2' : '1', overflow: 'auto', margin: 0 }}>
          <table className="data-grid">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Module</th>
                <th>Action</th>
                <th>Record ID</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  style={{ 
                    cursor: 'pointer', 
                    background: selectedLog?.id === log.id ? 'rgba(var(--primary-color-rgb), 0.05)' : 'transparent',
                    borderLeft: selectedLog?.id === log.id ? '3px solid var(--primary-color)' : '3px solid transparent'
                  }}
                >
                  <td className="text-muted">{log.timestamp}</td>
                  <td className="font-medium">{log.user}</td>
                  <td>{log.module}</td>
                  <td>
                    <span className={`badge badge-${log.action === 'UPDATE' ? 'warning' : 'primary'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="font-medium">{log.recordId}</td>
                  <td className="text-muted text-sm">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Pane */}
        {selectedLog && (
          <div style={{ flex: 1, background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconHistory size={20} className="text-primary" />
                  Action Details
                </h3>
                <div className="text-muted text-sm">{selectedLog.id}</div>
              </div>
              <button className="close-btn" onClick={() => setSelectedLog(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Timestamp</span>
                <span className="font-medium">{selectedLog.timestamp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">User</span>
                <span className="font-medium">{selectedLog.user}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Target Record</span>
                <span className="font-medium">{selectedLog.recordId}</span>
              </div>
            </div>

            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Data Changes</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedLog.details.map((det: any, idx: number) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div className="font-medium" style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>Field: {det.field}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ background: 'var(--danger-color-light)', color: 'var(--danger-color)', padding: '0.5rem', borderRadius: '4px', textDecoration: 'line-through' }}>
                      {det.old}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <IconArrowRight size={16} className="text-muted" />
                    </div>
                    <div style={{ background: 'var(--success-color-light)', color: 'var(--success-color)', padding: '0.5rem', borderRadius: '4px' }}>
                      {det.new}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
