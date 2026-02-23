"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "@/lib/api/endpoints";

type User = {
  _id: string;
  fullName?: string;
  email: string;
  username: string;
  phoneNumber?: string;
  role: "user" | "admin";
  imageUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "user" as "user" | "admin",
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const token = getCookie("auth_token");
        if (!token) throw new Error("No auth token found. Please login again.");

        const res = await fetch(`${API_BASE}${API.ADMIN.USERS}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const raw = await res.text();
        let json: any = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch {}

        if (!res.ok) {
          throw new Error(json?.message || raw || "Failed to fetch user");
        }

        const fetchedUser: User = json?.data || json?.user || json;

        setFormData({
          fullName: fetchedUser.fullName || "",
          email: fetchedUser.email || "",
          phoneNumber: fetchedUser.phoneNumber || "",
          role: (fetchedUser.role as any) || "user",
        });

        if (fetchedUser.imageUrl) {
          const baseUrl = API_BASE.replace(/\/$/, "");
          const imgPath = fetchedUser.imageUrl.startsWith("/")
            ? fetchedUser.imageUrl
            : `/${fetchedUser.imageUrl}`;
          setPreview(`${baseUrl}${imgPath}?t=${Date.now()}`);
        } else {
          setPreview(null);
        }
      } catch (err: any) {
        alert(err?.message || "Failed to load user");
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);

      const token = getCookie("auth_token");
      if (!token) throw new Error("No auth token found. Please login again.");

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("role", formData.role);

      if (file) data.append("image", file);

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const raw = await res.text();
      let json: any = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        throw new Error(json?.message || raw || "Failed to update user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Synchronizing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="px-6 lg:px-12 xl:px-20 py-10 lg:py-16">
        
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => router.back()} 
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Registration</span>
            </button>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Edit <span className="text-emerald-600">Profile</span>
            </h1>
          </div>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            
            <div className="lg:col-span-4 space-y-8">
              <div className="relative group">
                <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-emerald-500/50 transition-all shadow-inner">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-200 text-7xl font-black">?</div>
                  )}

                  <label className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Identity Image</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Access Level</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN: DATA FIELDS */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Legal Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 hover:bg-emerald-700 hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Registration...
                    </>
                  ) : (
                    "Commit Changes"
                  )}
                </button>
                <p className="mt-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Secure Modification • Changes are logged
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}