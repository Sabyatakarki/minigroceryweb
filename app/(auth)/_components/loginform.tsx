"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Email
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Password
        </label>
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            {...register("password")}
            type="password"
            placeholder="••••••"
            className="w-full h-11 rounded-md border border-gray-300 pl-10 pr-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* FORGOT PASSWORD */}
      <div className="text-sm text-right">
        <Link href="/forgot-password" className="text-gray-500 hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* BUTTON */}
      <button
        disabled={isSubmitting || pending}
        className="w-full h-11 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      {/* SIGN UP */}
      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <Link href="/register" className="text-green-600 font-semibold">
          Create now
        </Link>
      </p>
    </form>
  );
}
/////