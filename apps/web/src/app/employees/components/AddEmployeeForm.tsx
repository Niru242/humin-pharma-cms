'use client';

import { useState } from 'react';
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import '../add/add-employee.css';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      nextStep();
      return;
    }
    
    // Final Submit
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
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
                      <input type="text" className="form-control" required placeholder="Auto-generated or Manual" />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. John" />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. Doe" />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select className="form-control" required>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Personal Email</label>
                      <input type="email" className="form-control" placeholder="john.doe@gmail.com" />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input type="tel" className="form-control" required placeholder="+91 9876543210" />
                    </div>
                    
                    <div className="form-group full-width" style={{marginTop: '1rem'}}>
                      <h4 className="subsection-title">Current Address</h4>
                    </div>
                    <div className="form-group full-width">
                      <label>Street Address *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>City *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input type="text" className="form-control" required />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Employment Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company *</label>
                      <select className="form-control" required>
                        <option value="">Select Company</option>
                        <option value="1">Acme Corp</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Plant *</label>
                      <select className="form-control" required>
                        <option value="">Select Plant</option>
                        <option value="1">Mumbai Manufacturing Unit</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date of Joining *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="form-group">
                      <label>Employment Status *</label>
                      <select className="form-control" required>
                        <option value="Preboarding">Preboarding</option>
                        <option value="Probation">Probation</option>
                        <option value="Active">Active (Confirmed)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Employment Type *</label>
                      <select className="form-control" required>
                        <option value="">Select Type</option>
                        <option value="FT">Full Time</option>
                        <option value="PT">Part Time</option>
                        <option value="CT">Contractor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Worker Category *</label>
                      <select className="form-control" required>
                        <option value="">Select Category</option>
                        <option value="Office">Office Worker</option>
                        <option value="Labour">Labour</option>
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
                      <label>Department *</label>
                      <select className="form-control" required>
                        <option value="">Select Department</option>
                        <option value="1">Human Resources</option>
                        <option value="2">Production Core</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Position *</label>
                      <select className="form-control" required>
                        <option value="">Select Position</option>
                        <option value="1">HR Manager</option>
                        <option value="2">Shift Operator</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Designation (Derived)</label>
                      <input type="text" className="form-control" disabled placeholder="Auto-filled from position" />
                    </div>
                    <div className="form-group">
                      <label>Grade (Derived)</label>
                      <input type="text" className="form-control" disabled placeholder="Auto-filled from position" />
                    </div>
                    <div className="form-group full-width">
                      <label>Reporting Manager *</label>
                      <select className="form-control" required>
                        <option value="">Select Manager</option>
                        <option value="EMP-001">Sarah Jenkins (VP Ops)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Assigned Shift *</label>
                      <select className="form-control" required>
                        <option value="">Select Shift</option>
                        <option value="Gen">General Shift (09:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="form-section animation-fade">
                  <h3 className="section-title">Statutory Details</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Government ID Type</label>
                      <select className="form-control">
                        <option value="">Select ID Type</option>
                        <option value="PAN">PAN Card</option>
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="SSN">SSN</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Government ID Number</label>
                      <input type="text" className="form-control" placeholder="Enter secure ID number" />
                    </div>
                    <div className="form-group full-width">
                      <label>UAN / PF Number</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group full-width">
                      <label>ESIC Number</label>
                      <input type="text" className="form-control" />
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
              
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : currentStep === 4 ? 'Submit Employee' : 'Next Step'}
                {!isSubmitting && currentStep < 4 && <IconChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
