import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const passwordHash = await bycrypt.hash('Password123!', 10);

  await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash: passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash: passwordHash,
      emailVerifiedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
