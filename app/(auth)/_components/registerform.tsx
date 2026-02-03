"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterData, registerSchema } from "../schema";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { setAuthToken, setUserData } from "../../../lib/cookies";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = async (values: RegisterData) => {
    try {
      const payload = {
        username: values.username,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Registration failed");
        return;
      }

      if (data.token) await setAuthToken(data.token);
      if (data.data) await setUserData(data.data);

      setIsError(false);
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
      console.error(error);
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

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* USERNAME */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Username:
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...formRegister("username")}
              className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Full Name:
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...formRegister("fullName")}
              className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.fullName.message}
            </p>
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
              {...formRegister("email")}
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
              {...formRegister("phoneNumber")}
              className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber.message}
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
              {...formRegister("password")}
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

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Confirm Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...formRegister("confirmPassword")}
              type="password"
              className="w-full h-11 rounded-md border border-green-700 pl-10 pr-3 text-sm text-black focus:outline-none"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {isSubmitting ? "Creating..." : "Create Account Now"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 font-semibold">
            Log in.
          </Link>
        </p>
      </form>
    </>
  );
}