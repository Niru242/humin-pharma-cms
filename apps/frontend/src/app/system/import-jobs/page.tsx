'use client';

import { useState } from 'react';
import { IconAlarm, IconDownload, IconFileSpreadsheet, IconHistory, IconRefresh } from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';
import { ModuleTabs } from '@/components/ui/ModuleTabs';

const dummyJobs = [
  {
    id: 'BATCH-20260720-0900',
    type: 'Biometric Punches (Device)',
    startedAt: '2026-07-20 09:00:15',
    completedAt: '2026-07-20 09:02:45',
    totalRecords: 1450,
    success: 1445,
    errors: 5,
    status: 'Completed with Errors',
    startedBy: 'System Cron'
  },
  {
    id: 'BATCH-20260719-1530',
    type: 'Employee Master (Bulk CSV)',
    startedAt: '2026-07-19 15:30:00',
    completedAt: '2026-07-19 15:30:12',
    totalRecords: 45,
    success: 45,
    errors: 0,
    status: 'Success',
    startedBy: 'HR Admin'
  },
  {
    id: 'BATCH-20260719-1000',
    type: 'Biometric Punches (Device)',
    startedAt: '2026-07-19 10:00:00',
    completedAt: '--',
    totalRecords: 0,
    success: 0,
    errors: 0,
    status: 'Failed',
    startedBy: 'System Cron'
  }
];

export default function ImportJobsPage() {
  const [jobs] = useState(dummyJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <div className="page-container" style={{ background: 'var(--bg-main)' }}>
      <PageHeader 
        title="Background Import Jobs" 
        description="Monitor the status of bulk data uploads and scheduled API syncs."
      >
        <button className="btn btn-secondary">
          <IconRefresh size={20} />
          Refresh Status
        </button>
      </PageHeader>
      <ModuleTabs />

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Import Type</th>
              <th>Started At</th>
              <th>Status</th>
              <th>Records (Succ / Total)</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                style={{ cursor: 'pointer' }}
                className="hover-row"
              >
                <td className="font-medium text-primary">{job.id}</td>
                <td>{job.type}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconAlarm size={16} className="text-muted" />
                    <span className="text-sm">{job.startedAt}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={job.status} />
                </td>
                <td className="font-medium">
                  {job.success} / {job.totalRecords}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Import Job Details"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {selectedJob?.status === 'Failed' && (
                <button className="btn btn-primary">
                  <IconRefresh size={18} /> Retry Job
                </button>
              )}
            </div>
          </>
        }
      >
        {selectedJob && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconHistory size={20} className="text-primary" />
                  {selectedJob.id}
                </h3>
                <div className="text-muted">{selectedJob.type}</div>
              </div>
              <StatusBadge status={selectedJob.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'var(--success-color-light)', border: '1px solid var(--success-color)', borderRadius: '8px', textAlign: 'center' }}>
                <div className="text-2xl font-bold text-success">{selectedJob.success}</div>
                <div className="text-sm text-muted mt-1">Successfully Inserted</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--danger-color-light)', border: '1px solid var(--danger-color)', borderRadius: '8px', textAlign: 'center' }}>
                <div className="text-2xl font-bold text-danger">{selectedJob.errors}</div>
                <div className="text-sm text-muted mt-1">Failed Records</div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Initiated By</span>
                <span className="font-medium">{selectedJob.startedBy}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Start Time</span>
                <span className="font-medium">{selectedJob.startedAt}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">End Time</span>
                <span className="font-medium">{selectedJob.completedAt}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Duration</span>
                <span className="font-medium">
                  {selectedJob.completedAt === '--' ? '--' : '2m 30s'}
                </span>
              </div>
            </div>

            <h4 style={{ margin: '0 0 1rem 0' }}>Job Actions</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedJob.errors > 0 && (
                <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <IconDownload size={18} /> Download Error Log CSV
                </button>
              )}
              <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                <IconFileSpreadsheet size={18} /> View Original Payload
              </button>
            </div>

          </div>
        )}
      </Drawer>

      <style jsx>{`
        .hover-row:hover {
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}
