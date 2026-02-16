import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Request from '@/models/Request'
import Task from '@/models/Task'
import Notification from '@/models/Notification'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectToDatabase()

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'incoming'

  let query = {}
  if (type === 'incoming') {
    const tasks = await Task.find({ user: session.user.id }).select('_id')
    const taskIds = tasks.map((t) => t._id)
    query.task = { $in: taskIds }
  } else {
    query.requester = session.user.id
  }

  const requests = await Request.find(query)
    .populate('task')
    .populate('requester', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })

  const data = requests.map((r) => ({
    id: r._id.toString(),
    status: r.status,
    task: r.task,
    requester: r.requester,
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
    const { taskId } = await request.json()

    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    const existing = await Request.findOne({
      task: taskId,
      requester: session.user.id,
    })

    if (existing) {
      return NextResponse.json({ message: 'Request already sent' }, { status: 400 })
    }

    const requestDoc = await Request.create({
      task: taskId,
      requester: session.user.id,
      status: 'pending',
    })

    await Notification.create({
      user: task.user,
      body: 'You have a new request for your task: ' + task.title,
    })

    return NextResponse.json({ id: requestDoc._id.toString() }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
