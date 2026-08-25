'use client';

import { useState } from 'react';
import { IconBuilding, IconPencil, IconTrash } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';

const dummyPlants = [
  {
    id: '1',
    code: 'HO-01',
    name: 'Mumbai HO',
    company: 'PharmaCorp Inc.',
    region: 'West',
    status: 'Active',
    address: '123 Business Park, Mumbai',
  },
  {
    id: '2',
    code: 'MF-01',
    name: 'Baddi Plant',
    company: 'PharmaCorp Inc.',
    region: 'North',
    status: 'Active',
    address: 'Plot 45, Baddi Industrial Area, Himachal Pradesh',
  },
  {
    id: '3',
    code: 'WH-01',
    name: 'Pune Warehouse',
    company: 'PharmaCorp Inc.',
    region: 'West',
    status: 'Active',
    address: 'Logistics Hub, Chakan, Pune',
  }
];

const defaultFormData = {
  id: '',
  code: '',
  name: '',
  companyId: '1',
  region: 'West',
  status: 'Active',
  address: '',
};

export default function PlantsPage() {
  const [plants, setPlants] = useState(dummyPlants);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setPlants(plants.map(p => p.id === formData.id ? { ...p, ...formData, company: 'PharmaCorp Inc.' } : p));
    } else {
      setPlants([...plants, { ...formData, id: Math.random().toString(), company: 'PharmaCorp Inc.' }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (plant: any) => {
    setFormData({
      ...defaultFormData,
      ...plant,
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plant/location?')) {
      setPlants(plants.filter(p => p.id !== id));
    }
  };

  const filteredPlants = plants.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Plants & Locations" description="Manage physical office locations and manufacturing plants." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Location"
        searchPlaceholder="Search locations by name or code..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Location Name</th>
              <th>Company</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlants.map((plant) => (
              <tr key={plant.id} className="directory-row">
                <td><span className="font-medium text-primary">{plant.code}</span></td>
                <td className="font-medium">{plant.name}</td>
                <td className="text-muted">{plant.company}</td>
                <td className="text-muted">{plant.region}</td>
                <td>
                  <StatusBadge status={plant.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(plant)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(plant.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPlants.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Locations Found"
                    message="No plants or locations match your search criteria."
                    icon={<IconBuilding size={32} />}
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
        title={isEditing ? "Edit Location" : "Add New Location"}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Location</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="drawer-form-container">
          <div className="drawer-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Location Code *</label>
                <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. MF-01" disabled={isEditing} />
              </div>
              <div className="form-group">
                <label>Location Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Baddi Plant" />
              </div>
              <div className="form-group full-width">
                <label>Company *</label>
                <select className="form-control" required value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})}>
                  <option value="1">PharmaCorp Inc.</option>
                </select>
              </div>
              <div className="form-group">
                <label>Region *</label>
                <select className="form-control" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="Central">Central</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <textarea className="form-control" rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
