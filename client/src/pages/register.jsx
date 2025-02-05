import { useRef, useState } from "react";
import { authStore } from "../store/authStore";
import { EyeOff, MessageSquare, Eye, Loader } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import AuthImagePattern from "../components/authImagePattern";
import { toast } from 'react-toastify'


const initialState = {
  fullName: "",
  email: "",
  password: "",
};
export default function RegisterPage() {
  const { register, sendOtp, isSendingOtp, verifyOtp } = authStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpVerification = async () => {
    const givenOTP = otp.join("");
    const result = await verifyOtp(formData, givenOTP);
    if (result.message === "OTP verified successfully") {
      register(formData);
    } else {
      toast.error(result.message);
    }
    setOtp(["", "", "", "", "", ""])
  }

  function validateEmailDomain(email) {

    const gmailRegex = /^[^@]+@gmail\.com$/;

    const yahooRegex = /^[^@]+@yahoo\.com$/;

    const iiitRanchiRegex = /^[^@]+@iiitranchi\.ac\.in$/;

    return gmailRegex.test(email) || yahooRegex.test(email) || iiitRanchiRegex.test(email);

}

  const isFormValid = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter full name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter email");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Please enter password");
      return false;
    }
    if (formData.password.trim().length < 6) {
      toast.error("Password must have at least 6 characters");
      return false;
    }
    if(!validateEmailDomain(formData.email)){
      toast.error("Only Gmail, yahoo and iiitranchi emails allowed");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await isFormValid();
    if (isValid) {
      await sendOtp(formData);
      document.getElementById('my_modal_1').showModal();
    }
  };

  // console.log(formData, "formData");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 ">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
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
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(event) => {
                  setFormData({ ...formData, fullName: event.target.value });
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
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
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
              className="btn btn-primary w-full"
              type="submit"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? (
                <>
                  <Loader className="size-6 animate-spin" />
                  <span className="font-semibold">Sending OTP...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
      <dialog id="my_modal_1" className="modal">
        <div className=" flex items-center justify-center bg-gray-200 rounded-lg">
          <div className="w-full max-w-md p-6 rounded-lg bg-gray-300 shadow-md">
            <p className="h-8 mx-10  bg-gray-400 mb-3 rounded-lg">
              <h3 className="text-center font-extrabold text-gray-700 mb-4 mx-10 py-1">
                VERIFY OTP
              </h3>
            </p>

            <p className="text-center text-gray-800 mb-6">
              Please enter the 6 digit OTP sent to your email ID
            </p>
            <form>
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="size-12 text-center text-black text-xl rounded bg-gray-100"
                  />
                ))}
              </div>
              <p className="text-center text-gray-800 mb-6">
              Valid for 5 mins only
            </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn mr-3 btn-error" onClick={() => setOtp(["", "", "", "", "", ""])}>Close</button>
                  <button className="btn btn-success" onClick={handleOtpVerification}>Proceed</button>
                </form>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
