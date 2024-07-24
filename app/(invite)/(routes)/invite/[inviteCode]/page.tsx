import { alreadyExistingServer } from "@/actions/server-actions/existing-server";
import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  if (!params.inviteCode) return redirect("/");

  const existingServerResponse = await alreadyExistingServer(params.inviteCode);
  const existingServer = JSON.parse(existingServerResponse!);

  if (existingServer) return redirect(`/servers/${existingServer._id}`);
  return <>Hello Invite</>;
};

export default InviteCodePage;
