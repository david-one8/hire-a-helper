import mongoose, { Schema } from 'mongoose'

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)
