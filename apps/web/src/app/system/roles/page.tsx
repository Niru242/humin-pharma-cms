'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconShieldCheck, IconTrash } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyRoles = [
  {
    id: '1',
    code: 'RL-SA',
    name: 'Super Admin',
    type: 'System',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: '2',
    code: 'RL-HR-MUM',
    name: 'HR Manager - Mumbai',
    type: 'HR',
    scope: 'Plant',
    status: 'Active',
  }
];

export default function RolesPage() {
  const [roles, setRoles] = useState(dummyRoles);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="page-container">
      <SetPageHeader title="Roles & Access Control" description="Define user roles, module permissions, and data visibility scopes." />
      <div className="page-header">
        <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
          <IconPlus size={20} />
          Create Role
        </button>
      </div>
      <ModuleTabs />

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Data Scope</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rl) => (
              <tr key={rl.id}>
                <td className="font-medium">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconShieldCheck size={18} className="text-primary" />
                    {rl.name}
                  </div>
                </td>
                <td><span className="badge-outline">{rl.code}</span></td>
                <td className="text-muted">{rl.type}</td>
                <td>{rl.scope}</td>
                <td>
                  <span className={`badge badge-${rl.status.toLowerCase() === 'active' ? 'success' : 'draft'}`}>
                    {rl.status}
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
              <h2>Define Security Role</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Identity & Scope</button>
              <button className={`tab-btn ${activeTab === 'perms' ? 'active' : ''}`} onClick={() => setActiveTab('perms')}>Module Permissions</button>
              <button className={`tab-btn ${activeTab === 'fields' ? 'active' : ''}`} onClick={() => setActiveTab('fields')}>Field & Action Controls</button>
            </div>

            <form className="drawer-form-container" onSubmit={(e) => {
              e.preventDefault();
              setIsDrawerOpen(false);
            }}>
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Role Code *</label>
                      <input type="text" className="form-control" required placeholder="e.g. RL-HR" />
                    </div>
                    <div className="form-group">
                      <label>Role Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. HR Administrator" />
                    </div>
                    <div className="form-group">
                      <label>Role Type *</label>
                      <select className="form-control" required>
                        <option value="System">System Administrator</option>
                        <option value="HR">HR / Payroll</option>
                        <option value="Manager">Line Manager / HOD</option>
                        <option value="Employee">Employee Self Service</option>
                        <option value="Auditor">Auditor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select className="form-control">
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Data Visibility Scope</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Scope Level *</label>
                      <select className="form-control" required>
                        <option value="Global">Global (All Data)</option>
                        <option value="Company">Specific Companies</option>
                        <option value="Plant">Specific Plants</option>
                        <option value="Department">Specific Departments</option>
                        <option value="Hierarchy">Reporting Hierarchy (Team Only)</option>
                        <option value="Self">Self Data Only</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'perms' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <table className="data-grid">
                        <thead>
                          <tr>
                            <th>Module</th>
                            <th>View</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Approve</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="font-medium">Employee Directory</td>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                          </tr>
                          <tr>
                            <td className="font-medium">Leave Management</td>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" defaultChecked /></td>
                          </tr>
                          <tr>
                            <td className="font-medium">Time & Attendance</td>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" defaultChecked /></td>
                          </tr>
                          <tr>
                            <td className="font-medium">System Settings</td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'fields' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Sensitive Field Access</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width">
                      <table className="data-grid">
                        <thead>
                          <tr>
                            <th>Data Element</th>
                            <th>Access Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>National ID / SSN</td>
                            <td>
                              <select className="form-control btn-sm">
                                <option>Denied</option>
                                <option>Masked (e.g. XXX-XX-1234)</option>
                                <option>Full Read</option>
                                <option>Read & Edit</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td>Salary / CTC</td>
                            <td>
                              <select className="form-control btn-sm">
                                <option>Denied</option>
                                <option>Masked</option>
                                <option>Full Read</option>
                                <option>Read & Edit</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Maker-Checker Rules</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="makerChecker" defaultChecked style={{ width: '20px', height: '20px' }} />
                      <label htmlFor="makerChecker" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Enforce Maker-Checker (Users with this role cannot approve their own transactions)
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
