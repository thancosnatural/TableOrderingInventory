export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between p-4 border-b">
      <div>
        <div className="text-sm text-gray-500">{subtitle}</div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

