// app/(auth)/login/page.tsx
import LoginForm from "../_components/loginform";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Log in to get back to your account
          </p>

          <LoginForm />
        </div>
      </div>

      
      <div className="hidden lg:flex items-center justify-center bg-white-50">
        <img
          src="/loginImage.jpg"
          alt="Grocery illustration"
          className="max-w-lg"
        />
      </div>
    </div>
  );
}
/////
