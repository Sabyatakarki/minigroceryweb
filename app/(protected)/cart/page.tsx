"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBasket,
  ArrowRight,
  ShoppingCart,
  Leaf,
  Menu,
  Home,
  Grid,
  Package,
  Clock,
  ChevronRight,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Product {
  _id: string;
  name: string;
  image: string;
  category: String;
  quantity: number;
  price?: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.error("Item removed from your basket");
  };

  const changeQuantity = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  // ✅ Just navigate to orderDetail page, no backend
  const handleOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowModal(false);
    window.location.href = "/orderDetail";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] selection:bg-emerald-100">
      <Toaster position="top-right" />

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
            <SidebarLink icon={<ShoppingCart size={20} />} label="My Cart" href="/cart" active={pathname === "/cart"} badge={cart.length > 0 ? cart.length.toString() : undefined} />
            <SidebarLink icon={<Package size={20} />} label="Orders History" href="/orders" active={pathname === "/orders"} />
          </nav>
        </div>
      </aside>

      {/* --- MAIN SECTION --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800">Shopping Basket</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold uppercase tracking-widest">
            <Clock size={16} /> Fast Delivery: 25-40 Mins
          </div>
        </header>

        <main className="p-6 lg:p-12 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center max-w-2xl mx-auto">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBasket size={48} className="text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your basket is empty</h2>
              <p className="text-slate-500 mt-3 font-medium">Looks like you haven't added any fresh produce yet.</p>
              <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95">
                Go Shopping <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-7xl mx-auto">
              {/* --- Items List --- */}
              <div className="xl:col-span-8 space-y-6">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-lg font-bold text-slate-800">Items ({cart.length})</h3>
                  <button onClick={() => { localStorage.removeItem("cart"); setCart([]); }} className="text-xs font-bold text-rose-500 hover:underline">Clear Basket</button>
                </div>
                {cart.map((item) => (
                  <div key={item._id} className="group bg-white rounded-[2rem] border border-slate-100 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                    <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-50">
                      <img
                        src={`${BACKEND_URL}/uploads/products/${item.image}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.name}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                          <p className="text-sm font-bold text-emerald-600 italic">Fresh Stock</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                          <button onClick={() => changeQuantity(item._id, -1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><Minus size={16} /></button>
                          <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                          <button onClick={() => changeQuantity(item._id, 1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><Plus size={16} /></button>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Subtotal</p>
                          <p className="text-2xl font-black text-slate-800">₹{(item.price || 0) * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Summary Sidebar --- */}
              <div className="xl:col-span-4">
                <div className="sticky top-32 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Bag Subtotal</span>
                      <span className="text-slate-800 font-bold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span className="flex items-center gap-1">Delivery Fee <Clock size={14}/></span>
                      <span className="text-emerald-600 font-bold">₹{deliveryFee}</span>
                    </div>
                    
                    <div className="h-[1px] bg-slate-100 my-2" />
                    
                    <div className="flex justify-between items-end">
                      <span className="text-slate-800 font-bold">Total Amount</span>
                      <span className="text-3xl font-black text-emerald-600 tracking-tight">₹{total}</span>
                    </div>

                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 mt-6">
                      <div className="flex items-center gap-3 text-emerald-800 mb-2">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Safe Delivery</span>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-medium">Your groceries are hand-picked and sanitized before being shipped.</p>
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-bold text-lg flex justify-center items-center gap-3 transition-all shadow-xl shadow-emerald-200 active:scale-[0.98]"
                    >
                      Checkout <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="text-emerald-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Checkout</h2>
            <p className="text-slate-500 font-medium mb-8">
              You've chosen <span className="text-slate-800 font-bold">Cash on Delivery</span>. Our rider will collect the total amount upon arrival.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleOrder}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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