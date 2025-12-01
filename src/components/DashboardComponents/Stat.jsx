const Stat = ({ icon: Icon, label, value, delta }) => {
  const isUp = (delta ?? 0) >= 0;
  return (
    <div className={`rounded border bg-white`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
            {typeof delta === "number" && (
              <div className={`mt-1 text-xs ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                {isUp ? "+" : ""}
                {delta.toFixed(1)}% vs yesterday
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stat