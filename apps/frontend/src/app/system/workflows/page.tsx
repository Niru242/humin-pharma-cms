'use client';

import { useState } from 'react';
import { IconArrowRight, IconMapRoute, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyWorkflows = [
  {
    id: '1',
    name: 'Standard Leave Approval',
    module: 'Leave',
    scope: 'All Employees',
    steps: '1 Step (Manager)',
    status: 'Published',
  },
  {
    id: '2',
    name: 'OT Approval - Plant',
    module: 'OT',
    scope: 'Mumbai Unit',
    steps: '2 Steps (Manager -> HOD)',
    status: 'Draft',
  }
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(dummyWorkflows);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="page-container">
      <SetPageHeader title="Approval Workflows" description="Design multi-step approval routing, SLAs, and escalation rules." />
      <div className="page-header">
        <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
          <IconPlus size={20} />
          Create Workflow
        </button>
      </div>
      <ModuleTabs />

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Workflow Name</th>
              <th>Module</th>
              <th>Scope</th>
              <th>Steps</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((wf) => (
              <tr key={wf.id}>
                <td className="font-medium">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconMapRoute size={18} className="text-primary" />
                    {wf.name}
                  </div>
                </td>
                <td>{wf.module}</td>
                <td className="text-muted">{wf.scope}</td>
                <td><span className="badge-outline">{wf.steps}</span></td>
                <td>
                  <span className={`badge badge-${wf.status.toLowerCase() === 'published' ? 'success' : 'draft'}`}>
                    {wf.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn text-muted"><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger"><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content drawer-large" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Design Workflow</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Definition & Scope</button>
              <button className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`} onClick={() => setActiveTab('steps')}>Routing Steps</button>
            </div>

            <form className="drawer-form-container" onSubmit={(e) => {
              e.preventDefault();
              setIsDrawerOpen(false);
            }}>
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Workflow Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. 2-Step Leave Approval" />
                    </div>
                    <div className="form-group">
                      <label>Target Module *</label>
                      <select className="form-control" required>
                        <option value="Leave">Leave Management</option>
                        <option value="Attendance">Attendance Regularization</option>
                        <option value="OT">Overtime Claim</option>
                        <option value="Employee Change">Employee Lifecycle Change</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Trigger Event *</label>
                      <select className="form-control">
                        <option value="Submit">On Submit / Apply</option>
                        <option value="Threshold">On Policy Threshold Exceeded</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select className="form-control">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Applicability Scope</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Employee Categories / Plants *</label>
                      <select multiple className="form-control" style={{height: '80px'}} required>
                        <option value="all">All Employees</option>
                        <option value="mfg">Manufacturing Staff Only</option>
                        <option value="mumbai">Mumbai Plant Employees</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'steps' && (
                  <div className="form-grid">
                    <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Approval Sequence</h4>
                      <button type="button" className="btn btn-secondary btn-sm">
                        <IconPlus size={16} /> Add Step
                      </button>
                    </div>
                    
                    <div className="form-group full-width">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                        
                        {/* Step 1 */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', background: 'var(--surface-color)' }}>
                          <h5 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>Step 1</h5>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Approver Source</label>
                              <select className="form-control" defaultValue="Manager">
                                <option value="Manager">Direct Reporting Manager</option>
                                <option value="HOD">Head of Department (HOD)</option>
                                <option value="Role">Specific Role (e.g. HR Admin)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>SLA (Hours)</label>
                              <input type="number" className="form-control" defaultValue="48" />
                            </div>
                            <div className="form-group">
                              <label>Action on SLA Breach</label>
                              <select className="form-control" defaultValue="Escalate">
                                <option value="Remind">Send Reminder</option>
                                <option value="Escalate">Escalate to Next Step</option>
                                <option value="Auto Approve">Auto Approve</option>
                              </select>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                              <button type="button" className="icon-btn text-danger"><IconTrash size={18} /></button>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <IconArrowRight size={24} className="text-muted" />
                        </div>

                        {/* Step 2 */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', background: 'var(--surface-color)' }}>
                          <h5 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>Step 2</h5>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Approver Source</label>
                              <select className="form-control" defaultValue="Role">
                                <option value="Manager">Direct Reporting Manager</option>
                                <option value="HOD">Head of Department (HOD)</option>
                                <option value="Role">Specific Role (e.g. HR Admin)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Specific Role</label>
                              <select className="form-control" defaultValue="HR">
                                <option value="HR">HR Administrator</option>
                                <option value="Payroll">Payroll Manager</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Action on SLA Breach</label>
                              <select className="form-control" defaultValue="Remind">
                                <option value="Remind">Send Reminder</option>
                                <option value="Escalate">Escalate to Next Step</option>
                                <option value="Auto Approve">Auto Approve</option>
                              </select>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                              <button type="button" className="icon-btn text-danger"><IconTrash size={18} /></button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Delegation Settings</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="delegation" defaultChecked style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="delegation" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Allow approvers to delegate their inbox temporarily
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
