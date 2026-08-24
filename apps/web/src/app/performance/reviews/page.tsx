'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconEye, IconBellRinging, IconDeviceFloppy, IconStar, IconAward } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface ReviewItem {
  id: string;
  employeeName: string;
  empCode: string;
  department: string;
  cycle: string;
  reviewerName: string;
  score: number | null;
  maxScore: number;
  status: 'Completed' | 'Pending HOD' | 'In Progress';
  kpis?: { name: string; weight: string; score: number; feedback: string }[];
  hodComments?: string;
}

const dummyReviews: ReviewItem[] = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    empCode: 'EMP-001',
    department: 'Engineering',
    cycle: 'Q3 2026',
    reviewerName: 'Dr. Vivek Joshi',
    score: 4.5,
    maxScore: 5.0,
    status: 'Completed',
    hodComments: 'Exceptional ownership on the plant automation upgrade and PLC telemetry dashboard.',
    kpis: [
      { name: 'Technical Execution & Uptime', weight: '40%', score: 4.8, feedback: 'Zero unplanned downtime during maintenance window.' },
      { name: 'GxP & Safety Compliance', weight: '30%', score: 4.5, feedback: 'Followed all cleanroom protocol documentation.' },
      { name: 'Collaboration & Leadership', weight: '30%', score: 4.2, feedback: 'Trained two junior technicians effectively.' },
    ],
  },
  {
    id: '2',
    employeeName: 'Priya Patel',
    empCode: 'EMP-003',
    department: 'Quality Assurance',
    cycle: 'Q3 2026',
    reviewerName: 'Sarah Jenkins',
    score: null,
    maxScore: 5.0,
    status: 'Pending HOD',
  },
  {
    id: '3',
    employeeName: 'Amit Kumar',
    empCode: 'EMP-004',
    department: 'Sales',
    cycle: 'Q3 2026',
    reviewerName: 'Priya Patel',
    score: 4.2,
    maxScore: 5.0,
    status: 'Completed',
    hodComments: 'Exceeded regional quarterly distribution targets across North Zone.',
    kpis: [
      { name: 'Sales Quota Attainment', weight: '50%', score: 4.5, feedback: '112% quota achieved.' },
      { name: 'Customer Relationship / SLA', weight: '30%', score: 4.0, feedback: 'High customer satisfaction rating.' },
      { name: 'Reporting Timeliness', weight: '20%', score: 3.8, feedback: 'Minor delay on weekly summary.' },
    ],
  }
];

export default function PerformanceReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>(dummyReviews);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeName: '',
    empCode: 'EMP-015',
    department: 'Formulation R&D',
    cycle: 'Q3 2026',
    reviewerName: 'Dr. Vivek Joshi (HOD)',
    dueDate: '30 Aug 2026',
  });

  const handleAssignReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName) {
      toast.error('Required Fields Missing', 'Please enter employee name.');
      return;
    }

    const newReview: ReviewItem = {
      id: `${Date.now()}`,
      employeeName: formData.employeeName,
      empCode: formData.empCode,
      department: formData.department,
      cycle: formData.cycle,
      reviewerName: formData.reviewerName,
      score: null,
      maxScore: 5.0,
      status: 'Pending HOD',
    };

    setReviews([newReview, ...reviews]);
    setIsAssignDrawerOpen(false);
    setFormData({
      employeeName: '',
      empCode: 'EMP-015',
      department: 'Formulation R&D',
      cycle: 'Q3 2026',
      reviewerName: 'Dr. Vivek Joshi (HOD)',
      dueDate: '30 Aug 2026',
    });
    toast.success('Review Assigned', `Appraisal cycle assigned for ${newReview.employeeName}.`);
  };

  const handleSendReminder = (reviewerName: string, empName: string) => {
    toast.info('Appraisal Reminder Dispatched', `Notification sent to reviewer ${reviewerName} regarding ${empName}.`);
  };

  const filteredReviews = reviews.filter(r => 
    r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Employee Reviews" description="Monitor and track the progress of performance reviews across the organization." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee, code, or department..."
        onAddClick={() => setIsAssignDrawerOpen(true)}
        addBtnText="Assign Reviewer"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>Review Cycle</th>
              <th>Assigned Reviewer</th>
              <th>HOD Score</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(r => (
              <tr key={r.id} className="directory-row">
                <td>
                  <EmployeeProfileCell
                    firstName={r.employeeName.split(" ")[0]}
                    lastName={r.employeeName.split(" ").slice(1).join(" ")}
                    subtitle={`${r.empCode} • ${r.department}`}
                  />
                </td>
                <td className="font-medium">{r.cycle}</td>
                <td className="text-muted text-sm">{r.reviewerName}</td>
                <td>
                  {r.score ? (
                    <span className="font-bold text-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconStar size={16} fill="#10b981" />
                      {r.score.toFixed(1)} / {r.maxScore.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted font-medium">Pending Rating</span>
                  )}
                </td>
                <td>
                  <StatusBadge 
                    status={r.status === 'Completed' ? 'Active' : 'Pending'} 
                    customLabel={r.status} 
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {r.status === 'Completed' ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        title="View Scorecard"
                        onClick={() => setSelectedReview(r)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <IconEye size={16} />
                        <span>Scorecard</span>
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm text-warning"
                        title="Send Reminder"
                        onClick={() => handleSendReminder(r.reviewerName, r.employeeName)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <IconBellRinging size={16} />
                        <span>Remind</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Reviews Found"
                    message="No reviews match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Assign Reviewer Drawer */}
      <Drawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        title="Assign Performance Reviewer"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsAssignDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAssignReview}>
              <IconDeviceFloppy size={18} />
              <span>Assign Appraisal</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleAssignReview} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ramesh Kumar"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Formulation R&D">Formulation R&D</option>
                <option value="Engineering">Engineering</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Production Core">Production Core</option>
                <option value="Sales">Sales & Marketing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Review Cycle</label>
              <select
                className="form-control"
                value={formData.cycle}
                onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
              >
                <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
                <option value="Q4 2026">Q4 2026 (Oct - Dec)</option>
                <option value="Annual FY26-27">Annual FY 2026-27</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Submission Due Date</label>
              <input
                type="text"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Assigned Reviewer / HOD</label>
            <input
              type="text"
              className="form-control"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
            />
          </div>
        </form>
      </Drawer>

      {/* Scorecard Modal */}
      {selectedReview && (
        <Modal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title={`Performance Scorecard: ${selectedReview.employeeName}`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedReview(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedReview.employeeName}</div>
                <div className="text-muted text-xs">{selectedReview.empCode} • {selectedReview.department} • {selectedReview.cycle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-muted text-xs font-semibold uppercase">Overall Rating</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success, #10b981)' }}>
                  {selectedReview.score?.toFixed(1)} / {selectedReview.maxScore.toFixed(1)}
                </div>
              </div>
            </div>

            {/* KPI Details */}
            {selectedReview.kpis && selectedReview.kpis.length > 0 && (
              <div>
                <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '8px' }}>Key Performance Indicators Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedReview.kpis.map((kpi, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-semibold" style={{ fontSize: '0.9rem' }}>{kpi.name} <span className="text-muted text-xs">({kpi.weight})</span></span>
                        <span className="badge badge-success font-bold">{kpi.score.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="text-xs text-muted mt-1">{kpi.feedback}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReview.hodComments && (
              <div>
                <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '4px' }}>HOD Qualitative Feedback</div>
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  "{selectedReview.hodComments}"
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
