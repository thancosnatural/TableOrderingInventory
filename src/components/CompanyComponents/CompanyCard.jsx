// const CompanyCard = ({ company, onEdit, onView }) => {
//   return (
//     <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
//       <div className="flex items-start gap-3">
//         <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
//           {company.name.split(" ").slice(0,2).map(w => w[0]).join("")}
//         </div>
//         <div className="flex-1">
//           <h3 className="text-sm font-semibold text-gray-900 truncate">{company.name}</h3>
//           <p className="mt-1 text-xs text-gray-500">{company.industry} • {company.location}</p>
//         </div>
//         <div className="text-xs text-gray-400 self-start">{company.employees} emp</div>
//       </div>

//       <div className="mt-4 flex items-center justify-between gap-2">
//         <div className="flex items-center gap-2">
//           {company.verified ? (
//             <span className="px-2 py-1 text-xs bg-green-50 rounded-full text-green-700">Verified</span>
//           ) : (
//             <span className="px-2 py-1 text-xs bg-yellow-50 rounded-full text-yellow-700">Unverified</span>
//           )}
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => onView(company)} className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50">View</button>
//           <button onClick={() => onEdit(company)} className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:opacity-95">Edit</button>
//         </div>
//       </div>
//     </article>
//   );
// }

// export default CompanyCard;



// src/components/CompaniesTable.jsx
import React from "react";

function CompaniesTable({
  companies = [],           // default to empty array to avoid .map on undefined
  onEdit = () => {},
  onView = () => {},
  loading = false,         // optional prop to show loading state
}) {
  // safe helper to render initials
  const getInitials = (name) => {
    if (!name) return "--";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Industry</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employees</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                Loading companies...
              </td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                No companies found.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company?.id ?? company?.name ?? Math.random()} className="hover:bg-gray-50 transition">
                {/* Company / Initials */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                      {getInitials(company?.name)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{company?.name ?? "—"}</div>
                    </div>
                  </div>
                </td>

                {/* Industry */}
                <td className="px-4 py-3 text-sm text-gray-700">{company?.industry ?? "—"}</td>

                {/* Location */}
                <td className="px-4 py-3 text-sm text-gray-700">{company?.location ?? "—"}</td>

                {/* Employees */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  {typeof company?.employees === "number" ? `${company.employees} emp` : (company?.employees ?? "—")}
                </td>

                {/* Verified */}
                <td className="px-4 py-3">
                  {company?.verified ? (
                    <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full">
                      Unverified
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onView(company)}
                    className="text-sm px-3 py-1 border rounded-md mr-2 hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(company)}
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:opacity-90"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CompaniesTable;
