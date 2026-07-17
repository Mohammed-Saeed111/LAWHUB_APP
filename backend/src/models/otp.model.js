import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    purpose: { type: String, enum: ['verify', 'reset', 'mfa'], required: true },
    channel: { type: String, enum: ['email', 'phone'], default: 'email' },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.methods.compareCode = function (c) { return bcrypt.compare(c, this.codeHash); };
otpSchema.statics.hashCode = async function (c) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(c, salt);
};

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
