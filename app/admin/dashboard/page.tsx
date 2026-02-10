import { cookies } from "next/headers";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

type ApiUsersResponse =
  | User[]
  | {
      data?: User[];
      users?: User[];
    };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchAdminUsers(): Promise<User[]> {
  const cookieStore = cookies();

 const token = (await cookieStore).get("token")?.value;

const cookieHeader = token ? `token=${token}` : "";

  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store", // ensures newly created users appear
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch users (${res.status}). ${text}`);
  }

  const data: ApiUsersResponse = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;

  return [];
}

export default async function AdminDashboardPage() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await fetchAdminUsers();
  } catch (e: any) {
    error = e?.message || "Error fetching users";
  }

  const totalUsers = users.length;
  const adminCount = users.filter(
    (u) => u.role?.toLowerCase() === "admin"
  ).length;
  const customerCount = users.filter(
    (u) => u.role?.toLowerCase() === "user"
  ).length;

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-green-700">
          Mini Grocery Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage users, inventory, and platform access.
        </p>
      </div>

      {error ? (
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow">
          {error}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Total Users"
              value={totalUsers}
              color="bg-green-600"
            />
            <StatCard
              title="Admins"
              value={adminCount}
              color="bg-emerald-600"
            />
            <StatCard
              title="Customers"
              value={customerCount}
              color="bg-lime-600"
            />
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Dashboard Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This dashboard gives you a real-time overview of registered users.
              Any user created from <strong>Admin → Users → Create</strong> will
              appear here instantly after refresh.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`${color} text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition`}
    >
      <h2 className="text-lg font-medium opacity-90">{title}</h2>
      <p className="text-4xl font-extrabold mt-2">{value}</p>
    </div>
  );
}
