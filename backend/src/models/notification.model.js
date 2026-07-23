import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  user: { type: Schema.Types.ObjectId, index: true },
  type: { type: String, enum: ['case', 'payment', 'reminder', 'system'], default: 'system' },
  title: String, body: String, read: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Notification', s);
