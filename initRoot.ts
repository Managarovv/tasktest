import {PrismaClient} from '@prisma/client'
import 'dotenv/config'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ROOT_ADMIN_EMAIL;
  const password = process.env.ROOT_ADMIN_PASSWORD;
  const name = process.env.ROOT_ADMIN_NAME ?? "Root";

  if (!email || !password) {
    throw new Error("ROOT_ADMIN_EMAIL and ROOT_ADMIN_PASSWORD must be set in .env");
  }

  const existingRoot = await prisma.admin.findFirst({
    where: { role: 'ROOT' },
  });

  if (existingRoot) {
    console.log("Root admin already exists. Skipping.");
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      name,
      email,
      password: hash,
      role: "ROOT",
    },
  });

  console.log("Root admin created successfully.");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());