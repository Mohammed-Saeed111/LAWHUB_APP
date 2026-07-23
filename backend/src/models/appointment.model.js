import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  time: String, client: String, type: { type: String, enum: ['فيديو', 'هاتف', 'بالمكتب'], default: 'فيديو' },
  topic: String, status: { type: String, enum: ['confirmed', 'pending'], default: 'confirmed' },
  day: Number, hour: String, // for the weekly calendar grid
}, { timestamps: true });
export default mongoose.model('Appointment', s);
