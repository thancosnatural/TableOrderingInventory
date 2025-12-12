// src/components/BranchComponents/BranchFilterBar.jsx
const BranchFilterBar = ({
  status,
  onStatusChange,
  perPage,
  onPerPageChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Status filter */}
      <div className="flex items-center gap-2">
        <label className="sr-only">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
          aria-label="Filter by status"
        >
          <option value="all">All outlets</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="live">Live</option>
          <option value="not_live">Not Live</option>
        </select>
      </div>

      {/* Per page */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-gray-600">Per page</label>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="py-1 px-2 rounded-md border bg-white shadow-sm"
          aria-label="Items per page"
        >
          {[6, 12, 24, 48].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BranchFilterBar;
