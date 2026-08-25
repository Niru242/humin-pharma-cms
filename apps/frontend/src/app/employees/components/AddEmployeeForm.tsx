'use client';

import { useState } from 'react';
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import '../add/add-employee.css';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { useCreateEmployee } from '@/hooks/useEmployees';
import { useDepartments, useGrades, useCompanies, usePlants, useDesignations } from '@/hooks/useOrganization';
import { useToast } from '@/providers/ToastProvider';

const steps = [
  { id: 1, title: 'Personal Details' },
  { id: 2, title: 'Employment' },
  { id: 3, title: 'Organization' },
  { id: 4, title: 'Statutory' }
];

interface AddEmployeeFormProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export default function AddEmployeeForm({ onComplete, onCancel }: AddEmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const toast = useToast();
  const createEmployee = useCreateEmployee();

  // Load dropdown data from API
  const { data: companiesData } = useCompanies();
  const { data: plantsData } = usePlants();
  const { data: deptData } = useDepartments();
  const { data: gradesData } = useGrades();
  const { data: designationsData } = useDesignations();

  const companies = companiesData?.items || [];
  const plants = plantsData?.items || [];
  const departments = deptData?.items || [];
  const grades = gradesData?.items || [];
  const designations = designationsData?.items || [];

  // Form state — all fields across all steps
  const [formData, setFormData] = useState({
    // Step 1: Personal
    employeeCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    currentAddress: '',
    city: '',
    state: '',
    // Step 2: Employment
    companyId: '',
    plantId: '',
    dateOfJoining: '',
    employmentStatus: 'Probation',
    employmentType: '',
    category: '',
    // Step 3: Organization
    departmentId: '',
    designation: '',
    gradeId: '',
    reportingManagerName: '',
    // Step 4: Statutory
    panNumber: '',
    aadhaarNumber: '',
    uanNumber: '',
    esicNumber: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      nextStep();
      return;
    }

    // Validation
    if (!formData.employeeCode || !formData.firstName || !formData.lastName) {
      toast.error('Validation Error', 'Employee Code, First Name and Last Name are required.');
      return;
    }
    if (!formData.dateOfJoining) {
      toast.error('Validation Error', 'Date of Joining is required.');
      return;
    }

    // Build payload matching backend Employee entity
    const payload: any = {
      employeeCode: formData.employeeCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || null,
      phone: formData.phone || null,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      currentAddress: formData.currentAddress ? `${formData.currentAddress}, ${formData.city}, ${formData.state}` : null,
      companyId: formData.companyId || null,
      plantId: formData.plantId || null,
      departmentId: formData.departmentId || null,
      departmentName: formData.departmentId ? departments.find((d: any) => d.id === formData.departmentId)?.name : null,
      designation: formData.designation || null,
      gradeId: formData.gradeId || null,
      dateOfJoining: formData.dateOfJoining,
      employmentStatus: formData.employmentStatus || 'Probation',
      employmentType: formData.employmentType || null,
      reportingManagerName: formData.reportingManagerName || null,
      panNumber: formData.panNumber || null,
      aadhaarNumber: formData.aadhaarNumber || null,
      uanNumber: formData.uanNumber || null,
      esicNumber: formData.esicNumber || null,
    };

    createEmployee.mutate(payload, {
      onSuccess: () => {
        toast.success('Employee Created', `${formData.firstName} ${formData.lastName} has been added successfully.`);
        onComplete();
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || 'Failed to create employee. Please try again.';
        toast.error('Error', Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  };

  return (
    <div className="page-container wizard-page">
      <SetPageHeader title="Add New Employee" description="Complete the wizard to onboard a new employee." />
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {onCancel && (
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>

      <div className="wizard-container">
        {/* Progress Tracker */}
        <div className="wizard-sidebar">
          <ul className="step-list">
            {steps.map((step) => (
              <li 
                key={step.id} 
                className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              >
                <div className="step-indicator">
                  {currentStep > step.id ? <IconCheck size={16} /> : step.id}
                </div>
                <span className="step-title">{step.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wizard Form Area */}
        <div className="wizard-content">
          <form onSubmit={handleSubmit} className="wizard-form">
            
            <div className="step-content">
              {currentStep === 1 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Personal Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Employee Code *</label>
                      <input type="text" className="form-control" required placeholder="e.g. EMP-001" value={formData.employeeCode} onChange={(e) => handleChange('employeeCode', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. John" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input type="text" className="form-control" value={formData.middleName} onChange={(e) => handleChange('middleName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. Doe" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input type="date" className="form-control" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select className="form-control" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" placeholder="john.doe@company.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input type="tel" className="form-control" placeholder="+91 9876543210" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    </div>
                    
                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 className="subsection-title">Current Address</h4>
                    </div>
                    <div className="form-group full-width">
                      <label>Street Address</label>
                      <input type="text" className="form-control" value={formData.currentAddress} onChange={(e) => handleChange('currentAddress', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" className="form-control" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" className="form-control" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Employment Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company</label>
                      <select className="form-control" value={formData.companyId} onChange={(e) => handleChange('companyId', e.target.value)}>
                        <option value="">Select Company</option>
                        {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Plant</label>
                      <select className="form-control" value={formData.plantId} onChange={(e) => handleChange('plantId', e.target.value)}>
                        <option value="">Select Plant</option>
                        {plants.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date of Joining *</label>
                      <input type="date" className="form-control" required value={formData.dateOfJoining} onChange={(e) => handleChange('dateOfJoining', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Employment Status</label>
                      <select className="form-control" value={formData.employmentStatus} onChange={(e) => handleChange('employmentStatus', e.target.value)}>
                        <option value="Probation">Probation</option>
                        <option value="Active">Active (Confirmed)</option>
                        <option value="Preboarding">Preboarding</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Employment Type</label>
                      <select className="form-control" value={formData.employmentType} onChange={(e) => handleChange('employmentType', e.target.value)}>
                        <option value="">Select Type</option>
                        <option value="Permanent">Permanent (Full Time)</option>
                        <option value="Contract">Contract</option>
                        <option value="Trainee">Trainee</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Worker Category</label>
                      <select className="form-control" value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Office">Office Worker</option>
                        <option value="Labour">Labour</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Laboratory">Laboratory</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Organization Structure</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Department</label>
                      <select className="form-control" value={formData.departmentId} onChange={(e) => handleChange('departmentId', e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <select className="form-control" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)}>
                        <option value="">Select Designation</option>
                        {designations.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grade</label>
                      <select className="form-control" value={formData.gradeId} onChange={(e) => handleChange('gradeId', e.target.value)}>
                        <option value="">Select Grade</option>
                        {grades.map((g: any) => <option key={g.id} value={g.id}>{g.name} ({g.code})</option>)}
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Reporting Manager</label>
                      <input type="text" className="form-control" placeholder="Manager name" value={formData.reportingManagerName} onChange={(e) => handleChange('reportingManagerName', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Statutory Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>PAN Number</label>
                      <input type="text" className="form-control" placeholder="ABCDE1234F" value={formData.panNumber} onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())} maxLength={10} />
                    </div>
                    <div className="form-group">
                      <label>Aadhaar Number</label>
                      <input type="text" className="form-control" placeholder="1234 5678 9012" value={formData.aadhaarNumber} onChange={(e) => handleChange('aadhaarNumber', e.target.value)} maxLength={14} />
                    </div>
                    <div className="form-group">
                      <label>UAN / PF Number</label>
                      <input type="text" className="form-control" value={formData.uanNumber} onChange={(e) => handleChange('uanNumber', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>ESIC Number</label>
                      <input type="text" className="form-control" value={formData.esicNumber} onChange={(e) => handleChange('esicNumber', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="wizard-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Back
              </button>
              
              <button type="submit" className="btn btn-primary" disabled={createEmployee.isPending}>
                {createEmployee.isPending ? 'Saving...' : currentStep === 4 ? 'Submit Employee' : 'Next Step'}
                {!createEmployee.isPending && currentStep < 4 && <IconChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
