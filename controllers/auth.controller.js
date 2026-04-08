import { AuthServices } from "../services/auth.service.js";
import { authMiddleware } from "../utils/middlewares/auth.middleware.js";

export const AuthController = {
  signUp: async (req, res, next) => {
    try {
      const data = req.body;

      const auth = await AuthServices.create(data);

      return res.status(201).json({
        success: true,
        message: "User created Successfully",
        data: auth,
      });
    } catch (error) {
      next(error);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const data = req.body;

      const auth = AuthServices.getUser(data);
      if (auth) {
        res.status(200).json({
          success: true,
          data: authMiddleware.payload(),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
