import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-4 border-b border-green-700">
        
        {/* Logo */}
        <h1 className="text-2xl font-semibold text-green-700 font-[cursive]">
          Fresh Picks
        </h1>

        {/* Nav links */}
        <nav className="flex gap-20 text-sm font-medium text-green-700">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About us</a>
          <a href="#" className="hover:underline">Categories</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>

        {/* Profile avatar → Profile page */}
        <Link href="/profile">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-green-600"
          />
        </Link>

      </header>

      <main className="p-10">
        {/* dashboard content */}
      </main>
    </div>
  );
}
