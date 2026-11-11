export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock';

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  sort: ProductSort;
  setSort: (value: ProductSort) => void;
}

const SORT_OPTIONS: Record<ProductSort, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
  stock: 'Stock: high to low',
};

const FIELD_CLASS =
  'h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm text-text shadow-sm outline-none transition-colors ' +
  'placeholder:text-text-muted hover:border-text-secondary/40 ' +
  'focus-visible:border-auspify-primary focus-visible:ring-2 focus-visible:ring-auspify-primary/20';

export function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
}: ProductFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(160px,200px)_minmax(160px,200px)]">
      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>

        <input
          id="product-search"
          type="search"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className="min-w-0">
        <label htmlFor="product-category" className="sr-only">
          Category filter
        </label>

        <select
          id="product-category"
          value={category}
          onChange={(event) => setCategory(event.currentTarget.value)}
          className={FIELD_CLASS}
        >
          <option value="">All categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label htmlFor="product-sort" className="sr-only">
          Sort order
        </label>

        <select
          id="product-sort"
          value={sort}
          onChange={(event) => setSort(event.currentTarget.value as ProductSort)}
          className={FIELD_CLASS}
        >
          {Object.entries(SORT_OPTIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
