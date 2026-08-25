'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// --- Leave Types ---
export function useLeaveTypes() { return useQuery({ queryKey: ['leave-types'], queryFn: async () => { const { data } = await api.get('/leave/types'); return data; } }); }

// --- Leave Balances ---
export function useLeaveBalances(employeeId?: string, year?: number) {
  return useQuery({ queryKey: ['leave-balances', employeeId, year], queryFn: async () => { const { data } = await api.get(`/leave/balances/${employeeId}${year ? '?year=' + year : ''}`); return data; }, enabled: !!employeeId });
}

// --- Leave Requests ---
export function useLeaveRequests(filters?: { employeeId?: string; status?: string; page?: number }) {
  return useQuery({ queryKey: ['leave-requests', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.employeeId) p.set('employeeId', filters.employeeId); if (filters?.status) p.set('status', filters.status); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/leave/requests?${p}`); return data; } });
}
export function useApplyLeave() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/leave/requests', body); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); qc.invalidateQueries({ queryKey: ['leave-balances'] }); } }); }
export function useApproveLeave() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, comment }: { id: string; comment?: string }) => { const { data } = await api.post(`/leave/requests/${id}/approve`, { comment }); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['leave-requests'] }) }); }
export function useRejectLeave() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, comment }: { id: string; comment: string }) => { const { data } = await api.post(`/leave/requests/${id}/reject`, { comment }); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['leave-requests'] }) }); }
export function useCancelLeave() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, reason }: { id: string; reason: string }) => { const { data } = await api.post(`/leave/requests/${id}/cancel`, { reason }); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); qc.invalidateQueries({ queryKey: ['leave-balances'] }); } }); }

// --- Holidays ---
export function useHolidays(year?: number, plantId?: string) {
  return useQuery({ queryKey: ['holidays', year, plantId], queryFn: async () => { const p = new URLSearchParams(); if (year) p.set('year', String(year)); if (plantId) p.set('plantId', plantId); const { data } = await api.get(`/leave/holidays?${p}`); return data; } });
}
export function useCreateHoliday() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/leave/holidays', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] }) }); }
export function useUpdateHoliday() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...rest }: any) => { const { data } = await api.put(`/leave/holidays/${id}`, rest); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] }) }); }
export function useDeleteHoliday() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { await api.delete(`/leave/holidays/${id}`); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] }) }); }

// --- Leave Policies ---
export function useLeavePolicies(filters?: { status?: string }) { return useQuery({ queryKey: ['leave-policies', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.status) p.set('status', filters.status); const { data } = await api.get(`/leave/policies?${p}`); return data; } }); }
