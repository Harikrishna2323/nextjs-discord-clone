"use client";

import { Plus } from "lucide-react";
import { ActionToolTip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const createModal = useModal();
  return (
    <div>
      <button
        className="group flex items-center"
        onClick={() => createModal.onOpen("createServer")}
      >
        <div className="flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden  bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 ">
          <ActionToolTip label="Add a server" side="right" align="center">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </ActionToolTip>
        </div>
      </button>
    </div>
  );
};
