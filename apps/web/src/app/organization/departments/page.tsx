'use client';

import { useState } from 'react';
import { IconHierarchy, IconPencil, IconTrash } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';

const dummyDepartments = [
  { id: '1', code: 'DEP-OP', name: 'Operations', plant: 'Mumbai HO', head: 'Sarah Jenkins', headcount: 45 },
  { id: '2', code: 'DEP-HR', name: 'Human Resources', plant: 'Mumbai HO', head: 'Priya Patel', headcount: 12 },
  { id: '3', code: 'DEP-RD', name: 'R&D', plant: 'Mumbai HO', head: 'Rahul Sharma', headcount: 38 },
  { id: '4', code: 'DEP-PR', name: 'Production', plant: 'Baddi Plant', head: 'Vikram Singh', headcount: 120 },
  { id: '5', code: 'DEP-QC', name: 'Quality Control', plant: 'Baddi Plant', head: 'Rajesh Iyer', headcount: 30 },
];

const defaultFormData = {
  id: '',
  code: '',
  name: '',
  plantId: 'HO-01',
  head: '',
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(dummyDepartments);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlant = formData.plantId === 'MF-01' ? 'Baddi Plant' : 'Mumbai HO';
    if (isEditing) {
      setDepartments(departments.map(d => d.id === formData.id ? { ...d, ...formData, plant: newPlant } : d));
    } else {
      setDepartments([...departments, { ...formData, id: Math.random().toString(), plant: newPlant, headcount: 0 }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (dept: any) => {
    setFormData({
      ...defaultFormData,
      ...dept,
      plantId: dept.plant === 'Baddi Plant' ? 'MF-01' : 'HO-01',
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.plant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Departments" description="Manage organization structure and department hierarchies." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Department"
        searchPlaceholder="Search departments by name or code..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Department Name</th>
              <th>Location / Plant</th>
              <th>Department Head</th>
              <th>Headcount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="directory-row">
                <td><span className="font-medium text-primary">{dept.code}</span></td>
                <td className="font-medium">{dept.name}</td>
                <td className="text-muted">{dept.plant}</td>
                <td className="text-muted">{dept.head || '-'}</td>
                <td><span className="badge badge-draft">{dept.headcount}</span></td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(dept)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(dept.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDepartments.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Departments Found"
                    message="No departments match your search criteria."
                    icon={<IconHierarchy size={32} />}
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
        title={isEditing ? "Edit Department" : "Add New Department"}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Department</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="drawer-form-container">
          <div className="drawer-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Department Code *</label>
                <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. DEP-PR" disabled={isEditing} />
              </div>
              <div className="form-group">
                <label>Department Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Production" />
              </div>
              <div className="form-group full-width">
                <label>Location / Plant *</label>
                <select className="form-control" required value={formData.plantId} onChange={(e) => setFormData({...formData, plantId: e.target.value})}>
                  <option value="HO-01">Mumbai HO</option>
                  <option value="MF-01">Baddi Plant</option>
                  <option value="WH-01">Pune Warehouse</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Department Head</label>
                <input type="text" className="form-control" value={formData.head} onChange={(e) => setFormData({...formData, head: e.target.value})} placeholder="Name of HOD" />
              </div>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
