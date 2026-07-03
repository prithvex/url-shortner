import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    full_url: {
      type: String,
      required: true,
      unique: true,
      
    },

    short_url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    visitHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const URL = mongoose.model("URL", urlSchema);

export default URL;