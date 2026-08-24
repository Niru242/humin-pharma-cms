'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGlobalSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => { const { data } = await api.get(`/search?q=${encodeURIComponent(query)}${limit ? '&limit=' + limit : ''}`); return data; },
    enabled: query.length >= 2,
  });
}
