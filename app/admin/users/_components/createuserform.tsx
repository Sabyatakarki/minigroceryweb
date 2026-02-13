"use client";

import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { Camera, X, User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";

export default function CreateUserForm() {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
  });

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: UserData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('firstName', data.firstName || '');
        formData.append('lastName', data.lastName || '');
        formData.append('email', data.email);
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        if (data.image) formData.append('image', data.image);

        const response = await handleCreateUser(formData);

        if (!response.success) throw new Error(response.message);

        toast.success(response.message || 'User created successfully');
        reset();
        handleDismissImage();
        router.push('/admin/users');
      } catch (error: any) {
        toast.error(error.message || 'Create user failed');
      }
    });
  };

  return (
    <div className="w-full bg-[#fcfdfc] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Create New <span className="text-emerald-600">User</span>
          </h2>
          <p className="text-gray-400 font-medium mt-2">Enter details to add a new member to the platform.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden shadow-inner">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-emerald-200" />
                )}
              </div>

              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-90"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                    />
                    {previewImage && (
                      <button
                        type="button"
                        onClick={() => handleDismissImage(onChange)}
                        className="absolute -top-2 -left-2 bg-white text-red-500 border border-red-100 rounded-xl p-1.5 shadow-sm hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Avatar</h4>
              <p className="text-xs text-gray-400 font-medium mt-1">PNG, JPG or GIF. Max 2MB.</p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InputField label="First Name" {...register("firstName")} error={errors.firstName?.message} placeholder="sabyata" />
            <InputField label="Last Name" {...register("lastName")} error={errors.lastName?.message} placeholder="karki" />
            <InputField label="Email" {...register("email")} error={errors.email?.message} placeholder="email@freshcart.com" icon={<Mail size={20} />} mdColSpan />
            <InputField label="Username" {...register("username")} error={errors.username?.message} placeholder="sabyataaaa" mdColSpan />
            <InputField label="Password" {...register("password")} error={errors.password?.message} placeholder="••••••••" type="password" icon={<Lock size={20} />} />
            <InputField label="Confirm Password" {...register("confirmPassword")} error={errors.confirmPassword?.message} placeholder="••••••••" type="password" icon={<Lock size={20} />} />
          </div>

          {/* Submit */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || pending}
              className="w-full md:w-auto px-12 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isSubmitting || pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus size={20} /><span>Create User Account</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Input Component
function InputField({ label, error, icon, mdColSpan = false, ...props }: any) {
  return (
    <div className={`space-y-2 ${mdColSpan ? 'md:col-span-2' : ''}`}>
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>}
        <input
          {...props}
          className={`w-full h-14 px-5 ${icon ? 'pl-14' : ''} pr-5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{error}</p>}
    </div>
  );
}
