function SectionHeader({ title, subtitle, action, label = 'Store' }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-violet-500">
          {label}
        </p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader