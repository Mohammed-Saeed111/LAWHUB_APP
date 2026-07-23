import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },

    // Three account types (Screen 4): client / lawyer / office
    role: { type: String, enum: ['client', 'lawyer', 'office', 'admin', 'moderator', 'support'], default: 'client' },

    // Lawyer / office professional credentials (Screen 7)
    barNumber: { type: String, trim: true, default: null },
    specialization: { type: String, trim: true, default: null },
    barCardUrl: { type: String, default: null },
    firmName: { type: String, trim: true, default: null },

    // Account lifecycle (Screen 8 - under review for professionals)
    accountStatus: {
      type: String,
      enum: ['active', 'pending_review', 'rejected'],
      default: 'active',
    },

    // Multi-factor security (Screen 6)
    mfaEnabled: { type: Boolean, default: false },
    mfaMethods: [{ type: String, enum: ['app', 'sms', 'email'] }],

    // Biometric (Screen 9) — stores registered credential ids (WebAuthn-ready)
    biometricEnabled: { type: Boolean, default: false },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    preferredLanguage: { type: String, enum: ['ar', 'en'], default: 'ar' },

    avatarUrl: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },

    // Phase F — Admin Console
    permissions: [{ type: String }], // cms, finances, verifications, users, system
    city: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
