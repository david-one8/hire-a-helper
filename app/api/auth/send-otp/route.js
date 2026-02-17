import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { hash } from 'bcryptjs'
import crypto from 'crypto'
import { sendOtpEmail } from '@/services/email'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const { limited, retryAfterMs } = rateLimit(`send-otp:${ip}`, 3, 15 * 60 * 1000)
    if (limited) {
      return NextResponse.json(
        { message: `Too many requests. Try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
        { status: 429 }
      )
    }

    const { email } = await request.json()
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const hashedOtp = await hash(otp, 6)
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = hashedOtp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    await sendOtpEmail({ to: email, otp })

    return NextResponse.json({ message: 'OTP sent' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
