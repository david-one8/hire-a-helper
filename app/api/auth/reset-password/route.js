import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { hash, compare } from 'bcryptjs'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const { limited, retryAfterMs } = rateLimit(`reset-pw:${ip}`, 5, 15 * 60 * 1000)
    if (limited) {
      return NextResponse.json(
        { message: `Too many attempts. Try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
        { status: 429 }
      )
    }

    const { email, otp, password } = await request.json()
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!user.resetOtp) {
      return NextResponse.json({ message: 'Invalid reset code' }, { status: 400 })
    }

    if (user.resetOtpExpiresAt < new Date()) {
      return NextResponse.json({ message: 'Reset code expired' }, { status: 400 })
    }

    const isValid = await compare(otp, user.resetOtp)
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid reset code' }, { status: 400 })
    }

    const hashed = await hash(password, 10)

    user.password = hashed
    user.resetOtp = null
    user.resetOtpExpiresAt = null
    await user.save()

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
