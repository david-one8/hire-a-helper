import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Request from '@/models/Request'
import Task from '@/models/Task'
import Notification from '@/models/Notification'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const { id } = params
    const { status } = await request.json()

    const reqDoc = await Request.findById(id).populate('task')
    if (!reqDoc) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    if (reqDoc.task.user.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    reqDoc.status = status
    await reqDoc.save()

    await Notification.create({
      user: reqDoc.requester,
      body: `Your request for "${reqDoc.task.title}" was ${status}.`,
    })

    return NextResponse.json({ message: 'Updated' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
