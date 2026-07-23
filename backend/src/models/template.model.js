import mongoose from 'mongoose';
const { Schema } = mongoose;
const fieldSchema = new Schema({ key: String, label: String, type: { type: String, default: 'text' }, placeholder: String }, { _id: false });
const s = new Schema({
  title: { type: String, required: true }, category: { type: String, index: true },
  description: String, price: { type: Number, default: 0 }, currency: { type: String, default: 'ج.م' },
  aiVerified: { type: Boolean, default: true }, rating: { type: Number, default: 4.8 }, downloads: { type: Number, default: 0 },
  pages: { type: Number, default: 3 }, icon: { type: String, default: 'FiFileText' },
  fields: [fieldSchema],           // dynamic inputs for the editor (Parties, Effective Date…)
  body: { type: String, default: '' }, // template body with {{placeholders}}
}, { timestamps: true });
export default mongoose.model('ContractTemplate', s);
