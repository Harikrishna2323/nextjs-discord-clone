import { MemberType } from "@/constants";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import Server from "@/models/Server";

export const getServerById = async (serverId: string) => {
  const profile = await currentProfile();

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
      (member: MemberType) =>
        member.profile._id.toString() === profile._id.toString()
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
