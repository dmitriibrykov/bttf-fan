/* eslint-disable @typescript-eslint/no-explicit-any */
import { type MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
  var mongoose: { conn: any; promise: any };
}
