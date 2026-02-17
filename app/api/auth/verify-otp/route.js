import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { compare } from 'bcryptjs'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const { limited, retryAfterMs } = rateLimit(`verify-otp:${ip}`, 5, 15 * 60 * 1000)
    if (limited) {
      return NextResponse.json(
        { message: `Too many attempts. Try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
        { status: 429 }
      )
    }

    const { email, otp } = await request.json()
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!user.otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 })
    }

    const isValid = await compare(otp, user.otp)
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    user.emailVerified = true
    user.otp = null
    user.otpExpiresAt = null
    await user.save()

    return NextResponse.json({ message: 'Email verified' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
