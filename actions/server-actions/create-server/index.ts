import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Server from "@/models/Server";
import Channel from "@/models/Channel";

export const createServer = async (data: {
  name: string;
  imageUrl: string;
}) => {
  const session = await mongoose.startSession();
  try {
    const profile = await currentProfile();

    const { name, imageUrl } = data;

    if (!profile) {
      return {
        error: "Unauthorized",
      };
    }

    session.startTransaction();

    //create a server
    const server = await Server.create({
      name,
      owner: profile._id,
      imageUrl,
      inviteCode: uuidv4(),
    });

    // always create a channel 'general'  when creating a server
    if (server) {
      const channel = await Channel.create({
        name: "general",
        type: "TEXT",
        server: server,
        profile: profile._id,
      });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { data: JSON.parse(server) };
    }
  } catch (error) {
    // If any error occurred, abort the transaction
    await session.abortTransaction();
    console.log("[SERVER CREATION]", error);
  }
};
