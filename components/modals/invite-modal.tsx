"use client";

import { useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { UploadDropzone } from "../drop-zone";
import { createServer } from "@/actions/server-actions/create-server";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";

import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/servers/${server?._id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex flexitems-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button onClick={onCopy} disabled={isLoading} size={"icon"}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            onClick={onNew}
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
