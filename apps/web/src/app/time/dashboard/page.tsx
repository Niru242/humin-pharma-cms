'use client';

import { IconAlarm, IconAlertTriangle, IconCalendarStats, IconChartBar, IconFingerprint } from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { ModuleTabs } from '@/components/ui/ModuleTabs';

export default function AttendanceDashboardPage() {
  
  return (
    <div className="page-container" style={{ background: 'var(--background-color)' }}>
      <PageHeader 
        title="Time & Attendance Dashboard" 
        description="Overview of workforce attendance, exceptions, and biometric device health."
      />
      <ModuleTabs />

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <KpiCard 
          title="Headcount (Shift)" 
          value="450" 
          icon={<IconCalendarStats size={28} />} 
          theme="default" 
          trend={{ value: 0, label: 'vs previous shift' }}
          sparklineData={[445, 450, 448, 452, 450, 450, 450]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Punched In" 
          value="412" 
          subtitle="(91%)"
          icon={<IconAlarm size={28} />} 
          theme="success" 
          trend={{ value: 2.5, label: 'vs yesterday' }}
          sparklineData={[390, 400, 405, 395, 410, 408, 412]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Missing Out Punch" 
          value="18" 
          icon={<IconAlertTriangle size={28} />} 
          theme="danger" 
          trend={{ value: 5.2, label: 'vs yesterday', isReverse: true }}
          sparklineData={[10, 12, 15, 8, 14, 20, 18]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Late Arrivals" 
          value="24" 
          icon={<IconAlertTriangle size={28} />} 
          theme="warning" 
          trend={{ value: -14.2, label: 'vs yesterday', isReverse: true }}
          sparklineData={[35, 40, 28, 30, 25, 20, 24]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
        <KpiCard 
          title="Total OT (Hours)" 
          value="45.5" 
          icon={<IconChartBar size={28} />} 
          theme="primary" 
          trend={{ value: 12.0, label: 'vs yesterday' }}
          sparklineData={[30, 32, 28, 40, 42, 38, 45.5]}
          sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Trend Chart (Mock) */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>
              <IconChartBar size={20} className="text-primary" />
              7-Day Attendance Trend
            </h3>
<div className="card">

            <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              {/* Mock Bar Chart */}
              {[95, 92, 98, 91, 88, 45, 94].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '100%', background: i === 5 ? 'var(--warning-color)' : 'var(--primary-color)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: i === 6 ? 1 : 0.6 }}></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span className="font-medium text-primary">Sun</span>
            </div>
          
</div>
</div>

          {/* Department Breakdown */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>
              <IconCalendarStats size={20} className="text-info" />
              Present by Department
            </h3>
<div className="card">

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 50px', alignItems: 'center', gap: '1rem' }}>
                <span className="font-medium">Production</span>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--success-color)', width: '95%' }}></div>
                </div>
                <span className="text-right">95%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 50px', alignItems: 'center', gap: '1rem' }}>
                <span className="font-medium">Quality Control</span>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--success-color)', width: '88%' }}></div>
                </div>
                <span className="text-right">88%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 50px', alignItems: 'center', gap: '1rem' }}>
                <span className="font-medium">Warehouse</span>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--warning-color)', width: '75%' }}></div>
                </div>
                <span className="text-right">75%</span>
              </div>
            </div>
          
</div>
</div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Device Health */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>
              <IconFingerprint size={20} className="text-muted" />
              Device Health Sync
            </h3>
<div className="card">

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div className="font-medium">Gate 1 Biometric</div>
                  <div className="text-sm text-muted">Last sync: 2 mins ago</div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(var(--danger-color-rgb), 0.05)', borderRadius: '8px', border: '1px solid var(--danger-color)' }}>
                <div>
                  <div className="font-medium text-danger">Gate 2 Face ID</div>
                  <div className="text-sm text-danger">Offline since 08:30 AM</div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger-color)' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div className="font-medium">Canteen Scanner</div>
                  <div className="text-sm text-muted">Last sync: 5 mins ago</div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
              </div>
            </div>
            <button className="btn btn-secondary full-width" style={{ marginTop: '1rem' }}>Manage Devices</button>
          
</div>
</div>

          {/* Quick Action Links */}
          <div>

            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' , fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700}}>
              <IconAlertTriangle size={20} className="text-warning" />
              Action Required
            </h3>
<div className="card">

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/time/exceptions" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <span>Resolve Exceptions</span>
                <span className="badge badge-danger">42</span>
              </a>
              <a href="/time/regularizations" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <span>Pending Regularizations</span>
                <span className="badge badge-warning">15</span>
              </a>
              <a href="/time/raw-punches" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                <span>View Raw Logs</span>
                <span>&rarr;</span>
              </a>
            </div>
          
</div>
</div>

        </div>

      </div>
    </div>
  );
}
