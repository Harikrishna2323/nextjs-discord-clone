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

const invite =
  "http://localhost:3000/invite/8110d0ef-9bc4-4886-9a41-0847097549c3";

export const LeaveServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "leaveServer";

  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onLeave = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(`/api/servers/${server?._id}/leave`);

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
            Leave Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant={"primary"} onClick={onLeave}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
