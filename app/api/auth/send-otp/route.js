import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import crypto from 'crypto'
import { sendOtpEmail } from '@/services/email'

export async function POST(request) {
  try {
    const { email } = await request.json()
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    await sendOtpEmail({ to: email, otp })

    return NextResponse.json({ message: 'OTP sent' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
