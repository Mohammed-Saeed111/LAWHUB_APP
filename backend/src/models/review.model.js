import mongoose from 'mongoose';
const { Schema } = mongoose;

/** A client review attached to a lawyer profile (Screen 4). */
const reviewSchema = new Schema({
  lawyer: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true, index: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, default: '' },
  // Phase F — Admin Console fields
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
  status: { type: String, enum: ['published', 'disputed', 'removed'], default: 'published' },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
