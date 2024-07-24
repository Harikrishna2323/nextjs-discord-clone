"use client";

import { ActionToolTip } from "@/components/action-tooltip";
import { ChannelType, MEMBERROLE, ServerType } from "@/constants";
import { CHANNELTYPE } from "@/constants";
import { useModal } from "@/hooks/use-modal-store";
import { Plus, Settings } from "lucide-react";

interface ServerSectionProps {
  label?: string;
  role?: string;
  sectionType?: "channels" | "members";
  channelType?: string;
  server?: ServerType;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MEMBERROLE.GUEST && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}

      {role === MEMBERROLE.ADMIN && sectionType === "members" && (
        <ActionToolTip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
};
