'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';

const defaultFormData = {
  id: '',
  policyName: '',
  gracePeriodMins: 0,
  lateDeductionType: '',
  status: 'Active'
};

export default function PunchCompliancePage() {
  const [rulesList, setRulesList] = useState([
    { id: '1', policyName: 'Standard Office Shift', gracePeriodMins: 15, lateDeductionType: 'Half Day Leave', status: 'Active' },
    { id: '2', policyName: 'Production Shift A', gracePeriodMins: 5, lateDeductionType: 'Loss of Pay', status: 'Active' }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = rulesList.filter(item => 
    item.policyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.lateDeductionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setRulesList(rulesList.map(item => item.id === formData.id ? formData : item));
    } else {
      setRulesList([...rulesList, { ...formData, id: Date.now().toString() }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const handleEdit = (item: typeof defaultFormData) => {
    setFormData(item);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this punch rule?')) {
      setRulesList(rulesList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Punch Compliance Rules" description="Configure late punch tolerances and deduction rules." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by policy name or deduction type..."
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Compliance Rule"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Grace Period</th>
              <th>Deduction Policy</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((item) => (
              <tr key={item.id} className="directory-row">
                <td className="font-medium text-primary">{item.policyName}</td>
                <td className="font-bold">{item.gracePeriodMins} mins</td>
                <td className="text-muted font-medium">{item.lateDeductionType}</td>
                <td>
                  <StatusBadge 
                    status={item.status === 'Active' ? 'Active' : 'Inactive'} 
                    customLabel={item.status} 
                  />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(item)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(item.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRules.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState 
                    title="No Rules Found"
                    message="No punch compliance rules match your search."
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
              <h2>{isEditing ? "Edit Rule" : "Add New Rule"}</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Policy Name *</label>
                    <input type="text" className="form-control" required value={formData.policyName} onChange={(e) => setFormData({...formData, policyName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Grace Period (Mins) *</label>
                    <input type="number" className="form-control" required value={formData.gracePeriodMins} onChange={(e) => setFormData({...formData, gracePeriodMins: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Late Deduction Type *</label>
                    <select className="form-control" required value={formData.lateDeductionType} onChange={(e) => setFormData({...formData, lateDeductionType: e.target.value})}>
                      <option value="">Select Action</option>
                      <option value="Half Day Leave">Deduct Half Day Leave</option>
                      <option value="Loss of Pay">Loss of Pay (LOP)</option>
                      <option value="Warning Only">Warning Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
