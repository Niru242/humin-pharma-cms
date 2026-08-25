'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconDotsVertical, IconFilter, IconMail, IconPencil, IconPhone, IconSearch, IconTrash } from '@tabler/icons-react';
import '../employees.css';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees';

interface EmployeeDirectoryViewProps {
  onSelectEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
}

export default function EmployeeDirectoryView({ onSelectEmployee, onAddEmployee }: EmployeeDirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useEmployees({ search: searchTerm || undefined });
  const deleteEmployee = useDeleteEmployee();

  const employees = data?.items || [];

  const handleEdit = (emp: any) => {
    if (onSelectEmployee) {
      onSelectEmployee(emp.id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee.mutate({ id, reason: 'Deleted by admin' });
    }
  };

  return (
    <div className="page-container" style={{ display: 'block' }}>
      <SetPageHeader title="Employee Directory" description="Browse and manage all employees in the organization." />
      <div className="table-wrapper" style={{ borderRadius: '24px' }}>
        <div 
          className="filter-bar" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '1rem', 
            width: '100%',
            fontFamily: '"Nunito", sans-serif'
          }}
        >
          <div className="search-bar" style={{ position: 'relative', flex: '1 1 auto', maxWidth: '350px' }}>
            <div style={{
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconSearch size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem 1rem 0.5rem 2.75rem', 
                borderRadius: '9999px', 
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '0.875rem',
                fontFamily: '"Nunito", sans-serif',
                color: '#374151'
              }} 
            />
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px', 
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontFamily: '"Nunito", sans-serif'
              }}
            >
              <IconFilter size={18} />
              Filters
            </button>
            {onAddEmployee ? (
              <button 
                onClick={onAddEmployee} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px', 
                  border: 'none',
                  backgroundColor: '#2563eb', 
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: '"Nunito", sans-serif'
                }}
              >
                Add Employee
              </button>
            ) : (
              <Link 
                href="/employees/add" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px', 
                  border: 'none',
                  backgroundColor: '#2563eb', 
                  color: '#ffffff',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: '"Nunito", sans-serif'
                }}
              >
                Add Employee
              </Link>
            )}
          </div>
        </div>

        <div className="data-grid-container">
          <table className="data-grid directory-grid">
            <thead>
              <tr>
                <th>Employee Details</th>
                <th>Role & Department</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="empty-state">Loading...</td>
                </tr>
              )}
              {!isLoading && employees.map((emp: any) => (
                <tr 
                  key={emp.id} 
                  className="directory-row"
                  onClick={() => {
                    if (onSelectEmployee) {
                      onSelectEmployee(emp.id);
                    } else {
                      window.location.href = `/employees/${emp.id}`;
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <EmployeeProfileCell 
                      firstName={emp.firstName} 
                      lastName={emp.lastName} 
                      employeeId={emp.employeeCode || emp.id} 
                      imageUrl={emp.avatar} 
                    />
                  </td>
                  <td>
                    <div className="font-semibold">{emp.designation || emp.designationName || '-'}</div>
                    <div className="text-muted text-xs">{emp.department || emp.departmentName || '-'}</div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="text-sm"><IconMail size={14} /> {emp.email || '-'}</span>
                      <span className="text-sm"><IconPhone size={14} /> {emp.phone || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${(emp.employmentStatus || emp.status || '').toLowerCase() === 'active' ? 'success' : 'draft'}`}>
                      {emp.employmentStatus || emp.status || '-'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn text-muted" onClick={() => handleEdit(emp)}><IconPencil size={18} /></button>
                      <button className="icon-btn text-danger" onClick={() => handleDelete(emp.id)}><IconTrash size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">No employees found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
