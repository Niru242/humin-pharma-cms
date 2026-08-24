'use client';

import { useState } from 'react';
import { IconAlarm, IconAlertTriangle, IconArrowRight, IconCalendarStar, IconFileCertificate, IconListCheck, IconShieldCheck, IconUserPlus, IconUsers, IconUpload, IconCalendarEvent, IconCheck } from '@tabler/icons-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { Chart } from '@/components/ui/Chart';
import { OperationsStrip } from '@/components/ui/OperationsStrip';
import { EmployeeProfileCell } from '@/components/ui/EmployeeProfileCell';
import '../dashboard.css';

export default function MainDashboardPage() {
    const attendanceChartOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Present', 'On Leave', 'Exceptions'],
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: { lineStyle: { color: '#e2e8f0' } },
            axisLabel: { color: '#64748b' }
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
            axisLabel: { color: '#64748b' }
        },
        series: [
            {
                name: 'Present',
                type: 'bar',
                stack: 'total',
                itemStyle: { color: '#10b981' },
                data: [1150, 1180, 1190, 1175, 1160, 450, 420]
            },
            {
                name: 'On Leave',
                type: 'bar',
                stack: 'total',
                itemStyle: { color: '#f59e0b' },
                data: [50, 42, 35, 45, 55, 20, 15]
            },
            {
                name: 'Exceptions',
                type: 'line',
                itemStyle: { color: '#ef4444' },
                symbolSize: 8,
                lineStyle: { width: 3 },
                data: [45, 23, 20, 25, 30, 5, 2]
            }
        ]
    };


    return (
        <div className="page-container" style={{ background: 'var(--background-color)' }}>
            <SetPageHeader title="" />

            <PageHeader
                title="Good Morning, Admin 👋"
                description="Here's what is happening across your organization today."
            >
                {/* Sync Status & Date Pill rendered next to the Page Title */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <IconCheck size={14} className="text-success" />
                        Attendance synced at 10:30 AM
                    </div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '8px',
                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)',
                    border: '1px solid var(--border-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                    <IconCalendarStar size={16} style={{ color: 'var(--brand-500)' }} />
                    Today: 20 Jul 2026
                </div>
            </PageHeader>


            <div className="dashboard-grid">
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
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
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>Attendance Trends (Last 7 Days)</h3>
                        <div className="card">
                            <Chart option={attendanceChartOption} height="300px" />
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div>
                        <div style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <IconListCheck size={18} className="text-primary" />
                                Pending Inbox Approvals
                            </h3>
                            <a href="/inbox" className="text-primary text-sm font-medium" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                View All <IconArrowRight size={14} />
                            </a>
                        </div>
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div className="font-medium">Leave Request - Privilege Leave</div>
                                        <div className="text-muted text-sm">Submitted by Rahul Sharma • 2 Hours ago</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary btn-sm text-danger">Reject</button>
                                        <button className="btn btn-primary btn-sm">Approve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Joiners */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconUserPlus size={18} className="text-success" />
                            Recent Joiners
                        </h3>
                        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                <div className="dashboard-right-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--surface-color, #ffffff)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>

                    {/* Quick Actions */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <a href="/employees/add" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0.75rem', gap: '0.5rem', fontSize: '0.8rem', width: 'fit-content' }}>
                                <IconUserPlus size={18} />
                                <span>Onboard</span>
                            </a>
                            <a href="/time/roster" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0.75rem', gap: '0.5rem', fontSize: '0.8rem', width: 'fit-content' }}>
                                <IconCalendarStar size={18} />
                                <span>Roster</span>
                            </a>
                            <a href="/system/import" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0.75rem', gap: '0.5rem', fontSize: '0.8rem', width: 'fit-content' }}>
                                <IconUsers size={18} />
                                <span>Import</span>
                            </a>
                            <a href="/time/lock" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0.75rem', gap: '0.5rem', fontSize: '0.8rem', width: 'fit-content' }}>
                                <IconShieldCheck size={18} />
                                <span>Lock Period</span>
                            </a>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--warning-bg)', border: '1px solid var(--warning-color)', padding: '1rem 1.25rem', borderRadius: '10px' }}>
                                <div>
                                    <div className="font-medium">Factory License Renewal</div>
                                    <div className="text-sm text-muted mt-1">Pune Plant • Expires in 12 Days</div>
                                </div>
                                <button className="btn btn-sm" style={{ background: 'white' }}>Update</button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: '10px' }}>
                                <div>
                                    <div className="font-medium">Contractor SLA</div>
                                    <div className="text-sm text-muted mt-1">Vendor A • Expires in 24 Days</div>
                                </div>
                                <button className="btn btn-secondary btn-sm">Review</button>
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
                        <a href="/time/exceptions" className="btn btn-secondary full-width" style={{ marginTop: '1.5rem', textAlign: 'center', width: '100%' }}>Go to Exception Queue</a>
                    </div>

                </div>
            </div>
        </div>
    );
}
