"use server";

import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Profile from "@/models/Profile";

export const getMemberOfServer = async (serverId: string) => {
  try {
    await dbConnect();
    const profile = await currentProfile();
    if (!profile) return null;

    const member = await Member.findOne({
      server: serverId,
      profile: profile._id,
    }).populate({
      path: "profile",
      model: Profile,
    });

    if (!member) return null;
    return member;
  } catch (error) {
    console.log("[get member error] : ", error);
    return null;
  }
};
