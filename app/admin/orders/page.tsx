"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Check } from "lucide-react";
import Link from "next/link";
import AdminLogoutButton from "../_components/AdminLogoutButton";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface OrderProduct {
  product: { _id: string; name: string; image?: string; price?: number };
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  
}

interface Order {
  _id: string;
  user: { _id: string; fullName: string };
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  shippingAddress: ShippingAddress; 
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to confirm");
      toast.success("Order confirmed");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-emerald-100 hidden lg:flex flex-col shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Fresh<span className="text-emerald-600">Admin</span>
            </h2>
          </div>
          <nav className="space-y-2">
            <SidebarLink href="/admin/dashboard" label="Home" />
            <SidebarLink href="/admin/users" label="Users" />
            <SidebarLink href="/admin/products" label="Products" />
            <SidebarLink href="/admin/orders" label="Orders" active />
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-emerald-50 bg-emerald-50/30">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <Toaster position="top-right" />
        <h1 className="text-4xl font-black text-gray-900 mb-6">Recent Orders</h1>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-50">
            <p className="text-gray-400 font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-emerald-50 transition-all">
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Products */}
                <div className="divide-y divide-emerald-50">
                  {order.products.map((p) => (
                    <div key={p.product._id} className="flex items-center gap-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{p.product.name}</p>
                        <p className="text-sm text-gray-400">Qty: {p.quantity}</p>
                      </div>
                      <p className="font-bold text-emerald-600">₹{(p.product.price || 0) * p.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="font-semibold text-gray-800 mb-1">Shipping Address</p>
                    <p className="text-gray-600">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.street}, {order.shippingAddress.city}
                    
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-emerald-50">
                  <div className="text-sm text-gray-500">
                    <p>Payment: {order.paymentMethod}</p>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  {order.status !== "confirmed" && (
                    <button
                      onClick={() => confirmOrder(order._id)}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
                    >
                      <Check size={16} /> Confirm
                    </button>
                  )}
                  <p className="text-xl font-black text-emerald-600">₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Sidebar link component
function SidebarLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
        active
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
          : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
      }`}
    >
      {label}
    </Link>
  );
}