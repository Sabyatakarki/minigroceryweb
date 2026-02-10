import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function CreateUserButton() {
  return (
    <div className="bg-white p-4">
      <Link 
        href="/admin/users/create"
        className="inline-flex items-center gap-3 bg-white border-2 border-emerald-100 hover:border-emerald-500 text-emerald-600 px-6 py-3 rounded-2xl transition-all group active:scale-95 shadow-sm"
      >
        <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
        <span className="font-bold text-sm uppercase tracking-wide">Create New User</span>
      </Link>
    </div>
  );
}