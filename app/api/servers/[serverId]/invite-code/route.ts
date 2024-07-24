import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/currentProfile";
import Server from "@/models/Server";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    await dbConnect();

    const server = await Server.findByIdAndUpdate(
      params.serverId,
      {
        $set: { inviteCode: uuidv4() },
      },
      { new: true }
    );

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER-ID] : ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
