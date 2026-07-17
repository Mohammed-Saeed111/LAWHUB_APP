import mongoose from 'mongoose';
const { Schema } = mongoose;

/** A booked consultation created by the multi-step booking flow (Screens 6 & 7). */
const consultationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, index: true },
  lawyer: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  type: { type: String, enum: ['video', 'phone', 'in_person'], default: 'video' },
  scheduledAt: { type: Date, required: true },
  slot: { type: String },                     // human-readable time label
  subject: { type: String, required: true },  // brief case description
  documents: [{ name: String, sizeKb: Number }],
  price: { type: Number, default: 0 },
  // Escrow-backed payment status (Screen 7).
  payment: {
    method: { type: String, enum: ['card', 'wallet', 'none'], default: 'none' },
    status: { type: String, enum: ['unpaid', 'in_escrow', 'released', 'refunded'], default: 'unpaid' },
  },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
}, { timestamps: true });

export default mongoose.model('Consultation', consultationSchema);
