'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { Upload, X } from 'lucide-react'

export default function TaskForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
  })
  const [picture, setPicture] = useState(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 5242880,
    onDrop: (acceptedFiles) => setPicture(acceptedFiles[0]),
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/tasks', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Task created successfully')
      router.push('/my-tasks')
    },
    onError: () => {
      toast.error('Failed to create task')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({ ...formData, picture })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Help with furniture assembly"
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="Describe the task in detail..."
            required
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., 123 Main St, New York"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <Input
            label="End Time (Optional)"
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Task Picture (Optional)
          </label>
          {picture ? (
            <div className="relative">
              <img 
                src={URL.createObjectURL(picture)} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setPicture(null)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Drop an image here, or click to select
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={createMutation.isLoading}>
            Create Task
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
