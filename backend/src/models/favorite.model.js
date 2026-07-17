import mongoose from 'mongoose';
const { Schema } = mongoose;

/** A saved (favorited) lawyer for a user (Screen 5). */
const favoriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, index: true },
  lawyer: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true },
}, { timestamps: true });

favoriteSchema.index({ user: 1, lawyer: 1 }, { unique: true });
export default mongoose.model('Favorite', favoriteSchema);
