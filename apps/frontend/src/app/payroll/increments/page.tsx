'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconEye, IconDeviceFloppy, IconTrendingUp } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface IncrementRecord {
  id: string;
  employeeName: string;
  empCode: string;
  department: string;
  effectiveDate: string;
  previousSalary: number;
  incrementPercentage: number;
  newSalary: number;
  status: 'Applied' | 'Pending Approval';
  rating?: string;
  basicComponent?: number;
  hraComponent?: number;
  specialAllowance?: number;
}

const dummyIncrements: IncrementRecord[] = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    empCode: 'EMP-001',
    department: 'Engineering',
    effectiveDate: '01 Jan 2026',
    previousSalary: 850000,
    incrementPercentage: 8.8,
    newSalary: 925000,
    status: 'Applied',
    rating: 'Exceeds Expectations (4.5/5.0)',
    basicComponent: 462500,
    hraComponent: 231250,
    specialAllowance: 231250,
  },
  {
    id: '2',
    employeeName: 'Priya Patel',
    empCode: 'EMP-003',
    department: 'Quality Assurance',
    effectiveDate: '01 Apr 2026',
    previousSalary: 620000,
    incrementPercentage: 9.6,
    newSalary: 680000,
    status: 'Pending Approval',
    rating: 'Outstanding (4.8/5.0)',
    basicComponent: 340000,
    hraComponent: 170000,
    specialAllowance: 170000,
  },
  {
    id: '3',
    employeeName: 'Amit Kumar',
    empCode: 'EMP-004',
    department: 'Production Core',
    effectiveDate: '01 Apr 2026',
    previousSalary: 520000,
    incrementPercentage: 7.7,
    newSalary: 560000,
    status: 'Applied',
    rating: 'Meets Expectations (3.8/5.0)',
    basicComponent: 280000,
    hraComponent: 140000,
    specialAllowance: 140000,
  }
];

