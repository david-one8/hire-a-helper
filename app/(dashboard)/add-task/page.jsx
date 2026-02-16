'use client'

import TaskForm from '@/components/tasks/TaskForm'

export default function AddTaskPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Task</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Fill in the details to post your task
        </p>
      </div>

      <TaskForm />
    </div>
  )
}
