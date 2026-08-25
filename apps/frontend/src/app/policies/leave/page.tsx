'use client';

import { useState } from 'react';
import { IconListCheck, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyPolicies = [
  {
    id: '1',
    code: 'LP-PL-2026',
    name: 'Privilege Leave Policy',
    scope: 'All Plants',
    entitlement: '21 Days / Annual',
    status: 'Published',
  },
  {
    id: '2',
    code: 'LP-SL-2026',
    name: 'Sick Leave Policy',
    scope: 'All Plants',
    entitlement: '7 Days / Annual',
    status: 'Published',
  },
  {
    id: '3',
    code: 'LP-CL-2026',
    name: 'Casual Leave Policy',
    scope: 'All Plants',
    entitlement: '7 Days / Annual',
    status: 'Published',
  },
  {
    id: '4',
    code: 'LP-ML-2026',
    name: 'Maternity Leave Policy',
    scope: 'All Plants',
    entitlement: '180 Days / Incident',
    status: 'Draft',
  }
];

export default function LeavePolicyPage() {
  const [policies, setPolicies] = useState(dummyPolicies);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');

  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.scope.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Leave Policies" description="Configure leave accruals, carry forwards, and entitlement rules." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Create Policy"
        searchPlaceholder="Search leave policies by name, code, or scope..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Code</th>
              <th>Applicability Scope</th>
              <th>Annual Entitlement</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((pol) => (
              <tr key={pol.id} className="directory-row">
                <td className="font-medium">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconListCheck size={18} className="text-primary" />
                    {pol.name}
                  </div>
                </td>
                <td><span className="font-medium text-primary">{pol.code}</span></td>
                <td className="text-muted">{pol.scope}</td>
                <td><span className="badge badge-info">{pol.entitlement}</span></td>
                <td>
                  <StatusBadge status={pol.status === 'Published' ? 'Active' : 'Inactive'} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted"><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger"><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPolicies.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Leave Policies Found"
                    message="No policies match your search criteria."
                    icon={<IconListCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content drawer-large" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Configure Leave Policy</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Identity & Scope</button>
              <button className={`tab-btn ${activeTab === 'accrual' ? 'active' : ''}`} onClick={() => setActiveTab('accrual')}>Accrual & Balance</button>
              <button className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Usage Rules & Workflow</button>
            </div>

            <form className="drawer-form-container" onSubmit={(e) => {
              e.preventDefault();
              setIsDrawerOpen(false);
            }}>
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Policy Code *</label>
                      <input type="text" className="form-control" required placeholder="e.g. LP-001" />
                    </div>
                    <div className="form-group">
                      <label>Policy Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. Sick Leave" />
                    </div>
                    <div className="form-group">
                      <label>Effective From *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>Publish Status *</label>
                      <select className="form-control">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published (Locks Policy)</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Applicability Scope</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Company / Plant Scope *</label>
                      <select multiple className="form-control" style={{height: '80px'}} required>
                        <option value="all">All Companies & Plants</option>
                        <option value="1">Mumbai Manufacturing Unit</option>
                        <option value="2">Pune Warehouse</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Applicable Employment Types *</label>
                      <select multiple className="form-control" style={{height: '80px'}} required>
                        <option value="ft">Full Time</option>
                        <option value="pt">Part Time</option>
                        <option value="ct">Contractor</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'accrual' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Accrual Method *</label>
                      <select className="form-control" required>
                        <option value="Monthly">Monthly</option>
                        <option value="Annual">Annual Upfront</option>
                        <option value="Joining Prorata">Joining Prorata</option>
                        <option value="Manual">Manual Grant Only</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Annual Entitlement (Days) *</label>
                      <input type="number" className="form-control" required defaultValue="21" />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="prorate" defaultChecked style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="prorate" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Prorate entitlement for mid-year joiners
                      </label>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Carry Forward Rules</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="cf" defaultChecked style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="cf" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Allow balance carry forward to next year
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Maximum Carry Forward (Days)</label>
                      <input type="number" className="form-control" defaultValue="42" />
                    </div>
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Min Days Per Request</label>
                      <input type="number" step="0.5" className="form-control" defaultValue="0.5" />
                    </div>
                    <div className="form-group">
                      <label>Max Days Per Request</label>
                      <input type="number" step="0.5" className="form-control" placeholder="No limit" />
                    </div>
                    
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="halfDay" defaultChecked style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="halfDay" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Allow Half Day Requests
                      </label>
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="negative" style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="negative" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Allow Negative Balance (Overdraw)
                      </label>
                    </div>

                    <div className="form-group full-width">
                      <label>Document/Proof Required After (Days)</label>
                      <input type="number" className="form-control" defaultValue="3" />
                      <small className="text-muted">Require medical certificate if leave exceeds this duration</small>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Approval Routing</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width">
                      <label>Approval Workflow *</label>
                      <select className="form-control" required>
                        <option value="">Select Workflow</option>
                        <option value="1">1-Step: Reporting Manager</option>
                        <option value="2">2-Step: Manager + HR</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
