'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';

const defaultFormData = {
  id: '',
  employeeId: '',
  employeeName: '',
  remarkType: '',
  remarkNotes: '',
  dateAdded: ''
};

export default function HRRemarksPage() {
  const [remarksList, setRemarksList] = useState([
    { id: '1', employeeId: 'EMP-001', employeeName: 'Sarah Jenkins', remarkType: 'Positive', remarkNotes: 'Handled crisis extremely well.', dateAdded: '2025-10-12' },
    { id: '2', employeeId: 'EMP-004', employeeName: 'Amit Kumar', remarkType: 'Warning', remarkNotes: 'Late to shift 3 times this month.', dateAdded: '2025-11-05' },
    { id: '3', employeeId: 'EMP-003', employeeName: 'Priya Patel', remarkType: 'Positive', remarkNotes: 'Successfully audited HR compliance.', dateAdded: '2026-01-20' }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setRemarksList(remarksList.map(item => item.id === formData.id ? formData : item));
    } else {
      setRemarksList([...remarksList, { ...formData, id: Date.now().toString(), dateAdded: new Date().toISOString().split('T')[0] }]);
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
    if (window.confirm('Are you sure you want to delete this remark?')) {
      setRemarksList(remarksList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="HR Remarks" description="Centralized view for tracking ad-hoc HR notes and employee remarks." />
      <div className="page-header">
        <button className="btn btn-primary" onClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}>
          <IconPlus size={20} />
          Add Remark
        </button>
      </div>

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>Date</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {remarksList.map((item) => (
              <tr key={item.id}>
                <td>
                  <EmployeeProfileCell firstName={item.employeeName.split(" ")[0]} lastName={item.employeeName.split(" ").slice(1).join(" ")} employeeId={item.employeeId} />
                </td>
                <td className="text-muted">{item.dateAdded}</td>
                <td>
                  <span className={`badge ${item.remarkType === 'Positive' ? 'badge-success' : 'badge-draft'}`}>
                    {item.remarkType}
                  </span>
                </td>
                <td className="text-muted">{item.remarkNotes}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn text-muted" onClick={() => handleEdit(item)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(item.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {remarksList.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No HR Remarks Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content drawer-large" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>{isEditing ? "Edit Remark" : "Add New Remark"}</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input type="text" className="form-control" required value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Employee Name *</label>
                    <input type="text" className="form-control" required value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label>Remark Type *</label>
                    <select className="form-control" required value={formData.remarkType} onChange={(e) => setFormData({...formData, remarkType: e.target.value})}>
                      <option value="">Select Type</option>
                      <option value="Positive">Positive</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Notes *</label>
                    <textarea className="form-control" required value={formData.remarkNotes} onChange={(e) => setFormData({...formData, remarkNotes: e.target.value})} rows={4}></textarea>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Remark</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
