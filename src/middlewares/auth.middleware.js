import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.util.js";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(
  type = "required" | "required-admin" | "none"
) {
  return async (req, res, next) => {
    try {
      if (type === "none") return next();

      const token = req.headers?.authorization?.replace("Bearer ", "") || null;
      if (!token) {
        throw new Error("Token is required");
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!Number(decodedToken?.id)) {
        throw new Error("Invalid token");
      }

      req.user = await prisma.user.findUnique({
        where: {
          id: Number(decodedToken?.id),
          deletedAt: null,
        },
      });

      if (!req.user) throw new Error("User not found");

      if (type === "required-admin" && !req.user.isAdmin) {
        throw new Error("Admin permissions required");
      }

      return next();
    } catch (err) {
      console.log("Authentication error: ", err.message);
      res.sendStatus(401);
    }
  };
}
