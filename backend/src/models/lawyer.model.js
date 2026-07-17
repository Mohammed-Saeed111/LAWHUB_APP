import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Public lawyer profile powering Screens 1-5 (home, map, search, profile, favorites). */
const lawyerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, default: '' },
  specialties: [{ type: String, index: true }],
  city: { type: String, index: true },
  area: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5, index: true },
  reviews: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },       // years
  hourlyRate: { type: Number, default: 0 },        // EGP
  verified: { type: Boolean, default: false },
  lat: { type: Number },
  lng: { type: Number },
  avatarSeed: { type: String, default: '' },
  online: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  wins: { type: Number, default: 0 },
  languages: [{ type: String }],
}, { timestamps: true });

lawyerSchema.index({ specialties: 1, city: 1, rating: -1 });
export default mongoose.model('Lawyer', lawyerSchema);
