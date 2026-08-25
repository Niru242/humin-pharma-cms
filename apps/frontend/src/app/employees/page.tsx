'use client';

import { useState } from 'react';
import EmployeeDirectoryView from './components/EmployeeDirectoryView';
import EmployeeProfileView from './components/EmployeeProfileView';
import AddEmployeeForm from './components/AddEmployeeForm';
import { IconArrowLeft } from '@tabler/icons-react';

export default function EmployeeHubPage() {
  const [view, setView] = useState<'directory' | 'profile' | 'add'>('directory');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setView('profile');
  };

  const handleAddEmployee = () => {
    setView('add');
  };

  const handleBackToDirectory = () => {
    setView('directory');
    setSelectedEmployeeId(null);
  };

  return (
    <div>
      {view !== 'directory' && (
        <div style={{ marginBottom: '1rem', padding: '0 1.5rem', marginTop: '1rem' }}>
          <button 
            onClick={handleBackToDirectory}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <IconArrowLeft size={16} /> Back to Directory
          </button>
        </div>
      )}

      {view === 'directory' && (
        <EmployeeDirectoryView 
          onSelectEmployee={handleSelectEmployee} 
          onAddEmployee={handleAddEmployee} 
        />
      )}

      {view === 'profile' && selectedEmployeeId && (
        <EmployeeProfileView employeeId={selectedEmployeeId} />
      )}

      {view === 'add' && (
        <AddEmployeeForm 
          onComplete={handleBackToDirectory} 
          onCancel={handleBackToDirectory} 
        />
      )}
    </div>
  );
}
