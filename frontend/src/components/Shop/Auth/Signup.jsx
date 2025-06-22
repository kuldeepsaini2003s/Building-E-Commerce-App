import { useActionState, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../utils/styles";
import { useDispatch } from "react-redux";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { setUser } from "../../../redux/userSlice";
import { BACKEND_SHOP } from "../../../utils/constants";
import { setShop } from "../../../redux/shopSlice";

const SingUpShop = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState("/Photo.png");
  const [verificationSection, setVerificationSection] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const [formData, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData?.get("name") || previousState?.name || "";
      const email = formData?.get("email") || previousState?.email || "";
      const address = formData?.get("address") || previousState?.address || "";
      const phone = formData?.get("phone") || previousState?.phone || "";
      const pinCode = formData?.get("pinCode") || previousState?.pinCode || "";
      const password =
        formData?.get("password") || previousState?.password || "";

      const payload = new FormData();

      payload.append("name", name);
      payload.append("email", email);
      payload.append("password", password);
      payload.append("address", address);
      payload.append("phone", phone);
      payload.append("pinCode", pinCode);
      payload.append("avatar", file);

      const toastId = toast.loading("Creating your account...");

      try {
        const { status, data } = await axios.post(
          BACKEND_SHOP + "/createShop",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (status === 200) {
          handleResponse({
            status: status,
            message: data.msg,
            toastId,
            showToast: true,
            onSuccess: () => {
              sessionStorage.setItem("activationToken", data?.activationToken);
              setVerificationSection(true);
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message: error?.response?.data?.msg || "Failed to create user.",
        });
        return { name, email, password, address, pinCode, phone };
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto place-items-center sm:w-full sm:max-w-md">
        <Link to={"/"}>
          <img src="/logo.svg" alt="" />
        </Link>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          {verificationSection ? "OTP Verification" : "Register as a seller"}
        </h2>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-md rounded-lg sm:px-10">
          {!verificationSection ? (
            <form action={submitAction} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shop Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={formData?.name}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="phone"
                    autoComplete="number"
                    required
                    value={formData?.phone}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={formData?.email}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    autoComplete="address"
                    required
                    value={formData?.address}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pinCode"
                    inputMode="numeric"
                    pattern="\d{6}"
                    autoComplete="name"
                    minLength={6}
                    maxLength={6}
                    required
                    value={formData?.pinCode}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={formData?.password}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {visible ? (
                    <AiOutlineEye
                      className="absolute right-2 top-2 cursor-pointer"
                      size={25}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-2 top-2 cursor-pointer"
                      size={25}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <div className="mt-2 flex items-center">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <RxAvatar className="h-8 w-8" />
                    )}
                  </span>
                  <label
                    htmlFor="file-input"
                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileInputChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className={`${
                  isPending ? "cursor-not-allowed" : "cursor-pointer"
                } group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700`}
              >
                Submit
              </button>
              <div className={`${styles.normalFlex} w-full`}>
                <h4>Already have an shop account?</h4>
                <Link to="/login-shop" className="text-blue-600 pl-2">
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <OTPVerification />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingUpShop;

const OTPVerification = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const otp = formData.get("otp") || previousState?.otp || "";

      const toastId = toast.loading("Verifying OTP, please wait...");

      try {
        const { status, data } = await axios.post(
          BACKEND_SHOP + "/verifyShop",
          { otp },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "activationToken"
              )}`,
            },
          }
        );

        if (status === 200) {
          handleResponse({
            status: status,
            message: data.msg,
            toastId,
            showToast: true,
            onSuccess: () => {
              dispatch(setShop(data?.data));
              sessionStorage.removeItem("activationToken");
              localStorage.setItem("accessToken", data?.accessToken);
              localStorage.setItem("refreshToken", data?.refreshToken);
              navigate("/dashboard");
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message: error?.response?.data?.msg || "Failed to create user.",
        });
        return { otp };
      }
    }
  );

  return (
    <form action={submitAction}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          OTP
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="otp"
            autoComplete="otp"
            required
            value={formData?.otp}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`group relative ${
          isPending ? "cursor-not-allowed" : "cursor-pointer"
        } w-full h-[40px] flex justify-center mt-5 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700`}
      >
        Submit
      </button>
    </form>
  );
};
