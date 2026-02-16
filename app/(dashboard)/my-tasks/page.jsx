'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import TaskCard from '@/components/tasks/TaskCard'
import Button from '@/components/ui/Button'
import { Plus, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function MyTasksPage() {
  const { data: session } = useSession()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      const response = await axios.get('/api/tasks?userId=' + session?.user?.id)
      return response.data
    },
    enabled: !!session?.user?.id,
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage all your created tasks
          </p>
        </div>
        <Link href="/add-task">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : tasks?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} isOwner />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tasks yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first task to get started</p>
          <Link href="/add-task">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
