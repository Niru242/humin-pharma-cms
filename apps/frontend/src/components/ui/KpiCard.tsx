'use client';

import React, { useState } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  theme?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  subtitle?: React.ReactNode;
  trend?: {
    value: number; // e.g., 12.5 for +12.5%
    label?: string; // e.g., "vs last month"
    isReverse?: boolean; // if true, positive is error and negative is success
  };
  sparklineData?: number[];
  sparklineLabels?: string[];
}

function SvgSparkline({ data, labels, color, height = 45 }: { data: number[]; labels?: string[]; color: string; height?: number }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 6;
  const width = 240;
  const h = height;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = h - paddingY - ((val - min) / range) * (h - paddingY * 2);
    return { x, y, val, label: labels?.[i] ?? `Day ${i + 1}` };
  });

  // Build smooth bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${width} ${h} L 0 ${h} Z`;
  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, '')}-${data.length}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px`, overflow: 'hidden' }}>
      <svg
        viewBox={`0 0 ${width} ${h}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hoverIndex !== null && points[hoverIndex] && (
          <circle
            cx={points[hoverIndex].x}
            cy={points[hoverIndex].y}
            r="4.5"
            fill={color}
            stroke="#ffffff"
            strokeWidth="2"
          />
        )}
      </svg>
      {/* Interactive hover overlays */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {points.map((p, idx) => (
          <div
            key={idx}
            style={{ flex: 1, height: '100%', cursor: 'crosshair' }}
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}
      </div>
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '8px',
            background: 'var(--bg-card, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--text-main, #0f172a)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            pointerEvents: 'none',
          }}
        >
          {points[hoverIndex].label}: {points[hoverIndex].val}
        </div>
      )}
    </div>
  );
}

export function KpiCard({
  title,
  value,
  icon,
  theme = 'default',
  subtitle,
  trend,
  sparklineData,
  sparklineLabels,
}: KpiCardProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case 'primary':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-500)', line: '#3b82f6', border: '1px solid var(--border-color)' };
      case 'success':
        return { bg: 'var(--success-bg, #ecfdf5)', color: 'var(--success, #10b981)', line: '#10b981', border: '1px solid var(--border-color)' };
      case 'warning':
        return { bg: 'var(--warning-bg, #fffbeb)', color: 'var(--warning, #f59e0b)', line: '#f59e0b', border: '1px solid var(--border-color)' };
      case 'danger':
        return { bg: 'var(--error-bg, #fef2f2)', color: 'var(--error, #ef4444)', line: '#ef4444', border: '1px solid var(--border-color)' };
      case 'info':
        return { bg: 'var(--info-bg, #f0f9ff)', color: 'var(--info, #0ea5e9)', line: '#0ea5e9', border: '1px solid var(--border-color)' };
      default:
        return { bg: 'rgba(15, 23, 42, 0.05)', color: 'var(--text-muted)', line: '#94a3b8', border: '1px solid var(--border-color)' };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      className="card hover-lift"
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: themeStyles.border,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-card, #ffffff)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        padding: 0,
      }}
    >
      <div style={{ padding: '1rem 1.15rem', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div
            className="text-muted font-semibold"
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: themeStyles.bg,
              color: themeStyles.color,
              display: 'flex',
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 22 }) : icon}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: 'auto' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{subtitle}</span>}
        </div>

        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.725rem', fontWeight: 600, marginTop: '0.4rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                color:
                  trend.value >= 0
                    ? trend.isReverse
                      ? 'var(--error, #ef4444)'
                      : 'var(--success, #10b981)'
                    : trend.isReverse
                    ? 'var(--success, #10b981)'
                    : 'var(--error, #ef4444)',
              }}
            >
              {trend.value >= 0 ? <IconTrendingUp size={13} style={{ marginRight: '2px' }} /> : <IconTrendingDown size={13} style={{ marginRight: '2px' }} />}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && <span className="text-muted" style={{ fontWeight: 500, fontSize: '0.675rem' }}>{trend.label}</span>}
          </div>
        )}
      </div>

      {sparklineData && (
        <div style={{ width: '100%', height: '42px', marginTop: '-4px', zIndex: 0 }}>
          <SvgSparkline data={sparklineData} labels={sparklineLabels} color={themeStyles.line} height={42} />
        </div>
      )}
    </div>
  );
}
