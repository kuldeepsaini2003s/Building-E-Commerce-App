import { useActionState, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../utils/styles";
import useResponseHandler from "../../../hooks/useResponseHandler";
import { BACKEND_USER } from "../../../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";

const Login = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const [formData, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData?.get("email") || previousState?.email || "";
      const password =
        formData?.get("password") || previousState?.password || "";

      const toastId = toast.loading("Verifying your credentials...");

      try {
        const { status, data } = await axios.post(BACKEND_USER + "/login", {
          email,
          password,
        });

        if (status === 200) {
          handleResponse({
            status: status,
            message: data.msg,
            toastId,
            showToast: true,
            onSuccess: () => {
              dispatch(setUser(data?.data));
              localStorage.removeItem("shopAccessToken");
              localStorage.setItem("accessToken", data?.accessToken);
              localStorage.setItem("refreshToken", data?.refreshToken);
              navigate("/");
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message:
            error?.response?.data?.msg ||
            "Something went wrong please try again...",
        });
        return { email, password };
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto place-items-center sm:w-full sm:max-w-md">
        <Link to={"/"}>
          <img src="/logo.svg" alt="" />
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form action={submitAction} className="space-y-6">
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
            <div className={`${styles.normalFlex} justify-between`}>
              <div className={`${styles.normalFlex}`}>
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <Link
                to={"/forget-password"}
                className={`${
                  isPending ? "cursor-not-allowed" : "cursor-pointer"
                } font-medium text-blue-600 hover:text-blue-500 text-sm`}
              >
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              } group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700`}
            >
              Submit
            </button>
            <button
              disabled={isPending}
              className={`${styles.normalFlex} w-full`}
            >
              <h4>Not have any account?</h4>
              <Link to="/sign-up" className="text-blue-600 pl-2">
                Sign Up
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
