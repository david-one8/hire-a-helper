'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import RequestCard from '@/components/requests/RequestCard'
import { Inbox } from 'lucide-react'

export default function RequestsPage() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['incoming-requests'],
    queryFn: async () => {
      const response = await axios.get('/api/requests?type=incoming')
      return response.data
    },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Incoming Requests</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Requests received for your tasks
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : requests?.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} type="incoming" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No requests yet</h3>
          <p className="text-slate-600 dark:text-slate-400">Requests for your tasks will appear here</p>
        </div>
      )}
    </div>
  )
}
