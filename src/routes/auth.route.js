import express from "express";
import authController from "../controllers/auth.controller.js";
import tryCatch from "../utils/tryCatch.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/auth/login", tryCatch(authController.login));
router.post("/auth/register", tryCatch(authController.register));
router.get(
  "/users/me",
  authMiddleware("required"),
  tryCatch(authController.me)
);

export default router;