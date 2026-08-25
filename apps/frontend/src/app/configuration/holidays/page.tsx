'use client';

import { useState } from 'react';
import { IconCalendarStar, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyCalendars = [
  {
    id: '1',
    name: 'Maharashtra Public Holidays 2026',
    year: 2026,
    plants: 'Mumbai HO, Pune Warehouse',
    holidayCount: 14,
    status: 'Published',
  },
  {
    id: '2',
    name: 'Himachal Pradesh Public Holidays 2026',
    year: 2026,
    plants: 'Baddi Plant',
    holidayCount: 12,
    status: 'Draft',
  }
];

export default function HolidaysPage() {
  const [calendars, setCalendars] = useState(dummyCalendars);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');

  // We won't build the complex sub-form state for holidays to keep prototype lightweight,
  // just the shell UI to demonstrate capabilities.

  const filteredCalendars = calendars.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.plants.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Holiday Calendars" description="Define public holidays and plant shutdowns for specific regions." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Create Calendar"
        searchPlaceholder="Search calendars by name or plants..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Calendar Name</th>
              <th>Year</th>
              <th>Applicable Plants</th>
              <th>Total Holidays</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalendars.map((cal) => (
              <tr key={cal.id} className="directory-row">
                <td className="font-medium">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconCalendarStar size={18} className="text-muted" />
                    {cal.name}
                  </div>
                </td>
                <td>{cal.year}</td>
                <td className="text-muted">{cal.plants}</td>
                <td><span className="badge badge-info">{cal.holidayCount} Days</span></td>
                <td>
                  <StatusBadge status={cal.status === 'Published' ? 'Active' : 'Inactive'} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted"><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger"><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCalendars.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Calendars Found"
                    message="No holiday calendars match your search criteria."
                    icon={<IconCalendarStar size={32} />}
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
              <h2>New Holiday Calendar</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Scope & Details</button>
              <button className={`tab-btn ${activeTab === 'holidays' ? 'active' : ''}`} onClick={() => setActiveTab('holidays')}>Holiday List</button>
            </div>

            <form className="drawer-form-container" onSubmit={(e) => {
              e.preventDefault();
              setIsDrawerOpen(false);
            }}>
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Calendar Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. MH Public Holidays 2026" />
                    </div>
                    <div className="form-group">
                      <label>Year *</label>
                      <input type="number" className="form-control" required defaultValue={new Date().getFullYear()} />
                    </div>
                    <div className="form-group">
                      <label>Publish Status *</label>
                      <select className="form-control">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published (Locks Calendar)</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Applicability Scope</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    
                    <div className="form-group">
                      <label>Company *</label>
                      <select className="form-control" required>
                        <option value="">Select Company</option>
                        <option value="1">Acme Corp</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Target Plants *</label>
                      <select multiple className="form-control" style={{height: '80px'}} required>
                        <option value="1">Mumbai Manufacturing Unit</option>
                        <option value="2">Pune Warehouse & Logistics</option>
                        <option value="3">Bangalore R&D Center</option>
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple plants</small>
                    </div>
                  </div>
                )}

                {activeTab === 'holidays' && (
                  <div className="form-grid">
                    <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Add Holidays</h4>
                      <button type="button" className="btn btn-secondary btn-sm">
                        <IconPlus size={16} /> Add Row
                      </button>
                    </div>
                    
                    <div className="form-group full-width">
                      <table className="data-grid" style={{ marginTop: '0.5rem' }}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Holiday Name</th>
                            <th>Type</th>
                            <th>Paid Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input type="date" className="form-control" defaultValue="2026-01-26" /></td>
                            <td><input type="text" className="form-control" defaultValue="Republic Day" /></td>
                            <td>
                              <select className="form-control" defaultValue="Public">
                                <option value="Public">Public</option>
                                <option value="Optional">Optional</option>
                                <option value="Shutdown">Plant Shutdown</option>
                              </select>
                            </td>
                            <td>
                              <select className="form-control" defaultValue="Paid">
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                              </select>
                            </td>
                            <td>
                              <button type="button" className="icon-btn text-danger"><IconTrash size={18} /></button>
                            </td>
                          </tr>
                          <tr>
                            <td><input type="date" className="form-control" defaultValue="2026-05-01" /></td>
                            <td><input type="text" className="form-control" defaultValue="Maharashtra Day" /></td>
                            <td>
                              <select className="form-control" defaultValue="Public">
                                <option value="Public">Public</option>
                                <option value="Optional">Optional</option>
                                <option value="Shutdown">Plant Shutdown</option>
                              </select>
                            </td>
                            <td>
                              <select className="form-control" defaultValue="Paid">
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                              </select>
                            </td>
                            <td>
                              <button type="button" className="icon-btn text-danger"><IconTrash size={18} /></button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Calendar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
