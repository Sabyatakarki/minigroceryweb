"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { 
  Search, 
  ShoppingCart, 
  Leaf, 
  Menu, 
  X, 
  Home, 
  Grid, 
  Package, 
  Bell, 
  ChevronRight,
  Plus
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  price:number;
  category: string;
  image: string;
}

const BACKEND_URL = "http://localhost:5000";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  // Check if product already in cart
  const existing = cart.find((p: Product) => p._id === product._id);
  if (existing) {
    existing.quantity += 1; // increase quantity
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  toast.success(`${product.name} added to your cart!`);
};


  return (
    <div className="flex min-h-screen bg-[#F8FAFB] selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              FreshPicks
            </h1>
          </div>

            <nav className="flex-1 px-4 space-y-2">
            <SidebarLink
              icon={<Home size={20} />}
              label="Home"active
              href="/"
            />
            <SidebarLink
              icon={<Grid size={20} />}
              label="Categories"
              href="/categories"
            />
            <SidebarLink
              icon={<ShoppingCart size={20} />}
              label="My Cart"
              href="/cart"
              
            />
            <SidebarLink
              icon={<Package size={20} />}
              label="Orders History"
              href="/orders"
            />
          </nav>
        </div>
      </aside>

      {/* --- MAIN SECTION --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- NAVBAR --- */}
        <header className="h-24 bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
              <Menu />
            </button>

            {/* --- IMPROVED SEARCH BAR --- */}
            <div className="relative w-full max-w-xl hidden md:block group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-500 transition-colors group-focus-within:text-emerald-700" />
              </div>
              <input
                type="text"
                placeholder="Search for fresh fruits, vegetables..."
                className="block w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-[1.25rem] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-3 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all duration-200 group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>

            <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>

            {/* Profile Section */}
            <Link href="/user/profile" className="flex items-center gap-3 p-1.5 pr-4 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all shadow-sm hover:shadow-md group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-500 p-0.5 group-hover:rotate-3 transition-transform">
                <img
                  src={`profile.png`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
            
            </Link>
          </div>
        </header>

        {/* --- CONTENT --- */}
        <main className="p-8 lg:p-12">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Popular <span className="text-emerald-600 font-normal italic">Items</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Only the freshest picks for your daily kitchen needs.</p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-[2.5rem] border border-slate-100/50 p-5 transition-all duration-500 hover:shadow-[0_22px_50px_-12px_rgba(16,185,129,0.15)] group hover:-translate-y-1">
                  <div className="relative h-52 w-full mb-6 overflow-hidden rounded-[2rem] bg-emerald-50">
                    <img
                      src={`${BACKEND_URL}/uploads/products/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="font-bold text-slate-800 text-xl mb-1 truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                      {product.name}
                    </h3>
                    <h3 className="font-bold text-slate-800 text-xl mb-1 truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                      ₹{product.price}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
                      {product.quantity} units available
                    </p>
                    
                   <button
                      onClick={() => addToCart(product)}
                      className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95 group/btn"
                    >
                      <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
                      Add to Cart
                    </button>
                    <Toaster position="top-right" reverseOrder={false} />


                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, badge, href }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, href: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${active ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 font-bold" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-sm font-medium tracking-wide">{label}</span>
      </div>
      {badge ? (
        <span className={`${active ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'} text-[10px] px-2 py-0.5 rounded-full font-black tracking-tighter`}>{badge}</span>
      ) : (
        !active && <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
}