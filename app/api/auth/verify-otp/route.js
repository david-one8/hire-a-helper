import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP expired' }, { status: 400 })
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
