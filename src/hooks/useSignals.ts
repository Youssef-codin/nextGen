import { useQuery } from '@tanstack/react-query'
import { getTopSignals } from '@/src/api/signals'

export function useSignals() {
  return useQuery({
    queryKey: ['signals', 'top'],
    queryFn: getTopSignals,
  })
}
