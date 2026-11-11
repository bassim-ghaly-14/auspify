export function CardHeader({ title, description, className = '' }: { title: string; description?: string; className?: string }) {
  return (
    <div className={`mb-4 flex flex-col gap-1 ${className}`}>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  )
}