'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconStars } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

const dummyGrades = [
  {
    id: '1',
    code: 'GRD-VP',
    name: 'Vice President (Level 6)',
    masterType: 'Grade',
    sortOrder: 10,
    probationDays: 180,
    status: 'Active',
  },
  {
    id: '2',
    code: 'GRD-SR',
    name: 'Senior (Level 5)',
    masterType: 'Grade',
    sortOrder: 20,
    probationDays: 90,
    status: 'Active',
  },
  {
    id: '3',
    code: 'GRD-MGR',
    name: 'Manager / Lead (Level 4)',
    masterType: 'Grade',
    sortOrder: 30,
    probationDays: 90,
    status: 'Active',
  },
  {
    id: '4',
    code: 'GRD-OPR',
    name: 'Operator (Level 2)',
    masterType: 'Grade',
    sortOrder: 50,
    probationDays: 60,
    status: 'Active',
  }
];

const defaultFormData = {
  code: '',
  name: '',
  description: '',
  effectiveFrom: new Date().toISOString().split('T')[0],
  status: 'Active',
  masterType: 'Grade',
  sortOrder: 10,
  probationDays: 90,
  noticeDays: 30,
  overtimeEligible: false,
};

export default function GradesPage() {
  const [grades, setGrades] = useState(dummyGrades);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrd = {
      id: Math.random().toString(),
      code: formData.code,
      name: formData.name,
      masterType: formData.masterType,
      sortOrder: formData.sortOrder,
      probationDays: formData.probationDays,
      status: formData.status,
    };
    setGrades([newGrd, ...grades]);
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setActiveTab('basic');
  };

  const filteredGrades = grades.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.code.toLowerCase().includes(search.toLowerCase()) ||
    g.masterType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Grades & Employment Types" description="Manage standard employee levels, probation rules, and bands." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsDrawerOpen(true)}
        addBtnText="Add Grade"
        searchPlaceholder="Search grades by name, code, or type..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Sort Order</th>
              <th>Probation (Days)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grd) => (
              <tr key={grd.id} className="directory-row">
                <td><span className="font-medium text-primary">{grd.code}</span></td>
                <td className="font-medium">{grd.name}</td>
                <td className="text-muted">{grd.masterType}</td>
                <td><span className="badge badge-info">{grd.sortOrder}</span></td>
                <td>{grd.probationDays} Days</td>
                <td>
                  <StatusBadge status={grd.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted"><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger"><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGrades.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState 
                    title="No Grades Found"
                    message="No grades match your search criteria."
                    icon={<IconStars size={32} />}
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
              <h2>Add New Grade / Type</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <div className="drawer-tabs">
              <button className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Details</button>
              <button className={`tab-btn ${activeTab === 'defaults' ? 'active' : ''}`} onClick={() => setActiveTab('defaults')}>Rules & Defaults</button>
            </div>

            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                {activeTab === 'basic' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Code *</label>
                      <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. GRD-M1" />
                    </div>
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Management 1" />
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

                {activeTab === 'defaults' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Master Type *</label>
                      <select className="form-control" required value={formData.masterType} onChange={(e) => setFormData({...formData, masterType: e.target.value})}>
                        <option value="Grade">Grade</option>
                        <option value="Employment Type">Employment Type</option>
                        <option value="Worker Category">Worker Category</option>
                        <option value="Band">Band</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Rank / Sort Order *</label>
                      <input type="number" className="form-control" required value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Probation Days</label>
                      <input type="number" className="form-control" value={formData.probationDays} onChange={(e) => setFormData({...formData, probationDays: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>Notice Days</label>
                      <input type="number" className="form-control" value={formData.noticeDays} onChange={(e) => setFormData({...formData, noticeDays: parseInt(e.target.value)})} />
                    </div>
                    <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                      <input 
                        type="checkbox" 
                        id="otEligible" 
                        checked={formData.overtimeEligible} 
                        onChange={(e) => setFormData({...formData, overtimeEligible: e.target.checked})} 
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="otEligible" style={{ margin: 0, fontWeight: 500, color: 'var(--text-color)' }}>
                        Overtime Eligible (Default)
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
