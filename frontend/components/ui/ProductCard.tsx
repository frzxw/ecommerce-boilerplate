import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { WishlistButton } from '@/components/product/WishlistButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get the first variant to display default price and image
  const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const price = defaultVariant ? Number(defaultVariant.price).toFixed(2) : 'N/A';
  const imageUrl = defaultVariant?.imageUrl || 'https://placehold.co/600x800/png';

  return (
    <div className="group block relative">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[0.75] w-full overflow-hidden bg-gray-100 mb-4">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Quick Add Button (Visible on Hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-sm border border-black">
              View Details
            </button>
          </div>
        </div>
      </Link>
      
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <Link href={`/products/${product.id}`} className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-black group-hover:underline decoration-1 underline-offset-4 truncate">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-black shrink-0">${price}</p>
        </div>
        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
      </Link>
    </div>
  );
}
