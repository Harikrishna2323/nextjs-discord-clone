"use server";
import {
  getConversationById,
  getOrCreateConversation,
} from "@/actions/converastion- action/get-or-create-conversation";
import { getChannelByIdPages } from "@/actions/pages/get-channel-by-id";
import { getMemberOfServerPages } from "@/actions/pages/get-member-of-server";
import { getServerByIdPages } from "@/actions/pages/get-server-by-id";
import { NextApiResponseServerIO } from "@/constants";
import { currentProfilePages } from "@/lib/current-profile-pages";
import dbConnect from "@/lib/dbConnect";
import DirectMessage from "@/models/DirectMessage";
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
    const { conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId)
      return res.status(400).json({ error: "Missing conversationId" });

    await dbConnect();

    const conversation = await getConversationById(conversationId.toString());

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    console.log({ conversation });

    const member =
      conversation.memberOne.profile._id.toString() === profile._id.toString()
        ? conversation.memberOne.toObject()
        : conversation.memberTwo.toObject();

    console.log({ member });

    const createdMessage = await DirectMessage.create({
      content,
      fileUrl,
      conversation: conversationId,
      member: member?._id,
    });

    console.log({ createdMessage });

    const message = await DirectMessage.findById(createdMessage._id).populate({
      path: "member",
      model: Member,
      populate: {
        path: "profile",
        model: Profile,
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT-MESSAGES-POST] : ", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
