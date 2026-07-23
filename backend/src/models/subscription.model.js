import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Phase F — Platform subscriptions managed through the Admin Console. */
export default mongoose.model('Subscription', new Schema({
  account: String,
  seed: String,
  plan: { type: String, enum: ['Pro', 'Elite', 'Firm'], default: 'Pro' },
  amount: Number,
  cycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  status: { type: String, enum: ['active', 'trial', 'past_due', 'cancelled'], default: 'active' },
  renewsAt: String,
}, { timestamps: true }));
