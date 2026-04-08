import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../utils/middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/sign-up", AuthController.signUp);
authRoute.get("/sign-in", AuthController.signIn);

export default authRoute;
