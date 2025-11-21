import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Fashion Niche...');

  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin User
  const adminEmail = 'admin@store.com';
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Store Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phoneNumber: '+1234567890',
    },
  });

  // 2. Create Categories
  const menCategory = await prisma.category.create({ data: { name: 'Men' } });
  const womenCategory = await prisma.category.create({ data: { name: 'Women' } });
  const accessoriesCategory = await prisma.category.create({ data: { name: 'Accessories' } });
  const newArrivalsCategory = await prisma.category.create({ data: { name: 'New Arrivals' } });

  // 3. Create Products
  const products = [
    {
      name: 'Classic Oxford Shirt',
      description: 'A timeless staple for every wardrobe. Crafted from premium cotton for breathability and comfort.',
      sizeAndFit: 'Regular fit. Model is 6\'1" and wears size M. Fits true to size.',
      categoryId: menCategory.id,
      price: 89,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'OXF-WHT-S',
          attributes: { size: 'S', color: 'White' },
          stock: 10,
          imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'OXF-WHT-M',
          attributes: { size: 'M', color: 'White' },
          stock: 15,
          imageUrl: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'OXF-BLU-M',
          attributes: { size: 'M', color: 'Blue' },
          stock: 12,
          imageUrl: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Slim Fit Chinos',
      description: 'Versatile trousers that bridge the gap between casual and formal. Features a tailored fit.',
      sizeAndFit: 'Slim fit. Tapered leg. Model is 6\'1" and wears size 32.',
      categoryId: menCategory.id,
      price: 120,
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'CHI-KHA-30',
          attributes: { size: '30', color: 'Khaki' },
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'CHI-NVY-32',
          attributes: { size: '32', color: 'Navy' },
          stock: 18,
          imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Merino Wool Sweater',
      description: 'Soft, lightweight, and warm. Perfect for layering in cooler months.',
      sizeAndFit: 'Regular fit. Ribbed cuffs and hem. Model is 6\'1" and wears size M.',
      categoryId: menCategory.id,
      price: 150,
      images: [
        'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'SWT-GRY-M',
          attributes: { size: 'M', color: 'Grey' },
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'SWT-BLK-L',
          attributes: { size: 'L', color: 'Black' },
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Leather Biker Jacket',
      description: 'Iconic style with a modern edge. Made from full-grain leather that ages beautifully.',
      sizeAndFit: 'Slim fit. Cropped length. Model is 6\'1" and wears size M.',
      categoryId: menCategory.id,
      price: 450,
      images: [
        'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'JKT-BLK-M',
          attributes: { size: 'M', color: 'Black' },
          stock: 5,
          imageUrl: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'JKT-BLK-L',
          attributes: { size: 'L', color: 'Black' },
          stock: 8,
          imageUrl: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },

    // WOMEN'S COLLECTION
    {
      name: 'Silk Slip Dress',
      description: 'Effortlessly elegant. This bias-cut dress drapes beautifully for a flattering silhouette.',
      sizeAndFit: 'Bias cut for a fluid fit. Midi length. Model is 5\'9" and wears size S.',
      categoryId: womenCategory.id,
      price: 180,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'DRS-BLK-S',
          attributes: { size: 'S', color: 'Black' },
          stock: 15,
          imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'DRS-CHM-M',
          attributes: { size: 'M', color: 'Champagne' },
          stock: 10,
          imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Oversized Linen Blazer',
      description: 'Relaxed tailoring for the modern woman. Lightweight linen blend perfect for any season.',
      sizeAndFit: 'Oversized fit. Structured shoulders. Model is 5\'9" and wears size S.',
      categoryId: womenCategory.id,
      price: 220,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548624149-f321c7e57420?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'BLZ-BGE-S',
          attributes: { size: 'S', color: 'Beige' },
          stock: 12,
          imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'BLZ-WHT-M',
          attributes: { size: 'M', color: 'White' },
          stock: 14,
          imageUrl: 'https://images.unsplash.com/photo-1548624149-f321c7e57420?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'High-Rise Straight Jeans',
      description: 'Vintage-inspired fit with a flattering high waist and straight leg. 100% organic cotton.',
      sizeAndFit: 'High rise. Straight leg. Ankle length. Model is 5\'9" and wears size 26.',
      categoryId: womenCategory.id,
      price: 110,
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'JNS-BLU-26',
          attributes: { size: '26', color: 'Light Blue' },
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'JNS-BLK-28',
          attributes: { size: '28', color: 'Washed Black' },
          stock: 18,
          imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Cashmere Turtleneck',
      description: 'Luxuriously soft cashmere sweater. A cozy essential for your winter rotation.',
      sizeAndFit: 'Relaxed fit. Dropped shoulders. Model is 5\'9" and wears size S.',
      categoryId: womenCategory.id,
      price: 250,
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'CSH-CAM-S',
          attributes: { size: 'S', color: 'Camel' },
          stock: 8,
          imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'CSH-GRY-M',
          attributes: { size: 'M', color: 'Grey' },
          stock: 10,
          imageUrl: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },

    // ACCESSORIES
    {
      name: 'Minimalist Leather Watch',
      description: 'Clean lines and premium materials. Features a Swiss movement and genuine leather strap.',
      sizeAndFit: 'Case diameter: 40mm. Strap width: 20mm. Adjustable strap length.',
      categoryId: accessoriesCategory.id,
      price: 195,
      images: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'WTC-BLK-OS',
          attributes: { size: 'One Size', color: 'Black/Gold' },
          stock: 30,
          imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Canvas Weekender Bag',
      description: 'Durable canvas construction with leather accents. The perfect companion for short getaways.',
      sizeAndFit: 'Dimensions: 50cm x 30cm x 25cm. Capacity: 35L.',
      categoryId: accessoriesCategory.id,
      price: 145,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'BAG-OLV-OS',
          attributes: { size: 'One Size', color: 'Olive' },
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Classic Wayfarer Sunglasses',
      description: 'Timeless design that suits every face shape. Polarized lenses for maximum protection.',
      sizeAndFit: 'Frame width: 145mm. Lens width: 50mm. Bridge width: 20mm.',
      categoryId: accessoriesCategory.id,
      price: 130,
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'SUN-BLK-OS',
          attributes: { size: 'One Size', color: 'Black' },
          stock: 40,
          imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        },
        {
          sku: 'SUN-TRT-OS',
          attributes: { size: 'One Size', color: 'Tortoise' },
          stock: 35,
          imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Leather Cardholder',
      description: 'Slim and sophisticated. Holds your essentials without the bulk.',
      sizeAndFit: 'Dimensions: 10cm x 7cm. Holds up to 6 cards.',
      categoryId: accessoriesCategory.id,
      price: 55,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606503825008-909a61841008?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        {
          sku: 'CRD-BRN-OS',
          attributes: { size: 'One Size', color: 'Brown' },
          stock: 50,
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        sizeAndFit: p.sizeAndFit,
        status: ProductStatus.ACTIVE,
        sellerId: admin.id,
        categoryId: p.categoryId,
        variants: {
          create: p.variants.map((v) => ({
            sku: v.sku,
            attributes: v.attributes,
            price: p.price,
            stock: v.stock,
            imageUrl: v.imageUrl ?? p.images[0], // Use variant image if available, else product's first image
          })),
        },
        images: {
          create: p.images.map((url, index) => ({
            url,
            order: index,
            altText: p.name,
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // Generate fake data
  // Create Users
  const users: any[] = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        passwordHash: await bcrypt.hash(faker.internet.password(), 10),
        role: Role.CUSTOMER,
      },
    });
    users.push(user);
  }

  // Create Categories
  const categories: any[] = [];
  for (let i = 0; i < 5; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
      },
    });
    categories.push(category);
  }

  // Create Products
  for (let i = 0; i < 20; i++) {
    const seller = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sizeAndFit: faker.lorem.sentence(),
        categoryId: category.id,
        status: ProductStatus.ACTIVE,
      },
    });
    // Product Images
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: faker.image.urlPicsumPhotos(),
        altText: faker.commerce.productName(),
      },
    });
    // Product Variants
    for (let v = 0; v < 3; v++) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: faker.string.uuid(),
          attributes: { color: faker.color.human(), size: faker.commerce.productMaterial() },
          price: Number(faker.commerce.price({ min: 10, max: 500 })),
          stock: faker.number.int({ min: 0, max: 100 }),
          imageUrl: faker.image.urlPicsumPhotos(),
        },
      });
    }
  }

  // Create Addresses
  for (const user of users) {
    await prisma.address.create({
      data: {
        userId: user.id,
        label: 'Home',
        recipientName: user.name,
        phoneNumber: user.phoneNumber ?? faker.phone.number(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        isDefault: true,
      },
    });
  }

  // Create Orders
  for (let i = 0; i < 10; i++) {
    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const address = await prisma.address.findFirst({ where: { userId: user.id } });
    const variants = await prisma.productVariant.findMany({ take: 2 });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: address?.id ?? '',
        totalAmount: variants.reduce((sum, v) => sum + Number(v.price), 0),
        status: 'PENDING',
        items: {
          create: variants.map((variant) => ({
            variantId: variant.id,
            quantity: faker.number.int({ min: 1, max: 3 }),
            priceAtOrder: variant.price,
          })),
        },
      },
    });
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod: 'MIDTRANS',
        status: 'PENDING',
      },
    });
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
