"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, loginSchema } from "../schema";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react"; // Added for the loading spinner


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

      setCookie("auth_token", token);
      setCookie("user_data", JSON.stringify(user));

      const role = (user?.role ?? "").toString().toLowerCase();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      if (role === "admin") {
        router.replace("/admin"); 
      } else {
        router.replace("/dashboard"); 
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
              className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="text-sm text-right">
          <Link href="/forget-password" title="Forget password" className="text-gray-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* THEMED BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-emerald-600 font-semibold">
            Create now
          </Link>
        </p>
      </form>
    </>
  );
}