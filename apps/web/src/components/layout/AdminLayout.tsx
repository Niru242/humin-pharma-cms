'use client';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AdminLayout.css';

import { HeaderProvider, useHeader } from '@/providers/HeaderProvider';

function GlobalTitle() {
  const { title, description } = useHeader();
  
  if (!title) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontFamily: '"Nunito", sans-serif' }}>
        {title}
      </h2>
      {description && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
          {description}
        </p>
      )}
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <HeaderProvider>
      <div className="admin-layout">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
        <div className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="page-content">
            <GlobalTitle />
            {children}
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
}
