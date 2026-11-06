function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`
        rounded-3xl border border-slate-200 bg-white/80
        shadow-sm backdrop-blur-xl
        dark:border-white/10 dark:bg-white/5 dark:shadow-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard