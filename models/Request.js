import mongoose, { Schema } from 'mongoose'

const RequestSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Request || mongoose.model('Request', RequestSchema)
