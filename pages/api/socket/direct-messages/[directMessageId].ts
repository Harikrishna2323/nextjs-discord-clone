import { getConversationById } from "@/actions/converastion- action/get-or-create-conversation";
import { getChannelByIdPages } from "@/actions/pages/get-channel-by-id";
import { getMemberOfServerPages } from "@/actions/pages/get-member-of-server";
import { getServerByIdPages } from "@/actions/pages/get-server-by-id";
import { MEMBERROLE, NextApiResponseServerIO } from "@/constants";
import { currentProfilePages } from "@/lib/current-profile-pages";
import dbConnect from "@/lib/dbConnect";
import DirectMessage from "@/models/DirectMessage";
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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId) return res.status(401).json({ error: "Unauthorized" });

    await dbConnect();

    const conversation = await getConversationById(conversationId as string);

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profile._id.toString() === profile._id.toString()
        ? conversation.memberOne
        : conversation.memberTwo;

    let message = await DirectMessage.findOne({
      _id: directMessageId as string,
      conversation: conversationId as string,
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
      message = await DirectMessage.findByIdAndUpdate(
        directMessageId,
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
      message = await DirectMessage.findByIdAndUpdate(
        directMessageId,
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

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGEID-ERROR] : ", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
