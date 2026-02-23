"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API } from "@/lib/api/endpoints";

type User = {
  _id: string;
  email: string;
  username: string;
  fullName?: string;
  phoneNumber?: string;
  role: "user" | "admin";
  createdAt?: string;
};

type UsersResponse = {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(7);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<UsersResponse["pagination"]>({
    page: 1,
    size: 7,
    totalItems: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("size", String(size));
    if (search.trim()) sp.set("search", search.trim());
    return sp.toString();
  }, [page, size, search]);

  async function fetchUsers() {
    setLoading(true);
    setErr(null);

    try {
      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token found.");

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = (await res.json()) as UsersResponse;

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to fetch users");
      }

      setUsers(data.data);
      setPagination(data.pagination);
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [query]);

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to remove this user from the store?")) return;

    try {
      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchUsers();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your <span className="text-emerald-600 font-semibold">{pagination.totalItems}</span> registered shoppers and staff.
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          + Create New User
        </Link>
      </div>

      {/* SEARCH & FILTERS - SIMPLE COLORS */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl">
          <span className="text-sm font-medium text-gray-600">Show:</span>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-transparent font-semibold text-emerald-600 outline-none cursor-pointer"
          >
            {[5, 7, 10, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE SECTION - FLAT STYLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider text-left">
              <th className="px-4 py-4 font-bold">Customer Details</th>
              <th className="px-4 py-4 font-bold">Username</th>
              <th className="px-4 py-4 font-bold">Phone Number</th>
              <th className="px-4 py-4 text-center font-bold">Permissions</th>
              <th className="px-4 py-4 text-right font-bold">Manage</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <span className="text-emerald-600 font-medium">Loading fresh data...</span>
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-red-500 font-medium">
                  ⚠️ {err}
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">{u.fullName || "Member"}</span>
                    <span className="text-xs text-gray-500">{u.email}</span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <span className="text-gray-600 font-mono text-xs">
                    @{u.username}
                  </span>
                </td>
                <td className="px-4 py-5 text-gray-600 font-medium">
                  {u.phoneNumber || "—"}
                </td>
                <td className="px-4 py-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                      u.role === "admin"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="flex justify-end gap-4 font-medium">
                    <Link href={`/admin/users/${u._id}`} className="text-emerald-600 hover:underline">View</Link>
                    <Link href={`/admin/users/${u._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <div className="flex justify-between items-center mt-10">
        <div className="text-gray-500 text-sm font-medium">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Prev
          </button>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}