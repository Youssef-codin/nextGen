import { useQuery } from '@tanstack/react-query'
import { getMarketData } from '@/src/api/market'

export function useMarket(ticker: string) {
  return useQuery({
    queryKey: ['market', ticker],
    queryFn: () => getMarketData(ticker),
    enabled: !!ticker,
  })
}
