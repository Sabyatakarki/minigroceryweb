"use server";

import { register, login, whoami, updateProfile } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleRegister = async (formData: any) => {
  try {
    const result = await register(formData);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: "Registration successful",
      data: result.data,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Registration failed" };
  }
};

export const handleLogin = async (formData: any) => {
  try {
    const result = await login(formData);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message || "Login failed",
      };
    }

    await setAuthToken(result.token);
    await setUserData(result.data);

    redirect("/dashboard");
  } catch (err: any) {
    return { success: false, message: err.message || "Login failed" };
  }
};

export const handleWhoAmI = async (formData: any) => {
  try {
    const result = await whoami(formData);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch user",
      };
    }

    return { success: true, data: result.data };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const handleUpdateProfile = async (formData: any) => {
  try {
    const result = await updateProfile(formData);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update profile",
      };
    }

    await setUserData(result.data);
    revalidatePath("/user/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      data: result.data,
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  redirect("/login");
};
