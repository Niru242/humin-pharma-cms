'use client';

import { useState } from 'react';
import { IconAlertCircle, IconCalendarStar, IconCheck, IconUserShare, IconX, IconInbox } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface LeaveRequest {
  id: string;
  employeeName: string;
  empCode: string;
  department: string;
  leaveType: string;
  duration: string;
  appliedOn: string;
  reason: string;
  balance: number;
  teamImpact: string;
}

const dummyRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    empCode: 'EMP-001',
    department: 'Engineering',
    leaveType: 'Privilege Leave',
    duration: '2 Days (22 Jul - 23 Jul)',
    appliedOn: '19 Jul 2026',
    reason: 'Family wedding attendance',
    balance: 12.5,
    teamImpact: 'High (3 others on leave)'
  },
  {
    id: '2',
    employeeName: 'Amit Kumar',
    empCode: 'EMP-004',
    department: 'Sales',
    leaveType: 'Sick Leave',
    duration: '1 Day (20 Jul)',
    appliedOn: '20 Jul 2026',
    reason: 'Viral fever and medical consultation',
    balance: 6,
    teamImpact: 'Low'
  },
  {
    id: '3',
    employeeName: 'Priya Patel',
    empCode: 'EMP-003',
    department: 'Quality Assurance',
    leaveType: 'Casual Leave',
    duration: '1 Day (25 Jul)',
    appliedOn: '18 Jul 2026',
    reason: 'Personal administrative work',
    balance: 8,
    teamImpact: 'Low'
  }
];

export default function LeaveInboxPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>(dummyRequests);
  const [searchQuery, setSearchQuery] = useState('');

  // Delegation Modal State
  const [delegateTarget, setDelegateTarget] = useState<LeaveRequest | null>(null);
  const [delegateTo, setDelegateTo] = useState('Dr. Vivek Joshi (Plant Head)');
  const [delegateNote, setDelegateNote] = useState('');

  const filteredRequests = requests.filter(r => 
    r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (req: LeaveRequest) => {
    setRequests(requests.filter(r => r.id !== req.id));
    toast.success('Leave Approved', `${req.leaveType} for ${req.employeeName} has been approved.`);
  };

  const handleReject = (req: LeaveRequest) => {
    setRequests(requests.filter(r => r.id !== req.id));
    toast.error('Leave Rejected', `${req.leaveType} request for ${req.employeeName} was declined.`);
  };

  const handleDelegateSubmit = () => {
    if (!delegateTarget) return;
    setRequests(requests.filter(r => r.id !== delegateTarget.id));
    toast.info('Request Delegated', `Approval for ${delegateTarget.employeeName} forwarded to ${delegateTo}.`);
    setDelegateTarget(null);
    setDelegateNote('');
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Leave Approvals Inbox" description="Review pending leave applications from your team." />
      <ModuleTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Main Inbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
          <StandardTableLayout
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by employee, code, or leave type..."
          >
            <table className="data-grid directory-grid">
              <thead>
                <tr>
                  <th>Employee Details</th>
                  <th>Leave Type & Dates</th>
                  <th>Reason</th>
                  <th>Avail. Balance</th>
                  <th>Team Impact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req.id} className="directory-row">
                    <td>
                      <EmployeeProfileCell
                        firstName={req.employeeName.split(" ")[0]}
                        lastName={req.employeeName.split(" ").slice(1).join(" ")}
                        subtitle={`${req.empCode} • Applied ${req.appliedOn}`}
                      />
                    </td>
                    <td>
                      <div className="font-semibold">{req.duration}</div>
                      <span className="badge badge-info mt-1">{req.leaveType}</span>
                    </td>
                    <td className="text-muted truncate font-medium" style={{ maxWidth: '160px' }}>{req.reason}</td>
                    <td className="font-bold text-primary">{req.balance} Days</td>
                    <td>
                      <div style={{ color: req.teamImpact.includes('High') ? 'var(--danger-color, #ef4444)' : 'var(--success, #10b981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {req.teamImpact.includes('High') ? <IconAlertCircle size={16} /> : <IconCheck size={16} />}
                        <span className="font-medium text-xs">{req.teamImpact}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          className="icon-btn text-muted"
                          title="Delegate Approval"
                          onClick={() => setDelegateTarget(req)}
                        >
                          <IconUserShare size={18} />
                        </button>
                        <button
                          className="icon-btn text-success"
                          title="Approve Leave"
                          onClick={() => handleApprove(req)}
                        >
                          <IconCheck size={18} />
                        </button>
                        <button
                          className="icon-btn text-danger"
                          title="Reject Leave"
                          onClick={() => handleReject(req)}
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState 
                        title="All Caught Up!"
                        message="You have no pending leave requests to approve."
                        icon={<IconCheck size={32} className="text-success" />}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </StandardTableLayout>
        </div>

        {/* Context Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
              <IconCalendarStar size={18} style={{ color: 'var(--brand-500)' }} />
              Team Leave Calendar (Jul 22-26)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div className="font-semibold text-sm">Suresh Menon</div>
                  <div className="text-xs text-muted">Approved PL (Formulation)</div>
                </div>
                <div className="badge badge-warning text-xs">22 Jul - 25 Jul</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <div>
                  <div className="font-semibold text-sm">Anjali Gupta</div>
                  <div className="text-xs text-muted">Approved MatL (HR)</div>
                </div>
                <div className="badge badge-warning text-xs">Till Sep 20</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delegate Modal */}
      {delegateTarget && (
        <Modal
          isOpen={Boolean(delegateTarget)}
          onClose={() => setDelegateTarget(null)}
          title={`Delegate Leave Request: ${delegateTarget.employeeName}`}
          size="md"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDelegateTarget(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelegateSubmit}>Confirm Delegation</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div className="font-bold">{delegateTarget.employeeName} ({delegateTarget.empCode})</div>
              <div className="text-xs text-muted mt-1">{delegateTarget.leaveType} • {delegateTarget.duration}</div>
              <div className="text-xs text-muted">Reason: "{delegateTarget.reason}"</div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Delegate To Authority</label>
              <select
                className="form-control"
                value={delegateTo}
                onChange={(e) => setDelegateTo(e.target.value)}
              >
                <option value="Dr. Vivek Joshi (Plant Head)">Dr. Vivek Joshi (Plant Head)</option>
                <option value="Sarah Jenkins (VP Operations)">Sarah Jenkins (VP Operations)</option>
                <option value="Priya Patel (HR Manager)">Priya Patel (HR Manager)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Delegation Note</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Reason for delegation (e.g. Out of office during applicant's leave duration)..."
                value={delegateNote}
                onChange={(e) => setDelegateNote(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
