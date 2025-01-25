import { useState } from "react";
import { authStore } from "../store/authStore.js";
import { EyeOff, MessageSquare, Eye, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/authImagePattern.jsx";


const initialState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { login, isLoggingIn } = authStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);


  const handleSubmit = async (event) => {
    event.preventDefault();
    login(formData);
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">
                Login to your account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-7">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Email"
                value={formData.email}
                onChange={(event) => {
                  setFormData({ ...formData, email: event.target.value });
                }}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={`${showPassword ? "text" : "password"}`}
                className="grow"
                placeholder="Password"
                value={formData.password}
                onChange={(event) => {
                  setFormData({ ...formData, password: event.target.value });
                }}
              />
              <button
                type="button"
                className="h-4 w-4 "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </label>
            <button
              className="btn btn-outline w-full bg-primary"
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader className="size-6 animate-spin" />
                  <span className="font-semibold">Loading...</span>
                </>
              ) : (
                <span className=" text-black font-semibold">Login</span>
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/register" className="link link-primary">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}
