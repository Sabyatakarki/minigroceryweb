"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  Menu,
  Home,
  Grid,
  ShoppingCart,
  Package,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const BACKEND_URL = "http://localhost:5000";

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data.data || data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // Group by category
  const groupedProducts = products.reduce((acc: any, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] selection:bg-emerald-100">
    {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">FreshPicks</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <SidebarLink icon={<Home size={20} />} label="Home" href="/dashboard" active={pathname === "/dashboard"} />
            <SidebarLink icon={<Grid size={20} />} label="Categories" href="/categories" active={pathname === "/categories"} />
            <SidebarLink icon={<ShoppingCart size={20} />} label="My Cart" href="/cart" active={pathname === "/cart"} />
            <SidebarLink icon={<Package size={20} />} label="Orders History" href="/orders" active={pathname === "/orders"} />
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800">Shop by Categories</h2>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 space-y-12">
          {Object.keys(groupedProducts).map((category) => (
            <div key={category}>
              {/* CATEGORY HEADER */}
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category}</h2>

              {/* PRODUCTS */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {groupedProducts[category].map((product: Product) => (
                  <div
                    key={product._id}
                    className="w-40 flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-3 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-full h-32 bg-emerald-50 rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={`${BACKEND_URL}/uploads/products/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-semibold text-slate-800 text-xs mb-1 line-clamp-2 h-10">
                      {product.name}
                    </h3>

                    <p className="text-emerald-600 font-bold text-sm mb-2">Rs. {product.price}</p>

                    {/* NEW VIEW BUTTON INSIDE CARD */}
                    <button
                      onClick={() => router.push(`/categories/${product._id}`)}
                      className="w-full py-1 text-white bg-emerald-600 rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, badge, href }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; href: string; }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${active ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 font-bold" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-sm font-medium tracking-wide">{label}</span>
      </div>
      {badge && (
        <span className={`${active ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'} text-[10px] px-2 py-0.5 rounded-full font-black tracking-tighter`}>
          {badge}
        </span>
      )}
      {!active && !badge && <ChevronRight size={14} className="opacity-20" />}
    </Link>
  );
}