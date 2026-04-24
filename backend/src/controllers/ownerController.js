import { prisma } from "../config/db.js";

export async function ownerDashboard(req, res, next) {
  try {
    const store = await prisma.store.findFirst({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: {
            user: { select: { name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!store) return res.json({ averageRating: null, ratings: [] });

    const averageRating = store.ratings.length
      ? Number((store.ratings.reduce((acc, item) => acc + item.rating, 0) / store.ratings.length).toFixed(1))
      : null;

    return res.json({
      averageRating,
      ratings: store.ratings.map((item) => ({
        id: item.id,
        userName: item.user.name,
        email: item.user.email,
        rating: item.rating,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
}
