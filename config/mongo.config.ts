import { MongoClient } from "mongodb";
import { logger } from ".";
import env from "./env.config";

async function connectToMongo() {
  const mongoClient = new MongoClient(env.mongoURI, { useNewUrlParser: true });

  await mongoClient.connect();

  logger.info("Connected successfully to MongoDB server");

  if (mongoClient.isConnected()) {
    return mongoClient;
  } else {
    throw new Error("Cannot connect to MongoDB server");
  }
}

export const getMongoDB = (() => {
  let mongoClient: MongoClient | null = null;

  async function mongoClientManager() {
    if (!mongoClient || !mongoClient.isConnected()) {
      mongoClient = await connectToMongo();
    }

    return mongoClient;
  }

  return async () => (await mongoClientManager()).db("events");
})();
