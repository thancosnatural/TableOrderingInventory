// // src/components/RBACComponents/PermissionsTab.jsx
// import React from "react";
// import { ShieldCheck, Pencil } from "lucide-react";
// import { PERMISSIONS } from "@/components/RBACComponents/PermissionModel";
// import { RolePermissionForm } from "@/components/UserComponents/RolePermissionForm";

// export default function PermissionsTab({
//   canEditRoles,
//   rolesConfigState,
//   roleCounts,
//   getRoleLabel,
//   getRoleDescription,
//   existingRoleKeys,
//   handleCreateRole,
//   editingRoleConfig,
//   editingPerms,
//   setEditingRoleKey,
//   handleUpdateRole,
// }) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-5 items-start">
//       {/* Left: roles overview (cards + edit buttons) */}
//       <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//         <div className="flex items-center justify-between gap-2">
//           <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//             <ShieldCheck size={16} />
//             Roles Overview
//           </h2>
//           <span className="text-[11px] text-slate-500">
//             Snapshot of all roles and user counts.
//           </span>
//         </div>

//         {rolesConfigState.length === 0 ? (
//           <div className="text-xs text-slate-500">No roles defined yet.</div>
//         ) : (
//           <div className="space-y-3">
//             {rolesConfigState.map((r) => (
//               <div
//                 key={r.key}
//                 className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
//               >
//                 <div>
//                   <div className="text-xs font-semibold text-slate-900">
//                     {getRoleLabel(r.key)}{" "}
//                     <span className="text-[10px] text-slate-400">
//                       ({r.key})
//                     </span>
//                   </div>
//                   <div className="text-[11px] text-slate-500">
//                     {getRoleDescription(r.key)}
//                   </div>
//                   <div className="mt-1 text-[11px] text-slate-500">
//                     Users:{" "}
//                     <span className="font-semibold text-slate-800">
//                       {r.user_count}
//                     </span>
//                   </div>
//                 </div>
//                 {canEditRoles && (
//                   <button
//                     type="button"
//                     onClick={() => setEditingRoleKey(r.key)}
//                     className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] hover:bg-slate-800"
//                   >
//                     <Pencil size={11} />
//                     Edit
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Right: create new role and permissions */}
//       <RolePermissionForm
//         mode="create"
//         permissionsModel={PERMISSIONS}
//         canEdit={canEditRoles}
//         existingRoleKeys={existingRoleKeys}
//         onSubmit={handleCreateRole}
//       />

//       {/* EDIT ROLE MODAL */}
//       {editingRoleConfig && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-5">
//             <RolePermissionForm
//               mode="edit"
//               permissionsModel={PERMISSIONS}
//               canEdit={canEditRoles}
//               existingRoleKeys={existingRoleKeys}
//               initialRoleConfig={editingRoleConfig}
//               initialPerms={editingPerms}
//               onSubmit={handleUpdateRole}
//               onCancel={() => setEditingRoleKey(null)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// src/components/RBACComponents/PermissionsTab.jsx
import React from "react";
import { ShieldCheck, Pencil } from "lucide-react";
import RoleForm from "./RoleForm";

export default function PermissionsTab({
  canEditRoles,
  rolesConfigState,
  getRoleLabel,
  getRoleDescription,
  existingRoleKeys,
  handleCreateRole,    // (config, apiData) => void
  editingRoleConfig,   // role object being edited
  setEditingRoleKey,   // (key | null) => void
  handleUpdateRole,    // (config, apiData) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-5 items-start">
      {/* Left: roles overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={16} />
            Roles Overview
          </h2>
          <span className="text-[11px] text-slate-500">
            Snapshot of all roles and user counts.
          </span>
        </div>

        {rolesConfigState.length === 0 ? (
          <div className="text-xs text-slate-500">No roles defined yet.</div>
        ) : (
          <div className="space-y-3">
            {rolesConfigState.map((r) => (
              <div
                key={r.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    {getRoleLabel(r.key)}{" "}
                    <span className="text-[10px] text-slate-400">
                      ({r.key})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {getRoleDescription(r.key)}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Users:{" "}
                    <span className="font-semibold text-slate-800">
                      {r.user_count ?? 0}
                    </span>
                  </div>
                </div>

                {canEditRoles && (
                  <button
                    type="button"
                    onClick={() => setEditingRoleKey(r.key)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] hover:bg-slate-800"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right: create new role */}
      <RoleForm
        mode="create"
        canEdit={canEditRoles}
        existingRoleNames={rolesConfigState.map((r) => r.name)}
        onSubmit={handleCreateRole}
      />


      {/* Edit Role Modal */}
      {editingRoleConfig && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-5">
            <RoleForm
              mode="edit"
              canEdit={canEditRoles}
              existingRoleNames={rolesConfigState.map((r) => r.name)}
              initialRoleConfig={editingRoleConfig}
              onSubmit={handleUpdateRole}
              onCancel={() => setEditingRoleKey(null)}
            />

          </div>
        </div>
      )}
    </div>
  );
}
