"use server";

import { MemberType } from "@/constants";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Server from "@/models/Server";

export const getServerByIdPages = async ({
  serverId,
  profileId,
}: {
  serverId: string;
  profileId: string;
}) => {
  await dbConnect();
  try {
    const server = await Server.findById(serverId).populate({
      path: "members",
      select: ["profile", "role"],
      model: Member,
    });

    if (!server) throw new Error("Server not found");

    // Check if any member in the members array has the specified profileId
    const hasProfileId = server.members.some(
      (member: MemberType) => member.profile._id.toString() === profileId
    );

    if (hasProfileId) {
      return server;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
