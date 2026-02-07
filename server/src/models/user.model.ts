import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      minLength: 3,
      maxLength: 16,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      trim: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 128,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
