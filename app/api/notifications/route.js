import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Notification from '@/models/Notification'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectToDatabase()

  const notifications = await Notification.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .limit(30)

  const data = notifications.map((n) => ({
    id: n._id.toString(),
    body: n.body,
    read: n.read,
    createdAt: n.createdAt,
  }))

  return NextResponse.json(data, { status: 200 })
}
