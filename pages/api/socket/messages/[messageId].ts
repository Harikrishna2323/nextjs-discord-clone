import { getChannelByIdPages } from "@/actions/pages/get-channel-by-id";
import { getMemberOfServerPages } from "@/actions/pages/get-member-of-server";
import { getServerByIdPages } from "@/actions/pages/get-server-by-id";
import { MEMBERROLE, NextApiResponseServerIO } from "@/constants";
import { currentProfilePages } from "@/lib/current-profile-pages";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Message from "@/models/Message";
import Profile from "@/models/Profile";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!serverId) return res.status(400).json({ error: "Missing serverId" });

    if (!channelId) return res.status(401).json({ error: "Unauthorized" });

    await dbConnect();

    const server = await getServerByIdPages({
      serverId: serverId.toString(),
      profileId: profile._id.toString(),
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await getChannelByIdPages(channelId as string);

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const member = await getMemberOfServerPages({
      serverId: serverId.toString(),
      profileId: profile._id.toString(),
    });

    if (!member) return res.status(404).json({ error: "Member not found" });

    let message = await Message.findOne({
      _id: messageId as string,
      channel: channelId as string,
    }).populate({
      path: "member",
      model: Member,
      populate: {
        path: "profile",
        model: Profile,
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner =
      message.member._id.toString() === member._id.toString();
    const isAdmin = member.role === MEMBERROLE.ADMIN;
    const isModerator = member.role === MEMBERROLE.MODERATOR;

    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            fileUrl: null,
            content: "This message has been deleted",
            deleted: true,
          },
        },
        { new: true }
      ).populate({
        path: "member",
        model: Member,
        populate: {
          path: "profile",
          model: Profile,
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      message = await Message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            content: content,
          },
        },
        { new: true }
      ).populate({
        path: "member",
        model: Member,
        populate: {
          path: "profile",
          model: Profile,
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGEID-ERROR] : ", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
