"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const linkClass = (path: string) =>
    `group flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-200 
     ${
       isActive(path)
         ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 translate-x-1"
         : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
     }`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-[1600px] min-w-0">
        
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-slate-100 bg-white min-h-screen sticky top-0">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black">
                F
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                Fresh<span className="text-emerald-600">Cart</span>
              </h2>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Management Portal
            </p>
          </div>

          <nav className="px-6 pb-6 space-y-1.5">
            <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              <span>Dashboard</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive("/admin/dashboard") ? "bg-white" : "bg-transparent"}`} />
            </Link>

            <Link href="/admin/users" className={linkClass("/admin/users")}>
              <span>Users & Staff</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive("/admin/users") ? "bg-white" : "bg-transparent"}`} />
            </Link>

            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              <span>Live Orders</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive("/admin/orders") ? "bg-white" : "bg-transparent"}`} />
            </Link>

            <Link href="/admin/inventory" className={linkClass("/admin/inventory")}>
              <span>Inventory</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive("/admin/inventory") ? "bg-white" : "bg-transparent"}`} />
            </Link>
          </nav>

          <div className="mt-auto p-6">
            <div className="rounded-[2rem] bg-slate-900 p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-all" />
              <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">
                System Tip
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Manage user permissions via the <span className="text-white font-bold underline decoration-emerald-500 underline-offset-4">Users</span> tab to update staff roles.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px] font-black">F</div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  FreshPicks
                </p>
              </div>

              <Link
                href="/admin/users"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-100"
              >
                Menu
              </Link>
            </div>
          </div>

          <main className="min-w-0 px-6 sm:px-10 lg:px-16 py-10 bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}