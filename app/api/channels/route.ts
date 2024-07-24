import { currentProfile } from "@/lib/currentProfile";
import Server from "@/models/Server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Profile from "@/models/Profile";
import { MEMBERROLE } from "@/constants";
import Channel from "@/models/Channel";

export async function POST(req: Request) {
  const session = await mongoose.startSession();
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId) return new NextResponse("SeverId missing", { status: 400 });

    // validation -> if user bypasses the client side validations
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    let server;
    let channel;
    session.startTransaction();
    let member = await Member.findOne({
      profile: profile._id,
      server: serverId,
    })
      .populate({
        path: "profile",
        model: Profile,
      })
      .populate({
        path: "server",
        model: Server,
      });

    // * Only members who has role ['MODERATOR' / 'ADMIN'] are allowed to create channel
    if (
      member &&
      (member.role === MEMBERROLE.ADMIN || member.role === MEMBERROLE.MODERATOR)
    ) {
      console.log("-----------------PERMISSIONS MET--------------");
      channel = await Channel.create({
        name,
        type,
        server: serverId,
        profile: profile._id,
      });

      if (channel) {
        server = await Server.findByIdAndUpdate(
          serverId,
          { $push: { channels: channel._id } },
          { new: true }
        );
      }
    } else {
      return new NextResponse("User does not have permission for the action", {
        status: 401,
      });
    }

    session.commitTransaction();

    if (channel && server) {
      return NextResponse.json(server);
    }
  } catch (error) {
    console.log("[CHANNEL-CREATION-ERROR] : ", error);
    session.abortTransaction();
    return new NextResponse("Internal Error", { status: 500 });
  }
}
