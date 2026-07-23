import mongoose from 'mongoose';
const { Schema } = mongoose;
/** Single-doc workspace profile: services + membership (per lawyer/office). */
const s = new Schema({
  owner: { type: Schema.Types.ObjectId, index: true },
  specializations: [String], cities: [String],
  services: [{ key: String, label: String, price: Number }],
  membership: { barNumber: String, association: String, issueDate: String, expiryDate: String, daysLeft: Number, documents: [{ name: String, verified: Boolean }] },
  currentPlan: { type: String, default: 'pro' },
}, { timestamps: true });
export default mongoose.model('Profile', s);
