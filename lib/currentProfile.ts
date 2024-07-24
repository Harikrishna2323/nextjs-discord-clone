import { auth } from "@clerk/nextjs/server";
import dbConnect from "./dbConnect";
import Profile from "@/models/Profile";

export const currentProfile = async () => {
  await dbConnect();
  const { userId } = auth();

  if (!userId) return null;

  const profile = await Profile.findOne({ userId });

  if (!profile) return;

  return profile;
};
