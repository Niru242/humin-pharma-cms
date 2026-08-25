'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDepartments(plantId?: string, search?: string) {
  return useQuery({ queryKey: ['departments', plantId, search], queryFn: async () => { const p = new URLSearchParams(); if (plantId) p.set('plantId', plantId); if (search) p.set('search', search); const { data } = await api.get(`/organization/departments?${p}`); return data; } });
}
export function useCreateDepartment() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/organization/departments', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }) }); }
export function useUpdateDepartment() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...rest }: any) => { const { data } = await api.put(`/organization/departments/${id}`, rest); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }) }); }
export function useDeleteDepartment() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { await api.delete(`/organization/departments/${id}`); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }) }); }

export function useGrades() { return useQuery({ queryKey: ['grades'], queryFn: async () => { const { data } = await api.get('/organization/grades'); return data; } }); }
export function useCreateGrade() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/organization/grades', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }) }); }
export function useUpdateGrade() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, ...rest }: any) => { const { data } = await api.put(`/organization/grades/${id}`, rest); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }) }); }
export function useDeleteGrade() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { await api.delete(`/organization/grades/${id}`); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['grades'] }) }); }

export function usePlants(companyId?: string) { return useQuery({ queryKey: ['plants', companyId], queryFn: async () => { const { data } = await api.get(`/organization/plants${companyId ? '?companyId=' + companyId : ''}`); return data; } }); }
export function useCreatePlant() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/organization/plants', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['plants'] }) }); }

export function useCompanies() { return useQuery({ queryKey: ['companies'], queryFn: async () => { const { data } = await api.get('/organization/companies'); return data; } }); }
export function useCreateCompany() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/organization/companies', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }) }); }

export function useDesignations() { return useQuery({ queryKey: ['designations'], queryFn: async () => { const { data } = await api.get('/organization/designations'); return data; } }); }
