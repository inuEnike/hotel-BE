import express from "express";
import {errorMiddleware} from "./utils/middlewares/error.middleware.js";
import hotelRoute from "./routes/hotel.route.js";
import bookRoute from "./routes/booking.route.js";
import cors from "cors";

export const app = express();
const corsOptions = {
    origin: "*",
    credentials: true,

}

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health-check", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live",
    });
});

app.use("/hotel", hotelRoute);
app.use("/booking", bookRoute);

app.all("*all", (_req, res) => {
    res.status(404).json({
        statusCode: 404,
        success: false,
        message: "No route found",
    });
});

app.use(errorMiddleware);
