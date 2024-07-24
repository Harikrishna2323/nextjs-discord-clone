"use server";

import dbConnect from "@/lib/dbConnect";
import Channel from "@/models/Channel";

export const getGeneralChannel = async (serverId: string) => {
  try {
    await dbConnect();
    if (!serverId) return null;

    const channel = await Channel.findOne({
      name: "general",
      server: serverId,
    });

    return channel;
  } catch (error) {
    console.log("error");
    return null;
  }
};
