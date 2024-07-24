"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useModal } from "@/hooks/use-modal-store";

export const DeleteServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";

  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const response = await axios.delete(`/api/servers/${server?._id}`);

      onClose();
      router.push("/");
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
            Delete Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
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
