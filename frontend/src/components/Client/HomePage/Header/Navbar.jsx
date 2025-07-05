import { Link, useLocation } from "react-router-dom";
import DropDown from "./DropDown";
import { AlignLeft, ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { navigationLink } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import styles from "../../../../utils/styles";

const Navbar = () => {
  const [dropDown, setDropDown] = useState(false);

  return (
    <nav className="sticky top-0 z-20 shadow-md bg-primary text-white">
      <div
        className={`${styles.section} mx-auto hidden min-[800px]:flex items-center justify-between py-4`}
      >
        <CategoryButton dropDown={dropDown} setDropDown={setDropDown} />
        <NavigationLinks setDropDown={setDropDown} />
        <LinkIcons setDropDown={setDropDown} />
      </div>
    </nav>
  );
};

export default Navbar;

export const CategoryButton = ({ dropDown, setDropDown }) => {
  return (
    <>
      <div className="relative max-[900px]:hidden">
        <button
          onClick={() => setDropDown(!dropDown)}
          className={`flex font-medium text-lg w-[16rem] justify-between items-center bg-white text-black p-2 ${
            dropDown ? "rounded-t-md" : "rounded-md"
          }`}
        >
          <div className="flex gap-3 items-center">
            <AlignLeft className="h-5 w-5" />
            <span>All Categories</span>
          </div>
          <ChevronDown />
        </button>
        {dropDown ? <DropDown setDropDown={setDropDown} /> : null}
      </div>
    </>
  );
};

export const NavigationLinks = ({ setDropDown }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState(null);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <>
      <ul className="flex gap-5 items-center ">
        {navigationLink.map((item, index) => (
          <Link key={index} to={item?.link}>
            <li
              key={index}
              onClick={() => {
                setActive(item.link);
                setDropDown(false);
              }}
              className={`${
                item.link === active ? "text-green-400" : ""
              } font-medium`}
            >
              {item.title}
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export const LinkIcons = ({ setDropDown }) => {
  const { cart: cartItems } = useSelector((state) => state?.cart);
  const { wishlist: wishlistItems } = useSelector((state) => state?.wishlist);
  const { user } = useSelector((state) => state?.user);

  const closeDropDown = () => {
    setDropDown(false);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Link onClick={closeDropDown} to={"/wishlist"}>
          <div className="relative mx-2">
            <Heart size={25} />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistItems?.length}
            </span>
          </div>
        </Link>
        <Link onClick={closeDropDown} to={"/cart"}>
          <div className="relative mx-2">
            <ShoppingCart size={25} />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems?.length}
            </span>
          </div>
        </Link>
        <div className="mx-2">
          {user ? (
            <img
              className="h-10 w-10 object-cover rounded-full object-center"
              src={user?.avatar}
              alt=""
            />
          ) : (
            <Link to={"/login"}>
              <CgProfile size={27} />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
