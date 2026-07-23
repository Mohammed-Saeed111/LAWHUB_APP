// Run: node verify-user.mjs <email>
// Example: node verify-user.mjs admin@gmail.com
import mongoose from 'mongoose';
import User from './src/models/user.model.js';

const email = process.argv[2];
if (!email) { console.error('Usage: node verify-user.mjs <email>'); process.exit(1); }

await mongoose.connect('mongodb://127.0.0.1:27017/lawhub');
const user = await User.findOneAndUpdate(
  { email },
  { isEmailVerified: true },
  { new: true }
);
if (!user) { console.error('User not found:', email); }
else { console.log('✅ Verified:', user.email, '| role:', user.role); }
await mongoose.disconnect();
