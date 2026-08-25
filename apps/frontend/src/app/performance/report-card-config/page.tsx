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
  configName: '',
  minScore: 0,
  maxScore: 10,
  weightage: 100,
  isActive: true
};

export default function ReportCardConfigPage() {
  const [configList, setConfigList] = useState([
    { id: '1', configName: 'Annual Performance Review', minScore: 0, maxScore: 10, weightage: 60, isActive: true },
    { id: '2', configName: 'Peer Feedback Assessment', minScore: 0, maxScore: 5, weightage: 40, isActive: true }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConfigs = configList.filter(item => 
    item.configName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setConfigList(configList.map(item => item.id === formData.id ? formData : item));
    } else {
      setConfigList([...configList, { ...formData, id: Date.now().toString() }]);
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
    if (window.confirm('Are you sure you want to delete this config rule?')) {
      setConfigList(configList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Report Card Configuration" description="Configure parameters and weights for employee report cards." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search configurations..."
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Configuration"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Configuration Name</th>
              <th>Min Score</th>
              <th>Max Score</th>
              <th>Weightage (%)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConfigs.map((item) => (
              <tr key={item.id} className="directory-row">
                <td className="font-medium text-primary">{item.configName}</td>
                <td className="font-medium">{item.minScore}</td>
                <td className="font-medium">{item.maxScore}</td>
                <td className="font-bold">{item.weightage}%</td>
                <td>
                  <StatusBadge 
                    status={item.isActive ? 'Active' : 'Inactive'} 
                    customLabel={item.isActive ? 'Active' : 'Inactive'} 
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
            {filteredConfigs.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Configurations Found"
                    message="No report card configs match your search."
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
              <h2>{isEditing ? "Edit Config" : "Add New Config"}</h2>
              <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="drawer-form-container">
              <div className="drawer-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Configuration Name *</label>
                    <input type="text" className="form-control" required value={formData.configName} onChange={(e) => setFormData({...formData, configName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Min Score *</label>
                    <input type="number" className="form-control" required value={formData.minScore} onChange={(e) => setFormData({...formData, minScore: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Max Score *</label>
                    <input type="number" className="form-control" required value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Weightage (%) *</label>
                    <input type="number" className="form-control" required value={formData.weightage} onChange={(e) => setFormData({...formData, weightage: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" value={formData.isActive.toString()} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Config</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
