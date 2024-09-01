import React, { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";
import backgroundImage from "../images/Earth.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleEmail = (e) => {
    setInput({ ...input, email: e.target.value });
  };
  const handlePassword = (e) => {
    setInput({ ...input, password: e.target.value });
  };
  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = input;
    if (!email) {
      setError({ ...error, email: "Email can't be empty" });
      return;
    }
    if (!password) {
      setError({ ...error, password: "Password can't be empty" });
      return;
    }
  };

  return (
    <div className="font-sans select-none w-full my-20 flex justify-center items-center">
      <div className="w-[55%] flex h-[70vh] shadow-2xl rounded-md">
        {/* left */}
        <form className="bg-white rounded-l-md h-full w-[50%] h-full flex items-center justify-center flex-col gap-3 px-12">
          <h1 className="text-2xl font-semibold text-black">Login</h1>
          <input
            className="bg-[#E5E5E5] w-full rounded-sm p-2 outline-black"
            type="text"
            placeholder="Email"
            onChange={handleEmail}
          />
          <div className="w-full bg-[#E5E5E5] rounded-sm px-2 outline-black flex items-center justify-between">
            <input
              placeholder="Password"
              className="bg-transparent py-2 outline-none"
              type={passwordVisibility ? "text" : "password"}
              onChange={handlePassword}
            />
            {passwordVisibility ? (
              <MdOutlineRemoveRedEye onClick={handlePasswordVisibility} />
            ) : (
              <IoEyeOffOutline onClick={handlePasswordVisibility} />
            )}
          </div>
          <button className="bg-[#FF3208] text-white rounded-full px-8 py-2 font-medium">
            Login
          </button>
        </form>
        {/* right */}
        <div
          className="bg-black text-center text-white px-12 rounded-r-md w-[50%] flex flex-col items-center justify-center gap-3"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "100%",
          }}
        >
          <h1 className="text-2xl font-semibold">Hello, Friend!</h1>
          <p className="text-[#7E7E7E]">
            Enter your loginn details and Enjoy our services
          </p>
          <Link to={"/signup"}>
            <button className="bg-transparent text-white border px-8 py-1.5 font-medium rounded-full">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
