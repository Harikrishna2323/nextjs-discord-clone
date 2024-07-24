import { currentProfile } from "@/lib/currentProfile";
import Member from "@/models/Member";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Server from "@/models/Server";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  const session = await mongoose.startSession();
  try {
    await dbConnect();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Missing serverId", { status: 400 });

    // ? #0 fetch the member with provided serverId na profile._id
    let member = await Member.findOne({
      server: params.serverId,
      profile: profile._id,
    });

    // start transaction
    session.startTransaction();
    // * #1 remove the member from members[] in server
    let server = await Server.findByIdAndUpdate(
      params.serverId,
      { $pull: { members: new mongoose.Types.ObjectId(member._id) } },
      { new: true }
    );

    // * #2 find the member record from 'members' and delete it

    await Member.findByIdAndDelete(member._id);

    session.commitTransaction();

    revalidatePath(`/sevrers/${server._id}`);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER-LEAVING-ERROR] : ", error);
    session.abortTransaction();
    return new NextResponse("Internal error", { status: 500 });
  }
}
