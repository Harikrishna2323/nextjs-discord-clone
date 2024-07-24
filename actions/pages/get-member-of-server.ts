"use server";

import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Profile from "@/models/Profile";

export const getMemberOfServerPages = async ({
  serverId,
  profileId,
}: {
  serverId: string;
  profileId: string;
}) => {
  try {
    await dbConnect();

    const member = await Member.findOne({
      server: serverId,
      profile: profileId,
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
