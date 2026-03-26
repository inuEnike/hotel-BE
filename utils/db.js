import mongoose from "mongoose";
import { config } from "./config.js";
import { errorAuditEmitter } from "./loggers/error.js";
import { auditEmitter } from "./loggers/message.js";

export const configureDb = () => {
  try {
    mongoose.connect(config.DB_URI);
    auditEmitter.emit("log", {
      type: "INFO",
      message: "Database connected Successfully ",
    });
  } catch (error) {
    errorAuditEmitter.emit("error", {
      type: "ERROR",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
