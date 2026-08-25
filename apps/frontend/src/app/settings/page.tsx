'use client';

import React, { useState } from 'react';
import {
  IconBuilding,
  IconClock,
  IconLock,
  IconBell,
  IconShieldCheck,
  IconPalette,
  IconDeviceFloppy,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
} from '@tabler/icons-react';
import { SetPageHeader } from '@/components/ui/SetPageHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { useToast } from '@/providers/ToastProvider';

export default function SettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'org' | 'attendance' | 'security' | 'notifications' | 'compliance' | 'appearance'>('org');

  // Form States
  const [orgSettings, setOrgSettings] = useState({
    companyName: 'PharmaCorp India Pvt. Ltd.',
    taxId: 'AAAAA0000A',
    cinNumber: 'CIN-U24230MH2020PTC123456',
    fiscalYearStart: 'April',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +5:30)',
    supportEmail: 'hr-support@pharmacorp.in',
  });

  const [attendanceSettings, setAttendanceSettings] = useState({
    standardWorkHours: 8.5,
    gracePeriodMins: 15,
    halfDayThresholdHours: 4.5,
    autoPunchSyncIntervalMins: 10,
    monthlyLockDay: 25,
    overtimeMinimumMins: 60,
    enableGeofencing: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceMfa: true,
    ssoProvider: 'Microsoft Azure AD (SAML 2.0)',
    sessionTimeoutMins: 60,
    minPasswordLength: 10,
    requireSpecialChar: true,
    ipAllowlist: '192.168.1.0/24, 10.0.0.0/16',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailDailyDigest: true,
    smsShiftAlerts: true,
    inAppApprovals: true,
    slaEscalationHours: 24,
    escalateToSkipManager: true,
  });

  const [complianceSettings, setComplianceSettings] = useState({
    gxp21CfrPart11: true,
    mandatoryAuditReason: true,
    logRetentionYears: 7,
    digitalSignatureRequired: true,
    strictRoleSeparation: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    compactMode: false,
  });

  const handleSave = (section: string) => {
    toast.success('Settings Saved', `${section} settings have been successfully updated.`);
  };

  const tabs = [
    { id: 'org', label: 'Organization & Entity', icon: IconBuilding },
    { id: 'attendance', label: 'Attendance & Shifts', icon: IconClock },
    { id: 'security', label: 'Security & Access', icon: IconLock },
    { id: 'notifications', label: 'Notifications & Alerts', icon: IconBell },
    { id: 'compliance', label: 'GxP & Audit Compliance', icon: IconShieldCheck },
    { id: 'appearance', label: 'Appearance & Locale', icon: IconPalette },
  ];

  return (
    <div className="page-container" style={{ background: 'var(--background-color)' }}>
      <SetPageHeader title="System Settings" description="Configure organization rules, security, compliance, and preferences." />

      <PageHeader
        title="System Settings & Policy Hub"
        description="Global parameters, regulatory enforcement, and operational configurations."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Navigation Tabs (Vertical) */}
        <div
          className="card"
          style={{
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            position: 'sticky',
            top: '1rem',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'var(--brand-50, #eff6ff)' : 'transparent',
                  color: isActive ? 'var(--brand-600, #2563eb)' : 'var(--text-main, #334155)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--brand-600)' : 'var(--text-muted)' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* 1. Organization Settings */}
          {activeTab === 'org' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Organization Profile & Entity Setup
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Core legal information and corporate accounting period defaults.
                </p>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Legal Entity Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orgSettings.companyName}
                    onChange={(e) => setOrgSettings({ ...orgSettings, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Tax / GSTIN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orgSettings.taxId}
                    onChange={(e) => setOrgSettings({ ...orgSettings, taxId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>CIN / Registration Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orgSettings.cinNumber}
                    onChange={(e) => setOrgSettings({ ...orgSettings, cinNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Financial Year Start</label>
                  <select
                    className="form-control"
                    value={orgSettings.fiscalYearStart}
                    onChange={(e) => setOrgSettings({ ...orgSettings, fiscalYearStart: e.target.value })}
                  >
                    <option value="April">April (Standard India)</option>
                    <option value="January">January (Calendar Year)</option>
                    <option value="July">July</option>
                    <option value="October">October</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Base Currency</label>
                  <select
                    className="form-control"
                    value={orgSettings.currency}
                    onChange={(e) => setOrgSettings({ ...orgSettings, currency: e.target.value })}
                  >
                    <option value="INR (₹)">INR - Indian Rupee (₹)</option>
                    <option value="USD ($)">USD - US Dollar ($)</option>
                    <option value="EUR (€)">EUR - Euro (€)</option>
                    <option value="GBP (£)">GBP - British Pound (£)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Corporate Timezone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orgSettings.timezone}
                    onChange={(e) => setOrgSettings({ ...orgSettings, timezone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Organization')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save Organization Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Attendance & Shifts */}
          {activeTab === 'attendance' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Attendance Rules & Shift Parameters
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Set tolerances, biometric sync frequencies, and monthly lock schedule.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Standard Full-Day Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={attendanceSettings.standardWorkHours}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, standardWorkHours: parseFloat(e.target.value) })}
                  />
                  <small className="text-muted text-xs">Standard duration required for full day presence</small>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Late Punch Grace Period (Mins)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={attendanceSettings.gracePeriodMins}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, gracePeriodMins: parseInt(e.target.value) })}
                  />
                  <small className="text-muted text-xs">Arrival after grace period is marked as Late Arrival</small>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Half-Day Minimum Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={attendanceSettings.halfDayThresholdHours}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, halfDayThresholdHours: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Biometric Sync Frequency (Mins)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={attendanceSettings.autoPunchSyncIntervalMins}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, autoPunchSyncIntervalMins: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Monthly Attendance Lock Day</label>
                  <select
                    className="form-control"
                    value={attendanceSettings.monthlyLockDay}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, monthlyLockDay: parseInt(e.target.value) })}
                  >
                    <option value={20}>20th of every month</option>
                    <option value={25}>25th of every month (Recommended)</option>
                    <option value={28}>28th of every month</option>
                    <option value={30}>Last day of month</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Minimum OT Qualifying Threshold (Mins)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={attendanceSettings.overtimeMinimumMins}
                    onChange={(e) => setAttendanceSettings({ ...attendanceSettings, overtimeMinimumMins: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Attendance & Shift')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save Attendance Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Security & Access */}
          {activeTab === 'security' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Security, MFA & Access Controls
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Enterprise authentication standards and network security.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem' }}>Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-xs text-muted">Require OTP/Authenticator app for all administrative & HR roles</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.enforceMfa}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, enforceMfa: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>SSO / SAML 2.0 Identity Provider</label>
                  <input
                    type="text"
                    className="form-control"
                    value={securitySettings.ssoProvider}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, ssoProvider: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Session Inactivity Timeout (Mins)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={securitySettings.sessionTimeoutMins}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMins: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Minimum Password Length</label>
                    <input
                      type="number"
                      className="form-control"
                      value={securitySettings.minPasswordLength}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Corporate IP Allowlist (CIDR notation)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={securitySettings.ipAllowlist}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, ipAllowlist: e.target.value })}
                  />
                  <small className="text-muted text-xs">Only requests from listed subnet IP addresses can access plant admin modules</small>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Security')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save Security Policies</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Notifications & Alerts */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Notification Routing & Alerts
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Configure channels, SLA escalation triggers, and dispatch rules.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem' }}>Daily Morning Attendance Digest</div>
                    <div className="text-xs text-muted">Email plant managers an attendance snapshot every morning at 09:30 AM</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailDailyDigest}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDailyDigest: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem' }}>SMS / WhatsApp Shift Reminders</div>
                    <div className="text-xs text-muted">Dispatch automated SMS alerts to operators for emergency shift rescheduling</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsShiftAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsShiftAlerts: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>SLA Breach Escalation Threshold (Hours)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={notificationSettings.slaEscalationHours}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, slaEscalationHours: parseInt(e.target.value) })}
                  />
                  <small className="text-muted text-xs">Unapproved leave/overtime requests pending beyond this duration will be escalated automatically</small>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Notification')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. GxP & Audit Compliance */}
          {activeTab === 'compliance' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  GxP & 21 CFR Part 11 Regulatory Compliance
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pharma regulatory audit compliance, electronic signatures, and data integrity modes.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem', color: 'var(--brand-600)' }}>
                      21 CFR Part 11 Electronic Signature Mode
                    </div>
                    <div className="text-xs text-muted">
                      Requires password re-authentication and formal reason selection prior to approving shift edits or leave grants.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceSettings.gxp21CfrPart11}
                    onChange={(e) => setComplianceSettings({ ...complianceSettings, gxp21CfrPart11: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '0.9rem' }}>Mandatory Audit Justification</div>
                    <div className="text-xs text-muted">Enforce text reason prompt for all roster changes and manual punches</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceSettings.mandatoryAuditReason}
                    onChange={(e) => setComplianceSettings({ ...complianceSettings, mandatoryAuditReason: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Immutable Audit Trail Retention (Years)</label>
                  <select
                    className="form-control"
                    value={complianceSettings.logRetentionYears}
                    onChange={(e) => setComplianceSettings({ ...complianceSettings, logRetentionYears: parseInt(e.target.value) })}
                  >
                    <option value={5}>5 Years (Standard)</option>
                    <option value={7}>7 Years (Pharma Regulatory Recommended)</option>
                    <option value={10}>10 Years (Extended Clinical Audit)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Compliance')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save GxP Compliance Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. Appearance & Locale */}
          {activeTab === 'appearance' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Appearance & Localization Preferences
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  User interface density, date formats, and layout customization.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Interface Theme</label>
                  <select
                    className="form-control"
                    value={appearanceSettings.theme}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                  >
                    <option value="system">Follow System / Auto</option>
                    <option value="light">Light Clean Mode</option>
                    <option value="dark">Dark High-Contrast Mode</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Date Display Format</label>
                  <select
                    className="form-control"
                    value={appearanceSettings.dateFormat}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, dateFormat: e.target.value })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/07/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                    <option value="DD MMM YYYY">DD MMM YYYY (e.g. 20 Jul 2026)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Time Display Format</label>
                  <select
                    className="form-control"
                    value={appearanceSettings.timeFormat}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timeFormat: e.target.value })}
                  >
                    <option value="12h">12-Hour (09:30 AM / 06:00 PM)</option>
                    <option value="24h">24-Hour Military (09:30 / 18:00)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => handleSave('Appearance')}>
                  <IconDeviceFloppy size={18} />
                  <span>Save Appearance Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
