require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = "admin";
  const password = "Admin@1234";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { username, passwordHash } });
  console.log(`Admin created — username: ${username}  password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
