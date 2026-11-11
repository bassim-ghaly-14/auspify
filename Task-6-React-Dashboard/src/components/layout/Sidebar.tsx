import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import type { ElementType } from 'react';
import { LayoutDashboard, ShoppingCart, Users } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: ElementType;
}

const NAVIGATION: NavItem[] = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: ShoppingCart },
  { to: '/users', label: 'Users', icon: Users },
];

interface SidebarProps {
  mobileOpen: boolean;
  isMobile: boolean;
  onSelectItem: () => void;
}

export function Sidebar({ mobileOpen, isMobile, onSelectItem }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    const firstLink = sidebarRef.current?.querySelector<HTMLElement>('a');

    firstLink?.focus();
  }, [mobileOpen, isMobile]);

  return (
    <aside
      ref={sidebarRef}
      id="main-sidebar"
      className={`
        fixed inset-y-0 left-0 z-50
        flex w-64 flex-col
        border-r border-border
        bg-surface shadow-lg
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
      aria-label="Main navigation"
      aria-hidden={isMobile && !mobileOpen}
      inert={isMobile && !mobileOpen}
    >
      <div className="flex min-h-16 items-center border-b border-border px-6">
        <span className="font-semibold tracking-tight text-text">Auspify Insights</span>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onSelectItem}
            className={({ isActive }) => {
              const base = `
                flex items-center gap-3
                rounded-md px-4 py-3
                text-sm font-medium
                transition-colors
                hover:bg-surface-hover
              `;

              return isActive
                ? `${base} bg-auspify-primary-light text-auspify-primary`
                : `${base} text-text-secondary`;
            }}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-6 py-5">
        <p className="text-xs text-text-secondary">v1.0.0 · Demo environment</p>
      </div>
    </aside>
  );
}
