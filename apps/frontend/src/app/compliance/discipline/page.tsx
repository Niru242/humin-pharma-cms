'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconEye, IconPlus, IconAlertTriangle, IconFileText, IconDeviceFloppy } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface DisciplinaryRecord {
  id: string;
  date: string;
  employeeName: string;
  empCode: string;
  department: string;
  incidentType: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Investigation' | 'Resolved';
  description: string;
  actionTaken?: string;
}

const dummyRecords: DisciplinaryRecord[] = [
  {
    id: 'DISC-001',
    date: '10 Jul 2026',
    employeeName: 'Anil Desai',
    empCode: 'EMP-007',
    department: 'Sales',
    incidentType: 'Code of Conduct',
    severity: 'High',
    status: 'Open',
    description: 'Repeated unexcused absenteeism and non-compliance with standard plant safety protocols.',
    actionTaken: 'Formal written warning issued. Hearing scheduled with Ethics Committee.',
  },
  {
    id: 'DISC-002',
    date: '25 Jun 2026',
    employeeName: 'Sunita Rao',
    empCode: 'EMP-012',
    department: 'Manufacturing',
    incidentType: 'Safety Violation',
    severity: 'Medium',
    status: 'Resolved',
    description: 'Failure to don required cleanroom gowning PPE in Formulation Area B.',
    actionTaken: 'Refresher training completed on 28 Jun 2026 and supervisor sign-off recorded.',
  },
  {
    id: 'DISC-003',
    date: '02 Jul 2026',
    employeeName: 'Karan Mehra',
    empCode: 'EMP-018',
    department: 'Quality Assurance',
    incidentType: 'Documentation Delay',
    severity: 'Low',
    status: 'Under Investigation',
    description: 'Batch record review backlog exceeding standard SOP 24-hour turnaround window.',
    actionTaken: 'Internal peer review in progress.',
  }
];

