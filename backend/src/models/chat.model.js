import mongoose from 'mongoose';
const { Schema } = mongoose;
export const Conversation = mongoose.model('Conversation', new Schema({
  name: String, seed: String, role: String, lastMessage: String, unread: { type: Number, default: 0 }, online: { type: Boolean, default: false },
}, { timestamps: true }));
export const Message = mongoose.model('Message', new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true },
  sender: { type: String, enum: ['me', 'them'], default: 'them' }, text: String, attachment: { name: String, type: String },
}, { timestamps: true }));
