import { useEffect, useState } from 'react';
import { Menu, X, RefreshCw, CalendarDays, Clock3 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface TopBarProps {
  mobileOpen: boolean;
  onToggleMenu: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

function getCurrentDateTime() {
  return new Date();
}

export function TopBar({ mobileOpen, onToggleMenu, onRefresh, refreshing }: TopBarProps) {
  const [currentDate, setCurrentDate] = useState(getCurrentDateTime);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(getCurrentDateTime());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormatter.format(currentDate);
  const formattedTime = timeFormatter.format(currentDate);
  const [time, period] = formattedTime.split(' ');

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/90 px-3 shadow-sm backdrop-blur-sm sm:px-6">
      {/* Mobile Navigation */}
      <button
        type="button"
        onClick={onToggleMenu}
        className="flex shrink-0 items-center justify-center rounded-md border border-border p-2 text-text-secondary transition-colors hover:bg-surface-hover md:hidden"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        aria-controls="main-sidebar"
      >
        {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>

      {/* Dynamic Date & Time */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
        {/* Date */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-md bg-auspify-primary-light text-auspify-primary sm:flex">
            <CalendarDays size={19} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-text sm:text-base">
              {formattedDate}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted sm:text-xs">
              Current Date
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden h-9 w-px bg-border sm:block" />

        {/* Time */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-md bg-auspify-primary-light text-auspify-primary sm:flex">
            <Clock3 size={19} aria-hidden="true" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <time
                className="font-mono text-base font-bold tabular-nums tracking-tight text-text sm:text-xl"
                dateTime={currentDate.toISOString()}
              >
                {time}
              </time>
              <span className="text-[10px] font-bold uppercase tracking-wider text-auspify-primary sm:text-xs">
                {period}
              </span>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted sm:text-xs">
              Local Time
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar Actions & User */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label={refreshing ? 'Refreshing data' : 'Refresh data'}
          title="Refresh data"
        >
          <RefreshCw size={16} aria-hidden="true" className={refreshing ? 'animate-spin' : ''} />
        </Button>

        <div className="hidden flex-col items-end md:flex">
          <span className="text-sm font-semibold text-text">Demo User</span>
          <span className="text-xs text-text-muted">auspify.demo@example.test</span>
        </div>

        <Avatar name="Demo User" className="shrink-0" />
      </div>
    </header>
  );
}
