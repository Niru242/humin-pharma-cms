'use client';

import { useState } from 'react';
import { IconAlarmOff, IconAlertTriangle, IconCheck, IconFilter, IconPencil, IconUserExclamation, IconUserShare, IconX, IconDeviceFloppy } from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar, FilterGroup, FilterAction } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { Modal } from '@/components/ui/Modal';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { useToast } from '@/providers/ToastProvider';

interface ExceptionItem {
  id: string;
  type: string;
  employee: string;
  empCode: string;
  date: string;
  shift: string;
  details: string;
  status: string;
  sla: string;
  iconType: 'alarm' | 'absent' | 'late';
}

const dummyExceptions: ExceptionItem[] = [
  {
    id: 'EX-001',
    type: 'Missing Out Punch',
    employee: 'Sarah Jenkins',
    empCode: 'EMP-001',
    date: '20 Jul 2026',
    shift: 'General Shift (09:00 - 18:00)',
    details: 'In: 08:55 AM, Out: --',
    status: 'Pending',
    sla: '4 Hours Overdue',
    iconType: 'alarm',
  },
  {
    id: 'EX-002',
    type: 'Unplanned Absent',
    employee: 'Priya Patel',
    empCode: 'EMP-003',
    date: '19 Jul 2026',
    shift: 'General Shift (09:00 - 18:00)',
    details: 'No punches recorded. No active leave request.',
    status: 'Pending',
    sla: '24 Hours Overdue',
    iconType: 'absent',
  },
  {
    id: 'EX-003',
    type: 'Late Arrival',
    employee: 'Amit Kumar',
    empCode: 'EMP-004',
    date: '20 Jul 2026',
    shift: 'Night Shift (22:00 - 06:00)',
    details: 'In: 22:15 PM (15 mins late)',
    status: 'Pending',
    sla: 'Within SLA',
    iconType: 'late',
  }
];

