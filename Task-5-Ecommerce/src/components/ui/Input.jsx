function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full rounded-xl
        border border-slate-300 bg-white
        px-4 py-3 text-slate-900
        placeholder:text-slate-400
        outline-none transition-colors
        focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20
        dark:border-white/10 dark:bg-white/5 dark:text-white
        dark:placeholder:text-slate-500 dark:focus:border-violet-500
        ${className}
      `}
      {...props}
    />
  )
}

export default Input