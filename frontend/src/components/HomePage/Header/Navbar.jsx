import { AlignLeft, ChevronDown, Heart, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../../../utils/styles";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import DropDown from "./DropDown";
import { categoriesData } from "../../../utils/constants";

const navigationLink = [
  { title: "Home", link: "/" },
  { title: "Best Selling", link: "/best-selling" },
  { title: "Products", link: "/products" },
  { title: "Events", link: "/events" },
  { title: "FAQ", link: "/faq" },
];

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <nav className="bg-primary text-white">
      <div
        className={`${styles.section} mx-auto hidden min-[800px]:flex items-center justify-between py-4`}
      >
        {/* Categories */}
        <div className="relative max-[900px]:hidden">
          <button
            onClick={() => setDropDown(!dropDown)}
            className="flex font-medium w-60 text-lg items-center bg-white text-black px-4 py-2 rounded-md"
          >
            <AlignLeft className="h-6 w-6 mr-3" />
            All Categories
            <span className="ml-8">
              <ChevronDown />
            </span>
          </button>
          {dropDown ? (
            <DropDown
              categoriesData={categoriesData}
              setDropDown={setDropDown}
            />
          ) : null}
        </div>

        {/* Menu */}
        <div>
          <ul className="flex items-center ">
            {navigationLink.map((item, index) => (
              <Link key={index} to={item.link}>
                <li
                  onClick={() => setActive(item.link)}
                  className={`mx-4 ${
                    item.link === active ? "text-green-400" : ""
                  } font-medium`}
                >
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Icons */}
        <div className="flex gap-2 items-center">
          <Link to={"/wishlist"}>
            <div className="relative mx-2">
              <Heart size={25} />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </div>
          </Link>
          <Link to={"/cart"}>
            <div className="relative mx-2">
              <ShoppingCart size={25} />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </div>
          </Link>
          <div className="mx-2">
            <Link to={"/login"}>
              <CgProfile size={27} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
