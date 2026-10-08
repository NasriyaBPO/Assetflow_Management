import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // 1. Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with full inventory management access',
    },
  });

  await prisma.role.upsert({
    where: { name: 'ASSET_MANAGER' },
    update: {},
    create: {
      name: 'ASSET_MANAGER',
      description: 'Manages asset assignment, returns, repairs and retirement',
    },
  });

  await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
      description: 'Employee with access to assigned asset information',
    },
  });

  // 2. Initial admin login
  const adminEmail = 'admin@assetflow.com';
  const adminPassword = 'Admin@123';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: adminEmail,
      passwordHash,
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });