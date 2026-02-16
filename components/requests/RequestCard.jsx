'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function RequestCard({ request, type }) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (status) => {
      const response = await axios.put(`/api/requests/${request.id}`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['incoming-requests'])
      toast.success('Request updated')
    },
    onError: () => {
      toast.error('Failed to update request')
    },
  })

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar 
            src={type === 'incoming' ? request.requester?.profilePicture : request.task?.user?.profilePicture} 
            alt={type === 'incoming' ? request.requester?.firstName : request.task?.user?.firstName}
            size="lg"
          />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {type === 'incoming' ? (
                `${request.requester?.firstName} ${request.requester?.lastName}`
              ) : (
                request.task?.title
              )}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {type === 'incoming' ? `Request for: ${request.task?.title}` : request.task?.description}
            </p>
          </div>
        </div>
        <Badge variant={request.status === 'accepted' ? 'success' : request.status === 'rejected' ? 'danger' : 'warning'}>
          {request.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {request.task?.location}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(request.task?.startTime), 'MMM dd, yyyy')}
        </div>
      </div>

      {type === 'incoming' && request.status === 'pending' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => updateMutation.mutate('accepted')}
            loading={updateMutation.isLoading}
          >
            Accept
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={() => updateMutation.mutate('rejected')}
            loading={updateMutation.isLoading}
          >
            Reject
          </Button>
        </div>
      )}
    </Card>
  )
}
