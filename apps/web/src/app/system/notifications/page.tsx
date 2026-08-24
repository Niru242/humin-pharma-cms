'use client';

import { useState } from 'react';
import { IconBell, IconDeviceMobileMessage, IconMail, IconPencil } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyTemplates = [
  {
    id: '1',
    name: 'Leave Application Submitted',
    module: 'Leave',
    channel: 'Email',
    subject: 'New Leave Request from {{EmployeeName}}',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Shift Roster Published',
    module: 'Time & Attendance',
    channel: 'App Push',
    subject: 'Your shift has been updated',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Missing Punch Alert',
    module: 'Time & Attendance',
    channel: 'SMS',
    subject: 'Action Required: Missing Punch',
    status: 'Draft',
  }
];

export default function NotificationsPage() {
  const [templates, setTemplates] = useState(dummyTemplates);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [channel, setChannel] = useState('Email');

  const getChannelIcon = (c: string) => {
    switch (c) {
      case 'Email': return <IconMail size={16} />;
      case 'SMS': return <IconDeviceMobileMessage size={16} />;
      default: return <IconBell size={16} />;
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Notification Templates" description="Configure email, SMS, and push notification templates with dynamic variables." />
      <div className="page-header">
        </div>
      <ModuleTabs />

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Module</th>
              <th>Channel</th>
              <th>Subject Line</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl) => (
              <tr key={tpl.id}>
                <td className="font-medium">{tpl.name}</td>
                <td>{tpl.module}</td>
                <td>
                  <span className="badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {getChannelIcon(tpl.channel)} {tpl.channel}
                  </span>
                </td>
                <td className="text-muted truncate" style={{ maxWidth: '300px' }}>{tpl.subject}</td>
                <td>
                  <span className={`badge badge-${tpl.status === 'Active' ? 'success' : 'draft'}`}>
                    {tpl.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn text-muted" title="Edit Template" onClick={() => setIsDrawerOpen(true)}>
                      <IconPencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content drawer-large" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Edit Notification Template</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form className="drawer-form-container" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Template Name *</label>
                    <input type="text" className="form-control" defaultValue="Leave Application Submitted" required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Target Module *</label>
                    <select className="form-control" defaultValue="Leave">
                      <option value="Leave">Leave Management</option>
                      <option value="Attendance">Time & Attendance</option>
                      <option value="Payroll">Payroll</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Delivery Channel *</label>
                  <select className="form-control" value={channel} onChange={(e) => setChannel(e.target.value)} required>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Push">Mobile App Push Notification</option>
                  </select>
                </div>

                <div className="form-group full-width" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                  <div className="text-sm font-medium" style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>Available Variables</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{EmployeeName}}`}</span>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{EmployeeCode}}`}</span>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{ManagerName}}`}</span>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{LeaveType}}`}</span>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{Date}}`}</span>
                    <span className="badge badge-draft" style={{ cursor: 'pointer' }}>{`{{URL}}`}</span>
                  </div>
                </div>

                {(channel === 'Email' || channel === 'Push') && (
                  <div className="form-group full-width">
                    <label>Subject / Push Title *</label>
                    <input type="text" className="form-control" defaultValue="New Leave Request from {{EmployeeName}}" required />
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Message Body *</label>
                  <textarea 
                    className="form-control" 
                    rows={8} 
                    required 
                    defaultValue={`Dear {{ManagerName}},\n\n{{EmployeeName}} ({{EmployeeCode}}) has submitted a new {{LeaveType}} request starting from {{Date}}.\n\nPlease review the request by clicking the link below:\n{{URL}}\n\nRegards,\nHRMS Auto Notifier`}
                  ></textarea>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
