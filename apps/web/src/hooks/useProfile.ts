'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProfile() { return useQuery({ queryKey: ['profile'], queryFn: async () => { const { data } = await api.get('/profile'); return data; } }); }
export function useUpdateProfile() { const qc = useQueryClient(); return useMutation({ mutationFn: async (body: { firstName?: string; lastName?: string }) => { const { data } = await api.put('/profile', body); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }) }); }
