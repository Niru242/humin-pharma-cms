'use client';

import { IconAlarm, IconAlertTriangle, IconBeach, IconCalendarStar, IconListCheck } from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { ModuleTabs } from '@/components/ui/ModuleTabs';

export default function LeaveDashboardPage() {
  
  return (
    <div className="page-container" style={{ background: 'var(--background-color)' }}>
      <PageHeader 
        title="Leave Management Dashboard" 
        description="Monitor team availability, pending approvals, and leave liability."
      />
      <ModuleTabs />

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <KpiCard 
          title="Currently on Leave" 
          value="42" 
          icon={<IconBeach size={24} />} 
          theme="primary" 
          trend={{ value: -5.5, label: 'vs previous working day' }}
          sparklineData={[48, 50, 45, 42, 40, 41, 42]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Pending Approvals" 
          value="128" 
          icon={<IconListCheck size={24} />} 
          theme="warning" 
          trend={{ value: 12.0, label: 'vs yesterday', isReverse: true }}
          sparklineData={[90, 95, 100, 110, 115, 125, 128]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="LWP (Unpaid)" 
          value="15" 
          icon={<IconAlertTriangle size={24} />} 
          theme="danger" 
          trend={{ value: -2.4, label: 'vs last month', isReverse: true }}
          sparklineData={[18, 17, 16, 16, 15, 15, 15]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Upcoming Leaves" 
          value="85" 
          icon={<IconAlarm size={24} />} 
          theme="success" 
          trend={{ value: 8.5, label: 'next 7 days' }}
          sparklineData={[50, 55, 60, 65, 75, 80, 85]}
          sparklineLabels={["21 Jul", "22 Jul", "23 Jul", "24 Jul", "25 Jul", "26 Jul", "27 Jul"]}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Upcoming Leave Schedule */}
          <div>

<div className="card">

            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconCalendarStar size={20} className="text-primary" />
                Who is away this week?
              </h3>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ background: 'var(--warning-color-light)', color: 'var(--warning-color)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                  <div className="text-xs font-bold uppercase">Jul</div>
                  <div className="text-xl font-bold">22</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-medium">Suresh Menon (Engineering)</div>
                  <div className="text-sm text-muted">Privilege Leave (Approved)</div>
                </div>
                <div className="text-right">
                  <div className="badge badge-warning">2 Days</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ background: 'var(--success-color-light)', color: 'var(--success-color)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                  <div className="text-xs font-bold uppercase">Jul</div>
                  <div className="text-xl font-bold">24</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-medium">Anjali Gupta (HR)</div>
                  <div className="text-sm text-muted">Maternity Leave (Approved)</div>
                </div>
                <div className="text-right">
                  <div className="badge badge-success">90 Days</div>
                </div>
              </div>
            </div>
          
</div>
</div>

          {/* Leave Type Breakdown (Mock Bars) */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>Leaves by Type (MTD)</h3>
<div className="card">

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="font-medium">Privilege Leave (PL)</span>
                  <span>145 Days</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--primary-color)', width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="font-medium">Sick Leave (SL)</span>
                  <span>42 Days</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--warning-color)', width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="font-medium">Leave Without Pay (LWP)</span>
                  <span className="text-danger">18 Days</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--danger-color)', width: '10%' }}></div>
                </div>
              </div>
            </div>
          
</div>
</div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Policy Alerts */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>
              <IconAlertTriangle size={20} className="text-danger" />
              Policy Alerts
            </h3>
<div className="card">

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(var(--danger-color-rgb), 0.05)', border: '1px solid var(--danger-color)', padding: '1rem', borderRadius: '8px' }}>
                <div className="font-medium text-danger">Negative Balances Detected</div>
                <div className="text-sm mt-1">3 employees have exceeded their PL quota without sufficient approvals.</div>
                <a href="/leave/balances" className="text-sm font-medium mt-2" style={{ display: 'inline-block', color: 'var(--danger-color)' }}>Review Ledgers &rarr;</a>
              </div>

              <div style={{ background: 'rgba(var(--warning-color-rgb), 0.05)', border: '1px solid var(--warning-color)', padding: '1rem', borderRadius: '8px' }}>
                <div className="font-medium text-warning">Lapse Warning</div>
                <div className="text-sm mt-1">Leave carry-forward limit processing is due next month. 120 employees will lose partial balances.</div>
              </div>
            </div>
          
</div>
</div>

          {/* Quick Actions */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>Manage Leaves</h3>
<div className="card">

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/leave/approvals" className="btn btn-primary full-width" style={{ justifyContent: 'center' }}>Approve Pending (128)</a>
              <a href="/leave/adjustments" className="btn btn-secondary full-width" style={{ justifyContent: 'center' }}>Manual Adjustments</a>
              <a href="/leave/balances" className="btn btn-secondary full-width" style={{ justifyContent: 'center' }}>View Balances Ledger</a>
            </div>
          
</div>
</div>

        </div>

      </div>
    </div>
  );
}
