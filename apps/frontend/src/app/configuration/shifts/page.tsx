'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconClock } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyShifts = [
  {
    id: '1',
    code: 'SHF-GEN',
    name: 'General Shift',
    startTime: '09:00',
    endTime: '18:00',
    crossesMidnight: false,
    status: 'Active',
  },
  {
    id: '2',
    code: 'SHF-NGT',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '06:00',
    crossesMidnight: true,
    status: 'Active',
  },
  {
    id: '3',
    code: 'SHF-FST',
    name: 'First Shift (Morning)',
    startTime: '06:00',
    endTime: '14:00',
    crossesMidnight: false,
    status: 'Active',
  }
];

const defaultFormData = {
  code: '',
  name: '',
  description: '',
  effectiveFrom: new Date().toISOString().split('T')[0],
  status: 'Active',
  startTime: '09:00',
  endTime: '18:00',
  crossesMidnight: false,
  paidBreakMinutes: 0,
  unpaidBreakMinutes: 60,
  lateGraceMinutes: 15,
  earlyOutGraceMinutes: 10,
  fullDayMinutes: 480,
  halfDayMinutes: 240,
  otEligible: false,
  otStartAfterMinutes: 30,
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState(dummyShifts);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newShf = {
      id: Math.random().toString(),
      code: formData.code,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      crossesMidnight: formData.crossesMidnight,
      status: formData.status,
    };
    setShifts([newShf, ...shifts]);
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setActiveTab('basic');
  };

  const filteredShifts = shifts.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Shifts & Timings" description="Manage standard working hours, breaks, grace periods, and overtime rules." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Add Shift"
        searchPlaceholder="Search shifts by name or code..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Timings</th>
              <th>Crosses Midnight</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.map((shf) => (
              <tr key={shf.id} className="directory-row">
                <td><span className="font-medium text-primary">{shf.code}</span></td>
                <td className="font-medium">{shf.name}</td>
                <td className="text-muted">{shf.startTime} to {shf.endTime}</td>
                <td>{shf.crossesMidnight ? <span className="badge badge-warning">Yes</span> : 'No'}</td>
                <td>
                  <StatusBadge status={shf.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted"><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger"><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredShifts.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Shifts Found"
                    message="No shifts match your search criteria."
                    icon={<IconClock size={32} />}
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
              <h2>Add New Shift</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Details</button>
              <button className={`tab-btn ${activeTab === 'timing' ? 'active' : ''}`} onClick={() => setActiveTab('timing')}>Timings & Breaks</button>
              <button className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Rules & Overtime</button>
            </div>

            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Shift Code *</label>
                      <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. SHF-01" />
                    </div>
                    <div className="form-group">
                      <label>Shift Name *</label>
                      <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Morning Shift" />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Effective From *</label>
                      <input type="date" className="form-control" required value={formData.effectiveFrom} onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'timing' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input type="time" className="form-control" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>End Time *</label>
                      <input type="time" className="form-control" required value={formData.endTime} onChange={(e) => {
                        const newEnd = e.target.value;
                        const crosses = formData.startTime > newEnd;
                        setFormData({...formData, endTime: newEnd, crossesMidnight: crosses});
                      }} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id="crossesMidnight" 
                        checked={formData.crossesMidnight} 
                        onChange={(e) => setFormData({...formData, crossesMidnight: e.target.checked})} 
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="crossesMidnight" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Crosses Midnight (System inferred from timings)
                      </label>
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Break Configuration</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>

                    <div className="form-group">
                      <label>Paid Break (Minutes)</label>
                      <input type="number" className="form-control" value={formData.paidBreakMinutes} onChange={(e) => setFormData({...formData, paidBreakMinutes: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Unpaid Break (Minutes)</label>
                      <input type="number" className="form-control" value={formData.unpaidBreakMinutes} onChange={(e) => setFormData({...formData, unpaidBreakMinutes: parseInt(e.target.value)})} />
                    </div>
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Grace Periods</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group">
                      <label>Late In Grace (Minutes)</label>
                      <input type="number" className="form-control" value={formData.lateGraceMinutes} onChange={(e) => setFormData({...formData, lateGraceMinutes: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Early Out Grace (Minutes)</label>
                      <input type="number" className="form-control" value={formData.earlyOutGraceMinutes} onChange={(e) => setFormData({...formData, earlyOutGraceMinutes: parseInt(e.target.value)})} />
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Calculation Minimums</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group">
                      <label>Minimum Full Day (Minutes)</label>
                      <input type="number" className="form-control" value={formData.fullDayMinutes} onChange={(e) => setFormData({...formData, fullDayMinutes: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Minimum Half Day (Minutes)</label>
                      <input type="number" className="form-control" value={formData.halfDayMinutes} onChange={(e) => setFormData({...formData, halfDayMinutes: parseInt(e.target.value)})} />
                    </div>

                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Overtime Settings</h4>
                      <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id="otEligible" 
                        checked={formData.otEligible} 
                        onChange={(e) => setFormData({...formData, otEligible: e.target.checked})} 
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="otEligible" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Overtime Eligible on this Shift
                      </label>
                    </div>
                    {formData.otEligible && (
                      <div className="form-group full-width">
                        <label>OT Starts After (Minutes of extra work)</label>
                        <input type="number" className="form-control" value={formData.otStartAfterMinutes} onChange={(e) => setFormData({...formData, otStartAfterMinutes: parseInt(e.target.value)})} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
