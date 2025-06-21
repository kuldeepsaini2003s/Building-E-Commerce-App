import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", link: "/dashboard", icon: RxDashboard },
  { name: "All Orders", link: "/dashboard-orders", icon: FiShoppingBag },
  { name: "All Products", link: "/dashboard-products", icon: FiPackage },
  {
    name: "Create Product",
    link: "/dashboard-create-product",
    icon: AiOutlineFolderAdd,
  },
  {
    name: "All Events",
    link: "/dashboard-events",
    icon: MdOutlineLocalOffer,
  },
  { name: "Create Event", link: "/dashboard-create-event", icon: VscNewFile },
  {
    name: "Withdraw Money",
    link: "/dashboard-withdraw-money",
    icon: CiMoneyBill,
  },
  { name: "Discount Codes", link: "/dashboard-coupons", icon: AiOutlineGift },
  {
    name: "Refunds",
    link: "/dashboard-refunds",
    icon: HiOutlineReceiptRefund,
  },
  { name: "Settings", link: "/settings", icon: CiSettings },
];

const DashboardSideBar = () => {
  const [active, setActive] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <div className="h-full overflow-y-scroll remove-scrollbar bg-white shadow-sm border-r border-gray-400 sticky top-0 left-0 z-10">
      {navigation.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = active === item.link;

        return (
          <div key={index} className="w-full px-4 py-3.5">
            <Link
              onClick={() => setActive(item?.link)}
              to={item.link}
              className="w-full flex gap-1 items-center"
            >
              <IconComponent
                size={20}
                className={`${isActive ? "text-[crimson]" : "text-[#555]"}`}
              />
              <h5
                className={`hidden min-[800px]:block pl-2  font-[400] ${
                  isActive ? "text-[crimson]" : "text-[#555]"
                }`}
              >
                {item.name}
              </h5>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSideBar;
