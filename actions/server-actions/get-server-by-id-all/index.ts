import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Channel from "@/models/Channel";
import Member from "@/models/Member";
import Profile from "@/models/Profile";
import Server from "@/models/Server";

export const getAllServerData = async (serverId: string) => {
  await dbConnect();
  try {
    const server = await Server.findById(serverId)
      .populate({
        path: "channels",
        model: Channel,
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: "members",
        model: Member,
        populate: {
          path: "profile",
          model: Profile, // Assuming 'UserProfile' is the model name for profiles
          options: { sort: { role: 1 } },
        },
      });
    if (!server) {
      throw new Error("No server found with the specified ID.");
    }

    return JSON.stringify(server.toObject());

    // Check if any member in the members array has the specified profileId
  } catch (error) {
    console.log(error);
  }
};
