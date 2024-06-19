import mongoose, { set } from "mongoose";
import { NODE_ENV, MONGODB_URI } from "@config";

declare global {
  var mongoose: any;
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnection() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const dbConfig = {
      url: MONGODB_URI!,
      options: {
        bufferCommands: false,
        connectTimeoutMS: 160_000,
        serverSelectionTimeoutMS: 60_000,
      },
    };
    if (NODE_ENV !== "production") {
      set("debug", true);
    }

    cached.promise = mongoose
      .connect(dbConfig.url, dbConfig.options)
      .then((mongoose) => {
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
