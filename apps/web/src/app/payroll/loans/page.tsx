'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconEye, IconDeviceFloppy, IconCash, IconCalendarTime } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/providers/ToastProvider';

interface LoanRecord {
  id: string;
  employeeName: string;
  empCode: string;
  department: string;
  loanType: string;
  totalAmount: number;
  remainingBalance: number;
  emi: number;
  tenureMonths: number;
  paidMonths: number;
  disbursedDate: string;
  status: 'Active' | 'Closed';
}

const dummyLoans: LoanRecord[] = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    empCode: 'EMP-001',
    department: 'Engineering',
    loanType: 'Personal Advance',
    totalAmount: 50000,
    remainingBalance: 20000,
    emi: 5000,
    tenureMonths: 10,
    paidMonths: 6,
    disbursedDate: '10 Feb 2026',
    status: 'Active',
  },
  {
    id: '2',
    employeeName: 'Anjali Gupta',
    empCode: 'EMP-005',
    department: 'Human Resources',
    loanType: 'Medical Emergency',
    totalAmount: 120000,
    remainingBalance: 0,
    emi: 10000,
    tenureMonths: 12,
    paidMonths: 12,
    disbursedDate: '15 Jul 2025',
    status: 'Closed',
  },
  {
    id: '3',
    employeeName: 'Vikram Joshi',
    empCode: 'EMP-014',
    department: 'Manufacturing',
    loanType: 'Festival Advance',
    totalAmount: 30000,
    remainingBalance: 15000,
    emi: 5000,
    tenureMonths: 6,
    paidMonths: 3,
    disbursedDate: '01 May 2026',
    status: 'Active',
  }
];

