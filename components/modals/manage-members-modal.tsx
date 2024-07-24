"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Gavel,
  Loader2,
  MoreVertical,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500 " />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const ManageMembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";

  const { server } = data;

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?._id,
        },
      });

      const response = await axios.delete(url);

      if (response.statusText === "OK") {
        setLoadingId("");

        router.refresh();
        onOpen("members", { server: response.data });
      }
    } catch (error) {
      console.log(error);
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?._id,
          memberId,
        },
      });

      const response = await axios.patch(url, { role });

      // if(response.statusText === 'OK')

      setLoadingId("");

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#313338]  text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="dark:text-white text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-400">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => {
            return (
              <div key={member._id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-black dark:text-white text-xs dark font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
                {server.owner!.toString() !== member.profile._id &&
                  loadingId !== member._id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc- dark:text-black" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side={"left"}>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member._id, "GUEST")
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member._id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member._id)}>
                            <Gavel className="h-4 w-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member._id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
