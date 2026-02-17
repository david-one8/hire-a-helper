'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }

      // Fetch the session to check email verification status
      const session = await getSession()

      if (session?.user?.emailVerified === false) {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`)
      } else {
        router.push('/feed')
        toast.success('Welcome back!')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to continue to HireHelper</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </div>
  )
}
