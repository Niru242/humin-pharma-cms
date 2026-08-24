'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useShifts() { return useQuery({ queryKey: ['shifts'], queryFn: async () => { const { data } = await api.get('/time/shifts'); return data; } }); }
export function useCreateShift() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/time/shifts', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['shifts'] }) }); }
export function useUpdateShift() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...rest }: any) => { const { data } = await api.put(`/time/shifts/${id}`, rest); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['shifts'] }) }); }

export function useRawPunches(filters?: { employeeCode?: string; dateFrom?: string; dateTo?: string; page?: number }) {
  return useQuery({ queryKey: ['raw-punches', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.employeeCode) p.set('employeeCode', filters.employeeCode); if (filters?.dateFrom) p.set('dateFrom', filters.dateFrom); if (filters?.dateTo) p.set('dateTo', filters.dateTo); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/time/raw-punches?${p}`); return data; } });
}
export function useImportPunches() { const qc = useQueryClient(); return useMutation({ mutationFn: async (punches: any[]) => { const { data } = await api.post('/time/punch-import', { punches }); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['raw-punches'] }) }); }

export function useDailyAttendance(filters?: { employeeId?: string; month?: number; year?: number; status?: string; page?: number }) {
  return useQuery({ queryKey: ['daily-attendance', filters], queryFn: async () => { const p = new URLSearchParams(); if (filters?.employeeId) p.set('employeeId', filters.employeeId); if (filters?.month) p.set('month', String(filters.month)); if (filters?.year) p.set('year', String(filters.year)); if (filters?.status) p.set('status', filters.status); if (filters?.page) p.set('page', String(filters.page)); const { data } = await api.get(`/time/attendance?${p}`); return data; } });
}
export function useMonthlySummary(employeeId?: string, month?: number, year?: number) {
  return useQuery({ queryKey: ['attendance-summary', employeeId, month, year], queryFn: async () => { const { data } = await api.get(`/time/attendance/summary/${employeeId}?month=${month}&year=${year}`); return data; }, enabled: !!employeeId && !!month && !!year });
}

export function useAttendancePeriods(plantId?: string) { return useQuery({ queryKey: ['attendance-periods', plantId], queryFn: async () => { const { data } = await api.get(`/time/periods${plantId ? '?plantId=' + plantId : ''}`); return data; } }); }
export function useLockPeriod() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: { plantId: string; month: number; year: number }) => { const { data } = await api.post('/time/periods/lock', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance-periods'] }) }); }

export function useRoster(employeeId?: string, month?: number, year?: number) {
  return useQuery({ queryKey: ['roster', employeeId, month, year], queryFn: async () => { const { data } = await api.get(`/time/roster/${employeeId}?month=${month}&year=${year}`); return data; }, enabled: !!employeeId && !!month && !!year });
}
