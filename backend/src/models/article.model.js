import mongoose from 'mongoose';
const { Schema } = mongoose;

/** "أحدث الاستشارات القانونية" content cards on the home page (Screen 1). */
const articleSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  readMins: { type: Number, default: 5 },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);
