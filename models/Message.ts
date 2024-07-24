import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    // memberId: String,
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    // channelId: String,
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    deleted: Boolean,
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models?.Message || mongoose.model("Message", messageSchema);

export default Message;
