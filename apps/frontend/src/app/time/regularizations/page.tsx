'use client';

import { useState } from 'react';
import { IconAlarm, IconCheck, IconPlus, IconX } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyRequests = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    date: '2026-07-18',
    exceptionType: 'Missing Out',
    correction: 'Requested Out: 18:30',
    reason: 'Forgot to punch out due to lab experiment',
    status: 'Pending',
  },
  {
    id: '2',
    employeeName: 'Sarah Jenkins',
    date: '2026-07-17',
    exceptionType: 'Wrong Status',
    correction: 'Requested: Present',
    reason: 'Biometric machine at HO was offline',
    status: 'Approved',
  }
];

export default function RegularizationPage() {
  const [requests, setRequests] = useState(dummyRequests);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [exceptionType, setExceptionType] = useState('Missing In');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(req => 
    req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.exceptionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: Math.random().toString(),
      employeeName: 'Self',
      date: '2026-07-20',
      exceptionType: exceptionType,
      correction: 'Requested Update',
      reason: 'Submitted via portal',
      status: 'Pending',
    };
    setRequests([newReq, ...requests]);
    setIsDrawerOpen(false);
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Attendance Regularization" description="Request corrections for missing punches or incorrect attendance statuses." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="New Request"
        searchPlaceholder="Search by employee or exception type..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Attendance Date</th>
              <th>Exception Type</th>
              <th>Correction Details</th>
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
                <td>
                  <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <IconAlarm size={14} /> {req.exceptionType}
                  </span>
                </td>
                <td className="text-muted font-medium">{req.correction}</td>
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
                <td colSpan={7}>
                  <EmptyState 
                    title="No Regularizations Found"
                    message="No requests match your search criteria."
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
              <h2>Apply for Regularization</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body form-grid">
                
                <div className="form-group full-width">
                  <label>Employee *</label>
                  <input type="text" className="form-control" disabled value="Self (Current User)" />
                </div>
                
                <div className="form-group full-width">
                  <label>Attendance Date *</label>
                  <input type="date" className="form-control" required />
                </div>
                
                <div className="form-group full-width">
                  <label>Exception Type *</label>
                  <select className="form-control" value={exceptionType} onChange={(e) => setExceptionType(e.target.value)} required>
                    <option value="Missing In">Missing In Punch</option>
                    <option value="Missing Out">Missing Out Punch</option>
                    <option value="Wrong Status">Wrong Status (e.g. Marked Absent but was Present)</option>
                    <option value="Official Duty">On Official Duty / Client Visit</option>
                  </select>
                </div>

                {(exceptionType === 'Missing In' || exceptionType === 'Official Duty') && (
                  <div className="form-group full-width">
                    <label>Requested In Time *</label>
                    <input type="time" className="form-control" required />
                  </div>
                )}

                {(exceptionType === 'Missing Out' || exceptionType === 'Official Duty') && (
                  <div className="form-group full-width">
                    <label>Requested Out Time *</label>
                    <input type="time" className="form-control" required />
                  </div>
                )}

                {exceptionType === 'Wrong Status' && (
                  <div className="form-group full-width">
                    <label>Requested Status *</label>
                    <select className="form-control" required>
                      <option value="Present">Present</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Reason *</label>
                  <textarea className="form-control" rows={3} required placeholder="Explain why the exception occurred..."></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Attachment (Optional)</label>
                  <input type="file" className="form-control" />
                  <small className="text-muted">Attach email approvals or evidence if applicable</small>
                </div>
                
              </div>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
