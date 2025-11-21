export interface ProductVariant {
  id: string;
  sku: string;
  price: number | string;
  stock: number;
  imageUrl: string | null;
  attributes: any;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  createdAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sizeAndFit: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  variants: ProductVariant[];
  images?: ProductImage[];
  reviews?: Review[];
}
