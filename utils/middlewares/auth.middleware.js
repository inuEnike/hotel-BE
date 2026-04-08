import { config } from "dotenv";
import { Auth } from "../../models/auth.model.js";
import bcrypt from "bcryptjs";
import { authRepository } from "../../repositories/auth.repository.js";
import jwt from "jsonwebtoken";

export const authMiddleware = {
  hashPassword: async (password) => {
    //hash password
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  payload: async (data) => {
    const exists = authRepository.getUser(data);
    // token generation
    const payload = {
      email: exists?.email,
      name: exists?.name,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "2d",
    });

    return token;
  },
};
