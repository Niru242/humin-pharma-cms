'use client';

import { useState } from 'react';
import { IconUsers, IconPencil, IconTrash } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';

const dummyPositions = [
  { id: '1', code: 'POS-OP-01', title: 'Operations VP', designation: 'VP of Operations', department: 'Operations', headcount: 1, vacancies: 0, status: 'Active' },
  { id: '2', code: 'POS-RD-01', title: 'Senior Formulation Scientist', designation: 'Senior Scientist', department: 'R&D', headcount: 5, vacancies: 1, status: 'Active' },
  { id: '3', code: 'POS-HR-01', title: 'Plant HR Manager', designation: 'HR Manager', department: 'Human Resources', headcount: 1, vacancies: 0, status: 'Active' },
  { id: '4', code: 'POS-PR-01', title: 'Plant Operator (Shift)', designation: 'Machine Operator', department: 'Production', headcount: 45, vacancies: 3, status: 'Active' },
  { id: '5', code: 'POS-QC-01', title: 'Microbiology QC Lead', designation: 'QC Lead', department: 'Quality Control', headcount: 2, vacancies: 0, status: 'Active' },
];

const defaultFormData = {
  id: '',
  code: '',
  title: '',
  designation: 'Machine Operator',
  department: 'Production',
  headcount: 1,
  vacancies: 0,
  status: 'Active',
};

export default function PositionsPage() {
  const [positions, setPositions] = useState(dummyPositions);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setPositions(positions.map(p => p.id === formData.id ? formData : p));
    } else {
      setPositions([...positions, { ...formData, id: Math.random().toString() }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (pos: any) => {
    setFormData(pos);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  const filteredPositions = positions.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.designation.toLowerCase().includes(search.toLowerCase()) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Positions (Headcount)" description="Manage approved headcount, job roles, and vacancies across departments." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Position"
        searchPlaceholder="Search positions by code, title, or department..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Position Title</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Headcount</th>
              <th>Vacancies</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPositions.map((pos) => (
              <tr key={pos.id} className="directory-row">
                <td><span className="font-medium text-primary">{pos.code}</span></td>
                <td className="font-medium">{pos.title}</td>
                <td className="text-muted">{pos.designation}</td>
                <td className="text-muted">{pos.department}</td>
                <td><span className="badge badge-info">{pos.headcount}</span></td>
                <td>
                  <span className={`badge ${pos.vacancies > 0 ? 'badge-warning' : 'badge-draft'}`}>
                    {pos.vacancies}
                  </span>
                </td>
                <td>
                  <StatusBadge status={pos.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(pos)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(pos.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPositions.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState 
                    title="No Positions Found"
                    message="No positions match your search criteria."
                    icon={<IconUsers size={32} />}
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
        title={isEditing ? "Edit Position" : "Add New Position"}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Position</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="drawer-form-container">
          <div className="drawer-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Position Code *</label>
                <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. POS-PR-01" disabled={isEditing} />
              </div>
              <div className="form-group">
                <label>Position Title *</label>
                <input type="text" className="form-control" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Plant Operator (Shift)" />
              </div>
              <div className="form-group">
                <label>Designation *</label>
                <select className="form-control" required value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})}>
                  <option value="VP of Operations">VP of Operations</option>
                  <option value="Senior Scientist">Senior Scientist</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Machine Operator">Machine Operator</option>
                  <option value="QC Lead">QC Lead</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select className="form-control" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="Operations">Operations</option>
                  <option value="R&D">R&D</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Production">Production</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              <div className="form-group">
                <label>Approved Headcount *</label>
                <input type="number" className="form-control" min="1" required value={formData.headcount} onChange={(e) => setFormData({...formData, headcount: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Vacancies</label>
                <input type="number" className="form-control" min="0" required value={formData.vacancies} onChange={(e) => setFormData({...formData, vacancies: parseInt(e.target.value)})} />
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
