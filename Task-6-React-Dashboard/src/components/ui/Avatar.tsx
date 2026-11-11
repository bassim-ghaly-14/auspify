import { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
};

const AVATAR_COLORS = [
  'from-blue-500/20 to-cyan-500/20 text-blue-700',
  'from-violet-500/20 to-purple-500/20 text-violet-700',
  'from-emerald-500/20 to-teal-500/20 text-emerald-700',
  'from-amber-500/20 to-orange-500/20 text-amber-700',
  'from-rose-500/20 to-pink-500/20 text-rose-700',
  'from-indigo-500/20 to-sky-500/20 text-indigo-700',
  'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-700',
  'from-lime-500/20 to-green-500/20 text-green-700',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';

  const firstPart = parts[0] ?? '';
  const lastPart = parts[parts.length - 1] ?? '';

  if (parts.length === 1) {
    return Array.from(firstPart).slice(0, 2).join('').toUpperCase();
  }

  const firstInitial = Array.from(firstPart)[0] ?? '';
  const lastInitial = Array.from(lastPart)[0] ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;

  for (const char of name.trim().toLowerCase()) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0;
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  const hasImage = Boolean(src?.trim()) && !imageFailed;

  return (
    <div
      role="img"
      aria-label={name ? `${name}'s avatar` : 'User avatar'}
      className={`
        relative inline-flex shrink-0 items-center justify-center
        overflow-hidden rounded-full
        border border-border/70
        bg-linear-to-br
        font-semibold tracking-wide
        select-none
        shadow-sm
        ring-1 ring-black/3
        transition-shadow duration-200
        ${SIZE_CLASSES[size]}
        ${avatarColor}
        ${className}
      `}
    >
      {hasImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
