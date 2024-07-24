import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    inviteCode: { type: String, unique: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true, // Index on owner to quickly find all servers owned by a user.
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },

  { timestamps: true }
);

const Server =
  mongoose.models?.Server || mongoose.model("Server", serverSchema);

export default Server;
