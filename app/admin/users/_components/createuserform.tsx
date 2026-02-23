"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";

import { UserSchema, UserFormValues } from "@/app/admin/users/schema";
import { API } from "@/lib/api/endpoints";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const part = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.split("=").slice(1).join("=")) : null;
}

export default function CreateUserForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      role: "user",
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (value: any) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const clearImage = (onChange?: (value: any) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    startTransition(() => {
      (async () => {
        try {
          const token = getCookie("auth_token");
          if (!token) throw new Error("Not logged in (missing auth_token)");

          const fd = new FormData();
          fd.append("fullName", data.fullName);
          fd.append("username", data.username);
          fd.append("email", data.email);
          fd.append("phoneNumber", data.phoneNumber);
          fd.append("password", data.password);
          fd.append("confirmPassword", data.confirmPassword);
          fd.append("role", data.role ?? "user");

          if (data.image) {
            fd.append("image", data.image as File);
          }

          const res = await fetch(`${API_BASE}${API.ADMIN.USERS}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });

          const raw = await res.text();
          let json: any = null;
          try {
            json = raw ? JSON.parse(raw) : null;
          } catch {}

          if (!res.ok) {
            throw new Error(json?.message || raw || `Failed (${res.status})`);
          }

          toast.success("User created ✅");
          reset();
          clearImage();
        } catch (err: any) {
          toast.error(err?.message || "Create user failed");
        }
      })();
    });
  };

  // Helper for consistent input styles
  const inputClasses = "w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white text-gray-800 placeholder:text-gray-400";
  const labelClasses = "block text-sm font-bold text-gray-700 mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-1">
      {/* Profile Picture Upload Section */}
      <div className="flex flex-col items-center sm:items-start gap-4 pb-4 border-b border-gray-50">
        <label className={labelClasses}>Profile Picture</label>
        <div className="flex items-center gap-5">
          {previewImage ? (
            <div className="relative w-20 h-20 group">
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-100"
              />
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
                  <button
                    type="button"
                    onClick={() => clearImage(onChange)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 shadow-md border border-red-50 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                )}
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-emerald-100 group-hover:border-emerald-200 transition-colors">
              <span className="text-emerald-700 text-[10px] font-black uppercase">No Image</span>
            </div>
          )}

          <div className="flex-1">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              )}
            />
            <p className="mt-1.5 text-[10px] text-gray-400 uppercase tracking-wider">JPG, PNG or WEBP. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* Grid for Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input placeholder="John Doe" className={inputClasses} {...register("fullName")} />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.fullName.message)}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Username</label>
          <input placeholder="johndoe123" className={inputClasses} {...register("username")} />
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.username.message)}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Email Address</label>
          <input type="email" placeholder="john@example.com" className={inputClasses} {...register("email")} />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.email.message)}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Phone Number</label>
          <input placeholder="+1 234..." className={inputClasses} {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.phoneNumber.message)}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Account Role</label>
          <select className={inputClasses} {...register("role")}>
            <option value="user">Customer / User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div>
          <label className={labelClasses}>Password</label>
          <input type="password" placeholder="••••••••" className={inputClasses} {...register("password")} />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.password.message)}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={inputClasses}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{String(errors.confirmPassword.message)}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
        >
          {isSubmitting || pending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
}