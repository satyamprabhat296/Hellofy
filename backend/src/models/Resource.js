import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["video", "article", "course", "repo"],
      required: true,
    },

    language: {
      type: String, // e.g. "JavaScript", "Python"
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
