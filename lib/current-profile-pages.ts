import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "./dbConnect";
import Profile from "@/models/Profile";

export const currentProfilePages = async (req: NextApiRequest) => {
  await dbConnect();
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await Profile.findOne({ userId });

  if (!profile) return;

  return profile;
};
