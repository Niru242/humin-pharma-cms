'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconEye, IconDeviceFloppy, IconFileText } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface DecisionRecord {
  id: string;
  date: string;
  caseRef: string;
  employeeName: string;
  empCode: string;
  department: string;
  decisionMade: string;
  resolvedBy: string;
  summary: string;
  effectiveFrom: string;
}

const dummyDecisions: DecisionRecord[] = [
  {
    id: '1',
    date: '15 Jul 2026',
    caseRef: 'HR-2026-041',
    employeeName: 'Anil Desai',
    empCode: 'EMP-007',
    department: 'Sales',
    decisionMade: 'Written Warning Issued',
    resolvedBy: 'Priya Patel (HR Manager)',
    summary: 'First formal written reprimand for unexcused absence. 6-month probation review period initiated.',
    effectiveFrom: '15 Jul 2026',
  },
  {
    id: '2',
    date: '02 Jul 2026',
    caseRef: 'HR-2026-038',
    employeeName: 'Sunita Rao',
    empCode: 'EMP-012',
    department: 'Manufacturing',
    decisionMade: 'Mandatory Safety Retraining',
    resolvedBy: 'Dr. Vivek Joshi (Plant Head)',
    summary: 'Cleanroom protocol training reassigned and logged in GxP compliance matrix.',
    effectiveFrom: '05 Jul 2026',
  },
  {
    id: '3',
    date: '28 Jun 2026',
    caseRef: 'HR-2026-035',
    employeeName: 'Karan Mehra',
    empCode: 'EMP-018',
    department: 'Quality Assurance',
    decisionMade: 'Performance Counseling Plan',
    resolvedBy: 'Sarah Jenkins (VP Operations)',
    summary: '30-day turnaround improvement plan for batch release documentation.',
    effectiveFrom: '01 Jul 2026',
  }
];

export default function DecisionRegister() {
  const toast = useToast();
  const [decisions, setDecisions] = useState<DecisionRecord[]>(dummyDecisions);
  const [searchQuery, setSearchQuery] = useState('');

  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);

  const [formData, setFormData] = useState({
    employeeName: '',
    empCode: 'EMP-009',
    department: 'Production Core',
    caseRef: `HR-2026-0${dummyDecisions.length + 42}`,
    decisionMade: 'Formal Warning Issued',
    resolvedBy: 'HR Director',
    summary: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
  });

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.summary) {
      toast.error('Required Fields Missing', 'Please enter employee name and decision details.');
      return;
    }

    const newDecision: DecisionRecord = {
      id: `${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      caseRef: formData.caseRef,
      employeeName: formData.employeeName,
      empCode: formData.empCode,
      department: formData.department,
      decisionMade: formData.decisionMade,
      resolvedBy: formData.resolvedBy,
      summary: formData.summary,
      effectiveFrom: formData.effectiveFrom,
    };

    setDecisions([newDecision, ...decisions]);
    setIsNewDrawerOpen(false);
    setFormData({
      employeeName: '',
      empCode: 'EMP-009',
      department: 'Production Core',
      caseRef: `HR-2026-0${decisions.length + 43}`,
      decisionMade: 'Formal Warning Issued',
      resolvedBy: 'HR Director',
      summary: '',
      effectiveFrom: new Date().toISOString().split('T')[0],
    });
    toast.success('Decision Logged', `Decision ${newDecision.caseRef} has been recorded in the register.`);
  };

  const filteredDecisions = decisions.filter(d => 
    d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.caseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.decisionMade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="HR Decision Register" description="Log and track official HR decisions and resolutions." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by case ref, employee, department, or decision..."
        onAddClick={() => setIsNewDrawerOpen(true)}
        addBtnText="Log HR Decision"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Date</th>
              <th>Case Ref</th>
              <th>Employee Details</th>
              <th>Decision Made</th>
              <th>Resolved By</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDecisions.map(d => (
              <tr key={d.id} className="directory-row">
                <td className="font-medium text-muted">{d.date}</td>
                <td><span className="badge badge-info">{d.caseRef}</span></td>
                <td>
                  <EmployeeProfileCell
                    firstName={d.employeeName.split(" ")[0]}
                    lastName={d.employeeName.split(" ").slice(1).join(" ")}
                    subtitle={`${d.empCode} • ${d.department}`}
                  />
                </td>
                <td className="font-semibold">{d.decisionMade}</td>
                <td className="text-muted text-sm">{d.resolvedBy}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="View Decision Details"
                      onClick={() => setSelectedDecision(d)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconEye size={16} />
                      <span>Details</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDecisions.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Decisions Found"
                    message="No decisions match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Log Decision Drawer */}
      <Drawer
        isOpen={isNewDrawerOpen}
        onClose={() => setIsNewDrawerOpen(false)}
        title="Log Official HR Decision"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsNewDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateDecision}>
              <IconDeviceFloppy size={18} />
              <span>Record Decision</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateDecision} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Case Reference ID</label>
              <input
                type="text"
                className="form-control"
                value={formData.caseRef}
                onChange={(e) => setFormData({ ...formData, caseRef: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Effective Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Anil Desai"
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
                <option value="Sales">Sales & Marketing</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Formulation R&D">Formulation R&D</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Decision Outcome</label>
            <select
              className="form-control"
              value={formData.decisionMade}
              onChange={(e) => setFormData({ ...formData, decisionMade: e.target.value })}
            >
              <option value="Written Warning Issued">Written Warning Issued</option>
              <option value="Mandatory Safety Retraining">Mandatory Safety Retraining</option>
              <option value="Performance Counseling Plan">Performance Counseling Plan (PIP)</option>
              <option value="Department Reassignment">Department Reassignment</option>
              <option value="Exonerated / Case Closed">Exonerated / Case Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Authorized By</label>
            <input
              type="text"
              className="form-control"
              value={formData.resolvedBy}
              onChange={(e) => setFormData({ ...formData, resolvedBy: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Decision Summary & Order *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Detail the conclusive findings, rationale, and specific directives issued..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              required
            />
          </div>
        </form>
      </Drawer>

      {/* View Decision Details Modal */}
      {selectedDecision && (
        <Modal
          isOpen={Boolean(selectedDecision)}
          onClose={() => setSelectedDecision(null)}
          title={`Decision Record: ${selectedDecision.caseRef}`}
          size="md"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedDecision(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedDecision.employeeName}</div>
                <div className="text-muted text-xs">{selectedDecision.empCode} • {selectedDecision.department}</div>
              </div>
              <span className="badge badge-primary" style={{ padding: '6px 12px' }}>
                {selectedDecision.decisionMade}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Effective Date</div>
                <div className="font-medium text-sm">{selectedDecision.effectiveFrom}</div>
              </div>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Authorized By</div>
                <div className="font-medium text-sm">{selectedDecision.resolvedBy}</div>
              </div>
            </div>

            <div>
              <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '4px' }}>Decision Order & Directives</div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {selectedDecision.summary}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
