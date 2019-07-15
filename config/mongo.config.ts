import { MongoClient } from "mongodb";
import { env, logger } from ".";

export async function connectToMongo() {
  const mongoClient = new MongoClient(env.mongoURI, { useNewUrlParser: true });

  await mongoClient.connect();

  logger.info("Connected successfully to MongoDB server");

  if (mongoClient.isConnected()) {
    return mongoClient.db("events");
  } else {
    throw new Error("Cannot connect to MongoDB server");
  }
}
