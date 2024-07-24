import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "./dbConnect";
import Profile from "@/models/Profile";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  await dbConnect();

  const profile = await Profile.findOne({ userId: user.id });

  if (profile) return profile;

  const newProfile = await Profile.create({
    userId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  });

  return newProfile;
};
