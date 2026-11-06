const variants = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
  violet: 'bg-violet-500 text-white hover:bg-violet-600',
  danger:
    'border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20',
  ghost:
    'bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
  outline:
    'border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5',
}

function Button({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-2xl px-6 py-3 font-medium
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button