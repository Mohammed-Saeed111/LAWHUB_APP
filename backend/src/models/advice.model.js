import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  user: { type: Schema.Types.ObjectId, index: true }, description: String,
  category: String, confidence: Number, urgency: String,
  recommendedLawyers: [{ name: String, seed: String, specialty: String, rating: Number }],
}, { timestamps: true });
export default mongoose.model('CaseAdvice', s);
