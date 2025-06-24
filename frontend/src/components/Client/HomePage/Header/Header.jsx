import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import styles from "../../../../utils/styles";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { cart: cartItems } = useSelector((state) => state.cart);
  const { shop } = useSelector((state) => state.shop);
  const { pathname } = useLocation();
  const navigationLink = [
    { title: "Home", link: "/" },
    { title: "Best Selling", link: "/best-selling" },
    { title: "Products", link: "/products" },
    { title: "Events", link: "/events" },
    { title: "Cart", link: "/cart" },
    { title: "Wishlist", link: "/wishlist" },
    { title: "FAQ", link: "/faq" },
    {
      title: shop ? "Seller Dashboard" : "Become Seller",
      link: `${shop ? "/dashboard" : "/create-shop"}`,
    },
    { title: "Login", link: "/login" },
  ];

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden min-[800px]:flex items-center justify-between">
          <div>
            <Link to="/">
              <img src="/logo.svg" alt="" />
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              // value={searchTerm}
              // onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {/* {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null} */}
          </div>

          <Link
            to={`${shop ? "/dashboard" : "/create-shop"}`}
            className="text-[#fff] px-3 gap-2 bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
          >
            <h1>{shop ? "Seller Dashboard" : "Become Seller"}</h1>
            <IoIosArrowForward size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile Screen Header */}
      <div
        className={`${styles.section} px-2 w-full py-2 bg-[#fff] z-50 sticky inset-0 shadow-sm min-[800px]:hidden`}
      >
        <div className="w-full  flex items-center justify-between">
          <BiMenuAltLeft size={40} onClick={() => setOpen(!open)} />
          <Link to="/">
            <img src="/logo.svg" alt="" className="cursor-pointer" />
          </Link>
          <Link to={"/cart"}>
            <div className="relative">
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cartItems?.length}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {open && (
        <div
          onClick={handleToggleSidebar}
          className={`${
            open ? "active " : ""
          }slider min-[800px]:hidden w-dvw h-svh z-10 bg-black/50`}
        ></div>
      )}
      <div
        className={`${
          open ? "active" : ""
        } min-[800px]:hidden slider bg-white w-72 p-4 h-svh`}
      >
        <div className="flex justify-between items-center">
          <img src="/logo.svg" className="cursor-pointer" alt="Logo" />
          <X
            size={25}
            onClick={handleToggleSidebar}
            className="cursor-pointer"
          />
        </div>
        <ul className="flex flex-col gap-5 mt-5 ">
          {navigationLink?.map((item, index) => (
            <Link key={index} to={item.link}>
              <li
                key={index}
                onClick={() => {
                  setActive(item.link);
                  handleToggleSidebar();
                }}
                className={`${
                  item.link === active ? "text-green-400" : ""
                } font-medium`}
              >
                {item?.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <Navbar />
    </>
  );
};

export default Header;
