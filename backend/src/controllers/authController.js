import { prisma } from "../config/db.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../utils/validators.js";
import { comparePassword, hashPassword, signToken } from "../utils/auth.js";

export async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const { name, email, address, password } = payload;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        role: "USER",
        passwordHash: await hashPassword(password),
      },
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: sanitize(user),
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
export async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });
    const matched = await comparePassword(payload.password, user.passwordHash);
    if (!matched) return res.status(401).json({ message: "Invalid credentials." });
    return res.json({ token: signToken(user), user: sanitize(user) });
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const payload = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const matched = await comparePassword(payload.currentPassword, user.passwordHash);
    if (!matched) return res.status(400).json({ message: "Current password is incorrect." });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: await hashPassword(payload.newPassword) },
    });
    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    return next(error);
  }
}

function sanitize(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
}
