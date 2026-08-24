'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';

const defaultFormData = {
  id: '',
  code: '',
  description: '',
  amount: 0,
  criteria: ''
};

export default function IncentiveSlotsPage() {
  const [slots, setSlots] = useState([
    { id: '1', code: 'INC-01', description: 'Perfect Attendance', amount: 1000, criteria: 'No leaves taken' },
    { id: '2', code: 'INC-02', description: 'Target Met', amount: 2500, criteria: '100% target achievement' }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSlots = slots.filter(s => 
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setSlots(slots.map(s => s.id === formData.id ? formData : s));
    } else {
      setSlots([...slots, { ...formData, id: Date.now().toString() }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (slot: typeof defaultFormData) => {
    setFormData(slot);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this incentive slot?')) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Incentive Slots" description="Manage incentive configurations and criteria." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by code or description..."
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Incentive Slot"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Amount (₹)</th>
              <th>Criteria</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlots.map((slot) => (
              <tr key={slot.id} className="directory-row">
                <td><span className="badge badge-info">{slot.code}</span></td>
                <td className="font-medium text-primary">{slot.description}</td>
                <td className="font-bold text-success">₹{slot.amount}</td>
                <td className="text-muted font-medium">{slot.criteria}</td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(slot)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(slot.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSlots.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState 
                    title="No Incentive Slots Found"
                    message="No incentives match your search criteria."
                    icon={<IconCheck size={32} />}
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
              <h2>{isEditing ? "Edit Incentive Slot" : "Add New Incentive Slot"}</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Slot Code *</label>
                    <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. INC-001" disabled={isEditing} />
                  </div>
                  <div className="form-group">
                    <label>Amount (₹) *</label>
                    <input type="number" className="form-control" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} placeholder="e.g. 1000" />
                  </div>
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <input type="text" className="form-control" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="e.g. Perfect Attendance" />
                  </div>
                  <div className="form-group full-width">
                    <label>Criteria Setup *</label>
                    <textarea className="form-control" required value={formData.criteria} onChange={(e) => setFormData({...formData, criteria: e.target.value})} placeholder="Describe how this incentive is achieved..." rows={4}></textarea>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
