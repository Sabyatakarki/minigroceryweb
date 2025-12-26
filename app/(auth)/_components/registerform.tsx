"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import {UserIcon,EnvelopeIcon,PhoneIcon,LockClosedIcon,} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = async (values: RegisterData) => {
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">

      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Full name:
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            {...register("name")}
            className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

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
            className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium mb-1 text-black">
          Phone No:
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
          />
        </div>
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
            className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 mt-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Create Account Now
      </button>

      {/* LOGIN LINK */}
      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-green-600 font-semibold">
          Log in.
        </Link>
      </p>
    </form>
  );
}
