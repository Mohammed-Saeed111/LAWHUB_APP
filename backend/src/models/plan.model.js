import mongoose from 'mongoose';
const { Schema } = mongoose;
export default mongoose.model('Plan', new Schema({ key: { type: String, unique: true }, name: String, price: Number, highlight: Boolean, features: [String] }, { timestamps: true }));
