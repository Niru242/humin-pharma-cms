'use client';

import { useState } from 'react';
import { IconCalendarStar, IconInfoCircle, IconUpload, IconDeviceFloppy, IconCheck, IconFileCheck } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { useToast } from '@/providers/ToastProvider';

export default function LeaveApplyPage() {
  const toast = useToast();
  const [leaveType, setLeaveType] = useState('PL');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');

  const balances: Record<string, number> = {
    'PL': 12.5,
    'SL': 6,
    'CL': 3,
    'LWP': 0
  };

  const handleFileUpload = () => {
    setFileName('Medical_Certificate_Jul2026.pdf');
    toast.info('Document Attached', 'Medical_Certificate_Jul2026.pdf uploaded successfully.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate) {
      toast.error('Validation Error', 'Please choose a start date.');
      return;
    }

    const leaveTypeLabel = leaveType === 'PL' ? 'Privilege Leave' : leaveType === 'SL' ? 'Sick Leave' : leaveType === 'CL' ? 'Casual Leave' : 'Leave';
    toast.success('Leave Request Submitted', `${leaveTypeLabel} for ${fromDate} has been submitted for supervisor approval.`);
    setReason('');
    setFromDate('');
    setToDate('');
    setFileName('');
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Apply for Leave" description="Submit a new leave request. Your balances are shown below." />
      <ModuleTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Form Section */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Name & ID</label>
              <input type="text" className="form-control" value="Rahul Sharma (EMP-001) • Formulation R&D" disabled />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Leave Type *</label>
              <select className="form-control" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                <option value="PL">Privilege Leave (PL) - Annual Leave</option>
                <option value="SL">Sick Leave (SL) - Medical</option>
                <option value="CL">Casual Leave (CL) - Urgent Personal</option>
                <option value="LWP">Leave Without Pay (LWP)</option>
                <option value="MatL">Maternity / Paternity Leave</option>
              </select>
              <small className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <IconInfoCircle size={14} style={{ color: 'var(--brand-500)' }} /> Available Entitlement Balance: <strong>{balances[leaveType] !== undefined ? `${balances[leaveType]} days` : 'N/A'}</strong>
              </small>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0' }}>
              <input
                type="checkbox"
                id="halfDay"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="halfDay" style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                Apply for Half Day Session
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>From Date *</label>
                <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
              </div>

              {!isHalfDay ? (
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>To Date *</label>
                  <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Session Half *</label>
                  <select className="form-control" required>
                    <option value="first">First Half (Morning Session)</option>
                    <option value="second">Second Half (Afternoon Session)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Reason for Leave *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="State the purpose of absence..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Supporting Document / Certificate (Optional)</label>
              <div
                onClick={handleFileUpload}
                style={{
                  border: '2px dashed var(--border-color)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: fileName ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                }}
              >
                {fileName ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    <IconFileCheck size={28} />
                    <span className="font-semibold">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <IconUpload size={28} className="text-muted" style={{ margin: '0 auto 6px' }} />
                    <div style={{ color: 'var(--brand-600)', fontWeight: 600, fontSize: '0.875rem' }}>Click to upload medical certificate or travel proof</div>
                    <div className="text-muted text-xs mt-1">PDF, JPG, PNG (Max 5MB)</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { setReason(''); setFromDate(''); setToDate(''); setFileName(''); }}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                <IconDeviceFloppy size={18} />
                <span>Submit Leave Request</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--brand-600, #2563eb), var(--brand-800, #1e40af))', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
              <IconCalendarStar size={20} />
              Leave Balances (YTD)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(balances).map(([type, bal]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>
                  <span>{type === 'PL' ? 'Privilege Leave' : type === 'SL' ? 'Sick Leave' : type === 'CL' ? 'Casual Leave' : 'Leave Without Pay'}</span>
                  <span style={{ fontWeight: 800 }}>{bal} Days</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700 }}>Upcoming Public Holidays</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="font-semibold">Independence Day</span>
                <span className="badge badge-info">15 Aug</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="font-semibold">Ganesh Chaturthi</span>
                <span className="badge badge-info">07 Sep</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="font-semibold">Gandhi Jayanti</span>
                <span className="badge badge-info">02 Oct</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
