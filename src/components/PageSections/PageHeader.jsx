export default function PageHeaderSection({
  title,
  subtitle,
  leftSlot = null,
  rightSlot = null,
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        ) : null}
        {leftSlot}
      </div>

      <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
        {rightSlot}
      </div>
    </header>
  );
}