import mongoose from "mongoose";
import Server from "./Server";

enum MemberRole {
  ADMIN,
  MODERATOR,
  GUEST,
}

const memberSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: {
      values: ["ADMIN", "MODERATOR", "GUEST"],
      message: "Not a valid user role",
      default: "GUEST",
    },
    default: "GUEST",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
    required: true,
    index: true,
  },
});

// memberSchema.post("save", async function (doc, next) {
//   try {
//     await Server.findByIdAndUpdate(
//       doc.server,
//       { $push: { members: doc._id } },
//       { new: true }
//     );

//     next();
//   } catch (error) {
//     next();
//   }
// });

const Member =
  mongoose.models?.Member || mongoose.model("Member", memberSchema);

export default Member;
