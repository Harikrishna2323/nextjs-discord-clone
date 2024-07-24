"use server";

import dbConnect from "@/lib/dbConnect";
import Conversation from "@/models/Conversation";
import Member from "@/models/Member";
import Profile from "@/models/Profile";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    await dbConnect();
    let conversation = await findConversation(memberOneId, memberTwoId);

    if (!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await Conversation.findOne({
      $or: [
        {
          memberOne: memberOneId,
          memberTwo: memberTwoId,
        },
        {
          memberOne: memberTwoId,
          memberTwo: memberOneId,
        },
      ],
    })
      .populate({
        path: "memberOne",
        populate: {
          path: "profile",
          model: Profile,
        },
      })
      .populate({
        path: "memberTwo",
        populate: {
          path: "profile",
          model: Profile,
        },
      });
  } catch (error) {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const conversation = await Conversation.create({
      memberOne: memberOneId,
      memberTwo: memberTwoId,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate({
        path: "memberOne",
        populate: {
          path: "profile",
          model: Profile,
        },
      })
      .populate({
        path: "memberTwo",
        populate: {
          path: "profile",
          model: Profile,
        },
      });

    return populatedConversation;
  } catch (error) {
    return null;
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    await dbConnect();

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "memberOne",
        model: Member,
        populate: {
          path: "profile",
          model: Profile,
        },
      })
      .populate({
        path: "memberTwo",
        model: Member,
        populate: {
          path: "profile",
          model: Profile,
        },
      });
    return conversation;
  } catch (error) {
    return null;
  }
};
