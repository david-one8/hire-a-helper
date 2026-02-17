import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    resetOtp: { type: String },
    resetOtpExpiresAt: { type: Date },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
