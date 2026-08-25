import React from 'react';
import { IconAlertTriangle, IconCalendarStar, IconCheck, IconRefresh, IconArrowRight } from '@tabler/icons-react';
import './OperationsStrip.css';

interface AttentionItem {
  id: string;
  count: number;
  label: string;
  type: 'critical' | 'warning' | 'normal';
  onClick?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface OperationsStripProps {
  attentionItems: AttentionItem[];
  quickActions: QuickAction[];
  syncStatus: {
    state: 'success' | 'syncing' | 'delayed' | 'offline' | 'warning';
    message: string;
    action?: { label: string; onClick: () => void };
  };
}

export function OperationsStrip({ attentionItems, quickActions, syncStatus }: OperationsStripProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const getThemeVars = (type: AttentionItem['type']) => {
    switch (type) {
      case 'critical':
        return { bg: 'var(--error-bg)', border: 'rgba(239, 68, 68, 0.2)', text: 'var(--error)' };
      case 'warning':
        return { bg: 'var(--warning-bg)', border: 'rgba(245, 158, 11, 0.2)', text: 'var(--warning)' };
      default:
        return { bg: 'var(--success-bg)', border: 'rgba(34, 197, 94, 0.2)', text: 'var(--success)' };
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const onReviewAll = () => {
    // Handle review all action
    console.log('Review all clicked');
  };

  const visibleQuickActions = quickActions.slice(0, 3);

  return (
    <>
      {/* Left: Needs Attention */}
      <div className="ops-attention-section">

        {/* Label */}
        <div className="ops-label-col">
          <div className="ops-dot-wrapper">
            <div className={`ops-dot ${attentionItems.length > 0 ? 'error' : 'success'}`} />
          </div>
          <div className="ops-text-col">
            <span className="ops-title">
              Action Items
            </span>
            <button
              onClick={onReviewAll}
              className="ops-review-btn hover-underline"
            >
              Review All
            </button>
          </div>
        </div>

        {/* Items */}
        {attentionItems.length > 0 && (
          <div className="ops-items-wrapper">
            {attentionItems.map(item => {
              const theme = getThemeVars(item.type);
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.border}`
                  }}
                  className="ops-item-btn hover-lift"
                  title={item.label}
                >
                  <span className="ops-item-count" style={{ color: theme.text }}>
                    {item.count}
                  </span>
                  <span className="ops-item-label">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Center: Quick Actions */}
      <div className="ops-quick-actions">
        {visibleQuickActions.map(action => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="minimal-btn"
            title={action.label}
          >
            {action.icon}
            <span className="btn-text">{action.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
