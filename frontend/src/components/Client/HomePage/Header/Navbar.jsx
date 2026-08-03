import { Link, useLocation, useNavigate } from "react-router-dom";
import DropDown from "./DropDown";
import {
  AlignLeft,
  ChevronDown,
  Heart,
  LogOut,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { navigationLink } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../../../utils/styles";
import { BACKEND_USER } from "../../../../utils/constants";
import { setUser } from "../../../../redux/userSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("touchstart", closeProfileMenu);

    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("touchstart", closeProfileMenu);
    };
  }, []);

  const closeDropDown = () => {
    setDropDown(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_USER}/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error while logging out:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setUser(null));
      setIsProfileMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/login");
    }
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
        <div ref={profileMenuRef} className="relative mx-2">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                className="block rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Open account menu"
                aria-expanded={isProfileMenuOpen}
              >
                <img
                  className="h-10 w-10 object-cover rounded-full object-center"
                  src={user?.avatar || "/Photo.png"}
                  alt="Profile"
                />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 z-30 w-32 rounded-md bg-white py-1 text-sm text-gray-700 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <UserRound size={16} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:outline-none"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </>
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
