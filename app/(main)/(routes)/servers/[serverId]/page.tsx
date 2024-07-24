import { getGeneralChannel } from "@/actions/channel-actions/get-general-channel";
import { currentProfile } from "@/lib/currentProfile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: { serverId: string };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn(); // ! Might cause error

  // get general channel of the server : serverId
  const channel = await getGeneralChannel(params.serverId);

  if (!channel || channel.name !== "general") return null;

  return redirect(`/servers/${params.serverId}/channels/${channel._id}`);
};

export default ServerIdPage;
