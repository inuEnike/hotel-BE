import { authRepository } from "../repositories/auth.repository.js";
import { Auth } from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { authMiddleware } from "../utils/middlewares/auth.middleware.js";

export const AuthServices = {
  create: async (data) => {
    const { email, name, password } = data;
    if (!email || !name || !password) {
      throw new Error("Please input all fields");
    }
    //check if user exists
    const exists = await Auth.findOne({ email });
    if (exists) {
      throw new Error("User already Exists");
    }

    return authRepository.create({
      name,
      email,
      password: await authMiddleware.hashPassword(password),
    });
  },
  getUser: async (data) => {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error("please input all fields");
    }

    const exists = authRepository.getUser(email);

    const comp = bcrypt.compare(exists?.password, password);

    if (!exists && !comp) {
      throw new Error("Incorrect Credencials");
    }
    await authMiddleware.payload(data);
    return authRepository.getUser();
  },
};
