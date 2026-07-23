import mongoose from 'mongoose';
const { Schema } = mongoose;
const clause = new Schema({ index: Number, text: String, risk: { type: String, enum: ['critical', 'warning', 'suggested', 'safe'] }, note: String, suggestion: String }, { _id: false });
const s = new Schema({
  user: { type: Schema.Types.ObjectId, index: true }, title: String,
  healthScore: { type: Number, default: 0 }, clauses: [clause],
  summary: { critical: Number, warning: Number, suggested: Number, safe: Number },
}, { timestamps: true });
export default mongoose.model('AnalysisReport', s);
