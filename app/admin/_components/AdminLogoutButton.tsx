"use client";

import { useRouter } from "next/navigation";

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export default function AdminLogoutButton() {
  const router = useRouter();

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("user_data");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="rounded-lg border border-emerald-600 bg-white px-5 py-2 text-emerald-700 font-medium transition-colors hover:bg-emerald-600 hover:text-white active:bg-emerald-700"
    >
      Logout
    </button>
  );
}