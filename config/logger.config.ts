import winston from "winston";

export const logger = winston.createLogger().add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.label({ label: "event-api" }),
      winston.format.timestamp(),
      winston.format.printf(
        ({ level, message, label, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`
      )
    )
  })
);
