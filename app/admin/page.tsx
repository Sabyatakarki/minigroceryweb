"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Settings, LogOut, Users, ShieldCheck } from "lucide-react";

interface User {
  fullName: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }

    const parsedUser = JSON.parse(userStr);
    if (parsedUser.role !== "admin") {
      router.replace("/user/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Main Card Container */}
      <div className="w-full max-w-sm bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 transition-all hover:shadow-[0_20px_60px_rgba(16,185,129,0.1)]">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100/50">
              <UserIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">System Management</p>
        </div>

        {/* User Details Badge */}
        <div className="bg-emerald-50/50 rounded-2xl p-5 mb-8 text-center border border-emerald-100/30">
          <h2 className="font-bold text-gray-800 text-lg leading-tight">{user.fullName}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <span className="inline-block mt-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700 bg-emerald-100 rounded-full">
            {user.role}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/admin/users"
            className="group flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-200 active:scale-95"
          >
            <span className="font-semibold text-sm">Manage Users</span>
            <Users className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/dashboard"
            className="flex items-center justify-between w-full bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 text-gray-600 font-semibold px-6 py-4 rounded-2xl transition-all"
          >
            
           
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.replace("/login");
            }}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 font-bold py-2 text-xs uppercase tracking-widest transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" /> Sign out of account
          </button>
        </div>
      </div>
    </div>
  );
}