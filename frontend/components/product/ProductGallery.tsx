'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductImage, ProductVariant } from '@/lib/types';

interface ProductGalleryProps {
  images: ProductImage[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  productName: string;
}

export function ProductGallery({
  images,
  variants,
  selectedVariant,
  onVariantSelect,
  productName
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>('');

  // Update active image when selected variant changes
  useEffect(() => {
    if (selectedVariant?.imageUrl) {
      setActiveImage(selectedVariant.imageUrl);
    } else if (images.length > 0 && !activeImage) {
      setActiveImage(images[0].url);
    }
  }, [selectedVariant, images]);

  // Initial fallback
  useEffect(() => {
    if (!activeImage) {
      if (images.length > 0) {
        setActiveImage(images[0].url);
      } else if (variants.length > 0 && variants[0].imageUrl) {
        setActiveImage(variants[0].imageUrl);
      }
    }
  }, [images, variants, activeImage]);

  const productImages = images.map(img => ({
    id: img.id,
    url: img.url,
    altText: img.altText || productName,
    type: 'product' as const,
    variant: null
  }));

  const variantImages = variants
    .filter(v => v.imageUrl)
    .map(v => ({
      id: v.id,
      url: v.imageUrl!,
      altText: `${productName} - ${v.sku}`,
      type: 'variant' as const,
      variant: v
    }));

  const allImages = [...productImages, ...variantImages];

  const handleImageClick = (image: typeof allImages[0]) => {
    setActiveImage(image.url);
    if (image.type === 'variant' && image.variant) {
      onVariantSelect(image.variant);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-3/4 bg-zinc-100 w-full overflow-hidden rounded-lg">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image Available
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {allImages.map((image) => (
          <button
            key={image.id}
            onClick={() => handleImageClick(image)}
            className={`relative aspect-3/4 bg-zinc-100 overflow-hidden border-2 transition-all rounded-md ${activeImage === image.url ? 'border-black ring-1 ring-black' : 'border-transparent hover:border-gray-300'
              }`}
          >
            <Image
              src={image.url}
              alt={image.altText}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
