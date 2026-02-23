"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API } from "@/lib/api/endpoints";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getCookie("auth_token");
      if (!token) {
        setError("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      const res = await fetch(`${API_BASE}${API.ADMIN.USERS}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Failed to create user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-gray-400 shadow-sm";
  const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans antialiased overflow-hidden">
      
      {/* Left Sidebar - Fixed Header Section (visible on large screens) */}
      <div className="lg:w-[400px] xl:w-[450px] bg-white border-r border-gray-100 p-8 lg:p-12 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">G</div>
            <span className="font-black text-xl tracking-tighter text-gray-900">GROCERY<span className="text-emerald-600">ADMIN</span></span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              Create <br />
              <span className="text-emerald-600 underline decoration-emerald-100 decoration-8 underline-offset-4">New User</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xs">
              Onboard a new staff member or customer to the ecosystem.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link 
            href="/admin/users" 
            className="group inline-flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-all"
          >
            <span className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50">←</span>
            BACK TO USER LISTING
          </Link>
        </div>
      </div>

      {/* Right Section - Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-10 lg:px-20 lg:py-20">
        <div className="max-w-4xl mx-auto">
          
          {error && (
            <div className="mb-10 flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-600 border border-red-100 animate-in fade-in zoom-in-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* 1. Profile Upload Section */}
            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">01. Identity Preview</h2>
              <div className="flex items-center gap-8">
                <div className="relative group shrink-0">
                  <div className="h-32 w-32 overflow-hidden rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50/30 shadow-inner">
                    {preview ? (
                      <img src={preview} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-xl group-hover:scale-110 transition-transform cursor-pointer border-4 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h3 className="font-bold text-gray-900 text-lg">Profile Avatar</h3>
                  <p className="text-gray-400 text-sm">Recommended: Square image, max 2MB.</p>
                </div>
              </div>
            </section>

            {/* 2. Personal Details */}
            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">02. Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div className="space-y-1">
                  <label className={labelStyles}>Full Name</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className={inputStyles} required />
                </div>
                <div className="space-y-1">
                  <label className={labelStyles}>Username</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className={inputStyles} required />
                </div>
                <div className="space-y-1">
                  <label className={labelStyles}>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@address.com" className={inputStyles} required />
                </div>
                <div className="space-y-1">
                  <label className={labelStyles}>Phone Number</label>
                  <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={inputStyles} required />
                </div>
              </div>
            </section>

            {/* 3. Role & Security */}
            <section>
              <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">03. Access & Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-8">
                <div className="space-y-1">
                  <label className={labelStyles}>Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputStyles} required />
                </div>
                <div className="space-y-1">
                  <label className={labelStyles}>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputStyles} required />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyles}>Account Permissions</label>
                  <select name="role" value={form.role} onChange={handleChange} className={inputStyles}>
                    <option value="user">Customer Account (User)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Sticky/Floating Submit Action */}
            <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[280px] rounded-2xl bg-emerald-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Registering..." : "Finalize & Register User"}
              </button>
              <button
                type="button"
                onClick={() => setForm({ fullName: "", username: "", email: "", phoneNumber: "", password: "", confirmPassword: "", role: "user" })}
                className="text-xs font-black text-gray-400 hover:text-red-500 tracking-widest uppercase transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}