export default function ExceptionQueuePage() {
  const toast = useToast();
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(dummyExceptions);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');

  // Single item regularization modal state
  const [regularizeItem, setRegularizeItem] = useState<ExceptionItem | null>(null);
  const [correctedOutTime, setCorrectedOutTime] = useState('18:00');
  const [regularizeReason, setRegularizeReason] = useState('Official on-site meeting extended');

  const filteredExceptions = exceptions.filter(ex => {
    const matchesSearch = ex.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ex.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedTypeFilter === 'All Types' || ex.type.toLowerCase().includes(selectedTypeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredExceptions.map(ex => ex.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkRegularize = () => {
    if (selectedIds.length === 0) {
      toast.warning('No Exceptions Selected', 'Please check at least one exception to perform bulk regularization.');
      return;
    }
    setExceptions(exceptions.filter(ex => !selectedIds.includes(ex.id)));
    toast.success('Bulk Regularized', `${selectedIds.length} attendance exceptions regularized.`);
    setSelectedIds([]);
  };

  const handleAssignOpen = () => {
    if (selectedIds.length === 0) {
      toast.warning('No Exceptions Selected', 'Please check at least one exception to assign.');
      return;
    }
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = () => {
    setExceptions(exceptions.filter(ex => !selectedIds.includes(ex.id)));
    toast.success('Exceptions Delegated', `${selectedIds.length} exceptions assigned to direct supervisor.`);
    setSelectedIds([]);
    setIsAssignModalOpen(false);
  };

  const handleSingleRegularizeSubmit = () => {
    if (!regularizeItem) return;
    setExceptions(exceptions.filter(ex => ex.id !== regularizeItem.id));
    toast.success('Exception Regularized', `${regularizeItem.id} for ${regularizeItem.employee} has been regularized with punch time ${correctedOutTime}.`);
    setRegularizeItem(null);
  };

  const handleMarkLwp = (ex: ExceptionItem) => {
    setExceptions(exceptions.filter(i => i.id !== ex.id));
    toast.error('Marked as LWP', `${ex.employee} on ${ex.date} recorded as Leave Without Pay.`);
  };

  const handleApproveAsIs = (ex: ExceptionItem) => {
    setExceptions(exceptions.filter(i => i.id !== ex.id));
    toast.success('Approved As-Is', `${ex.type} for ${ex.employee} was approved.`);
  };

  const getExceptionIcon = (type: ExceptionItem['iconType']) => {
    switch (type) {
      case 'alarm':
        return <IconAlarmOff size={20} className="text-danger" />;
      case 'absent':
        return <IconUserExclamation size={20} className="text-warning" />;
      case 'late':
      default:
        return <IconAlertTriangle size={20} className="text-info" />;
    }
  };

  const filterNode = (
    <FilterBar>
      <FilterGroup>
        <label>Exception Type</label>
        <select
          className="form-control"
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Missing Out Punch">Missing Punch</option>
          <option value="Late Arrival">Late Arrival</option>
          <option value="Unplanned Absent">Unplanned Absent</option>
        </select>
      </FilterGroup>
      <FilterAction>
        <button
          className="btn btn-secondary"
          onClick={() => setSelectedTypeFilter('All Types')}
        >
          <IconFilter size={18} /> Reset Filter
        </button>
      </FilterAction>
    </FilterBar>
  );

  return (
    <div className="page-container">
      <PageHeader 
        title="Attendance Exception Queue" 
        description="Resolve system-generated anomalies like missing punches, late arrivals, and absentees."
      />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search exceptions by employee, code, type, or ID..."
        filterNode={filterNode}
      >
        {selectedIds.length > 0 && (
          <div style={{ background: 'var(--brand-50, #eff6ff)', border: '1px solid var(--brand-300, #93c5fd)', borderRadius: '8px', padding: '0.75rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="font-semibold text-primary">{selectedIds.length} Exception(s) Selected</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleAssignOpen}>
                <IconUserShare size={16} /> Assign to Manager
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleBulkRegularize}>
                <IconPencil size={16} /> Bulk Regularize
              </button>
            </div>
          </div>
        )}

        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === filteredExceptions.length && filteredExceptions.length > 0}
                />
              </th>
              <th>Exception Type</th>
              <th>Employee Details</th>
              <th>Anomaly Details</th>
              <th>SLA Tracking</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExceptions.map(ex => (
              <tr key={ex.id} className={selectedIds.includes(ex.id) ? 'selected-row directory-row' : 'directory-row'}>
                <td>
                  <input type="checkbox" checked={selectedIds.includes(ex.id)} onChange={() => handleSelect(ex.id)} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getExceptionIcon(ex.iconType)}
                    <span className="font-semibold text-primary">{ex.type}</span>
                  </div>
                  <div className="text-xs text-muted mt-1 font-bold">{ex.id}</div>
                </td>
                <td>
                  <EmployeeProfileCell
                    firstName={ex.employee.split(" ")[0]}
                    lastName={ex.employee.split(" ").slice(1).join(" ")}
                    subtitle={`${ex.empCode} • ${ex.date} • ${ex.shift}`}
                  />
                </td>
                <td className="font-medium">{ex.details}</td>
                <td>
                  <StatusBadge status={ex.sla === 'Within SLA' ? 'Active' : 'Draft'} customLabel={ex.sla} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button
                      className="icon-btn text-primary"
                      title="Regularize Punch"
                      onClick={() => setRegularizeItem(ex)}
                    >
                      <IconPencil size={18} />
                    </button>
                    <button
                      className="icon-btn text-danger"
                      title="Mark as LWP (Reject)"
                      onClick={() => handleMarkLwp(ex)}
                    >
                      <IconX size={18} />
                    </button>
                    <button
                      className="icon-btn text-success"
                      title="Approve As-Is"
                      onClick={() => handleApproveAsIs(ex)}
                    >
                      <IconCheck size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExceptions.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="All Clear!" 
                    message="No attendance exceptions found for the selected criteria." 
                    icon={<IconCheck size={32} className="text-success" />} 
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Assign to Manager Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Delegate Exception to Supervisor"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssignSubmit}>Assign Selected</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Assignee Role</label>
            <select className="form-control">
              <option>Direct Plant Supervisor</option>
              <option>Department Head (HOD)</option>
              <option>HR Business Partner</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Resolution Deadline</label>
            <input type="date" className="form-control" defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Delegation Directives</label>
            <textarea className="form-control" rows={3} defaultValue="Please investigate biometric discrepancy and verify with plant gate register."></textarea>
          </div>
        </div>
      </Modal>

      {/* Single Item Regularization Modal */}
      {regularizeItem && (
        <Modal
          isOpen={Boolean(regularizeItem)}
          onClose={() => setRegularizeItem(null)}
          title={`Regularize Exception: ${regularizeItem.id}`}
          size="md"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setRegularizeItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSingleRegularizeSubmit}>
                <IconDeviceFloppy size={18} />
                <span>Save Regularization</span>
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
              <div className="font-bold">{regularizeItem.employee} ({regularizeItem.empCode})</div>
              <div className="text-muted text-xs">{regularizeItem.date} • {regularizeItem.type}</div>
              <div className="text-sm mt-1">{regularizeItem.details}</div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Corrected Punch-Out Time</label>
              <input
                type="time"
                className="form-control"
                value={correctedOutTime}
                onChange={(e) => setCorrectedOutTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Audit Justification / Reason *</label>
              <textarea
                className="form-control"
                rows={3}
                value={regularizeReason}
                onChange={(e) => setRegularizeReason(e.target.value)}
                required
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
