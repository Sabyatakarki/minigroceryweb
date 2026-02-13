import Link from "next/link";
import { UserPlus, Eye, Edit2, Trash2 } from "lucide-react";

// Server-side data fetching
async function getUsers() {
  const res = await fetch("http://localhost:5000/api/admin/users", {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

// Server Component
export default async function AdminUsersPage() {
  let users: any[] = [];

  try {
    const data = await getUsers();
    users = data.users || [];
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              User Management
            </h1>
            <p className="mt-1 text-sm text-emerald-600 font-medium">
              Admin Control Panel
            </p>
          </div>

          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </Link>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-gray-400 font-bold">
                <th className="py-4 border-b border-emerald-50">ID</th>
                <th className="py-4 border-b border-emerald-50">Full Name</th>
                <th className="py-4 border-b border-emerald-50">Email</th>
                <th className="py-4 border-b border-emerald-50">Role</th>
                <th className="py-4 border-b border-emerald-50 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-emerald-50">
              {users.length > 0 ? (
                users.map((u: any) => (
                  <tr key={u.id} className="group hover:bg-emerald-50/30 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-400">#{u.id}</td>
                    <td className="py-4 text-sm font-bold text-gray-800">{u.firstName} {u.lastName}</td>
                    <td className="py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="py-4">
                      <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full">
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/users/${u.id}`} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/users/${u.id}/edit`} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
