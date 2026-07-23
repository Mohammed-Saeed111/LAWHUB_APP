import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Phase C — تقييمات المحامي في مساحة العمل (قابلة للاعتراض). */
const lawyerReviewSchema = new Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date:   { type: String, default: '' },
  text:   { type: String, default: '' },
  status: { type: String, enum: ['published', 'disputed', 'hidden'], default: 'published' },
}, { timestamps: true });

export default mongoose.model('LawyerReview', lawyerReviewSchema);
