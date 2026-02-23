"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  quantity: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token = getCookie("auth_token");
        if (!token) throw new Error("No auth token found.");

        const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const raw = await res.text();
        let json: any = null;

        try {
          json = raw ? JSON.parse(raw) : null;
        } catch {}

        if (!res.ok) throw new Error(json?.message || raw || "Failed to fetch product");
        if (!json?.success) throw new Error(json?.message || "Failed to fetch product");

        setProduct(json.data);
      } catch (e: any) {
        setErr(e?.message || "Something went wrong");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-gray-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Details</h1>
          <p className="text-gray-500 mt-1">
            View and manage this inventory item
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>

          {id && (
            <Link
              href={`/admin/products/${id}/edit`}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Edit Product
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <p className="text-emerald-600 font-medium animate-pulse">
            Loading product...
          </p>
        </div>
      )}

      {!loading && err && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          ⚠️ {err}
        </div>
      )}

      {!loading && !err && product && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: IMAGE */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm text-center">
              {product.image ? (
                <img
                  src={`${API_BASE}/uploads/products/${product.image}`}
                  alt={product.name}
                  className="h-64 w-full object-cover rounded-xl"
                />
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="lg:col-span-2 space-y-4">
            <InfoCard label="Product Name" value={product.name} />
            <InfoCard label="Quantity Available" value={String(product.quantity)} />
            <InfoCard
              label="Created On"
              value={
                product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "—"
              }
            />
            <InfoCard
              label="Last Updated"
              value={
                product.updatedAt
                  ? new Date(product.updatedAt).toLocaleString()
                  : "—"
              }
            />
            <InfoCard label="Product ID" value={product._id} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-semibold text-gray-800 break-words">
        {value}
      </p>
    </div>
  );
}
