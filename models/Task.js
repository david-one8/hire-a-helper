import mongoose, { Schema } from 'mongoose'

const TaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    picture: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)
