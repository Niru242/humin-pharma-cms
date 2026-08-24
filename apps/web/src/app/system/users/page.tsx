'use client';

import { useState } from 'react';
import { IconKey, IconMail, IconShieldCheck, IconUserCheck, IconUserMinus } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyUsers = [
  {
    id: '1',
    employee: 'Rahul Sharma (EMP-001)',
    loginId: 'rahul.sharma',
    email: 'rahul.s@company.com',
    role: 'Super Admin',
    status: 'Active',
    mfaEnabled: true,
    lastLogin: '2026-07-20 10:45 AM'
  },
  {
    id: '2',
    employee: 'Priya Desai (EMP-002)',
    loginId: 'priya.desai',
    email: 'priya.d@company.com',
    role: 'HR Manager',
    status: 'Locked',
    mfaEnabled: false,
    lastLogin: '2026-07-15 09:12 AM'
  }
];

export default function UserIdentityPage() {
  const [users, setUsers] = useState(dummyUsers);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="page-container">
      <SetPageHeader title="User Identity & Access" description="Manage system login credentials, lockouts, and multi-factor authentication." />
      <div className="page-header">
        </div>
      <ModuleTabs />

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Employee Mapping</th>
              <th>System Login ID</th>
              <th>System Role</th>
              <th>Security</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr.id}>
                <td className="font-medium">
                  {usr.employee}
                  <div className="text-muted text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconMail size={14} /> {usr.email}
                  </div>
                </td>
                <td className="font-medium">{usr.loginId}</td>
                <td><span className="badge-outline">{usr.role}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: usr.mfaEnabled ? 'var(--success-color)' : 'var(--warning-color)' }}>
                    <IconShieldCheck size={16} />
                    <span className="text-sm font-medium">{usr.mfaEnabled ? 'MFA Active' : 'MFA Disabled'}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${usr.status === 'Active' ? 'success' : 'danger'}`}>
                    {usr.status}
                  </span>
                </td>
                <td className="text-muted">{usr.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn text-muted" title="Reset Password" onClick={() => setIsDrawerOpen(true)}>
                      <IconKey size={18} />
                    </button>
                    {usr.status === 'Active' ? (
                      <button className="icon-btn text-danger" title="Lock Account">
                        <IconUserMinus size={18} />
                      </button>
                    ) : (
                      <button className="icon-btn text-success" title="Unlock Account">
                        <IconUserCheck size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Reset Password</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form className="drawer-form-container" onSubmit={(e) => { e.preventDefault(); setIsDrawerOpen(false); }}>
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width" style={{ padding: '1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div className="text-muted text-sm">Target User</div>
                  <div className="font-medium">rahul.sharma</div>
                  <div className="text-muted text-sm">rahul.s@company.com</div>
                </div>

                <div className="form-group full-width">
                  <label>Reset Method *</label>
                  <select className="form-control" required>
                    <option value="email">Send Reset Link via Email</option>
                    <option value="manual">Set Manual Temporary Password</option>
                  </select>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Initiate Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
