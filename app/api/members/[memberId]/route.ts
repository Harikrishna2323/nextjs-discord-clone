import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { currentProfile } from "@/lib/currentProfile";
import dbConnect from "@/lib/dbConnect";
import Server from "@/models/Server";
import Member from "@/models/Member";
import Profile from "@/models/Profile";
import { revalidatePath } from "next/cache";
import Channel from "@/models/Channel";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");

    if (!serverId) return new NextResponse("ServerId missing", { status: 400 });

    if (!params.memberId)
      return new NextResponse("MemberId missing", { status: 400 });

    await dbConnect();

    // const server = await Server
    let member = await Member.findById(params.memberId).populate({
      path: "profile",
      model: Profile,
    });

    if (member && member.profile._id.toString() !== profile._id.toString()) {
      console.log("Update rule reached");
      member = await Member.findByIdAndUpdate(
        params.memberId,
        { $set: { role } },
        { new: true }
      );
    }

    // get the update server and send to client
    const server = await Server.findById(serverId)
      .populate({
        path: "channels",
        model: Channel,
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: "members",
        model: Member,
        populate: {
          path: "profile",
          model: Profile, // Assuming 'UserProfile' is the model name for profiles
          options: { sort: { role: 1 } },
        },
      });

    // revalidatePath(`servers/${serverId}`);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH] : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { memberId: string };
  }
) {
  const session = await mongoose.startSession();
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) return new NextResponse("ServerID Missing", { status: 400 });
    if (!params.memberId)
      return new NextResponse("MemberId missing", { status: 400 });

    await dbConnect();

    // start transaction :
    session.startTransaction();

    let member = await Member.findById(params.memberId).populate({
      path: "profile",
      model: Profile,
    });

    let server;
    // 1. Delete Member with memberId
    // ? Delete cond: ensure whether member's profileId is not current profileId
    // * TO avoid case where ADMIN does not kick themselves (when testing API)

    console.log(
      "Match condition : ",
      member.profile._id.toString() !== profile._id.toString()
    );
    if (member.profile._id.toString() !== profile._id.toString()) {
      // * delete the member
      await Member.findByIdAndDelete(params.memberId);

      // * update the server
      server = await Server.findByIdAndUpdate(
        serverId,
        { $pull: { members: new mongoose.Types.ObjectId(params.memberId) } },
        { new: true }
      );

      session.commitTransaction();
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE] : ", error);
    session.abortTransaction();
    return new NextResponse("Internal Error", { status: 500 });
  }
}
