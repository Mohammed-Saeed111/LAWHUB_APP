import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Legal service categories with counts (Screen 1 cards + Screen 3 filters). */
const categorySchema = new Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, default: 'FiBookOpen' }, // maps to a react-icons name on the client
  count: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
