import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { getAllServerData } from "@/actions/server-actions/get-server-by-id-all";
import {
  ChannelType,
  CHANNELTYPE,
  MEMBERROLE,
  MemberType,
  ServerType,
} from "@/constants";
import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [CHANNELTYPE.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [CHANNELTYPE.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [CHANNELTYPE.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIconMap = {
  [MEMBERROLE.GUEST]: null,
  [MEMBERROLE.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MEMBERROLE.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSideBar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const response = await getAllServerData(serverId);

  const server = JSON.parse(response!);

  if (!server) redirect("/");

  const textChannels = server?.channels.filter(
    (channel: ChannelType) => channel.type === CHANNELTYPE.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel: ChannelType) => channel.type === CHANNELTYPE.AUDIO
  );

  const videoChannels = server?.channels.filter(
    (channel: ChannelType) => channel.type === CHANNELTYPE.VIDEO
  );

  const members = server?.members.filter(
    (member: MemberType) =>
      member.profile._id.toString() !== profile._id.toString()
  );

  //    check for user's role
  const role = server.members.find(
    (member: MemberType) =>
      member.profile._id.toString() === profile._id.toString()
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role!} />

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel: ChannelType) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel: ChannelType) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel: ChannelType) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member: MemberType) => ({
                  id: member._id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role!],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={CHANNELTYPE.TEXT}
              role={role}
              label={"text Channels"}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel: ChannelType) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={CHANNELTYPE.AUDIO}
              role={role}
              label={"Voice Channels"}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel: ChannelType) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={CHANNELTYPE.VIDEO}
              role={role}
              label={"Video Channels"}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel: ChannelType) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {/*  TODO : move Members-section to the right as a sidebar */}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              label={"Members"}
              role={role}
              server={server}
            />
            {members.map((member: MemberType) => (
              <ServerMember key={member._id} server={server} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
