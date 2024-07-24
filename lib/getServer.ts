"use server";

import Server from "@/models/Server";
import dbConnect from "./dbConnect";
import Profile from "@/models/Profile";
import mongoose from "mongoose";

export const getServer = async (profileId: string) => {
  await dbConnect();

  // const servers = await Server.aggregate([
  //   {
  //     $lookup: {
  //       from: "members", // The collection name for the Member model
  //       localField: "members",
  //       foreignField: "_id",
  //       as: "members",
  //     },
  //   },
  //   {
  //     $match: {
  //       "members.profile": profileId,
  //     },
  //   },
  //   {
  //     $limit: 1,
  //   },
  // ]);

  const server = await Server.aggregate([
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
      $match: {
        "result.profile": new mongoose.Types.ObjectId(profileId),
      },
    },
    { $limit: 1 },
  ]);

  return server[0];

  return server;
};
