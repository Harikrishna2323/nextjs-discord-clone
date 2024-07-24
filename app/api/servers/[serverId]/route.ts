import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Server from "@/models/Server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ChannelType, MemberType } from "@/constants";
import Channel from "@/models/Channel";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    await dbConnect();
    const profile = await currentProfile();

    const { name, imageUrl } = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const query = {
      _id: params.serverId,
      owner: profile._id,
    };
    const server = await Server.findByIdAndUpdate(
      query,
      { $set: { name, imageUrl } },
      { new: true }
    );

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_PATCH_ERROR] : ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  const session = await mongoose.startSession();
  try {
    await dbConnect();
    session.startTransaction();

    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Missing serverId", { status: 400 });

    // * IMP : as we delete a server, we MUST delete all channels and members associated with the server
    let server;
    // get server by severId and populate members and channels
    server = await Server.findById(params.serverId);

    const memberIds = server.members.map((member: MemberType) => member._id);
    const channelIds = server.channels.map(
      (channel: ChannelType) => channel._id
    );

    // delete many records of Members
    await Member.deleteMany({ _id: { $in: memberIds } });
    // delete many records of Channel
    await Channel.deleteMany({ _id: { $in: channelIds } });

    // finally delete the server
    server = await Server.findByIdAndDelete(params.serverId);

    session.commitTransaction();
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER-DELETE-ERROR] : ", error);
    session.abortTransaction();
    return new NextResponse("Internal error", { status: 500 });
  }
}
