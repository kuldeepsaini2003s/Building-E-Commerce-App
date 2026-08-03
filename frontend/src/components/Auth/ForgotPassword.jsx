import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = ({ apiBaseUrl, accountLabel, loginPath }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isPending, setIsPending] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const { data } = await axios.post(`${apiBaseUrl}/forgotPassword`, { email });
      setResetToken(data.resetToken);
      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to send the OTP.");
    } finally {
      setIsPending(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const { data } = await axios.post(
        `${apiBaseUrl}/resetPassword`,
        { activation_otp: otp, password },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      toast.success(data.msg);
      navigate(loginPath);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to reset the password.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img src="/logo.svg" alt="E-commerce home" />
        </Link>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            {resetToken
              ? "Enter the OTP from your email and choose a new password."
              : `Enter the email for your ${accountLabel} account to receive an OTP.`}
          </p>

          {!resetToken ? (
            <form onSubmit={requestOtp} className="mt-6 space-y-6">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-[40px] rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="mt-6 space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="OTP"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-[40px] rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed"
              >
                {isPending ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}

          <Link to={loginPath} className="block mt-5 text-center text-sm text-blue-600">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
