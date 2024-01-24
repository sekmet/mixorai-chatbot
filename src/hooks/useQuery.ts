import fetchChains from '@/pages/api/chains'
import { useQuery } from '@tanstack/react-query'

export function useChains() {
  return useQuery({
    queryKey: ['chains'],
    queryFn: () => fetchChains(),
  })
}
