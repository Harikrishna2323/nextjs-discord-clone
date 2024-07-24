import mongoose from "mongoose";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Server from "@/models/Server";
import { NextResponse } from "next/server";
import Channel from "@/models/Channel";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const session = await mongoose.startSession();
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("Server ID missing", { status: 400 });

    if (!params.channelId)
      return new NextResponse("ChannelId missing", { status: 400 });

    await dbConnect();

    // * For deleting channel -> remove the channel from server -> delete the channel from Channel record
    session.startTransaction();
    let server = await Server.findByIdAndUpdate(
      serverId,
      { $pull: { channels: params.channelId } },
      { new: true }
    );

    // ? Ensure bypass case --- general channel cannot be deleted

    let channel = await Channel.findById(params?.channelId);

    if (channel.name === "general") {
      session.abortTransaction();
      return new NextResponse("'general' channel cannot be deleted", {
        status: 400,
      });
    }

    await Channel.findByIdAndDelete(params?.channelId);

    session.commitTransaction();

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL-ID-DELETE] : ", error);
    session.abortTransaction();
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!serverId) return new NextResponse("Missing serverId", { status: 400 });

    if (!params?.channelId)
      return new NextResponse("Missing channelId", { status: 400 });

    let channel = await Channel.findByIdAndUpdate(
      params?.channelId,
      { $set: { name, type } },
      { new: true }
    );

    return new NextResponse("Updated channel", { status: 200 });
  } catch (error) {
    console.log("[CHANNEL-PATCH-ERROR] : ", error);
    return new NextResponse("INternal Error", { status: 500 });
  }
}
