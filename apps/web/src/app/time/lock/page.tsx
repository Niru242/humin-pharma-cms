'use client';

import { useState } from 'react';
import { IconAlertTriangle, IconCheck, IconLockOpen, IconShieldCheck } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';

const dummyPeriods = [
  {
    id: '1',
    month: 'June 2026',
    scope: 'Mumbai HO',
    unresolvedExceptions: 0,
    pendingOT: 0,
    status: 'Locked',
    lockedBy: 'Priya Patel (EMP-003)',
    lockDate: '2026-07-02',
  },
  {
    id: '2',
    month: 'July 2026',
    scope: 'Baddi Plant',
    unresolvedExceptions: 12,
    pendingOT: 4,
    status: 'Open',
    lockedBy: null,
    lockDate: null,
  }
];

export default function PeriodLockPage() {
  const [periods, setPeriods] = useState(dummyPeriods);
  const [isLockDrawerOpen, setIsLockDrawerOpen] = useState(false);
  const [isUnlockDrawerOpen, setIsUnlockDrawerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeriods = periods.filter(p => 
    p.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = periods.map(p => 
      p.id === selectedPeriod.id 
        ? { ...p, status: 'Locked', lockedBy: 'HR Admin', lockDate: new Date().toISOString().split('T')[0] } 
        : p
    );
    setPeriods(updated);
    setIsLockDrawerOpen(false);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = periods.map(p => 
      p.id === selectedPeriod.id 
        ? { ...p, status: 'Open', lockedBy: null, lockDate: null } 
        : p
    );
    setPeriods(updated);
    setIsUnlockDrawerOpen(false);
  };

  const openLockWizard = (period: any) => {
    setSelectedPeriod(period);
    if (period.status === 'Locked') {
      setIsUnlockDrawerOpen(true);
    } else {
      setIsLockDrawerOpen(true);
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Attendance Period Lock" description="Freeze attendance processing to prepare final data for Payroll export." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search periods by month or scope..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Payroll Period</th>
              <th>Applicable Scope</th>
              <th>Readiness Checks</th>
              <th>Status</th>
              <th>Locked By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeriods.map((per) => (
              <tr key={per.id} className="directory-row">
                <td className="font-medium text-primary">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconShieldCheck size={18} className={per.status === 'Locked' ? 'text-success' : 'text-muted'} />
                    {per.month}
                  </div>
                </td>
                <td className="font-medium">{per.scope}</td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: per.unresolvedExceptions > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                      {per.unresolvedExceptions > 0 ? <IconAlertTriangle size={16} /> : <IconCheck size={16} />}
                      <span className="text-sm font-medium">{per.unresolvedExceptions} Exceptions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: per.pendingOT > 0 ? 'var(--warning-color)' : 'var(--success-color)' }}>
                      {per.pendingOT > 0 ? <IconAlertTriangle size={16} /> : <IconCheck size={16} />}
                      <span className="text-sm font-medium">{per.pendingOT} Pending OT</span>
                    </div>
                  </div>
                </td>
                <td>
                  <StatusBadge 
                    status={per.status === 'Locked' ? 'Active' : 'Draft'} 
                    customLabel={per.status} 
                  />
                </td>
                <td>
                  {per.lockedBy ? (
                    <div>
                      <div className="text-sm font-medium text-primary">{per.lockedBy}</div>
                      <div className="text-muted text-xs font-bold">{per.lockDate}</div>
                    </div>
                  ) : <span className="text-muted">-</span>}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className={`btn btn-sm ${per.status === 'Locked' ? 'btn-secondary' : 'btn-primary'}`} 
                      onClick={() => openLockWizard(per)}
                    >
                      {per.status === 'Locked' ? 'Unlock' : 'Lock Period'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPeriods.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Periods Found"
                    message="No payroll periods match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {isLockDrawerOpen && selectedPeriod && (
        <div className="drawer-overlay" onClick={() => setIsLockDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Lock Period: {selectedPeriod.month}</h2>
              <button className="close-btn" onClick={() => setIsLockDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleLock} className="drawer-form-container">
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width" style={{ padding: '1rem', background: selectedPeriod.unresolvedExceptions > 0 ? 'var(--danger-color-light)' : 'var(--success-color-light)', borderRadius: '8px', border: `1px solid ${selectedPeriod.unresolvedExceptions > 0 ? 'var(--danger-color)' : 'var(--success-color)'}` }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: selectedPeriod.unresolvedExceptions > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                    {selectedPeriod.unresolvedExceptions > 0 ? <IconAlertTriangle size={20} /> : <IconCheck size={20} />}
                    System Validation Checks
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-color)' }}>
                    <li>{selectedPeriod.unresolvedExceptions} Unresolved Critical Exceptions</li>
                    <li>{selectedPeriod.pendingOT} Pending Overtime Approvals</li>
                    <li>0 Unknown Employee Punches</li>
                  </ul>
                  {selectedPeriod.unresolvedExceptions > 0 && (
                    <p style={{ margin: '0.5rem 0 0 0', fontWeight: 500, color: 'var(--danger-color)' }}>
                      You must resolve all critical exceptions before you can securely lock this period.
                    </p>
                  )}
                </div>

                <div className="form-group full-width" style={{marginTop: '1rem'}}>
                  <label>Lock Reason / Notes *</label>
                  <textarea className="form-control" rows={3} required placeholder="e.g. Finalized for July Payroll"></textarea>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLockDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={selectedPeriod.unresolvedExceptions > 0}>
                  Confirm Lock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUnlockDrawerOpen && selectedPeriod && (
        <div className="drawer-overlay" onClick={() => setIsUnlockDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header" style={{ background: 'var(--danger-color-light)', borderBottomColor: 'var(--danger-color)' }}>
              <h2 style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconLockOpen size={24} />
                Unlock Period: {selectedPeriod.month}
              </h2>
              <button className="close-btn" onClick={() => setIsUnlockDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleUnlock} className="drawer-form-container">
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width">
                  <p style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                    Unlocking a period allows modifications to attendance and overtime data. If payroll has already been processed, unlocking may cause data discrepancies.
                  </p>
                </div>

                <div className="form-group full-width">
                  <label>Unlock Reason *</label>
                  <textarea className="form-control" rows={3} required placeholder="Why is this unlock required? This will be audited."></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Correction Scope *</label>
                  <select className="form-control" required>
                    <option value="All">Entire Scope (All Employees)</option>
                    <option value="Specific">Specific Employees Only</option>
                  </select>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsUnlockDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn" style={{ background: 'var(--danger-color)', color: 'white' }}>
                  Proceed with Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
