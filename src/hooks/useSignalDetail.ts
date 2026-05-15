import { useQuery } from '@tanstack/react-query'
import { getSignalByTicker } from '@/src/api/signals'

export function useSignalDetail(ticker: string) {
  return useQuery({
    queryKey: ['signal', ticker],
    queryFn: () => getSignalByTicker(ticker),
    enabled: !!ticker,
  })
}
