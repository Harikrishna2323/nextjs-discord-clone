import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      index: true, // Index on username
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Index on email
    },
    imageUrl: {
      type: String,
    },
    servers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Server",
      },
    ],
  },
  { timestamps: true }
);

const Profile =
  mongoose.models?.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
