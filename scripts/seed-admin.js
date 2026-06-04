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
  if (existing) { console.log("Admin already exists."); return; }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { username, passwordHash } });
  console.log(`Admin created — username: ${username}  password: ${password}`);
}

async function seedStudent() {
  const username = "student01";
  const password = "Student@1234";
  const existing = await prisma.student.findUnique({ where: { username } });
  if (existing) { console.log("Student already exists."); return existing; }
  const passwordHash = await bcrypt.hash(password, 12);
  const student = await prisma.student.create({
    data: { username, passwordHash, fullName: "Test Student", grade: "Grade 10" },
  });
  console.log(`Student created — username: ${username}  password: ${password}  grade: Grade 10`);
  return student;
}

async function seedParent(student) {
  const username = "parent01";
  const password = "Parent@1234";

  let parent = await prisma.parent.findUnique({ where: { username } });
  if (!parent) {
    const passwordHash = await bcrypt.hash(password, 12);
    parent = await prisma.parent.create({
      data: { username, passwordHash, fullName: "Test Parent" },
    });
    console.log(`Parent created — username: ${username}  password: ${password}`);
  } else {
    console.log("Parent already exists.");
  }

  if (student) {
    const linked = await prisma.parentChild.findUnique({
      where: { parentId_studentId: { parentId: parent.id, studentId: student.id } },
    });
    if (!linked) {
      await prisma.parentChild.create({ data: { parentId: parent.id, studentId: student.id } });
      console.log(`Parent linked to student: ${student.fullName}`);
    }
  }
  return parent;
}

async function seedSampleMarks(student) {
  const subjects = ["Mathematics", "English", "Science", "Social Studies", "Kiswahili"];
  const terms    = ["Term 1", "Term 2", "Term 3"];
  const gradeFor = (m) => m >= 80 ? "A" : m >= 65 ? "B" : m >= 50 ? "C" : "D";

  for (const name of subjects) {
    await prisma.subject.upsert({ where: { name }, update: {}, create: { name } });
  }

  const baseMarks = { Mathematics: 72, English: 68, Science: 80, "Social Studies": 65, Kiswahili: 75 };
  const trend     = { Mathematics:  4, English:  3, Science:  2, "Social Studies":  5, Kiswahili:  2 };

  for (const subjectName of subjects) {
    const subject = await prisma.subject.findUnique({ where: { name: subjectName } });
    for (let t = 0; t < terms.length; t++) {
      const marks = Math.min(100, baseMarks[subjectName] + trend[subjectName] * t + Math.floor(Math.random() * 5));
      await prisma.mark.upsert({
        where: { studentId_subjectId_term: { studentId: student.id, subjectId: subject.id, term: terms[t] } },
        update: {},
        create: {
          studentId: student.id, subjectId: subject.id, term: terms[t],
          marks, grade: gradeFor(marks),
          teacherRemarks: marks >= 75 ? "Excellent performance" : marks >= 60 ? "Good effort" : "Needs improvement",
        },
      });
    }
  }
  console.log("Sample marks seeded.");
}

async function seedSampleAttendance(student) {
  const statuses  = ["present", "present", "present", "present", "absent", "late"];
  const startDate = new Date("2025-01-06");
  const endDate   = new Date("2025-04-30");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student.id, date: new Date(d) } },
      update: {},
      create: { studentId: student.id, date: new Date(d), status },
    });
  }
  console.log("Sample attendance seeded.");
}

async function main() {
  await seedAdmin();
  const student = await seedStudent();
  await seedParent(student);
  if (student) {
    await seedSampleMarks(student);
    await seedSampleAttendance(student);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
