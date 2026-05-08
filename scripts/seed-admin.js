require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
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

async function seedStudent() {
  const username = "student01";
  const password = "Student@1234";

  const existing = await prisma.student.findUnique({ where: { username } });
  if (existing) {
    console.log("Student already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.student.create({
    data: {
      username,
      passwordHash,
      fullName: "Test Student",
      grade: "Grade 10",
    },
  });
  console.log(`Student created — username: ${username}  password: ${password}  grade: Grade 10`);
}

async function main() {
  await seedAdmin();
  await seedStudent();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
