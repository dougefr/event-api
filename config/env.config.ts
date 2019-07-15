import { logger } from ".";

export const env = (() => {
  const envToBuild = {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
    mongoURI: ""
  };

  envToBuild.mongoURI = envToBuild.isTest
    ? (global as any).__MONGO_URI__
    : process.env.MONGO_URI;

  if (!envToBuild.mongoURI) {
    throw new Error(
      "Environment variable MONGO_URI must be defined to run this application"
    );
  }

  logger.info(`Enviroment: ${JSON.stringify(envToBuild)}`);

  return envToBuild;
})();
