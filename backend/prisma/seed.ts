import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminEmail = 'admin@example.com';
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phoneNumber: '+1234567890',
    },
  });
  console.log({ admin });

  // 2. Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      subCategories: {
        create: [
          { name: 'Smartphones' },
          { name: 'Laptops' },
          { name: 'Accessories' },
        ],
      },
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      subCategories: {
        create: [
          { name: 'Men' },
          { name: 'Women' },
        ],
      },
    },
  });
  console.log({ electronics, clothing });

  // 3. Create Products
  // Get a subcategory ID (e.g., Smartphones)
  const smartphones = await prisma.category.findFirst({ where: { name: 'Smartphones' } });
  
  if (smartphones) {
    const product1 = await prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with titanium design.',
        status: ProductStatus.ACTIVE,
        sellerId: admin.id,
        categoryId: smartphones.id,
        variants: {
          create: [
            {
              sku: 'IP15PRO-BLK-128',
              attributes: { color: 'Black', storage: '128GB' },
              price: 999.00,
              stock: 50,
              imageUrl: 'https://placehold.co/600x400/png',
            },
            {
              sku: 'IP15PRO-WHT-256',
              attributes: { color: 'White', storage: '256GB' },
              price: 1099.00,
              stock: 30,
              imageUrl: 'https://placehold.co/600x400/png',
            },
          ],
        },
      },
    });
    console.log({ product1 });
  }

  const laptops = await prisma.category.findFirst({ where: { name: 'Laptops' } });
  if (laptops) {
    const product2 = await prisma.product.create({
      data: {
        name: 'MacBook Air M2',
        description: 'Supercharged by M2 chip.',
        status: ProductStatus.ACTIVE,
        sellerId: admin.id,
        categoryId: laptops.id,
        variants: {
          create: [
            {
              sku: 'MBA-M2-MID',
              attributes: { color: 'Midnight', ram: '8GB', storage: '256GB' },
              price: 1199.00,
              stock: 20,
              imageUrl: 'https://placehold.co/600x400/png',
            },
          ],
        },
      },
    });
    console.log({ product2 });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
