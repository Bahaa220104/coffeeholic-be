import basicService from "../services/basic.service.js";
import prisma from "../utils/prisma.util.js";
import validateObject from "../utils/validate.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailService from "../services/mail.service.js";
dotenv.config();

async function login(req, res) {
  const data = validateObject(["phone", "password"], req.body);

  if (!data.phone || !data.password)
    throw new Error("Phone and password are required!");

  console.log({
    deletedAt: null,
    ...(data.phone.includes("@")
      ? { email: data.phone }
      : { phone: data.phone }),
  });

  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      ...(data.phone.includes("@")
        ? { email: data.phone }
        : { phone: data.phone }),
    },
    select: {
      phone: true,
      email: true,
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
    ["firstName", "lastName", "phone", "password", "email"],
    req.body
  );

  if (
    !data.phone ||
    !data.email ||
    !data.password ||
    !data.firstName ||
    !data.lastName
  )
    throw new Error(
      "Phone, email, password, first name and last name are all required!"
    );

  data.phone = data.phone.trim();
  data.email = data.email.trim();
  data.password = data.password.trim();
  data.firstName = data.firstName.trim();
  data.lastName = data.lastName.trim();

  const foundUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          phone: data.phone,
        },
        {
          email: data.email,
        },
      ],
      deletedAt: null,
    },
  });

  if (foundUser)
    throw new Error("User with this email or phone already exists.");

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

async function forgotPassword(req, res) {
  const data = req.body;

  if (!data.email?.trim()) {
    throw new Error("Email is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: data.email.trim(),
      deletedAt: null,
    },
  });

  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await mailService.sendMail({
      subject: "Reset Password",
      to: data.email.trim(),
      html: `<div>Follow this link to reset your password <a href="http://localhost:5173/auth/resetpassword/${token}">CLICK HERE</a></div>`,
    });
  }

  res.send("Email sent");
}

async function resetPassword(req, res) {
  const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
  if (!Number(decodedToken?.id))
    throw new Error("Link expired, regenerate a new link in forgot password");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await prisma.user.update({
    where: {
      id: Number(decodedToken.id),
    },
    data: {
      password: hashedPassword,
    },
    select: {
      phone: true,
    },
  });

  return await login(
    { body: { phone: user.phone, password: req.body.password } },
    res
  );
}

export default {
  login,
  register,
  me,
  forgotPassword,
  resetPassword,
};
