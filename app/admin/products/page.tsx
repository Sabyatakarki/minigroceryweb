"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price?: number;
  category?: string;
  quantity?: number;
  image?: string;
  createdAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchProducts(): Promise<Product[]> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];

  const res = await fetch(`${API_BASE}/api/products?page=1&size=200`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch products (${res.status}). ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const pathname = usePathname();

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to delete product (${res.status}). ${text}`);
      }

      alert("Product deleted successfully!");
      loadProducts();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- SIDEBAR --- */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-emerald-100 hidden lg:flex flex-col shadow-sm z-50">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Fresh<span className="text-emerald-600">Admin</span>
            </h2>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarLink href="/admin/dashboard" label="Home" />
            <SidebarLink href="/admin/users" label="User Management" />
            <SidebarLink href="/admin/products" label="Products" active={pathname === "/admin/products"} />
            
            <div className="my-4 border-t border-emerald-50 pt-4">
              <Link
                href="/admin/products/createProduct"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all hover:-translate-y-1"
              >
                <span>+</span> Add New Product
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Product <span className="text-emerald-600">Catalog</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your organic produce and stock levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm text-sm font-bold text-emerald-700">
              Total: {products.length} Items
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-emerald-700 font-bold animate-pulse">Gathering inventory...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border-2 border-red-100 bg-red-50 p-8 text-red-700 flex items-center gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <p className="font-bold text-lg">System Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-emerald-100">
            <p className="text-gray-400 text-lg font-medium">Your warehouse is currently empty.</p>
            <Link href="/admin/products/createProduct" className="mt-4 inline-block text-emerald-600 font-bold hover:underline">
              Add your first product now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-emerald-100 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full mb-5 overflow-hidden rounded-[1.8rem] bg-emerald-50">
                  {product.image ? (
                    <img
                      src={`${API_BASE}/uploads/products/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🥦</div>
                  )}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 px-1">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="font-black text-xl text-gray-800 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h2>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-emerald-600">रु{product.price}</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      Per Unit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase font-black">Quantity </p>
                      <p className={`text-xs font-bold ${product.quantity !== undefined && product.quantity > 10 ? 'text-gray-700' : 'text-orange-600'}`}>
                        {product.quantity ?? 0} left
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase font-black">Listed On</p>
                      <p className="text-xs font-bold text-gray-700">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex-1 bg-emerald-600 text-white-700 font-bold py-3 rounded-2xl text-xs text-center hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                    className={`w-14 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-95 ${
                      deletingId === product._id
                        ? "bg-red-100 text-red-300"
                        : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {deletingId === product._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Icons & Helper Components ---

function SidebarLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
        active 
          ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" 
          : "text-gray-500 hover:bg-emerald-50/50 hover:text-emerald-600"
      }`}
    >
      {label}
    </Link>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}