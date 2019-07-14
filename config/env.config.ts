import { logger } from ".";

const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  mongoURI: ""
};

env.mongoURI = env.isTest
  ? (global as any).__MONGO_URI__
  : process.env.MONGO_URI;

if (!env.mongoURI) {
  throw new Error(
    "Environment variable MONGO_URI must be defined to run this application"
  );
}

logger.info(`Enviroment: ${JSON.stringify(env)}`);

export default env;
