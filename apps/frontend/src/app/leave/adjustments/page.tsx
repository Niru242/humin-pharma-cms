'use client';

import { useState } from 'react';
import { IconCheck, IconHistory, IconPlus } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';

const dummyLogs = [
  {
    id: '1',
    date: '2026-07-20',
    employee: 'Rahul Sharma (EMP-001)',
    leaveType: 'Comp-Off',
    action: 'Credit',
    days: 1.0,
    reason: 'Worked on Sunday (Jul 19) for production issue',
    performedBy: 'HR Admin'
  },
  {
    id: '2',
    date: '2026-07-15',
    employee: 'Amit Kumar (EMP-003)',
    leaveType: 'PL',
    action: 'Debit',
    days: 0.5,
    reason: 'Leave encashment requested',
    performedBy: 'System Auto'
  }
];

export default function LeaveAdjustmentPage() {
  const [logs, setLogs] = useState(dummyLogs);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [action, setAction] = useState('Credit');
  const [days, setDays] = useState(1);

  const filteredLogs = logs.filter(log => 
    log.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.leaveType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      employee: 'Priya Desai (EMP-002)',
      leaveType: 'PL',
      action: action,
      days: Number(days),
      reason: 'Manual adjustment via admin panel',
      performedBy: 'Current Admin'
    };
    setLogs([newLog, ...logs]);
    setIsDrawerOpen(false);
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Leave Adjustments" description="Manually credit, debit, or lapse employee leave balances." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee or leave type..."
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="New Adjustment"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Action</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="directory-row">
                <td className="text-muted font-medium">{log.date}</td>
                <td className="font-medium text-primary">{log.employee}</td>
                <td><span className="badge badge-info">{log.leaveType}</span></td>
                <td>
                  <StatusBadge 
                    status={log.action === 'Credit' ? 'Active' : log.action === 'Debit' ? 'Inactive' : 'Draft'} 
                    customLabel={log.action} 
                  />
                </td>
                <td className="font-bold">
                  {log.action === 'Credit' ? <span className="text-success">+{log.days}</span> : <span className="text-danger">-{log.days}</span>}
                </td>
                <td className="text-muted truncate font-medium" style={{ maxWidth: '250px' }}>{log.reason}</td>
                <td className="text-sm font-bold text-muted">{log.performedBy}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState 
                    title="No Adjustments Found"
                    message="No history matches your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>New Balance Adjustment</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width">
                  <label>Employee(s) *</label>
                  <select multiple className="form-control" style={{height: '80px'}} required>
                    <option>Rahul Sharma (EMP-001)</option>
                    <option>Priya Desai (EMP-002)</option>
                    <option>Amit Kumar (EMP-003)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Leave Type *</label>
                  <select className="form-control" required>
                    <option value="PL">Privilege Leave (PL)</option>
                    <option value="Comp-Off">Compensatory Off</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Action *</label>
                  <select className="form-control" value={action} onChange={(e) => setAction(e.target.value)} required>
                    <option value="Credit">Credit (Add)</option>
                    <option value="Debit">Debit (Deduct)</option>
                    <option value="Lapse">Lapse (Expire)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Number of Days *</label>
                  <input type="number" step="0.5" min="0.5" className="form-control" value={days} onChange={(e) => setDays(Number(e.target.value))} required />
                </div>

                <div className="form-group full-width">
                  <label>Reason / Remarks *</label>
                  <textarea className="form-control" rows={3} required placeholder="Why is this balance being adjusted?"></textarea>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
