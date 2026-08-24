'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useEmployees(filters?: { search?: string; departmentId?: string; status?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (filters?.search) p.set('search', filters.search);
      if (filters?.departmentId) p.set('departmentId', filters.departmentId);
      if (filters?.status) p.set('status', filters.status);
      if (filters?.page) p.set('page', String(filters.page));
      if (filters?.pageSize) p.set('pageSize', String(filters.pageSize));
      const { data } = await api.get(`/organization/employees?${p}`);
      return data;
    },
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({ queryKey: ['employee', id], queryFn: async () => { const { data } = await api.get(`/organization/employees/${id}`); return data; }, enabled: !!id });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (body: any) => { const { data } = await api.post('/organization/employees', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }) });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, ...body }: any) => { const { data } = await api.put(`/organization/employees/${id}`, body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }) });
}
