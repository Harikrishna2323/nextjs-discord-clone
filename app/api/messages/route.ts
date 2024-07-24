import { MessageType } from "@/constants";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Message from "@/models/Message";
import Profile from "@/models/Profile";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    await dbConnect();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Missing ChannelId", { status: 400 });
    }

    let messages: MessageType[];

    if (cursor) {
      const cursorMessage = await Message.findById(cursor);
      const cursorDate = cursorMessage ? cursorMessage.createdAt : new Date();
      messages = await Message.find({
        channel: channelId,
        createdAt: { $lt: cursorDate },
      })
        .sort({ createdAt: -1 })
        .limit(MESSAGES_BATCH)
        .skip(1)
        .populate({
          path: "member",
          populate: {
            path: "profile",
          },
        });
    } else {
      messages = await Message.find({
        channel: channelId,
      })
        .sort({ createdAt: -1 })
        .limit(MESSAGES_BATCH)
        .populate({
          path: "member",
          model: Member,
          populate: {
            path: "profile",
            model: Profile,
          },
        });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1]._id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES-GET] : ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
