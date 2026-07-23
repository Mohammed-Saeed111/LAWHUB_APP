import mongoose from 'mongoose';
const { Schema } = mongoose;
export const Faq = mongoose.model('Faq', new Schema({ category: String, question: String, answer: String }, { timestamps: true }));
export const Ticket = mongoose.model('Ticket', new Schema({
  user: { type: Schema.Types.ObjectId, index: true }, ref: String, subject: String, category: String, message: String,
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
}, { timestamps: true }));
