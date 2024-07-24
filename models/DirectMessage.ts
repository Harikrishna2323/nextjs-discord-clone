import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DirectMessage =
  mongoose.models?.DirectMessage ||
  mongoose.model("DirectMessage", directMessageSchema);

export default DirectMessage;
