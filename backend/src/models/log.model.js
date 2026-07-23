import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Phase F — Server log entries displayed in the Admin System Health panel. */
export default mongoose.model('ServerLog', new Schema({
  level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  code: Number,
  method: String,
  path: String,
  ms: Number,
  message: String,
}, { timestamps: true }));
