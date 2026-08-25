'use client';
import { useEffect, ReactNode } from 'react';
import { useHeader } from '@/providers/HeaderProvider';

interface SetPageHeaderProps {
  title: string;
  description?: string;
  headerContent?: ReactNode;
}

export function SetPageHeader({ title, description, headerContent }: SetPageHeaderProps) {
  const { setHeader, setHeaderContent } = useHeader();

  useEffect(() => {
    setHeader(title, description);
    if (headerContent !== undefined) {
      setHeaderContent(headerContent);
    }
    return () => {
      setHeader('', '');
      setHeaderContent(null);
    };
  }, [title, description, headerContent, setHeader, setHeaderContent]);

  return null;
}
