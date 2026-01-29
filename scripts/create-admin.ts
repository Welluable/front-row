import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() ?? "Admin";

  if (!email) {
    console.error("Error: ADMIN_EMAIL is required. Set it in .env");
    process.exit(1);
  }
  if (!password) {
    console.error("Error: ADMIN_PASSWORD is required. Set it in .env");
    process.exit(1);
  }

  const prisma = createPrismaClient();

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        passwordHash,
        name,
        role: "admin",
      },
      create: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: "admin",
      },
    });

    console.log(
      `Admin user ${user.id} (${user.email}) has been created or updated.`
    );
  } catch (err) {
    console.error("Failed to create/update admin user:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
