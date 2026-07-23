import mongoose from 'mongoose';
const { Schema } = mongoose;

/** "أحدث الاستشارات القانونية" content cards on the home page (Screen 1). */
const articleSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  readMins: { type: Number, default: 5 },
  // Phase F — CMS Admin fields
  excerpt: { type: String, default: '' },
  body: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  readTime: { type: Number, default: 4 },
  author: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);
