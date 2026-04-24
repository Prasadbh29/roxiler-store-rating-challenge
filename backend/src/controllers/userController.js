import { prisma } from "../config/db.js";
import { ratingSchema } from "../utils/validators.js";

export async function listStoresForUser(req, res, next) {
  try {
    const search = req.query.search || "";
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { ratings: true },
      orderBy: { name: "asc" },
    });

    return res.json(
      stores.map((store) => {
        const mine = store.ratings.find((r) => r.userId === req.user.id);
        const average = store.ratings.length
          ? Number((store.ratings.reduce((acc, item) => acc + item.rating, 0) / store.ratings.length).toFixed(1))
          : null;
        return {
          id: store.id,
          name: store.name,
          address: store.address,
          overallRating: average,
          myRating: mine?.rating || null,
          myRatingId: mine?.id || null,
        };
      }),
    );
  } catch (error) {
    return next(error);
  }
}

export async function createRating(req, res, next) {
  try {
    const payload = ratingSchema.parse(req.body);
    const exists = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId: payload.storeId } },
    });
    if (exists) return res.status(409).json({ message: "You already rated this store." });

    const created = await prisma.rating.create({
      data: { userId: req.user.id, storeId: payload.storeId, rating: payload.rating },
    });
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

export async function updateRating(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = ratingSchema.partial().parse(req.body);
    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating || rating.userId !== req.user.id) {
      return res.status(404).json({ message: "Rating not found." });
    }
    const updated = await prisma.rating.update({
      where: { id },
      data: { rating: payload.rating },
    });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}
