import { cookies } from "next/headers";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Clock 
} from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchProduct(id: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data.data;
}

export default async function ProductView({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const { id } = params;

  let product;
  let error: string | null = null;

  try {
    product = await fetchProduct(id);
  } catch (e: any) {
    error = e?.message || "Failed to fetch product";
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-50">
           <p className="text-red-600 font-bold mb-4">{error}</p>
           <Link href="/categories" className="text-slate-400 text-sm hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      {/* Slim Nav */}
      <nav className="h-16 px-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/categories" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={18} />
          <span className="font-bold text-sm">Back to Shop</span>
        </Link>
        <div className="flex items-center gap-2 opacity-50">
           <Leaf className="text-emerald-600 w-4 h-4" />
           <span className="font-black text-slate-800 text-sm tracking-tighter">FreshPicks</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: COMPACT IMAGE */}
          <div className="md:w-5/12 bg-slate-50 relative p-6 flex items-center justify-center">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner">
              {product.image ? (
                <img
                  src={`${API_BASE}/uploads/products/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-300">
                  <Leaf size={48} />
                </div>
              )}
            </div>
            
            {/* Minimal Badge */}
            <div className="absolute top-10 left-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
              <ShieldCheck className="text-emerald-600" size={12} />
           
            </div>
          </div>

          {/* RIGHT: TIGHT DETAILS */}
          <div className="md:w-7/12 p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1 block">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-2xl font-black text-slate-800">₹{product.price}</span>
                {product.quantity > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Available</span>
                ) : (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Stock Out</span>
                )}
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Premium quality {product.name.toLowerCase()} sourced directly from local organic farms. Guaranteed fresh delivery to your kitchen.
            </p>

            {/* Micro Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><Truck size={14} /></div>
                <span className="text-[11px] font-bold">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><Clock size={14} /></div>
                <span className="text-[11px] font-bold">24h Freshness</span>
              </div>
            </div>

            {/* Compact Action Button */}
            <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            
            <p className="text-center text-slate-300 text-[9px] font-bold uppercase mt-4 tracking-tighter">
              Item ID: {id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}