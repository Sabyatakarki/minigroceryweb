"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Upload, Plus, 
  Tag, Box, DollarSign, Image as ImageIcon,
  Leaf, Info
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function CreateProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(""); // Added price field
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Handle image preview cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token found.");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("price", price);
      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFCFB] text-emerald-950 font-sans selection:bg-emerald-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-emerald-50 px-8 py-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/products"
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-all group border border-emerald-100/50"
            >
              <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="h-10 w-[1px] bg-emerald-100 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-500 fill-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Console</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-emerald-950">Add New Item</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="submit"
              form="create-form"
              disabled={loading}
              className="px-8 py-3 bg-emerald-600 text-white rounded-[1.25rem] font-bold text-sm shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? "Publishing..." : <><Plus size={18} strokeWidth={2.5}/> Add to Store</>}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 lg:p-16">
        <form id="create-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar: Image Upload & Preview */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white p-5 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(6,78,59,0.1)] border border-emerald-50 relative group">
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200 z-10 border-2 border-white">
                <ImageIcon size={20} />
              </div>
              
              <div className="aspect-square bg-emerald-50/30 rounded-[2.5rem] overflow-hidden border border-emerald-50 flex items-center justify-center relative">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    className="w-full h-full object-cover p-2" 
                    alt="Preview" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-emerald-200">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image Selected</span>
                  </div>
                )}
              </div>

              <label className="mt-6 w-full flex items-center justify-center gap-3 py-4 px-4 bg-emerald-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-700 transition-all duration-300 shadow-xl shadow-emerald-600/20">
                <Upload size={16} /> {previewUrl ? "Change Image" : "Upload Image"}
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" required />
              </label>
            </div>

            <div className="mt-8 px-8 py-6 rounded-[2.5rem] bg-emerald-50/30 border border-emerald-100/50 flex flex-col items-center text-center">
              <Info size={20} className="text-emerald-400 mb-3" />
              <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Stock Guidance</h4>
              <p className="text-[11px] leading-relaxed text-emerald-900/50 font-semibold px-4">
                Ensure image is clear. New products appear at the top of the shop feed.
              </p>
            </div>
          </div>

          {/* Main Form Fields */}
          <div className="flex-1">
            <section className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-emerald-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
              {err && (
                <div className="mb-10 bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-bold flex items-center gap-3 border border-red-100">
                  ⚠️ {err}
                </div>
              )}

              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Tag size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-emerald-950 tracking-tight">Product Details</h3>
                  <p className="text-sm text-emerald-900/40 font-medium">Categorize and name your new inventory</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="group">
                  <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                    Official Product Name
                  </label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-8 py-6 bg-emerald-50/20 border border-emerald-100/50 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-emerald-950 font-black placeholder:text-grey-100 text-xl shadow-inner"
                    placeholder="e.g. Organic Apples"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                      Retail Price
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-100/80 text-emerald-700 rounded-xl">
                        <DollarSign size={16} strokeWidth={3} />
                      </div>
                      <input 
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-16 pr-8 py-6 bg-emerald-50/20 border border-emerald-100/50 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-emerald-950 font-black text-lg shadow-inner"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                      Initial Stock
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-100/80 text-emerald-700 rounded-xl">
                        <Box size={16} strokeWidth={3} />
                      </div>
                      <input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full pl-16 pr-8 py-6 bg-emerald-50/20 border border-emerald-100/50 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-emerald-950 font-black text-lg shadow-inner"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}