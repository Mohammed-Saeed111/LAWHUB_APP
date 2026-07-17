import mongoose from 'mongoose';
const { Schema } = mongoose;

const timelineItem = new Schema({
  date: String, title: String, done: { type: Boolean, default: false },
}, { _id: false });

/** A legal case/matter tracked by the client (Screen 8, empty state = Screen 9). */
const caseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, index: true },
  title: { type: String, required: true },
  ref: { type: String },
  lawyer: { type: Schema.Types.ObjectId, ref: 'Lawyer' },
  lawyerName: { type: String },
  category: { type: String },
  status: { type: String, enum: ['in_progress', 'waiting', 'completed'], default: 'in_progress', index: true },
  nextHearing: { type: String, default: null },
  timeline: [timelineItem],
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);
