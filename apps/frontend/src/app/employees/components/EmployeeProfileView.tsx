'use client';

import { useState, useEffect } from 'react';
import { IconBriefcase, IconBuilding, IconCheck, IconDownload, IconMail, IconPencil, IconPhone, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import '@/components/ui/ModuleTabs.css';
import { useEmployee, useUpdateEmployee } from '@/hooks/useEmployees';

interface EmployeeProfileViewProps {
  employeeId?: string | string[];
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  fontFamily: '"Nunito", sans-serif',
  outline: 'none',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#fff',
};

function EditableField({ value, field, editMode, formData, onChange }: { value: string; field: string; editMode: boolean; formData: any; onChange: (field: string, val: string) => void }) {
  if (!editMode) return <div className="font-medium">{value || '-'}</div>;
  return <input style={inputStyle} value={formData[field] || ''} onChange={(e) => onChange(field, e.target.value)} />;
}

function EditableSelect({ value, field, editMode, formData, onChange, options }: { value: string; field: string; editMode: boolean; formData: any; onChange: (field: string, val: string) => void; options: string[] }) {
  if (!editMode) {
    const statusClass = (value || '').toLowerCase() === 'active' ? 'success' : 'draft';
    return <span className={`badge badge-${statusClass}`}>{value || '-'}</span>;
  }
  return (
    <select style={selectStyle} value={formData[field] || ''} onChange={(e) => onChange(field, e.target.value)}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

export default function EmployeeProfileView({ employeeId }: EmployeeProfileViewProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const tabs = ['Overview', 'Employment', 'Attendance', 'Leave Ledger', 'Performance', 'Financials', 'Disciplinary', 'Documents', 'Audit History'];

  const displayId = Array.isArray(employeeId) ? employeeId[0] : employeeId || '';
  const { data: emp, isLoading, refetch } = useEmployee(displayId);
  const updateEmployee = useUpdateEmployee();

  useEffect(() => {
    if (emp) {
      setFormData({ ...emp });
    }
  }, [emp]);

  if (isLoading) {
    return <div className="page-container" style={{ padding: '3rem', textAlign: 'center' }}>Loading employee data...</div>;
  }

  if (!emp) {
    return <div className="page-container" style={{ padding: '3rem', textAlign: 'center' }}>Employee not found.</div>;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { id, createdAt, updatedAt, version, isActive, createdBy, updatedBy, ...updateData } = formData;
    updateEmployee.mutate({ id: displayId, ...updateData }, {
      onSuccess: () => {
        setEditMode(false);
        refetch();
      },
    });
  };

  const handleCancel = () => {
    setFormData({ ...emp });
    setEditMode(false);
  };

  const initials = `${(formData.firstName || '')[0] || ''}${(formData.lastName || '')[0] || ''}`.toUpperCase();
  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

  return (
    <div className="page-container" style={{ background: 'var(--background-color)', display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Sidebar Panel */}
      <div style={{ flex: '0 0 340px', background: 'var(--surface-color)', padding: '2.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', position: 'sticky', top: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)', border: '4px solid white' }}>
          {initials}
        </div>
        
        <div style={{ width: '100%' }}>
          {editMode ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input style={inputStyle} value={formData.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} placeholder="First Name" />
              <input style={inputStyle} value={formData.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} placeholder="Last Name" />
            </div>
          ) : (
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{fullName}</h2>
          )}
          <div className="text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 500, marginBottom: '1rem' }}>
            <IconBriefcase size={18} /> {formData.designation || 'No Designation'}
          </div>
          <span className={`badge badge-${(formData.employmentStatus || '').toLowerCase() === 'active' ? 'success' : 'draft'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '9999px' }}>
            {formData.employmentStatus || 'Unknown'} &bull; {formData.employeeCode || displayId}
          </span>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ background: 'var(--brand-50)', padding: '8px', borderRadius: '8px', color: 'var(--brand-600)' }}><IconBuilding size={18} /></div>
             <div><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formData.departmentName || 'No Department'}</div><div style={{ fontSize: '0.8rem' }}>{formData.employmentType || '-'}</div></div>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ background: 'var(--brand-50)', padding: '8px', borderRadius: '8px', color: 'var(--brand-600)' }}><IconMail size={18} /></div>
             {editMode ? (
               <input style={{ ...inputStyle, flex: 1 }} value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
             ) : (
               <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{formData.email || 'No email'}</div>
             )}
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ background: 'var(--brand-50)', padding: '8px', borderRadius: '8px', color: 'var(--brand-600)' }}><IconPhone size={18} /></div>
             {editMode ? (
               <input style={{ ...inputStyle, flex: 1 }} value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
             ) : (
               <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{formData.phone || 'No phone'}</div>
             )}
           </div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {editMode ? (
            <>
              <button onClick={handleSave} disabled={updateEmployee.isPending} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}>
                <IconCheck size={18} /> {updateEmployee.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={handleCancel} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}>
                <IconX size={18} /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}>
                <IconPencil size={18} /> Edit Employee
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}><IconDownload size={18} /> Download Dossier</button>
            </>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <div className="module-tabs-container" style={{ marginBottom: 0 }}>
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`module-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
              {activeTab === tab && <span className="tab-indicator"></span>}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '0 12px 12px 12px', border: '1px solid var(--primary-color)', borderTop: 'none', minHeight: '400px' }}>
          
          {activeTab === 'Overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', color: 'var(--text-color)' }}>
                  <div className="text-muted">Date of Birth</div>
                  <EditableField value={formData.dateOfBirth} field="dateOfBirth" editMode={editMode} formData={formData} onChange={handleChange} />
                  <div className="text-muted">Gender</div>
                  {editMode ? (
                    <select style={selectStyle} value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="font-medium">{formData.gender || '-'}</div>
                  )}
                  <div className="text-muted">Emergency Contact</div>
                  {editMode ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input style={inputStyle} value={formData.emergencyContactName || ''} onChange={(e) => handleChange('emergencyContactName', e.target.value)} placeholder="Name" />
                      <input style={inputStyle} value={formData.emergencyContactPhone || ''} onChange={(e) => handleChange('emergencyContactPhone', e.target.value)} placeholder="Phone" />
                    </div>
                  ) : (
                    <div className="font-medium">{formData.emergencyContactName ? `${formData.emergencyContactName} (${formData.emergencyContactPhone || ''})` : '-'}</div>
                  )}
                  <div className="text-muted">Current Address</div>
                  <EditableField value={formData.currentAddress} field="currentAddress" editMode={editMode} formData={formData} onChange={handleChange} />
                  <div className="text-muted">Permanent Address</div>
                  <EditableField value={formData.permanentAddress} field="permanentAddress" editMode={editMode} formData={formData} onChange={handleChange} />
                </div>
              </div>
              <div>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Reporting Structure</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editMode ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
                      <div className="text-muted">Manager Name</div>
                      <input style={inputStyle} value={formData.reportingManagerName || ''} onChange={(e) => handleChange('reportingManagerName', e.target.value)} placeholder="Reporting Manager Name" />
                    </div>
                  ) : (
                    <>
                      {formData.reportingManagerName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {(formData.reportingManagerName || '').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm text-muted">Manager</div>
                            <div className="font-medium">{formData.reportingManagerName}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">No reporting manager assigned</div>
                      )}
                    </>
                  )}
                  <div style={{ width: '2px', height: '20px', background: 'var(--border-color)', margin: '0 0 0 20px' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initials}</div>
                    <div>
                      <div className="font-medium">{fullName} (Self)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Employment' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Current Position Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px 1fr', gap: '1.5rem 1rem', color: 'var(--text-color)', marginBottom: '3rem' }}>
                <div className="text-muted">Date of Joining</div>
                <EditableField value={formData.dateOfJoining} field="dateOfJoining" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Employment Status</div>
                <EditableSelect value={formData.employmentStatus} field="employmentStatus" editMode={editMode} formData={formData} onChange={handleChange} options={['Active', 'On Leave', 'Probation', 'Notice', 'Separated', 'Suspended']} />
                <div className="text-muted">Employment Type</div>
                {editMode ? (
                  <select style={selectStyle} value={formData.employmentType || ''} onChange={(e) => handleChange('employmentType', e.target.value)}>
                    <option value="">Select</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                ) : (
                  <div className="font-medium">{formData.employmentType || '-'}</div>
                )}
                <div className="text-muted">Designation</div>
                <EditableField value={formData.designation} field="designation" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Department</div>
                <EditableField value={formData.departmentName} field="departmentName" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Confirmation Date</div>
                <EditableField value={formData.confirmationDate} field="confirmationDate" editMode={editMode} formData={formData} onChange={handleChange} />
              </div>

              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Statutory Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px 1fr', gap: '1.5rem 1rem', color: 'var(--text-color)' }}>
                <div className="text-muted">PAN Number</div>
                <EditableField value={formData.panNumber} field="panNumber" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Aadhaar</div>
                <EditableField value={formData.aadhaarNumber} field="aadhaarNumber" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">UAN (PF)</div>
                <EditableField value={formData.uanNumber} field="uanNumber" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">ESIC</div>
                <EditableField value={formData.esicNumber} field="esicNumber" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Bank Name</div>
                <EditableField value={formData.bankName} field="bankName" editMode={editMode} formData={formData} onChange={handleChange} />
                <div className="text-muted">Bank Account</div>
                <EditableField value={formData.bankAccountNumber} field="bankAccountNumber" editMode={editMode} formData={formData} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeTab === 'Attendance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Attendance Summary (Current Month)</h3>
                <Link href="/time/register" className="btn btn-secondary btn-sm">View Detailed Muster</Link>
              </div>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Attendance data will appear here once integrated.</div>
            </div>
          )}

          {activeTab === 'Leave Ledger' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Leave Balances</h3>
                <Link href="/leave/adjustments" className="btn btn-secondary btn-sm">Adjust Balance</Link>
              </div>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Leave data will appear here once integrated.</div>
            </div>
          )}

          {activeTab === 'Performance' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Performance History</h3>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Performance data will appear here once integrated.</div>
            </div>
          )}

          {activeTab === 'Financials' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Financials</h3>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Financial data will appear here once integrated.</div>
            </div>
          )}

          {activeTab === 'Disciplinary' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Disciplinary Records</h3>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>No disciplinary records found.</div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Employee Documents</h3>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Document management will appear here once integrated.</div>
            </div>
          )}

          {activeTab === 'Audit History' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Recent Changes (Audit)</h3>
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Audit history will appear here once integrated.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
