import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* -------------------- BASIC INFO -------------------- */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔒 security best practice
    },

    /* -------------------- PROFILE -------------------- */
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    location: { type: String, default: "" },

    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },

    /* -------------------- SKILL EXCHANGE -------------------- */
    languagesToTeach: {
      type: [String],
      default: [],
    },

    languagesToLearn: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    techStack: {
      type: [String],
      default: [],
    },

    /* -------------------- SOCIAL GRAPH -------------------- */
    isOnboarded: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dismissedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* -------------------- PREMIUM & ROLES -------------------- */
    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumSince: {
      type: Date,
      default: null,
    },

    isAdmin: {
      type: Boolean,
      default: false, // 👑 required for Step-13
    },
  },
  { timestamps: true }
);

/* -------------------- PASSWORD HASH -------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* -------------------- PASSWORD COMPARE -------------------- */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
