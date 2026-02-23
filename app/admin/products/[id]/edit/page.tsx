"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, Upload, Save, 
  Tag, Box, DollarSign, Image as ImageIcon,
  Leaf
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const token = document.cookie.split("; ").find((row) => row.startsWith("auth_token="))?.split("=")[1];
        const res = await axios.get(`${API_BASE}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setName(data.name);
        setQuantity(data.quantity);
        setPrice(data.price || "");
        setCurrentImageUrl(data.image ? `${API_BASE}/uploads/products/${data.image}` : null);
      } catch (err) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("auth_token="))?.split("=")[1];
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", String(quantity));
      formData.append("price", String(price));
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`${API_BASE}/api/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      router.push("/admin/products");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-emerald-800/40 font-bold tracking-tighter animate-pulse text-sm uppercase">Refreshing Inventory</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFCFB] text-emerald-950 font-sans selection:bg-emerald-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-emerald-50 px-8 py-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-all group border border-emerald-100/50"
            >
              <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-10 w-[1px] bg-emerald-100 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-500 fill-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Console</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-emerald-950">Update Product</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 text-sm font-bold text-emerald-800/40 hover:text-emerald-600 transition-all rounded-2xl hover:bg-emerald-50/50"
            >
              Discard
            </button>
            <button 
              form="edit-form"
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 text-white rounded-[1.25rem] font-bold text-sm shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
              {submitting ? "Processing..." : <><Save size={18} strokeWidth={2.5}/> Confirm Changes</>}
            </button>
          </div>
        </div>
      </nav>

      {/* Container resized to max-w-6xl for better focus */}
      <main className="max-w-6xl mx-auto p-8 lg:p-16">
        <form id="edit-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar: Image Only */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white p-5 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(6,78,59,0.1)] border border-emerald-50 relative group">
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200 z-10 border-2 border-white">
                <ImageIcon size={20} />
              </div>
              
              <div className="aspect-square bg-emerald-50/30 rounded-[2.5rem] overflow-hidden border border-emerald-50 group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                <img 
                  src={previewUrl || currentImageUrl || "/placeholder.png"} 
                  className="w-full h-full object-cover p-2" 
                  alt="Product" 
                />
              </div>

              <label className="mt-6 w-full flex items-center justify-center gap-3 py-4 px-4 bg-emerald-600 text-emerald-50 rounded-[1.5rem] text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-800 transition-all duration-300 shadow-xl shadow-emerald-900/20">
                <Upload size={16} /> Update New Image
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1">
            {/* Added deep shadow here */}
            <section className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-emerald-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Tag size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-emerald-950 tracking-tight">Core Attributes</h3>
                  <p className="text-sm text-emerald-900/40 font-medium">Define the main properties of your grocery item</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="group">
                  <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                    Product Title
                  </label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-8 py-6 bg-emerald-50/20 border border-emerald-100/50 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-emerald-950 font-black placeholder:text-emerald-200 text-xl shadow-inner"
                    placeholder="Fresh Spinach Leaves..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                      Market Price
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-100/80 text-emerald-700 rounded-xl">
                        <DollarSign size={16} strokeWidth={3} />
                      </div>
                      <input 
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full pl-16 pr-8 py-6 bg-emerald-50/20 border border-emerald-100/50 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-emerald-950 font-black text-lg shadow-inner"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-emerald-800/30 uppercase tracking-[0.3em] mb-4 ml-2 group-focus-within:text-emerald-600 transition-colors">
                      Inventory Count
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-100/80 text-emerald-700 rounded-xl">
                        <Box size={16} strokeWidth={3} />
                      </div>
                      <input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
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