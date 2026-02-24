"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, CreditCard, MapPin, Phone, User } from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function CheckoutPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
  });
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart safely in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
    }
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    try {
      setLoading(true);

      // Check login token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      // Check form fields
      if (!form.fullName || !form.phone || !form.street || !form.city) {
        toast.error("Please fill all fields");
        setLoading(false);
        return;
      }

      if (cart.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      // Format products
      const formattedProducts = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      // Send order to backend
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: formattedProducts,
          shippingAddress: form,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");

      // Show success snackbar
      toast.success("Order placed successfully 🌿");

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);

      // Navigate back to cart after 3 seconds
      setTimeout(() => {
        router.push("/cart");
      }, 3000);

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6 relative">
      {/* ✅ Snackbar container */}
      <Toaster position="top-right" />

      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl border border-emerald-100 p-10">

        <h1 className="text-3xl font-black text-emerald-600 mb-8">Checkout</h1>

        {/* Shipping Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<User size={18} />} name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <InputField icon={<Phone size={18} />} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          <InputField icon={<MapPin size={18} />} name="street" placeholder="Street Address" value={form.street} onChange={handleChange} />
          <InputField icon={<MapPin size={18} />} name="city" placeholder="City" value={form.city} onChange={handleChange} />
        </div>

        {/* Order Summary */}
        <div className="mt-10 bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-slate-600 font-medium mt-2">
            <span>Delivery</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="h-[1px] bg-emerald-100 my-4" />

          <div className="flex justify-between text-xl font-black text-emerald-600">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="mt-8 bg-white border border-emerald-100 rounded-2xl p-5 flex items-center gap-3">
          <CreditCard className="text-emerald-600" />
          <p className="font-semibold text-slate-700">Cash on Delivery</p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 shadow-xl shadow-emerald-200 transition disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function InputField({ icon, name, placeholder, value, onChange }: any) {
  return (
    <div className="flex items-center border border-emerald-100 rounded-2xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition">
      <div className="text-emerald-600 mr-3">{icon}</div>
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full outline-none bg-transparent text-slate-700 font-medium"
      />
    </div>
  );
}