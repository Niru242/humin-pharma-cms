'use client';

import { useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';

const defaultFormData = {
  id: '',
  employeeId: '',
  employeeName: '',
  kpiArea: '',
  score: 0,
  maxScore: 10,
  evaluator: ''
};

export default function HODScoresPage() {
  const [scoresList, setScoresList] = useState([
    { id: '1', employeeId: 'EMP-002', employeeName: 'Rahul Sharma', kpiArea: 'Lab Efficiency', score: 9, maxScore: 10, evaluator: 'Dr. Ramesh' },
    { id: '2', employeeId: 'EMP-003', employeeName: 'Priya Patel', kpiArea: 'Recruitment Turnaround', score: 7.5, maxScore: 10, evaluator: 'Mr. Gupta' }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScores = scoresList.filter(item => 
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.kpiArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setScoresList(scoresList.map(item => item.id === formData.id ? formData : item));
    } else {
      setScoresList([...scoresList, { ...formData, id: Date.now().toString() }]);
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
    if (window.confirm('Are you sure you want to delete this score record?')) {
      setScoresList(scoresList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="HOD Scores" description="Manage subjective scoring and KPI evaluations from HODs." />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by employee name or KPI area..."
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Submit Score"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Employee Details</th>
              <th>KPI Area</th>
              <th>Score</th>
              <th>Evaluator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.map((item) => (
              <tr key={item.id} className="directory-row">
                <td>
                  <EmployeeProfileCell firstName={item.employeeName.split(" ")[0]} lastName={item.employeeName.split(" ").slice(1).join(" ")} employeeId={item.employeeId} />
                </td>
                <td className="font-medium">{item.kpiArea}</td>
                <td>
                  <StatusBadge 
                    status={item.score >= 8 ? 'Active' : item.score >= 5 ? 'Draft' : 'Inactive'} 
                    customLabel={`${item.score} / ${item.maxScore}`} 
                  />
                </td>
                <td className="text-muted font-medium">{item.evaluator}</td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(item)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(item.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredScores.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState 
                    title="No Scores Found"
                    message="No scores match your search criteria."
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
              <h2>{isEditing ? "Edit Score" : "Submit New Score"}</h2>
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
                    <label>KPI Area *</label>
                    <input type="text" className="form-control" required value={formData.kpiArea} onChange={(e) => setFormData({...formData, kpiArea: e.target.value})} placeholder="e.g. Lab Efficiency" />
                  </div>
                  <div className="form-group">
                    <label>Score *</label>
                    <input type="number" step="0.1" className="form-control" required value={formData.score} onChange={(e) => setFormData({...formData, score: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Max Score *</label>
                    <input type="number" className="form-control" required value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: Number(e.target.value)})} />
                  </div>
                  <div className="form-group full-width">
                    <label>Evaluator Name *</label>
                    <input type="text" className="form-control" required value={formData.evaluator} onChange={(e) => setFormData({...formData, evaluator: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Score</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
