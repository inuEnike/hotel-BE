import { app } from "./app.js";
import { config } from "./utils/config.js";
import { configureDb } from "./utils/db.js";
import { auditEmitter } from "./utils/loggers/message.js";

const PORT = config.PORT;

const startServer = () => {
  configureDb();
  app.listen(PORT);
  auditEmitter.emit("log", {
    type: "INFO",
    message: `Connected on ${PORT}`,
  });
};

startServer();
