import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.util.js";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(
  type = "required" | "required-admin" | "none"
) {
  return async (req, res, next) => {
    try {
      try {
        const token =
          req.headers?.authorization?.replace("Bearer ", "") || null;

        if (token) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          if (Number(decodedToken?.id)) {
            req.user = await prisma.user.findUnique({
              where: {
                id: Number(decodedToken?.id),
                deletedAt: null,
              },
            });
          }
        }
      } catch (err) {
        if (type === "none") {
          return next();
        } else {
          throw new Error(err);
        }
      }

      if (type === "none") {
        return next();
      } else if (type === "required" || type === "required-admin") {
        if (!req.user) throw new Error("Not Authorized");

        if (type === "required") return next();

        if (req.user.isAdmin) return next();

        throw new Error("Only Admins Authorized");
      }
    } catch (err) {
      console.log("Authentication error: ", err.message);
      res.sendStatus(401);
    }
  };
}
