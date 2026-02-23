"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Home, 
  ShoppingCart, 
  Grid, 
  ChevronRight, 
  Leaf, 
  Menu, 
  Calendar, 
  CreditCard 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BACKEND_URL = "http://localhost:5000";

interface OrderProduct {
  product: { _id: string; name: string; image: string; price?: number };
  quantity: number;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  imageUrl:string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusUI = (status: string) => {
    const isConfirmed = status === "confirmed";
    return (
      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        isConfirmed 
          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
          : "bg-amber-50 text-amber-700 border-amber-100"
      }`}>
        {isConfirmed ? <CheckCircle size={12} /> : <Clock size={12} />}
        {status}
      </span>
    );
  };

  return (
   <div className="flex min-h-screen bg-[#F8FAFB] selection:bg-emerald-100">
 
       {/* --- SIDEBAR --- */}
       <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
         <div className="flex flex-col h-full">
           <div className="p-8 flex items-center gap-3">
             <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200">
               <Leaf className="text-white w-6 h-6" />
             </div>
             <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">FreshPicks</h1>
           </div>
 
           <nav className="flex-1 px-4 space-y-2">
             <SidebarLink icon={<Home size={20} />} label="Home" href="/dashboard" active={pathname === "/dashboard"} />
             <SidebarLink icon={<Grid size={20} />} label="Categories" href="/categories" active={pathname === "/categories"} />
             <SidebarLink icon={<ShoppingCart size={20} />} label="My Cart" href="/cart" active={pathname === "/cart"}  />
             <SidebarLink icon={<Package size={20} />} label="Orders History" href="/orders" active={pathname === "/orders"} />
           </nav>
         </div>
       </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile menu button included) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 flex items-center shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 mr-4 hover:bg-slate-100 rounded-xl transition-colors">
            <Menu size={24} className="text-slate-600" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">My Deliveries</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => <div key={i} className="h-48 w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Package size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
                <p className="text-slate-500 mt-2 font-medium">Your shopping history will appear here once you place an order.</p>
                <Link href="/dashboard" className="mt-8 inline-block bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    {/* Order Top Strip */}
                    <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Order ID</p>
                          <p className="text-sm font-bold text-slate-700">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                            <Calendar size={14} className="text-emerald-600" />
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>
                      {getStatusUI(order.status)}
                    </div>

                    {/* Product List */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.products.map((item) => (
                          <div key={item.product._id} className="flex items-center gap-4 p-4 bg-white border border-slate-50 rounded-2xl">
                            <div className="w-16 h-16 bg-emerald-50 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={`${BACKEND_URL}/uploads/products/${item.product.image}`}
                                className="w-full h-full object-cover"
                                alt={item.product.name}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm truncate">{item.product.name}</h4>
                              <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                              <p className="text-xs font-bold text-emerald-600 mt-1">₹{item.product.price || 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Footer */}
                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                            <CreditCard size={14} /> {order.paymentMethod}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-3xl font-black text-slate-800 tracking-tighter">₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, badge, href }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; href: string; }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${active ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 font-bold" : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-sm font-medium tracking-wide">{label}</span>
      </div>
      {badge && (
        <span className={`${active ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'} text-[10px] px-2 py-0.5 rounded-full font-black tracking-tighter`}>
          {badge}
        </span>
      )}
      {!active && !badge && <ChevronRight size={14} className="opacity-20" />}
    </Link>
  );
}