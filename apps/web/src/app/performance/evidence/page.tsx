'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconFileText, IconCheck } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';

const defaultFormData = {
  id: '',
  employeeId: '',
  employeeName: '',
  evidenceType: '',
  description: '',
  fileName: ''
};

export default function HODEvidencePage() {
  const [evidenceList, setEvidenceList] = useState([
    { id: '1', employeeId: 'EMP-001', employeeName: 'Sarah Jenkins', evidenceType: 'Project Delivery', description: 'Delivered Q3 project ahead of schedule', fileName: 'q3_report.pdf' },
    { id: '2', employeeId: 'EMP-004', employeeName: 'Amit Kumar', evidenceType: 'Certification', description: 'Completed ISO compliance training', fileName: 'cert.pdf' }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidenceList.filter(item => 
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.evidenceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setEvidenceList(evidenceList.map(item => item.id === formData.id ? formData : item));
    } else {
      setEvidenceList([...evidenceList, { ...formData, id: Date.now().toString() }]);
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
    if (window.confirm('Are you sure you want to delete this evidence record?')) {
      setEvidenceList(evidenceList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="HOD Evidence Tracking" description="Upload and track performance evidence for employees." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee name or evidence type..."
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Log Evidence"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>Evidence Type</th>
              <th>Description</th>
              <th>Attachment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.map((item) => (
              <tr key={item.id} className="directory-row">
                <td>
                  <EmployeeProfileCell firstName={item.employeeName.split(" ")[0]} lastName={item.employeeName.split(" ").slice(1).join(" ")} employeeId={item.employeeId} />
                </td>
                <td><span className="badge badge-info">{item.evidenceType}</span></td>
                <td className="text-muted font-medium truncate" style={{ maxWidth: '300px' }}>{item.description}</td>
                <td>
                  {item.fileName ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}>
                      <IconFileText size={14} /> {item.fileName}
                    </span>
                  ) : <span className="text-muted">-</span>}
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(item)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(item.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvidence.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState 
                    title="No Evidence Found"
                    message="No records match your search criteria."
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
              <h2>{isEditing ? "Edit Evidence" : "Log New Evidence"}</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input type="text" className="form-control" required value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} placeholder="e.g. EMP-001" />
                  </div>
                  <div className="form-group">
                    <label>Employee Name *</label>
                    <input type="text" className="form-control" required value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} placeholder="e.g. Sarah Jenkins" />
                  </div>
                  <div className="form-group full-width">
                    <label>Evidence Type *</label>
                    <select className="form-control" required value={formData.evidenceType} onChange={(e) => setFormData({...formData, evidenceType: e.target.value})}>
                      <option value="">Select Type</option>
                      <option value="Project Delivery">Project Delivery</option>
                      <option value="Certification">Certification</option>
                      <option value="Client Feedback">Client Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea className="form-control" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the evidence..."></textarea>
                  </div>
                  <div className="form-group full-width">
                    <label>Upload File Name (Mock)</label>
                    <input type="text" className="form-control" value={formData.fileName} onChange={(e) => setFormData({...formData, fileName: e.target.value})} placeholder="e.g. report.pdf" />
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Evidence</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
