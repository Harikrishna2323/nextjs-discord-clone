"use server";

import { MEMBERROLE, MemberType } from "@/constants";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Profile from "@/models/Profile";
import Server from "@/models/Server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const alreadyExistingServer = async (inviteCode: string) => {
  try {
    await dbConnect();

    const profile = await currentProfile();

    const existingServer = await Server.findOne()
      .where({ inviteCode })
      .populate({
        path: "members",
        model: Member,
        populate: {
          path: "profile",
          model: Profile,
        },
      });

    if (!existingServer) {
      console.log("No server found with the specified invite code.");
      return null;
    }

    // Check if any member in the members array has the specified profileId
    const hasProfileId = existingServer.members.some(
      (member: MemberType) =>
        member.profile._id.toString() === profile._id.toString()
    );

    if (existingServer && hasProfileId) {
      return JSON.stringify(existingServer.toObject());
    }

    const newMember = await Member.create({
      role: MEMBERROLE.GUEST,
      profile: profile._id,
      server: existingServer._id,
    });

    let updatedServer;

    updatedServer = await Server.findByIdAndUpdate(
      existingServer._id,
      { $push: { members: newMember._id } },
      { new: true }
    );

    revalidatePath(`/server/${updatedServer._id}`);

    return JSON.stringify(existingServer.toObject());
  } catch (error) {
    console.log(error);
    return null;
  }
};
