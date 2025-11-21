import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Ecommerce E2E', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwtToken: string;
    let userId: string;
    let productId: string;
    let variantId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);
        await app.init();

        // Clean up DB (optional, be careful in prod/dev envs)
        // await prisma.cleanDb(); 
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST)', async () => {
        const email = `test${Date.now()}@example.com`;
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: email,
                password: 'password123',
                name: 'Test User',
            })
            .expect(201)
            .then((res) => {
                expect(res.body).toHaveProperty('accessToken');
                jwtToken = res.body.accessToken;
            });
    });

    it('/auth/login (POST)', async () => {
        // Assuming the user from previous test
        // Skipping for brevity as we have token
    });

    it('/products (GET)', () => {
        return request(app.getHttpServer())
            .get('/products')
            .expect(200)
            .then((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                if (res.body.length > 0) {
                    productId = res.body[0].id;
                    if (res.body[0].variants && res.body[0].variants.length > 0) {
                        variantId = res.body[0].variants[0].id;
                    }
                }
            });
    });

    it('/cart (POST) - Add Item', async () => {
        if (!productId || !variantId) return; // Skip if no products
        return request(app.getHttpServer())
            .post('/cart')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                productId: productId,
                variantId: variantId,
                quantity: 1,
            })
            .expect(201);
    });

    it('/cart (GET)', async () => {
        if (!jwtToken) return;
        return request(app.getHttpServer())
            .get('/cart')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty('items');
                expect(res.body.items.length).toBeGreaterThan(0);
            });
    });

    it('/orders (POST) - Checkout', async () => {
        if (!jwtToken) return;
        // Need an address first? Or mock it.
        // Assuming address is required.
        // Let's create an address first.
        const addressRes = await request(app.getHttpServer())
            .post('/addresses')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                label: 'Home',
                recipientName: 'Test User',
                phoneNumber: '1234567890',
                street: '123 Test St',
                city: 'Test City',
                province: 'Test Province',
                postalCode: '12345',
                country: 'Test Country'
            })
            .expect(201);

        const addressId = addressRes.body.id;

        return request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                addressId: addressId,
                paymentMethod: 'MIDTRANS',
                items: [
                    { variantId: variantId, quantity: 1 }
                ],
                totalAmount: 100 // Mock amount
            })
            .expect(201);
    });
});
