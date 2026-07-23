import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  title: { type: String, required: true }, category: String, excerpt: String, body: String,
  readTime: { type: Number, default: 4 }, featured: { type: Boolean, default: false }, image: String, source: String,
}, { timestamps: true });
export default mongoose.model('News', s);
