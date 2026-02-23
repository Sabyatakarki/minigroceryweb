import { cookies } from "next/headers";
import Link from "next/link";
import AdminLogoutButton from "../_components/AdminLogoutButton";


type User = {
  _id: string;
  fullName?: string;
  email: string;
  role: string;
  createdAt?: string;
};

type Product = {
  _id: string;
  name: string;
  price?: number;
  image?: string;
  sold?: number;
};

type ApiUsersResponse = User[] | { data?: User[]; users?: User[]; pagination?: any };
type ApiProductsResponse = { success: boolean; data: Product[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// --- Fetching Logic (Kept your logic) ---
async function fetchAdminUsers(): Promise<User[]> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const res = await fetch(`${API_BASE}/api/admin/users?page=1&size=200`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Users fetch failed: ${res.status}`);
  const data: ApiUsersResponse = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any).data)) return (data as any).data;
  return (data as any).users || [];
}

async function fetchTopProducts(): Promise<Product[]> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;
  const res = await fetch(`${API_BASE}/api/admin/products?top=true&limit=4`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  const data: ApiProductsResponse = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

// --- Main Page Component ---
export default async function AdminDashboardPage() {
  let users: User[] = [];
  let products: Product[] = [];
  let error: string | null = null;

  try {
    [users, products] = await Promise.all([fetchAdminUsers(), fetchTopProducts()]);
  } catch (e: any) {
    error = e?.message || "Error fetching data";
  }

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role?.toLowerCase() === "admin").length;
  const customerCount = users.filter((u) => u.role?.toLowerCase() === "user").length;

  const recentUsers = [...users]
    .sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()))
    .slice(0, 5);

  const previewProducts = products.slice(0, 4);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Enhanced Glassmorphism effect */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-emerald-100 hidden lg:flex flex-col shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Fresh<span className="text-emerald-600">Admin</span>
            </h2>
          </div>
          
          <nav className="space-y-2">
            <SidebarLink href="/admin/dashboard" label="Home" active />
            <SidebarLink href="/admin/users" label="User Management" />
            <SidebarLink href="/admin/products" label="Products" />
            <SidebarLink href="/admin/orders" label="Recent Orders" />
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-emerald-50 bg-emerald-50/30">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content - Shifted for fixed sidebar */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Store <span className="text-emerald-600 italic">Insights</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back, Captain. Here’s what’s happening today.</p>
        </header>

        {error ? (
          <div className="rounded-3xl border-2 border-red-100 bg-red-50 p-8 text-red-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">⚠️</div>
            <div>
              <p className="font-bold text-lg">Connection Issue</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats row - Floating Card Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard title="Total Customers" value={totalUsers} icon="👥" color="emerald" />
              <StatCard title="Active Admins" value={adminCount} icon="🛡️" color="blue" />
              <StatCard title="Consumer Base" value={customerCount} icon="🛒" color="amber" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Recent Users Section */}
              <div className="xl:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-gray-800">New Signups</h2>
                  <Link href="/admin/users" className="text-xs font-bold text-emerald-600 hover:underline">VIEW ALL</Link>
                </div>
                <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-emerald-900/5 border border-emerald-50">
                  <RecentUsersList users={recentUsers} />
                </div>
              </div>

              {/* Top Products Section */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-gray-800">Best Selling Product</h2>
                  <Link href="/admin/products" className="text-xs font-bold text-emerald-600 hover:underline">MANAGE ITEMS</Link>
                </div>
                
                {previewProducts.length === 0 ? (
                  <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-emerald-100">
                    <p className="text-gray-400 font-medium">Your shelves are empty!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {previewProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- High-End UI Subcomponents ---

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-emerald-100 overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150" />
      <div className="relative z-10">
        <div className="text-3xl mb-4">{icon}</div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="mt-1 text-5xl font-black text-gray-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-3xl p-4 flex items-center gap-5 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl">
      <div className="w-24 h-24 rounded-2xl bg-emerald-50 overflow-hidden flex-shrink-0">
        {product.image ? (
          <img
            src={`${API_BASE}/uploads/products/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-200 text-2xl">🥦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-lg truncate">{product.name}</h3>
        <p className="text-emerald-600 font-black text-xl">रु{product.price}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
            {product.sold || 0} Sold
          </span>
        </div>
      </div>
      <Link 
        href={`/admin/products/${product._id}/edit`}
        className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors"
      >
        ✎
      </Link>
    </div>
  );
}

function RecentUsersList({ users }: { users: User[] }) {
  return (
    <div className="divide-y divide-emerald-50">
      {users.map((u) => (
        <div key={u._id} className="py-4 flex items-center gap-4 px-2 hover:bg-emerald-50/50 transition-colors rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
            {u.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">{u.fullName || "Guest User"}</p>
            <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
          </div>
          <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${
            u.role.toLowerCase() === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {u.role.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

function SidebarLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
        active 
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
          : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
      }`}
    >
      {label}
    </Link>
  );
}