export default function DisciplineRecords() {
  const toast = useToast();
  const [records, setRecords] = useState<DisciplinaryRecord[]>(dummyRecords);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & Modal states
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DisciplinaryRecord | null>(null);

  // New incident form state
  const [formData, setFormData] = useState({
    employeeName: '',
    empCode: 'EMP-025',
    department: 'Production Core',
    incidentType: 'Safety Violation',
    severity: 'Medium' as 'High' | 'Medium' | 'Low',
    description: '',
    actionTaken: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.description) {
      toast.error('Required Fields Missing', 'Please specify the employee name and incident summary.');
      return;
    }

    const newRecord: DisciplinaryRecord = {
      id: `DISC-00${records.length + 1}`,
      date: formData.date,
      employeeName: formData.employeeName,
      empCode: formData.empCode,
      department: formData.department,
      incidentType: formData.incidentType,
      severity: formData.severity,
      status: 'Open',
      description: formData.description,
      actionTaken: formData.actionTaken || 'Initial inquiry logged.',
    };

    setRecords([newRecord, ...records]);
    setIsNewDrawerOpen(false);
    setFormData({
      employeeName: '',
      empCode: 'EMP-025',
      department: 'Production Core',
      incidentType: 'Safety Violation',
      severity: 'Medium',
      description: '',
      actionTaken: '',
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Incident Logged', `Case ${newRecord.id} has been formally recorded.`);
  };

  const handleStatusUpdate = (status: DisciplinaryRecord['status']) => {
    if (!selectedCase) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === selectedCase.id ? { ...r, status } : r))
    );
    setSelectedCase({ ...selectedCase, status });
    toast.success('Case Status Updated', `Case ${selectedCase.id} marked as ${status}.`);
  };

  const filteredRecords = records.filter((r) =>
    r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Disciplinary Records" description="Track warnings, incidents, and disciplinary actions across the organization." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee, department, or incident type..."
        onAddClick={() => setIsNewDrawerOpen(true)}
        addBtnText="Log New Incident"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Case ID & Date</th>
              <th>Employee Details</th>
              <th>Incident Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id} className="directory-row">
                <td>
                  <div className="font-semibold" style={{ fontSize: '0.85rem' }}>{r.id}</div>
                  <div className="text-muted text-xs">{r.date}</div>
                </td>
                <td>
                  <EmployeeProfileCell
                    firstName={r.employeeName.split(' ')[0]}
                    lastName={r.employeeName.split(' ').slice(1).join(' ')}
                    subtitle={`${r.empCode} • ${r.department}`}
                  />
                </td>
                <td className="font-medium">{r.incidentType}</td>
                <td>
                  <span className={`badge ${r.severity === 'High' ? 'badge-danger' : r.severity === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                    {r.severity}
                  </span>
                </td>
                <td>
                  <StatusBadge
                    status={r.status === 'Resolved' ? 'Resolved' : r.status === 'Under Investigation' ? 'Pending' : 'Draft'}
                    customLabel={r.status}
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="View Case File"
                      onClick={() => setSelectedCase(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconEye size={16} />
                      <span>Case File</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No Records Found"
                    message="No disciplinary records match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Log New Incident Drawer */}
      <Drawer
        isOpen={isNewDrawerOpen}
        onClose={() => setIsNewDrawerOpen(false)}
        title="Log Disciplinary Incident"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsNewDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateIncident}>
              <IconDeviceFloppy size={18} />
              <span>Submit Case Dossier</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateIncident} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.empCode}
                onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Production Core">Production Core</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Formulation R&D">Formulation R&D</option>
                <option value="Sales">Sales & Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Incident Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Incident Category</label>
              <select
                className="form-control"
                value={formData.incidentType}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              >
                <option value="Safety Violation">Safety & GxP Protocol Violation</option>
                <option value="Code of Conduct">Code of Conduct & Ethics</option>
                <option value="Documentation Delay">Documentation & Batch Record Delay</option>
                <option value="Attendance Non-Compliance">Chronic Unexcused Absenteeism</option>
                <option value="Unauthorized Access">Unauthorized Cleanroom Access</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Severity Level</label>
              <select
                className="form-control"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              >
                <option value="Low">Low - Minor Infraction</option>
                <option value="Medium">Medium - Standard Non-Compliance</option>
                <option value="High">High - Critical Safety / Regulatory Risk</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Detailed Incident Summary *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Provide objective facts, witnesses, location, and circumstances of the incident..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Immediate Corrective Action / Recommendation</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cleanroom retraining, supervisor counseling, written warning"
              value={formData.actionTaken}
              onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
            />
          </div>
        </form>
      </Drawer>

      {/* Case File Inspection Modal */}
      {selectedCase && (
        <Modal
          isOpen={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          title={`Disciplinary Case File: ${selectedCase.id}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="text-muted text-xs" style={{ display: 'flex', alignItems: 'center' }}>Change Status:</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStatusUpdate('Under Investigation')}
                >
                  Under Investigation
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStatusUpdate('Resolved')}
                >
                  Mark Resolved
                </button>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedCase(null)}>
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedCase.employeeName}</div>
                <div className="text-muted text-xs">{selectedCase.empCode} • {selectedCase.department}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge ${selectedCase.severity === 'High' ? 'badge-danger' : selectedCase.severity === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                  {selectedCase.severity} Severity
                </span>
                <StatusBadge status={selectedCase.status === 'Resolved' ? 'Resolved' : 'Pending'} customLabel={selectedCase.status} />
              </div>
            </div>

            <div>
              <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '4px' }}>Incident Category</div>
              <div className="font-semibold">{selectedCase.incidentType}</div>
            </div>

            <div>
              <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '4px' }}>Incident Details</div>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                {selectedCase.description}
              </div>
            </div>

            {selectedCase.actionTaken && (
              <div>
                <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '4px' }}>Action & Resolution Record</div>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {selectedCase.actionTaken}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
