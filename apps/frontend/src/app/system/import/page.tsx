'use client';

import { useState } from 'react';
import { IconAlertTriangle, IconCheck, IconFileSpreadsheet, IconUpload } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

export default function BulkImportPage() {
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState('employee');
  const [file, setFile] = useState<File | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<{valid: number, errors: number} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleValidate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setValidationResult({ valid: 145, errors: 5 });
      setStep(2);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCommit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep(3);
      setIsProcessing(false);
    }, 1500);
  };

  const reset = () => {
    setStep(1);
    setFile(null);
    setValidationResult(null);
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Bulk Data Import" description="Upload CSV/Excel files to bulk create or update records in the system." />
      <div className="page-header">
        </div>
      <ModuleTabs />

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        
        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '33%' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 1 ? 'var(--primary-color)' : 'var(--surface-color)', border: step >= 1 ? 'none' : '2px solid var(--border-color)', color: step >= 1 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto', fontWeight: 'bold' }}>1</div>
            <div className={step >= 1 ? 'font-medium' : 'text-muted'}>Upload File</div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '33%' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 2 ? 'var(--primary-color)' : 'var(--surface-color)', border: step >= 2 ? 'none' : '2px solid var(--border-color)', color: step >= 2 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto', fontWeight: 'bold' }}>2</div>
            <div className={step >= 2 ? 'font-medium' : 'text-muted'}>Validate Data</div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '33%' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 3 ? 'var(--success-color)' : 'var(--surface-color)', border: step >= 3 ? 'none' : '2px solid var(--border-color)', color: step >= 3 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto', fontWeight: 'bold' }}>3</div>
            <div className={step >= 3 ? 'font-medium' : 'text-muted'}>Commit</div>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Select Entity to Import *</label>
              <select className="form-control" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                <option value="employee">Employee Master Data</option>
                <option value="leave_balance">Opening Leave Balances</option>
                <option value="attendance">Historical Attendance Punches</option>
              </select>
            </div>
            
            <div className="form-group full-width" style={{ textAlign: 'right' }}>
              <button className="btn btn-secondary btn-sm">
                <IconFileSpreadsheet size={16} /> Download CSV Template
              </button>
            </div>

            <div className="form-group full-width">
              <label>Upload File *</label>
              <div style={{ border: '2px dashed var(--border-color)', padding: '3rem', textAlign: 'center', borderRadius: '8px', position: 'relative' }}>
                <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                
                {file ? (
                  <div>
                    <IconFileSpreadsheet size={48} className="text-primary" />
                    <div style={{ fontWeight: 500, fontSize: '1.1rem', color: 'var(--text-color)' }}>{file.name}</div>
                    <div className="text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div>
                    <IconUpload size={48} className="text-muted" />
                    <div style={{ fontWeight: 500, fontSize: '1.1rem', color: 'var(--primary-color)' }}>Click or drag file to this area to upload</div>
                    <div className="text-muted mt-1">Support for a single CSV or XLSX file. Max 10MB.</div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group full-width" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" disabled={!file || isProcessing} onClick={handleValidate}>
                {isProcessing ? 'Validating...' : 'Next: Validate Data'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Validate */}
        {step === 2 && validationResult && (
          <div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, background: 'var(--success-color-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--success-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <IconCheck size={32} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{validationResult.valid}</div>
                  <div>Valid Records</div>
                </div>
              </div>
              
              <div style={{ flex: 1, background: 'var(--danger-color-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--danger-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <IconAlertTriangle size={32} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{validationResult.errors}</div>
                  <div>Records with Errors</div>
                </div>
              </div>
            </div>

            {validationResult.errors > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Error Report (Preview)</h3>
                <table className="data-grid">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Column</th>
                      <th>Error Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Row 45</td>
                      <td>Email</td>
                      <td className="text-danger">Duplicate email address found in system.</td>
                    </tr>
                    <tr>
                      <td>Row 112</td>
                      <td>Grade Code</td>
                      <td className="text-danger">Invalid grade code 'L8'. Code does not exist in Grade Master.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" disabled={isProcessing} onClick={handleCommit}>
                  {isProcessing ? 'Importing...' : `Import ${validationResult.valid} Valid Records`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success-color-light)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <IconCheck size={40} />
            </div>
            <h2 style={{ margin: '0 0 1rem 0' }}>Import Successful!</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
              {validationResult?.valid} records have been successfully imported into the system. Background jobs for indexing have been triggered.
            </p>
            <button className="btn btn-secondary" onClick={reset}>Import Another File</button>
          </div>
        )}

      </div>
    </div>
  );
}
