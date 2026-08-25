'use client';

import { useState } from 'react';
import { IconBuildingFactory, IconPencil, IconPlus, IconSearch, IconTrash, IconFilter } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';

const dummyCompanies = [
  {
    id: '1',
    code: 'CMP-001',
    name: 'PharmaCorp Inc.',
    legalName: 'PharmaCorp India Pvt. Ltd.',
    description: 'Main manufacturing and R&D entity',
    effectiveFrom: '2020-04-01',
    status: 'Active',
    taxId: 'AAAAA0000A',
    registrationNumber: 'CIN-123456789',
    registeredAddress: '123 Business Park, Mumbai',
    timezone: 'Asia/Kolkata',
    financialYearStartMonth: 'April'
  }
];

const defaultFormData = {
  id: '',
  code: '',
  name: '',
  description: '',
  effectiveFrom: new Date().toISOString().split('T')[0],
  status: 'Active',
  legalName: '',
  registrationNumber: '',
  taxId: '',
  registeredAddress: '',
  timezone: 'Asia/Kolkata',
  financialYearStartMonth: 'April',
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(dummyCompanies);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setCompanies(companies.map(c => c.id === formData.id ? formData : c));
    } else {
      setCompanies([...companies, { ...formData, id: Math.random().toString() }]);
    }
    setIsDrawerOpen(false);
    setFormData(defaultFormData);
    setIsEditing(false);
    setActiveTab('basic');
  };

  const handleEdit = (company: any) => {
    setFormData(company);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <SetPageHeader 
        title="Companies" 
        description="Manage organization companies and legal entities."
      />
      <ModuleTabs />

      <StandardTableLayout
        searchQuery={search}
        onSearchChange={setSearch}
        onAddClick={() => {
          setFormData(defaultFormData);
          setIsEditing(false);
          setIsDrawerOpen(true);
        }}
        addBtnText="Add Company"
        searchPlaceholder="Search companies by name or code..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Code</th>
              <th>Company Name</th>
              <th>Legal Name</th>
              <th>Tax ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="directory-row">
                <td><span className="font-medium text-primary">{company.code}</span></td>
                <td className="font-medium">{company.name}</td>
                <td className="text-muted">{company.legalName || '-'}</td>
                <td className="text-muted">{company.taxId || '-'}</td>
                <td>
                  <StatusBadge status={company.status} />
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-muted" onClick={() => handleEdit(company)}><IconPencil size={18} /></button>
                    <button className="icon-btn text-danger" onClick={() => handleDelete(company.id)}><IconTrash size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="No Companies Found"
                    message="No companies match your search criteria. Click 'Add Company' to create a new one."
                    icon={<IconBuildingFactory size={32} />}
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
        title={isEditing ? "Edit Company" : "Add New Company"}
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Company</button>
          </>
        }
      >
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '2rem' }}>
          <button 
            type="button"
            style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'basic' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'basic' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: activeTab === 'basic' ? 600 : 400, cursor: 'pointer' }}
            onClick={() => setActiveTab('basic')}
          >
            Basic Details
          </button>
          <button 
            type="button"
            style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'legal' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'legal' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: activeTab === 'legal' ? 600 : 400, cursor: 'pointer' }}
            onClick={() => setActiveTab('legal')}
          >
            Legal & Address
          </button>
          <button 
            type="button"
            style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'settings' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'settings' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: activeTab === 'settings' ? 600 : 400, cursor: 'pointer' }}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'basic' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Company Code *</label>
                <input type="text" className="form-control" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. CMP-001" disabled={isEditing} />
              </div>
              <div className="form-group">
                <label>Display Name *</label>
                <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea className="form-control" rows={3} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Effective From *</label>
                <input type="date" className="form-control" required value={formData.effectiveFrom} onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Legal Name *</label>
                <input type="text" className="form-control" required value={formData.legalName} onChange={(e) => setFormData({...formData, legalName: e.target.value})} placeholder="e.g. Acme Corporation Pvt. Ltd." />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input type="text" className="form-control" value={formData.registrationNumber || ''} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>PAN / Tax ID</label>
                <input type="text" className="form-control" value={formData.taxId || ''} onChange={(e) => setFormData({...formData, taxId: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Registered Address *</label>
                <textarea className="form-control" rows={3} required value={formData.registeredAddress} onChange={(e) => setFormData({...formData, registeredAddress: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Default Timezone *</label>
                <select className="form-control" required value={formData.timezone} onChange={(e) => setFormData({...formData, timezone: e.target.value})}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Financial Year Start *</label>
                <select className="form-control" required value={formData.financialYearStartMonth} onChange={(e) => setFormData({...formData, financialYearStartMonth: e.target.value})}>
                  <option value="January">January</option>
                  <option value="April">April</option>
                  <option value="July">July</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </Drawer>
    </div>
  );
}
