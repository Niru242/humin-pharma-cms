'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ECharts with a clean loading skeleton to prevent SSR hanging
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main, #f8fafc)',
        borderRadius: '8px',
        color: 'var(--text-muted, #94a3b8)',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      Loading chart...
    </div>
  ),
});

interface ChartProps {
  option: any;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  theme?: 'light' | 'dark' | string;
}

export function Chart({ option, height = '320px', style, className, theme }: ChartProps) {
  return (
    <div style={{ height, width: '100%', ...style }} className={className}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        theme={theme}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
