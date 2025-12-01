export const SimpleTooltip = ({ active, payload, label, valueFormatter = (v) => v }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow">
        <div className="font-medium text-gray-800">{label}</div>
        <div className="text-gray-600 mt-0.5">{valueFormatter(payload[0].value)}</div>
      </div>
    );
  }
  return null;
}