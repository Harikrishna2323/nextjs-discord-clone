import dbConnect from "@/lib/dbConnect";
import Channel from "@/models/Channel";

export const getChannelByIdPages = async (channelId: string) => {
  try {
    await dbConnect();

    const channel = await Channel.findById(channelId);

    if (!channel) return null;

    return channel;
  } catch (error) {
    console.log("error");
    return null;
  }
};
