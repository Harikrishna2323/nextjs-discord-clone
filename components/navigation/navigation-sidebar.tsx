import { UserButton } from "@clerk/nextjs";

import { getServersOfProfile } from "@/actions/server-actions/get-servers";
import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { ServerType } from "@/constants";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const servers = await getServersOfProfile();

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-zinc-300 dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px]  bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((server: ServerType) => (
          <div key={server._id} className="mb-4">
            <NavigationItem
              id={server._id}
              name={server.name!}
              imageUrl={server.imageUrl!}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4 ">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
