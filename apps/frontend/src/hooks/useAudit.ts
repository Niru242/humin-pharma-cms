'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAuditEvents(filters?: { actorEmail?: string; module?: string; action?: string; dateFrom?: string; dateTo?: string; search?: string; page?: number }) {
  return useQuery({ queryKey: ['audit-events', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.actorEmail) p.set('actorEmail', filters.actorEmail); if (filters?.module) p.set('module', filters.module); if (filters?.action) p.set('action', filters.action); if (filters?.dateFrom) p.set('dateFrom', filters.dateFrom); if (filters?.dateTo) p.set('dateTo', filters.dateTo); if (filters?.search) p.set('search', filters.search); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/audit/events?${p}`); return data; } });
}
export function useAuditFilters() {
  const actions = useQuery({ queryKey: ['audit-filters-actions'], queryFn: async () => { const { data } = await api.get('/audit/filters/actions'); return data.actions as string[]; } });
  const modules = useQuery({ queryKey: ['audit-filters-modules'], queryFn: async () => { const { data } = await api.get('/audit/filters/modules'); return data.modules as string[]; } });
  return { actions: actions.data || [], modules: modules.data || [] };
}
