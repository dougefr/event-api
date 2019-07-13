import { logger } from ".";

const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  mongoURI: ""
};

env.mongoURI = env.isTest
  ? (global as any).__MONGO_URI__
  : "mongodb+srv://dito-service:lcV6leeS3WZNXnD0@cluster0-kep4u.mongodb.net/dito-service?retryWrites=true&w=majority";

logger.info(`Enviroment: ${JSON.stringify(env)}`);

export default env;
