"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";

import { useModal } from "@/hooks/use-modal-store";

export const DeleteChannelModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "deleteChannel";

  const { channel, server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?._id}`,
        query: { serverId: server?._id },
      });

      const response = await axios.delete(url);

      onClose();
      //   router.push(`/servers/${server?._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>{" "}
            will be permanently deleted
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant={"primary"} onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
