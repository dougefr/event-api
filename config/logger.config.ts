import winston from "winston";

export const logger = winston.createLogger().add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);
