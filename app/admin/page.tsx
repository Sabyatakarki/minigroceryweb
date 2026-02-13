"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  LogOut, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  TrendingUp, 
  Settings 
} from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9F8]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
            <p className="text-gray-500 font-medium">Welcome back, {user.fullName.split(' ')[0]} 👋</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("user"); router.replace("/login"); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-bold hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">1,284</p>
                  <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg mt-2 inline-block">+12% this week</span>
                </div>
                <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-10">
                  <ShoppingBag size={120} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Revenue</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">$14,200</p>
                  <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg mt-2 inline-block">Store Profit</span>
                </div>
              </div>
            </div>

            {/* Main Action Area */}
            <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-200">
              <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-bold mb-3">User Directory</h2>
                <p className="text-emerald-100/80 mb-6 text-sm leading-relaxed">
                  Manage your staff accounts, adjust permissions, and monitor store activity from the centralized user database.
                </p>
                <Link 
                  href="/admin/users"
                  className="inline-flex items-center gap-2 bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  <Users size={18} />
                  Open User Manager
                  <ArrowRight size={16} />
                </Link>
              </div>
              <Users className="absolute -right-10 -bottom-10 text-emerald-800 w-64 h-64 opacity-20" />
            </div>
          </div>

          {/* Right Column: Profile & System */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full bg-emerald-50 rounded-[2rem] flex items-center justify-center border-2 border-emerald-100 shadow-inner">
                  <UserIcon className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-xl border-4 border-white">
                  <ShieldCheck size={16} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{user.fullName}</h3>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  {user.role} Access
                </span>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <Settings className="text-gray-400" size={20} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Settings</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-red-400 hover:text-red-500">
                  <LogOut size={20} />
                  <span className="text-[10px] font-bold uppercase">Logout</span>
                </button>
              </div>
            </div>

            {/* Mini Activity Feed Placeholder */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recent System Logs</h4>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 items-start text-xs">
                    <div className="w-2 h-2 bg-emerald-200 rounded-full mt-1 shrink-0" />
                    <p className="text-gray-500 leading-tight">
                      <span className="font-bold text-gray-700 text-xs block">New Inventory Entry</span>
                      Added 50 units of Organic Apples.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}