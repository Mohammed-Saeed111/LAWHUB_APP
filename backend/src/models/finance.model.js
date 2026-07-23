import mongoose from 'mongoose';
const { Schema } = mongoose;
export default mongoose.model('FinanceTxn', new Schema({
  user: { type: Schema.Types.ObjectId, index: true }, ref: String, client: String, service: String,
  amount: Number, currency: { type: String, default: 'ج.م' }, status: { type: String, enum: ['paid', 'pending', 'refunded'], default: 'paid' }, date: String,
}, { timestamps: true }));
