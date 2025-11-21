import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  ProductStatus,
  Role,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type UserRecord = Awaited<ReturnType<typeof prisma.user.create>>;
type CategoryRecord = Awaited<ReturnType<typeof prisma.category.create>>;
type AddressRecord = Awaited<ReturnType<typeof prisma.address.create>>;

const ADMIN_COUNT = 3;
const CUSTOMER_COUNT = 35;
const PRODUCT_COUNT = 500;
const VARIANTS_PER_PRODUCT = 3;
const ORDERS_TO_CREATE = 40;
const CARTS_TO_POPULATE = 20;
const SALT_ROUNDS = 10;

faker.seed(7);

async function resetDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function createAdmins() {
  const adminPassword = await bcrypt.hash('Admin123!', SALT_ROUNDS);
  const adminPayloads = Array.from({ length: ADMIN_COUNT }).map((_, index) => ({
    name: `Admin ${index + 1}`,
    email: `admin${index + 1}@store.com`,
    passwordHash: adminPassword,
    phoneNumber: `+1555000${index}`,
    role: Role.ADMIN,
  }));

  return Promise.all(adminPayloads.map((data) => prisma.user.create({ data })));
}

async function createCustomers() {
  return Promise.all(
    Array.from({ length: CUSTOMER_COUNT }).map(async (_, index) =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: `customer${index + 1}@store.com`,
          phoneNumber: `+628${(100000000 + index).toString()}`,
          passwordHash: await bcrypt.hash('Customer123!', SALT_ROUNDS),
          role: Role.CUSTOMER,
        },
      })
    )
  );
}

async function createCategories() {
  const baseCategories = ['Men', 'Women', 'Accessories', 'New Arrivals'];
  const generated = Array.from({ length: 6 }).map((_, idx) => `${faker.commerce.department()} ${idx + 1}`);
  const names = Array.from(new Set([...baseCategories, ...generated]));

  const categories: CategoryRecord[] = [];
  for (const name of names) {
    const category = await prisma.category.create({ data: { name } });
    categories.push(category);
  }
  return categories;
}

function buildVariantPayloads(basePrice: number, imagePool: string[]) {
  return Array.from({ length: VARIANTS_PER_PRODUCT }).map(() => ({
    sku: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
    attributes: {
      color: faker.color.human(),
      size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']),
    },
    price: (basePrice + faker.number.int({ min: 0, max: 30 })).toFixed(2),
    stock: faker.number.int({ min: 5, max: 150 }),
    imageUrl: faker.helpers.arrayElement(imagePool),
  }));
}

async function createProducts(admins: { id: string }[], categories: { id: string }[]) {
  const imageLibrary = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  ];

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const seller = admins[i % admins.length];
    const category = faker.helpers.arrayElement(categories);
    const name = faker.commerce.productName();
    const basePrice = Number(faker.commerce.price({ min: 25, max: 500 }));
    const selectedImages = faker.helpers.arrayElements(imageLibrary, faker.number.int({ min: 2, max: 4 }));
    const variants = buildVariantPayloads(basePrice, selectedImages);

    const productData: Prisma.ProductCreateInput = {
      user: { connect: { id: seller.id } },
      category: { connect: { id: category.id } },
      name,
      description: faker.commerce.productDescription(),
      sizeAndFit: faker.lorem.sentence(),
      status: ProductStatus.ACTIVE,
      variants: {
        create: variants,
      },
      images: {
        create: selectedImages.map((url, index) => ({
          url,
          order: index,
          altText: name,
        })),
      },
    };

    await prisma.product.create({ data: productData });

    if ((i + 1) % 50 === 0) {
      console.log(`Created ${i + 1} / ${PRODUCT_COUNT} products`);
    }
  }
}

async function createAddresses(customers: { id: string; name: string; phoneNumber: string | null }[]) {
  const addresses: AddressRecord[] = [];
  for (const customer of customers) {
    const address = await prisma.address.create({
      data: {
        user: { connect: { id: customer.id } },
        label: 'Home',
        recipientName: customer.name,
        phoneNumber: customer.phoneNumber ?? faker.phone.number(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        isDefault: true,
      },
    });
    addresses.push(address);
  }
  return addresses;
}

async function createCarts(customers: { id: string }[]) {
  const variants = await prisma.productVariant.findMany({
    take: 200,
    select: { id: true, price: true },
  });

  const cartsToCreate = faker.helpers.arrayElements(customers, Math.min(CARTS_TO_POPULATE, customers.length));
  for (const customer of cartsToCreate) {
    const cart = await prisma.cart.create({ data: { user: { connect: { id: customer.id } } } });
    const items = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < items; i++) {
      const variant = faker.helpers.arrayElement(variants);
      await prisma.cartItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          variant: { connect: { id: variant.id } },
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: variant.price,
        },
      });
    }
  }
}

async function createOrders(customers: { id: string }[]) {
  const variants = await prisma.productVariant.findMany({
    select: { id: true, price: true },
  });

  for (let i = 0; i < ORDERS_TO_CREATE; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const address = await prisma.address.findFirst({ where: { userId: customer.id } });
    if (!address) {
      continue;
    }

    const itemCount = faker.number.int({ min: 1, max: 4 });
    const selectedVariants = faker.helpers.arrayElements(variants, Math.min(itemCount, variants.length));
    const orderItems = selectedVariants.map((variant) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      return {
        variant: { connect: { id: variant.id } },
        quantity,
        priceAtOrder: variant.price,
      };
    });

    const totalAmount = orderItems.reduce((sum, item, index) => {
      const variantPrice = selectedVariants[index].price;
      const priceNumber = new Prisma.Decimal(variantPrice).toNumber();
      return sum + priceNumber * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: customer.id } },
        address: { connect: { id: address.id } },
        totalAmount: new Prisma.Decimal(totalAmount.toFixed(2)),
        status: faker.helpers.arrayElement([
          OrderStatus.PENDING,
          OrderStatus.PAID,
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
        ]),
        items: {
          create: orderItems,
        },
      },
    });

    await prisma.payment.create({
      data: {
        order: { connect: { id: order.id } },
        paymentMethod: faker.helpers.arrayElement([
          PaymentMethod.MIDTRANS,
          PaymentMethod.STRIPE,
          PaymentMethod.PAYPAL,
          PaymentMethod.OVO,
          PaymentMethod.SHOPEEPAY,
        ]),
        status: faker.helpers.arrayElement([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED]),
      },
    });
  }
}

async function main() {
  console.log('Starting seed...');
  await resetDatabase();

  const admins = await createAdmins();
  console.log(`Created ${admins.length} admin users`);

  const customers = await createCustomers();
  console.log(`Created ${customers.length} customer users`);

  const categories = await createCategories();
  console.log(`Created ${categories.length} categories`);

  await createProducts(admins, categories);
  console.log(`Created ${PRODUCT_COUNT} products with variants and images`);

  const addresses = await createAddresses(customers);
  console.log(`Created ${addresses.length} addresses`);

  await createCarts(customers);
  console.log(`Created carts with items for ${CARTS_TO_POPULATE} customers`);

  await createOrders(customers);
  console.log(`Created ${ORDERS_TO_CREATE} orders with payments`);

  console.log('Seeding finished.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
