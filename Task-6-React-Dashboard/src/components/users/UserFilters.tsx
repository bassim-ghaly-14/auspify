export type UserSort = 'name-asc' | 'name-desc';

interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sort: UserSort;
  setSort: (value: UserSort) => void;
}

const SORT_OPTIONS: Record<UserSort, string> = {
  'name-asc': 'Name: A to Z',
  'name-desc': 'Name: Z to A',
};

const FIELD_CLASS =
  'h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm text-text shadow-sm outline-none transition-colors ' +
  'placeholder:text-text-muted hover:border-text-secondary/40 ' +
  'focus-visible:border-auspify-primary focus-visible:ring-2 focus-visible:ring-auspify-primary/20';

export function UserFilters({ search, setSearch, sort, setSort }: UserFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(160px,200px)]">
      <div className="min-w-0">
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>

        <input
          id="user-search"
          type="search"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className="min-w-0">
        <label htmlFor="user-sort" className="sr-only">
          Sort order
        </label>

        <select
          id="user-sort"
          value={sort}
          onChange={(event) => setSort(event.currentTarget.value as UserSort)}
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
