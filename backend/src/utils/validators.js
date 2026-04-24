import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export const registerSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  password: z.string().regex(PASSWORD_REGEX),
  address: z.string().max(400),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().regex(PASSWORD_REGEX),
});

export const createUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  password: z.string().regex(PASSWORD_REGEX),
  address: z.string().max(400),
  role: z.enum(["ADMIN", "USER", "OWNER"]),
});

export const createStoreSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.number().int().optional(),
});

export const ratingSchema = z.object({
  storeId: z.number().int(),
  rating: z.number().int().min(1).max(5),
});
