import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Phase F — Roadmap modules shown on the Admin "قريبًا" page. */
export const RoadmapModule = mongoose.model('RoadmapModule', new Schema({
  title: String,
  description: String,
  icon: String,
  eta: String,
}, { timestamps: true }));

/** Phase F — Notify-me signups from the Admin Roadmap page. */
export const NotifySignup = mongoose.model('NotifySignup', new Schema({
  email: String,
  module: String,
}, { timestamps: true }));
