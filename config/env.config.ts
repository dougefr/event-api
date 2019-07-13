import { logger } from ".";

export default (() => {
  const env = {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test"
  };

  logger.info(`Enviroment: ${JSON.stringify(env)}`);

  return env;
})();
