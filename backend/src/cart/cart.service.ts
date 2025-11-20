import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, Product, ProductVariant } from '@prisma/client';

type CartWithItems = Cart & {
  items: (CartItem & {
    variant: ProductVariant & {
      product: Product;
    };
  })[];
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(userId: string): Promise<CartWithItems> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    }
    return cart;
  }

  async addItem(userId: string, variantId: string, quantity: number) {
    const cart = await this.findOrCreate(userId);

    // Check if item exists
    const existingItem = cart.items.find(
      (item) => item.variantId === variantId,
    );

    // Get variant price (simplified, ideally fetch variant)
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) throw new Error('Variant not found');

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          price: variant.price,
        },
      });
    }
  }

  async removeItem(userId: string, itemId: string) {
    // Verify ownership
    const cart = await this.findOrCreate(userId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found in cart');

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}
