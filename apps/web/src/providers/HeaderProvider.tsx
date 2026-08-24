'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  title: string;
  description: string;
  setHeader: (title: string, description?: string) => void;
  headerContent: ReactNode;
  setHeaderContent: (content: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);

  const setHeader = (newTitle: string, newDescription?: string) => {
    setTitle(newTitle);
    setDescription(newDescription || '');
  };

  return (
    <HeaderContext.Provider value={{ title, description, setHeader, headerContent, setHeaderContent }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}

