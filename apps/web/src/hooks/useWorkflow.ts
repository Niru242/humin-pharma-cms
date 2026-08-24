'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMyTasks(filters?: { status?: string; page?: number }) {
  return useQuery({ queryKey: ['workflow-tasks', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.status) p.set('status', filters.status); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/workflow/tasks?${p}`); return data; } });
}
export function useTaskCounts() { return useQuery({ queryKey: ['workflow-tasks', 'count'], queryFn: async () => { const { data } = await api.get('/workflow/tasks/count'); return data; }, refetchInterval: 60000 }); }
export function useActOnTask() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ taskId, ...body }: { taskId: string; action: string; comment?: string }) => { const { data } = await api.post(`/workflow/tasks/${taskId}/act`, body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['workflow-tasks'] }) }); }
export function useAllowedActions(entityType?: string, entityId?: string) { return useQuery({ queryKey: ['workflow-actions', entityType, entityId], queryFn: async () => { const { data } = await api.get(`/workflow/actions/${entityType}/${entityId}`); return data.allowedActions as string[]; }, enabled: !!entityType && !!entityId }); }
