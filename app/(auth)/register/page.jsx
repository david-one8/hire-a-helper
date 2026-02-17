'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      })

      toast.success('Registration successful! Please verify your email.')
      router.push('/verify-otp?email=' + encodeURIComponent(formData.email))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Join HireHelper today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div className="flex items-start">
          <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500" required />
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
          </span>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
