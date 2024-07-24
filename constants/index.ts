import { Server as Netserver, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: Netserver & {
      io: SocketIOServer;
    };
  };
};

export const MEMBERROLE = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  GUEST: "GUEST",
};

export const CHANNELTYPE = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
};

export enum ChanelType {
  TEXT,
  AUDIO,
  VIDEO,
}

export type ChannelType = {
  _id: string;
  name: string;
  type: string;
  server?: ServerType;
  profile?: ProfileType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProfileType = {
  _id: string;
  userId?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  servers?: ServerType[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type ServerType = {
  _id: string;
  name?: string;
  imageUrl?: string;
  inviteCode?: string;
  owner?: ProfileType;
  members: MemberType[];
  channels: ChannelType[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type MemberType = {
  _id: string;
  role?: string;
  profile: ProfileType;
  server?: ServerType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MessageType = {
  _id: string;
  content: string;
  fileUrl?: string;
  member: MemberType;
  channel: ChannelType;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ConversationType = {
  _id: string;
  memberOne: MemberType;
  memberTwo: MemberType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DirectMessageType = {
  _id: string;
  content: string;
  fileUrl?: string;
  member: MemberType;
  conversation: ConversationType;
  deleted: boolean;
};
