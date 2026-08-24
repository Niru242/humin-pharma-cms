'use client';

import { useState } from 'react';
import { IconCheck, IconSearch } from '@tabler/icons-react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';

const dummyEmployees = [
  { id: '1', name: 'Rahul Sharma', code: 'EMP-002', dept: 'R&D' },
  { id: '2', name: 'Priya Patel', code: 'EMP-003', dept: 'Human Resources' },
  { id: '3', name: 'Amit Kumar', code: 'EMP-004', dept: 'Production' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ShiftRosterPage() {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [targetShift, setTargetShift] = useState('GEN');

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedEmployees.length === dummyEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(dummyEmployees.map(e => e.id));
    }
  };

  return (
    <div className="page-container">
      <SetPageHeader title="Shift Rostering" description="Assign weekly or monthly shifts to employees and publish rosters." />
      <div className="page-header">
        <button className="btn btn-primary">
          <IconCheck size={20} />
          Publish Roster
        </button>
      </div>
      <ModuleTabs />

      <div className="roster-layout" style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 180px)' }}>
        
        {/* Left Panel: Scope & Assignment Form */}
        <div className="roster-sidebar" style={{ width: '320px', background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-color)' }}>1. Select Period</h3>
            <div className="form-group">
              <label>Roster Start Date</label>
              <input type="date" className="form-control" defaultValue="2026-07-20" />
            </div>
            <div className="form-group">
              <label>Roster End Date</label>
              <input type="date" className="form-control" defaultValue="2026-07-26" />
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-color)' }}>2. Filter Employees</h3>
            <div className="form-group">
              <label>Plant</label>
              <select className="form-control" defaultValue="mumbai">
                <option value="mumbai">Mumbai Unit</option>
                <option value="pune">Pune Warehouse</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select className="form-control" defaultValue="production">
                <option value="all">All Departments</option>
                <option value="production">Production</option>
                <option value="quality">Quality</option>
              </select>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-color)' }}>3. Assign Shift</h3>
            <div className="form-group">
              <label>Shift to Assign</label>
              <select className="form-control" value={targetShift} onChange={(e) => setTargetShift(e.target.value)}>
                <option value="GEN">General (09:00 - 18:00)</option>
                <option value="MOR">Morning (06:00 - 14:00)</option>
                <option value="NGT">Night (22:00 - 06:00)</option>
                <option value="WO">Weekly Off</option>
              </select>
            </div>
            <button className="btn btn-secondary full-width" disabled={selectedEmployees.length === 0}>
              Apply {targetShift} Shift to {selectedEmployees.length} Selected
            </button>
          </div>

        </div>

        {/* Right Panel: Grid View */}
        <div className="roster-grid-container" style={{ flex: 1, background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>Current Assignments (20 Jul - 26 Jul)</h3>
            <div className="search-bar" style={{ position: 'relative' }}>
              <IconSearch size={18} />
              <input type="text" className="form-control" placeholder="Search employees..." style={{ paddingLeft: '2.5rem', width: '250px' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <table className="data-grid" style={{ minWidth: '800px', margin: 0 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedEmployees.length === dummyEmployees.length && dummyEmployees.length > 0}
                      onChange={selectAll}
                    />
                  </th>
                  <th style={{ minWidth: '200px' }}>Employee</th>
                  {days.map((d, i) => (
                    <th key={d} style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div>{d}</div>
                      <div className="text-muted text-sm">{20 + i} Jul</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dummyEmployees.map((emp) => (
                  <tr key={emp.id} className={selectedEmployees.includes(emp.id) ? 'selected-row' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployee(emp.id)}
                      />
                    </td>
                    <td>
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-muted text-sm">{emp.code} • {emp.dept}</div>
                    </td>
                    {days.map((d, i) => (
                      <td key={d} style={{ textAlign: 'center', padding: '0.25rem' }}>
                        <div style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          background: d === 'Sun' ? 'var(--danger-color-light)' : 'var(--primary-color-light)',
                          color: d === 'Sun' ? 'var(--danger-color)' : 'var(--primary-color)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        className="shift-cell-hover"
                        >
                          {d === 'Sun' ? 'WO' : 'GEN'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--primary-color-light)', borderRadius: '3px' }}></div>
              <span className="text-muted">Assigned Shift</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--danger-color-light)', borderRadius: '3px' }}></div>
              <span className="text-muted">Weekly Off (WO)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', border: '1px dashed var(--border-color)', borderRadius: '3px' }}></div>
              <span className="text-muted">Unassigned</span>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .shift-cell-hover:hover {
          filter: brightness(0.95);
          transform: scale(1.05);
        }
        .selected-row td {
          background-color: rgba(var(--primary-color-rgb), 0.05);
        }
      `}</style>
    </div>
  );
}
