const FilterBar = ({ industryOptions, selectedIndustry, onSelectIndustry, perPage, onPerPageChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <label className="sr-only">Industry</label>
        <select
          value={selectedIndustry}
          onChange={(e) => onSelectIndustry(e.target.value)}
          className="py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
          aria-label="Filter by industry"
        >
          {industryOptions.map((opt) => (
            <option value={opt} key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-gray-600">Per page</label>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="py-1 px-2 rounded-md border bg-white shadow-sm"
          aria-label="Items per page"
        >
          {[6, 12, 24, 48].map((n) => (
            <option value={n} key={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;