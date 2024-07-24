import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getChannelById } from "@/actions/channel-actions/get-channel-by-id";
import { getMemberOfServer } from "@/actions/member-actions/get-member-of-server";
import { currentProfile } from "@/lib/currentProfile";
import { ChatHeader } from "../../_components/chat/chat-header";
import { ChatInput } from "../../_components/chat/chat-input";
import { ChatMessages } from "../../_components/chat/chat-messages";
import { CHANNELTYPE } from "@/constants";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const channel = await getChannelById(params.channelId);

  const member = await getMemberOfServer(params.serverId);

  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type={"channel"}
      />

      {channel.type === CHANNELTYPE.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member.toObject()}
            chatId={channel._id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel._id,
              serverId: channel?.server as string,
            }}
            paramKey="channelId"
            paramValue={channel._id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel._id,
              serverId: channel?.server as string,
            }}
          />
        </>
      )}

      {channel.type === CHANNELTYPE.AUDIO && (
        <MediaRoom chatId={channel._id} audio={true} video={false} />
      )}

      {channel.type === CHANNELTYPE.VIDEO && (
        <MediaRoom chatId={channel._id} audio={false} video={true} />
      )}

      {/* TODO: Members to right sidebar - layout */}
      {/* <div className="flex flex-1">
        <div className="flex-1">
          <div className="flex  bg-white text-black">Future messages</div>
          <ChatInput />
        </div>

        <div className="lg:w-[350px] lg:block hidden  bg-green-500">test</div>
      </div> */}
    </div>
  );
};

export default ChannelIdPage;
