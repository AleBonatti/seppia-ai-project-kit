import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,        // 1 minute — data stays fresh without refetching
      retry: 1,                    // retry failed requests once before erroring
      refetchOnWindowFocus: false, // don't refetch silently on tab switch
    },
    mutations: {
      retry: 0,                    // don't retry mutations
    },
  },
})
