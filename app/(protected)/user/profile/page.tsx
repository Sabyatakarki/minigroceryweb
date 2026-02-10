"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
};

type TabKey = "personal" | "security";

function safeParseJSON<T>(value: string | null): T | null {
  if (!value || value === "undefined" || value === "null") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [user, setUser] = useState<StoredUser | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "********",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = useMemo(
    () => user?.fullName || user?.username || "User",
    [user]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    const parsed = safeParseJSON<StoredUser>(rawUser);
    if (!parsed) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    setUser(parsed);
    setForm({
      fullName: parsed.fullName || "",
      username: parsed.username || "",
      email: parsed.email || "",
      phoneNumber: parsed.phoneNumber || "",
      password: "********",
    });
  }, [router]);

  const discardChanges = () => {
    if (!user) return;
    setMessage(null);
    setIsError(false);
    setForm({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "********",
    });
  };

  const saveChanges = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const updatedUser: StoredUser = {
        ...user,
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsError(false);
      setMessage("Changes saved successfully.");
    } catch {
      setIsError(true);
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-10 py-4 border-b border-green-200 bg-white/70 backdrop-blur">
        <h1 className="text-2xl font-extrabold text-green-700 tracking-wide">
          Mini Grocery
        </h1>

        <nav className="flex gap-14 text-sm font-semibold text-green-700">
          <Link href="/dashboard" className="hover:underline">
            Home
          </Link>
          <a href="#about" className="hover:underline">
            About us
          </a>
          <a href="#Categories" className="hover:underline">
            Menu
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
        </nav>

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3"
        >
          <Image
            src="/profile.png"
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-green-500"
            priority
          />
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        <div className="h-[calc(100vh-72px)] w-full px-6 py-6">
          <div className="h-full w-full grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* LEFT SIDEBAR */}
            <aside className="lg:col-span-3 h-full">
              <div className="h-full rounded-3xl bg-white shadow-lg border border-green-100 p-6 flex flex-col">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-green-100 overflow-hidden flex items-center justify-center shadow">
                      <Image
                        src={user?.profileImage || "/profile.png"}
                        alt="Profile"
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                        priority
                      />
                    </div>

                    <button
                      type="button"
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow hover:opacity-90"
                      title="Edit photo (UI only)"
                      onClick={() => {
                        setIsError(false);
                        setMessage("Photo upload can be added later.");
                      }}
                    >
                      ✎
                    </button>
                  </div>

                  <div className="mt-4 text-xl font-extrabold text-green-800">
                    {displayName}
                  </div>
                  <div className="mt-1 text-sm text-green-900/60">
                    {user?.email || ""}
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("personal")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold border ${
                      activeTab === "personal"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-white border-transparent text-green-900/70 hover:bg-green-50"
                    }`}
                  >
                    👤 Personal Information
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold border ${
                      activeTab === "security"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-white border-transparent text-green-900/70 hover:bg-green-50"
                    }`}
                  >
                    🔒 Login & Password
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>

                <div className="flex-1" />
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <section className="lg:col-span-9 h-full">
              <div className="h-full rounded-3xl bg-white shadow-lg border border-green-100 p-8 flex flex-col">
                {message && (
                  <div
                    className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                      isError
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-extrabold text-green-800">
                    {activeTab === "personal"
                      ? "Personal Information"
                      : "Login & Password"}
                  </h2>
                  <p className="mt-1 text-sm text-green-900/60">
                    Update your account details here.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {activeTab === "personal" ? (
                    <>
                      <Field
                        label="Full Name"
                        value={form.fullName}
                        onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                      />
                      <Field
                        label="Username"
                        value={form.username}
                        onChange={(v) => setForm((p) => ({ ...p, username: v }))}
                      />
                      <Field
                        label="Email"
                        value={form.email}
                        onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                        type="email"
                      />
                      <Field
                        label="Phone Number"
                        value={form.phoneNumber}
                        onChange={(v) =>
                          setForm((p) => ({ ...p, phoneNumber: v }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        label="Email"
                        value={form.email}
                        onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                        type="email"
                      />
                      <Field
                        label="Password"
                        value={form.password}
                        onChange={(v) => setForm((p) => ({ ...p, password: v }))}
                        type="password"
                        helper="Password is masked for security."
                      />
                    </>
                  )}
                </div>

                <div className="flex-1" />

                <div className="mt-10 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={discardChanges}
                    className="h-12 rounded-full border border-green-300 px-8 text-sm font-semibold text-green-800 hover:bg-green-50"
                  >
                    Discard Changes
                  </button>

                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={saving}
                    className="h-12 rounded-full bg-green-600 px-10 text-sm font-extrabold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-green-900">Logout</h3>
            <p className="mt-2 text-sm text-green-900/70">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-11 rounded-xl border border-green-200 text-green-900 font-semibold hover:bg-green-50"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-green-900/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="h-12 rounded-2xl border border-green-200 bg-green-50/40 px-4 text-sm text-green-900 outline-none focus:ring-2 focus:ring-green-300"
        placeholder={label}
      />
      {helper && <p className="text-xs text-green-900/60">{helper}</p>}
    </div>
  );
}