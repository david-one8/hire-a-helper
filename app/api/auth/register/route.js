import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { hash } from 'bcryptjs'
import crypto from 'crypto'
import { sendOtpEmail } from '@/services/email'

export async function POST(request) {
  try {
    const { firstName, lastName, email, phoneNumber, password } = await request.json()

    await connectToDatabase()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 })
    }

    const hashed = await hash(password, 10)
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashed,
      otp,
      otpExpiresAt,
      emailVerified: false,
    })

    await sendOtpEmail({ to: email, otp })

    return NextResponse.json({ id: user._id, email: user.email }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
