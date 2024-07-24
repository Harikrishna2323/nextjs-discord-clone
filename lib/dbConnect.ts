import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

let cached = global.mongoose as any;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (cached.conn == null) {
    cached.promise = mongoose.connect(DATABASE_URL!).then((mongoose) => {
      console.log("Db connected!");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
