import mongoose from 'mongoose';
const { Schema } = mongoose;
const s = new Schema({
  ref: { type: String, index: true }, user: { type: Schema.Types.ObjectId, index: true },
  template: { type: Schema.Types.ObjectId, ref: 'ContractTemplate' }, templateTitle: String,
  amount: { type: Number, default: 0 }, currency: { type: String, default: 'ج.م' },
  method: { type: String, enum: ['card', 'wallet'], default: 'card' },
  status: { type: String, enum: ['pending', 'paid', 'signed', 'refunded'], default: 'pending' },
  filledData: { type: Object, default: {} },
  signature: { type: Object, default: null }, // { type, value, hash, blockchainTx, signedAt }
}, { timestamps: true });
export default mongoose.model('Transaction', s);
