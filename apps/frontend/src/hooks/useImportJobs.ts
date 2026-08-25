'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useImportJobs(filters?: { jobType?: string; status?: string; page?: number }) {
  return useQuery({ queryKey: ['import-jobs', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.jobType) p.set('jobType', filters.jobType); if (filters?.status) p.set('status', filters.status); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/import-jobs?${p}`); return data; } });
}
export function useImportJob(id?: string) { return useQuery({ queryKey: ['import-job', id], queryFn: async () => { const { data } = await api.get(`/import-jobs/${id}`); return data; }, enabled: !!id }); }
export function useCancelJob() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { data } = await api.post(`/import-jobs/${id}/cancel`); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['import-jobs'] }) }); }
export function useRetryJob() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { data } = await api.post(`/import-jobs/${id}/retry`); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['import-jobs'] }) }); }
