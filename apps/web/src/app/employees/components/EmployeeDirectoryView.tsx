'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconDotsVertical, IconFilter, IconMail, IconPhone, IconSearch } from '@tabler/icons-react';
import '../employees.css';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';

const dummyEmployees = [
  {
    id: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    designation: 'VP of Operations',
    department: 'Operations',
    email: 'sarah.j@acme.com',
    phone: '+91 98765 43210',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'EMP-002',
    firstName: 'Rahul',
    lastName: 'Sharma',
    designation: 'Senior Scientist',
    department: 'Formulation R&D',
    email: 'rahul.s@acme.com',
    phone: '+91 98765 43211',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=rahul'
  },
  {
    id: 'EMP-003',
    firstName: 'Priya',
    lastName: 'Patel',
    designation: 'HR Manager',
    department: 'Human Resources',
    email: 'priya.p@acme.com',
    phone: '+91 98765 43212',
    status: 'On Leave',
    avatar: 'https://i.pravatar.cc/150?u=priya'
  },
  {
    id: 'EMP-004',
    firstName: 'Amit',
    lastName: 'Kumar',
    designation: 'Machine Operator',
    department: 'Production Core',
    email: 'amit.k@acme.com',
    phone: '+91 98765 43213',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=amit'
  },
  {
    id: 'EMP-005',
    firstName: 'Rajesh',
    lastName: 'Iyer',
    designation: 'QC Lead',
    department: 'Quality Control',
    email: 'rajesh.i@acme.com',
    phone: '+91 98765 43214',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=rajesh'
  }
];

interface EmployeeDirectoryViewProps {
  onSelectEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
}

export default function EmployeeDirectoryView({ onSelectEmployee, onAddEmployee }: EmployeeDirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = dummyEmployees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
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
                      employeeId={emp.id} 
                      imageUrl={emp.avatar} 
                    />
                  </td>
                  <td>
                    <div className="font-semibold">{emp.designation}</div>
                    <div className="text-muted text-xs">{emp.department}</div>
                  </td>
                <td>
                  <div className="contact-info">
                    <span className="text-sm"><IconMail size={14} /> {emp.email}</span>
                    <span className="text-sm"><IconPhone size={14} /> {emp.phone}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${emp.status.toLowerCase() === 'active' ? 'success' : 'draft'}`}>
                    {emp.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="icon-btn text-muted"><IconDotsVertical size={18} /></button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
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
