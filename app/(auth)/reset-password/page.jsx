'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await axios.post('/api/auth/reset-password', {
        email,
        otp: otpCode,
        password,
      })

      toast.success('Password reset successful! Please sign in.')
      router.push('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)

    try {
      await axios.post('/api/auth/forgot-password', { email })
      toast.success('New reset code sent to your email')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter the 6-digit code sent to <span className="font-medium text-slate-900 dark:text-white">{email}</span> and your new password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reset Code
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 dark:border-slate-700 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all"
              />
            ))}
          </div>
        </div>

        <Input
          label="New Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </p>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}
