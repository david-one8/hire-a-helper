import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Task from '@/models/Task'
import User from '@/models/User'

export async function GET(request) {
  await connectToDatabase()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const location = searchParams.get('location') || ''
  const status = searchParams.get('status') || 'all'
  const userId = searchParams.get('userId')

  const query = {}

  if (userId) {
    query.user = userId
  }

  if (status !== 'all') {
    query.status = status
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' }
  }

  const tasks = await Task.find(query)
    .populate('user', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })

  const data = tasks.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description,
    location: t.location,
    startTime: t.startTime,
    endTime: t.endTime,
    status: t.status,
    picture: t.picture,
    user: t.user,
  }))

  return NextResponse.json(data, { status: 200 })
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const body = await request.json()
    const { title, description, location, startTime, endTime, picture } = body

    const task = await Task.create({
      user: session.user.id,
      title,
      description,
      location,
      startTime,
      endTime: endTime || null,
      picture: picture || null,
    })

    return NextResponse.json({ id: task._id.toString() }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
