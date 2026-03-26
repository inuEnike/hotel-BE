import express from "express";
import { errorMiddleware } from "./utils/middlewares/error.middleware.js";
import hotelRoute from "./routes/hotel.route.js";

export const app = express();

app.use(express.json());

app.get("/health-check", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is live",
  });
});

app.use("/hotel", hotelRoute);

app.all("*all", (_req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: "No route found",
  });
});

app.use(errorMiddleware);
