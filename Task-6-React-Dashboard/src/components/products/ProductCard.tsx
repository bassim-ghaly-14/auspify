import { Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { formatCurrency, LOW_STOCK_THRESHOLD } from '@/utils/formatters';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

interface CategoryStyle {
  background: string;
  color: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  beauty: {
    background: 'bg-pink-100',
    color: 'text-pink-800',
  },
  fragrances: {
    background: 'bg-violet-100',
    color: 'text-violet-800',
  },
  skincare: {
    background: 'bg-rose-100',
    color: 'text-rose-800',
  },
  'skin-care': {
    background: 'bg-rose-100',
    color: 'text-rose-800',
  },
  groceries: {
    background: 'bg-emerald-100',
    color: 'text-emerald-800',
  },
  food: {
    background: 'bg-green-100',
    color: 'text-green-800',
  },
  furniture: {
    background: 'bg-amber-100',
    color: 'text-amber-900',
  },
  home: {
    background: 'bg-orange-100',
    color: 'text-orange-800',
  },
  'home-decoration': {
    background: 'bg-orange-100',
    color: 'text-orange-800',
  },
  'kitchen-accessories': {
    background: 'bg-teal-100',
    color: 'text-teal-800',
  },
  electronics: {
    background: 'bg-blue-100',
    color: 'text-blue-800',
  },
  smartphones: {
    background: 'bg-indigo-100',
    color: 'text-indigo-800',
  },
  laptops: {
    background: 'bg-sky-100',
    color: 'text-sky-800',
  },
  tablets: {
    background: 'bg-fuchsia-100',
    color: 'text-fuchsia-800',
  },
  'mobile-accessories': {
    background: 'bg-cyan-100',
    color: 'text-cyan-900',
  },
  clothing: {
    background: 'bg-red-100',
    color: 'text-red-800',
  },
  fashion: {
    background: 'bg-pink-100',
    color: 'text-pink-800',
  },
  'mens-shirts': {
    background: 'bg-indigo-100',
    color: 'text-indigo-800',
  },
  'mens-shoes': {
    background: 'bg-sky-100',
    color: 'text-sky-800',
  },
  'mens-watches': {
    background: 'bg-slate-200',
    color: 'text-slate-800',
  },
  tops: {
    background: 'bg-purple-100',
    color: 'text-purple-800',
  },
  'womens-bags': {
    background: 'bg-amber-100',
    color: 'text-amber-900',
  },
  'womens-dresses': {
    background: 'bg-rose-100',
    color: 'text-rose-800',
  },
  'womens-jewellery': {
    background: 'bg-yellow-100',
    color: 'text-yellow-900',
  },
  'womens-shoes': {
    background: 'bg-violet-100',
    color: 'text-violet-800',
  },
  'womens-watches': {
    background: 'bg-purple-100',
    color: 'text-purple-800',
  },
  accessories: {
    background: 'bg-orange-100',
    color: 'text-orange-800',
  },
  sunglasses: {
    background: 'bg-yellow-100',
    color: 'text-yellow-900',
  },
  automotive: {
    background: 'bg-zinc-200',
    color: 'text-zinc-800',
  },
  motorcycle: {
    background: 'bg-red-100',
    color: 'text-red-800',
  },
  vehicle: {
    background: 'bg-neutral-200',
    color: 'text-neutral-800',
  },
  sports: {
    background: 'bg-lime-100',
    color: 'text-lime-900',
  },
  'sports-accessories': {
    background: 'bg-green-100',
    color: 'text-green-800',
  },
};

const STOCK_VARIANTS = {
  'In stock': 'success',
  'Low stock': 'warning',
  'Out of stock': 'error',
} as const;

function getCategoryStyle(category: string): CategoryStyle {
  const normalizedCategory = category.trim().toLowerCase();

  return (
    CATEGORY_STYLES[normalizedCategory] ?? {
      background: 'bg-auspify-primary-light',
      color: 'text-auspify-primary',
    }
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const stockStatus =
    product.stock === 0
      ? 'Out of stock'
      : product.stock <= LOW_STOCK_THRESHOLD
        ? 'Low stock'
        : 'In stock';

  const categoryStyle = getCategoryStyle(product.category);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden rounded-lg bg-surface-hover">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Category Badge */}
        <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]">
          <Badge
            size="md"
            className={`
              max-w-full
              border-transparent
              ${categoryStyle.background}
              ${categoryStyle.color}
              uppercase
              tracking-wide
              shadow-sm
            `}
          >
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col gap-2 pt-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-relaxed text-text">
          {product.title}
        </h3>

        {/* Price & Rating */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-base font-bold text-text">{formatCurrency(product.price)}</span>

          <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
            <Star size={14} aria-hidden="true" className="fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Stock Status */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs text-text-muted">Stock status</span>

          <Badge variant={STOCK_VARIANTS[stockStatus]} size="sm" dot>
            {stockStatus}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
