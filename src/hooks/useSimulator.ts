import { useMutation } from '@tanstack/react-query'
import { runBacktest } from '@/src/api/simulator'

export function useSimulator() {
  return useMutation({
    mutationFn: runBacktest,
  })
}
