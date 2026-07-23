import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  title: { type: String, required: true }, category: { type: String, index: true }, instructor: String,
  duration: String, thumb: String, description: String, isPro: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }, progress: { type: Number, default: 0 }, views: { type: Number, default: 0 },
  // Phase F — Admin CMS fields
  visible: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Video', s);
