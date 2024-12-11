import basicService from "../services/basic.service.js";
import prisma from "../utils/prisma.util.js";
import validateObject from "../utils/validate.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function login(req, res) {
  const data = validateObject(["phone", "password"], req.body);

  if (!data.phone || !data.password)
    throw new Error("Phone and password are required!");

  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      phone: data.phone,
    },
    select: {
      phone: true,
      password: true,
      id: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(data.password, user.password);

  if (!validPassword) {
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.send({ token });
}

async function register(req, res) {
  const data = validateObject(
    ["firstName", "lastName", "phone", "password"],
    req.body
  );

  if (!data.phone || !data.password || !data.firstName || !data.lastName)
    throw new Error(
      "Phone, password, first name and last name are all required!"
    );

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await basicService.createSingle("user", {
    ...data,
    password: hashedPassword,
  });

  await login(req, res);
}

async function me(req, res) {
  res.send(req.user);
}

export default {
  login,
  register,
  me,
};
