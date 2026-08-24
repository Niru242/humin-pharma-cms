import React from 'react';
import { ModuleTabs } from '@/components/ui/ModuleTabs';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { IconTargetArrow, IconUsers, IconCertificate, IconTrendingUp } from '@tabler/icons-react';

export default function PerformanceDashboard() {
  return (
    <div className="page-container">
      <SetPageHeader title="Performance Dashboard" description="Overview of performance cycles, reviews, and company-wide KPIs." />
      <div className="page-header" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <button className="btn btn-primary">Start Q4 Review Cycle</button>
      </div>
      <ModuleTabs />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div style={{ padding: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(var(--primary-color-rgb), 0.1)', color: 'var(--primary-color)', borderRadius: '8px' }}>
              <IconTargetArrow size={24} />
            </div>
            <h3 className="text-muted" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Active Cycle</h3>
          </div>
          <div className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Q3 2026</div>
          <div className="text-sm text-muted mt-2">Closes in 14 days</div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(var(--warning-color-rgb), 0.1)', color: 'var(--warning-color)', borderRadius: '8px' }}>
              <IconUsers size={24} />
            </div>
            <h3 className="text-muted" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Pending Reviews</h3>
          </div>
          <div className="text-warning" style={{ fontSize: '2rem', fontWeight: 'bold' }}>24</div>
          <div className="text-sm text-muted mt-2">Out of 180 total</div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(var(--success-color-rgb), 0.1)', color: 'var(--success-color)', borderRadius: '8px' }}>
              <IconCertificate size={24} />
            </div>
            <h3 className="text-muted" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Completed Reviews</h3>
          </div>
          <div className="text-success" style={{ fontSize: '2rem', fontWeight: 'bold' }}>156</div>
          <div className="text-sm text-muted mt-2">86% Completion Rate</div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(var(--primary-color-rgb), 0.1)', color: 'var(--primary-color)', borderRadius: '8px' }}>
              <IconTrendingUp size={24} />
            </div>
            <h3 className="text-muted" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Average Score</h3>
          </div>
          <div className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>4.2 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 5.0</span></div>
          <div className="text-sm text-success font-medium mt-2">+0.3 from last cycle</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Activity */}
        <div style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>Recent Performance Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="font-medium">Dr. Ramesh finalized scores for QA Team</div>
                <div className="text-sm text-muted">HOD Scores Module</div>
              </div>
              <div className="text-sm text-muted">2 hrs ago</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="font-medium">Evidence logged for Amit Kumar</div>
                <div className="text-sm text-muted">ISO Certification (Attachment)</div>
              </div>
              <div className="text-sm text-muted">5 hrs ago</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="font-medium">Report Card Weights updated</div>
                <div className="text-sm text-muted">Peer Feedback weight reduced to 40%</div>
              </div>
              <div className="text-sm text-muted">1 day ago</div>
            </div>
          </div>
        </div>

        {/* Top Performers (Mock) */}
        <div style={{ background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>Top Departments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-medium">Engineering (R&D)</div>
              <div className="badge badge-success">4.8 avg</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-medium">Quality Assurance</div>
              <div className="badge badge-success">4.5 avg</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-medium">Sales & Marketing</div>
              <div className="badge badge-primary">4.2 avg</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-medium">Human Resources</div>
              <div className="badge badge-primary">4.1 avg</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
