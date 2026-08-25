'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconAlarm,
  IconAlertTriangle,
  IconArrowRight,
  IconCalendarStar,
  IconFileCertificate,
  IconListCheck,
  IconShieldCheck,
  IconUserPlus,
  IconUsers,
  IconUpload,
  IconCalendarEvent,
  IconCheck,
  IconX,
  IconClock,
  IconBuildingFactory,
} from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { Chart } from '@/components/ui/Chart';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import { useToast } from '@/providers/ToastProvider';
import './dashboard.css';

export default function MainDashboardPage() {
  const toast = useToast();

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: '1',
      title: 'Leave Request - Privilege Leave (2 Days)',
      employee: 'Rahul Sharma',
      empCode: 'EMP-002',
      time: '2 Hours ago',
      dept: 'Formulation R&D',
    },
    {
      id: '2',
      title: 'Attendance Regularization - Missing Out Punch',
      employee: 'Priya Patel',
      empCode: 'EMP-003',
      time: '3 Hours ago',
      dept: 'Quality Control',
    },
    {
      id: '3',
      title: 'Shift Overtime Approval (120 Mins)',
      employee: 'Amit Kumar',
      empCode: 'EMP-004',
      time: '4 Hours ago',
      dept: 'Production Core',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    toast.success('Request Approved', `Approval processed for ${name}.`);
  };

  const handleReject = (id: string, name: string) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    toast.error('Request Rejected', `Request from ${name} was declined.`);
  };

  const attendanceChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['Present', 'On Leave', 'Exceptions'],
      bottom: 0,
      textStyle: { color: '#64748b', fontWeight: 600 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#64748b' },
    },
    series: [
      {
        name: 'Present',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
        data: [1150, 1180, 1190, 1175, 1160, 450, 420],
      },
      {
        name: 'On Leave',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#f59e0b' },
        data: [50, 42, 35, 45, 55, 20, 15],
      },
      {
        name: 'Exceptions',
        type: 'line',
        itemStyle: { color: '#ef4444' },
        symbolSize: 8,
        lineStyle: { width: 3 },
        data: [45, 23, 20, 25, 30, 5, 2],
      },
    ],
  };

  return (
    <div className="page-container" style={{ background: 'var(--background-color)' }}>
      <SetPageHeader title="" />

      <PageHeader
        title="Good Morning, Admin 👋"
        description="Here's what is happening across your organization today."
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
            <IconCheck size={14} className="text-success" />
            Attendance synced at 10:30 AM
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-card)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
            }}
          >
            <IconCalendarStar size={16} style={{ color: 'var(--brand-500)' }} />
            Today: 20 Jul 2026
          </div>
        </div>
      </PageHeader>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <KpiCard
              title="Total Employees"
              value="1,245"
              icon={<IconUsers size={28} />}
              theme="primary"
              trend={{ value: 4.2, label: 'vs last month' }}
              sparklineData={[1120, 1140, 1165, 1180, 1210, 1230, 1245]}
              sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
            />
            <KpiCard
              title="Present Today"
              value="1,180"
              subtitle="out of 1,200 scheduled"
              icon={<IconAlarm size={28} />}
              theme="success"
              trend={{ value: 2.1, label: 'vs previous working day' }}
              sparklineData={[1050, 1080, 1120, 1100, 1140, 1160, 1180]}
              sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
            />
            <KpiCard
              title="On Leave"
              value="42"
              icon={<IconCalendarStar size={28} />}
              theme="warning"
              trend={{ value: -12.5, label: 'vs previous working day' }}
              sparklineData={[55, 60, 52, 48, 45, 50, 42]}
              sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
            />
            <KpiCard
              title="Exception Cases"
              value="23"
              icon={<IconAlertTriangle size={28} />}
              theme="danger"
              trend={{ value: 8.5, label: 'vs previous working day', isReverse: true }}
              sparklineData={[12, 15, 10, 18, 20, 15, 23]}
              sparklineLabels={["14 Jul", "15 Jul", "16 Jul", "17 Jul", "18 Jul", "19 Jul", "20 Jul"]}
            />
          </div>

          {/* Attendance Trends Chart */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>
              Attendance Trends (Last 7 Days)
            </h3>
            <div className="card">
              <Chart option={attendanceChartOption} height="300px" />
            </div>
          </div>

          {/* Pending Tasks */}
          <div>
            <div style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconListCheck size={18} className="text-primary" />
                Pending Inbox Approvals ({pendingApprovals.length})
              </h3>
              <Link href="/inbox" className="text-primary text-sm font-medium hover-underline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <IconArrowRight size={14} />
              </Link>
            </div>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {pendingApprovals.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: i < pendingApprovals.length - 1 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem' }}>{item.title}</div>
                    <div className="text-muted text-xs" style={{ marginTop: '2px' }}>
                      {item.employee} ({item.empCode}) • {item.dept} • {item.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary btn-sm text-danger"
                      onClick={() => handleReject(item.id, item.employee)}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApprove(item.id, item.employee)}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <IconCheck size={32} style={{ color: 'var(--success)', margin: '0 auto 8px' }} />
                  <div className="font-semibold">All inbox approvals completed!</div>
                  <div className="text-xs">No pending requests require your immediate action.</div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Joiners */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconUserPlus size={18} className="text-success" />
              Recent Joiners
            </h3>
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <EmployeeProfileCell
                firstName="Amit"
                lastName="Kumar"
                subtitle="Joined 18 Jul • IT Department"
              />
              <EmployeeProfileCell
                firstName="Sneha"
                lastName="Nair"
                subtitle="Joined 15 Jul • HR Department"
              />
            </div>
          </div>
        </div>

        {/* Right Column / Panel */}
        <div
          className="dashboard-right-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'var(--surface-color, #ffffff)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Quick Actions */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                href="/employees"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <IconUserPlus size={18} />
                <span>Employees</span>
              </Link>
              <Link
                href="/time/roster"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <IconCalendarStar size={18} />
                <span>Roster</span>
              </Link>
              <Link
                href="/system/import"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <IconUpload size={18} />
                <span>Import</span>
              </Link>
              <Link
                href="/time/lock"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <IconShieldCheck size={18} />
                <span>Lock Period</span>
              </Link>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }} />

          {/* Expiring Documents */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconFileCertificate size={18} className="text-warning" />
              Expiring Documents
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--warning-color)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div className="font-semibold" style={{ fontSize: '0.875rem' }}>Factory License Renewal</div>
                  <div className="text-xs text-muted mt-1">Pune Plant • Expires in 12 Days</div>
                </div>
                <button
                  className="btn btn-sm"
                  style={{ background: 'white', fontWeight: 600 }}
                  onClick={() => toast.info('License Action', 'Factory license renewal dossier opened.')}
                >
                  Update
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid var(--border-color)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div className="font-semibold" style={{ fontSize: '0.875rem' }}>Contractor SLA</div>
                  <div className="text-xs text-muted mt-1">Vendor A • Expires in 24 Days</div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => toast.info('Contractor SLA', 'Vendor agreement details opened for review.')}
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)' }} />

          {/* Exception Summary */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconAlertTriangle size={18} className="text-danger" />
              Attendance Exceptions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 1rem 0.4rem 0.4rem', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '9999px', color: '#cf1322', width: 'fit-content' }}>
                <div style={{ background: '#cf1322', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>14</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>Missing Out Punches</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1 }}>Yesterday</span>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 1rem 0.4rem 0.4rem', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '9999px', color: '#d48806', width: 'fit-content' }}>
                <div style={{ background: '#faad14', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>8</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>Late Arrivals</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1 }}>Today</span>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 1rem 0.4rem 0.4rem', background: '#f5f5f5', border: '1px solid #d9d9d9', borderRadius: '9999px', color: '#595959', width: 'fit-content' }}>
                <div style={{ background: '#8c8c8c', color: 'white', borderRadius: '50%', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>Unplanned Absent</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1 }}>Today</span>
                </div>
              </li>
            </ul>
            <Link
              href="/time/exceptions"
              className="btn btn-secondary full-width"
              style={{ marginTop: '1.5rem', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              Go to Exception Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
