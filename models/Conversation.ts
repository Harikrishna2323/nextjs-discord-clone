import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // memberOneId: String,
    memberOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    // memberTwoId: String,
    memberTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation =
  mongoose.models?.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
