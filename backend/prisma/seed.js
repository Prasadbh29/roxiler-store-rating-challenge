import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient, UserRole } = pkg;
const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@storerating.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      name: "System Administrator Account",
      email: adminEmail,
      passwordHash,
      address: "123 Admin Street, Headquarters",
      role: UserRole.ADMIN,
    },
  });

  console.log(`Seeded admin user: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