export default function SalaryIncrements() {
  const toast = useToast();
  const [increments, setIncrements] = useState<IncrementRecord[]>(dummyIncrements);
  const [searchQuery, setSearchQuery] = useState('');

  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IncrementRecord | null>(null);

  // New Increment Form State
  const [formData, setFormData] = useState({
    employeeName: '',
    empCode: 'EMP-009',
    department: 'Manufacturing',
    currentSalary: 600000,
    incrementPct: 10,
    effectiveDate: new Date().toISOString().split('T')[0],
    rating: 'Meets Expectations (4.0/5.0)',
  });

  const calculatedNewSalary = Math.round(formData.currentSalary * (1 + formData.incrementPct / 100));

  const handleProcessIncrement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName) {
      toast.error('Required Fields Missing', 'Please specify the employee name.');
      return;
    }

    const newRecord: IncrementRecord = {
      id: `${Date.now()}`,
      employeeName: formData.employeeName,
      empCode: formData.empCode,
      department: formData.department,
      effectiveDate: formData.effectiveDate,
      previousSalary: formData.currentSalary,
      incrementPercentage: formData.incrementPct,
      newSalary: calculatedNewSalary,
      status: 'Pending Approval',
      rating: formData.rating,
      basicComponent: Math.round(calculatedNewSalary * 0.5),
      hraComponent: Math.round(calculatedNewSalary * 0.25),
      specialAllowance: Math.round(calculatedNewSalary * 0.25),
    };

    setIncrements([newRecord, ...increments]);
    setIsNewDrawerOpen(false);
    setFormData({
      employeeName: '',
      empCode: 'EMP-009',
      department: 'Manufacturing',
      currentSalary: 600000,
      incrementPct: 10,
      effectiveDate: new Date().toISOString().split('T')[0],
      rating: 'Meets Expectations (4.0/5.0)',
    });
    toast.success('Increment Processed', `Salary revision logged for ${newRecord.employeeName}.`);
  };

  const handleApproveIncrement = (id: string) => {
    setIncrements(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'Applied' } : inc));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, status: 'Applied' });
    }
    toast.success('Increment Approved', 'Salary revision has been activated and sent to payroll sync.');
  };

  const formatCurrency = (val: number) => `₹ ${val.toLocaleString('en-IN')}`;

  const filteredIncrements = increments.filter(inc => 
    inc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inc.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Salary Increments" description="Manage and process employee salary increments and bonuses." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee, code, or department..."
        onAddClick={() => setIsNewDrawerOpen(true)}
        addBtnText="Process Increment"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>Effective Date</th>
              <th>Previous Salary</th>
              <th>Increment %</th>
              <th>New Annual Salary</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncrements.map(inc => (
              <tr key={inc.id} className="directory-row">
                <td>
                  <EmployeeProfileCell
                    firstName={inc.employeeName.split(" ")[0]}
                    lastName={inc.employeeName.split(" ").slice(1).join(" ")}
                    subtitle={`${inc.empCode} • ${inc.department}`}
                  />
                </td>
                <td className="font-medium text-muted">{inc.effectiveDate}</td>
                <td className="font-medium">{formatCurrency(inc.previousSalary)}</td>
                <td className="font-bold text-success">+{inc.incrementPercentage}%</td>
                <td className="font-bold">{formatCurrency(inc.newSalary)}</td>
                <td>
                  <StatusBadge 
                    status={inc.status === 'Applied' ? 'Active' : 'Pending'} 
                    customLabel={inc.status} 
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="View Breakdown"
                      onClick={() => setSelectedRecord(inc)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconEye size={16} />
                      <span>Breakdown</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredIncrements.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState 
                    title="No Increments Found"
                    message="No salary increments match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Process Increment Drawer */}
      <Drawer
        isOpen={isNewDrawerOpen}
        onClose={() => setIsNewDrawerOpen(false)}
        title="Process Salary Increment"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsNewDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleProcessIncrement}>
              <IconDeviceFloppy size={18} />
              <span>Submit Revision</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleProcessIncrement} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Vikram Malhotra"
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
                <option value="Engineering">Engineering</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Formulation R&D">Formulation R&D</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Current Annual CTC (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.currentSalary}
                onChange={(e) => setFormData({ ...formData, currentSalary: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Increment Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={formData.incrementPct}
                onChange={(e) => setFormData({ ...formData, incrementPct: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Live Calculation Preview Card */}
          <div style={{ background: 'var(--brand-50, #eff6ff)', border: '1px solid var(--brand-200, #bfdbfe)', padding: '1rem', borderRadius: '8px' }}>
            <div className="text-muted text-xs font-semibold uppercase">Revised Compensation Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-600)' }}>
                {formatCurrency(calculatedNewSalary)}
              </span>
              <span className="badge badge-success">
                +{formatCurrency(calculatedNewSalary - formData.currentSalary)} (+{formData.incrementPct}%)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Performance Rating</label>
              <select
                className="form-control"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              >
                <option value="Outstanding (4.8/5.0)">Outstanding (4.8/5.0)</option>
                <option value="Exceeds Expectations (4.5/5.0)">Exceeds Expectations (4.5/5.0)</option>
                <option value="Meets Expectations (4.0/5.0)">Meets Expectations (4.0/5.0)</option>
                <option value="Needs Improvement (2.8/5.0)">Needs Improvement (2.8/5.0)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Effective Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Drawer>

      {/* Salary Revision Breakdown Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Compensation Breakdown: ${selectedRecord.employeeName}`}
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              {selectedRecord.status === 'Pending Approval' ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleApproveIncrement(selectedRecord.id)}
                >
                  <IconCheck size={16} />
                  <span>Approve & Activate Revision</span>
                </button>
              ) : (
                <span className="text-muted text-xs">Revision Active in Payroll</span>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedRecord.employeeName}</div>
                <div className="text-muted text-xs">{selectedRecord.empCode} • {selectedRecord.department}</div>
                {selectedRecord.rating && <div className="text-xs font-medium text-primary mt-1">{selectedRecord.rating}</div>}
              </div>
              <StatusBadge status={selectedRecord.status === 'Applied' ? 'Active' : 'Pending'} customLabel={selectedRecord.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Previous Annual CTC</div>
                <div className="font-semibold text-base">{formatCurrency(selectedRecord.previousSalary)}</div>
              </div>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Revised Annual CTC</div>
                <div className="font-bold text-base text-success">{formatCurrency(selectedRecord.newSalary)} (+{selectedRecord.incrementPercentage}%)</div>
              </div>
            </div>

            <div>
              <div className="text-muted text-xs font-semibold uppercase" style={{ marginBottom: '8px' }}>Monthly Salary Structure Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-muted">Basic Salary (50%)</span>
                  <span className="font-semibold">{formatCurrency(Math.round((selectedRecord.basicComponent || selectedRecord.newSalary * 0.5) / 12))} / mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-muted">House Rent Allowance - HRA (25%)</span>
                  <span className="font-semibold">{formatCurrency(Math.round((selectedRecord.hraComponent || selectedRecord.newSalary * 0.25) / 12))} / mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-muted">Special Allowance (25%)</span>
                  <span className="font-semibold">{formatCurrency(Math.round((selectedRecord.specialAllowance || selectedRecord.newSalary * 0.25) / 12))} / mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '0.95rem' }}>
                  <span>Gross Monthly Remuneration</span>
                  <span className="text-primary">{formatCurrency(Math.round(selectedRecord.newSalary / 12))} / mo</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
