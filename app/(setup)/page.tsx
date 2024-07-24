import { InitialModal } from "@/components/modals/initial-modal";
import { getServer } from "@/lib/getServer";
import { initialProfile } from "@/lib/initialProfile";
import Server from "@/models/Server";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  // check if the profile has any server --- MIGHT NEED REFACTORING
  const server = await getServer(profile._id);

  // redirect if profile has server
  if (server) {
    return redirect(`/servers/${server._id}`);
  } else return <InitialModal />;
};

export default SetupPage;
