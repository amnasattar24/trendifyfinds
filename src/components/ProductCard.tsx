import { ExternalLink, Tag } from 'lucide-react';
import type { Product } from '@/types';
import { CATEGORIES } from '@/categories';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );
  const hasDiscount = discountPercent > 0;

  const category = CATEGORIES.find((c) => c.id === product.category);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-magenta-200 hover:shadow-card-hover">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute z-10 mt-3 ml-3 rounded-full bg-gradient-to-r from-magenta-600 to-burgundy-800 px-3 py-1 text-xs font-bold text-white shadow-md">
          {discountPercent}% OFF
        </div>
      )}

      {/* Image Container - uniform height */}
      <div className="h-56 w-full bg-white p-4 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em">No Image</text></svg>';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category tag */}
        <div className="mb-2 flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-burgundy-600" />
          <span className="text-xs font-medium text-burgundy-700">
            {category?.label}
          </span>
          <span className="text-xs text-gray-400">/</span>
          <span className="text-xs text-gray-500">{product.subCategory}</span>
        </div>

        {/* Title - clamped to 2 lines */}
        <h3 className="mb-3 text-sm font-semibold leading-snug text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-burgundy-900">
            ${product.discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* CTA Button - pushed to bottom */}
        <div className="mt-auto">
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg gradient-card-cta px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-glow hover:brightness-110 active:scale-[0.98]"
          >
            <span>Check on Amazon</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
