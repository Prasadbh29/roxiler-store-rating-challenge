import { prisma } from "../config/db.js";
import { createStoreSchema, createUserSchema } from "../utils/validators.js";
import { hashPassword } from "../utils/auth.js";

export async function getStats(_req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    return res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (error) {
    return next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const payload = createUserSchema.parse(req.body);
    const user = await prisma.user.create({
      data: { ...payload, passwordHash: await hashPassword(payload.password) },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function createStore(req, res, next) {
  try {
    const payload = createStoreSchema.parse(req.body);
    const store = await prisma.store.create({ data: payload });
    return res.status(201).json(store);
  } catch (error) {
    return next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const role = req.query.role || undefined;
    const search = req.query.search || "";
    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, address: true, role: true },
    });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

export async function getStores(req, res, next) {
  try {
    const search = req.query.search || "";
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { ratings: true },
      orderBy: { id: "desc" },
    });
    return res.json(
      stores.map((store) => ({
        ...store,
        averageRating: store.ratings.length
          ? Number((store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1))
          : null,
      })),
    );
  } catch (error) {
    return next(error);
  }
}

export async function getUserDetails(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { ownedStores: { include: { ratings: true } } },
    });
    if (!user) return res.status(404).json({ message: "User not found." });

    const ownerStore = user.ownedStores[0];
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ownerStoreRating: ownerStore?.ratings.length
        ? Number((ownerStore.ratings.reduce((a, b) => a + b.rating, 0) / ownerStore.ratings.length).toFixed(1))
        : null,
    });
  } catch (error) {
    return next(error);
  }
}
