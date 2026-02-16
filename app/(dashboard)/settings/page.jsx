'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { Camera, Save } from 'lucide-react'
import axios from 'axios'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    email: session?.user?.email || '',
    phoneNumber: session?.user?.phoneNumber || '',
    bio: session?.user?.bio || '',
  })
  const [profilePicture, setProfilePicture] = useState(session?.user?.image || '')

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxSize: 5242880,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => setProfilePicture(reader.result)
      reader.readAsDataURL(file)
    },
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put('/api/auth/update-profile', {
        ...formData,
        profilePicture,
      })

      await update(response.data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your profile and account preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <Avatar src={profilePicture} alt="Profile" size="xl" />
            <div className="flex-1">
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Tell us about yourself..."
            />
          </div>

          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Security</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Password</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Last updated 3 months ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
