import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/currentProfile";

import dbConnect from "@/lib/dbConnect";
import Server from "@/models/Server";
import Channel from "@/models/Channel";
import Member from "@/models/Member";
import { MEMBERROLE } from "@/constants";

export async function POST(req: Request) {
  const session = await mongoose.startSession();

  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

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

      // create members for the sarver
      const member = await Member.create({
        profile: profile._id,
        role: MEMBERROLE.ADMIN,
        server: server,
      });

      if (channel && member) {
        const updateServer = await Server.findByIdAndUpdate(
          server._id,
          { $push: { members: member, channels: channel } },
          { new: true }
        );
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(server);
    }
  } catch (error) {
    console.log(error);
  }
}
