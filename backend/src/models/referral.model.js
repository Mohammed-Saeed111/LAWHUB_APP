import mongoose from 'mongoose';
const { Schema } = mongoose;
export default mongoose.model('Referral', new Schema({
  name: String, seed: String, referrals: { type: Number, default: 0 }, points: { type: Number, default: 0 },
}, { timestamps: true }));
