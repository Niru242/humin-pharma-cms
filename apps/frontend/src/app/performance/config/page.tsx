'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { IconCheck, IconPencil, IconTrash, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Drawer } from '@/components/ui/Drawer';
import { useToast } from '@/providers/ToastProvider';

interface CriteriaItem {
  id: string;
  criteria: string;
  weight: number;
  description: string;
  category: string;
}

const dummyCriteria: CriteriaItem[] = [
  { id: '1', criteria: 'Work Quality & SOP Adherence', weight: 30, description: 'Accuracy and zero-defect compliance with pharmaceutical manufacturing SOPs.', category: 'Quality' },
  { id: '2', criteria: 'Productivity & Batch Delivery', weight: 30, description: 'Batch execution speed, throughput volume, and meeting release schedules.', category: 'Operations' },
  { id: '3', criteria: 'GxP & Safety Compliance', weight: 20, description: 'Adherence to cleanroom gowning, audit trails, and reporting safety observations.', category: 'Compliance' },
  { id: '4', criteria: 'Teamwork & Knowledge Transfer', weight: 20, description: 'Shift handovers, inter-departmental collaboration, and junior operator coaching.', category: 'Behavioral' }
];

export default function PerformanceConfig() {
  const toast = useToast();
  const [criteriaList, setCriteriaList] = useState<CriteriaItem[]>(dummyCriteria);
  const [searchQuery, setSearchQuery] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CriteriaItem | null>(null);

  const [formData, setFormData] = useState({
    criteria: '',
    weight: 20,
    description: '',
    category: 'Operations',
  });

  const totalWeight = criteriaList.reduce((acc, curr) => acc + curr.weight, 0);

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormData({
      criteria: '',
      weight: 15,
      description: '',
      category: 'Operations',
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: CriteriaItem) => {
    setEditingItem(item);
    setFormData({
      criteria: item.criteria,
      weight: item.weight,
      description: item.description,
      category: item.category,
    });
    setIsDrawerOpen(true);
  };

  const handleSaveCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.criteria || !formData.description) {
      toast.error('Required Fields Missing', 'Please enter criteria title and description.');
      return;
    }

    if (editingItem) {
      setCriteriaList(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...formData } : c));
      toast.success('Criteria Updated', `Criteria "${formData.criteria}" has been updated.`);
    } else {
      const newItem: CriteriaItem = {
        id: `${Date.now()}`,
        ...formData,
      };
      setCriteriaList([...criteriaList, newItem]);
      toast.success('Criteria Added', `New criteria "${newItem.criteria}" added.`);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setCriteriaList(prev => prev.filter(c => c.id !== id));
    toast.error('Criteria Deleted', `Criteria "${name}" has been removed.`);
  };

  const filteredCriteria = criteriaList.filter(c => 
    c.criteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader title="Score Weights & Configuration" description="Manage evaluation criteria and their respective weights for the organization." />
      <ModuleTabs />

      {/* Weight Distribution Summary Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span className="font-bold" style={{ fontSize: '0.95rem' }}>Total Weight Allocation: </span>
            <span className={`font-bold ${totalWeight === 100 ? 'text-success' : 'text-danger'}`}>{totalWeight}%</span>
            {totalWeight !== 100 && (
              <span className="text-xs text-danger" style={{ marginLeft: '8px' }}>
                (Total weights should sum to exactly 100%)
              </span>
            )}
          </div>
          <span className="text-xs text-muted font-medium">{criteriaList.length} criteria active</span>
        </div>
        <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', background: 'var(--border-color)' }}>
          {criteriaList.map((c, i) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
            return (
              <div
                key={c.id}
                style={{
                  width: `${c.weight}%`,
                  background: colors[i % colors.length],
                  transition: 'width 0.3s ease',
                }}
                title={`${c.criteria}: ${c.weight}%`}
              />
            );
          })}
        </div>
      </div>

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search criteria or category..."
        onAddClick={handleOpenNew}
        addBtnText="Add Criteria"
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Criteria Name</th>
              <th>Category</th>
              <th>Weight (%)</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCriteria.map(c => (
              <tr key={c.id} className="directory-row">
                <td className="font-semibold text-primary">{c.criteria}</td>
                <td><span className="badge badge-info">{c.category}</span></td>
                <td>
                  <span className="badge badge-success font-bold">{c.weight}%</span>
                </td>
                <td className="text-muted font-medium">{c.description}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" title="Edit" onClick={() => handleOpenEdit(c)}>
                      <IconPencil size={18} />
                    </button>
                    <button className="icon-btn text-danger" title="Delete" onClick={() => handleDelete(c.id, c.criteria)}>
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCriteria.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState 
                    title="No Criteria Found"
                    message="No criteria match your search."
                    icon={<IconCheck size={32} />}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Add / Edit Criteria Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Edit Evaluation Criteria' : 'Add Evaluation Criteria'}
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveCriteria}>
              <IconDeviceFloppy size={18} />
              <span>{editingItem ? 'Save Updates' : 'Add Criteria'}</span>
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveCriteria} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Criteria Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Audit Readiness & Documentation"
              value={formData.criteria}
              onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Evaluation Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Quality">Quality & SOP</option>
                <option value="Operations">Operations & Output</option>
                <option value="Compliance">GxP & Safety Compliance</option>
                <option value="Behavioral">Behavioral & Leadership</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Weight Percentage (%) *</label>
              <input
                type="number"
                min="1"
                max="100"
                className="form-control"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Description & Scoring Guidance *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Clarify what constitutes poor, acceptable, and exemplary performance for this criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
}
