import React from 'react';

interface StatusBadgeProps {
  status: string;
  customLabel?: React.ReactNode;
}

export function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  let badgeClass = 'badge-primary'; // Default

  const normalized = status.toLowerCase();

  // Success variants
  if (
    normalized.includes('success') ||
    normalized.includes('approved') ||
    normalized.includes('active') ||
    normalized.includes('confirmed') ||
    normalized.includes('resolved')
  ) {
    badgeClass = 'badge-success';
  }
  // Warning variants
  else if (
    normalized.includes('pending') ||
    normalized.includes('warning') ||
    normalized.includes('overdue') ||
    normalized.includes('late') ||
    normalized.includes('draft')
  ) {
    badgeClass = 'badge-warning';
  }
  // Danger variants
  else if (
    normalized.includes('failed') ||
    normalized.includes('danger') ||
    normalized.includes('rejected') ||
    normalized.includes('missing') ||
    normalized.includes('absent') ||
    normalized.includes('error')
  ) {
    badgeClass = 'badge-danger';
  }
  // Info variants
  else if (
    normalized.includes('info') ||
    normalized.includes('calculated')
  ) {
    badgeClass = 'badge-info'; // Info might not exist in CSS, let's stick to primary if missing, or add outline
  }

  // Fallback to outline if unknown
  if (badgeClass === 'badge-primary' && !normalized.includes('completed')) {
    // Return standard outline for standard text
    return <span className="badge badge-outline">{customLabel ?? status}</span>;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {customLabel ?? status}
    </span>
  );
}