export default function LoansAdvances() {
  const toast = useToast();
  const [loans, setLoans] = useState<LoanRecord[]>(dummyLoans);
  const [searchQuery, setSearchQuery] = useState('');

  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeName: '',
    empCode: 'EMP-011',
    department: 'Production Core',
    loanType: 'Salary Advance',
    principalAmount: 40000,
    tenureMonths: 8,
    disbursedDate: new Date().toISOString().split('T')[0],
  });

  const calculatedEmi = formData.tenureMonths > 0 ? Math.round(formData.principalAmount / formData.tenureMonths) : 0;

  const handleDisburseLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || formData.principalAmount <= 0) {
      toast.error('Validation Error', 'Please enter employee name and a valid loan principal amount.');
      return;
    }

    const newLoan: LoanRecord = {
      id: `${Date.now()}`,
      employeeName: formData.employeeName,
      empCode: formData.empCode,
      department: formData.department,
      loanType: formData.loanType,
      totalAmount: formData.principalAmount,
      remainingBalance: formData.principalAmount,
      emi: calculatedEmi,
      tenureMonths: formData.tenureMonths,
      paidMonths: 0,
      disbursedDate: formData.disbursedDate,
      status: 'Active',
    };

    setLoans([newLoan, ...loans]);
    setIsNewDrawerOpen(false);
    setFormData({
      employeeName: '',
      empCode: 'EMP-011',
      department: 'Production Core',
      loanType: 'Salary Advance',
      principalAmount: 40000,
      tenureMonths: 8,
      disbursedDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Loan Disbursed', `${newLoan.loanType} of ₹ ${newLoan.totalAmount.toLocaleString('en-IN')} approved for ${newLoan.employeeName}.`);
  };

  const handleRecordDeduction = (loanId: string) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId && l.remainingBalance > 0) {
        const nextBalance = Math.max(0, l.remainingBalance - l.emi);
        const nextPaid = l.paidMonths + 1;
        const nextStatus = nextBalance === 0 ? 'Closed' : 'Active';
        return { ...l, remainingBalance: nextBalance, paidMonths: nextPaid, status: nextStatus };
      }
      return l;
    }));

    if (selectedLoan && selectedLoan.id === loanId) {
      const nextBalance = Math.max(0, selectedLoan.remainingBalance - selectedLoan.emi);
      const nextPaid = selectedLoan.paidMonths + 1;
      const nextStatus = nextBalance === 0 ? 'Closed' : 'Active';
      setSelectedLoan({ ...selectedLoan, remainingBalance: nextBalance, paidMonths: nextPaid, status: nextStatus });
    }

    toast.success('Installment Processed', 'Monthly EMI deducted from payroll ledger.');
  };

  const formatCurrency = (val: number) => `₹ ${val.toLocaleString('en-IN')}`;

  const filteredLoans = loans.filter(l => 
    l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Loans & Advances" description="Manage employee loan disbursements and EMI deductions." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee, code, or loan type..."
        onAddClick={() => setIsNewDrawerOpen(true)}
        addBtnText="Disburse Loan"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>Loan Type</th>
              <th>Principal Amount</th>
              <th>Remaining Balance</th>
              <th>Monthly EMI</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map(l => (
              <tr key={l.id} className="directory-row">
                <td>
                  <EmployeeProfileCell
                    firstName={l.employeeName.split(" ")[0]}
                    lastName={l.employeeName.split(" ").slice(1).join(" ")}
                    subtitle={`${l.empCode} • ${l.department}`}
                  />
                </td>
                <td><span className="badge badge-info">{l.loanType}</span></td>
                <td className="font-bold">{formatCurrency(l.totalAmount)}</td>
                <td className={`font-bold ${l.remainingBalance > 0 ? 'text-danger' : 'text-success'}`}>
                  {formatCurrency(l.remainingBalance)}
                </td>
                <td className="font-medium">{formatCurrency(l.emi)}</td>
                <td>
                  <StatusBadge 
                    status={l.status === 'Active' ? 'Active' : 'Inactive'} 
                    customLabel={l.status} 
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="View Repayment Schedule"
                      onClick={() => setSelectedLoan(l)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconEye size={16} />
                      <span>Schedule</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState 
                    title="No Loans Found"
                    message="No loans or advances match your search criteria."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Disburse Loan Drawer */}
      <Drawer
        isOpen={isNewDrawerOpen}
        onClose={() => setIsNewDrawerOpen(false)}
        title="Disburse Loan / Advance"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsNewDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleDisburseLoan}>
              <IconDeviceFloppy size={18} />
              <span>Approve & Disburse</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleDisburseLoan} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Employee Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Meera Saini"
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
                <option value="Production Core">Production Core</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Formulation R&D">Formulation R&D</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Loan / Advance Category</label>
              <select
                className="form-control"
                value={formData.loanType}
                onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
              >
                <option value="Salary Advance">Salary Advance</option>
                <option value="Medical Emergency">Medical Emergency Assistance</option>
                <option value="Festival Advance">Festival / Annual Advance</option>
                <option value="Education Aid">Higher Education / Skill Grant</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Disbursement Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.disbursedDate}
                onChange={(e) => setFormData({ ...formData, disbursedDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Principal Amount (₹) *</label>
              <input
                type="number"
                step="5000"
                className="form-control"
                value={formData.principalAmount}
                onChange={(e) => setFormData({ ...formData, principalAmount: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Repayment Tenure (Months)</label>
              <select
                className="form-control"
                value={formData.tenureMonths}
                onChange={(e) => setFormData({ ...formData, tenureMonths: parseInt(e.target.value) })}
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={8}>8 Months</option>
                <option value={10}>10 Months</option>
                <option value={12}>12 Months (1 Year)</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'var(--brand-50, #eff6ff)', border: '1px solid var(--brand-200, #bfdbfe)', padding: '1rem', borderRadius: '8px' }}>
            <div className="text-muted text-xs font-semibold uppercase">Calculated Monthly EMI Deduction</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-600)', marginTop: '4px' }}>
              {formatCurrency(calculatedEmi)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ month for {formData.tenureMonths} months</span>
            </div>
          </div>
        </form>
      </Drawer>

      {/* Repayment Schedule & Amortization Modal */}
      {selectedLoan && (
        <Modal
          isOpen={Boolean(selectedLoan)}
          onClose={() => setSelectedLoan(null)}
          title={`Loan Ledger: ${selectedLoan.employeeName}`}
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              {selectedLoan.remainingBalance > 0 ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRecordDeduction(selectedLoan.id)}
                >
                  <IconCash size={16} />
                  <span>Deduct Monthly EMI ({formatCurrency(selectedLoan.emi)})</span>
                </button>
              ) : (
                <span className="text-success font-semibold text-xs">Loan Fully Repaid & Settled</span>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedLoan(null)}>
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedLoan.employeeName}</div>
                <div className="text-muted text-xs">{selectedLoan.empCode} • {selectedLoan.department}</div>
              </div>
              <StatusBadge status={selectedLoan.status === 'Active' ? 'Active' : 'Inactive'} customLabel={selectedLoan.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Total Disbursed</div>
                <div className="font-semibold">{formatCurrency(selectedLoan.totalAmount)}</div>
              </div>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Remaining Balance</div>
                <div className={`font-bold ${selectedLoan.remainingBalance > 0 ? 'text-danger' : 'text-success'}`}>
                  {formatCurrency(selectedLoan.remainingBalance)}
                </div>
              </div>
              <div>
                <div className="text-muted text-xs font-semibold uppercase">Progress</div>
                <div className="font-semibold">{selectedLoan.paidMonths} / {selectedLoan.tenureMonths} EMIs</div>
              </div>
            </div>

            {/* Repayment Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>Repayment Completion</span>
                <span>{Math.round((selectedLoan.paidMonths / selectedLoan.tenureMonths) * 100)}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(selectedLoan.paidMonths / selectedLoan.tenureMonths) * 100}%`,
                    background: 'var(--success, #10b981)',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
