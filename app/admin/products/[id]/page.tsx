// import { cookies } from "next/headers";
// import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// async function fetchProduct(id: string) {
//   const cookieStore = cookies();
//   const token = (await cookieStore).get("auth_token")?.value;

//   const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//     cache: "no-store",
//   });

//   if (!res.ok) throw new Error("Failed to fetch product");
//   const data = await res.json();
//   return data.data;
// }

// export default async function ProductView({ params }: { params: { id: string } }) {
//   let product;
//   let error: string | null = null;

//   try {
//     product = await fetchProduct(params.id);
//   } catch (e: any) {
//     error = e?.message || "Failed to fetch product";
//   }

//   if (error) {
//     return <div className="p-10 text-red-600 font-bold">{error}</div>;
//   }

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//       {product.image && (
//         <img
//           src={`${API_BASE}/uploads/${product.image}`}
//           alt={product.name}
//           className="w-64 h-64 object-cover rounded-xl mb-4"
//         />
//       )}
//       <p>Quantity: {product.quantity}</p>
//       <p>Created At: {new Date(product.createdAt).toLocaleDateString()}</p>

//       <Link
//         href={`/admin/products/edit/${product._id}`}
//         className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg"
//       >
//         Edit Product
//       </Link>
//     </div>
//   );
// }
