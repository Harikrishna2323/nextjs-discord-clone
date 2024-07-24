import mongoose, { MongooseError } from "mongoose";
import Server from "./Server";

const channelSchema = new mongoose.Schema(
  {
    name: String,
    type: {
      type: String,
      enum: ["TEXT", "AUDIO", "VIDEO"],
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
      index: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

// channelSchema.post("save", async function (doc, next) {
//   try {
//     await Server.findByIdAndUpdate(
//       doc.server,
//       {
//         $push: { channels: doc._id },
//       },
//       { new: true }
//     );

//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

const Channel =
  mongoose.models?.Channel || mongoose.model("Channel", channelSchema);

export default Channel;
