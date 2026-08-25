'use client';

import { useState } from 'react';
import { IconBriefcase, IconDownload, IconFilter, IconHistory, IconPencil, IconCheck } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyBalances = [
  {
    id: '1',
    employee: 'Rahul Sharma (EMP-001)',
    department: 'Engineering',
    leaveType: 'Privilege Leave (PL)',
    opening: 10.0,
    accrued: 2.5,
    used: 4.0,
    adjusted: 0.0,
    expired: 0.0,
    closing: 8.5
  },
  {
    id: '2',
    employee: 'Rahul Sharma (EMP-001)',
    department: 'Engineering',
    leaveType: 'Sick Leave (SL)',
    opening: 6.0,
    accrued: 0.0,
    used: 1.0,
    adjusted: 0.0,
    expired: 0.0,
    closing: 5.0
  },
  {
    id: '3',
    employee: 'Priya Desai (EMP-002)',
    department: 'Sales',
    leaveType: 'Privilege Leave (PL)',
    opening: 15.0,
    accrued: 2.5,
    used: 15.0,
    adjusted: -2.5,
    expired: 0.0,
    closing: 0.0
  }
];

export default function LeaveBalancesPage() {
  const [balances] = useState(dummyBalances);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBalances = balances.filter(b => 
    b.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterNode = (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Leave Year</label>
        <select className="form-control">
          <option>2026</option>
          <option>2025</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, flex: 1 }}>
        <label>Leave Type</label>
        <select className="form-control">
          <option>All Types</option>
          <option>Privilege Leave (PL)</option>
          <option>Sick Leave (SL)</option>
        </select>
      </div>
      <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
        <button className="btn btn-secondary"><IconFilter size={18} /> Apply</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Employee Leave Ledger" description="View current balances and transaction history across the organization." />
      <div className="page-header" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">
            <IconDownload size={20} />
            Export Ledger
          </button>
        </div>
      </div>
      <ModuleTabs />

      <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
        
        {/* Ledger Grid */}
        <div style={{ flex: selectedRecord ? '2' : '1', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <StandardTableLayout
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by employee or department..."
            filterNode={filterNode}
          >
            <table className="data-grid directory-grid">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Opening</th>
                  <th>Accrued</th>
                  <th>Used</th>
                  <th>Adjustments</th>
                  <th>Closing</th>
                  {!selectedRecord && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBalances.map((record) => (
                  <tr 
                    key={record.id} 
                    className="directory-row"
                    onClick={() => setSelectedRecord(record)}
                    style={{ 
                      cursor: 'pointer', 
                      background: selectedRecord?.id === record.id ? 'rgba(var(--primary-color-rgb), 0.05)' : 'transparent',
                      borderLeft: selectedRecord?.id === record.id ? '3px solid var(--primary-color)' : '3px solid transparent'
                    }}
                  >
                    <td>
                      <div className="font-medium text-primary">{record.employee}</div>
                      <div className="text-sm text-muted">{record.department}</div>
                    </td>
                    <td><span className="badge badge-info">{record.leaveType}</span></td>
                    <td className="font-medium">{record.opening.toFixed(1)}</td>
                    <td className="text-success font-bold">+{record.accrued.toFixed(1)}</td>
                    <td className="text-danger font-bold">-{record.used.toFixed(1)}</td>
                    <td className="font-medium">{record.adjusted === 0 ? '-' : record.adjusted.toFixed(1)}</td>
                    <td className="font-bold text-primary">{record.closing.toFixed(1)}</td>
                    {!selectedRecord && (
                      <td>
                        <button className="icon-btn text-muted" title="View Transactions">
                          <IconHistory size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredBalances.length === 0 && (
                  <tr>
                    <td colSpan={selectedRecord ? 7 : 8}>
                      <EmptyState 
                        title="No Ledgers Found"
                        message="No leave balances match your search criteria."
                        icon={<IconCheck size={32} />}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </StandardTableLayout>
        </div>

        {/* Transaction History Pane */}
        {selectedRecord && (
          <div style={{ flex: 1, background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconBriefcase size={20} className="text-primary" />
                  Detailed Ledger
                </h3>
                <div className="text-muted text-sm">{selectedRecord.employee} • {selectedRecord.leaveType}</div>
              </div>
              <button className="close-btn" onClick={() => setSelectedRecord(null)}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                <div className="text-2xl font-bold text-primary">{selectedRecord.closing.toFixed(1)}</div>
                <div className="text-sm text-muted mt-1">Available Balance</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <a href="/leave/adjustments" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <IconPencil size={16} /> Adjust Balance
                </a>
              </div>
            </div>

            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Transaction History</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
              
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-medium">Leave Consumed</div>
                  <div className="text-sm text-muted">Family function (Req ID: LR-102)</div>
                  <div className="text-xs text-muted mt-1">20 Jul 2026</div>
                </div>
                <div className="text-danger font-bold">-4.0</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-medium">Monthly Accrual</div>
                  <div className="text-sm text-muted">System Auto-Credit</div>
                  <div className="text-xs text-muted mt-1">01 Jul 2026</div>
                </div>
                <div className="text-success font-bold">+1.25</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-medium">Monthly Accrual</div>
                  <div className="text-sm text-muted">System Auto-Credit</div>
                  <div className="text-xs text-muted mt-1">01 Jun 2026</div>
                </div>
                <div className="text-success font-bold">+1.25</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)' }}>
                <div>
                  <div className="font-medium">Opening Balance</div>
                  <div className="text-sm text-muted">Carry Forward from 2025</div>
                  <div className="text-xs text-muted mt-1">01 Jan 2026</div>
                </div>
                <div className="font-bold">10.0</div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
