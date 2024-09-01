import React from "react";
import Logo from "../images/Online-Shop.png";
import Search from "../images/search.svg";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const categories = [
    { title: "Computer", path: "" },
    { title: "Clots", path: "" },
    { title: "Shoes", path: "" },
    { title: "Mobiles", path: "" },
    { title: "Headphones", path: "" },
    { title: "Gift", path: "" },
  ];

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    { title: "Best Selling", path: "/best-selling" },
    { title: "Contact", path: "/contact" },
  ];

  const options = [
    {
      title: "Wishlist",
      component: <FaRegHeart className="text-[1.7rem]" />,
      value: "1",
    },
    {
      title: "Cart",
      component: <IoCart className="text-[2rem]" />,
      value: "4",
    },
    {
      title: "Profile",
      component: <CgProfile className="text-[2rem]" />,
    },
  ];
  return (
    <>
      <div className="w-full flex justify-between items-center py-4 px-8">
        <div>
          <img className="w-28" src={Logo} alt="" />
        </div>
        <div className="flex justify-between items-center rounded-md border-2 px-3 py-1 border-[#BCE3C9]">
          <div className="group inline-block">
            <button
              aria-haspopup="true"
              aria-controls="menu"
              className="relative w-full group-hover:rounded-b-none rounded-md flex items-center "
            >
              <span className="font-semibold flex-1 px-2 ">All Categories</span>
              <span>
                <IoIosArrowDown className="group-hover:-rotate-180 transition-all duration-300 ease-in-out" />
              </span>
              <ul
                id="menu"
                aria-hidden="true"
                className="bg-white w-full left-0 top-10 text-start text-black shadow-md font-medium text-base rounded-t-none rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out  "
              >
                {categories.map((item, index) => (
                  <li className="rounded-sm px-2 py-2 font-bold transition duration-500 ease-in-out  text-[#3BB77E] hover:bg-gray-200 cursor-pointer hover:text-black">
                    {item.title}
                  </li>
                ))}
              </ul>
            </button>
          </div>
          <span className="border-l-2 border-[#7E7E7E] mx-3 py-2"></span>
          <input
            type="text"
            placeholder="Search for item... "
            className="bg-transparent w-[25rem] py-2 outline-none  "
          />
          <IoSearchOutline className="text-[1.5rem]" />
        </div>
        <div className="flex gap-4 items-center ">
          <div className="flex items-center gap-3">
            {options.map((item, index) =>
              item.value ? (
                <div
                  key={index}
                  className="relative group flex items-end gap-2 hover:text-[#3BB77E] transition duration-500 ease-in-out cursor-pointer"
                >
                  <p className="absolute left-5 bottom-7 text-xs rounded-full text-center px-2 py-1 text-white bg-[#3BB77E]">
                    {item.value}
                  </p>
                  <p className="">{item.component}</p>
                  <p className="text-[#7E7E7E] group-hover:text-[#3BB77E] transition duration-500 ease-in-out cursor-pointer">
                    {" "}
                    {item.title}
                  </p>
                </div>
              ) : (
                <div key={index} className="relative group flex items-end gap-2 hover:text-[#3BB77E] transition duration-500 ease-in-out cursor-pointer">
                  {item.component}
                  <p className="text-[#7E7E7E] group-hover:text-[#3BB77E] transition duration-500 ease-in-out cursor-pointer"> {item.title}</p>
                </div>
              )
            )}
          </div>
        </div>
        <Link to={"/login"}>
          <button className="text-lg bg-[#3BB77E] text-white rounded-md px-4 py-1.5 font-medium">
            Login{" "}
          </button>
        </Link>
      </div>
      <div className="flex justify-between items-center px-8 py-4 bg-[#222E3D] text-white">
        <div>
          <ul className="flex gap-5 items-center font-semibold text-lg">
            {navigation.map((item, index) => (
              <Link to={item.path}>
                <li className="cursor-pointer transition duration-500 ease-in-out hover:text-[#3BB77E]">
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
