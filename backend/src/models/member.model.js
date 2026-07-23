import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  name: { type: String, required: true }, role: String, seed: String,
  cases: { type: Number, default: 0 }, permission: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  online: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Member', s);
