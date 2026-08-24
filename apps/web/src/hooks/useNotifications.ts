'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useNotifications(filters?: { isRead?: boolean; page?: number }) {
  return useQuery({ queryKey: ['notifications', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.isRead !== undefined) p.set('isRead', String(filters.isRead)); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/notifications?${p}`); return data; } });
}
export function useUnreadCount() { return useQuery({ queryKey: ['notifications', 'unread'], queryFn: async () => { const { data } = await api.get('/notifications/unread-count'); return data.count as number; }, refetchInterval: 30000 }); }
export function useMarkAsRead() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { await api.post(`/notifications/${id}/read`); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) }); }
export function useMarkAllAsRead() { const qc = useQueryClient(); return useMutation({ mutationFn: async () => { await api.post('/notifications/read-all'); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) }); }
