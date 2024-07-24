import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSideBar } from "@/app/(main)/(routes)/servers/[serverId]/_components/server-sidebar";

interface MobileToggle {
  serverId: string;
}

export const MobileToggle = ({ serverId }: MobileToggle) => {
  // ! BUG : Menu visible in medium devices also
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="h-5 w-5 flex md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
