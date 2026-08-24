'use client';

import { useState } from 'react';
import { IconBriefcase, IconPencil, IconTrash } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';

const dummyDesignations = [
  { id: '1', code: 'DES-VP-OP', name: 'VP of Operations', level: '6', jobFamily: 'Management', status: 'Active' },
  { id: '2', code: 'DES-SR-SCI', name: 'Senior Scientist', level: '5', jobFamily: 'R&D', status: 'Active' },
  { id: '3', code: 'DES-HR-MGR', name: 'HR Manager', level: '4', jobFamily: 'Human Resources', status: 'Active' },
  { id: '4', code: 'DES-OPR', name: 'Machine Operator', level: '2', jobFamily: 'Operations', status: 'Active' },
  { id: '5', code: 'DES-QC-L', name: 'QC Lead', level: '4', jobFamily: 'Quality', status: 'Active' },
];

const defaultFormData = {
  id: '',
  code: '',
  name: '',
  level: '1',
  jobFamily: 'Operations',
  status: 'Active',
};

export default function DesignationsPage() {
  const [designations, setDesignations] = useState(dummyDesignations);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setDesignations(designations.map(d => d.id === formData.id ? formData : d));
    } else {
      setDesignations([...designations, { ...formData, id: Math.random().toString() }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (desig: any) => {
    setFormData(desig);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      setDesignations(designations.filter(d => d.id !== id));
    }
  };

  const filteredDesignations = designations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.jobFamily.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Designations" description="Manage standard job titles, levels, and classifications." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Designation"
        searchPlaceholder="Search designations by name, code, or family..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Designation Name</th>
              <th>Level</th>
              <th>Job Family</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDesignations.map((desig) => (
              <tr key={desig.id} className="directory-row">
                <td><span className="font-medium text-primary">{desig.code}</span></td>
                <td className="font-medium">{desig.name}</td>
                <td><span className="badge badge-draft">{desig.level}</span></td>
                <td className="text-muted">{desig.jobFamily}</td>
                <td>
                  <StatusBadge status={desig.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(desig)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(desig.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDesignations.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Designations Found"
                    message="No designations match your search criteria."
                    icon={<IconBriefcase size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isEditing ? "Edit Designation" : "Add New Designation"}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Designation</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="drawer-form-container">
          <div className="drawer-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Designation Code *</label>
                <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. DES-HR-MGR" disabled={isEditing} />
              </div>
              <div className="form-group">
                <label>Designation Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. HR Manager" />
              </div>
              <div className="form-group">
                <label>Job Family *</label>
                <select className="form-control" required value={formData.jobFamily} onChange={(e) => setFormData({...formData, jobFamily: e.target.value})}>
                  <option value="Management">Management</option>
                  <option value="R&D">R&D</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>
              <div className="form-group">
                <label>Level *</label>
                <input type="number" className="form-control" min="1" max="10" required value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} placeholder="1" />
              </div>
              <div className="form-group full-width">
                <label>Status *</label>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
