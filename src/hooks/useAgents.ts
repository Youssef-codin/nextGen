import { useQuery } from '@tanstack/react-query'
import { getPublishedAgents } from '@/src/api/agents'

export function useAgents() {
  return useQuery({
    queryKey: ['agents', 'published'],
    queryFn: getPublishedAgents,
  })
}
