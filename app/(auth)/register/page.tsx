import RegisterForm from "../_components/registerform";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex items-center justify-center bg-white">
        <img
          src="/loginImage.jpg"
          alt="Fresh Picks Illustration"
          className="max-w-lg"
        />
      </div>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Create Account
          </h1>

          <p className="text-gray-500 mb-8">
            Healthy Living Starts Here.
          </p>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}