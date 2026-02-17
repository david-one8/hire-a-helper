'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function TaskCard({ task, showRequestButton, isOwner }) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const requestMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/requests', { taskId: task.id })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      toast.success('Request sent successfully')
    },
    onError: () => {
      toast.error('Failed to send request')
    },
  })

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      {task.picture && (
        <Image 
          src={task.picture} 
          alt={task.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
          {task.title}
        </h3>
        <Badge variant={task.status === 'open' ? 'success' : 'default'}>
          {task.status}
        </Badge>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4 mr-2" />
          {task.location}
        </div>
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(task.startTime), 'MMM dd, yyyy')}
        </div>
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4 mr-2" />
          {format(new Date(task.startTime), 'hh:mm a')}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Avatar src={task.user?.profilePicture} alt={task.user?.firstName} size="sm" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {task.user?.firstName} {task.user?.lastName}
          </span>
        </div>

        {showRequestButton && (
          <Button 
            size="sm" 
            onClick={() => requestMutation.mutate()}
            loading={requestMutation.isLoading}
          >
            Request
          </Button>
        )}

        {isOwner && (
          <Button size="sm" variant="outline">
            Edit
          </Button>
        )}
      </div>
    </Card>
  )
}
