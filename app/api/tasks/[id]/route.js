import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Task from '@/models/Task'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const body = await request.json()
    const { id } = params

    const task = await Task.findById(id)
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    if (task.user.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    Object.assign(task, body)
    await task.save()

    return NextResponse.json({ message: 'Updated' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const { id } = params

    const task = await Task.findById(id)
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    if (task.user.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await task.deleteOne()

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
