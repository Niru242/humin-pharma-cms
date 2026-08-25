'use client';

import { useState } from 'react';
import { IconCheck, IconPlus, IconX } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyOT = [
  {
    id: '1',
    employeeName: 'Amit Kumar',
    date: '2026-07-18',
    otType: 'Actual',
    actualMinutes: 240,
    approvedMinutes: 240,
    reason: 'Production target completion after night shift',
    status: 'Approved',
  },
  {
    id: '2',
    employeeName: 'Rajesh Iyer',
    date: '2026-07-19',
    otType: 'Holiday',
    actualMinutes: 480,
    approvedMinutes: 0,
    reason: 'QC urgent sample testing on Sunday',
    status: 'Pending',
  }
];

export default function OvertimePage() {
  const [requests, setRequests] = useState(dummyOT);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [otType, setOtType] = useState('Actual');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(req => 
    req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: Math.random().toString(),
      employeeName: 'Priya Desai',
      date: '2026-07-20',
      otType: otType,
      actualMinutes: 0, // Planned doesn't have actual yet
      approvedMinutes: 0,
      reason: 'Requested via form',
      status: 'Pending',
    };
    setRequests([newReq, ...requests]);
    setIsDrawerOpen(false);
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Overtime Approval" description="Manage planned and actual overtime hours for employees." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Create OT Request"
        searchPlaceholder="Search OT by employee or reason..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>OT Type</th>
              <th>Actual Hours</th>
              <th>Approved Hours</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Manager Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="directory-row">
                <td className="font-medium text-primary">{req.employeeName}</td>
                <td className="font-medium">{req.date}</td>
                <td><span className="badge badge-info">{req.otType}</span></td>
                <td>{req.actualMinutes > 0 ? `${(req.actualMinutes/60).toFixed(1)} Hrs` : '-'}</td>
                <td className={req.approvedMinutes > 0 ? 'text-success font-bold' : 'font-medium'}>
                  {req.approvedMinutes > 0 ? `${(req.approvedMinutes/60).toFixed(1)} Hrs` : '-'}
                </td>
                <td className="text-muted truncate" style={{ maxWidth: '200px' }}>{req.reason}</td>
                <td>
                  <StatusBadge 
                    status={req.status === 'Approved' ? 'Active' : req.status === 'Pending' ? 'Draft' : 'Inactive'} 
                    customLabel={req.status} 
                  />
                </td>
                <td>
                  {req.status === 'Pending' ? (
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn text-success" title="Approve"><IconCheck size={18} /></button>
                      <button className="icon-btn text-danger" title="Reject"><IconX size={18} /></button>
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState 
                    title="No Overtime Requests"
                    message="No OT requests match your search criteria."
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
              <h2>Create OT Request</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width">
                  <label>OT Type *</label>
                  <select className="form-control" value={otType} onChange={(e) => setOtType(e.target.value)} required>
                    <option value="Planned">Planned (Future)</option>
                    <option value="Actual">Actual (Past, from punches)</option>
                    <option value="Holiday">Holiday / Weekly Off Work</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Employee(s) *</label>
                  <select multiple className="form-control" style={{height: '80px'}} required>
                    <option>Rahul Sharma (EMP-001)</option>
                    <option>Priya Desai (EMP-002)</option>
                    <option>Amit Kumar (EMP-003)</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Date *</label>
                  <input type="date" className="form-control" required />
                </div>

                {otType === 'Planned' && (
                  <>
                    <div className="form-group">
                      <label>Planned Start Time *</label>
                      <input type="time" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>Planned End Time *</label>
                      <input type="time" className="form-control" required />
                    </div>
                  </>
                )}

                {otType === 'Actual' && (
                  <div className="form-group full-width">
                    <label>Approved Minutes *</label>
                    <input type="number" className="form-control" required placeholder="e.g. 120" />
                    <small className="text-muted">Manager confirms the actual payable minutes</small>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Reason / Work Description *</label>
                  <textarea className="form-control" rows={3} required placeholder="Why is this OT required?"></textarea>
                </div>
                
                <div className="form-group full-width">
                  <label>Cost Center (Optional)</label>
                  <select className="form-control">
                    <option value="">Default (Employee Department)</option>
                    <option value="1">CC-PROD (Production Base)</option>
                  </select>
                </div>

              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit OT Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
