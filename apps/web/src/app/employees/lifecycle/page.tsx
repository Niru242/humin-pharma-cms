'use client';

import { useState } from 'react';
import { IconArrowRight, IconArrowsRightLeft, IconPlus } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyHistory = [
  {
    id: '1',
    employee: 'Rahul Sharma (EMP-002)',
    type: 'Promotion',
    effectiveDate: '2026-07-01',
    changes: 'Designation: Junior Scientist -> Senior Scientist',
    status: 'Approved'
  },
  {
    id: '2',
    employee: 'Amit Kumar (EMP-004)',
    type: 'Transfer',
    effectiveDate: '2026-08-01',
    changes: 'Plant: Mumbai -> Baddi',
    status: 'Pending'
  }
];

export default function LifecyclePage() {
  const [history, setHistory] = useState(dummyHistory);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionType, setActionType] = useState('Transfer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: Math.random().toString(),
      employee: 'Priya Patel (EMP-003)',
      type: actionType,
      effectiveDate: '2026-09-01',
      changes: 'Pending details',
      status: 'Pending'
    };
    setHistory([newLog, ...history]);
    setIsDrawerOpen(false);
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Employee Lifecycle" description="Process promotions, transfers, role changes, and view historical actions." />
      <div className="page-header">
        <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
          <IconPlus size={20} />
          Initiate Change
        </button>
      </div>

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Action Type</th>
              <th>Effective Date</th>
              <th>Changes Made</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((log) => (
              <tr key={log.id}>
                <td className="font-medium">{log.employee}</td>
                <td>
                  <span className="badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <IconArrowsRightLeft size={14} /> {log.type}
                  </span>
                </td>
                <td className="text-muted">{log.effectiveDate}</td>
                <td>{log.changes}</td>
                <td>
                  <span className={`badge badge-${log.status === 'Approved' ? 'success' : 'draft'}`}>
                    {log.status}
                  </span>
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
              <h2>Initiate Lifecycle Change</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                
                <div className="form-grid" style={{ marginBottom: '2rem' }}>
                  <div className="form-group full-width">
                    <label>Employee *</label>
                    <select className="form-control" required>
                      <option value="">Select Employee...</option>
                      <option>Rahul Sharma (EMP-002)</option>
                      <option>Amit Kumar (EMP-004)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Action Type *</label>
                    <select className="form-control" value={actionType} onChange={(e) => setActionType(e.target.value)} required>
                      <option value="Transfer">Location Transfer</option>
                      <option value="Promotion">Promotion / Grade Change</option>
                      <option value="Reporting">Reporting Manager Change</option>
                      <option value="Confirmation">Probation Confirmation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Effective Date *</label>
                    <input type="date" className="form-control" required />
                  </div>
                </div>

                <div>

                  <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' , fontSize: '1rem', fontWeight: 700}}>Update Attributes</h3>
<div className="card">

                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '1rem', alignItems: 'end' }}>
                    
                    {/* Old Values (Read Only) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="text-muted font-medium" style={{ marginBottom: '0.5rem' }}>Current Values</div>
                      
                      {actionType === 'Transfer' && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Plant</label>
                          <input type="text" className="form-control" disabled value="Mumbai Unit" />
                        </div>
                      )}

                      {actionType === 'Promotion' && (
                        <>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Designation</label>
                            <input type="text" className="form-control" disabled value="Junior Engineer" />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Grade</label>
                            <input type="text" className="form-control" disabled value="L1" />
                          </div>
                        </>
                      )}

                      {actionType === 'Reporting' && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Reporting Manager</label>
                          <input type="text" className="form-control" disabled value="Suresh Menon" />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '0.75rem' }}>
                      <IconArrowRight size={24} className="text-muted" />
                    </div>

                    {/* New Values (Editable) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="text-primary font-medium" style={{ marginBottom: '0.5rem' }}>New Values</div>
                      
                      {actionType === 'Transfer' && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>New Plant</label>
                          <select className="form-control">
                            <option>Pune Warehouse</option>
                            <option>Delhi Office</option>
                          </select>
                        </div>
                      )}

                      {actionType === 'Promotion' && (
                        <>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>New Designation</label>
                            <select className="form-control">
                              <option>Senior Engineer</option>
                              <option>Lead Engineer</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>New Grade</label>
                            <select className="form-control">
                              <option>L2</option>
                              <option>L3</option>
                            </select>
                          </div>
                        </>
                      )}

                      {actionType === 'Reporting' && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>New Manager</label>
                          <select className="form-control">
                            <option>Anjali Gupta</option>
                            <option>Vikram Singh</option>
                          </select>
                        </div>
                      )}
                    </div>

                  </div>
                
</div>
</div>

                <div className="form-group full-width" style={{ marginTop: '2rem' }}>
                  <label>Remarks</label>
                  <textarea className="form-control" rows={3} placeholder="Add any notes about this change..."></textarea>
                </div>

              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Change for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
