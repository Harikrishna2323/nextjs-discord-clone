import { getOrCreateConversation } from "@/actions/converastion- action/get-or-create-conversation";
import { getMemberOfServer } from "@/actions/member-actions/get-member-of-server";
import { currentProfile } from "@/lib/currentProfile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatHeader } from "../../_components/chat/chat-header";
import { ChatMessages } from "../../_components/chat/chat-messages";
import { ChatInput } from "../../_components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const currentMember = await getMemberOfServer(params.serverId);

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember?._id,
    params.memberId
  );

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne?.profile._id.toString() === profile._id.toString()
      ? memberTwo
      : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        type="conversation"
        imageUrl={otherMember.profile?.imageUrl}
        name={otherMember?.profile.name}
        serverId={params.serverId}
      />

      {searchParams.video && (
        <MediaRoom chatId={conversation._id} video={true} audio={true} />
      )}

      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember.toObject()}
            name={otherMember.profile.name}
            type="conversation"
            chatId={conversation._id}
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation._id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation._id,
            }}
          />

          <ChatInput
            name={otherMember.profile.name}
            type={"conversation"}
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation._id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
