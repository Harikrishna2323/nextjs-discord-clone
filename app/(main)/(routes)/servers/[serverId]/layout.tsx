import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { getServerById } from "@/actions/server-actions/get-server-by-id";
import { ServerSideBar } from "./_components/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  const server = await getServerById(params?.serverId);

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
