'use client';

import { useState } from 'react';
import { IconAlarm, IconArrowsRightLeft, IconCalendarStar, IconCheck, IconEye, IconPencil, IconX } from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { StandardTableLayout } from '@/components/ui/StandardTableLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';

const dummyTasks = [
  {
    id: '1',
    type: 'Leave Approval',
    submitter: 'Dr. Ramesh (R&D)',
    details: 'PL for 2 Days (22 Jul - 23 Jul)',
    submittedOn: '2026-07-19 10:30 AM',
    aging: '24 Hours',
    icon: <IconCalendarStar size={20} className="text-primary" />
  },
  {
    id: '2',
    type: 'Regularization',
    submitter: 'Priya Desai (QA)',
    details: 'Missing Out Punch on 17 Jul',
    submittedOn: '2026-07-18 09:15 AM',
    aging: '48 Hours',
    icon: <IconPencil size={20} className="text-warning" />
  },
  {
    id: '3',
    type: 'Overtime',
    submitter: 'Amit Kumar (Sales)',
    details: 'Actual OT: 120 Minutes on 18 Jul',
    submittedOn: '2026-07-20 08:00 AM',
    aging: '2 Hours',
    icon: <IconAlarm size={20} className="text-success" />
  },
  {
    id: '4',
    type: 'Employee Change',
    submitter: 'HR System',
    details: 'Transfer Request for Suresh Menon to Pune Plant',
    submittedOn: '2026-07-20 11:00 AM',
    aging: '1 Hour',
    icon: <IconArrowsRightLeft size={20} className="text-info" />
  }
];

export default function UnifiedInboxPage() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Drawer state
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleAction = (id: string, action: string) => {
    if (action === 'View') {
      const task = tasks.find(t => t.id === id);
      setSelectedTask(task);
      return;
    }
    
    // Quick approve/reject
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => 
    (filterType === 'All' || t.type === filterType) &&
    (t.submitter.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const taskTypes = ['All', 'Leave Approval', 'Regularization', 'Overtime', 'Employee Change'];

  return (
    <div className="page-container">
      <SetPageHeader 
        title="Unified Task Inbox" 
        description="Manage all your pending approvals and actions in one place."
      />

      <div className="module-tabs-container">
        {taskTypes.map(tab => {
          const isActive = filterType === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`module-tab ${isActive ? 'active' : ''}`}
            >
              {tab === 'All' ? `All Pending (${tasks.length})` : tab}
            </button>
          );
        })}
      </div>

      <StandardTableLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tasks by employee or type..."
      >
        <table className="data-grid directory-grid">
          <thead>
            <tr>
              <th>Task Type</th>
              <th>Submitter</th>
              <th>Details</th>
              <th>Submitted On</th>
              <th>Aging</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className="directory-row">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {task.icon}
                    </div>
                    <span className="font-semibold">{task.type}</span>
                  </div>
                </td>
                <td className="font-medium text-primary">{task.submitter}</td>
                <td className="text-muted font-medium">{task.details}</td>
                <td className="font-medium">{task.submittedOn}</td>
                <td>
                  <span className={`badge ${task.aging.includes('48') ? 'badge-danger' : 'badge-warning'}`}>
                    {task.aging}
                  </span>
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn text-primary" title="Review Task" onClick={() => handleAction(task.id, 'View')}>
                      <IconEye size={18} />
                    </button>
                    <button className="icon-btn text-success" title="Quick Approve" onClick={() => handleAction(task.id, 'Approve')}>
                      <IconCheck size={18} />
                    </button>
                    <button className="icon-btn text-danger" title="Quick Reject" onClick={() => handleAction(task.id, 'Reject')}>
                      <IconX size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState 
                    title="Inbox Zero!" 
                    message="You have no pending tasks to review." 
                    icon={<IconCheck size={32} className="text-success" />} 
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StandardTableLayout>

      {/* Approval Drawer */}
      <Drawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Review ${selectedTask?.type}`}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary text-danger" onClick={() => { handleAction(selectedTask?.id, 'Reject'); setSelectedTask(null); }}>
                <IconX size={18} /> Reject
              </button>
              <button className="btn btn-primary" onClick={() => { handleAction(selectedTask?.id, 'Approve'); setSelectedTask(null); }}>
                <IconCheck size={18} /> Approve
              </button>
            </div>
          </>
        }
      >
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedTask.submitter.split(' ')[0][0]}{selectedTask.submitter.split(' ')[1]?.[0] || ''}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{selectedTask.submitter}</h3>
                  <div className="text-muted">{selectedTask.details}</div>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status="Pending" />
                <div className="text-sm text-muted mt-2">ID: REQ-{selectedTask.id}982</div>
              </div>
            </div>

            {/* Approver Comments */}
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Approver Comments</h4>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="Add optional notes for the employee..."
              ></textarea>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
}
