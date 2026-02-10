// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LoginData, loginSchema } from "../schema";
// import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// export default function LoginForm() {
//   const router = useRouter();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const submit = async (values: LoginData) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // IMPORTANT for cookies
//         body: JSON.stringify(values),
//       });

//       const data = await res.json();
//       console.log("FULL LOGIN RESPONSE:", data);

//       if (!res.ok) {
//         setIsError(true);
//         setMessage(data.message || "Login failed");
//         return;
//       }

//       const token = data.token;
//       const user = data.data || data.user;

//       if (!token || !user) {
//         setIsError(true);
//         setMessage("Invalid login response");
//         return;
//       }

//       const role = user.role?.toLowerCase();
//       console.log("LOGGED IN AS ROLE:", role);

//       // Optional (useful for client-side checks)
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("role", role);

//       setIsError(false);
//       setMessage("Login successful!");

    
//       if (role === "admin") {
//         router.replace("/admin");
//       } else {
//         router.replace("/user/dashboard");
//       }
//     } catch (error) {
//       console.error(error);
//       setIsError(true);
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       {message && (
//         <div
//           className={`mb-4 rounded px-4 py-2 text-sm ${
//             isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(submit)} className="space-y-6">
//         {/* EMAIL */}
//         <div>
//           <label className="block text-sm font-medium mb-1 text-black">
//             Email
//           </label>
//           <div className="relative">
//             <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//             <input
//               {...register("email")}
//               type="email"
//               placeholder="name@example.com"
//               className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//           {errors.email && (
//             <p className="text-xs text-red-500 mt-1">
//               {errors.email.message}
//             </p>
//           )}
//         </div>

//         {/* PASSWORD */}
//         <div>
//           <label className="block text-sm font-medium mb-1 text-black">
//             Password
//           </label>
//           <div className="relative">
//             <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//             <input
//               {...register("password")}
//               type="password"
//               placeholder="••••••"
//               className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//           {errors.password && (
//             <p className="text-xs text-red-500 mt-1">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         <div className="text-sm text-right">
//           <Link href="/forgot-password" className="text-gray-500 hover:underline">
//             Forgot Password?
//           </Link>
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full h-11 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
//         >
//           {isSubmitting ? "Logging in..." : "Log in"}
//         </button>

//         <p className="text-sm text-center text-gray-600">
//           Don’t have an account?{" "}
//           <Link href="/register" className="text-green-600 font-semibold">
//             Create now
//           </Link>
//         </p>
//       </form>
//     </>
//   );
// }



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, loginSchema } from "../schema";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";


function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: LoginData) => {
    try {
      setMessage(null);
      setIsError(false);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        // credentials not required for YOUR Next cookies (we set them manually),
        // but leaving it doesn't hurt if your backend uses cookies too:
        credentials: "include",
      });

      const data = await res.json();
      console.log("FULL LOGIN RESPONSE:", data);

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.message || "Login failed");
        return;
      }

      const token = data?.token;
      const user = data?.data || data?.user;

      if (!token || !user) {
        setIsError(true);
        setMessage("Invalid login response");
        return;
      }

      // ✅ SET COOKIES so (protected)/layout.tsx can read them
      setCookie("auth_token", token);
      setCookie("user_data", JSON.stringify(user));

      // (optional) still useful client-side
      const role = (user?.role ?? "").toString().toLowerCase();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      // ✅ FIX route paths to match your app structure
      if (role === "admin") {
        router.replace("/admin"); // only if you have app/admin/page.tsx
      } else {
        router.replace("/dashboard"); // your file is app/(protected)/dashboard/page.tsx
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {message && (
        <div
          className={`mb-4 rounded px-4 py-2 text-sm ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Email</label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Password</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••"
              className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="text-sm text-right">
          <Link href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-green-600 font-semibold">
            Create now
          </Link>
        </p>
      </form>
    </>
  );
}