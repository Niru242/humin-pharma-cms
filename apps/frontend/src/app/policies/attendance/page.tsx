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
    code: 'AP-HO-2026',
    name: 'General Office Policy',
    scope: 'Mumbai HO',
    punchPattern: 'In-Out',
    otCalculation: 'Disabled',
    status: 'Published',
  },
  {
    id: '2',
    code: 'AP-MFG-2026',
    name: 'Manufacturing Operators Policy',
    scope: 'Baddi Plant',
    punchPattern: 'Multiple',
    otCalculation: 'Approved Actual',
    status: 'Published',
  },
  {
    id: '3',
    code: 'AP-SHF-2026',
    name: 'Shift Worker Policy',
    scope: 'Baddi Plant',
    punchPattern: 'Shift Based',
    otCalculation: 'Planned OT Only',
    status: 'Draft',
  }
];

export default function AttendancePolicyPage() {
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
      <SetPageHeader title="Attendance Policies" description="Configure punch patterns, late mark rules, and overtime triggers." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Create Policy"
        searchPlaceholder="Search attendance policies by name, code, or scope..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Code</th>
              <th>Applicability Scope</th>
              <th>Punch Pattern</th>
              <th>OT Rule</th>
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
                <td><span className="badge badge-info">{pol.punchPattern}</span></td>
                <td>{pol.otCalculation}</td>
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
                <td colSpan={7}>
                  <EmptyState 
                    title="No Attendance Policies Found"
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
              <h2>Configure Attendance Policy</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Identity & Scope</button>
              <button className={`tab-btn ${activeTab === 'punch' ? 'active' : ''}`} onClick={() => setActiveTab('punch')}>Punch & Late Rules</button>
              <button className={`tab-btn ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Hours & OT</button>
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
                      <input type="text" className="form-control" required placeholder="e.g. AP-001" />
                    </div>
                    <div className="form-group">
                      <label>Policy Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. General Shift Policy" />
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
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Worker Categories *</label>
                      <select multiple className="form-control" style={{height: '80px'}} required>
                        <option value="office">Office</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="labour">Labour</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'punch' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Required Punch Pattern *</label>
                      <select className="form-control" required>
                        <option value="In-Out">In-Out (First and Last only)</option>
                        <option value="Multiple">Multiple (Track all breaks)</option>
                        <option value="Shift Based">Shift Based</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Missing Punch Treatment *</label>
                      <select className="form-control" required>
                        <option value="Exception">Mark as Exception (Requires Regularization)</option>
                        <option value="Half Day">Deduct Half Day</option>
                        <option value="Absent">Mark Absent</option>
                        <option value="Ignore">Ignore</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Late Coming Rules</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group">
                      <label>Grace Minutes (Overrides Shift)</label>
                      <input type="number" className="form-control" defaultValue="0" />
                    </div>
                    <div className="form-group">
                      <label>Late Count Threshold (Per Month)</label>
                      <input type="number" className="form-control" defaultValue="3" />
                      <small className="text-muted">How many times employee can be late before penalty</small>
                    </div>
                    <div className="form-group full-width">
                      <label>Threshold Action</label>
                      <select className="form-control">
                        <option value="Warning">System Warning / Notification</option>
                        <option value="Half Day">Deduct Half Day</option>
                        <option value="Leave Deduction">Deduct Privilege Leave</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'hours' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Day (Min Minutes)</label>
                      <input type="number" className="form-control" defaultValue="480" />
                    </div>
                    <div className="form-group">
                      <label>Half Day (Min Minutes)</label>
                      <input type="number" className="form-control" defaultValue="240" />
                    </div>
                    
                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Overtime Calculation</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width">
                      <label>OT Calculation Trigger *</label>
                      <select className="form-control" required>
                        <option value="Disabled">Disabled</option>
                        <option value="Actual">Auto-calculate from Actual Punches</option>
                        <option value="Approved Actual">Actual Punches + Manager Approval</option>
                        <option value="Planned">Based on Planned OT Roster Only</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Minimum OT Minutes required to trigger</label>
                      <input type="number" className="form-control" defaultValue="60" />
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Regularization Settings</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group">
                      <label>Allowed Days Back</label>
                      <input type="number" className="form-control" defaultValue="7" />
                      <small className="text-muted">How many days back an employee can fix attendance</small>
                    </div>
                    <div className="form-group">
                      <label>Max Requests Per Month</label>
                      <input type="number" className="form-control" defaultValue="5" />
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
