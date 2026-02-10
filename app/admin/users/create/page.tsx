"use client";

import Link from "next/link";
import { UserPlus, Eye, Edit2, Trash2 } from "lucide-react";

const dummyUsers = [
  { id: "1", fullName: "John Doe", email: "john@example.com", role: "user" },
  { id: "2", fullName: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "3", fullName: "Jane Smith", email: "jane@example.com", role: "user" },
];

export default function AdminUsersPage() {
  return (
    /* Changed bg-orange-50 to bg-white for a full white screen */
    <div className="min-h-screen bg-white p-8">
      {/* Container with soft emerald shadow and white background */}
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50">
        
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
              {dummyUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-emerald-50/30 transition-colors">
                  <td className="py-4 text-sm font-medium text-gray-400">#{u.id}</td>
                  <td className="py-4 text-sm font-bold text-gray-800">{u.fullName}</td>
                  <td className="py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="py-4">
                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/admin/users/${u.id}/edit`}
                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                        onClick={() => {
                          const ok = window.confirm(`Delete user ${u.id}?`);
                          if (ok) alert("Deleted successfully");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between text-sm border-t border-emerald-50 pt-6">
          <span className="text-gray-400 font-medium">Showing <span className="text-gray-700">1</span> of 1 pages</span>
          <div className="flex gap-3">
            <button className="rounded-xl border border-gray-100 px-4 py-2 text-gray-300 cursor-not-allowed font-bold">
              Previous
            </button>
            <button className="rounded-xl border border-emerald-100 px-4 py-2 text-emerald-600 hover:bg-emerald-50 font-bold transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}