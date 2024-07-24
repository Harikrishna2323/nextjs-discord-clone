"use server";

import { currentProfile } from "@/lib/currentProfile";
import Member from "@/models/Member";
import Server from "@/models/Server";
import Channel from "@/models/Channel";
import { ServerType } from "@/constants";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const getServersOfProfile = async (): Promise<ServerType[] | null> => {
  const profile = await currentProfile();
  if (!profile) return null;

  const profileId = new ObjectId(profile._id);

  const servers = await Server.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "result.profile",
        foreignField: "_id",
        as: "profileResults",
      },
    },
    {
      $unwind: {
        path: "$profileResults",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "profileResults._id": profileId,
      },
    },
  ]);

  return JSON.parse(JSON.stringify(servers));
};
