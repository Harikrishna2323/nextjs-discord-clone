"use server";
import { getChannelByIdPages } from "@/actions/pages/get-channel-by-id";
import { getMemberOfServerPages } from "@/actions/pages/get-member-of-server";
import { getServerByIdPages } from "@/actions/pages/get-server-by-id";
import { NextApiResponseServerIO } from "@/constants";
import { currentProfilePages } from "@/lib/current-profile-pages";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Message from "@/models/Message";
import Profile from "@/models/Profile";
import Server from "@/models/Server";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!serverId) return res.status(400).json({ error: "Missing ServerID" });

    if (!channelId) return res.status(400).json({ error: "Missing ChannelID" });

    await dbConnect();

    const server = await getServerByIdPages({
      serverId: serverId.toString(),
      profileId: profile._id.toString(),
    });

    if (!server) return res.status(404).json({ message: "Server not found" });

    const channel = await getChannelByIdPages(channelId as string);

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const member = await getMemberOfServerPages({
      serverId: serverId.toString(),
      profileId: profile._id.toString(),
    }); //  uses current profile

    if (!member) return res.status(404).json({ message: "Member not found" });

    const message = await Message.create({
      content,
      fileUrl,
      channel: channelId,
      member: member?._id,
    });

    const fetchMessage = await Message.findById(message._id).populate({
      path: "member",
      model: Member,
      populate: {
        path: "profile",
        model: Profile,
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, fetchMessage);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES-POST] : ", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
