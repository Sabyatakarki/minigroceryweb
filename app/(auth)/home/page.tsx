import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-lg shadow-md text-center w-full max-w-sm">
        
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Fresh Picks
        </h1>

        <p className="text-gray-600 mb-8">
          Welcome! Please login or create an account to continue.
        </p>

        {/* BUTTONS */}
        <div className="space-y-6">
          
          {/* LOGIN */}
          <Link href="/login" className="block">
            <button className="w-full h-11 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition">
              Login
            </button>
          </Link>

          {/* REGISTER */}
          <Link href="/register" className="block">
            <button className="w-full h-11 rounded-md border border-green-600 text-green-600 font-semibold hover:bg-green-50 transition">
              Register
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
